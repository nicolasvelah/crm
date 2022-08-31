const setHistoryState = (step: number): void => {
  //console.log('window.history', window.history.state);
  window.history.replaceState(
    {
      ...window.history.state,
      state: {
        ...window.history.state.state,
        step,
      },
    },
    '',
    window.location.href
  );
  //console.log('window.history2', window.history.state);
};

export default setHistoryState;
