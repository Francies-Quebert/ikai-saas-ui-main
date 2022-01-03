import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  Input,
  Select,
  DatePicker,
  Radio,
  InputNumber,
  notification,
} from "antd";
import Icon, {
  RollbackOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";

import CardHeader from "../../../../common/CardHeader";
import {
  fetchPaymodeMaster,
  InsUpdtPaymentModeMaster,
} from "../../../../../services/payModeMaster";
import { refresh } from "less";
const { Option } = Select;
const { TextArea } = Input;
const labelColSpan = 6;
const TextColSpan = 14;

const PaymentModeNewCard =  (props) => {
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const initialValues = {
    PayCode: null,
    PayDesc: null,
    PaymentType: null,
    IsPaymentGateway: "N",
    PaymentGatewayComp: null,
    OpeningBalance: null,
    AsOfBalance: null,
    PrimaryPayCode: null,
    SysOption1: null,
    SysOption2: null,
    SysOption3: null,
    SysOption4: null,
    SysOption5: null,
    SysOption6: null,
    SysOption7: null,
    SysOption8: null,
    SysOption9: null,
    SysOption10: null,
    IsActive: true,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormsValues] = useState(initialValues);
  const [payModeData, setPayModeData] = useState([]);

  const [paymentFieldTitle, setPaymentFieldTitle] = useState({
    SysOption1: "",
    SysOption2: "",
    SysOption3: "",
    SysOption4: "",
    SysOption5: "",
    SysOption6: "",
    SysOption7: "",
    SysOption8: "",
    SysOption9: "",
    SysOption10: "",
  });
  const PaymentType = [
    {
      Name: "Cash",
      Value: "CASH",
    },
    {
      Name: "Bank",
      Value: "BANK",
    },
    {
      Name: "UPI",
      Value: "UPI",
    },
    {
      Name: "Wallet",
      Value: "WALLET",
    },
    {
      Name: "Cheque",
      Value: "CHEQUE",
    },
    {
      Name: "Gateway",
      Value: "GATEWAY",
    },
    {
      Name: "Debit / Credit Card",
      Value: "CARD",
    },
  ];

  const GatewayType = [
    {
      Name: "RazorPay",
      Value: "RAZORPAY",
    },
    {
      Name: "InstaMojo",
      Value: "INSTAMOJO",
    },
    {
      Name: "Stripe",
      Value: "STRIPE",
    },
    {
      Name: "PayPal",
      Value: "PAYPAL",
    },
    {
      Name: "PayTM",
      Value: "PAYTM",
    },
  ];

  const onFinish = () => {
    if (formValues) {
      setIsLoading(true);
      const val = {
        PayCode: formValues.PayCode,
        PayDesc: formValues.PayDesc,
        PaymentType: formValues.PaymentType,
        IsPaymentGateway: formValues.IsPaymentGateway,
        PaymentGatewayComp: formValues.PaymentGatewayComp,
        OpeningBalance: formValues.OpeningBalance,
        AsOfBalance:
          formValues.AsOfBalance !== null
            ? moment(formValues.AsOfBalance).format("YYYY-MM-DD")
            : null,
        PrimaryPayCode: formValues.PrimaryPayCode,
        SysOption1: formValues.SysOption1,
        SysOption2: formValues.SysOption2,
        SysOption3: formValues.SysOption3,
        SysOption4: formValues.SysOption4,
        SysOption5: formValues.SysOption5,
        SysOption6: formValues.SysOption6,
        SysOption7: formValues.SysOption7,
        SysOption8: formValues.SysOption8,
        SysOption9: formValues.SysOption9,
        SysOption10: formValues.SysOption10,
        IsActive: formValues.IsActive,
        updt_usr: l_loginUser,
      };

      InsUpdtPaymentModeMaster(CompCode, val).then((res) => {
        notification.success({
          message: "Succesfull",
          description: "Data saved Successfully, ",
        });
        setIsLoading(false);
        props.onBackPress();
      });
    }
  };

  const setFeildValue = () => {
    if (formValues.PaymentType === "CASH") {
      setPaymentFieldTitle({
        SysOption1: "",
        SysOption2: "",
        SysOption3: "",
        SysOption4: "",
        SysOption5: "",
        SysOption6: "",
        SysOption7: "",
        SysOption8: "",
        SysOption9: "",
        SysOption10: "",
      });
    } else if (formValues.PaymentType === "BANK") {
      setPaymentFieldTitle({
        SysOption1: "Account No",
        SysOption2: "Beneficiary",
        SysOption3: "IFSC Code ",
        SysOption4: "UPI Id",
        SysOption5: "",
        SysOption6: "",
        SysOption7: "",
        SysOption8: "",
        SysOption9: "",
        SysOption10: "",
      });
    } else if (formValues.PaymentType === "UPI") {
      setPaymentFieldTitle({
        SysOption1: "UPI Id",
        SysOption2: "",
        SysOption3: "",
        SysOption4: "",
        SysOption5: "",
        SysOption6: "",
        SysOption7: "",
        SysOption8: "",
        SysOption9: "",
        SysOption10: "",
      });
    } else if (formValues.PaymentType === "WALLET") {
      setPaymentFieldTitle({
        SysOption1: "Wallet Name",
        SysOption2: "",
        SysOption3: "",
        SysOption4: "",
        SysOption5: "",
        SysOption6: "",
        SysOption7: "",
        SysOption8: "",
        SysOption9: "",
        SysOption10: "",
      });
    } else if (formValues.PaymentType === "CHEQUE") {
      setPaymentFieldTitle({
        SysOption1: "",
        SysOption2: "",
        SysOption3: "",
        SysOption4: "",
        SysOption5: "",
        SysOption6: "",
        SysOption7: "",
        SysOption8: "",
        SysOption9: "",
        SysOption10: "",
      });
    } else if (formValues.PaymentType === "GATEWAY") {
      setPaymentFieldTitle({
        SysOption1: "Company Name",
        SysOption2: "Username ",
        SysOption3: "Password ",
        SysOption4: "API Path",
        SysOption5: "",
        SysOption6: "",
        SysOption7: "",
        SysOption8: "",
        SysOption9: "",
        SysOption10: "",
      });
    } else {
      setPaymentFieldTitle({
        SysOption1: "",
        SysOption2: "",
        SysOption3: "",
        SysOption4: "",
        SysOption5: "",
        SysOption6: "",
        SysOption7: "",
        SysOption8: "",
        SysOption9: "",
        SysOption10: "",
      });
    }
  };

  useEffect(() => {
    setFeildValue();
  }, [formValues.PaymentType]);

  useEffect(() => {
    if (props.formData) {
      let data = props.formData;
      setFormsValues({
        PayCode: data.PayCode,
        PayDesc: data.PayDesc,
        PaymentType: data.PaymentType,
        IsPaymentGateway: data.IsPaymentGateway,
        PaymentGatewayComp: data.PaymentGatewayComp,
        PrimaryPayCode: data.PrimaryPayCode,
        AsOfBalance:
          data.AsOfBalance !== null ? moment(data.AsOfBalance) : null,
        OpeningBalance: data.OpeningBalance,
        SysOption1: data.SysOption1,
        SysOption2: data.SysOption2,
        SysOption3: data.SysOption3,
        SysOption4: data.SysOption4,
        SysOption5: data.SysOption5,
        SysOption6: data.SysOption6,
        SysOption7: data.SysOption7,
        SysOption8: data.SysOption8,
        SysOption9: data.SysOption9,
        SysOption10: data.SysOption10,
        IsActive: data.IsActive === 1 ? true : false,
      });
    } else {
      setFormsValues(initialValues);
    }
    fetchPaymodeMaster(CompCode).then((res) => {
      setPayModeData(res.filter((xx) => xx.PaymentType === "BANK"));
    });
  }, []);

  return (
    <>
      <Col span={18}>
        <CardHeader title={"Add "} />
        <Card>
          <Row style={{ margin: "0px 0px 5px 0px" }}>
            <Col span={labelColSpan}>
              <span style={{ color: "red" }}>* </span>Payment Code :
            </Col>
            <Col span={TextColSpan}>
              <Input
                placeholder="Enter Payment Code"
                value={formValues.PayCode}
                style={{textTransform:"uppercase"}}
                disabled={props.formData}
                onChange={(e) => {
                  setFormsValues({ ...formValues, PayCode: e.target.value });
                  if (
                    !_.includes([null, "", undefined], formValues.PayCode) ||
                    !_.includes([null, "", undefined], formValues.PayCode)
                  ) {
                    setFormsValues({ ...formValues, PayCode: e.target.value });
                  }
                }}
              />
            </Col>
          </Row>
          <Row style={{ margin: "0px 0px 5px 0px" }}>
            <Col span={labelColSpan}>
              <span style={{ color: "red" }}>* </span>Payment Description :
            </Col>
            <Col span={TextColSpan}>
              <TextArea
                value={formValues.PayDesc}
                disabled={
                  formValues.PaymentType === "CASH" ||
                  formValues.PaymentType === "CHEQUE"
                }
                onChange={(e) => {
                  setFormsValues({ ...formValues, PayDesc: e.target.value });
                  if (
                    !_.includes([null, "", undefined], formValues.PayDesc) ||
                    !_.includes([null, "", undefined], formValues.PayDesc)
                  ) {
                    setFormsValues({ ...formValues, PayDesc: e.target.value });
                  }
                }}
              />
            </Col>
          </Row>
          <Row style={{ margin: "0px 0px 5px 0px" }}>
            <Col span={labelColSpan}>
              <span style={{ color: "red" }}>* </span>Payment Type :
            </Col>
            <Col span={TextColSpan}>
              <Select
                placeholder="Select Payment Type"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                disabled={
                  formValues.PaymentType === "CASH" ||
                  formValues.PaymentType === "CHEQUE"
                }
                value={formValues.PaymentType}
                style={{ width: "100%" }}
                onChange={(val) => {
                  setFormsValues({
                    ...formValues,
                    PaymentType: val,
                    SysOption1: null,
                    SysOption2: null,
                    SysOption3: null,
                    SysOption4: null,
                    SysOption5: null,
                    SysOption6: null,
                    SysOption7: null,
                    SysOption8: null,
                    SysOption9: null,
                    SysOption10: null,
                  });
                  if (
                    !_.includes(
                      [null, "", undefined],
                      formValues.PaymentType
                    ) ||
                    !_.includes([null, "", undefined], formValues.PaymentType)
                  ) {
                    setFormsValues({
                      ...formValues,
                      PaymentType: val,
                      SysOption1: null,
                      SysOption2: null,
                      SysOption3: null,
                      SysOption4: null,
                      SysOption5: null,
                      SysOption6: null,
                      SysOption7: null,
                      SysOption8: null,
                      SysOption9: null,
                      SysOption10: null,
                    });
                  }
                }}
              >
                {PaymentType.length > 0 &&
                  PaymentType.map((xx, ii) => {
                    return (
                      <Option key={ii} value={xx.Value}>
                        {xx.Name}
                      </Option>
                    );
                  })}
              </Select>
            </Col>
          </Row>
          {(formValues.PaymentType === "UPI" ||
            formValues.PaymentType === "CARD") && (
            <>
              <Row style={{ marginBottom: 5 }}>
                <Col span={labelColSpan}>
                  <span style={{ color: "red" }}>* </span>Reference Bank :
                </Col>
                <Col span={TextColSpan}>
                  <Select
                    style={{ width: "190px" }}
                    value={formValues.PrimaryPayCode}
                    allowClear
                    showSearch
                    filterOption="children"
                    onChange={(val) => {
                      setFormsValues({
                        ...formValues,
                        PrimaryPayCode: val,
                      });
                      if (
                        !_.includes(
                          [null, "", undefined],
                          formValues.PrimaryPayCode
                        ) ||
                        !_.includes(
                          [null, "", undefined],
                          formValues.PrimaryPayCode
                        )
                      ) {
                        setFormsValues({
                          ...formValues,
                          PrimaryPayCode: val,
                        });
                      }
                    }}
                  >
                    {payModeData.length > 0 &&
                      payModeData.map((xx, ii) => {
                        return (
                          <Option key={ii} value={xx.PayCode}>
                            {xx.PayDesc}
                          </Option>
                        );
                      })}
                  </Select>
                </Col>
              </Row>
            </>
          )}

          {(formValues.PaymentType === "CASH" ||
            formValues.PaymentType === "BANK" ||
            formValues.PaymentType === "WALLET" ||
            formValues.PaymentType === "GATEWAY") && (
            <>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Opening Balance :
                </Col>
                <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                  <div style={{ display: "flex" }}>
                    <InputNumber
                      className="bill-input"
                      precision={2}
                      style={{ width: "25%" }}
                      placeholder={`Enter Opening Balance`}
                      value={formValues.OpeningBalance}
                      onChange={(e) => {
                        setFormsValues({
                          ...formValues,
                          // OpeningBalance: e.target.value,
                          OpeningBalance: e,
                        });
                      }}
                    />
                    <div style={{ paddingLeft: 42 }}>
                      <Row>
                        <Col
                          style={{
                            alignSelf: "center",
                            flex: 1,
                            textAlign: "center",
                          }}
                        >
                          As of Balance :
                        </Col>
                        <Col style={{ marginLeft: 67 }}>
                          <DatePicker
                            onChange={(date) => {
                              setFormsValues({
                                ...formValues,
                                AsOfBalance: date !== null ? date : null,
                              });
                            }}
                            value={formValues.AsOfBalance}
                            value={formValues.AsOfBalance}
                            format={l_ConfigDateFormat}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}
          {formValues.PaymentType === "GATEWAY" && (
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col span={labelColSpan}>Gateway Type :</Col>
              <Col span={TextColSpan}>
                <Select
                  placeholder="Select Gateway Type"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: "100%" }}
                  value={formValues.PaymentGatewayComp}
                  onChange={(val) => {
                    if (val) {
                      setFormsValues({
                        ...formValues,
                        PaymentGatewayComp: val,
                        IsPaymentGateway: "Y",
                      });
                    } else {
                      setFormsValues({
                        ...formValues,
                        PaymentGatewayComp: null,
                        IsPaymentGateway: "N",
                      });
                    }
                  }}
                >
                  {GatewayType.length > 0 &&
                    GatewayType.map((xx, ii) => {
                      return (
                        <Option key={ii} value={xx.Value}>
                          {xx.Name}
                        </Option>
                      );
                    })}
                </Select>
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption1 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption1} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption1}`}
                  value={formValues.SysOption1}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption1: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption2 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption2} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption2}`}
                  value={formValues.SysOption2}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption2: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption3 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption3} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption3}`}
                  value={formValues.SysOption3}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption3: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption4 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption4} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption4}`}
                  value={formValues.SysOption4}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption4: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption5 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption5} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption5}`}
                  value={formValues.SysOption5}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption5: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption6 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption6} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption6}`}
                  value={formValues.SysOption6}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption6: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption7 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption7} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption7}`}
                  value={formValues.SysOption7}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption7: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption8 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption8} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption8}`}
                  value={formValues.SysOption8}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption8: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption9 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption9} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption9}`}
                  value={formValues.SysOption9}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption9: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          {paymentFieldTitle.SysOption10 !== "" && (
            <Row style={{ marginBottom: 5 }}>
              <Col span={labelColSpan}>{paymentFieldTitle.SysOption10} :</Col>
              <Col span={TextColSpan}>
                <Input
                  placeholder={`Enter ${paymentFieldTitle.SysOption10}`}
                  value={formValues.SysOption10}
                  onChange={(e) => {
                    setFormsValues({
                      ...formValues,
                      SysOption10: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
          <Row style={{ margin: "0px 0px 5px 0px" }}>
            <Col span={labelColSpan}>Status : </Col>
            <Col span={TextColSpan}>
              <Radio.Group
                value={formValues.IsActive}
                onChange={(e) => {
                  setFormsValues({
                    ...formValues,
                    IsActive: e.target.value,
                  });
                }}
              >
                <Radio value={true}>Active</Radio>
                <Radio value={false}>InActive</Radio>
              </Radio.Group>
            </Col>
          </Row>
        </Card>
        <Card bodyStyle={{ padding: 5 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ marginRight: 5 }}
            onClick={async () => {
              if (
                _.includes([null, ""], formValues.PayCode) ||
                _.includes([null, ""], formValues.PayDesc) ||
                _.includes([null, ""], formValues.PaymentType) ||
                (formValues.PaymentType === "UPI" &&
                  _.includes([null, ""], formValues.PrimaryPayCode))
              ) {
                notification.error({
                  message: "Required Fields are Empty",
                  description: (
                    <span>
                      Input's with (<span style={{ color: "red" }}> * </span> )
                      cannot be empty
                    </span>
                  ),
                  duration: 1,
                });
              } else {
                onFinish();
                props.onBackPress();
              }
            }}
            // onFinish();
          >
            Save
          </Button>

          {!props.formData && (
            <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                setFormsValues(initialValues);
              }}
            >
              Reset
            </Button>
          )}

          <Button
            type="primary"
            icon={<Icon component={RollbackOutlined} />}
            style={{ marginRight: 5 }}
            onClick={() => {
              props.onBackPress();
            }}
          >
            Back
          </Button>

          <Button
            type="primary"
            icon={<Icon component={PrinterOutlined} />}
            style={{ marginRight: 5 }}
          >
            Print
          </Button>
        </Card>
      </Col>
    </>
  );
};

export default PaymentModeNewCard;
