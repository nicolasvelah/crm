/* eslint-disable no-underscore-dangle */
import io from 'socket.io-client';
import adapter from 'webrtc-adapter';
import Peer from 'simple-peer';
import auth from '../utils/auth';
import Get from '../utils/Get';
import { Dependencies } from '../dependency-injection';
import CRMRepository from '../data/repositories/CRM-repository';
import { decrypt } from '../utils/crypto';

export enum SignalingStatus {
  missingCode,
  connecting,
  connected,
  disconnected,
  error,
  calling,
  inCall,
}

export interface MediaStatus {
  microphone: boolean;
  camera: boolean;
}

export interface SignalingEvents {
  onStatus(status: SignalingStatus): void;
  onLocalStreamChanged(): void;
  onRemoteStreamChanged(): void;
  onMediaStatus(mediaStatus: MediaStatus): void;
  onRemoteStreamScreenChanged(): void;
  endScreen(): void;
  endCall(): void;
  messageReceiver(message: Message): void;
  offCameraRemote(): void;
}

export interface Message {
  message: string;
  date: string;
  isClient: boolean;
  type: 'file' | 'text';
}

export class Signaling {
  private wsHost!: string;
  private socket: SocketIOClient.Socket | null = null;
  private _localStream: MediaStream | undefined = undefined;
  private _remoteStream: MediaStream | undefined = undefined;

  /// share screen
  private _localStreamScreen: MediaStream | undefined = undefined;
  private _remoteStreamScreen: MediaStream | undefined = undefined;

  private _connected: boolean = false;
  private _mediaStatus: MediaStatus = { microphone: false, camera: false };

  /// Los eventos se pueden instanciar desde el componente <Vchat />
  /// si cambiamos algun evento podremos interactuar con el estado de <Vchat />
  events: SignalingEvents | null = null;
  private peer: Peer.Instance | null = null;
  private peerScreen: Peer.Instance | null = null;
  private config: any;
  private _status = SignalingStatus.connecting;

  private CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  get connected(): boolean {
    return this._connected;
  }

  get localStream(): MediaStream | undefined {
    return this._localStream;
  }

  get remoteStream(): MediaStream | undefined {
    return this._remoteStream;
  }

  get mediaStatus(): MediaStatus {
    return this._mediaStatus;
  }

  get status(): SignalingStatus {
    return this._status;
  }

  get remoteStreamShareScreen(): MediaStream | undefined {
    return this._remoteStreamScreen;
  }

  static create(config: { wsHost: string; config: any }): Signaling {
    const signaling = new Signaling();
    signaling.wsHost = config.wsHost;
    signaling.config = config.config;
    return signaling;
  }

  /// comienzo a emitir mi audio y video, o la pantalla
  /// En el proyecto tengo dos peers, uno para el audio y video, y el otro para la pantalla
  getPeer = (initiator: boolean, isShareScreen = false): Peer.Instance => {
    /// Si es la primera vez que comparto audio y video
    if (initiator) {
      //console.log('iniciando llamada', { isShareScreen, peer: this.peer });
    }

    /// si estoy compartiendo la pantalla y tengo un peerScreen activo
    if (isShareScreen && this.peerScreen) {
      return this.peerScreen;
    }

    /// Si estoy comparitendo mi audio y video y tengo un peer activo
    if (!isShareScreen && this.peer) return this.peer;

    /// inicio un nuevo peer con el stream corrrespondiente dependiendo que estoy compartiendo
    const peer = new Peer({
      initiator,
      stream: isShareScreen ? this._localStreamScreen : this._localStream,
      config: this.config,
      trickle: false,
    });

    /// evento del peer que me indica si estoy coenctado al peer
    peer.on('connect', (e) => {
      //console.log('peer connect:::', e);
    });

    /// evento del peer que me indica si estoy hubo algun error
    peer.on('error', (e) => {
      console.log('peer error:::', e);
      this._status = SignalingStatus.error;
    });

    /// evento del peer que me indica si estoy transmitiendo
    peer.on('signal', (data: any) => {
      //console.log('peer on signal::::', data);
      if (this.socket) {
        /// dependiendo que estoy conpariendo, emito un evento en los sockets
        /// donde notifico que estoy transmitiendo
        if (!isShareScreen) {
          this.socket.emit('signal', data);
        } else {
          this.socket.emit('signal-screen', data);
        }
      }
    });

    /// Evento del peer que oye el stream
    peer.on('stream', (stream: MediaStream) => {
      console.log('peer on stream::::', stream);
      /// Dependiendo de que nos este llegando guardamos el stream
      if (isShareScreen) {
        this._remoteStreamScreen = stream;
        if (this.events) {
          /// Notificaremos en <Vchat /> que ejecute el metodo onRemoteStreamScreenChanged
          this.events.onRemoteStreamScreenChanged();
        }
      } else {
        this._status = SignalingStatus.inCall;
        //console.log('peer on stream::::');
        this._remoteStream = stream;
        if (this.events) {
          /// Notificaremos en <Vchat /> que ejecute el metodo onRemoteStreamChanged
          this.events.onRemoteStreamChanged();
        }
      }
    });

    if (isShareScreen) {
      this.peerScreen = peer;
    } else {
      this.peer = peer;
    }

    return peer;
  };

