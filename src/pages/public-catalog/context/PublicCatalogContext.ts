import React from 'react';

interface StateVchat {
  brand: string;
  setBrand: null | Function;
  catalogVehicle: any;
  setCatalogVehicle: null | Function;
  setLoading: null | Function;
  loading: boolean;
  clientData: any;
  setClientDataContext: null | Function;
  sucursalContext: any;
  setSucursalContext: null | Function;
  quote: any;
  setQuote: null | Function;
}

const PublicCatalogContext = React.createContext<StateVchat>({
  brand: '',
  setBrand: null,
  catalogVehicle: null,
  setCatalogVehicle: null,
  setLoading: null,
  loading: false,
  clientData: null,
  setClientDataContext: null,
  sucursalContext: null,
  setSucursalContext: null,
  quote: null,
  setQuote: null
});

export default PublicCatalogContext;
