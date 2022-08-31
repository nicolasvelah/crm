import React, { Component } from 'react';
import { Spin, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import './scss/vchat-client.scss';

import {
  SignalingStatus,
  Signaling,
  SignalingEvents,
  MediaStatus,
  Message,
} from '../../libs/signaling';
import VideoPreview from './components/VideoPreviewClient';
/* import InCall from './components/InCall';
import ShareScreen from './components/ShareScreen';
import ShareScreenReceiver from './components/ShareScreenReceiver'; */
import InCall from './components/InCallClient';
import ShareScreen from '../Vchat/components/ShareScreen';
import ShareScreenReceiver from './components/ShareScreenReceiver';

import Get from '../../utils/Get';
import { Dependencies } from '../../dependency-injection';
import CRMRepository from '../../data/repositories/CRM-repository';

interface State {
  status: SignalingStatus;
  type: 'user' | 'client';
}

const config = {
  iceServers: [
    {
      urls: ['stun:159.65.65.214:3478'],
    },
    {
      urls: ['turn:159.65.65.214:3478?transport=udp'],
      username: 'bccs6991',
      credential: 'ptyk2533',
    },
    {
      urls: ['turn:159.65.65.214:3478?transport=tcp'],
      username: 'bccs6991',
      credential: 'ptyk2533',
    },
  ],
};

class VchatClient extends Component<any, State> implements SignalingEvents {
  /// instanciamos al clases signaling
  signaling = Signaling.create({
    wsHost: `${process.env.REACT_APP_API_URL!}/vchat`,
    config,
  });
  videoPreview: VideoPreview | null = null;
  inCall: InCall | null = null;
  shareScreen: ShareScreen | null = null;
  shareScreenReceiver: ShareScreenReceiver | null = null;

  CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  constructor(props: any) {
    super(props);
    this.state = {
      status: SignalingStatus.connecting,
      type: 'user',
    };
  }

  async componentDidMount() {
    const { history, match, codeVchat } = this.props;

    const url = window.location.href;
    //console.log('URL', url);
    let code = '123';

    if (codeVchat) {
      code = codeVchat;
      //console.log('code:::', codeVchat);
    }

    if (url.includes('vchat')) {
      const actualCode = match.params.code;
      //console.log('code:::', actualCode);
      if (actualCode) {
        code = actualCode;
        this.setState({ type: 'client' });
      } else {
        history.push('/404');
        return;
      }
    }

    this.signaling.events = this;
    if (code) {
      /// Nos conectamos a los sockets de vchat
      const okConnect = await this.signaling.connect(code);
      console.log('signaling init', this.signaling);
      if (!okConnect) {
        history.push('/404');
        //return;
      }
      /// Cuando estamos en la pagina del cliente
      /* if (url.includes('vchat')) {
        const respCallUser = await this.signaling.callToUser();
        if (respCallUser.ok) {
          message.success('Llamando al usuario');
        } else {
          message.success('No se pudo llamar al usuario');
        }
      } */
    } else {
      this.setState({ status: SignalingStatus.missingCode });
    }
  }

  componentDidUpdate() {
    const { status } = this.state;
    if (status !== SignalingStatus.connected) {
      //this.videoPreview = null;
    }
  }

  componentWillUnmount() {
    //console.log('Chao Vchat', this.videoPreview);
    this.signaling.detroy();
    if (this.videoPreview && this.videoPreview.video) {
      const stream = this.videoPreview.video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (this.inCall && this.inCall.video) {
      const stream = this.inCall.video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  onStatus = (status: SignalingStatus) => {
    //const { setVchatActivated } = this.props;
    this.setState({ status }, () => {
      if (status === SignalingStatus.connected) {
        if (this.videoPreview && this.videoPreview.video) {
          this.videoPreview.video.srcObject = this.signaling.localStream!;
          //setVchatActivated(true);
        }
      }
    });
  };

  onMediaStatus = (mediaStatus: MediaStatus) => {
    if (this.signaling.connected && this.videoPreview) {
      this.videoPreview.setState({ mediaStatus });
    } else if (this.inCall) {
      this.inCall.setState({ mediaStatus });
    }
  };

  onLocalStreamChanged = () => {
    console.log('debug 1: Entro onLocalStreamChanged');
    if (this.videoPreview && this.videoPreview.video) {
      this.videoPreview.video.srcObject = this.signaling.localStream!;
      /* this.videoPreview.setState((prevState) => ({
        mediaStatus: {
          ...prevState.mediaStatus,
          camera: !prevState.mediaStatus.camera,
        },
      })); */
    }
    if (this.inCall && this.inCall.videoClient) {
      //console.log('debug 2: mediaStatus camera', this.signaling.mediaStatus.camera);
      this.inCall.videoClient.srcObject = this.signaling.mediaStatus.camera
        ? null
        : this.signaling.localStream!;
      //console.log('debug 3: despues mediaStatus camera', this.inCall.videoClient.srcObject);
    }
  };

  /// Renderizo el audio y video del otro usuario
  onRemoteStreamChanged = () => {
    console.log('debug init 1: Entro onRemoteStreamChanged');
    this.setState({ status: SignalingStatus.inCall }, () => {
      if (this.inCall && this.inCall.video) {
        this.inCall.video.srcObject = this.signaling.remoteStream!;
      }
      /* if (this.inCall && this.inCall.videoClient) {
        console.log('debug init 2: srcObject videoClient', this.signaling.mediaStatus.camera);
        this.inCall.videoClient.srcObject = this.signaling.mediaStatus.camera
        ? null
        : this.signaling.localStream!;
        //console.log('debug init 3: despues srcObject videoClient', this.inCall.videoClient.srcObject);
      } */
    });
  };

  /// Renderizo la pantalla del otro usuario
  onRemoteStreamScreenChanged = () => {
    //console.log('Entro onRemoteStreamScreenChanged', this.shareScreenReceiver);

    /* if (this.shareScreenReceiver) {
      this.shareScreenReceiver.setState({ receiver: true }, () => {
        if (this.shareScreenReceiver && this.shareScreenReceiver.video) {
          this.shareScreenReceiver.video.srcObject = this.signaling.remoteStreamShareScreen!;
        }
      });
    } */
    if (this.inCall) {
      this.inCall.setState({ receiver: true }, () => {
        if (this.inCall && this.inCall.videoScreen) {
          this.inCall.videoScreen.srcObject =
            this.signaling.remoteStreamShareScreen!;
        }
      });
    }
  };

  endScreen = () => {
    /* if (this.shareScreenReceiver) {
      this.shareScreenReceiver.setState({ receiver: false }, () => {
        if (this.shareScreenReceiver && this.shareScreenReceiver.video) {
          this.shareScreenReceiver.video.srcObject = null;
        }
      });
    } */
    if (this.inCall) {
      this.inCall.setState({ receiver: false }, () => {
        if (this.inCall && this.inCall.videoScreen) {
          this.inCall.videoScreen = null;
        }
      });
    }
  };

  endCall = () => {
    //console.log('end Call');
    this.setState({ status: SignalingStatus.connected }, () => {
      if (this.videoPreview && this.videoPreview.video) {
        this.videoPreview.video.srcObject = this.signaling.localStream!;
      }
    });
  };

  messageReceiver = (messageVchat: Message) => {
    //console.log('Mensaje recibido', messageVchat);
    if (this.inCall) {
      this.inCall.setState(({ messages }) => {
        const copia = [...messages];
        copia.push(messageVchat);
        return { messages: copia };
      });
    }
  };

  offCameraRemote() {
    this.setState({ status: SignalingStatus.inCall }, () => {
      if (this.inCall && this.inCall.video) {
        //(this.inCall.video.srcObject as MediaStream).getVideoTracks()[0].stop();
        this.inCall.video.srcObject = null;
      }
    });
  }

  render() {
    const { status, type } = this.state;
    return (
      <div id="vchat-client">
        <div className="vchat-client-header">
          <img
            width={80}
            src="/img/logo.png"
            alt=""
            style={{ margin: '0 auto' }}
          />
        </div>
        {status === SignalingStatus.missingCode && (
          <div>
            <div>SIN CODIGO</div>
          </div>
        )}
        <div className="vchat-client-container-video">
          {status === SignalingStatus.connected && (
            <VideoPreview
              ref={(ref) => {
                this.videoPreview = ref;
              }}
              signaling={this.signaling}
            />
          )}
          {status === SignalingStatus.inCall && (
            <InCall
              ref={(ref) => {
                this.inCall = ref;
              }}
              signaling={this.signaling}
              type={type}
            />
          )}
          {(status === SignalingStatus.connecting ||
            status === SignalingStatus.calling) && (
            <div className="loading-vchat">
              <div className="loading-vchat_container">
                <div>Conectando a la llamada ...</div>
                <Spin size="large" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default VchatClient;
