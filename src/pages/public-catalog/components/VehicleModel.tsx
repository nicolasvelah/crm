/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
import {
  CarOutlined,
  FilePdfOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Carousel,
  Col,
  Drawer,
  message,
  Result,
  Row,
  Skeleton,
  Space,
  Tooltip,
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import AspectRatio from '../../../components/AspectRatio';
import CRMRepository from '../../../data/repositories/CRM-repository';
import { Dependencies } from '../../../dependency-injection';
import { currenyFormat } from '../../../utils/extras';
import Get from '../../../utils/Get';
import PublicQuoteForm from './PublicQuoteForm';
import PublicCatalogContext from '../context/PublicCatalogContext';

export interface VehicleModelProps {}

const VehicleModel: FunctionComponent<{ dataVehicleModel: any }> = ({
  dataVehicleModel,
}) => {
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const { loading, brand } = useContext(PublicCatalogContext);
  const [loadingExtra, setLoadingExtra] = useState<boolean>(false);
  const [versionIndexLoading, setVersionIndexLoading] = useState<number>(-1);
  const [cotizacionLoading, setCotizacionLoading] = useState<boolean>(false);
  const [cotizacionActive, setCotizacionActive] = useState<boolean>(false);
  const [insuranceData, setInsuranceData] = useState<any>([]);
  const [selectVersion, setSelectVersion] = useState('');
  const [activeVersions, setActiveVersions] = useState(false);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [cotizacionData, setCotizacionData] = useState<any>([]);
  const [versionsImgCover, setVersionsImgCover] = useState('');
  const [versions, setVersions] = useState([]);
  useEffect(() => {
    setActiveVersions(false);
  }, [brand]);

  const activateVersions = (data: any, imageCover: string, modelo: string) => {
    setSelectVersion(modelo);
    setActiveVersions(true);
    setVersionsLoading(true);
    setVersions(data);
    setVersionsImgCover(imageCover);
    setVersionsLoading(false);

    const elmnt = document.getElementById('to-scroll');
    if (elmnt) {
      setTimeout(() => {
        elmnt.scrollIntoView();
      }, 500);
    }
  };

  const closeVersions = () => {
    setActiveVersions(false);
  };
  const selectVehicle = async (code: string) => {
    setLoadingExtra(true);
    try {
      const getVehicleExtraData = await CRMRepository.getPublicCatalog(
        'POST',
        '/api/v1/public-catalog/get-vehicle',
        {
          data: {
            brand,
            code,
          },
        }
      );
      const colorsPhotoRender: any = [];
      await getVehicleExtraData.data.map(async (vehicle: any) => {
        if (vehicle.color) {
          await vehicle.color.map((color: any) => {
            if (color.urlPhoto) {
              colorsPhotoRender.push({
                color: color.id,
                photos: color.urlPhoto,
              });
            }
            return color;
          });
        }
      });

      const newVesions: any = [];
      await versions.map((element: any) => {
        const newElement: any = element;
        if (element.codigo === code) {
          newElement.extradata = getVehicleExtraData.data;
          newElement.extradata[0].imageData = versionsImgCover;
          newElement.colorPhotos = colorsPhotoRender;
        }
        newVesions.push(newElement);
        return newElement;
      });

      setLoadingExtra(false);
      setVersions(newVesions);
      return newVesions;
    } catch (error) {
      setLoadingExtra(false);
      message.error('No se pudo traer la información extra');
      return false;
    }
  };

  const cotizar = async (data: any) => {
    setLoadingExtra(true);
    setCotizacionLoading(true);
    const getInsuranceData = await CRMRepository.getPublicCatalog(
      'POST',
      '/api/v1/public-catalog/get-insurance',
      {
        data: {
          code: data.codigo,
        },
      }
    );

    let newData = null;
    if (getInsuranceData) {
      newData = getInsuranceData.data.map((insu: any) => {
        const seguros = insu?.seguros?.map((segu: any) => ({
          ...segu,
          //subtotal: segu.subtotal * 1.12,
          total: segu.total * 1.12,
        }));
        return { ...insu, seguros };
      });
      //console.log('NewDataInsurance', newData);
    }
    if (newData && newData.length > 0) {
      const dataInsurance = newData[0].seguros;
      const insuranceList: any = [];
      dataInsurance.map((e: any) => {
        const dataI = {
          name: e.aseguradora,
          value: e.total,
        };
        insuranceList.push(dataI);
        return true;
      });
      setInsuranceData(insuranceList);
    }

    let dataToSend: any = [];
    //Verifica si existe la información extra del vehiculo que se obtiene al activar
    //el evento mas información.
    if (data.extradata) {
      dataToSend = data.extradata;
    } else {
      const versionesResp = await selectVehicle(data.codigo);
      if (!versionesResp) {
        message.error('No se encontró la data adicional no hay como cotizar');
        return false;
      }
      versionesResp.map((versionTemp: any) => {
        if (versionTemp.codigo === data.codigo) {
          dataToSend = versionTemp.extradata;
        }
        return versionTemp;
      });
    }
    await setCotizacionData({ ...dataToSend[0], idModelo: data.id_modelo });
    setCotizacionActive(true);
    setCotizacionLoading(false);
    setLoadingExtra(false);
    return dataToSend[0];
  };

  const cotizarClose = () => {
    setCotizacionActive(false);
  };

  const SampleNextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          color: '#979A9A',
          marginRight: '25px',
          fontSize: '19px',
          lineHeight: '1.5715',
        }}
        onClick={onClick}
      >
        <RightOutlined />
      </div>
    );
  };

  const SamplePrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          color: '#979A9A',
          marginLeft: '25px',
          zIndex: 99999,
          fontSize: '19px',
          lineHeight: '1.5715',
        }}
        onClick={onClick}
      >
        <LeftOutlined />
      </div>
    );
  };

  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const finishDrawer = () => {
    setCotizacionActive(false);
    closeVersions();
  };
  return (
    <>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          marginTop: 10,
          minHeight: '70vh',
        }}
      >
        <Row justify="space-around" gutter={[16, 16]}>
          {dataVehicleModel.map((dataModel: any, index: number) => {
            let theBestPrice = 0;
            try {
              theBestPrice = dataModel.versiones
                .filter((ver: any) => ver.precio !== 0)
                .sort((a: any, b: any) => {
                  if (a.precio < b.precio) return -1;
                  if (a.precio > b.precio) return 1;
                  return 0;
                })[0].precio;
            } catch (error) {
              console.log('error theBestPrice', error.message);
            }
            return (
              <Col key={index} xs={20} sm={16} md={12} lg={8}>
                <Card
                  actions={[
                    loading ? (
                      <Space>
                        <Skeleton.Button /> <Skeleton.Button />{' '}
                        <Skeleton.Button />
                      </Space>
                    ) : (
                      <Button
                        type="link"
                        icon={<CarOutlined />}
                        onClick={() => {
                          activateVersions(
                            dataModel.versiones,
                            dataModel.imagen ||
                              '/img/no-image-found-360x250.png',
                            dataModel.modelo
                          );
                        }}
                      >
                        Ver versiones
                      </Button>
                    ),
                  ]}
                >
                  {loading ? (
                    <Skeleton.Image />
                  ) : (
                    <AspectRatio ratio={9 / 16}>
                      <img
                        src={
                          dataModel.imagen || '/img/no-image-found-360x250.png'
                        }
                        alt=""
                        className="w-full"
                        style={{ objectFit: 'cover', height: '100%' }}
                      />
                    </AspectRatio>
                  )}
                  <br />
                  <Skeleton loading={loading}>
                    <Meta
                      title={`${dataModel.marca} ${dataModel.modelo}`}
                      description={
                        <ul>
                          <li
                            style={{
                              listStyleType: 'none',
                              display: 'flex',
                              overflowY: 'auto',
                              scrollbarColor: 'light',
                              scrollbarWidth: 'thin',
                            }}
                          >
                            <div className="flex">
                              {dataModel.ids_colores
                                ? JSON.parse(dataModel.ids_colores).length >=
                                    1 &&
                                  JSON.parse(dataModel.ids_colores).map(
                                    (colorVehicle: any, colorindex: number) => (
                                      <div key={colorindex} className="p-1">
                                        <div
                                          className={`color${colorVehicle} w-4 h-4 border-radius-50 outline-none`}
                                        />
                                      </div>
                                    )
                                  )
                                : null}
                            </div>
                          </li>
                          <li>
                            PVP desde: 
                            {dataModel.precio
                              ? currenyFormat(theBestPrice * 1.12, true)
                              : currenyFormat(0, true)}{' '}
                            Inc. IVA
                          </li>
                          {/*  <li>Stock: {dataModel.stock}</li> */}
                          <li>Versiones: {dataModel.num_versiones}</li>
                        </ul>
                      }
                    />
                  </Skeleton>
                </Card>
              </Col>
            );
          })}
        </Row>
        <div>
          <Drawer
            title={`${brand} ${selectVersion}`}
            visible={activeVersions}
            placement="bottom"
            mask={false}
            onClose={closeVersions}
            getContainer={false}
            style={{
              position: 'absolute',
              height: activeVersions ? '100%' : 0,
            }}
            drawerStyle={{
              backgroundColor: 'rgba(255,255,255,0.6)',
              height: '100%',
            }}
            headerStyle={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            bodyStyle={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            maskStyle={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            zIndex={3}
          >
            <div className="contenedorModeloVersion">
              <div id="to-scroll" />
              {versions ? (
                <Row justify="space-around" gutter={[16, 16]}>
                  {versions.length > 0
                    ? versions.map((data: any, index: number) => (
                        <Col xs={20} sm={16} md={12} lg={8} key={index}>
                          <Card
                            style={{}}
                            actions={[
                              versionsLoading ? (
                                <Skeleton.Button />
                              ) : (
                                <Button
                                  type="link"
                                  loading={
                                    loadingExtra &&
                                    versionIndexLoading === index
                                  }
                                  disabled={
                                    (loadingExtra &&
                                      versionIndexLoading !== index) ||
                                    data.precio === 0
                                  }
                                  onClick={async () => {
                                    setVersionIndexLoading(index);
                                    const dataTosend = await cotizar(data);
                                  }}
                                >
                                  Cotizar
                                </Button>
                              ),

                              versionsLoading ? (
                                <Skeleton.Button />
                              ) : (
                                <Button
                                  type="link"
                                  loading={
                                    loadingExtra &&
                                    versionIndexLoading === index
                                  }
                                  onClick={() => {
                                    selectVehicle(data.codigo);
                                    setVersionIndexLoading(index);
                                  }}
                                  disabled={
                                    !!data.extradata ||
                                    (loadingExtra &&
                                      versionIndexLoading !== index)
                                  }
                                >
                                  Más info
                                </Button>
                              ),
                            ]}
                            loading={versionsLoading}
                          >
                            {versionsLoading ? (
                              <Skeleton.Image />
                            ) : (
                              <div>
                                {data && (
                                  <div>
                                    {data.imagen ? (
                                      <div>
                                        {versionsImgCover && activeVersions && (
                                          <Carousel arrows {...settings}>
                                            {data.imagen.map(
                                              (
                                                photo: any,
                                                indexPhoto: number
                                              ) => (
                                                <div key={indexPhoto}>
                                                  <AspectRatio ratio={9 / 16}>
                                                    <img
                                                      src={photo.link}
                                                      alt="vehicle"
                                                      className="w-full"
                                                      style={{
                                                        objectFit: 'cover',
                                                        height: '100%',
                                                      }}
                                                    />
                                                  </AspectRatio>
                                                </div>
                                              )
                                            )}
                                          </Carousel>
                                        )}
                                      </div>
                                    ) : (
                                      <div style={{ marginBottom: 1 }}>
                                        <AspectRatio ratio={9 / 16}>
                                          <img
                                            src={
                                              versionsImgCover ||
                                              '/img/no-image-found-360x250.png'
                                            }
                                            alt=""
                                            className="w-full"
                                            style={{
                                              objectFit: 'cover',
                                              height: '100%',
                                            }}
                                          />
                                        </AspectRatio>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            <br />
                            <Meta
                              title={`${data.modelo}`}
                              description={
                                <div>
                                  {data.colorPhotos ? (
                                    <div className="flex justify-center mb-5">
                                      {data.colorPhotos.length > 0 ? (
                                        <div
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                          }}
                                        >
                                          {data.colorPhotos.map(
                                            (
                                              color: any,
                                              indexColors: number
                                            ) => (
                                              <div
                                                key={indexColors}
                                                className="mr-2 flex"
                                              >
                                                <div
                                                  className={`color${color.color} w-4 h-4 border-radius-50 outline-none`}
                                                />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <div> </div>
                                      )}
                                    </div>
                                  ) : null}
                                  <ul>
                                    <li>
                                      <b>PVP:</b>
                                      {currenyFormat(
                                        data.precio * 1.12,
                                        true
                                      )}{' '}
                                      <span className="text-sm">Inc. IVA</span>
                                    </li>
                                    {/* <li>
                                      <b>Stock:</b> {data.stock}
                                    </li> */}
                                    <li>
                                      <b>Código:</b> {data.codigo}
                                    </li>
                                  </ul>
                                  {data?.info && (
                                    <div
                                      style={{
                                        color: '#000',
                                        padding: '0px 5px',
                                      }}
                                      dangerouslySetInnerHTML={{
                                        __html: data.info,
                                      }}
                                    />
                                  )}
                                  <Skeleton
                                    loading={
                                      loadingExtra &&
                                      versionIndexLoading === index
                                    }
                                  >
                                    {data.extradata
                                      ? data.extradata.map(
                                          (
                                            extraData: any,
                                            indexExtraData: number
                                          ) => (
                                            <div key={indexExtraData}>
                                              <ul>
                                                <li>Año: {extraData.anio}</li>
                                                <li>
                                                  Puertas: {extraData.puertas}
                                                </li>
                                                <li>
                                                  Cilidraje:{' '}
                                                  {extraData.cilindraje}
                                                </li>
                                                <li>
                                                  Descripcion:{' '}
                                                  {extraData.descripcion}
                                                </li>
                                                <li>
                                                  Nro. Pasajeros:{' '}
                                                  {extraData.nropasajeros}
                                                </li>
                                                <li>
                                                  Código: {extraData.codigo}
                                                </li>
                                                <li>
                                                  Combustible:{' '}
                                                  {extraData.combustible}
                                                </li>
                                              </ul>
                                              <div
                                                style={{
                                                  textAlign: 'center',
                                                }}
                                              >
                                                {extraData.urlpdf
                                                  ? extraData.urlpdf.length > 0
                                                    ? extraData.urlpdf.map(
                                                        (
                                                          pdf: any,
                                                          indexPdf: number
                                                        ) => (
                                                          <Tooltip
                                                            title="PDF"
                                                            key={indexPdf}
                                                          >
                                                            <Button
                                                              type="primary"
                                                              shape="circle"
                                                              style={{
                                                                marginRight: 5,
                                                              }}
                                                              href={pdf.link}
                                                              target="_blank"
                                                              icon={
                                                                <FilePdfOutlined />
                                                              }
                                                            />
                                                          </Tooltip>
                                                        )
                                                      )
                                                    : null
                                                  : null}
                                              </div>
                                            </div>
                                          )
                                        )
                                      : null}
                                  </Skeleton>
                                </div>
                              }
                            />
                          </Card>
                        </Col>
                      ))
                    : null}
                </Row>
              ) : (
                <Result
                  status="warning"
                  title="Upps, no hemos podido traer las versiones, inténtalo en unos segundos."
                />
              )}
            </div>
          </Drawer>
        </div>
      </div>
      <>
        <Drawer
          title={`Cotizando un ${cotizacionData.marca} ${cotizacionData.modelo} ${cotizacionData.anio}`}
          className="my-drawer"
          //width={1024}
          //width={window.innerWidth > 900 ? 800 : window.innerWidth - 100}
          onClose={cotizarClose}
          visible={cotizacionActive}
          drawerStyle={{
            backgroundColor: 'rgba(255,255,255,1)',
            height: '100%',
          }}
          headerStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
          bodyStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Skeleton loading={cotizacionLoading}>
            <PublicQuoteForm
              finishDrawer={finishDrawer}
              insurances={insuranceData}
              dataVehicleSelect={cotizacionData}
            />
          </Skeleton>
        </Drawer>
      </>
    </>
  );
};

export default VehicleModel;
