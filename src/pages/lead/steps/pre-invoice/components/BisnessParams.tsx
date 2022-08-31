/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
import { InputNumber, Col, Input, Row, Checkbox } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { currenyFormat } from '../../../../../utils/extras';
import PanelView from '../../../../../components/PanelView';
import PreInvoiceController from '../pre-invoice-controller';
import TableTemplate from '../../../../../components/TableTemplate';
import auth from '../../../../../utils/auth';

@inject('preInvoiceController')
@observer
export default class BisnessParams extends React.PureComponent<{
  preInvoiceController?: PreInvoiceController;
}> {
  render() {
    const {
      prebillInput,
      quote,
      discount,
      onDiscountChange,
      prebillStatus,
      onVehicleAprecialValueChange,
      onCheckSeminuevos,
    } = this.props.preInvoiceController!;

    if (!prebillInput || !quote) return <div />;

    const { insuranceCarrier } = quote!;
    const vehiculoPago = quote!.mechanicalAppraisalQuote;
    const jefeVentas = auth.user!.role === 'JEFE DE VENTAS';
    const vehicle = quote.vehiculo![0];
    let rows: any[] = [
      {
        label: 'Valor a pagar',
        content: (
          <div className="text-2xl font-bold" style={{ color: '#388e3c' }}>
            {/* {currenyFormat(prebillInput ? prebillInput.valortotal! : 0)} Inc. */}
            {currenyFormat(0)} Inc.
            IVA
          </div>
        ),
      },
      {
        label: 'Forma de pago',
        content: quote!.type === 'credit' ? 'Crédito' : 'Contado',
      },
    ];

    if (quote!.type === 'credit') {
      rows = rows.concat([
        {
          label: 'Entrada',
          content: currenyFormat(
            0
          ),
        },
        {
          label: 'Saldo a financiar',
          content: currenyFormat(0),
        },
        {
          label: 'Meses plazo',
          content: quote!.months || 0,
        },
        // {
        //   label: 'Valor Cuota sin seguro',
        //   content: currenyFormat(
        //     quote!.monthly - insuranceCarrier.monthlyPayment
        //   ),
        // },
        // {
        //   label: 'Valor Cuota con seguro',
        //   content: currenyFormat(quote!.monthly),
        // },
      ]);
    }

    rows = rows.concat([
      {
        label: 'VIN',
        content: `${quote.vimVehiculo}`,
      },
      {
        label: 'Auto como parte de pago',
        content: vehiculoPago ? 'SI' : 'NO',
      },
    ]);

    if (vehiculoPago) {
      rows = rows.concat([
        {
          label: 'Marca',
          content: (
            <div className="py-1">
              <Input value={vehiculoPago.brand} disabled />
            </div>
          ),
        },
        {
          label: 'Modelo',
          content: (
            <div className="py-1">
              <Input value={vehiculoPago.model} disabled />
            </div>
          ),
        },
        {
          label: 'Año',
          content: (
            <div className="py-1">
              <Input value={`${vehiculoPago.year}`} disabled />
            </div>
          ),
        },
        {
          label: 'Kilometraje',
          content: (
            <div className="py-1">
              <Input value={vehiculoPago.mileage} disabled />
            </div>
          ),
        },
      ]);
    }
    const { preOwnedSupplier } = quote!;
    if (preOwnedSupplier && vehiculoPago) {
      const acceptedAppraisal = quote!.acceptedAppraisal
        ? quote!.acceptedAppraisal === true
        : false;

      rows = rows.concat([
        {
          title: 'Datos del proveedor de seminuevos',
        },
        {
          label: 'Razón Social',
          content: (
            <div className="py-1">
              <Input value={preOwnedSupplier.bussinessName} disabled />
            </div>
          ),
        },
        {
          label: 'Identificación',
          content: (
            <div className="py-1">
              <Input value={preOwnedSupplier.identification} disabled />
            </div>
          ),
        },
        {
          label: 'Celular',
          content: (
            <div className="py-1">
              <Input value={preOwnedSupplier.phone} disabled />
            </div>
          ),
        },
        {
          label: 'Email',
          content: (
            <div className="py-1">
              <Input value={preOwnedSupplier.email} disabled />
            </div>
          ),
        },
        {
          label: 'Valor Avalúo',
          content: (
            <div className="py-1">
              <Input
                defaultValue={vehiculoPago.desiredPrice}
                disabled={
                  !(prebillStatus === 'NONE' || prebillStatus === 'REJECTED') ||
                  jefeVentas
                }
                type="number"
                onChange={(e) => {
                  onVehicleAprecialValueChange(parseFloat(e.target.value));
                }}
              />
            </div>
          ),
        },
        {
          title: '¿El cliente aceptó la oferta?',
          content: (
            <div
              className="text-lg"
              style={{ color: acceptedAppraisal ? '#388e3c' : '#ff0000' }}
            >
              {acceptedAppraisal ? 'SI' : 'NO'}
            </div>
          ),
        },
        {
          label: '',
          content: (
            <label>
              <div className="flex items-center">
                <Checkbox
                  onChange={(e) => {
                    onCheckSeminuevos(e.target.checked);
                  }}
                  checked={false}
                  disabled={
                    jefeVentas ||
                    prebillStatus === 'APPROVED' ||
                    prebillStatus === 'REQUESTED'
                  }
                />
                <div className="ml-2 noselect" style={{ lineHeight: 1 }}>
                  Solicitar excepción de comisión del proveedor de seminuevos
                </div>
              </div>
            </label>
          ),
        },
      ]);
    }

    const { chosenEntity } = quote!;

    let rowsFinancial: any[] = [
      {
        label: 'Descuento otorgado (%)',
        content: (
          <div className="py-1 flex items-center">
            <InputNumber
              onChange={(e) => {
                if (typeof e === 'number') {
                  onDiscountChange(e);
                }
              }}
              type="number"
              min={0}
              max={100}
              value={discount}
              disabled={
                jefeVentas ||
                prebillStatus === 'APPROVED' ||
                prebillStatus === 'REQUESTED'
              }
              style={{ maxWidth: 100 }}
            />
          </div>
        ),
      },
    ];

    if (chosenEntity) {
      rowsFinancial = rowsFinancial.concat([
        {
          label: 'Financiera',
          content: (
            <div className="py-1">
              <Input value={chosenEntity.entity} disabled />
            </div>
          ),
        },
      ]);
    }

    if (insuranceCarrier) {
      rowsFinancial = rowsFinancial.concat([
        {
          label: 'Aseguradora',
          content: (
            <div className="py-1">
              <Input value={insuranceCarrier.name} disabled />
            </div>
          ),
        },
      ]);
    }

    //console.log('prebillInput.checkSeminuevos', prebillInput.checkSeminuevos);

    return (
      <PanelView
        customHeader={
          <div className="font-bold text-lg">Parámetros de Negocio</div>
        }
      >
        <Row gutter={25} className="pb-4">
          <Col md={12}>
            <TableTemplate rows={rows} />
          </Col>
          <Col md={12}>
            <TableTemplate rows={rowsFinancial} />
          </Col>
        </Row>
      </PanelView>
    );
  }
}
