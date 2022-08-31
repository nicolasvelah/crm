import React, { FunctionComponent, useState } from 'react';
import { Menu, Col, Row } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import DashboardHelp from './dashboard/DashboardHelp';
import MainProspectHelp from './prospect/MainProspectHelp';
import NewProspectHelp from './prospect/NewProspectHelp';
import IndagacionProspectHelp from './IndagacionProspectHelp';
import DemostracionProspectHelp from './DemostracionProspectHelp';
import CotizacionProspectHelp from './CotizacionProspectHelp';
import TestDriveProspectHelp from './TestDriveProspectHelp';
import CierreProspectHelp from './CierreProspectHelp';
import PrefacturaProspectHelp from './PrefacturaProspectHelp';
import EntregaProspectHelp from './EntregaProspectHelp';
import CatalogoHelp from './CatalagoHelp';
import SeguimientoHelp from './SeguimientoHelp';
import SolicitudHelp from './SolicitudHelp';
import AvaluoHelp from './AvaluoHelp';
import Help from './help/Help';
/* Leads Component */
import ListLeads from './lead/ListLeads';
import CreateLead from './lead/CreateLead';

const { SubMenu } = Menu;

const MainHelp: FunctionComponent = () => {
  const [current, setCurrent] = useState<string>('help');

  const renderSwitch = (param: string) => {
    switch (param) {
      case 'help':
        return <Help />;
      case 'dashboard':
        return <DashboardHelp />;
      case 'main_prospect_help':
        return <MainProspectHelp />;
      case 'new_prospect_help':
        return <NewProspectHelp />;
      case 'indagacion_prospect_help':
        return <IndagacionProspectHelp />;
      case 'demostracion_prospect_help':
        return <DemostracionProspectHelp />;
      case 'cotizacion_prospect_help':
        return <CotizacionProspectHelp />;
      case 'test_drive_prospect_help':
        return <TestDriveProspectHelp />;
      case 'cierre_prospect_help':
        return <CierreProspectHelp />;
      case 'prefactura_prospect_help':
        return <PrefacturaProspectHelp />;
      case 'entrega_prospect_help':
        return <EntregaProspectHelp />;
      case 'catalogo_help':
        return <CatalogoHelp />;
      case 'seguimiento_help':
        return <SeguimientoHelp />;
      case 'credito_help':
        return <SolicitudHelp />;
      case 'avaluo_help':
        return <AvaluoHelp />;
      case 'lead_list_list':
        return <ListLeads />;
      case 'lead_list_create':
        return <CreateLead />;
      default:
        return null;
    }
  };

  return (
    <Row>
      <Col span={4}>
        <Menu
          //style={{ width: '10%', position: 'fixed', overflow: 'hidden' }}
          onClick={(e) => {
            // @ts-ignore
            setCurrent(e.key);
          }}
          selectedKeys={[current]}
          mode="inline"
          defaultOpenKeys={['SubMenu']}
        >
          <Menu.Item key="help" icon={<QuestionCircleOutlined />} />

          <Menu.Item key="dashboard">Dashboard</Menu.Item>

          <SubMenu key="SubMenu" title="Prospectos">
            <Menu.Item key="main_prospect_help">Lista de prospectos</Menu.Item>
            <Menu.Item key="new_prospect_help">Nuevo Prospecto</Menu.Item>
          </SubMenu>
          
          <SubMenu key="SubMenu_leads" title="Negocios">
            <SubMenu key="subMenu_leads_list" title="Lista de Negocios">
              <Menu.Item key="lead_list_list">Lista de negocios</Menu.Item>
              <Menu.Item key="lead_list_create">Crear Negocio</Menu.Item>
            </SubMenu>
            <SubMenu key="subMenu_leads_lead" title="Negocio">
              <Menu.Item key="indagacion_prospect_help">Indagación</Menu.Item>
              <Menu.Item key="demostracion_prospect_help">Negocio</Menu.Item>
              <Menu.Item key="cotizacion_prospect_help">Cotización</Menu.Item>
              <Menu.Item key="test_drive_prospect_help">Test Drive</Menu.Item>
              <Menu.Item key="cierre_prospect_help">Cierre</Menu.Item>
              <Menu.Item key="prefactura_prospect_help">Prefactura</Menu.Item>
              <Menu.Item key="entrega_prospect_help">Entrega</Menu.Item>
            </SubMenu>
          </SubMenu>

          <Menu.Item key="catalogo_help">Catálogo</Menu.Item>

          <Menu.Item key="seguimiento_help">Seguimiento</Menu.Item>

          <Menu.Item key="credito_help">Solicitud de crédito</Menu.Item>

          <Menu.Item key="avaluo_help">Avalúo Mecánico</Menu.Item>
        </Menu>
      </Col>

      <Col span={20}>{renderSwitch(current)}</Col>
    </Row>
  );
};

export default MainHelp;
