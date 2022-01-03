import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card, Input, Select, DatePicker } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import _ from "lodash";
import CardHeader from "../components/common/CardHeader";
import { fetchPayModeMaster } from "../services/receipts-payments";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
const { Option } = Select;

const lableColSpan = 3;
const InputColSpan = 8;

const AddLoanAccount = (props) => {
  const InitialVal = {
    Account_Name: null,
    Lender_Bank: null,
    Account_Number: null,
    Description: null,
    Current_Balance: null,
    Processing_Fees: null,
    Interest_Rate: null,
    Balance_as_of: null,
    Term_Duration: null,
    Processing_Fees: null,
    Processing_Fees_paid: null,
    LoanRecivedBank: null,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(InitialVal);
  const [paymentMode, setPaymentMode] = useState([]);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setIsLoading(true);
    fetchPayModeMaster(CompCode).then((res) => {
      //   console.log(res, "fetch data from paymode");
      let tempData = [];
      res.forEach((element) => {
        tempData.push({
          ...element,
          IsActive: element.IsActive.data[0] === 1 ? true : false,
        });
      });
      //   console.log(tempData, "converted paymode");
      setPaymentMode(tempData);
    });
  }, []);

  return (
    <div className="container-fluid py-2">
      <div className="row">
        <div className="col-md-12">
          <Col span={24}>
            <CardHeader title="AddLoanAccount" />

            <Card bodyStyle={{ padding: "7px 10px" }}>
              <Row style={{ marginBottom: 5 }}>
                <Col span={lableColSpan}>
                  <span style={{ color: "red" }}>*</span> Account Name :
                </Col>
                <Col span={InputColSpan}>
                  <Input
                    value={formValues.Account_Name}
                    placeholder="Please Enter Name"
                    allowClear
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        Account_Name: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: 5 }}>
                <Col span={lableColSpan}>Lender Bank :</Col>
                <Col span={InputColSpan}>
                  <Input
                    value={formValues.Lender_Bank}
                    placeholder="Please Enter Values"
                    allowClear
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        Lender_Bank: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>

              <Row style={{ marginBottom: 5 }}>
                <Col span={lableColSpan}>Account Number :</Col>
                <Col span={InputColSpan}>
                  <Input
                    type="number"
                    placeholder="Please Enter Number"
                    allowClear
                    value={formValues.Account_Number}
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        Account_Number: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>

              <Row style={{ marginBottom: 5 }}>
                <Col span={lableColSpan}>Description :</Col>
                <Col span={InputColSpan}>
                  <Input.TextArea
                    value={formValues.Description}
                    rows={1}
                    placeholder="Please Enter Text..."
                    allowClear
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        Description: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </div>
      </div>

      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-lg-6">
            <Col span={24}>
              <Card bodyStyle={{ padding: "7px 12px" }}>
                <Row style={{ marginBottom: 5 }}>
                  <Col flex={0.1}>
                    <span style={{ color: "red" }}>*</span> Current Balance :
                  </Col>
                  <Col flex={1}>
                    <Input
                      value={formValues.Current_Balance}
                      type="number"
                      style={{ width: "100%" }}
                      placeholder="Please Enter Number"
                      allowClear
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          Current_Balance: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 5 }}>
                  <Col flex={0.1}>Loan Received in :</Col>
                  <Col span={InputColSpan}>
                    <Select
                      showSearch
                      value={formValues.LoanRecivedBank}
                      style={{ width: 405 }}
                      placeholder="Select a person"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          LoanRecivedBank: e,
                        });
                      }}
                    >
                      {paymentMode.length > 0 &&
                        paymentMode.map((item) => {
                          return (
                            <Option key={item.PayCode} value={item.PayCode}>
                              {item.PayDesc}
                            </Option>
                          );
                        })}
                    </Select>
                  </Col>
                </Row>

                <Row style={{ marginBottom: 5 }}>
                  <Col flex={0.23}>Interest Rate :</Col>
                  <Col flex={1}>
                    <Input
                      value={formValues.Interest_Rate}
                      type="number"
                      placeholder="% Per. annum "
                      style={{ textAlign: "right" }}
                      allowClear
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          Interest_Rate: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 5 }}>
                  <Col flex={0.18}>Balance as of :</Col>
                  <Col flex={1}>
                    <DatePicker
                      value={formValues.Balance_as_of}
                      format={"YYYY-MM-DD"}
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => {
                        setFormValues({ ...formValues, Balance_as_of: date });
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 5 }}>
                  <Col flex={0.19}>Term Duration :</Col>
                  <Col flex={1}>
                    <Input
                      type="number"
                      value={formValues.Term_Duration}
                      placeholder="(in Month) "
                      style={{ float: "right" }}
                      allowClear
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          Term_Duration: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Button
                  type="primary"
                  style={{ marginRight: 5, textAlign: "center" }}
                  icon={<SaveOutlined />}
                  onClick={() => {}}
                >
                  Save
                </Button>
              </Card>
            </Col>
          </div>

          <div className="col-md-6">
            <Col span={24}>
              <Card bodyStyle={{ padding: "7px 12px" }}>
                <Row style={{ marginBottom: 5 }}>
                  <Col flex={0.55}>Processing Fees :</Col>
                  <Col flex={1}>
                    <Input
                      type="number"
                      value={formValues.Processing_Fees}
                      placeholder="Enter your Number"
                      style={{ textAlign: "right" }}
                      allowClear
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          Processing_Fees: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 5 }}>
                  <Col flex={0.1}>Processing Fees paid From :</Col>
                  <Col span={InputColSpan}>
                    <Select
                      showSearch
                      value={formValues.Processing_Fees_paid}
                      style={{ width: 350 }}
                      placeholder="Select a person"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          Processing_Fees_paid: e,
                        });
                      }}
                    >
                      {paymentMode.length > 0 &&
                        paymentMode.map((item) => {
                          return (
                            <Option key={item.PayCode} value={item.PayCode}>
                              {item.PayDesc}
                            </Option>
                          );
                        })}
                    </Select>
                  </Col>
                </Row>
              </Card>
            </Col>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLoanAccount;
