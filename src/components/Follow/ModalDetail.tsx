import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import { Button, Modal, Tooltip } from 'antd';
import DetailFollow from '../../pages/Follow/components/DetailFollow';
import Tracings from '../../data/models/Tracings';
import VchatContext from '../../pages/Vchat/components/VchatContext';
import { DataTracing } from '../../pages/Follow/components/MainFollow';

const ModalDetail: FunctionComponent<{
  tracing: Tracings;
  optionBtn?: boolean;
  setDataTableTracings?: React.Dispatch<React.SetStateAction<DataTracing[]>>;
  setDataTimeLine?: React.Dispatch<React.SetStateAction<Tracings[]>>;
}> = ({ tracing, optionBtn, setDataTableTracings, setDataTimeLine }) => {
  const [viewModal, setViewModal] = useState(false);
  const { vchatActivated } = useContext(VchatContext);
  useEffect(() => {
    if (vchatActivated) {
      setViewModal(false);
    }
  }, [vchatActivated]);

  // PARA RECARGAR LA PAGUINA SI SE CERRO EL SEGUIMIENTO
  const [reloading, setReloading] = useState<boolean>();
  const reloadingPage = (booleanData: boolean) => {
    setReloading(booleanData);
  };

  if (!tracing) {
    return <div />;
  }

  return (
    <>
      {optionBtn ? (
        <Button
          onClick={() => {
            setViewModal(true);
          }}
          type="primary"
          shape="round"
        >
          <span className="leading-none">Ver</span>
        </Button>
      ) : (
        <Tooltip title="Detalle seguimiento">
          <Button
            type="text"
            onClick={() => {
              setViewModal(true);
            }}
          >
            {tracing.motive}
          </Button>
        </Tooltip>
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
        <DetailFollow
          idInputModal={tracing.id!}
          reloadingPage={reloadingPage}
          setDataTableTracings={setDataTableTracings}
          setDataTimeLine={setDataTimeLine}
        />
      </Modal>
    </>
  );
};

export default ModalDetail;
