/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  CheckCircleOutlined,
  CheckOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Input, Tooltip } from 'antd';
import React from 'react';

interface Props {
  label: string;
  value: string | null;
  onSave: (url: string) => void;
  optional?: boolean;
}

export default class InvoiceUpload extends React.PureComponent<Props> {
  static defaultProps = {
    optional: false,
  };

  state = { invoiceNumber: '', editable: true };
  componentDidMount() {
    if (this.props.value) {
      this.setState({ invoiceNumber: this.props.value, editable: false });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.value !== prevProps.value) {
      this.setState({ editable: false });
    }
  }

  onClick = () => {
    const { onSave, value } = this.props;
    const { invoiceNumber, editable } = this.state;
    if (editable) {
      if (invoiceNumber === value) {
        // si esta actualizando el valor pro este no ha cambiado del original
        this.setState({ editable: false });
      } else if (invoiceNumber.trim().length > 0) {
        // si ha ingredado un valor valido
        onSave(invoiceNumber);
      }
    } else {
      // si desea modificar un valor previamente guardado
      this.setState({ editable: true });
    }
  };

  render() {
    const { label, optional, value, onSave } = this.props;
    const { invoiceNumber, editable } = this.state;
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <CheckCircleOutlined
            style={{ color: value ? '#1890ff' : '#ccc', fontSize: 20 }}
          />
          <span className="ml-2">{label}</span>
          {optional && (
            <span className="bold ml-2" style={{ color: '#ff0000' }}>
              *
            </span>
          )}
        </div>
        <div className="flex ml-2">
          <Input
            value={invoiceNumber}
            type="number"
            style={{ width: 150 }}
            placeholder="Número"
            disabled={!editable}
            onChange={(e) => this.setState({ invoiceNumber: e.target.value })}
          />
          <Tooltip title={editable ? 'Guardar' : 'Editar'}>
            <Button
              onClick={this.onClick}
              type="primary"
              icon={editable ? <CheckOutlined /> : <EditOutlined />}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}