  connect = async (code: string): Promise<boolean> => {
    /// Pedimos permiso de la camara y el audio
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 480, height: 640, facingMode: 'user' },
    });
    //console.log('Stream', stream);
    if (stream) {
      /// Nuestra propiedad tendra la data del stream
      this._localStream = stream;
      this._mediaStatus = { microphone: true, camera: true };
      /// nos conectamos al socket
      this.socket = io(this.wsHost, {
        query: {
          code,
          token: auth.wsToken,
        },
      });

      /// evento que nos indica que estamos coenctados a los ws
      this.socket.on('connected', async (data: any) => {
        console.log('ws connected::::', data);
        this._status = SignalingStatus.connected;
        if (this.events) {
          this.events.onStatus(SignalingStatus.connected);
          //this.getPeer(true);
          /// Cuando se inicia la llamada, directamente intento conectarme con el usuario,
          /// caso contrario me quedo en la sala de espera.
          //await this.joinToCall();
        }
      });

      /// Si paso algo con la conección del socket
      this.socket.on('error', (data: any) => {
        console.log('ws vchat error', data);
      });

      /// cuando me desconecto
      this.socket.on('disconnect', (data: any) => {
        console.log('ws vchat disconnected', data);
        this._status = SignalingStatus.disconnected;
      });

      /// escucho el evento 'joined' y se que alguien más se ha conectado
      this.socket.on('joined', async () => {
        console.log('joined');
        this.getPeer(true);
      });

      /// Escucho la notificacion que me indica que el otro usuario me esta transmitiendo
      this.socket.on('signal', async (data: any) => {
        //console.log('remote signal::::', data);
        const peer = this.getPeer(false);
        peer.signal(data);
      });

      /// escucho el evento 'joined-screen' y se que alguien más se ha conectado
      /// y está trnasmitiendo su pantalla
      this.socket.on('joined-screen', async () => {
        //this.getPeerShareScreen(true);
        //console.log('joined-screen');
        this.getPeer(true, true);
      });

      /// Escucho la notificacion que me indica que el otro usuario me esta transmitiendo su pantalla
      this.socket.on('signal-screen', async (data: any) => {
        //console.log('remote signal::::', data);
        const peer = this.getPeer(false, true);
        peer.signal(data);
      });

      /// Fin de la transmisión de la pantalla
      this.socket.on('end-screen', async (data: any) => {
        //console.log('end-screen::::', data);
        this.destroyScreen();
      });

      /// Fin de la llamada
      this.socket.on('end-call', async () => {
        console.log('end-call::::');
        this.destroyCall();
      });

      /// recibo un mensaje del chat
      this.socket.on('message', async (data: any) => {
        //console.log('Message::::', data);
        if (this.events) {
          this.events.messageReceiver(data);
        }
      });

      /// recibo la notificación para poner la pantalla en negro
      this.socket.on('off-camera', async () => {
        console.log('Entro off camera remote');
        if (this.events) {
          this.events.offCameraRemote();
        }
      });

      this.socket.on('reject-call', async (data: any) => {
        //console.log('reject-call::::', data);
        /* if (this.events) {
          this.events.messageReceiver(data);
        } */
      });
      return true;
    }
    alert('No se ha otorgado los permisos para iniciar una llamada');
    return false;
  };

  shareScreen = (stream: MediaStream) => {
    this._localStreamScreen = stream;
    //console.log('shareScreen', stream);
    if (this.socket) {
      this.socket.emit('join-screen');
      this.getPeer(false, true);
    }
  };

  /// Me uno a la llamada
  joinToCall = async (): Promise<void> => {
    if (this.socket != null) {
      /// Emito el evento 'join' para notificar a la otra parte que estoy conectandome
      this.socket.emit('join');
      /// Cambio de estado a llamando
      this._status = SignalingStatus.calling;
      if (this.events) {
        /// Renderizo un Loading para que sepa que se está llamando
        this.events.onStatus(SignalingStatus.calling);
      }
    }
  };

  /// Messages
  sendMessage = (message: Message) => {
    if (this.socket != null) {
      this.socket.emit('message-emitter', message);
    }
  };

  /// Desactivo o activo el audio
  onMute = (isVideoPreview?: boolean) => {
    if (this._localStream) {
      const { microphone } = this._mediaStatus;
      this._localStream.getAudioTracks()[0].enabled = !microphone;
      this._mediaStatus = { ...this._mediaStatus, microphone: !microphone };
      if (this.events && !isVideoPreview) {
        this.events.onMediaStatus(this._mediaStatus);
      }
    }
  };

  // desactivo o activo el video
  onCameraOff = async (isVideoPreview?: boolean) => {
    if (this._localStream) {
      const { camera, microphone } = this._mediaStatus;
      console.log('camera mediastatus', camera);
      if (camera) {
        /// apago la cámara
        this._localStream.getVideoTracks()[0].stop();
      } else {
        /// enciendo la cámara
        console.log('Entro new');
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: 480, height: 640, facingMode: 'user' },
        });
        const peer = this.getPeer(false);
        peer.removeStream(this._localStream); // delete previous local stream
        this._localStream = stream; // replace the local stream
        this._localStream.getAudioTracks()[0].enabled = microphone;
        peer.addStream(this._localStream); // add new stream to peer
      }
      if (this.events) {
        this.events.onLocalStreamChanged(); // notifi to the view
      }

      this._mediaStatus = { ...this._mediaStatus, camera: !camera };
      if (this.events) {
        this.events.onMediaStatus(this._mediaStatus);
      }

      if (this.socket && !isVideoPreview) {
        this.socket.emit('off-camera-emitter');
      }
    }
  };

  destroyScreen = (isEmitter?: boolean) => {
    if (this.peerScreen) {
      this.peerScreen.destroy();
      if (this._localStreamScreen) {
        const tracks = this._localStreamScreen.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        this._localStreamScreen = undefined;
      }
      this.peerScreen = null;
    }
    if (isEmitter && this.socket) {
      this.socket.emit('end-screen-emitter');
    }
    if (!isEmitter && this.socket) {
      if (this.events) {
        this.events.endScreen();
      }
    }
  };

  destroyCall = (isEmitter?: boolean) => {
    //console.log('destroyCall', { isEmitter: !!isEmitter });
    if (isEmitter && this.socket) {
      this.socket.emit('end-call-emitter');
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
      //console.log('destroyCall Peer destruido', this.peer);
    }

    // destroy peerScreen
    this.destroyScreen(isEmitter);

    if (!isEmitter && this.socket) {
      if (this.events) {
        this.events.endCall();
      }
    }
  };

  detroy = () => {
    //console.log('Entro destroy', this.peer);
    if (this.peer) {
      this.peer.destroy();
    }
    if (this._localStream) {
      const tracks = this._localStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }

    // destroy peerScreen
    //this.destroyScreen();

    this.destroyCall(true);

    ///Reset All
    this._localStream = undefined;
    this.socket = null;
    this._localStream = undefined;
    this._remoteStream = undefined;
    this._localStreamScreen = undefined;
    this._remoteStreamScreen = undefined;
    this._connected = false;
    this._mediaStatus = { microphone: false, camera: false };
    this.events = null;
    this.peer = null;
    this.peerScreen = null;
    this.config = null;
    this._status = SignalingStatus.connecting;
    //console.log('Fin destroy');
  };

  callToUser = async (): Promise<{
    errorCall: 'LINK_DONT_EXIST' | 'CANT_CALL_TO_USER' | null;
    ok: boolean;
  }> => {
    const link = localStorage.getItem('link');
    if (!link) {
      //history.push('/404');
      return { errorCall: 'LINK_DONT_EXIST', ok: false };
    }
    const dataDecrypt = decrypt(link!, true);
    //console.log('dataDecrypt', dataDecrypt);

    const respApi = await this.CRMRepository.apiCall(
      'POST',
      '/api/v1/videocall/call-user',
      {
        linkVchat: link,
      }
    );
    if (respApi && respApi.ok) {
      return { errorCall: null, ok: true };
      //message.success('Llamando al usuario');
    }
    return { errorCall: 'CANT_CALL_TO_USER', ok: true };
    //message.success('No se pudo llamar al usuario');
  };
}
