import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import './reasign.scss';

const LoadingMessage = () => {
  return (
    <div className="reasign1">
      <div className="reasign1-content">
        <LoadingOutlined className="reasign1-loading" />
        <p className="reasign1-message">
          Este proceso puede tardar varios minutos, por favor espere.
          <br />
          <strong>Recuerde</strong>
          , no debe actualizar la página ni cerrar el navegador.
        </p>
      </div>
    </div>
  );
};

export default LoadingMessage;
