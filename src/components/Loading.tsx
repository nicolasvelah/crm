import { Spin } from 'antd';
import React from 'react';

export default class Loading extends React.PureComponent<{ visible: boolean }> {
  render() {
    const { visible } = this.props;
    return (
      <div
        style={{
          display: visible ? 'flex' : 'none',
          position: 'fixed',
          alignItems: 'center',
          justifyContent: 'center',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.3)',
          zIndex: 99999
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
}
