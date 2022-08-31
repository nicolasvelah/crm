/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';

export default class AvoidReRender extends Component<{
  children: React.ReactNode;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return this.props.children;
  }
}
