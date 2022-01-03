import React from "react";
import NoDataImage from "../../assets/images/no-record-found.png";
const NoData = () => {
  return (
    <div>
      <img
        src={NoDataImage}
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default NoData;
