import React, { Component } from 'react';
import { Button } from 'antd';
import { Signaling } from '../../../libs/signaling';

interface State {
  sharing: boolean;
}

interface Props {
  signaling: Signaling;
}

class ShareScreen extends Component<Props, State> {
  video: HTMLVideoElement | null = null;

  displayMediaOptions = {
    video: {
      cursor: 'always',
    },
    audio: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      sharing: false,
    };
  }

  startCapture = async () => {
    //console.log('Iniciando captura');
    const { signaling } = this.props;
    try {
      if (this.video) {
        // @ts-ignore
        this.video.srcObject = await navigator.mediaDevices.getDisplayMedia(
          this.displayMediaOptions
        );
        this.setState({ sharing: true });

        /// share screen
        const stream: any = this.video.srcObject;
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
    if (this.video && this.video.srcObject) {
      // @ts-ignore
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach((track: any) => track.stop());
      this.video.srcObject = null;
      this.video = null;
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
    const { sharing } = this.state;
    return (
      <div className="container-shareScreen">
        <Button onClick={this.onClickButton}>
          {sharing ? 'Dejar de Compartir' : 'Compartir'}
        </Button>
        <video
          ref={(ref) => {
            this.video = ref;
          }}
          style={{ width: '100%', display: sharing ? undefined : 'none' }}
          muted
          autoPlay
        />
      </div>
    );
  }
}
export default ShareScreen;
