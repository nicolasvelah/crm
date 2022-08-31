/* eslint-disable no-unused-vars */
import React, { useState, FunctionComponent, useEffect } from 'react';
import { Upload, Button, message, Alert } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import CRMRepository from '../../../data/repositories/CRM-repository';
import Loading from '../../../components/Loading';
import { ResponseExcelObjectives } from '../../../data/providers/api/api-CRM';
import ObjectivesRepository from '../../../data/repositories/objetives-repository';
import {
  Objectives,
  ObjectivesAccessories,
  ObjectivesAllies,
} from '../../../data/models/Objectives';

const { Dragger } = Upload;

const UploadExcelObjectivesAllies: FunctionComponent<{ data: Function }> = ({
  data,
}) => {
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const objectivesRepository = Get.find<ObjectivesRepository>(
    Dependencies.objectives
  );
  const [fileExcel, setFileExcel] = useState<any[]>([]);
  const [nameFile, setNameFile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorsResponse, setErrorsResponse] = useState<
    ResponseExcelObjectives[]
  >([]);

  const upload = async () => {
    if (fileExcel.length === 0) {
      message.error('Selecione un archivo Excel');
      return;
    }
    setLoading(true);
    //upload Excel
    const responseUpload = await CRMRepository.uploadExcelObjectivesAllies({
      file: fileExcel[0],
      metadata: { name: nameFile },
    });

    setLoading(false);
    if (!responseUpload) {
      message.error('Error al subir el archivo Excel');
      return;
    }
    const respObjectives: ObjectivesAllies[] | null =
      await objectivesRepository.getObjectivesAllies();
    if (respObjectives) {
      data(respObjectives);
    }

    const objectivesNotAdded = responseUpload.filter(
      (resp) => !resp.addedInGUC
    );
    if (objectivesNotAdded.length > 0) {
      message.warning('No todas las metas fueron agregadas al GUC');
      setErrorsResponse(objectivesNotAdded);
    } else {
      message.success('Objetivos Agregadas');
    }

    setFileExcel([]);
    setNameFile(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Link to="/excel/Template_aliados_excel.xlsx" target="_blank">
        Descargar excel base
      </Link>
      <div>
        <div style={{ marginTop: 10, marginBottom: 5 }}>
          <div>
            <Dragger
              onRemove={(file) => {
                setFileExcel([]);
                setErrorsResponse([]);
                setNameFile(null);
              }}
              beforeUpload={(file) => {
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
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click o arrastre el archivo a esta área
              </p>
              <p className="ant-upload-hint">
                Recuerde que la extesión debe ser .xls y un tamaño menor a 4MB
              </p>
            </Dragger>
          </div>
        </div>
        <div style={{ width: '100%', marginTop: 10 }}>
          <Button
            type="primary"
            onClick={upload}
            disabled={fileExcel.length === 0}
            style={{ width: '100%' }}
          >
            Subir
          </Button>
        </div>
        <TableError errors={errorsResponse} />
      </div>
      <Loading visible={loading} />
    </div>
  );
};

const TableError: FunctionComponent<{ errors: ResponseExcelObjectives[] }> = ({
  errors,
}) => {
  const styleThTd = { border: '1px solid #dddddd', padding: 5 };
  if (errors.length === 0) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <Alert
        className="mt-5 text-center"
        message="Las siguientes metas no pudieron agregarse al GUC"
        type="warning"
      />
      <table width="100%" style={{ marginTop: 5 }}>
        <thead>
          <tr>
            <th style={{ ...styleThTd, width: '25%' }}>idMeta</th>
            <th style={styleThTd}>Errores</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((err, indexa) => (
            <tr key={`row_error_${err.idObjective}_${indexa}`}>
              <td style={styleThTd}>{err.idObjective ?? 'Meta desconocida'}</td>
              <td style={styleThTd}>
                <ul>
                  {err.errors &&
                    err.errors.map((error, index) => (
                      <li key={`item_error_${index}`}>{error}</li>
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

export default UploadExcelObjectivesAllies;
