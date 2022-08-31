// eslint-disable-next-line no-unused-vars
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Divider,
  Button,
  Drawer,
  message,
  Skeleton,
  Tooltip,
  Carousel,
  Tabs,
  Result,
  Space,
  Spin,
} from 'antd';
import {
  CarOutlined,
  FilePdfOutlined,
  SmileOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import auth from '../../../utils/auth';
import '../css/catalog.css';
import Get from '../../../utils/Get';
import CRMRepository from '../../../data/repositories/CRM-repository';
import { Dependencies } from '../../../dependency-injection';
import { currenyFormat } from '../../../utils/extras';
import AspectRatio from '../../../components/AspectRatio';
import QuotesForm from '../../quote/components/QuoteForm';
import { ClientLeadContext } from '../../../components/GetClientData';
import OffertProduct from '../../../components/OffertProduct';

const { Meta } = Card;
const { TabPane } = Tabs;

const CatalogV2: FunctionComponent<{
  nextStep?: Function;
  setViewTestDriver?: Function;
  setSelectNewVehicle?: Function;
  setDataVehicle?: Function;
  setQuotesGenerated?: Function;
}> = ({
  nextStep,
  setViewTestDriver,
  setSelectNewVehicle,
  setDataVehicle,
  setQuotesGenerated,
}) => {
  const { lead } = useContext(ClientLeadContext);
  //esta hay que eliminar setDataVehicle
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingExtra, setLoadingExtra] = useState<boolean>(false);
  const [cotizacionActive, setCotizacionActive] = useState<boolean>(false);
  const [cotizacionLoading, setCotizacionLoading] = useState<boolean>(false);
  const [versionsLoading, setVersionsLoading] = useState<boolean>(false);
  const [activeVersions, setActiveVersions] = useState<boolean>(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectBrand, setSelectBrand] = useState<string | null>(null);
  const [selectVersion, setSelectVersion] = useState<string | null>(null);
  const [catalogBrand, setCatalogBrand] = useState<any[] | null | undefined>(
    null
  );
  const [versiones, setVersions] = useState<any>([]);
  const [versionesImgCover, setVersionsImgCover] = useState<any>([]);
  const [cotizacionData, setCotizacionData] = useState<any>([]);
  const [insuranceData, setInsuranceData] = useState<any>([]);
  const [versionIndexLoading, setVersionIndexLoading] = useState<number>(-1);

  const historyRouter = useHistory();

  useEffect(() => {
    //const brandLocalStorage = localStorage.getItem('user');
    const brandLocalStorage = auth.user;
    if (brandLocalStorage !== null) {
      setBrands(brandLocalStorage.brand);
    }
  }, []);

  const setSelectedBrand = async (value: string) => {
    setActiveVersions(false);
    setSelectBrand(value);
    //console.log('value', value);
    setLoading(true);
    const getCatalogData = await CRMRepository.getCatalog({
      marca: value,
    });

    console.log('getCatalogData -->', { getCatalogData });
    if (!getCatalogData) {
      setCatalogBrand(undefined);
      message.error('Error al traer catálogos');
      setLoading(false);
      return;
    }

    setCatalogBrand(getCatalogData);
    setLoading(false);
  };

  const activateVersions = (data: any, imageCover: string, modelo: string) => {
    console.log('activateVersions Data', data, modelo);
    setSelectVersion(modelo);
    setActiveVersions(true);
    setVersionsLoading(true);
    setVersions(data);
    setVersionsImgCover(imageCover);
    setVersionsLoading(false);

    const elmnt = document.getElementById('to-scroll');
    //console.log('elmnt', elmnt);
    if (elmnt) {
      setTimeout(() => {
        elmnt.scrollIntoView();
      }, 500);
    }
  };
  const closeVersions = () => {
    setActiveVersions(false);
  };

  const selectVehicle = async (codigo: string) => {
    setLoadingExtra(true);
    try {
      const getVehicleExtraData = await CRMRepository.getVehicle({
        marca: selectBrand,
        codigo,
      });
      //console.log('getVehicleExtraData🔻🔻🔻🔻', getVehicleExtraData);
      const colorsPhotoRender: any = [];

      await getVehicleExtraData.map(async (vehicle: any) => {
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

      //console.log('colorsPhotoRender🔴', colorsPhotoRender);
      const newVesions: any = [];
      await versiones.map((element: any) => {
        const newElement: any = element;
        if (element.codigo === codigo) {
          newElement.extradata = getVehicleExtraData;
          newElement.extradata[0].imageData = versionesImgCover;
          //newElement.extraData[0].idModelo = element.id_modelo;
          newElement.colorPhotos = colorsPhotoRender;
        }
        newVesions.push(newElement);
        //console.log('EN VERSIONES', newElement);
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
    setCotizacionLoading(true);
    //console.log('Cotiza aqui', data);
    const getInsuranceData = await CRMRepository.getInsurance({
      codigo: data.codigo,
    });
    //console.log('getInsuranceData !!!!', getInsuranceData);
    if (getInsuranceData && getInsuranceData.length > 0) {
      const dataInsurance = getInsuranceData[0].seguros;
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
    if (data.extradata) {
      dataToSend = data.extradata;
    } else {
      const versionesResp = await selectVehicle(data.codigo);
      if (!versionesResp) {
        message.error('No se encontró la data adicional no hay como cotizar');
        return false;
      }
      //console.log('versionesResp', versionesResp);
      versionesResp.map((versionTemp: any) => {
        if (versionTemp.codigo === data.codigo) {
          dataToSend = versionTemp.extradata;
        }
        return versionTemp;
      });

      //console.log('data so send', { dataToSend: dataToSend[0] });
    }
    await setCotizacionData({ ...dataToSend[0], idModelo: data.id_modelo });
    setCotizacionActive(true);
    setCotizacionLoading(false);
    return dataToSend[0];
  };
  const cotizarClose = () => {
    setCotizacionActive(false);
  };

  const SelectBrandsHome: FunctionComponent<{}> = () => {
    return (
      <>
        <Divider orientation="left">
          <h2>Catálogo de vehículos</h2>
        </Divider>
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
                {selectBrand === data ? (
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

  return (
    <>
      <SelectBrandsHome />
      <Spin tip="Cargando..." spinning={loading}>
        {catalogBrand && catalogBrand.length > 0 ? (
          <div
            className="contenedorModelo"
            style={{
              position: 'relative',
              overflow: 'hidden',
              marginTop: 10,
              minHeight: '70vh',
            }}
          >
            <Row justify="center" gutter={[8, 8]}>
              {catalogBrand.map((dataModel, index) => {
                //console.log('dataModel theBestPrice', dataModel);
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
                  //console.log('error theBestPrice', error.message);
                }
                //console.log('theBestPrice', theBestPrice);
                return (
                  <Col key={index} span={8}>
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
                              dataModel.imagen ||
                              '/img/no-image-found-360x250.png'
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
                                    ? JSON.parse(dataModel.ids_colores)
                                        .length >= 1 &&
                                      JSON.parse(dataModel.ids_colores).map(
                                        (
                                          colorVehicle: any,
                                          colorindex: number
                                        ) => (
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
                              {/* <li>
                                Precio desde:{' '}
                                {dataModel.precio
                                  ? currenyFormat(dataModel.precio, true)
                                  : currenyFormat(0, true)}
                              </li> */}
                              <li>
                                PVP desde:{' '}
                                {dataModel.precio
                                  ? currenyFormat(theBestPrice * 1.12, true)
                                  : currenyFormat(0, true)}{' '}
                                Inc. IVA
                              </li>
                              <li>Stock: {dataModel.stock}</li>
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
            <Drawer
              title={`${selectBrand} ${selectVersion}`}
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
                {versiones ? (
                  <Row justify="center" gutter={[8, 8]}>
                    {/* {console.log('🚀🚀🚀🚀🚀🚀🔻🔻', versiones)} */}
                    {versiones.length > 0
                      ? versiones.map((data: any, index: number) => (
                          <Col span={8} key={index}>
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
                                      data.precio === 0 ||
                                      !!lead?.saleDown
                                    }
                                    onClick={async () => {
                                      if (nextStep && setDataVehicle) {
                                        setVersionIndexLoading(index);
                                        const dataTosend = await cotizar(data);
                                        //console.log('dataTosend 2', dataTosend);
                                        //const stateHistory: any = historyRouter.location.state;
                                        /*historyRouter.push(
                                        historyRouter.location.pathname,
                                        {
                                          step: 2,
                                          id: stateHistory.id,
                                          idLead: stateHistory.idLead,
                                          dataVehicle: dataTosend,
                                        }
                                      );*/
                                        setDataVehicle(dataTosend!);
                                        //nextStep();
                                      } else {
                                        historyRouter.push('/prospect/form');
                                      }
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
                                    disabled={
                                      (loadingExtra &&
                                        versionIndexLoading !== index) ||
                                      !!lead?.saleDown
                                    }
                                    onClick={async () => {
                                      //console.log({ data, catalogBrand });
                                      setVersionIndexLoading(index);
                                      if (
                                        setSelectNewVehicle &&
                                        setViewTestDriver
                                      ) {
                                        if (!data.extradata) {
                                          const versionesResp =
                                            await selectVehicle(data.codigo);
                                          if (!versionesResp) {
                                            message.error(
                                              'No se encontró la data adicional no hay como realizar Test Drive'
                                            );
                                            return false;
                                          }
                                          //console.log({ versionesResp });
                                        }
                                        const selectVeh = {
                                          marca: data.marca,
                                          modelo: data.modelo,
                                          imageVehicle: versionesImgCover,
                                          versions: [],
                                          dataVehicle: {
                                            anio:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].anio
                                                : 2020,
                                            cilindraje:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].cilindraje
                                                : 0,
                                            codigo: data.codigo,
                                            color:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].color
                                                : [],
                                            combustible:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].combustible
                                                : '',
                                            costo:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].costo
                                                : 0,
                                            descripcion:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].descripcion
                                                : '',
                                            marca:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].marca
                                                : '',
                                            margen:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].margen
                                                : '',
                                            modelo:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].modelo
                                                : '',
                                            nropasajeros:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].nropasajeros
                                                : 0,
                                            numaccesorios:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0]
                                                    .numaccesorios
                                                : 0,
                                            numserv:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].numserv
                                                : 0,
                                            precio:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].precio
                                                : 0,
                                            puertas:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].puertas
                                                : 0,
                                            totalstock:
                                              data.extradata &&
                                              data.extradata.length > 0
                                                ? data.extradata[0].totalstock
                                                : 0,
                                          },
                                        };
                                        setSelectNewVehicle(selectVeh);
                                        setViewTestDriver('testDriver');
                                      } else {
                                        historyRouter.push('/prospect/form');
                                      }
                                    }}
                                  >
                                    Test Drive
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
                                      {data.destacadodescripcion && (
                                        <OffertProduct />
                                      )}
                                      {data.imagen ? (
                                        <div>
                                          {versionesImgCover && activeVersions && (
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
                                                versionesImgCover ||
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
                              {/*<Button
                            type="link"
                            onClick={() => cotizar(data)}
                          >
                            Cotizar temp
                          </Button>*/}
                              {data.destacadodescripcion && (
                                <div
                                  style={{
                                    background: '#E24C32',
                                    borderRadius: 5,
                                    color: '#fff',
                                    padding: 10,
                                    marginBottom: 10,
                                  }}
                                >
                                  {data.destacadodescripcion}
                                </div>
                              )}
                              <Meta
                                title={`${data.modelo}`}
                                description={
                                  <div>
                                    {/*  {console.log('COLORES🔵🟡🔴', data)} */}
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
                                      {/* <li>
                                        <b>Precio:</b>{' '}
                                        {currenyFormat(data.precio, true)}
                                      </li> */}
                                      <li>
                                        <b>PVP:</b>{' '}
                                        {currenyFormat(
                                          data.precio * 1.12,
                                          true
                                        )}{' '}
                                        <span className="text-sm">
                                          Inc. IVA
                                        </span>
                                      </li>
                                      <li>
                                        <b>Stock:</b> {data.stock}
                                      </li>
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
                                                    ? extraData.urlpdf.length >
                                                      0
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
        ) : catalogBrand === undefined ? (
          <Result
            status="warning"
            title="Upps, no hemos podido traer los vehículos, inténtalo en unos segundos."
          />
        ) : (
          <Result
            icon={<SmileOutlined />}
            title="Bienvenid@, selecciona una marca"
          />
        )}
      </Spin>
      <>
        <Drawer
          title={`Cotizando un ${cotizacionData.marca} ${cotizacionData.modelo} ${cotizacionData.anio}`}
          width={1024}
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
            {setQuotesGenerated && (
              <QuotesForm
                nextStep={() => {}}
                insurances={insuranceData}
                onCreatedQuote={setQuotesGenerated}
                dataVehicleSelect={cotizacionData}
              />
            )}
          </Skeleton>
        </Drawer>
      </>
    </>
  );
};

export default CatalogV2;
