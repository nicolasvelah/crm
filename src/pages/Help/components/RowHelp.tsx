import React, { FunctionComponent } from 'react';
import { Divider, Row, Col } from 'antd';

const RowHelp: FunctionComponent<{
  numberItem: string;
  pathImage: string;
  description: string;
  width?: string | number;
}> = ({ numberItem, pathImage, description, width }) => {
  return (
    <>
      <Divider />
      <h3 className="text-xl c-black ml-5">{numberItem}:</h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src={pathImage}
              style={{ width: width ?? 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>{description}</p>
        </Col>
      </Row>
    </>
  );
};

export default RowHelp;
