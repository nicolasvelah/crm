import React, { PureComponent } from 'react';
import { Button, message, Tooltip } from 'antd';
import { AudioOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { MediaStatus, Signaling } from '../../../libs/signaling';

export default class VideoPreviewClient extends PureComponent<
  {
    signaling: Signaling;
  },
  { mediaStatus: MediaStatus }
> {
  video: HTMLVideoElement | null = null;

  constructor(props: any) {
    super(props);
    const { microphone, camera } = this.props.signaling.mediaStatus;
    this.state = {
      mediaStatus: { microphone, camera } as MediaStatus,
    };
  }

  componentDidMount() {
    //console.log('VideoPreview this.video srcObject', this.video?.srcObject);
  }

  componentWillUnmount() {
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
  }

  render() {
    const { signaling } = this.props;
    const { mediaStatus } = this.state;

    //console.log('render videoPreview');
    return (
      <div className="vchat-client-preview">
        <div className="vchat-client-preview__video-container">
          <div className="vchat-client-preview__video">
            <video
              ref={(ref) => {
                this.video = ref;
              }}
              muted
              autoPlay
            />
          </div>
          <div className="vchat-client-preview__buttons">
            <Tooltip placement="top" title={!mediaStatus.microphone ? 'Activar micrófono' : 'Desactivar micrófono'}>
              <Button
                type={!mediaStatus.microphone ? 'primary' : 'default'}
                danger={mediaStatus.microphone ? undefined : true}
                size="large"
                shape="circle"
                icon={<AudioOutlined />}
                onClick={() => {
                  signaling.onMute(true);
                  this.setState((prevState) => ({
                    mediaStatus: {
                      ...prevState.mediaStatus,
                      microphone: !prevState.mediaStatus.microphone,
                    },
                  }));
                }}
              />
            </Tooltip>
            <Tooltip placement="top" title={!mediaStatus.camera ? 'Activar cámara' : 'Desactivar cámara'}>
              <Button
                type={!mediaStatus.camera ? 'primary' : 'default'}
                danger={mediaStatus.camera ? undefined : true}
                size="large"
                shape="circle"
                icon={<VideoCameraOutlined />}
                onClick={() => {
                  signaling.onCameraOff(true);

                  this.setState((prevState) => ({
                    mediaStatus: {
                      ...prevState.mediaStatus,
                      camera: !prevState.mediaStatus.camera,
                    },
                  }));
                }}
              />
            </Tooltip>
          </div>
        </div>
        <div className="vchat-client-preview__text">
          <b>¿Listo para unirte?</b>
          <br />
          <br />
          <Button
            type="primary"
            onClick={async () => {
              signaling.joinToCall();
              const respCallUser = await signaling.callToUser();
              if (respCallUser.ok) {
                message.success('Llamando al usuario');
              } else {
                message.success('No se pudo llamar al usuario');
              }
            }}
            shape="round"
          >
            Unirse ahora
          </Button>
        </div>
      </div>
    );
  }
}
