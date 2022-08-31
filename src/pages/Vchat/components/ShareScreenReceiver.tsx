import React, { Component } from 'react';
import { Signaling } from '../../../libs/signaling';
import { Button } from 'antd';

interface State {
  receiver: boolean;
}

interface Props {
  signaling: Signaling;
}

class ShareScreenReceiver extends Component<Props, State> {
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
      receiver: false,
    };
  }

  render() {
    const { receiver } = this.state;
    if (!receiver) return <div>No recibe data</div>;
    return (
      <div>
        <video
          ref={(ref) => {
            this.video = ref;
          }}
          style={{ width: '100%' }}
          muted
          autoPlay
        />
      </div>
    );
  }
}
export default ShareScreenReceiver;
