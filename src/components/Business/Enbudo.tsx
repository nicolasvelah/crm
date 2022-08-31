import React, { FunctionComponent } from 'react';

type StepBusiness =
  | 'prospeccion'
  | 'trafico'
  | 'presentacion'
  | 'cotizaciones'
  | 'solicitudes'
  | 'aprobaciones'
  | 'cierre'
  | 'entrega';

const selectStep = (stateLead: string): StepBusiness => {
  switch (stateLead) {
    case 'inquiry':
      return 'prospeccion';

    default:
      return 'prospeccion';
  }
};

const Enbudo: FunctionComponent<{ stepBusiness: string }> = ({
  stepBusiness,
}) => {
  const typeStep = selectStep(stepBusiness);
  return (
    <div className="ml-3" style={{ width: 'max-content' }}>
      <Item
        title="Prospección"
        color="teal-500"
        active={typeStep === 'prospeccion'}
      />
      <Item
        title="Tráfico"
        color="teal-300"
        active={typeStep === 'trafico'}
      />
      <Item
        title="Presentación"
        color="green-300"
        active={typeStep === 'presentacion'}
      />
      <Item
        title="Cotizaciones"
        color="green-400"
        active={typeStep === 'cotizaciones'}
      />
      <Item
        title="Solicitudes"
        color="yellow-400"
        active={typeStep === 'solicitudes'}
      />
      <Item
        title="Aprobaciones"
        color="yellow-200"
        active={typeStep === 'aprobaciones'}
      />
      <Item title="Cierre" color="red-300" active={typeStep === 'cierre'} />
      <Item
        title="Entrega"
        color="red-400"
        active={typeStep === 'entrega'}
      />
    </div>
  );
};

const Item: FunctionComponent<{
  title: string;
  color: string;
  active?: boolean;
}> = ({ title, color, active }) => {
  return (
    <div
      className={`flex w-auto items-center rounded text-${color} ${
        active ? 'bg-gray-400' : ''
      }`}
    >
      <div className={`bg-${color} rounded-full mx-2 h-2 w-2`} />
      <span className="mr-2">{title}</span>
    </div>
  );
};

export default Enbudo;
