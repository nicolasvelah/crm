import React, { PureComponent } from 'react';
import { Button, Tooltip, Modal } from 'antd';
import moment from 'moment';
import {
  AudioOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { MediaStatus, Signaling, Message } from '../../../libs/signaling';
import Chat from './Chat';

export default class InCall extends PureComponent<
  {
    signaling: Signaling;
    type?: 'user' | 'client';
  },
  { mediaStatus: MediaStatus; messages: Message[]; sharing: boolean }
> {
  displayMediaOptions = {
    video: {
      cursor: 'always',
    },
    audio: false,
  };

  video: HTMLVideoElement | null = null;
  videoClient: HTMLVideoElement | null = null;
  videoScreen: HTMLVideoElement | null = null;

  constructor(props: any) {
    super(props);
    const { microphone, camera } = this.props.signaling.mediaStatus;
    this.state = {
      mediaStatus: { microphone, camera } as MediaStatus,
      messages: [],
      sharing: false,
    };
  }

  /* componentWillUnmount() {
    if (this.video) {
      const stream = this.video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.video.srcObject = null;
      this.video = null;
    }
  } */

  endCall = () => {
    const { signaling } = this.props;
    if (this.video && this.video.srcObject) {
      // @ts-ignore
      /*  const tracks = this.video.srcObject.getTracks();
      tracks.forEach((track: any) => track.stop()); */
      this.video.srcObject = null;
      this.video = null;
      if (signaling) {
        signaling.destroyCall(true);
        if (signaling.events) {
          signaling.events.endCall();
        }
      }
    }
  };

  startCapture = async () => {
    //console.log('Iniciando captura');
    const { signaling } = this.props;
    try {
      if (this.videoScreen) {
        // @ts-ignore
        this.videoScreen.srcObject = await navigator.mediaDevices.getDisplayMedia(
          this.displayMediaOptions
        );
        this.setState({ sharing: true });

        /// share screen
        const stream: any = this.videoScreen.srcObject;
        if (signaling) {
          signaling.shareScreen(stream);
        }
      }
    } catch (err) {
      //console.error(`Error startCapture : ${err}`);
      this.setState({ sharing: false });
    }
  };

  stopCapture = () => {
    const { signaling } = this.props;
    if (this.videoScreen && this.videoScreen.srcObject) {
      // @ts-ignore
      const tracks = this.videoScreen.srcObject.getTracks();
      tracks.forEach((track: any) => track.stop());
      this.videoScreen.srcObject = null;
      this.videoScreen = null;
      this.setState({ sharing: false });

      if (signaling) {
        signaling.destroyScreen(true);
      }
    }
  };

  onClickButton = async () => {
    const { sharing } = this.state;
    if (!sharing) {
      await this.startCapture();
    } else {
      this.stopCapture();
    }
  };

  render() {
    const { signaling, type } = this.props;
    const { mediaStatus, messages, sharing } = this.state;
    return (
      <>
        <div className="video-container">
          <div className="vchat-video">
            <video
              ref={(ref) => {
                this.video = ref;
              }}
              autoPlay
            />
          </div>

          <div className="vchat-video client-video">
            <video
              style={{ display: !sharing ? 'none' : undefined }}
              ref={(ref) => {
                this.videoScreen = ref;
              }}
              muted
              autoPlay
            />

            <video
              style={{ display: sharing ? 'none' : undefined }}
              ref={(ref) => {
                this.videoClient = ref;
              }}
              muted
              autoPlay
            />
            <div className="container_button">
              <Tooltip
                placement="top"
                title={
                  !mediaStatus.microphone
                    ? 'Activar micrófono'
                    : 'Desactivar micrófono'
                }
              >
                <Button
                  type={mediaStatus.microphone ? 'primary' : 'default'}
                  danger={mediaStatus.microphone ? undefined : true}
                  className="pa-0"
                  shape="circle"
                  icon={<AudioOutlined />}
                  onClick={() => {
                    signaling.onMute();
                  }}
                />
              </Tooltip>
              <Tooltip
                placement="top"
                title={
                  !mediaStatus.camera ? 'Activar cámara' : 'Desactivar cámara'
                }
              >
                <Button
                  type={mediaStatus.camera ? 'primary' : 'default'}
                  danger={mediaStatus.camera ? undefined : true}
                  className="pa-0 ma-left-20"
                  shape="circle"
                  icon={<VideoCameraOutlined />}
                  onClick={() => {
                    signaling.onCameraOff();
                  }}
                />
              </Tooltip>
              <Tooltip
                placement="top"
                title={!sharing ? 'Compartir pantalla' : 'Dejar de compartir'}
              >
                <Button
                  type={!sharing ? 'primary' : 'default'}
                  danger={!sharing ? undefined : true}
                  shape="circle"
                  onClick={this.onClickButton}
                  icon={<UploadOutlined />}
                />
              </Tooltip>
              <Tooltip placement="top" title="Finalizar llamada">
                <Button
                  style={{ marginLeft: 10 }}
                  type="primary"
                  shape="circle"
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: 'Finalizar la reunión virtual',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Deseas finalizar la reunión virtual',
                      okText: 'SI',
                      cancelText: 'NO',
                      onOk: this.endCall,
                    });
                  }}
                  icon={<PhoneOutlined />}
                />
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="chat-container">
          <Chat
            arrayMessages={messages}
            sendMessage={(value, typeMessage) => {
              //console.log('Mensaje a enviar', value);
              if (value && value !== '') {
                const messageChat = {
                  message: value,
                  date: moment().format('DD/MM/YYYY HH:mm'),
                  isClient: type === 'client',
                  type: typeMessage,
                };
                this.setState((prevState) => {
                  const copia = [...prevState.messages];
                  copia.push(messageChat);
                  return { messages: copia };
                });
                signaling.sendMessage(messageChat);
              }
            }}
            isClient={type === 'client'}
          />
        </div>
      </>
    );
  }
}
