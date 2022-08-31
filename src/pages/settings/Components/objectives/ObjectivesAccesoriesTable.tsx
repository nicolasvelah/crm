/* eslint-disable no-unused-vars */
import { Button, message, Popconfirm, Table } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { ObjectivesAccessories } from '../../../../data/models/Objectives';
import Get from '../../../../utils/Get';
import { Dependencies } from '../../../../dependency-injection';
import ObjectivesRepository from '../../../../data/repositories/objetives-repository';
import Loading from '../../../../components/Loading';

export interface ObjectivesAccesoriesTableProps {
  dataTable: any;
}

export interface ObjectivesAndKey {
  key: number;
  id: number;
  idConcessionaire: string;
  concessionaire: string;
  idSucursal: string;
  sucursal: string;
  idAdviser: number;
  adviser: string;
  idVersion: string;
  exonerated: number;
  month: number;
  budgetYear: number;
  amountAccessories: number;
  counted: number;
  type: string;
  createdAt: string;
}
const ObjectivesAccesoriesTable: FunctionComponent<ObjectivesAccesoriesTableProps> = ({
  dataTable,
}) => {
  const objectivesRepository = Get.find<ObjectivesRepository>(
    Dependencies.objectives
  );
  const [objectivesTableData, setObjectivesTableData] = useState<
    ObjectivesAndKey[] | []
  >();

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    // obtenemos todos los objetivos dependiedo del concesionario
    const getAllObjectives = async () => {
      setLoading(true);
      if (dataTable.length > 0) {
        const restructureData: ObjectivesAndKey[] = dataTable.map(
          (data: ObjectivesAccessories, index: number) => {
            return { ...data, key: index };
          }
        );
        setObjectivesTableData(restructureData);
        console.log('useEffect_DEBUG: desde carga ', restructureData);
      } else {
        const respObjectives:
          | ObjectivesAccessories[]
          | null = await objectivesRepository.getObjectivesAccessories();

        if (respObjectives?.length === 0) {
          message.warning('No exite datos registrados');
        } else if (respObjectives && respObjectives.length > 0) {
          const restructureData: ObjectivesAndKey[] = respObjectives.map(
            (data: ObjectivesAccessories, index: number) => {
              return { ...data, key: index };
            }
          );
          setObjectivesTableData(restructureData);
          console.log('useEffect_DEBUG: inicial', restructureData);
        }
      }
      setLoading(false);
    };
    getAllObjectives();
  }, [dataTable]);

  const deleteObjectives = async (id: number, adviser: string) => {
    //console.log('deleteObjectives', id);
    const respDeleteObjectives: boolean = await objectivesRepository.deleteObjective(
      id
    );
    if (respDeleteObjectives) {
      const respObjectives:
        | ObjectivesAccessories[]
        | null = await objectivesRepository.getObjectivesAccessories();

      if (respObjectives?.length === 0) {
        message.warning('Se elimino todos los registros');
        setObjectivesTableData([]);
      } else if (respObjectives && respObjectives.length > 0) {
        const restructureData: ObjectivesAndKey[] = respObjectives.map(
          (data: ObjectivesAccessories, index: number) => {
            return { ...data, key: index };
          }
        );
        setObjectivesTableData(restructureData);
        message.success(`Se elimino el objetivo del usuario ${adviser}`);
        //console.log('useEffect_DEBUG: inicial', restructureData);
      }
    }
    //console.log('Objeto eliminado', respDeleteObjectives);
  };
  const columns = [
    {
      title: 'Id Asesor',
      dataIndex: 'idAdviser',
      key: 'idAdviser',
    },
    {
      title: 'Asesor',
      dataIndex: 'adviser',
      key: 'adviser',
    },
    {
      title: 'Concesionario',
      dataIndex: 'concessionaire',
      key: 'concessionaire',
    },
    {
      title: 'Sucursal',
      dataIndex: 'sucursal',
      key: 'sucursal',
    },
    {
      title: 'Id Versión',
      dataIndex: 'idVersion',
      key: 'idVersion',
    },
    {
      title: 'Exonerado',
      dataIndex: 'exonerated',
      key: 'exonerated',
    },
    {
      title: 'Contado',
      dataIndex: 'counted',
      key: 'counted',
    },
    {
      title: 'Mes',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Monto accesorios',
      dataIndex: 'amountAccessories',
      key: 'amountAccessories',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, row: any) => {
        return (
          <div>
            <Popconfirm
              placement="rightTop"
              title={`Esta seguro de eliminar el objetivo del asesor ${row.adviser}`}
              onConfirm={async () => {
                deleteObjectives(row.id, row.adviser);
              }}
              okText="Si"
              cancelText="No"
            >
              <Button
                shape="round"
                icon={<DeleteOutlined />}
                danger
                style={{ marginLeft: 10 }}
                type="link"
              >
                <span className="leading-none">Eliminar</span>
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={objectivesTableData} />
      <Loading
        visible={loading}
      />
    </div>
  );
};

export default ObjectivesAccesoriesTable;
