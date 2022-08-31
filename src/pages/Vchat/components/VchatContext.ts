import React from 'react';

interface StatePublicCatalog {
  vchatActivated: boolean;
  setVchatActivated: null | Function;
  code: string | null;
  setCode: Function | null;
}

const VchatContext = React.createContext<StatePublicCatalog>({
  vchatActivated: false,
  setVchatActivated: null,
  code: null,
  setCode: null
});

export default VchatContext;
