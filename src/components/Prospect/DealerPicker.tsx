import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Cascader, Form, Select } from 'antd';
import {
  DispatchMenu,
  GlobalMenuContext,
  MenuGlobalState,
} from '../../state/MenuState';
import auth from '../../utils/auth';

interface IDataUserConsesionario {
  value: string;
  label: string;
  children: {
    value: number;
    label: string;
  }[];
}

const DealerPicker: FunctionComponent<{
  getDataDealerPicker?: Function;
  widthInput?: number;
  placeholderInput?: string;
}> = ({
  getDataDealerPicker,
  widthInput,
  placeholderInput
}) => {
  /******************************HOOKS*****************************************/

  //DATOS DEL USUARIO
  const { user } = auth;
  // DATOS DE LOS CONSESIONARIOS Y SUCURSALES
  const [consesionarios, setConsesionarios] = useState<
    IDataUserConsesionario[]
  >();

  /******************************GENERALFUNCTION*******************************/

  // RETORNA LAS CONSESIONARIOS DEL USUARIO
  // @ts-ignore
  const dataUserConsesionarios: IDataUserConsesionario[] = user.dealer.map(
    (dataC: any) => {
      return {
        value: dataC.codigo, 
        label: dataC.descripcion,
        children: dataC.sucursal.map((dataS: any) => ({
          value: dataS.id_sucursal,
          label: dataS.sucursal,
        })),
      };
    }
  );

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      setConsesionarios(dataUserConsesionarios);
    };
    componentdidmount();
  }, []);

  /******************************RETURN*****************************************/
  
  return (
    <>
      <Cascader
        //defaultValue={[dataUserConsesionarios[0].value, dataUserConsesionarios[0].children[0].value]}
        placeholder={placeholderInput}
        style={{ width: widthInput }}
        options={consesionarios}
        onChange={(valueCodigoID: any, label: any) => {
          // @ts-ignore
          getDataDealerPicker(valueCodigoID, label);
        }}
      />
    </>
  );
};

export default DealerPicker;
