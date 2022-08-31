import React, { FunctionComponent, useState } from 'react';
import { Button, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons/lib';
import FormProspectV2, {
  ConsesionarioSucursal,
} from '../../../components/Prospect/FormProspectV2';
import { TotalProspect } from '../../lead/Lead';
import Loading from '../../../components/Loading';
import Get from '../../../utils/Get';
import ClientsRepository from '../../../data/repositories/clients-repository';
import { Dependencies } from '../../../dependency-injection';
import { getSocialReason } from '../../Prospect/NewProspectForm';
import auth from '../../../utils/auth';

const MainHost: FunctionComponent = () => {
  // API CLIENT RESOLVER
  const clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  // MUESTRA EL FORMULARIO SI DA CLICK EN CREAR PROSPECTO
  const [viewFormNewProspect, setviewFormNewProspect] = useState<boolean>(
    false
  );
  // LOADING
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      {/*BOTON CREAR PROSPECTO*/}
      <div className="flex justify-end mt-10 mr-20">
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setviewFormNewProspect(true)}
        >
          Crear Prospecto
        </Button>
      </div>

      {/*FORMULARIO CREAR NUEVO PROSPECTO*/}
      {viewFormNewProspect ? (
        <div className="mt-5" style={{ width: 650 }}>
          <FormProspectV2
            type="edit"
            onCreate={async (
              prospect: TotalProspect,
              sucursal: ConsesionarioSucursal,
              concesionario: ConsesionarioSucursal
            ) => {
              const { user } = auth;
              const city = user?.dealer
                ?.find((dl: any) => {
                  return (
                    dl.codigo && concesionario && dl.codigo === concesionario
                  );
                })
                ?.sucursal?.find(
                  (sucu: any) => sucu && sucursal === sucu?.id_sucursal
                )?.ciudad;
              //console.log('city FormProspectV2', city);
              setLoading(true);
              const added: number = await clientsRepository.insertClient(
                {
                  idAgency: user!.concessionaire || '',
                  city: city ?? '',
                  codeUser: user!.codUsuario || '',
                  roleUser: user!.role || '',
                  sucursal: { code: sucursal.code, name: sucursal.name },
                  concesionario: {
                    code: concesionario.code,
                    name: concesionario.name,
                  },
                },
                {
                  name: `${prospect.name}`,
                  lastName: `${prospect.lastName}`,
                  birthDate: `${prospect.birthdate}`,
                  cellphone: `${prospect.phone}`,
                  typeIdentification: `${prospect.type}`,
                  email: `${prospect.email}`,
                  identification: `${prospect.id}`,
                  socialRazon: getSocialReason(prospect.socialReason),
                  chanel: `${prospect.canal}`,
                  campaign: `${prospect.campaign}`,
                }
              );
              //const added: any = false;
              setLoading(false);
              if (added > 0) {
                message.success('Prospecto creado');
                return;
              }
              setLoading(false);
              message.error('Error al crear prospecto');
            }}
          />
        </div>
      ) : (
        ''
      )}
      <Loading visible={loading} />
    </>
  );
};

// @ts-ignore
export default MainHost;
