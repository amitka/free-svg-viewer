import React, { useContext, useEffect } from "react";
import { AppContext } from "../../hooks/useAppContext";
import DirTree from "../../components/DirTree";
import Gallery from "../../components/Gallery";
import Preview from "../../components/Preview";

const { ipcRenderer } = window.require("electron");

function App() {
  const [appState, setAppState] = useContext(AppContext);

  useEffect(() => {
    // EMIT APP READY EVENT
    ipcRenderer.send("rendererEvent", { appIsReady: true });
  }, []);

  useEffect(() => {
    console.log("App useEffect..");
    ipcRenderer.on("iconsFolderEvent", (event, data) => {
      setAppState(appState => ({
        ...appState,
        fileTree: data.tree,
        defaultPath: data.path
      }));
    });
    // CLEANUP
    return () => {
      ipcRenderer.removeAllListeners("iconsFolderEvent");
    };
  });

  return (
    <main className="App">
      <DirTree />
      <Gallery />
      <Preview />
    </main>
  );
}

export default App;
