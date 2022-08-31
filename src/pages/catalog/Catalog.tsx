/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import Menu from '../../components/Template';
import CatalogV2 from './components/Catalog';

const Catalog = () => {
  return (
    <Menu page="Catálogos">
      <CatalogV2 />
    </Menu>
  );
};

export default Catalog;
