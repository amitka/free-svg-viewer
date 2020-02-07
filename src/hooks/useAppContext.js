import React, { useState } from "react";

const AppContext = React.createContext([{}, () => {}]);

const DEFAULT_STATE = {
  message: "Hello from Free-svg-viewer!"
};

const AppContextProvider = props => {
  const [state, setState] = useState(DEFAULT_STATE);
  return (
    <AppContext.Provider value={[state, setState]}>
      {props.children}
    </AppContext.Provider>
  );
};

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
