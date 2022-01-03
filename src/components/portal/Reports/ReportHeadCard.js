import React, { useState, useEffect } from "react";
import { Drawer, Button, Radio, Switch } from "antd";
import {
  SettingOutlined,
  CloseOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TableOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const ReportHeadCard = (props) => {
  // const [displayType, setDisplayType] = useState("TABL");
  const [modal, setModal] = useState(false);
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#FFF",
        padding: "10px",
        height: 52,
        display: "flex",
        border: "1px solid var(--app-theme-color-rbga)",
        borderRadius: "3px",
      }}
    >
      <Button
        type="primary"
        // style={{ width: "100%", marginTop: 5 }}
        onClick={() => {
          props.onCollapsePress();
        }}
      >
        {React.createElement(
          props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined
        )}
      </Button>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          margin: "auto",
          color: "var(--app-theme-color)",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {props.selectedReport ? props.selectedReport.ModuleName : ""}
      </div>

      {props.selectedReport && props.displayType && (
        <>
          <div style={{ margin: "3px 6px" }}>
            <Switch
              // checkedChildren={<ArrowUpOutlined />}
              // unCheckedChildren={<ArrowDownOutlined />}
              checkedChildren="show"
              unCheckedChildren="hide"
              checked={props.showParameter}
              onChange={(e) => {
                props.onParameterChange(e);
              }}
            />
          </div>
          <Radio.Group
            value={props.displayType}
            buttonStyle="solid"
            onChange={(e) => {
              props.onDisplayTypeChange(e.target.value);
              // setDisplayType(e.target.value);
            }}
            disabled={props.reportHdr === null}
            size="middle"
          >
            <Radio.Button
              // disabled={props.hdrDtl.hasView === "N"}
              disabled={
                props.reportHdr === null || props.reportHdr.hasView === "N"
              }
              value="TABL"
            >
              <TableOutlined />
            </Radio.Button>
            <Radio.Button
              disabled={
                props.reportHdr === null || props.reportHdr.hasPrintable === "N"
              }
              // disabled={props.hdrDtl.hasPrintable === "N"}
              value="PRINT"
            >
              <PrinterOutlined />
            </Radio.Button>
            <Radio.Button
              disabled={
                props.reportHdr === null || props.reportHdr.hasGraph === "N"
              }
              // disabled={props.hdrDtl.hasGraph === "N"}
              value="GRAPHS"
            >
              <LineChartOutlined style={{ padding: "0px 3px" }} />
              <PieChartOutlined style={{ padding: "0px 3px" }} />
              <BarChartOutlined style={{ padding: "0px 3px" }} />
            </Radio.Button>
          </Radio.Group>
          <Button
            style={{ marginRight: 7 }}
            icon={<SettingOutlined />}
            onClick={() => {
              props.onReportSettingClick();
              // setModal(true);
              // setEditedData({ entryMode: "A" });
            }}
          />
        </>
      )}

      {props.selectedReport && (!props.isModal ? true : false) && (
        <div
          style={{
            width: 30,
            margin: "auto",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            props.onClosePress();
          }}
        >
          <CloseOutlined
            style={{
              color: "var(--app-theme-color)",
              fontSize: 21,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReportHeadCard;
