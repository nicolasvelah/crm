import React from 'react';

const WalletContext = React.createContext<{ dataTable: any[]; setDataTable: null | Function; updateStatusTable: null | Function; updateStatusTableLead: null | Function }>({ dataTable: [], setDataTable: null, updateStatusTable: null, updateStatusTableLead: null });

export default WalletContext;
