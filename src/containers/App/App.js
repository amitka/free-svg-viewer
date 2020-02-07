import React, { useContext } from "react";
import { AppContext } from "../../hooks/useAppContext";

function App() {
  const [state] = useContext(AppContext);
  return (
    <main className="App">
      <h1>Free-svg-viewer</h1>
      <h4>{state.message}</h4>
    </main>
  );
}

export default App;
