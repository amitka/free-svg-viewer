import React from "react";

const renderTree = tree => {
  return (
    <React.Fragment>
      {tree.map((item, index) => {
        return item.files ? (
          <li className="tree-item directory">
            <span>{item.name}</span>
            <ul className="tree-list">{renderTree(item.files)}</ul>
          </li>
        ) : (
          <li className="tree-item leaf">
            <span>{item.name}</span>
          </li>
        );
      })}
    </React.Fragment>
  );
};
