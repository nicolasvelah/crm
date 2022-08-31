/* eslint-disable no-unused-vars */
import { Card, Row, Col, Result, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import CRMRepository from '../../../data/repositories/CRM-repository';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import PublicCatalogContext from '../context/PublicCatalogContext';

export interface BrandsProps {}
const brandsGuc = [
  {
    codigo: 1,
    descripcion: 'MAZDA',
  },
  {
    codigo: 2,
    descripcion: 'FIAT',
  },
  {
    codigo: 3,
    descripcion: 'JEEP',
  },
  {
    codigo: 4,
    descripcion: 'DODGE',
  },
  {
    codigo: 10,
    descripcion: 'FORD',
  },
  {
    codigo: 11,
    descripcion: 'RAM',
  },
  {
    codigo: 17,
    descripcion: 'CHERY',
  },
  {
    codigo: 23,
    descripcion: 'DONGFENG',
  },
];
const Brands = () => {
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const [brands, setBrands] = useState<string[]>([]);
  const { setCatalogVehicle, setLoading, setBrand, brand } =
    useContext(PublicCatalogContext);

  useEffect(() => {
    const query = window.location.search.substring(1);
    const searchParam = new URLSearchParams(query);
    const urlBrands = searchParam.get('brands');
    if (urlBrands) {
      const arrayBrandsParams = urlBrands.split(',').map(Number);
      const marcas: any = [];
      if (arrayBrandsParams) {
        arrayBrandsParams.map((data: any) => {
          brandsGuc.map((dataBrands: any) => {
            if (dataBrands.codigo === data) {
              marcas.push(dataBrands.descripcion);
            }
            return true;
          });
          return true;
        });
      }
      setBrands(marcas);
    }
    //const getBrandsApi = ['MAZDA', 'FIAT', 'JEEP', 'DODGE', 'RAM'];
    //setBrands(getBrandsApi);
  }, []);

  const getPublicCatalogVehicle = async (brandCatalog: string) => {
    if (setLoading) setLoading(true);
    const responseGetVehicle = await CRMRepository.getPublicCatalog(
      'POST',
      '/api/v1/public-catalog/get-catalog',
      {
        data: {
          brand: brandCatalog,
        },
      }
    );
    if (!responseGetVehicle) {
      if (setCatalogVehicle) setCatalogVehicle(undefined);
      message.error('Error al traer catálogos');
      if (setLoading) setLoading(false);
      return;
    }
    if (setCatalogVehicle) setCatalogVehicle(responseGetVehicle.data);
    if (setLoading) setLoading(false);
  };
  const setSelectedBrand = async (value: string) => {
    if (setBrand) setBrand(value);
    if (getPublicCatalogVehicle) await getPublicCatalogVehicle(value);
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        {brands.map((data: string, index: number) => (
          <Col
            key={index}
            className="gutter-row"
            xs={{ span: 32 }}
            lg={{ span: 6 }}
          >
            <Card
              bordered
              className="text-xlx2 text-center cursor-pointer"
              onClick={() => {
                setSelectedBrand(data);
              }}
            >
              {brand === data ? (
                <b style={{ color: '#ff8f00' }}>{data}</b>
              ) : (
                data
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Brands;
