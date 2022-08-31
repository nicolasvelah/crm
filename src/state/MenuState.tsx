import React, {
  useReducer,
  createContext,
  FunctionComponent,
  ReactChild,
} from 'react';
import Menu from '../components/Template';

type TypeActions = 'set-loading' | 'set-user';
export type DispatchMenu = (action: ActionReducer) => void;

export interface ActionReducer {
  type: TypeActions;
  payload: any;
}

export interface ConsesionarioInterface {
  codigo: string;
  descripcion: string;
  id_cot_cliente: number;
  id_lista_precio: number;
  sucursal: Array<{ id_sucursal: number; sucursal: string }>;
}

export interface UserGlobal {
  apellido: string;
  brand: string;
  codUsuario: string;
  concessionaire: string;
  dealer: Array<ConsesionarioInterface>;
  createdAt: string;
  empresa: string;
  id: number;
  CRMTransactionToken: string;
  nombre: string;
  role: string;
  timeExpiration: string;
  updateAt: string;
}

export interface MenuGlobalState {
  loading: boolean;
  user: UserGlobal;
  state3?: string;
}

export const initState: MenuGlobalState = {
  loading: false,
  user: {
    apellido: '',
    brand: '',
    codUsuario: '',
    concessionaire: '',
    createdAt: '',
    empresa: '',
    id: -1,
    CRMTransactionToken: '',
    nombre: '',
    role: '',
    timeExpiration: '',
    updateAt: '',
    dealer: [],
  },
  state3: 'Otro estado',
};

export const reducer = (state = initState, action: ActionReducer) => {
  switch (action.type) {
    case 'set-loading': {
      //console.log('Entro Loading', action.payload);
      const newState: MenuGlobalState = {
        ...state,
        loading: action.payload,
      };
      return newState;
    }
    case 'set-user': {
      const newState: MenuGlobalState = {
        ...state,
        user: action.payload,
      };
      return newState;
    }
    default:
      throw new Error('Unexpected action');
  }
};

export const GlobalMenuContext = createContext<Object>({
  store: initState,
  dispatch: (action: string, payload: any) => {
    //console.log('Store');
  },
});

const MenuStoreProvider: FunctionComponent<{
  children: ReactChild;
  page: string;
}> = ({ children, page }) => {
  const [store, dispatch] = useReducer(reducer, initState);
  //console.log('MenuStoreProvider', [store, dispatch]);
  return (
    <GlobalMenuContext.Provider value={{ store, dispatch }}>
      <Menu page={page}>{children}</Menu>
    </GlobalMenuContext.Provider>
  );
};

export default MenuStoreProvider;
