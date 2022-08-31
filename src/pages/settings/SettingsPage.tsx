import React, { FunctionComponent } from 'react';
import Menu from '../../components/Template';
import Settings from './Components/Settings'

export interface SettingsPageProps {}

const SettingsPage: FunctionComponent<SettingsPageProps> = () => {
  return (
    <Menu page="Business">
      <Settings />
    </Menu>
  );
};

export default SettingsPage;
