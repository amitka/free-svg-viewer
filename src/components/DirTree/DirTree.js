import React from "react";
import { AppContext } from "../../hooks/useAppContext";

export const DirTree = () => {
  const [appState] = React.useContext(AppContext);

  const renderDirTree = tree => {
    return (
      <React.Fragment>
        {tree.map((item, index) => {
          if (item.files) {
            return (
              <li key={item.name} className="tree-directory">
                <div
                  className="tree-item"
                  onClick={() => console.log(item.name)}
                >
                  <span className="dir-icon">X</span>
                  <span>{item.name}</span>
                </div>
                <ul className="tree-list">{renderDirTree(item.files)}</ul>
              </li>
            );
          }
          return null;
        })}
      </React.Fragment>
    );
  };

  return (
    <nav className="fsv-dir-tree">
      <section className="static">
        <ul className="tree-list root">
          <li className="tree-directory">
            <div className="tree-item" onClick={() => console.log("All")}>
              <span className="dir-icon">X</span>
              <span>All</span>
            </div>
          </li>
          <li className="tree-directory">
            <div className="tree-item" onClick={() => console.log("Favs")}>
              <span className="dir-icon">X</span>
              <span>Favorites</span>
            </div>
          </li>
        </ul>
      </section>
      <section className="dynamic">
        <div className="section-title">my icons sets</div>
        <ul className="tree-list root">{renderDirTree(appState.fileTree)}</ul>
      </section>
    </nav>
  );
};
