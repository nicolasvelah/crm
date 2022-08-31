import React, { FunctionComponent } from 'react';
import { Button, Result } from 'antd';

const ModalFinish: FunctionComponent<{ finish: Function }> = ({ finish }) => {
  const closeModal = () => {
    finish();
  };
  return (
    <div>
      <Result
        status="success"
        title="Excelente tu cotización se realizó con éxito"
        subTitle="Te hemos enviado un correo electrónico con los datos de la cotización pronto un asesor se comunicará contigo para continuar con el proceso."
        extra={[
          <Button type="primary" key="console" onClick={closeModal}>
                      Aceptar          
          </Button>,
        ]}
      />
    </div>
  );
};

export default ModalFinish;
