import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Table } from 'antd';
import WalletContext from './WalletContext';

export interface MainTableProps {}

const MainTable: FunctionComponent<{
  columns: any;
  dataSourceFilter: any;
  noti?: any;
}> = ({ columns, dataSourceFilter, noti }) => {
  const [dataSource, setDataSource] = useState<any>(dataSourceFilter);
  const [dataColum, setDatacolum] = useState<any>();
  const { dataTable, setDataTable } = useContext(WalletContext);

  useEffect(() => {
    setDataSource(dataSourceFilter);
    setDatacolum(columns);
  }, []);

  return (
    <div>
      <Table
        className="mt-5"
        columns={columns as any}
        dataSource={dataSourceFilter}
        scroll={{ y: window.innerHeight * 0.55 }}
      />
    </div>
  );
};

export default MainTable;
