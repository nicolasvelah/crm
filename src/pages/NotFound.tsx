import React, { FunctionComponent } from 'react';
import 'antd/dist/antd.css';
import { Result } from 'antd';

const NotFound: FunctionComponent = () => {
  return (
    <div>
      <Result status="404" subTitle="Not Fount" />
    </div>
  );
};

export default NotFound;
