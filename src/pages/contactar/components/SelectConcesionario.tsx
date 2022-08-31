import React, { useState } from 'react';
import { Button, Form, Select, message } from 'antd';
import CRMRepository from '../../../data/repositories/CRM-repository';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import {
  IDataListConcessionaire,
  ISelectConcesionario,
  IConcessionaire,
} from '../interfaces/iContactar';
const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
type SizeType = Parameters<typeof Form>[0]['size'];

const SelectConcesionario = ({
  setIsEnableAdvisers,
  setDataAdvisers,
  setIsEnableConectNow,
  listConcessionaire,
  setDataConcessionaire,
  dataConcessionaire,
  allUsers,
}: ISelectConcesionario) => {
  const [render, setRender] = useState(false);
  const [sucursal, setSucursal] = useState<any>([]);
  const [loadUser, setLoadUser] = useState(false);

  /*  useEffect(() => {
   //console.log('dataConcessionaire', dataConcessionaire);
  }, [dataConcessionaire]); */

  const onChangeSelect = async (value: any, option: any) => {
    if (option.name === 'concessionaire') {
      setRender(false);
      setIsEnableConectNow(true);
      setIsEnableAdvisers(false);
      setRender(true);
      const { branchOffices } = listConcessionaire.find(
        (item: IDataListConcessionaire) => {
          return item.concessionaire.code === value;
        }
      );

      setDataConcessionaire({
        ...dataConcessionaire,
        concessionaire: { code: value, name: option.children },
        branchOffices: {
          code: branchOffices[0].code,
          name: branchOffices[0].name,
          city: branchOffices[0]?.city,
        },
      });
      setSucursal(branchOffices);
    } else if (option.name === 'sucursal') {
      //console.log('Sucursales', { sucursal, value, option: option.children });
      const city = sucursal.find(
        (sucu: IConcessionaire) => `${sucu.code}` === `${value}`
      )?.city;
      setDataConcessionaire({
        ...dataConcessionaire,
        branchOffices: {
          code: value,
          name: option.children,
          city,
        },
      });
    }
  };

  const onFinishForm = async () => {
    setLoadUser(true);
    const resp = await CRMRepository.apiCall(
      'POST',
      '/api/v1/videocall/available-users',
      {
        data: {
          sucursal: dataConcessionaire.branchOffices.code,
          concessionaire: dataConcessionaire.concessionaire.code,
          allUsers,
        },
      }
    );
    if (resp && !resp.ok) {
      message.error('Error al traer los usuarios');
      setIsEnableAdvisers(false);
      setLoadUser(false);
      return;
    }

    const { data } = resp.data;
    if (data) {
      setDataAdvisers(data.users);
      setIsEnableAdvisers(true);
    } else {
      message.error(
        'Verifique que se escogió correctamente un concesionario y una sucursal'
      );
      setIsEnableAdvisers(false);
    }
    setLoadUser(false);
  };
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>(
    'default'
  );
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  return (
    <Form
      layout="horizontal"
      size={componentSize as SizeType}
      onValuesChange={() => onFormLayoutChange}
      onFinish={onFinishForm}
    >
      <div className="content-form">
        <div className="content-form-select">
          <Form.Item
            label="Concesionario"
            name="concesionario"
            rules={[{ required: true }]}
            className="content-form-select-option"
          >
            <Select
              placeholder="Seleccionar Concesionario"
              onChange={onChangeSelect}
              value={dataConcessionaire.concessionaire.code}
            >
              {listConcessionaire.map(
                ({ concessionaire }: IDataListConcessionaire, i: any) => {
                  return (
                    <Select.Option
                      name="concessionaire"
                      value={concessionaire.code}
                      key={i}
                    >
                      {concessionaire.name}
                    </Select.Option>
                  );
                }
              )}
            </Select>
          </Form.Item>
          {render && sucursal.length !== 0 && (
            <>
              <Form.Item
                label="Sucursal"
                name="sucursal"
                className="content-form-select-option"
                valuePropName="sucursal"
              >
                <Select
                  placeholder="Seleccionar la sucursal"
                  onChange={onChangeSelect}
                  //value={sucursal[0].code}
                >
                  {sucursal.map(({ code, name }: IConcessionaire, i: any) => {
                    return (
                      <Select.Option name="sucursal" value={code} key={i}>
                        {name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </>
          )}
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="content-form-btn"
          loading={loadUser}
        >
          Buscar Asesores
        </Button>
      </div>
    </Form>
  );
};

export default SelectConcesionario;
