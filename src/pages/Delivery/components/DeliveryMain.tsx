import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';
import { Button, Modal, message, Result, Alert } from 'antd';
import { ClientLeadContext } from '../../../components/GetClientData';
import Prebill from '../../quote/components/Prebill';
import TableVehicles from './TablaVehicles';
import Get from '../../../utils/Get';
import LeadsRepository from '../../../data/repositories/leads-repository';
import { Dependencies } from '../../../dependency-injection';
import DeliveryRepository from '../../../data/repositories/delivery-repository';
import asyncForEach from '../../../utils/async-forEach';
import Loading from '../../../components/Loading';
import Leads from '../../../data/models/Leads';
import CRMRepository from '../../../data/repositories/CRM-repository';
import Quotes from '../../../data/models/Quotes';
import { netType, verifyAllDeliveries } from '../../../utils/extras';

interface CompleteDelivery {
  idDeli: number;
  ok: boolean;
}

const DeliveryMain: FunctionComponent = () => {
  const { client, lead, setLead } = useContext(ClientLeadContext);

  const leadsRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  const [modalPrevillShow, setModalPrevillShow] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [okVins, setOkVins] = useState<boolean>(false);
  const [vimLoad, setVimLoad] = useState<boolean>(false);
  const [completeAllDeliveries, setCompleteAllDeliveries] = useState<
    CompleteDelivery[]
  >([]);
  // Estado que habilita el botón de envio de solicitud a cartera.
  const [sendVerificationWallet, setSendVerificationWallet] =
    useState<boolean>(true);
  const [buttonWallet, setButtonWallet] = useState<boolean>(true);
  const [changeDeliveryStatus, setChangeDeliveryStatus] =
    useState<boolean>(false);
  const deliveryRepository = Get.find<DeliveryRepository>(
    Dependencies.delivery
  );

  /* const verifyAllVins = async () => {
    setLoading(true);
    ///Verificaremos si todos los VIN tienen el estado FACTURADO
    const VINs = lead?.quotes
      ?.filter((quo) => !!quo.delivery)
      .map((quo) => ({ vin: quo.vimVehiculo!, idQuote: quo.id! }));
    if (VINs) {
      //console.log('VINs', VINs);
      const resp = await CRMRepository.verifyVINs(VINs);
      //console.log('resp', resp);
      if (resp) {
        const noFactura = resp.find((fn: any) => !fn.ok);
        //console.log('no Factura', noFactura);
        if (!noFactura) {
          setOkVins(true);
        }
      }
    }
    setLoading(false);
  }; */

  useEffect(() => {
    //verifyAllVins();
  }, []);

  useEffect(() => {
    if (lead?.state === 'Solicitado' || lead?.state === 'Verificado') {
      setButtonWallet(false);
    }
    const allDeliverys = lead?.quotes
      ?.filter((quo) => !!quo.delivery)
      .map((quo) => quo.delivery);

    if (allDeliverys) {
      const allOk = allDeliverys.map((deli) => {
        if (deli?.deliveryFinal) {
          return { idDeli: deli!.id!, ok: true };
        }
        return { idDeli: deli!.id!, ok: false };
      });
      //console.log('Completado ???!!', allOk);
      setCompleteAllDeliveries(allOk);
    }
  }, [lead]);

  const handleCancel = () => {
    setModalPrevillShow(false);
  };

  const sendWallet = async () => {
    setLoadingButton(true);
    const quotesArray: any = [];
    const quoteStateUpdate = lead?.quotes?.map((data: Quotes) => {
      if (data.closed === true) {
        quotesArray.push(data.id);
      }
      return true;
    });

    //console.log('log cartera 1');
    const respRequestCartera =
      await deliveryRepository.authorizathionStatusRequestedLead(quotesArray);
    if (!respRequestCartera.ok) {
      message.error(
        `Error al notificar a cartera. ${respRequestCartera.message}`
      );
      setLoadingButton(false);
      return;
    }

    // Cambia el estado del lead a solicitado
    const resp = await leadsRepository.updateStateLead(lead?.id!, 'Solicitado');
    //const resp = true;
    //console.log('log cartera 2');
    setLoadingButton(false);
    if (resp) {
      setButtonWallet(false);
      setChangeDeliveryStatus(true);
      message.success('Se notificó correctamente a cartera');
    } else {
      message.warn('Ocurrió un error al notificar a cartera');
    }
  };

  /* const verifyAllDeliveries = (): boolean => {
    const allDeliverys = lead?.quotes
      ?.filter((quo) => !!quo.delivery)
      .map((quo) => quo.delivery);

    if (allDeliverys) {
      //console.log('allDeliverys', allDeliverys);
      //Existen deliveries a completar
      const deliveries = allDeliverys.find((all) => {
        if (all && (!all.deliveryFinal || !all.idBusinessHubspot)) {
          return true;
        }
        return false;
      });
      //Si existen deliveries a completar es TRUE sino es FALSE
      return !!deliveries;
    }
    //falso si todavia no esta completo
    return false;
  }; */

  const deliveryFinished = async () => {
    setLoading(true);
    const allDeliverys = lead?.quotes
      ?.filter((quo) => !!quo.delivery)
      .map((quo) => quo.delivery);

    if (allDeliverys) {
      //console.log('allDeliverys', allDeliverys);
      const allOk: CompleteDelivery[] = [];
      await asyncForEach(allDeliverys, async (deli: any) => {
        if (!deli.deliveryFinal) {
          const added: boolean = await deliveryRepository.finishDelivery(
            deli.id!
          );
          allOk.push({ idDeli: deli.id, ok: added });
        } else {
          allOk.push({ idDeli: deli.id, ok: true });
        }
      });
      //console.log('Actualizacion deliveries', allOk);
      const errorFinal = !!allOk.find((all) => !all.ok);
      if (errorFinal) {
        message.error('No se finaliza la venta. Vuelva a intentarlo.');
      } else {
        message.success('Venta finalizada');
        if (setLead) {
          setLead((prevState: Leads) => {
            const copiaLead = prevState;
            const newQuos = copiaLead?.quotes?.map((quo) => {
              const newQu = quo;
              if (newQu.delivery) {
                newQu.delivery.deliveryFinal = true;
              }
              return newQu;
            });
            if (newQuos) {
              copiaLead.quotes = newQuos;
            }
            return { ...copiaLead };
          });
        }
      }
      setCompleteAllDeliveries(allOk);
    }
    setLoading(false);
  };

  if (!client || !lead) return <div>No client</div>;
  if (loading) return <Loading visible={loading} />;
  // Cambio al verificar el vim ya no es centralizado
  /*  if (!okVins) {
    return (
      <Result
        status="warning"
        title="No todos los vehículos tienen factura"
        subTitle="Falta facturar algunos de tus próximos vehículos."
        extra={[
          <div
            key="prefactura"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              style={{
                float: 'right',
                marginBottom: 20,
                zIndex: 11,
                position: 'relative',
              }}
              onClick={verifyAllVins}
            >
              Comprobar facturación
            </Button>
          </div>,
        ]}
      />
    );
  } */

  const noComplete = verifyAllDeliveries(lead);
  //const noComplete = verifyAllDeliveries();
  //console.log('noComplete', noComplete);
  const isRedExterna =
    netType(lead?.concesionario?.code!).toLowerCase() === 'red externa';

  const loadingVim = (e: any) => {
    //console.log('Button cartera', e);
    setVimLoad(!e);
  };
  return (
    <div>
      {!noComplete ? (
        <>
          <Button
            style={{
              float: 'right',
              marginBottom: 20,
              zIndex: 11,
              position: 'relative',
            }}
            disabled={!!lead.saleDown}
            onClick={() => setModalPrevillShow(true)}
          >
            Ver prefactura
          </Button>
          <TableVehicles
            loadingVim={loadingVim}
            lead={lead}
            client={client}
            documentsCompleted={(_: boolean) => {
              setSendVerificationWallet(_);
            }}
            changeDeliveryStatus={changeDeliveryStatus}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 10,
            }}
          >
            {vimLoad && (
              <div>
                {buttonWallet === true ? (
                  <Button
                    type="primary"
                    loading={loadingButton}
                    onClick={async () => {
                      sendWallet();
                    }}
                    disabled={
                      (isRedExterna ? false : sendVerificationWallet) ||
                      !!lead?.saleDown
                    }
                  >
                    Notificar a cartera
                  </Button>
                ) : (
                  <Alert
                    style={{ marginBottom: 35, marginTop: 10 }}
                    message="Los documentos del negocio han sido enviados a cartera para su revisión    "
                    type="info"
                    closable
                    showIcon
                  />
                )}
              </div>
            )}
          </div>

          {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="primary"
              disabled={!verifyAllDeliveries()}
              size="large"
              onClick={deliveryFinished}
            >
              Finalizar Venta
            </Button>
          </div> */}
        </>
      ) : (
        <div>
          <Result
            status="success"
            title="¡Excelente! La venta fue completada"
            subTitle="🎉 Enhorabuena, has completado todo el proceso de venta 🎉"
            extra={[
              <div
                key="prefactura"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button
                  style={{
                    float: 'right',
                    marginBottom: 20,
                    zIndex: 11,
                    position: 'relative',
                  }}
                  onClick={() => setModalPrevillShow(true)}
                >
                  Ver prefactura
                </Button>
              </div>,
            ]}
          />
        </div>
      )}

      <Modal
        title="Prefactura"
        visible={modalPrevillShow}
        onCancel={handleCancel}
        footer=""
        width={800}
      >
        <Prebill
          client={client}
          vehiclesToShow={lead.quotes!.filter((vh: any) => vh.closed === true)}
          lead={lead}
          descuento={10}
          payThirdPerson
          delivery
        />
      </Modal>
    </div>
  );
};

export default DeliveryMain;
