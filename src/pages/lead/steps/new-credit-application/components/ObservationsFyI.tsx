import React, { FunctionComponent } from 'react';
import Form from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';

const ObservationsFyI: FunctionComponent<{
  edit: boolean;
  observationsFyI: string;
  setObservationsFyI: Function;
}> = ({ edit, observationsFyI, setObservationsFyI }) => {
  const onChangeTextArea = (e: any) => {
    const { value }: { value: string } = e.target;
    setObservationsFyI(value);
  };

  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">Observaciones</div>
      <div className="mt-2 w-full">
        <Form.Item>
          <TextArea
            disabled={edit}
            rows={5}
            value={observationsFyI}
            onChange={onChangeTextArea}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default ObservationsFyI;
