import React, { FunctionComponent } from 'react';

const ItemForm: FunctionComponent<{
  title: string;
  val: string | number;
  adorno?: string;
  adornoPost?: string;
}> = ({ title, val, adorno, adornoPost }) => {
  return (
    <div className="flex items-center justify-start my-1">
      <div
        className="font-bold px-2 flex justify-end"
        style={{ width: '45.83333333%', textAlign: 'right', lineHeight: 1 }}
      >
        <b>{title}:</b>
      </div>
      <div style={{ width: '45.83333333%' }}>
        {adorno && <span>{adorno}</span>}
        {val}
        {adornoPost && <span className="mx-2">{adornoPost}</span>}
      </div>
    </div>
  );
};

export default ItemForm;
