import React from 'react';

const GlobalQuoteContext = React.createContext({
  cost: 0,
  setCost: (cost: number) => {},
  nameAccessory: [] as string[],
  setNameAccessory: (nameAccessory: string[]) => {}
});

export default GlobalQuoteContext;
