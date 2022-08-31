import { Button, message, Popconfirm, Table } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { ObjectivesAllies } from '../../../../data/models/Objectives';
import { Dependencies } from '../../../../dependency-injection';
import ObjectivesRepository from '../../../../data/repositories/objetives-repository';
import Get from '../../../../utils/Get';
import Loading from '../../../../components/Loading';

export interface AccesoriesObjectivesTableProps {
  dataTable: any;
}

export interface ObjectivesAndKey {
  key: number;
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
  insurance: number;
  insuranceAmount: number;
  device: number;
  amountDevice: number;
  prepaid: number;
  amountPrepaid: number;
  used: number;
  amountUsed: number;
  createdAt: string;
}
const ObjectivesAlliesTable: FunctionComponent<AccesoriesObjectivesTableProps> = ({
  dataTable,
}) => {
  const [objectivesTableData, setObjectivesTableData] = useState<
    ObjectivesAndKey[] | []
  >();
  const objectivesRepository = Get.find<ObjectivesRepository>(
    Dependencies.objectives
  );
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    // obtenemos todos los objetivos dependiedo del concesionario
    const getAllObjectives = async () => {
      setLoading(true);
      if (dataTable.length > 0) {
        const restructureData: ObjectivesAndKey[] = dataTable.map(
          (data: ObjectivesAllies, index: number) => {
            return { ...data, key: index };
          }
        );
        setObjectivesTableData(restructureData);
        //console.log('useEffect_DEBUG: desde carga ', restructureData);
      } else {
        const respObjectives:
          | ObjectivesAllies[]
          | null = await objectivesRepository.getObjectivesAllies();

        if (respObjectives?.length === 0) {
          message.warning('No exite datos registrados');
        } else if (respObjectives && respObjectives.length > 0) {
          const restructureData: ObjectivesAndKey[] = respObjectives.map(
            (data: ObjectivesAllies, index: number) => {
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
    console.log('deleteObjectives', id);
    const respDeleteObjectives: boolean = await objectivesRepository.deleteObjective(
      id
    );
    if (respDeleteObjectives) {
      const respObjectives:
        | ObjectivesAllies[]
        | null = await objectivesRepository.getObjectivesAllies();

      if (respObjectives?.length === 0) {
        message.warning('Se elimino todos los registros');
        setObjectivesTableData([]);
      } else if (respObjectives && respObjectives.length > 0) {
        const restructureData: ObjectivesAndKey[] = respObjectives.map(
          (data: ObjectivesAllies, index: number) => {
            return { ...data, key: index };
          }
        );
        setObjectivesTableData(restructureData);
        message.success(`Se elimino el objetivo del usuario ${adviser}`);
        console.log('useEffect_DEBUG: inicial', restructureData);
      }
    }
    console.log('Objeto eliminado', respDeleteObjectives);
  };
  const columns = [
    {
      title: 'Id Asesor',
      dataIndex: 'idAdviser',
      key: 'idAdviser',
      width: 200,
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
      width: 200,
    },
    {
      title: 'Exonerado',
      dataIndex: 'exonerated',
      key: 'exonerated',
    },
    {
      title: 'Contado',
      dataIndex: 'budgetYear',
      key: 'budgetYear',
    },
    {
      title: 'Mes',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Cantidad seguro',
      dataIndex: 'insurance',
      key: 'insurance',
      width: 400,
    },
    {
      title: 'Monto seguro',
      dataIndex: 'insuranceAmount',
      key: 'insuranceAmount',
      width: 400,
    },

    {
      title: 'Cantidad dispositivos',
      dataIndex: 'device',
      key: 'device',
      width: 400,
    },
    {
      title: 'Monto dispositivos',
      dataIndex: 'amountDevice',
      key: 'amountDevice',
      width: 400,
    },
    {
      title: 'Cantidad prepagados',
      dataIndex: 'prepaid',
      key: 'prepaid',
      width: 400,
    },
    {
      title: 'Monto Mtto prepagado',
      dataIndex: 'amountPrepaid',
      key: 'amountPrepaid',
      width: 425,
    },
    {
      title: 'Cantidad usados',
      dataIndex: 'used',
      key: 'used',
      width: 400,
    },
    {
      title: 'Monto usados',
      dataIndex: 'amountUsed',
      key: 'amountUsed',
      width: 400,
    },
    {
      title: 'Monto accesorios',
      dataIndex: 'amountAccessories',
      key: 'amountAccessories',
      width: 400,
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
      <Table
        columns={columns}
        dataSource={objectivesTableData}
        scroll={{ x: 2000 }}
        size="small"
      />
      <Loading
        visible={loading}
      />
    </div>
  );
};

export default ObjectivesAlliesTable;
