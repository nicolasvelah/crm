import React, { PureComponent } from 'react';
import { Button, Input, Tooltip, Modal } from 'antd';
import moment from 'moment';
import {
  AudioOutlined,
  VideoCameraOutlined,
  WechatOutlined,
  PhoneOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { MediaStatus, Signaling, Message } from '../../../libs/signaling';
import Chat from '../../Vchat/components/Chat';
import { LoadingModal } from '../../../components/Inquiry/components/SelectVehicleInquiry';

export default class InCallClient extends PureComponent<
  {
    signaling: Signaling;
    type?: 'user' | 'client';
  },
  {
    mediaStatus: MediaStatus;
    messages: Message[];
    activeChat: boolean;
    receiver: boolean;
    loading: boolean;
  }
> {
  video: HTMLVideoElement | null = null;
  videoClient: HTMLVideoElement | null = null;
  videoScreen: HTMLVideoElement | null = null;

  constructor(props: any) {
    super(props);
    const { microphone, camera } = this.props.signaling.mediaStatus;
    this.state = {
      mediaStatus: { microphone, camera } as MediaStatus,
      messages: [],
      activeChat: false,
      receiver: false,
      loading: true,
    };
  }

  componentDidMount() {
    if (this.videoClient) {
      const { signaling } = this.props;
      this.videoClient.srcObject = !signaling.mediaStatus.camera
        ? null
        : signaling.localStream!;
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000);
  }

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

  render() {
    const { signaling, type } = this.props;
    const { mediaStatus, messages, activeChat, receiver, loading } = this.state;
    return (
      <div className="vchat-client-incall">
        <div
          className={`vchat-client-incall-main ${
            !activeChat ? 'active-chat-main' : ''
          }`}
        >
          <div className="vchat-client-incall-main__video-container">
            <div className="vchat-client-incall-main__video-container-videos">
              <div className="vchat-client-incall-main__video video-client">
                <div>
                  <video
                    className={receiver ? 'active-screen' : ''}
                    ref={(ref) => {
                      this.videoClient = ref;
                    }}
                    muted
                    autoPlay
                  />
                </div>
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
                      //disabled={!this.video ? true : undefined}
                      type={mediaStatus.microphone ? 'primary' : 'default'}
                      danger={mediaStatus.microphone ? undefined : true}
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
                      !mediaStatus.camera
                        ? 'Activar cámara'
                        : 'Desactivar cámara'
                    }
                  >
                    <Button
                      //disabled={!this.video ? true : undefined}
                      type={mediaStatus.camera ? 'primary' : 'default'}
                      danger={mediaStatus.camera ? undefined : true}
                      shape="circle"
                      icon={<VideoCameraOutlined />}
                      onClick={() => {
                        signaling.onCameraOff();
                      }}
                    />
                  </Tooltip>
                  <Tooltip placement="top" title="Finalizar llamada">
                    <Button
                      //disabled={!this.video ? true : undefined}
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
              <div className="vchat-client-incall-main__video">
                <div>
                  <video
                    className={receiver ? 'active-screen' : ''}
                    ref={(ref) => {
                      this.video = ref;
                    }}
                    autoPlay
                  />
                </div>
              </div>
            </div>
            {receiver && (
              <div className="vchat-client-incall-main__screen-container">
                <video
                  ref={(ref) => {
                    this.videoScreen = ref;
                  }}
                  muted
                  autoPlay
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={`vchat-client-incall-chat ${
            !activeChat ? 'active-chat' : ''
          }`}
        >
          <Button
            className="button-chat"
            icon={<WechatOutlined />}
            onClick={() => {
              this.setState((prevState) => ({
                activeChat: !prevState.activeChat,
              }));
            }}
          />
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
        <LoadingModal
          view={loading}
          opacity={0.5}
          message="Estableciendo conexión ..."
        />
      </div>
    );
  }
}
