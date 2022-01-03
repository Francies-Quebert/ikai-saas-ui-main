import { Button, Typography, Modal } from "antd";
import React, { useState } from "react";
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
import TransferAndAjustments from "../../BankAndCashBook/components/TransferAndAjustments";

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
          backgroundColor: "#f0eee4",
        }}
      >
        <Container>
          <div style={{ width: 70, display: "flex", alignItems: "center" }}>
            <Avatar src={IMG_CHQ} />
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
                <div style={{ display: "flex" }}>
                  <div>
                    <div style={{ color: "var(--app-theme-color)" }}>
                      Payable
                    </div>
                    <div style={{ color: "red", fontWeight: "600" }}>
                      {l_ConfigCurrency.value1}{" "}
                      {props.calcAmount.issued.toFixed(2)}
                    </div>
                  </div>
                  <div
                    style={{
                      margin: "auto",
                      padding: "0px 15px",
                    }}
                  >
                    -
                  </div>
                  <div
                    style={{
                      padding: "0px 15px 0px",
                    }}
                  >
                    <div style={{ color: "var(--app-theme-color)" }}>
                      Receiveable
                    </div>
                    <div style={{ color: "green", fontWeight: "600" }}>
                      {l_ConfigCurrency.value1}{" "}
                      {props.calcAmount.received.toFixed(2)}
                    </div>
                  </div>
                  <div
                    style={{
                      margin: "auto",
                      padding: "0px 15px",
                    }}
                  >
                    =
                  </div>
                  <div>
                    <div style={{ color: "var(--app-theme-color)" }}>Total</div>
                    <div
                      style={{
                        color: props.calcAmount.total < 0 ? "red" : "green",
                        fontWeight: "600",
                      }}
                    >
                      {l_ConfigCurrency.value1}{" "}
                      {Math.abs(props.calcAmount.total).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: "end",
                  justifyContent: "flex-end",
                  margin: "auto",
                }}
              >
                <Button
                  style={{ width: 150, marginBottom: 5 }}
                  type="primary"
                  icon={<DownloadOutlined />}
                  size={"small"}
                >
                  Download
                </Button>
              </div>
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
          TranType={showModal}
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
