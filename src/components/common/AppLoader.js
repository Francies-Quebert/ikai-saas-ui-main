import React from "react";

const AppLoader = props => {
  return (
    <div className="loader-box" style={{justifyContent:'center'}}>
      <div className="loader">
        <div className="line bg-primary"></div>
        <div className="line bg-primary"></div>
        <div className="line bg-primary"></div>
        <div className="line bg-primary"></div>
      </div>
    </div>
  );
};

export default AppLoader;
