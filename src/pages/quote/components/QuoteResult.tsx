/* eslint-disable no-restricted-properties */
import React, { FunctionComponent, useState, useContext } from 'react';
import { Form, Tag, Tooltip, Button } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import AspectRatio from '../../../components/AspectRatio';
import { currenyFormat, calcTotal, subTotal } from '../../../utils/extras';
import TestDriver from '../../catalog/components/testDiver/TestDriverV2';
import { ClientLeadContext } from '../../../components/GetClientData';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Result: FunctionComponent<{
  nextStep: Function;
  setViewTestDriver?: Function;
  insuranceAmountYear: number;
  insuranceAmountYears: number;
  insuranceAmount: number;
  insuranceYears: number;
  insuranceName: string;
  accesoriesServices: any;
  accesoriesAmount: number;
  servicesAmount: number;
  legals: number;
  pvp: number;
  cuota: number;
  imgurl: string;
  total: number;
  paymenType: string;
  Exonerated: boolean;
  typeExonerated: string;
  grade: string;
  autoPayment: boolean;
  EntryQuantity: number;
  rate: number;
  months: number;
  carRegistration: number;
  activeDevice: boolean;
  device: number;
  deviceYears: number;
  deviceAmountYear: number;
  deviceAmountYears: number;
  modalVehicle?: any;
  setSelectNewVehicle?: Function;
}> = ({
  nextStep,
  insuranceAmountYear,
  insuranceAmountYears,
  insuranceAmount,
  insuranceYears,
  insuranceName,
  accesoriesServices,
  accesoriesAmount,
  servicesAmount,
  legals,
  pvp,
  cuota,
  imgurl,
  total,
  paymenType,
  Exonerated,
  typeExonerated,
  grade,
  autoPayment,
  EntryQuantity,
  rate,
  months,
  carRegistration,
  setViewTestDriver,
  modalVehicle,
  setSelectNewVehicle,
}) => {
  const { lead } = useContext(ClientLeadContext);
  let gradeRender = null;
  if (grade) {
    switch (grade) {
      case 'a': {
        gradeRender = '30% - 49%';
        break;
      }
      case 'b': {
        gradeRender = '50% - 74%';
        break;
      }
      case 'c': {
        gradeRender = '75% - 84%';
        break;
      }
      case 'd': {
        gradeRender = '85% - 100%';
        break;
      }
      default:
    }
  }
  if (typeExonerated !== 'disabled') {
    gradeRender = null;
  }
  //console.log('Insurance', insuranceAmountYear);
  return (
    <div className="shadow mb-5">
      <AspectRatio ratio={9 / 16}>
        <div className="topTags" style={{ marginLeft: 515 }}>
          <Tooltip title="Test Drive">
            <Button
              type="primary"
              shape="circle"
              disabled={!!lead?.saleDown}
              onClick={() => {
                const selectVeh = {
                  marca: modalVehicle.vehiculo[0].brand,
                  modelo: modalVehicle.vehiculo[0].model,
                  imageVehicle: modalVehicle.vehiculo[0].imgs,
                  versions: [],
                  dataVehicle: {
                    anio:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].anio
                        : 2020,
                    cilindraje:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].cylinder
                        : 0,
                    codigo:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].code
                        : '',
                    color:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].color
                        : [],
                    combustible:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].fuel
                        : '',
                    costo:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].cost
                        : 0,
                    descripcion:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].description
                        : '',
                    marca:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].brand
                        : '',
                    margen:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].margen
                        : '',
                    modelo:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].model
                        : '',
                    nropasajeros:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].numPassengers
                        : 0,
                    numaccesorios:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].numaccesorios
                        : 0,
                    numserv:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].numserv
                        : 0,
                    precio:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].pvp
                        : 0,
                    puertas:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].doors
                        : 0,
                    totalstock:
                      modalVehicle.vehiculo && modalVehicle.vehiculo.length > 0
                        ? modalVehicle.vehiculo[0].stock
                        : 0,
                  },
                };
                // @ts-ignore
                setSelectNewVehicle(selectVeh);
                // @ts-ignore
                setViewTestDriver('testDriver');
              }}
            >
              <CarOutlined />
            </Button>
          </Tooltip>
        </div>
        <img src={imgurl} alt="vehículo" className="w-full" style={{}} />
      </AspectRatio>
      <Form
        {...layout}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 16 }}
        className="mt-6"
      >
        {/*
        {!Exonerated ?
          <Form.Item label="Precio" className="mb-0">
            <div className="font-bold text-xl">
              <b>{currenyFormat(pvp)}</b>{' '}<span className="text-sm">Sin IVA</span>
            </div>
          </Form.Item> : null}
          */}
        <Form.Item label="PVP" className="mb-0">
          <div className="font-bold text-base">
            {currenyFormat(pvp * (!Exonerated ? 1.12 : 1))}{' '}
            {!Exonerated ? <span className="text-sm">Inc. IVA</span> : ''}
          </div>
        </Form.Item>
        {accesoriesAmount && accesoriesAmount > 0.1 ? (
          <div>
            <Form.Item label="Accesorios subtotal" className="mb-0">
              <div className="font-bold">{currenyFormat(accesoriesAmount)}</div>
            </Form.Item>
            <Form.Item label="Accesorios total" className="mb-0">
              <div className="font-bold">
                {currenyFormat(accesoriesAmount * 1.12)}{' '}
                <span className="text-sm">Inc. IVA</span>
              </div>
            </Form.Item>
          </div>
        ) : null}
        {servicesAmount ? (
          <div>
            <Form.Item label="Servicios subtotal" className="mb-0">
              <div className="font-bold">{currenyFormat(servicesAmount)}</div>
            </Form.Item>
            <Form.Item label="Servicios total" className="mb-0">
              <div className="font-bold">
                {currenyFormat(servicesAmount * 1.12)}{' '}
                <span className="text-sm">Inc. IVA</span>
              </div>
            </Form.Item>
          </div>
        ) : null}
        {EntryQuantity ? (
          <Form.Item label="Entrada" className="mb-0">
            <div className="font-bold">{currenyFormat(EntryQuantity)}</div>
          </Form.Item>
        ) : null}
        {paymenType ? (
          <Form.Item label="Tipo de pago" className="mb-0">
            <div className="font-bold">
              {paymenType === 'counted' ? 'Contado' : 'Crédito'}
            </div>
          </Form.Item>
        ) : null}
        {paymenType === 'credit' ? (
          <div>
            {rate ? (
              <Form.Item label="Tasa" className="mb-0">
                <div className="font-bold">{rate}</div>
              </Form.Item>
            ) : null}
            {months ? (
              <Form.Item label="Meses plazo" className="mb-0">
                <div className="font-bold">{months}</div>
              </Form.Item>
            ) : null}
          </div>
        ) : null}
        {Exonerated ? (
          <div>
            <Form.Item label="Exonerado" className="mb-0">
              <div className="font-bold">Si</div>
            </Form.Item>
            {typeExonerated ? (
              <Form.Item label="Tipo" className="mb-0">
                <div className="font-bold">
                  {typeExonerated === 'disabled'
                    ? 'Discapacidad'
                    : 'Diplomático'}
                </div>
              </Form.Item>
            ) : null}
            {gradeRender !== null ? (
              <Form.Item label="Grado de discap." className="mb-0">
                <div className="font-bold">{gradeRender}</div>
              </Form.Item>
            ) : null}
          </div>
        ) : null}
        {autoPayment ? (
          <Form.Item label="Auto parte de pago" className="mb-0">
            <div className="font-bold">Si</div>
          </Form.Item>
        ) : null}
        {insuranceAmount !== 0 ? (
          <div>
            <Form.Item label="Aseguradora" className="mb-0">
              <div className="font-bold">{insuranceName}</div>
            </Form.Item>
            {/*<Form.Item label="Valor seguro mensual" className="mb-0">
              <div className="font-bold">
                {currenyFormat(insuranceAmount, true)} {' '}
                <span className="text-sm">Inc. IVA</span>
              </div>
        </Form.Item>*/}
            <Form.Item label="Valor seguro anual" className="mb-0">
              <div className="font-bold">
                {currenyFormat(insuranceAmountYear, true)}{' '}
                <span className="text-sm">Inc. IVA</span>
              </div>
            </Form.Item>
            <Form.Item label="Años de seguro" className="mb-0">
              <div className="font-bold">{insuranceYears}</div>
            </Form.Item>
            {insuranceAmountYears !== 0 ? (
              <Form.Item
                label={`Valor seguro total ${insuranceYears} años`}
                className="mb-0"
              >
                <div className="font-bold">
                  {currenyFormat(insuranceAmountYears)}{' '}
                  <span className="text-sm">Inc. IVA</span>
                </div>
              </Form.Item>
            ) : null}
          </div>
        ) : null}
        {legals > 326 && !Exonerated ? (
          <div>
            <Form.Item label="Gastos legales" className="mb-0">
              <div className="font-bold">{currenyFormat(legals, true)}</div>
            </Form.Item>
          </div>
        ) : null}
        {carRegistration ? (
          <div>
            <Form.Item label="Valor de la matrícula" className="mb-0">
              <div className="font-bold">
                {currenyFormat(carRegistration, true)}
              </div>
            </Form.Item>
          </div>
        ) : null}
        {cuota && paymenType === 'credit' ? (
          <div>
            <Form.Item label="Cuota Referencial" className="mb-0">
              <div className="font-bold text-xl">
                {currenyFormat(cuota, true)}
              </div>
            </Form.Item>
          </div>
        ) : null}
        {total > 0 && paymenType === 'credit' ? (
          <div>
            <Form.Item label="Total a financiar" className="mb-0">
              <div className="font-bold text-xl">
                {currenyFormat(
                  calcTotal(
                    total,
                    pvp,
                    carRegistration,
                    insuranceAmountYears,
                    Exonerated
                  ) -
                    EntryQuantity -
                    carRegistration
                )}
              </div>
            </Form.Item>
          </div>
        ) : null}
        {total > 0 && paymenType ? (
          <div>
            <Form.Item label="Subtotal" className="mb-0">
              <div className="font-bold text-xl">
                {currenyFormat(subTotal(total, insuranceAmountYears))}{' '}
                <span className="text-sm">Sin IVA</span>
                {insuranceAmountYears !== 0 ? (
                  <div className="text-sm mt-0 mb-4">
                    Con seguro {insuranceYears} años
                  </div>
                ) : null}
              </div>
            </Form.Item>
            <Form.Item label="Total" className="mb-0">
              <div className="font-bold text-xl">
                {currenyFormat(
                  calcTotal(
                    total,
                    pvp,
                    carRegistration,
                    insuranceAmountYears,
                    Exonerated
                  )
                )}{' '}
                {!Exonerated ? (
                  <span className="text-sm">Inc. IVA</span>
                ) : (
                  <div className="text-sm">
                    Vehículo sin IVA <br /> Accesorios y otros Inc. IVA
                  </div>
                )}
                {carRegistration !== 0 ? (
                  <div className="text-sm mt-0 mb-4">
                    Incluido {currenyFormat(carRegistration)} de matrícula sin
                    IVA.
                  </div>
                ) : null}
              </div>
            </Form.Item>
          </div>
        ) : null}
      </Form>
    </div>
  );
};

export default Result;
