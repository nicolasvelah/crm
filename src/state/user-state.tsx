import React, {
  useReducer,
  createContext,
  FunctionComponent,
  ReactChild,
} from 'react';

type TypeActions = 'increment_state1' | 'setState2' | 'setState3';

export interface ActionReducer {
  type: TypeActions;
  value: any;
}

export interface UserInitState {
  state1: number;
  state2: string;
  state3?: string;
}

const initState: UserInitState = {
  state1: 0,
  state2: 'Estado inicial',
  state3: 'Otro estado',
};

const reducer = (state = initState, action: ActionReducer) => {
  switch (action.type) {
    case 'increment_state1': {
      const newState = {
        ...state,
        state1: state.state1 + 1,
      };
      return newState;
    }
    case 'setState2': {
      const newState = {
        ...state,
        state2: action.value,
      };
      return newState;
    }
    case 'setState3': {
      const newState = {
        ...state,
        state3: action.value,
      };
      return newState;
    }
    default:
      throw new Error('Unexpected action');
  }
};

export const GlobalUserContext = createContext({});
// const UserProvider = createContext({ initState, dispatch });

/* export default function useLoginReducer(): [UserInitState, Function] {
  const [store, dispatch] = useReducer(reducer, initState);

  return [store, dispatch];
} */

const UserStoreProvider: FunctionComponent<{ children: ReactChild }> = ({
  children,
}: {
  children: ReactChild;
}) => {
  const [store, dispatch] = useReducer(reducer, initState);
  /* const contextValue: [UserInitState, Function] = React.useMemo(() => [store, dispatch], [
    store,
    dispatch,
  ]); */
  // console.log('contextValue', contextValue);
  return (
    <GlobalUserContext.Provider value={[store, dispatch]}>
      {children}
    </GlobalUserContext.Provider>
  );
};

export default UserStoreProvider;
