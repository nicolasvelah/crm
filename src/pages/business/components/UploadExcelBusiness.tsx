import React, { useState, FunctionComponent } from 'react';
import { Upload, Button, message, Alert, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';

import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import CRMRepository from '../../../data/repositories/CRM-repository';
import Loading from '../../../components/Loading';
import { ResponseExcel } from '../../../data/providers/api/api-CRM';

const UploadExcelBusiness = () => {
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  const [fileExcel, setFileExcel] = useState<any[]>([]);
  const [nameFile, setNameFile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorsResponse, setErrorsResponse] = useState<ResponseExcel[]>([]);
  /* const [errorsResponse, setErrorsResponse] = useState<ResponseExcel[]>([
    {
      addedInGUC: true,
      idLead: 6969,
      errors: ['Error 1', 'Error 2'],
    },
    {
      addedInGUC: false,
      idLead: 6967,
      errors: ['Error 1', 'Error 2'],
    },
    {
      addedInGUC: false,
      idLead: 6965,
      errors: ['Error 1', 'Error 2'],
    },
  ]); */

  const upload = async () => {
    if (fileExcel.length === 0) {
      message.error('Selecione un archivo Excel');
      return;
    }
    setLoading(true);
    //upload Excel
    const responseUpload = await CRMRepository.uploadFileExcel({
      file: fileExcel[0],
      metadata: { name: nameFile },
    });

    setLoading(false);
    if (!responseUpload) {
      message.error('Error al subir el archivo Excel');
      return;
    }

    const leadsNotAdded = responseUpload.filter((resp) => !resp.addedInGUC);
    if (leadsNotAdded.length > 0) {
      /*  message.warning('Algunos negocios no han sido agregados');
      const idsLeadNotAdded = leadsNotAdded.reduce(
        (acumulador, valorActual, index) => {
          if (leadsNotAdded.length === index + 1) {
            return `${acumulador} ${valorActual.idLead}`;
          }
          return `${acumulador} ${valorActual.idLead} - `;
        },
        ''
      );
      console.log('idsLeadNotAdded', idsLeadNotAdded);
      notification.warning({
        message: `Los siguientes negocios no pudieron ser agregados al GUC: ${idsLeadNotAdded}`,
        duration: 10,
      }); */
      message.warning('No todos los negocios fueron agregados al GUC');
      setErrorsResponse(leadsNotAdded);
    } else {
      message.success('Negocios Agregados');
    }

    setFileExcel([]);
    setNameFile(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Alert
        className="mt-5 text-center"
        message="Debes subir un archivo Excel no mayor a 4mb"
        type="info"
      />
      <Link
        to="/excel/Template_excel.xlsx"
        target="_blank"
        style={{ marginTop: 5 }}
      >
        Descargar excel base
      </Link>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ marginTop: 5, marginBottom: 5 }}>
          <Upload
            onRemove={(file) => {
              //console.log('Remove file', file);
              setFileExcel([]);
              setErrorsResponse([]);
              setNameFile(null);
            }}
            beforeUpload={(file) => {
              //console.log('Add file', file);
              if (
                file.type !==
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              ) {
                message.error('El documento no es un excel');
                return false;
              }
              const isLt4M = file.size / 1024 / 1024 < 4;
              if (!isLt4M) {
                message.error('¡El archivo debe ser inferior a 4 MB!');
                return false;
              }
              setFileExcel([file]);
              setErrorsResponse([]);
              setNameFile(file.name);

              return false;
            }}
            fileList={fileExcel}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
          </Upload>
        </div>
        <Button
          type="primary"
          onClick={upload}
          disabled={fileExcel.length === 0}
        >
          Subir
        </Button>
        <TableError errors={errorsResponse} />
      </div>
      <Loading visible={loading} />
    </div>
  );
};

const TableError: FunctionComponent<{ errors: ResponseExcel[] }> = ({
  errors,
}) => {
  const styleThTd = { border: '1px solid #dddddd', padding: 5 };
  if (errors.length === 0) return null;
  return (
    <div style={{ width: '80%', marginTop: 10 }}>
      <Alert
        className="mt-5 text-center"
        message="Los siguientes negocios no pudieron agregarse al GUC"
        type="warning"
      />
      <table width="100%" style={{ marginTop: 5 }}>
        <thead>
          <tr>
            <th style={{ ...styleThTd, width: '25%' }}>Id Negocio</th>
            <th style={styleThTd}>Errores</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((err, idx) => (
            <tr key={`row_error_${err.idLead}_${idx}`}>
              <td style={styleThTd}>{err.idLead ?? 'Negocio desconocido'}</td>
              <td style={styleThTd}>
                <ul>
                  {err.errors &&
                    err.errors.map((error, index) => (
                      <li key={`item_error_${err.idLead}_${index}`}>{error}</li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadExcelBusiness;
