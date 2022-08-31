import React, { useState, FunctionComponent } from 'react';
import { Button, Modal, Result } from 'antd';
import { DataSurvey } from './BusinessLine';

const SurveyReturn: FunctionComponent<{ dataSurvey: DataSurvey[] }> = ({
  dataSurvey,
}) => {
  const [visibleModal, setVisibleModal] = useState(false);

  //const [dataSurvey, setDataSurvey] = useState<DataSurvey[]>([]);

  const handleOpenModal = () => setVisibleModal(true);
  const handleCloseModal = () => setVisibleModal(false);

  const translateKey = (key: string): string => {
    switch (key) {
      case 'ContactId':
        return 'Id del contacto';
      case 'ContactListName':
        return 'Nombre del contacto';
      case 'ConversationId':
        return 'Id de conversación';
      case 'LastDate':
        return 'Última fecha';
      case 'LastWrapupCode':
        return 'Último código de resumen';
      case 'Phone':
        return 'Celular';

      default:
        return '';
    }
  };

  const table = (data: DataSurvey, key: string | number) => (
    <table
      key={key}
      style={{
        borderCollapse: 'collapse',
        borderColor: '#9d9d9d',
        margin: 5,
        width: '100%',
      }}
    >
      <tbody>
        {Object.keys(data).map((dataKey, index) => (
          <tr key={`tr_${index}`}>
            <td style={{ border: '1px solid #9d9d9d', padding: 5 }}>
              <b>{translateKey(dataKey)}</b>
            </td>
            <td style={{ border: '1px solid #9d9d9d', padding: 5 }}>
              {data[dataKey]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <Button type="link" onClick={handleOpenModal}>
        Datos de encuesta
      </Button>
      <Modal
        title="Datos de Encuesta"
        visible={visibleModal}
        width={600}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div>
          {dataSurvey.map((survey, index) => table(survey, index))}
          {dataSurvey.length === 0 && (
            <Result
              status="warning"
              title="No existen datos para esta encuesta"
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default SurveyReturn;
