import React, { FunctionComponent } from 'react';
import { Divider, Row, Col } from 'antd';

const HeaderHelp: FunctionComponent<{
  title: string;
  pathImage: string;
  pathIcon?: string;
}> = ({ title, pathImage, pathIcon }) => {
  return (
    <>
      <Row>
        <Col span={24}>
          <h2 className="text-2xl c-black m-0 p-0 ml-5">
            <img
              alt="no-found"
              style={{ marginLeft: 5 }}
              className="mr-2"
              src={
                pathIcon ??
                'https://www.flaticon.es/svg/static/icons/svg/906/906794.svg'
              }
              width="25"
            />{' '}
            {title}
          </h2>

          <Divider />

          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <img
              alt="no-found"
              src={pathImage}
              style={{
                width: 'auto',
                height: 'auto',
                maxHeight: '100vh',
                maxWidth: '100%',
                marginLeft: 5,
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default HeaderHelp;
