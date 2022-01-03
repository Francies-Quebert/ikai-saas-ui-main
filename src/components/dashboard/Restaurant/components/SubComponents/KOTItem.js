import React, { useState, useEffect } from "react";
import { Row, Col, Button, Popconfirm, message, Descriptions } from "antd";
import { DeleteFilled, TableOutlined } from "@ant-design/icons";
import Item from "antd/lib/list/Item";
import { useSelector } from "react-redux";
import nonveg from "../../../../../assets/images/nonveg.png";
import veg from "../../../../../assets/images/veg.png";

import _ from "lodash";

const KOTItem = (props) => {
  // console.log(props.data, "after add");
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  return (
    <Row
      style={{
        padding: "3px 0px",
        borderBottom: "1px dotted rgba(225,91,49,0.5)",
        //  color: "rgb(225,91,49)"
      }}
    >
      <Col style={{ alignSelf: "center" }} span={14}>
        <div
          style={{
            fontSize: 12,
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.data.DietType === "V" ? (
            <img src={veg} height="10" width="10" style={{ marginRight: 5 }} />
          ) : (
            <img
              src={nonveg}
              height="10"
              width="10"
              style={{ marginRight: 5 }}
            />
          )}
          <div
            onClick={() => {
              props.onMenuNameClick(props.data);
            }}
            className="menu-display-name"
            style={{
              cursor: "pointer",
              textDecoration:
                props.data.ItemStatus === "RJCT" ||
                props.data.ItemStatus === "CNL"
                  ? "line-through"
                  : "none",
              color:
                props.data.ItemStatus === "RJCT" ||
                props.data.ItemStatus === "CNL"
                  ? "red"
                  : "#000",
            }}
          >
            {/* {console.log(props.data, "kot item")} */}
            {props.data.MenuDisplayName}
          </div>
        </div>
        <div style={{ fontSize: 10 }}>
          {/* {props.data.MenuDisplayDesc
            ? props.data.MenuDisplayDesc.map((ii) => ii)
            : ""} */}
          {props.data.MenuDisplayDesc
            ? props.data.MenuDisplayDesc.split("~").map((ii) => (
                <div key={ii}>{ii}</div>
              ))
            : null}
        </div>
      </Col>
      <Col
        style={{ alignSelf: "center", display: "flex", flexDirection: "row" }}
        span={5}
      >
        <Button
          style={{
            backgroundColor: "rgba(238, 162, 138, 0.3)",
            borderColor: "rgb(235,144,115)",
            color: "rgb(225,91,49)",
            float: "left",
            height: 20,
            width: 20,
            fontSize: 21,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          size="small"
          // shape=""
          disabled={props.data.KOTId > 0}
          onClick={() => props.onDecrement()}
        >
          -
        </Button>
        <div
          style={{
            alignSelf: "center",
            margin: "0px 15px",
            width: 20,
            textAlign: "center",
          }}
        >
          {props.data.Qty}
        </div>
        <Button
          style={{
            backgroundColor: "rgba(238, 162, 138, 0.3)",
            borderColor: "rgb(235,144,115)",
            color: "rgb(225,91,49)",
            // position: "absolute",
            // right: 10,
            height: 20,
            width: 20,
            fontSize: 14,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          size="small"
          // shape="circle"
          disabled={props.data.KOTId > 0}
          onClick={() => props.onIncrement()}
        >
          +
        </Button>
      </Col>
      <Col
        style={{ alignSelf: "center", minHeight: 32, textAlign: "center" }}
        span={3}
      >
        <div style={{ fontSize: 12, fontWeight: "600" }}>
          {currency.value1} {parseInt(props.data.MenuSumRate) * props.data.Qty}
        </div>
        <div style={{ fontSize: 10 }}>
          {currency.value1} {parseInt(props.data.MenuSumRate)}
        </div>
      </Col>
      <Col style={{ alignSelf: "center", textAlign: "center" }} span={2}>
        <Popconfirm
          placement="leftTop"
          title="Are you sure delete this order?"
          onConfirm={() => {
            props.onDelete();
            message.success("Deleted Successfull.");
          }}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <DeleteFilled
            className="delete-filled-custom"
            style={{ color: "rgb(225,91,49)" }}
          />
        </Popconfirm>
      </Col>
    </Row>
  );
};

export default KOTItem;
