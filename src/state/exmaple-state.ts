import { useReducer } from 'react';

const initState = {
  state1: 0,
  state2: 'Estado inicial',
  state3: 'Otro estado',
};

const reducer = (state = initState, action: any) => {
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

    default:
      throw new Error('Unexpected action');
  }
};

export default function useLoginReducer() {
  const [store, dispatch] = useReducer(reducer, initState);

  return [store, dispatch];
}
