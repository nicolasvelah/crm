import React from 'react';
import HeaderHelp from '../HeaderHelp';
import RowHelp from '../RowHelp';

const pathNewProspect = '/img/help-page/prospect/new-prospect';

const NewProspectHelp = () => {
  return (
    <>
      <HeaderHelp
        title="Nuevo Prospecto"
        pathImage={`${pathNewProspect}/static_19.jpg`}
      />

      <RowHelp
        numberItem="I"
        description="Valores de entrada que se debe ingresar para crear un nuevo cliente."
        pathImage={`${pathNewProspect}/static_20.jpg`}
        width="100%"
      />

      <RowHelp
        numberItem="II"
        description="Etiqueta que indica si existe o no el cliente a ingresar."
        pathImage={`${pathNewProspect}/static_21.jpg`}
      />

      <RowHelp
        numberItem="III"
        description="Etiqueta que indica si existe o no el cliente a ingresar."
        pathImage={`${pathNewProspect}/static_22.jpg`}
      />
    </>
  );
};

export default NewProspectHelp;
