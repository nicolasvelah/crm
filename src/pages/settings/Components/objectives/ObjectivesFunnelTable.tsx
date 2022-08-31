import { Button, message, Popconfirm, Table } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

export interface AccesoriesObjectivesTableProps {}

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
  quantity: number;
  margin: number;
  type: string;
  createdAt: string;
}
const ObjectivesFunnelTable: FunctionComponent<{}> = () => {
  const [objectivesTableData, setObjectivesTableData] = useState<
    ObjectivesAndKey[] | []
  >();
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
      dataIndex: 'budgetYear',
      key: 'budgetYear',
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
              onConfirm={async () => {}}
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
    </div>
  );
};

export default ObjectivesFunnelTable;
