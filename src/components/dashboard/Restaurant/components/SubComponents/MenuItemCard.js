import React from "react";
import { Card, Typography } from "antd";
const { Meta } = Card;
const { Text } = Typography;

function MenuItemCard(props) {
  //   return <div style={{ height: 40, width: 80 }}>{props.MenuTitle}</div>;
  //   console.log(props);
  return (
    <Card.Grid
      style={{
        width: "33.33%",
        textAlign: "center",
        padding: 5,
        minHeight: 90,
      }}
      onClick={() => console.log("menu press", props.data)}
    >
      <div style={{ height: "100%", width: "100%" }}>
        <Text strong>{props.data.MenuName}</Text>
        <br />
        <Text type="secondary">{props.data.Rate}</Text>
      </div>
    </Card.Grid>
  );
}

export default MenuItemCard;
