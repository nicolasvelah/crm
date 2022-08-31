import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import { Button, Modal, Timeline, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons/lib';
import FormFollow from '../../pages/Follow/components/FormFollow';
import { DataTracing } from '../../pages/Follow/components/MainFollow';
import Tracings from '../../data/models/Tracings';
import { ClientLeadContext } from '../GetClientData';

const ModalForm: FunctionComponent<{
  indetificationModal: string | null;
  optionBtn?: boolean;
  idLead?: number;
  block?: boolean;
  setDataTableTracings?: React.Dispatch<React.SetStateAction<DataTracing[]>>;
  setDataTimeLine?: React.Dispatch<React.SetStateAction<Tracings[]>>;
}> = ({
  indetificationModal,
  optionBtn,
  idLead,
  block,
  setDataTableTracings,
  setDataTimeLine,
}) => {
  useEffect(() => {
    // console.log('TRACING DETAILS', optionBtn);
  }, []);

  const [viewModal, setViewModal] = useState(false);
  // PARA RECARGAR LA PAGUINA SI SE CERRO EL SEGUIMIENTO
  const [reloading, setReloading] = useState<boolean>();
  const reloadingPage = (booleanData: boolean) => {
    setReloading(booleanData);
  };

  const { lead } = useContext(ClientLeadContext);

  return (
    <>
      {optionBtn ? (
        <Button
          size="large"
          type="primary"
          className="px-5"
          onClick={() => setViewModal(true)}
          style={{ backgroundColor: '' }}
        >
          + Crear
        </Button>
      ) : (
        <Timeline.Item
          className="mb-5"
          dot={
            <div>
              {/* {console.log('BLOCK', block)} */}
              <Tooltip title="Añadir seguimiento">
                <Button
                  disabled={block}
                  onClick={() => {
                    setViewModal(true);
                  }}
                  size="small"
                  shape="circle"
                  type="primary"
                  icon={<PlusOutlined />}
                />
              </Tooltip>
            </div>
          }
        />
      )}

      <Modal
        title=""
        width={800}
        visible={viewModal!}
        onOk={() => {
          setViewModal(false);
          if (reloading) {
            window.location.reload();
          }
        }}
        onCancel={() => {
          setViewModal(false);
        }}
        footer={[
          <Button
            type="primary"
            key="back"
            onClick={() => {
              setViewModal(false);
              if (reloading) {
                window.location.reload();
              }
            }}
          >
            Regresar
          </Button>,
        ]}
      >
        <FormFollow
          identificationInput={indetificationModal}
          //reloadingPage={reloadingPage}
          preData={
            lead
              ? {
                  client: lead.client!,
                  userGUC: lead.user!,
                }
              : undefined
          }
          idLead={idLead}
          setDataTableTracings={setDataTableTracings}
          setDataTimeLine={setDataTimeLine}
        />
      </Modal>
    </>
  );
};

export default ModalForm;
