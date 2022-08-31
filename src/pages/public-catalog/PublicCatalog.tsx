/* eslint-disable no-unused-vars */
import { SmileOutlined } from '@ant-design/icons';
import { Divider, Result, Spin } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Brands from './components/Brands';
import VehicleModel from './components/VehicleModel';
import PublicCatalogContext from './context/PublicCatalogContext';
import './css/public-catalog.scss';

export interface CatalogPublicProps {}

const PublicCatalog = () => {
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalogVehicle, setCatalogVehicle] = useState<null | [] | undefined>(
    null
  );

  const [clientData, setClientDataContext] = useState<null | [] | undefined>(
    null
  );
  const [sucursalContext, setSucursalContext] = useState<null | [] | undefined>(
    null
  );
  useEffect(() => {}, []);

  const [quote, setQuote] = useState<null | [] | undefined>(null);
  const cierre = () => {
    window.onbeforeunload = function () {
      return 'Do you really want to close?';
    };
  };
  cierre();
  console.log(
    '%cWARNING Área restringida! ',
    'color: red; font-size:3.2em;'
  );
  
  return (
    <PublicCatalogContext.Provider
      value={{
        brand,
        setBrand,
        catalogVehicle,
        setCatalogVehicle,
        setLoading,
        loading,
        clientData,
        setClientDataContext,
        sucursalContext,
        setSucursalContext,
        quote,
        setQuote,
      }}
    >
      <>
        <Spin tip="Cargando..." spinning={loading}>
          <div className="main-public-catalog">
            <Divider orientation="left">
              <h2>Catálogo de vehículos</h2>
            </Divider>
            <Brands />
            <div>
              {catalogVehicle && catalogVehicle.length > 0 ? (
                <div>
                  <VehicleModel dataVehicleModel={catalogVehicle} />
                </div>
              ) : (
                <div>
                  {catalogVehicle === undefined ? (
                    <div>
                      <Result
                        status="warning"
                        title="Upps, no hemos podido traer los vehículos, inténtalo en unos segundos."
                      />
                    </div>
                  ) : (
                    <div>
                      <Result
                        icon={<SmileOutlined />}
                        title="Bienvenid@, selecciona una marca"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Spin>
      </>
    </PublicCatalogContext.Provider>
  );
};

export default PublicCatalog;
