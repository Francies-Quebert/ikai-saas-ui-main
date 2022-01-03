import { Row, Col, Button } from "antd";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import {
  razorPayReqGenerate,
  getDataOnlinePaymentRequest,
  getPaymentGatewayOptionsAndConfig,
  updtOnlinePaymentRequestResponse,
  serviceBookingPaymentSuccess,
} from "../../services/online-payment";
import AppLoader from "../common/AppLoader";
import { CheckCircleFilled, DownloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const PaymentGateway = () => {
  // should get prameter in this forma t from Url
  // ?query.get("payment-request-id")=3504
  const [isRerender, setIsRerender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentModes, setPaymentModes] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [paymentStatus, setPaymentStatus] = useState({
    PaymentRequestId: 0,
    PaymentRequestData: null,
    PaymentMode: "",
    PaymentResposeValue1: "",
    PaymentResposeValue2: "",
    PaymentResposeValue3: "",
    PaymentResposeValue4: "",
    PaymentResposeValue5: "",
    IsPaymentSuccess: false,
    ErrorText: "",
  });
  const currency = useSelector((state) =>
  state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
);
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  useEffect(async () => {
    setIsLoading(true);
    let PaymentRequestId = query.get("payment-request-id");
    await getPaymentGatewayOptionsAndConfig(CompCode).then((res) => {
      setPaymentModes(res);
      // console.log(res);
    });
    getDataOnlinePaymentRequest(CompCode, PaymentRequestId)
      .then((res) => {
        if (res.length > 0) {
          // console.log("getDataOnlinePaymentRequest", res[0]);
          if (res[0].RequestStatus === "CMP") {
            setPaymentStatus({
              ...paymentStatus,
              IsPaymentSuccess: true,
              PaymentRequestId: PaymentRequestId,
              PaymentRequestData: res[0],
            });
          } else {
            setPaymentStatus({
              ...paymentStatus,
              PaymentRequestId: PaymentRequestId,
              PaymentRequestData: res[0],
            });
          }
        } else {
          setPaymentStatus({
            ...paymentStatus,
            PaymentRequestId: PaymentRequestId,
            ErrorText: "No data found",
          });
        }
        setIsRerender(!isRerender);
        setIsLoading(false);
      })
      .catch((err) => {
        // console.error("getDataOnlinePaymentRequest", err);
      });
  }, []);

  useEffect(() => {
    // console.log("something cvhanges", paymentStatus);
    if (
      paymentStatus.PaymentMode === "RAZORPAY" &&
      paymentStatus.PaymentResposeValue1 !== "" &&
      paymentStatus.PaymentResposeValue2 !== "" &&
      paymentStatus.PaymentResposeValue3 !== "" &&
      paymentStatus.PaymentResposeValue4 !== ""
    ) {
      updtOnlinePaymentRequestResponse(
        CompCode,
        paymentStatus.PaymentRequestId,
        paymentStatus.PaymentMode,
        paymentStatus.PaymentResposeValue1,
        paymentStatus.PaymentResposeValue2,
        paymentStatus.PaymentResposeValue3,
        paymentStatus.PaymentResposeValue4,
        "CMP",
        "online"
      ).then((res) => {
        if (res.length > 0 && res[0].RequestStatus === "CMP") {
          setPaymentStatus({
            ...paymentStatus,
            PaymentMode: "",
            PaymentResposeValue1: "",
            PaymentResposeValue2: "",
            PaymentResposeValue3: "",
            PaymentResposeValue4: "",
            PaymentResposeValue5: "",
            IsPaymentSuccess: true,
            PaymentRequestData: res[0],
          });

          serviceBookingPaymentSuccess(
            CompCode,
            paymentStatus.PaymentRequestData.SysOption1,
            paymentStatus.PaymentRequestId,
            "online"
          ).then((res) => {
            setIsRerender(!isRerender);
          });
        }
      });
    }
  }, [paymentStatus]);

  const onPaymentOptionSelect = async (objPaymentModeConfig) => {
    // console.log(type, orderId);
    if (objPaymentModeConfig.PaymentGatewayComp === "RAZORPAY") {
      await razorPayReqGenerate(
        CompCode,
        objPaymentModeConfig.PayCode,
        parseFloat(paymentStatus.PaymentRequestData.PaymentAmount),
        paymentStatus.PaymentRequestId
      ).then((res) => {
        let responseId = res.id;
        setPaymentStatus({
          ...paymentStatus,
          PaymentMode: objPaymentModeConfig.PaymentGatewayComp,
          PaymentResposeValue1: responseId,
          PaymentResposeValue2: "",
          PaymentResposeValue3: "",
        });
        setIsRerender(!isRerender);
        // console.log(res, res.id, "razerpay response", paymentStatus);

        var options = {
          key: objPaymentModeConfig.SysOption2,
          amount:
            parseFloat(paymentStatus.PaymentRequestData.PaymentAmount) * 100 +
            "",
          currency: "INR",
          name: objPaymentModeConfig.SysOption4,
          description: `${paymentStatus.PaymentRequestData.PaymentTitle}
${paymentStatus.PaymentRequestData.PaymentDesc}`,
          order_id: responseId,
          handler: function (response) {
            // console.log("razor pay handler");
            setPaymentStatus({
              ...paymentStatus,
              PaymentMode: objPaymentModeConfig.PaymentGatewayComp,
              PaymentResposeValue1: responseId,
              PaymentResposeValue2: response.razorpay_payment_id,
              PaymentResposeValue3: response.razorpay_signature,
              PaymentResposeValue4: objPaymentModeConfig.PayCode,
            });
          },
          prefill: {
            name: paymentStatus.PaymentRequestData.PreFillInfo1,
            email: paymentStatus.PaymentRequestData.PreFillInfo2,
            contact: paymentStatus.PaymentRequestData.PreFillInfo3,
          },
          notes: {
            address: "NA",
          },
          theme: {
            color: process.env.REACT_APP_PRIMARY_COLOR,
          },
        };
        // console.log(options, "options");
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      });
    }
  };

  let renderItem = null;
  if (paymentStatus.IsPaymentSuccess) {
    renderItem = (
      <div className="success-page">
        <CheckCircleFilled style={{ fontSize: 50, color: "lightgreen" }} />
        <h2>Payment Successful !</h2>
        <p>We are delighted to inform you that we received your payments</p>
        <Button type="primary" icon={<DownloadOutlined />} size={"small"}>
          Download Payment Receipt
        </Button>
        <br />
        <br />
        Kindly navigate back to check order status
      </div>
    );
  } else {
    renderItem = (
      <div className="payment-screen">
        {isLoading === true && <AppLoader />}
        {isLoading === false && paymentStatus.PaymentRequestData && (
          <>
            <div className="header-payment">Proceed for Payment</div>
            <Row style={{}}>
              <Col span={24}>
                <div className="payment-product-info">
                  <div style={{ color: "#000", fontSize: 16, fontWeight: 600 }}>
                    {paymentStatus.PaymentRequestData.PreFillInfo1}{" "}
                    <span style={{ fontSize: 12 }}>
                      ({paymentStatus.PaymentRequestData.PreFillInfo3})
                    </span>
                  </div>

                  <div style={{ fontSize: 12 }}>
                    <span style={{}}>
                      {paymentStatus.PaymentRequestData.PreFillInfo2}
                    </span>
                  </div>
                </div>
                {/* </Col>
    <Col xs={24} sm={24} md={24} xl={12} lg={12}> */}
                <div className="payment-product-info">
                  <div style={{ color: "#000", fontSize: 16, fontWeight: 600 }}>
                    {paymentStatus.PaymentRequestData.PaymentTitle}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    {paymentStatus.PaymentRequestData.PaymentDesc}
                  </div>
                  <div style={{ fontSize: 20, color: "#000" }}>
                    {" "}
                    {currency.value1}{" "}
                    {parseFloat(
                      paymentStatus.PaymentRequestData.PaymentAmount
                    ).toFixed(2)}
                  </div>
                </div>
              </Col>
              <Col span={24}>
                {paymentStatus.PaymentMode === "" && (
                  <div className="payment-product-info payment-mode">
                    {paymentModes.map((ii) => (
                      <Button
                        key={ii.PayCode}
                        style={{ height: 50 }}
                        onClick={() => {
                          onPaymentOptionSelect(ii);
                        }}
                        className="payment-button"
                        type="primary"
                      >
                        Pay by {ii.PayDesc}
                      </Button>
                    ))}
                  </div>
                )}
                {paymentStatus.PaymentMode !== "" && (
                  <div className="payment-product-info payment-mode">
                    {" "}
                    <Button
                      style={{ height: 50 }}
                      onClick={() => {
                        setPaymentStatus({
                          ...paymentStatus,
                          PaymentMode: "",
                          PaymentResposeValue1: "",
                          PaymentResposeValue2: "",
                          PaymentResposeValue3: "",
                          PaymentResposeValue4: "",
                          PaymentResposeValue5: "",
                          ErrorText: "",
                        });
                      }}
                      className="payment-button"
                      type="dashed"
                    >
                      Reset
                    </Button>
                  </div>
                )}
                {paymentStatus.PaymentMode !== "" && <AppLoader />}
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="payment-modes-screen"
      style={{
        backgroundColor: "#f1f1f1",
        height: "100vh",
        textAlign: "center",
      }}
    >
      {renderItem}
    </div>
  );
};

export default PaymentGateway;
