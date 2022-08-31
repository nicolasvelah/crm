import React, { useEffect, useState } from 'react';
import { InfoCircleOutlined, WarningFilled } from '@ant-design/icons';
import { IValidations } from '../interfaces/iContactar';

const Validation = ({ message, param, value }: IValidations) => {
  const [color, setColor] = useState('warning');
  console.log('🔴🔴', message, param, value)
  useEffect(() => {
    switch (param) {
      case 'CEDULA':
        if (value.length === 10) {
          setColor('error');
        } else {
          setColor('warning');
        }
        break;
      case 'RUC':
        if (value.length === 13) {
          setColor('error');
        } else {
          setColor('warning');
        }
        break;
    }
  }, [value, param]);

  return (
    <div className="validations">
      {color === 'error' ? (
        <WarningFilled className={`validations-error validations-icon`} />
      ) : (
        <InfoCircleOutlined
          className={`validations-warning validations-icon`}
        />
      )}
      <span className={`validations-${color}`}>{message}</span>
    </div>
  );
};

export default Validation;
