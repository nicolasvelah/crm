/* eslint-disable no-restricted-properties */
import React, { FunctionComponent } from 'react';
import { Form, Select, Radio } from 'antd';
import { currenyFormat } from '../../../utils/extras';

const { Option } = Select;

const Exonerated: FunctionComponent<{
  setPvpExternal: (newPvp: number) => void;
  setTypeExonerated: (newType: string) => void;
  setGrade: (newGarde: string) => void;
  exoneratePvp: any;
  pvp: number;
  typeExonerated: string;
  grade: string;
  
}> = ({
  setPvpExternal,
  setTypeExonerated,
  setGrade,
  exoneratePvp,
  pvp,
  typeExonerated,
  grade,

}) => {
  if (typeExonerated === 'diplomatics') {
    setPvpExternal(exoneratePvp.diplomatic);
  }

  return (
    <div>
      <Form.Item
        label="Tipo exonerado"
        name="exoneratedtype"
        rules={[{ required: true, message: 'Selecciona un tipo' }]}
      >
        <Radio.Group
          onChange={(e) => {
            setTypeExonerated(e.target.value);
          }}
        >
          <Radio.Button value="diplomatics">Diplomáticos</Radio.Button>
          <Radio.Button value="disabled">Discapacitados</Radio.Button>
        </Radio.Group>
      </Form.Item>
      {typeExonerated === 'disabled' && (
        <Form.Item
          label="% de discapacidad"
          name="disabilityRange"
          rules={[{ required: true, message: 'Selecciona el rango' }]}
        >
          <Select
            placeholder="Seleccion un rango de discapacidad"
            onChange={(value: string) => {
              setGrade(value);
              setPvpExternal(exoneratePvp.disabled[value]);
            }}
          >
            {exoneratePvp.disabled.a !== 0 && (
              <Option value="a">30% - 49%</Option>
            )}
            {exoneratePvp.disabled.b !== 0 && (
              <Option value="b">50% - 74%</Option>
            )}
            {exoneratePvp.disabled.c !== 0 && (
              <Option value="c">75% - 84%</Option>
            )}
            {exoneratePvp.disabled.d !== 0 && (
              <Option value="d">85% - 100%</Option>
            )}
          </Select>
        </Form.Item>
      )}
      {typeExonerated === 'diplomatics' ||
      (typeExonerated === 'disabled' && grade !== '') ? (
        <Form.Item label="PVP exonerado" name="exoneratedPVP">
          <div className="font-bold text-xl">{currenyFormat(pvp, true)}</div>
        </Form.Item>
      ) : null}
    </div>
  );
};

export default Exonerated;
