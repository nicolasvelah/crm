import React, { FunctionComponent, useContext, useState } from 'react';
import 'antd/dist/antd.css';
import { Alert, Button, Drawer } from 'antd';
import {
  CreditCardOutlined,
  MailOutlined,
  PrinterOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

import { ClientLeadContext } from '../../../components/GetClientData';
import toPrint from '../../../utils/templates-html/toPrintTemplate';
import { templateQuote } from '../../../utils/templates-html/template-new-credit';
import NewCreditApplication from '../../lead/steps/new-credit-application/NewCreditApplication2';
import { calcTotal } from '../../../utils/extras';

const QuoteButtons: FunctionComponent<{
  sendQuoteMail?: any;
  modalVehicle: any;
  isCredit: boolean;
  isThereClousure?: boolean;
  loading: boolean;
  writeData: Function;
  deleteData: Function;
  dataValuesCredit?: any;
  openDraweCredit: () => void;
}> = ({
  sendQuoteMail,
  modalVehicle,
  isCredit,
  loading,
  writeData,
  deleteData,
  dataValuesCredit,
  openDraweCredit
}) => {
  //const [showDrawerCredit, setShowDrawerCredit] = useState<boolean>(false);
  const { client, lead } = useContext(ClientLeadContext);

  //const closeDraweCredit = () => setShowDrawerCredit(false);
  //const openDraweCredit = () => setShowDrawerCredit(true);

  //Valor extra de es_kit de accesorios
 /*  const valueEsKit = modalVehicle.idAccesories?.reduce(
    (acumulador: any, valorActual: any) => {
      if (valorActual.es_kit === 1) {
        return (
          acumulador +
          (valorActual.cost
            ? valorActual.cost * (valorActual.quantity ?? 0)
            : 0)
        );
      }
      return acumulador;
    },
    0
  );
 */
  return (
    <div className="mt-10">
      {modalVehicle && modalVehicle.observations && (
        <div style={{ marginBottom: 30 }}>
          <Alert message={modalVehicle.observations} type="info" showIcon />
        </div>
      )}
      <div>
        <div className="w-full text-center">
          <Button
            type="dashed"
            onClick={() => sendQuoteMail(modalVehicle)}
            loading={loading}
            icon={<MailOutlined />}
            disabled={!!lead?.saleDown}
          >
            Enviar al cliente
          </Button>
          <Button
            type="dashed"
            style={{ marginLeft: 5 }}
            disabled={!!lead?.saleDown}
            onClick={() => {
              toPrint(
                templateQuote(
                  client!,
                  modalVehicle,
                  true,
                  lead!.concesionario!.code!
                )
              );
            }}
            icon={<PrinterOutlined />}
          >
            Imprimir
          </Button>
          {isCredit && (lead && !lead.isFleet) && (
            <Button
              style={{ marginLeft: 5 }}
              onClick={openDraweCredit}
              icon={<CreditCardOutlined />}
              disabled={!!lead?.saleDown}
            >
              Solicitud de Crédito
            </Button>
          )}
        </div>
        {modalVehicle ? (
          <div className="mt-4 text-center">
            {modalVehicle.vimVehiculo ? (
              <Alert
                style={{ marginBottom: 10 }}
                message={`Tienes un VIN asignado: ${modalVehicle.vimVehiculo}`}
                type="success"
                showIcon
              />
            ) : null}
            {modalVehicle.closed ? (
              <Button
                type="primary"
                onClick={() => deleteData(modalVehicle)}
                icon={<MinusCircleOutlined />}
                danger
                disabled={!!modalVehicle.vimVehiculo || !!lead?.saleDown}
              >
                Quitar del Cierre
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => writeData(modalVehicle)}
                icon={<PlusCircleOutlined />}
                disabled={!!lead?.saleDown}
              >
                Agregar a Cierre
              </Button>
            )}
          </div>
        ) : null}
      </div>
      {/* <Drawer
        title="Solicitud de Crédito."
        width={900}
        onClose={closeDraweCredit}
        visible={showDrawerCredit}
        headerStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
        bodyStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
        maskStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        footerStyle={{ backgroundColor: '#fff' }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={closeDraweCredit} style={{ marginRight: 8 }}>
              Cerrar
            </Button>
          </div>
        }
      >
        {showDrawerCredit && dataValuesCredit && (
          <div>
            {/* {console.log('MODAL VEHICLE !!!!', modalVehicle)}
            {console.log(
              '--------->FINANCIAMIENTO',
              calcTotal(
                dataValuesCredit.total,
                dataValuesCredit.pvp,
                dataValuesCredit.carRegistration,
                dataValuesCredit.insuranceAmountYears,
                dataValuesCredit.Exonerated
              ) -
                dataValuesCredit.EntryQuantity -
                dataValuesCredit.carRegistration
            )}
            {console.log('VALOR EXTRA BUTTONS', valueEsKit)} /}
            <NewCreditApplication
              client={client!}
              vehicle={{
                brand: modalVehicle.vehiculo[0].brand!,
                description: modalVehicle.vehiculo[0].description!,
                model: modalVehicle.vehiculo[0].model!,
                value: modalVehicle.vehiculo[0].pvp!,
                totalServices: modalVehicle!.servicesValue ?? 0,
                totalAccesories: modalVehicle!.accesoriesValue ?? 0,
                year: modalVehicle.vehiculo[0].year!,
                entrada: modalVehicle.inputAmount!,
                financing:
                  calcTotal(
                    dataValuesCredit.total,
                    dataValuesCredit.pvp,
                    dataValuesCredit.carRegistration,
                    dataValuesCredit.insuranceAmountYears,
                    dataValuesCredit.Exonerated
                  ) -
                  dataValuesCredit.EntryQuantity -
                  dataValuesCredit.carRegistration,
                /* financing:
                  modalVehicle.vehiculo[0].pvp! - modalVehicle.inputAmount!, //
                monthlyPayments: modalVehicle.monthly!,
                plazo: modalVehicle.months!,
                tasa: modalVehicle.rate!,
                valueExtraEsKit: valueEsKit ?? 0,
              }}
              user={{
                concessionaire: lead?.concesionario?.name || '',
                name: lead ? `${lead.user.nombre} ${lead.user.apellido}` : '',
                place: lead?.city ?? 'Sin ciudad',
                role: lead ? lead.user!.role! : 'ASESOR COMERCIAL',
                sucursal: lead?.sucursal?.name || '',
              }}
              idQuoute={modalVehicle.id!}
              nextStep={() => {}}
              concesionarioCode={lead?.concesionario?.code}
            />
          </div>
        )}
      </Drawer> */}
    </div>
  );
};
export default QuoteButtons;
