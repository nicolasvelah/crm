import React, { FunctionComponent } from 'react';
import { Select } from 'antd';
import { useHistory } from 'react-router-dom';
import Leads from '../../data/models/Leads';
import BusinessLine from '../Business/BusinessLine';
import switchStepToNumber from '../../utils/step-extras';

const { Option } = Select;

const switchStepLead = (
  stepString: string,
  idLead: number,
  identification?: string
) => {
  const dataTest = [
    {
      marca: 'JEEP 1',
      modelo: 'Cherokee',
      version: 'Longitude',
      anio: 2011,
      costo: 36000,
      urlPhoto:
        'https://firebasestorage.googleapis.com/v0/b/command-center-test-33f2e.appspot.com/o/jeep1.jpg?alt=media&token=c54d4999-b136-422d-b5cb-208061c0332a',
    },
    {
      marca: 'JEEP 2',
      modelo: 'Cherokee',
      version: 'Longitude',
      anio: 2011,
      costo: 36000,
      urlPhoto:
        'https://firebasestorage.googleapis.com/v0/b/command-center-test-33f2e.appspot.com/o/jeep1.jpg?alt=media&token=c54d4999-b136-422d-b5cb-208061c0332a',
    },
  ];
  /*switch (stepString) {
    case 'inquiry':
      return <AddInquiry id={identification!} step={0} idLead={idLead} />;
    case 'demonstration':
      return (
        <QuotesGenerated
          checkSelection={false}
          creditRequest={false}
          onChange={() => {}}
          labelQuotes={false}
          title="Cotizaciones generadas para este negocio"
          dataCars={dataTest}
          dataBanks={dataTestBancos}
        />
      );
    default:
      return <div>Paso No econtrado</div>;
  }*/
};

