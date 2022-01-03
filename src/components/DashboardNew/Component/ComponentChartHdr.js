import React from "react";
import Chart from "../../../assets/images/chart.png";
const ComponentChartHdr = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        padding: "7px 0px 0px",
        flexDirection: "column",
        minHeight: 300,
        borderRadius: 5,
      }}
    >
      <div
        className="card-small-header"
        style={{
          textAlign: "center",
          
          fontWeight: "400",
          textDecoration: "underline",
        }}
      className="color-style">
        No. of Customer based on City
      </div>
      <div style={{ flex: 1, margin: "0px 0px 0px" }} className="image-test">
        {/* <img src={Chart} /> */}
      </div>
    </div>
  );
};

export default ComponentChartHdr;
