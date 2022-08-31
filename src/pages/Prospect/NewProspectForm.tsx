/* eslint-disable camelcase */
import React, { FunctionComponent, useState } from 'react';
import { message, Modal, Button, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import FormProspectV2, {
  ConsesionarioSucursal,
} from '../../components/Prospect/FormProspectV2';

import Menu from '../../components/Template';
// import { insertClient } from '../../data/providers/apollo/mutations/clients';
import { TotalProspect } from '../lead/Lead';
import Loading from '../../components/Loading';
import Get from '../../utils/Get';
import ClientsRepository from '../../data/repositories/clients-repository';
import { Dependencies } from '../../dependency-injection';
import auth from '../../utils/auth';
import Leads from '../../data/models/Leads';
import CreateLead from '../business/components/CreateLead';
import Client from '../../data/models/Client';

interface DataUserLead {
  idAgency: string;
  city: string;
  codeUser: string;
}

export const getSocialReason = (val: string | null) => {
  return val ? `"${val}"` : 'null';
};

const NewProspectForm: FunctionComponent = () => {
  return (
    <Menu page="Prospectos">
      <MainNewProspect />
    </Menu>
  );
};

const MainNewProspect: FunctionComponent = () => {
  const clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  const historyRouter = useHistory();
  const [showModalLeads, setModalShowLeads] = useState<boolean>(false);
  ///Modal create lead
  const [viewModalCreateLead, setViewModalCreateLead] = useState<boolean>(
    false
  );
  const [idsLeads, setIdsLeads] = useState<number[] | null>(null);
  const [identificationClient, setIdentificationClient] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  /// cliente actual para la creación del negocio
  const [actualClient, setActualClient] = useState<Client | null>(null);

  const goToLeadHistory = (idLead: number, identification: string) => {
    historyRouter.push(
      `/lead/id-lead=${idLead}/identification=${identification}`,
      {
        step: 0,
        id: identification,
        idLead,
      }
    );
  };
  const closeModalLeads = () => {
    setModalShowLeads((prevState) => !prevState);
  };
  return (
    <div className="flex flex-col py-5 px-10">
      <div className="text-2xl font-semibold">Bienvenid@</div>
      <div>Crea un nuevo prospecto o busca uno existente con su cédula.</div>
      <br />
      <div className="text-2xl font-semibold">Crear o buscar prospectos</div>

      <div className="mt-10">
        <div className="w-1/2">
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
                    dl.codigo &&
                    concesionario.code &&
                    dl.codigo === concesionario.code
                  );
                })
                ?.sucursal?.find((sucu: any) => {
                  return (
                    sucursal.code &&
                    sucursal.code === sucu?.id_sucursal?.toString()
                  );
                })?.ciudad;
              //console.log('city FormProspectV2', {city, user});
              //return;
              const leadInsert = {
                idAgency: concesionario.code,
                city: city ?? '',
                codeUser: user!.codUsuario!,
                roleUser: null,
                sucursal: { code: sucursal.code, name: sucursal.name },
                concesionario: {
                  code: concesionario.code,
                  name: concesionario.name,
                },
              };
              const clientInsert = {
                name: `${prospect.name}`,
                lastName: `${prospect.lastName}`,
                birthDate: null,
                cellphone: `${prospect.phone}`,
                typeIdentification: `${prospect.type}`,
                email: `${prospect.email}`,
                identification: `${prospect.id}`,
                socialRazon: prospect.socialReason,
                chanel: `${prospect.canal}`,
                campaign: `${prospect.campaign}`,
                isPerson: prospect.isPerson,
              };
              console.log({ leadInsert, clientInsert });
              setLoading(true);
              const added: number = await clientsRepository.insertClient(
                leadInsert,
                clientInsert
              );
              //const added = 0;
              //console.log('testeo', added);
              setLoading(false);
              if (added > 0) {
                //console.log('Cliente añadido');
                message.success('Prospecto creado');
                goToLeadHistory(added, prospect.id!);
                return;
              }

              setLoading(false);
              message.error('Error al crear prospecto');
            }}
            onView={async (p: TotalProspect, leads: Leads[]) => {
              //console.log({ p, leads });
              if (leads && leads.length > 1) {
                //console.log('Entro');
                const ids = leads.map((l) => l.id!);
                //console.log('ids', ids);
                setIdsLeads(ids);
                setIdentificationClient(p.id);
                setModalShowLeads(true);
                //console.log('TRUE');
              } else if (leads && leads.length === 1) {
                goToLeadHistory(leads[0].id!, p.id!);
              } else if (leads && leads.length === 0) {
                setActualClient({
                  name: p.name,
                  lastName: p.lastName,
                  typeIdentification: p.type,
                  identification: p.id,
                });
                setViewModalCreateLead(true);
              }
            }}
          />
        </div>
      </div>
      {actualClient && setViewModalCreateLead && (
        <CreateLead
          setViewModal={setViewModalCreateLead}
          viewModal={viewModalCreateLead}
          actualClient={actualClient}
          goLead={goToLeadHistory}
        />
      )}

      <Modal
        title="Escoge un negocio"
        visible={showModalLeads}
        width={300}
        onCancel={closeModalLeads}
        footer={[
          <Button key="back" onClick={closeModalLeads}>
            Regresar
          </Button>,
        ]}
      >
        <div>
          {idsLeads &&
            idsLeads.map((idLead, index) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 4,
                }}
                key={index}
              >
                <span>
                  Negocio: <Tag color="#108ee9">No: {idLead}</Tag>
                </span>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<ArrowRightOutlined />}
                  onClick={() => {
                    if (identificationClient) {
                      goToLeadHistory(idLead, identificationClient);
                    }
                  }}
                />
              </div>
            ))}
        </div>
      </Modal>
      <Loading visible={loading} />
    </div>
  );
};

export default NewProspectForm;
