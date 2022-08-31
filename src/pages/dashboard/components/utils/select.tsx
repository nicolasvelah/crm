import React, { FunctionComponent } from 'react';
import { Select } from 'antd';

const { Option, OptGroup } = Select;

function handleChange(value: string) {
  //console.log(`selected ${value}`);
}

const SelectContainer: FunctionComponent = () => {
  return (
    <>
      <Select
        defaultValue="lucy"
        style={{ width: 200 }}
        onChange={handleChange}
      >
        <Option value="jack">Camilo Vela</Option>
        <Option value="lucy">Lucy Riofrio</Option>
      </Select>
    </>
  );
};

export default SelectContainer;
