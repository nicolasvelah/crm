import React from 'react';
import HeaderHelp from '../HeaderHelp';
import RowHelp from '../RowHelp';

const pathListProspect = '/img/help-page/prospect/list-prospect';

const MainProspectHelp = () => {
  return (
    <>
      <HeaderHelp
        title="Dashboard"
        pathImage={`${pathListProspect}/static_9.jpg`}
      />

      <RowHelp
        numberItem="I"
        description="Título de la página actual."
        pathImage={`${pathListProspect}/static_10.jpg`}
      />

      <RowHelp
        numberItem="II"
        description="Botón que nos permite recopilar la información de los prospectos
        para descargar en un archivo de Excel."
        pathImage={`${pathListProspect}/static_11.jpg`}
      />

      <RowHelp
        numberItem="III"
        description="Botón que nos permite crear un nuevo cliente, este botón nos
        direcciona a otra página para ingresar los datos del cliente."
        pathImage={`${pathListProspect}/static_12.jpg`}
      />

      <RowHelp
        numberItem="IV"
        description="Campo que nos permite buscar al cliente dentro de la aplicación por
        identificación o apellido."
        pathImage={`${pathListProspect}/static_13.jpg`}
      />

      <RowHelp
        numberItem="V"
        description="Selector de fecha inicial y fecha final para buscar al cliente en
        ese periodo de tiempo."
        pathImage={`${pathListProspect}/static_14.jpg`}
      />

      <RowHelp
        numberItem="VI"
        description="Lista de los clientes que se encuentran en el período de tiempo
        seleccionado anteriormente, nos proporciona información detallada de
        cada cliente."
        pathImage={`${pathListProspect}/static_15.jpg`}
        width="100%"
      />

      <RowHelp
        numberItem="VII"
        description="Etiqueta que nos permite identificar el número de clientes en total."
        pathImage={`${pathListProspect}/static_18.jpg`}
      />

      <RowHelp
        numberItem="VIII"
        description="Botón que nos direcciona a la página de negocio dentro del GUC."
        pathImage={`${pathListProspect}/static_16.jpg`}
      />

      <RowHelp
        numberItem="IX"
        description="Botón que permite desplazar dentro de la lista de los clientes."
        pathImage={`${pathListProspect}/static_17.jpg`}
      />
    </>
  );
};

export default MainProspectHelp;
