/* eslint-disable react/state-in-constructor */
import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Checkbox, Col, Input, Row, Select } from 'antd';
import React from 'react';
import User from '../../../data/models/User';
import Leads from '../../../data/models/Leads';

const REASSONS = [
  'Venta caída',
  'Vacaciones',
  'Salió de la empresa',
  'Baja gestión',
  'Calamidad doméstica',
];

export default class ReAsignModal extends React.PureComponent<{
  onSelected(user: User, reason: string): void;
  data: User[] | null;
  lead: Leads;
}> {
  state = {
    reasson: REASSONS[0],
    advisors: [] as User[],
    advisorSelected: null as User | null,
    searchText: '',
    loaded: false,
  };

  componentDidMount() {
    const { data } = this.props;
    this.setState({ advisors: data });
  }

  render() {
    const { onSelected, lead } = this.props;
    const {
      reasson,
      advisors,
      advisorSelected,
      searchText,
      loaded,
    } = this.state;
    return (
      <div>
        <h2 className="text-2xl font-bold">
          Selecciona el asesor al que deseas reasignar
        </h2>
        <p className="mt-5 mb-0">Asesores disponibles</p>
        <div className="flex w-6/12">
          <Input
            value={searchText}
            onChange={(e) => this.setState({ searchText: e.target.value })}
            style={{ borderRadius: 0 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{ borderRadius: 0 }}
          />
        </div>

        <div className="mt-5">
          <Row gutter={10}>
            {advisors
              .filter((e) => {
                if (
                  e.nombre
                    ?.toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase())
                ) {
                  return true;
                }
                if (
                  e.apellido
                    ?.toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase())
                ) {
                  return true;
                }
                const avatarChars: string = `${e.nombre
                  ?.charAt(0)
                  .toUpperCase()}${e.apellido?.charAt(0).toUpperCase()}`;
                if (avatarChars.includes(searchText.toUpperCase())) {
                  return true;
                }

                return false;
              })
              .filter((ad) => {
                //console.log('ad', ad);
                /// Filtro los usuarios con la misma sucursal
                const okCon = ad.concesionario?.find(
                  (con) => lead.concesionario?.code === con
                );
                const okSuc = ad.sucursal?.find(
                  (su) => lead.sucursal?.code === su
                );
                if (okCon && okSuc) {
                  return true;
                }
                return false;
              })
              .map((advisor) => (
                <Col className="mt-3" md={8} key={`${advisor.id}`}>
                  <Card
                    className="cursor-pointer"
                    onClick={() => {
                      this.setState({
                        advisorSelected: advisor,
                      });
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor:
                            advisorSelected?.id === advisor.id
                              ? '#3FAAFE'
                              : '#f0f0f0',
                          borderRadius: 3,
                        }}
                      >
                        <CheckOutlined style={{ color: '#fff' }} />
                      </div>

                      <Avatar
                        className="ml-2"
                        style={{ backgroundColor: '#87d068' }}
                        size={50}
                      >
                        {advisor.nombre?.charAt(0).toUpperCase()}
                        {advisor.apellido?.charAt(0).toUpperCase()}
                      </Avatar>
                      <div className="ml-3">
                        <h2
                          className="m-0 p-0 font-bold"
                          style={{ lineHeight: 1 }}
                        >
                          {advisor.nombre} {advisor.apellido}
                        </h2>
                        <div className="text-sm" style={{ lineHeight: 1 }}>
                          Disponible
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>

        <div className="mt-5 mb-3">
          <span className="font-bold">Motivo: </span>
          <Select
            value={reasson}
            onSelect={(e) => this.setState({ reasson: e })}
            style={{ minWidth: 300 }}
          >
            {REASSONS.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="mt-5 text-right">
          <Button
            loading={loaded}
            onClick={() => {
              this.setState({ loaded: true });
              if (advisorSelected) {
                //console.log('AQUIII', advisorSelected);
                onSelected(advisorSelected, reasson);
                this.setState({ loaded: false });
              }
            }}
            type="primary"
          >
            Reasignar
          </Button>
        </div>
      </div>
    );
  }
}