const MiniDetailsLead: FunctionComponent<{
  lead: Leads;
  identification: string;
}> = ({ lead, identification }) => {
  /* history.listen(() => {
    if (history.action === 'PUSH') {
      //console.log('Pushhhh');
    }

    if (history.action === 'POP') {
      //console.log('POP');
    }
  }); */
  //console.log('render MiniDetailsLead');

  const setActualStep = (leadToStep: Leads) => {
    //console.log('====> AQUI', leadToStep.quotes);
    if (leadToStep.quotes && leadToStep.quotes.length > 0) {
      /* const resp5 = leadToStep.quotes.find(
        (quo) => quo.prebill && quo.prebill.status === 'APPROVED'
      );
      //console.log('Encontro 5', resp5);
      if (resp5) {
        return 5;
      } */
      const resp4 = leadToStep.quotes.find((quo) => !!quo.vimVehiculo);
      //console.log('Encontro 4', resp4);
      if (resp4) {
        return 4;
      }

      const resp3 = leadToStep.quotes.find((quo) => quo.closed === true);
      //console.log('Encontro 3', resp3);
      if (resp3) {
        return 3;
      }
      return 2;
    }

    return switchStepToNumber(lead.state!);
  };
  if (lead.user) {
    return (
      <>
        <div className="flex w-full p-3">
          {/*<div className="w-1/5">
            <b className="text-xl">Negocio x</b>
            <Enbudo stepBusiness={lead.state!} />
          </div>*/}

          <div className="w-4/5">
            {/* header */}
            <div className="flex justify-between mb-4">
              <div className="flex items-center w-2/5">
                <b className="mr-2">Asesor:</b>
                <Select
                  defaultValue={`${lead.user.nombre} ${lead.user.apellido}`}
                  style={{ width: 200 }}
                  disabled
                >
                  <Option value="Ana_Terobi">Ana Yerobi</Option>
                </Select>
              </div>
              {/*<div className="flex items-center">
                <b className="mr-2">Hoja de trabajo:</b>
                <div
                  className={`${
                    !lead.workPage ? 'bg-orange-400' : 'bg-blue-400'
                  } text-white py-1 px-2 m-1`}
                >
                  {lead.workPage ? 'Nro 134' : 'Pendiente'}
                </div>
                </div>*/}
            </div>

            <div className="flex flex-col xl:flex-row">
              {/* Datos secundarios */}
              {/* Temperatura */}
              {/*<div className="flex items-center">
                <b className="mr-2">Temperatura:</b>
                <Select
                  defaultValue={lead.temperature}
                  style={{ width: 100 }}
                  onChange={(value) => {}}
                  disabled
                >
                  <Option value="HOT">Caliente</Option>
                  <Option value="COLD">Frío</Option>
                  <Option value="TIBIO">Tíbio</Option>
                </Select>

                <div className="mx-2">
                  <div
                    className={`w-3 h-3 border-l-2 border-r-2 border-t-2 rounded-t border-red-500 ${
                      lead.temperature === 'Hot' ? 'bg-red-500' : ''
                    }`}
                  />
                  <div
                    className={`w-3 h-3 border-l-2 border-r-2 border-red-500 ${
                      lead.temperature === 'Tibio' ||
                      lead.temperature === 'Hot'
                        ? 'bg-red-500'
                        : ''
                    }`}
                  />
                  <div className="w-3 h-3 bg-red-500 border-l-2 border-r-2 border-red-500 border-b-2 rounded-b" />
                </div>
              </div>
                Parametros de pago y reserva
              <div className="my-2">
                <div>
                  <div>
                    <b className="text-black">$ Parametros de Pago</b>
                  </div>
                  <div className="pl-3 text-gray-600">
                    <div>
                      <b>Avaluo Mecánico:</b> Inactivo
                    </div>
                    <div>
                      <b>Solicitud de Crédito:</b> Inactivo
                    </div>
                  </div>
                </div>
                <div>
                  <div className="my-2 flex items-center">
                    <b>Reserva vehículo:</b>
                    <div className="text-white bg-gray-600 px-2 m-2">
                      Sin reserva
                    </div>
                  </div>
                </div>
              </div>*/}
              {/* Pasos para completar la venta */}
              <div className="">
                <div className="mb-3 text-lg">
                  <b>Pasos para completar la venta</b>
                </div>
                <div>
                  {/*<Button
                    type="primary"
                    className="mb-4"
                    size="large"
                    onClick={() => {
                      //console.log('lead.state!', lead.state!, switchStepToNumber(lead.state!),);
                      historyRouter.push(
                        `/lead/id-lead=${lead.id!}/identification=${identification}`,
                        {
                          step: switchStepToNumber(lead.state!),
                          id: identification,
                          idLead: lead.id!,
                        }
                      );
                    }}
                  >
                    Seguir con el negocio
                  </Button>*/}
                  <BusinessLine
                    stepLead={setActualStep(lead)}
                    idLead={lead.id!}
                    progressDot
                    identification={identification}
                    isCredit={lead.quotes !== undefined}
                    go
                  >
                    <div />
                  </BusinessLine>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex w-full">
          <div className="w-1/5" />
          {switchStepLead(lead.state!, lead.id!, identification)}
        </div> */}
      </>
    );
  }
  return <div>NO USER</div>;
};

const AddInquiry: FunctionComponent<{
  id: string;
  step: number;
  idLead: number;
}> = ({ id, step, idLead }) => {
  const historyRouter = useHistory();
  return (
    <div className="w-4/5">
      <span className="text-lg text-green-400">Empieza aquí</span>
      <div>
        <b>Producto de interés:</b> <span>Sin producto</span>
      </div>
      <div
        onClick={() => {
          //historyRouter.push(`/lead/${idLead}/${id}/${step}`, {
          historyRouter.push(`/lead/id-lead=${idLead}/identification=${id}`, {
            step,
            id,
            idLead,
          });
        }}
        className="flex justify-center items-center border border-2 border-gray-600 w-56 h-32 my-4 cursor-pointer"
      >
        <div className="text-gray-600">
          <b className="mx-1">+</b>
          <span>Indagación</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MiniDetailsLead);
