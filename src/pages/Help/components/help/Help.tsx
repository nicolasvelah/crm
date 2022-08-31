import React from 'react';
import HeaderHelp from '../HeaderHelp';
import RowHelp from '../RowHelp';

const pathHelp = '/img/help-page/help';

const Help = () => {
  return (
    <div>
      <HeaderHelp title="Ayuda" pathImage={`${pathHelp}/img_help_main_b.png`} />

      <RowHelp
        numberItem="I"
        description="Logotipo de CRM."
        pathImage={`${pathHelp}/logo_CRM.png`}
      />

      <RowHelp
        numberItem="II"
        description="Menú lateral, indica las opciones de navegación dentro del GUC, se
        puede escoger cualquiera de ellas dando un clic con el mouse."
        pathImage={`${pathHelp}/menu.png`}
      />

      <RowHelp
        numberItem="III"
        description="Icono que permite minimizar el menú, permite tener un espacio mas
        amplio dentro de la página principal."
        pathImage={`${pathHelp}/static_121.jpg`}
      />

      <RowHelp
        numberItem="IV"
        description="Botón que indica la disponibilidad del usuario dentro del GUC."
        pathImage={`${pathHelp}/static_122.jpg`}
      />

      <RowHelp
        numberItem="V"
        description="Botón que nos permite visualizar las notificaciones al dar clic."
        pathImage={`${pathHelp}/static_123.jpg`}
      />

      <RowHelp
        numberItem="VI"
        description="Botón que muestra la información del usuario actualmente en el GUC."
        pathImage={`${pathHelp}/static_124.jpg`}
      />
    </div>
  );
};

export default Help;
