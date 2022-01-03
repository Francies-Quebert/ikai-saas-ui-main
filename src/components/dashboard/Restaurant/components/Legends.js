import React from "react";
import { Typography } from "antd";

const { Text } = Typography;
const Legends = (props) => {
  return (
    <>
      <Text style={{ marginRight: 5 }}>{props.title}</Text>
      <div
        style={{
          height: 13,
          width: 13,
          backgroundColor: props.color,
          borderRadius: 2,
          margin: 10,
        }}
      />
    </>
  );
};
export default Legends;
