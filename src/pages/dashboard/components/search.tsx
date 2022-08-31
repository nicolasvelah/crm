import React, { FunctionComponent } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, AutoComplete } from 'antd';

interface ObjectOptions {
  value:string;
  label:React.ReactNode;
}

interface searchSection {
  label:React.ReactNode;
  options:Array<ObjectOptions>;
}

const renderTitle = (title: string) => {
  return (
    <span>
      {title}
    </span>
  );
};

const renderItem = (title: string, count: number) => {
  return {
    value: title,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {title}
        <span>
          <UserOutlined /> ${count}
        </span>
      </div>
    ),
  };
};

const options:Array<searchSection> = [
  {
    label: renderTitle('Prospectos'),
    options: [renderItem('Nicolás Vela', 10000), renderItem('Denis Lozano', 10600)],
  },
  {
    label: renderTitle('Solicitudes'),
    options: [renderItem('Roberto Ramadán', 60100), renderItem('Verónica Pozo', 30010)],
  },
  {
    label: renderTitle('Avaluos'),
    options: [renderItem('Renato Hidalgo', 100000)],
  },
];

const Search : FunctionComponent = () => {
  return (
    <>
      <AutoComplete
        dropdownClassName="certain-category-search-dropdown"
        dropdownMatchSelectWidth={500}
        style={{ width: 250 }}
        options={options}
      >
        <Input.Search size="large" placeholder="Buscar" />
      </AutoComplete>
    </>
  );
};

export default Search;
