import React from "react";

const ComponentSmallCard = (props) => {
  return (
    <div
      className="card-small-background-primary"
      style={{
        padding: "6px 10px",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        
        minHeight: 100,
        borderRadius:5
      }}
    className="bg-color-style">
      <div className="card-small-price">
        <div>325 </div>
        <div style={{ fontSize: 20, margin: 6 }}>$</div>
      </div>
      <div
        className="card-small-header"
        style={{ fontSize: 16, color: "#fff" }}
      >
        {/* {props.title} */}
        August Revenue
      </div>
    </div>
  );
};

export default ComponentSmallCard;
// https://w0.pngwave.com/png/72/156/line-chart-bar-chart-graph-png-clip-art.png
