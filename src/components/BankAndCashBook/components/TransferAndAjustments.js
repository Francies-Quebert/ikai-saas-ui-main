import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Button,
  DatePicker,
  Space,
  Row,
  Col,
  Select,
  InputNumber,
  Input,
} from "antd";
import { useSelector } from "react-redux";
import {
  RetweetOutlined,
  PrinterOutlined,
  SaveFilled,
  SaveOutlined,
} from "@ant-design/icons";
import {
  fetchDataCashBankTransferPayModes,
  InsUpdtCashBankTransferOrAdjustments,
  updtCheque_Deposit_Witdraw_ReOpen,
} from "../../../services/payModeMaster";

import moment from "moment";
class InputConfig {
  constructor(label, isVisible, isEnabled) {
    this.label = label;
    this.isVisible = isVisible;
    this.isEnabled = isEnabled;
  }
}

const { Option } = Select;
const { TextArea } = Input;
const TransferAndAjustments = (props) => {
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const [formData, setFormData] = useState({
    TranType: props.TranType,
    TranNo: null,
    TranId: null,
    TranDate: moment(),
    SourcePayCode: null,
    DestinationPayCode: null,
    Amount: 0,
    Remark: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [formLabel, setFromLabel] = useState({
    TranDate: new InputConfig("Date", true, true),
    SourcePayCode: new InputConfig("Source", true, true),
    DestinationPayCode: new InputConfig("Destination", true, true),
    Amount: new InputConfig("Amount", true, true),
    Remark: new InputConfig("Remark", true, true),
  });
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [eligiblePaymentModes, setEligiblePaymentModes] = useState([]);

  useEffect(() => {
    fetchDataCashBankTransferPayModes(CompCode).then((res) => {
      setEligiblePaymentModes(res);
    });

    if (props.TranType === "TRNFR") {
      setFromLabel({
        TranDate: new InputConfig("Date", true, true),
        SourcePayCode: new InputConfig("From (Bank / Cash)", true, false),
        DestinationPayCode: new InputConfig("To (Bank / Cash)", true, true),
        Amount: new InputConfig("Amount", true, true),
        Remark: new InputConfig("Remark (Optional)", true, true),
      });
      setFormData({ ...formData, SourcePayCode: props.data.PayCode });
    } else if (props.TranType === "CHQ") {
      setFromLabel({
        TranDate: new InputConfig("Date", true, true),
        SourcePayCode: new InputConfig(
          props.data.type === "WITHDRAW"
            ? "Withdraw Account"
            : "Deposit Account",
          true,
          true
        ),
        DestinationPayCode: new InputConfig("", false, true),
        Amount: new InputConfig("Amount", true, false),
        Remark: new InputConfig("Remark (Optional)", true, true),
      });
      setFormData({ ...formData, Amount: props.data.Amount });
    } else {
      setFromLabel({
        TranDate: new InputConfig("Date", true, true),
        SourcePayCode: new InputConfig("Adjustment Account", true, false),
        DestinationPayCode: new InputConfig("", false, true),
        Amount: new InputConfig("Amount", true, true),
        Remark: new InputConfig("Remark (Optional)", true, true),
      });
      setFormData({ ...formData, SourcePayCode: props.data.PayCode });
    }
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // height: 450,
        backgroundColor: "whitesmoke",
        width: 550,
        padding: 5,
      }}
    >
      <div style={{ padding: 5 }}>
        <h5 style={{ color: " var(--app-theme-color)", marginBottom: 0 }}>
          {props.TranType === "TRNFR"
            ? "Cash / Bank Transfer"
            : props.TranType === "ADJS"
            ? "Cash / Bank Adjustments"
            : props.TranType === "CHQ"
            ? "Cheque  Deposit / Withdrawal"
            : ""}
        </h5>
      </div>
      <div style={{ flex: 1, width: "100%", padding: 8 }}>
        {/* <Space direction="vertical"> */}
        {formLabel.TranDate.isVisible && (
          <Row style={{ marginTop: 5 }}>
            <Col flex="200px" style={{ margin: "auto" }}>
              {formLabel.TranDate.label}
            </Col>
            <Col flex="auto">
              <DatePicker
                format={l_ConfigDateFormat.value1}
                value={formData.TranDate}
                disabled={!formLabel.TranDate.isEnabled}
                onChange={(date) => {
                  setFormData({ ...formData, TranDate: date });
                }}
              />
            </Col>
          </Row>
        )}

        {formLabel.SourcePayCode.isVisible && (
          <Row style={{ marginTop: 5 }}>
            <Col flex="200px" style={{ margin: "auto" }}>
              {formLabel.SourcePayCode.label}
            </Col>
            <Col flex="auto">
              <Select
                value={formData.SourcePayCode}
                disabled={!formLabel.SourcePayCode.isEnabled}
                showSearch
                onChange={(val) => {
                  setFormData({ ...formData, SourcePayCode: val });
                }}
                allowClear={true}
                style={{ width: 300 }}
                placeholder="Select a Source"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {eligiblePaymentModes &&
                  eligiblePaymentModes.length > 0 &&
                  eligiblePaymentModes
                    .filter((ee) =>
                      props.TranType !== "CHQ"
                        ? true
                        : ee.PaymentType === "BANK" || ee.PaymentType === "CASH"
                    )
                    .map((ii) => (
                      <Option key={ii.PayCode} value={ii.PayCode}>
                        {ii.PayDesc}
                      </Option>
                    ))}
              </Select>
            </Col>
          </Row>
        )}

        {formLabel.DestinationPayCode.isVisible && (
          <Row style={{ marginTop: 5 }}>
            <Col flex="200px" style={{ margin: "auto" }}>
              {formLabel.DestinationPayCode.label}
            </Col>
            <Col flex="auto">
              <Select
                value={formData.DestinationPayCode}
                allowClear={true}
                disabled={!formLabel.DestinationPayCode.isEnabled}
                onChange={(val) => {
                  setFormData({ ...formData, DestinationPayCode: val });
                }}
                showSearch
                style={{ width: 300 }}
                placeholder="Select a Destination"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {eligiblePaymentModes &&
                  eligiblePaymentModes.length > 0 &&
                  eligiblePaymentModes.map((ii) => (
                    <Option key={ii.PayCode} value={ii.PayCode}>
                      {ii.PayDesc}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>
        )}

        {formLabel.Amount.isVisible && (
          <Row style={{ marginTop: 5 }}>
            <Col flex="200px" style={{ margin: "auto" }}>
              {formLabel.Amount.label}
            </Col>
            <Col flex="auto">
              <InputNumber
                value={formData.Amount}
                disabled={!formLabel.Amount.isEnabled}
                style={{ width: 200 }}
                onChange={(val) => {
                  setFormData({ ...formData, Amount: val });
                }}
              />
            </Col>
          </Row>
        )}
        {formLabel.Remark.isVisible && (
          <Row style={{ marginTop: 5 }}>
            <Col flex="200px" style={{ margin: "auto" }}>
              {formLabel.Remark.label}
            </Col>
            <Col flex="auto">
              <TextArea
                value={formData.Remark}
                disabled={!formLabel.Remark.isEnabled}
                rows={2}
                onChange={(e) => {
                  setFormData({ ...formData, Remark: e.target.value });
                }}
              />
            </Col>
          </Row>
        )}
        {/* </Space> */}
      </div>
      <div style={{ height: "auto", padding: 5 }}>
        <Button
          icon={<SaveOutlined />}
          loading={isLoading}
          style={{ marginRight: 5 }}
          type="primary"
          onClick={() => {
            setIsLoading(true);
            let data = {
              ...formData,
              UpdtUsr: l_loginUser,
              TranDate: moment(formData.TranDate).format("YYYY-MM-DD"),
              Amount:
                props.TranType === "CHQ" && props.data.type === "WITHDRAW"
                  ? formData.Amount * -1
                  : formData.Amount,
            };
            // console.log(data);

            InsUpdtCashBankTransferOrAdjustments(CompCode, data).then((res) => {
              if (props.TranType === "CHQ") {
                updtCheque_Deposit_Witdraw_ReOpen(CompCode, {
                  TranType: props.data.TranType,
                  DetailTranId: props.data.DetailId,
                  ChequeTranDocId: res.data.TranId,
                  UpdtUsr: l_loginUser,
                  IsReOpen: false,
                });
                if (props.refrehPage) {
                  props.refrehPage();
                  props.onBackPress();
                  setIsLoading(false);
                }
              } else {
                props.refrehPage();
                props.onBackPress();
                setIsLoading(false);
              }
            });
          }}
        >
          Save
        </Button>
        <Button
          icon={<RetweetOutlined />}
          style={{ marginRight: 5 }}
          onClick={props.onBackPress}
          type="primary"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default TransferAndAjustments;
