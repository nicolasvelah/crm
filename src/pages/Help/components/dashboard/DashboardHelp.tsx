import React from 'react';
import HeaderHelp from '../HeaderHelp';
import RowHelp from '../RowHelp';

const pathDashboard = '/img/help/';

const DashboardHelp = () => {
  return (
    <div>
      <HeaderHelp
        title="Dashboard"
        pathImage={`${pathDashboard}/static_0.jpg`}
      />

      <RowHelp
        numberItem="I"
        description="Botón que perime la creación de un nuevo cliente al GUC."
        pathImage={`${pathDashboard}/static_1.jpg`}
      />

      <RowHelp
        numberItem="II"
        description="Información del mes sobre: Número de ventas, negocios activos,
        clientes creados, seguimientos por realizar (verde: a tiempo, rojo:
        tarde: azul: cerrado)."
        pathImage={`${pathDashboard}/static_3.jpg`}
        width="100%"
      />

      <RowHelp
        numberItem="III"
        description="Permite la visualización de los diferentes canales al momento de la
        creación de cada cliente."
        pathImage={`${pathDashboard}/static_3.jpg`}
        width="100%"
      />

      <RowHelp
        numberItem="IV"
        description="Seleción del flitros para la parte del Embudo, se activa dependiendo
        el rol de usuario."
        pathImage={`${pathDashboard}/static_4.jpg`}
      />

      <RowHelp
        numberItem="V"
        description="Muestra la información general del GUC, cambia de valores segun el el
        usuario."
        pathImage={`${pathDashboard}/static_5.jpg`}
        width="100%"
      />

      <RowHelp
        numberItem="VI"
        description="Notificaciones del usuario."
        pathImage={`${pathDashboard}/static_7.jpg`}
      />

      <RowHelp
        numberItem="VII"
        description="Segumientos del día."
        pathImage={`${pathDashboard}/static_6.jpg`}
      />
    </div>
  );
};

export default DashboardHelp;
