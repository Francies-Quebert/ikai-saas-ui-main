import { Button, Typography, Modal } from "antd";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import IMG_BANK from "../../../icons/bank.png";
import IMG_GATEWAY from "../../../icons/gateway.png";
import IMG_WALLET from "../../../icons/wallet.png";
import IMG_CASH from "../../../icons/cash.png";
import IMG_CHQ from "../../../icons/cheque.png";
import {
  SwapOutlined,
  EditOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import TransferAndAjustments from "./TransferAndAjustments";

import { useDispatch, useSelector } from "react-redux";
const { Title, Text } = Typography;

const BankComponent = (props) => {
  const [showModal, setShowModal] = useState();
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  

  return (
    <>
      <Card
        onClick={props.onRowSelect}
        style={{
          backgroundColor:
            props.selectedData &&
            props.selectedData.PayCode === props.data.PayCode
              ? props.isHeader
                ? "#f0eee4"
                : "var(--app-theme-color-secondary)"
              : "white",
        }}
      >
        <Container>
          <div style={{ width: 70, display: "flex", alignItems: "center" }}>
            <Avatar
              src={
                props.data.PaymentType === "BANK"
                  ? IMG_BANK
                  : props.data.PaymentType === "WALLET"
                  ? IMG_WALLET
                  : props.data.PaymentType === "GATEWAY"
                  ? IMG_GATEWAY
                  : props.data.PaymentType === "CASH"
                  ? IMG_CASH
                  : props.data.PaymentType === "CHQ"
                  ? IMG_CHQ
                  : null
              }
            />
          </div>
          <div
            style={{
              marginLeft: 8,
              flex: 1,
              display: "flex",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
              <div>
                <h4>
                  <b>{props.data.PayDesc}</b>
                </h4>
                <p
                  style={{
                    color:
                      parseFloat(props.data.ClosingBalance) > 0
                        ? "darkgreen"
                        : "red",
                  }}
                >
                  {l_ConfigCurrency.value1}{" "}
                  {Math.abs(parseFloat(props.data.ClosingBalance)).toFixed(2)}
                </p>
              </div>
              {props.isHeader === true && (
                <>
                  <div style={{ flex: 0.5, textAlign: "center" }}>
                    {props.data.PaymentType === "BANK" && (
                      <>
                        <table style={{ width: "100%" }}>
                          {_.includes(
                            [undefined, null, ""],
                            props.data.SysOption1
                          ) === false && (
                            <tr>
                              <td>Account No</td>
                              <td>:</td>
                              <td>
                                <Text strong>{props.data.SysOption1}</Text>
                              </td>
                            </tr>
                          )}

                          {_.includes(
                            [undefined, null, ""],
                            props.data.SysOption2
                          ) === false && (
                            <tr>
                              <td>Beneficiary</td>
                              <td>:</td>
                              <td>
                                <Text strong>{props.data.SysOption2}</Text>
                              </td>
                            </tr>
                          )}

                          {_.includes(
                            [undefined, null, ""],
                            props.data.SysOption3
                          ) === false && (
                            <tr>
                              <td>IFSC Code</td>
                              <td>:</td>
                              <td>
                                <Text strong>{props.data.SysOption3}</Text>
                              </td>
                            </tr>
                          )}
                        </table>
                      </>
                    )}
                    {props.data.PaymentType === "GATEWAY" && (
                      <>
                        <table style={{ width: "100%" }}>
                          {_.includes(
                            [undefined, null, ""],
                            props.data.SysOption1
                          ) === false && (
                            <tr>
                              <td>Company Name</td>
                              <td>:</td>
                              <td>
                                <Text strong>{props.data.SysOption1}</Text>
                              </td>
                            </tr>
                          )}
                        </table>
                      </>
                    )}
                    {props.data.PaymentType === "WALLET" && (
                      <>
                        <table style={{ width: "100%" }}>
                          {_.includes(
                            [undefined, null, ""],
                            props.data.SysOption1
                          ) === false && (
                            <tr>
                              <td>Company Name</td>
                              <td>:</td>
                              <td>
                                <Text strong>{props.data.SysOption1}</Text>
                              </td>
                            </tr>
                          )}
                        </table>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      flex: 0.5,
                      textAlign: "end",
                      // justifyContent: "center",
                    }}
                  >
                    <Button
                      style={{ width: 150, marginBottom: 5 }}
                      type="primary"
                      icon={<SwapOutlined />}
                      size={"small"}
                      onClick={() => {
                        setShowModal({ type: "TRNFR" });
                      }}
                      disabled={!props.IsAllowTransfer}
                    >
                      Transfer
                    </Button>
                    <br />
                    <Button
                      style={{ width: 150, marginBottom: 5 }}
                      type="primary"
                      icon={<EditOutlined />}
                      size={"small"}
                      onClick={() => {
                        setShowModal({ type: "ADJS" });
                      }}
                      disabled={!props.IsAllowAdjustment}
                    >
                      Adjustment
                    </Button>
                    <br />
                    <Button
                      style={{ width: 150, marginBottom: 5 }}
                      type="primary"
                      icon={<DownloadOutlined />}
                      size={"small"}
                      onClick={()=>{
                        props.onPrintClick()
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </Card>
      <Modal
        width="fit-content"
        visible={showModal ? true : false}
        footer={null}
        onCancel={() => {
          setShowModal();
        }}
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 4 }}
        destroyOnClose={true}
        maskClosable={false}
      >
        <TransferAndAjustments
          TranType={showModal && showModal.type}
          data={props.data}
          onBackPress={() => {
            setShowModal();
          }}
          refrehPage={() => {
            props.refrehPage();
          }}
        />
      </Modal>
    </>
  );
};

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: 8px 0px;
  border-radius: 10px 10px 0px 10px;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

const Container = styled.div`
  padding: 8px 8px;
  display: flex;
  flexdirection: row;
`;

const Avatar = styled.img`
  vertical-align: middle;
  width: 40px;
  height: 40px;
`;

export default BankComponent;
