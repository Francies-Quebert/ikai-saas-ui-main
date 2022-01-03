import React from "react";

const AppError = props => {
  return (
    <div
      className="typography"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
        // flexDirection:'row'
      }}
    >
      <div>
        <blockquote className="blockquote">
          <p className="h4 txt-primary">{props.ErrorTitle}</p>
          <footer className="blockquote-footer">
            {props.ErrorDesc}
            {/* <cite title="Source Title">Source Title</cite> */}
          </footer>
        </blockquote>
      </div>
    </div>
  );
};

export default AppError;
