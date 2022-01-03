import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Card, Button, Select } from "antd";
import { fetchPaymodeMaster } from "../../../services/payModeMaster";
import PayMentModeCard from "./PaymentMode/NewPaymentMode/PaymentModeNewCard";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";
import { setFormCaption } from "../../../store/actions/currentTran";
import IMG_BANK from "../../../icons/bank.png";
import IMG_CARD from "../../../icons/card.png";
import IMG_CASH from "../../../icons/cash.png";
import IMG_CHEQUE from "../../../icons/cheque.png";
import IMG_GATEWAY from "../../../icons/gateway.png";
import IMG_WALLET from "../../../icons/wallet.png";
import IMG_SWIPE from "../../../icons/swipe.png";
import Icon, {
  SearchOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { InsUpdtSystemSequenceConfigMaster } from "../../../store/actions/sys-sequence-config";
const { Option } = Select;

const PaymentModeNewPage = (props) => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const currTran = useSelector((state) => state.currentTran);
  const [payCode, setPayCode] = useState();
  const [paymentData, setPaymentData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const lConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((ac) => ac.configCode === "CURRENCY")
  );
  useEffect(() => {
    dispatch(setFormCaption(59));
    fetchPaymodeMaster(CompCode).then((res) => {
      setPaymentData(res);
      setSearchedData(res);
    });
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  return (
    <Fragment>
      {editedData && (
        <PayMentModeCard
          onBackPress={() => {
            setEditedData();
            fetchPaymodeMaster(CompCode).then((res) => {
              setPaymentData(res);
              setSearchedData(res);
            });
          }}
          formData={editedData.formData}
          showUserCredentials={true}
        />
      )}
      {!editedData && paymentData && (
        <Row style={{ display: "block" }}>
          <Col style={{ marginBottom: 5 }}>
            <Card bodyStyle={{ padding: 5 }}>
              <Row>
                <Col>
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    disabled={hasRight(currTran.moduleRights, "ADD")}
                    onClick={() => {
                      setEditedData({ entryMode: "A" });
                    }}
                  >
                    Add New Payment Mode
                  </Button>
                </Col>
                {/* <Col>
                  <Row style={{ marginLeft: 10 }}>
                    <div
                      style={{
                        padding: "0px 8px 0px 0px",
                        color: "#000",
                        alignSelf: "center",
                      }}
                    >
                      Select Payment Mode Type :
                    </div>
                    <Select
                      size="medium"
                      allowClear
                      showSearch
                      showArrow
                      optionFilterProp="children"
                      placeholder="Select Supplier"
                      style={{ width: 200, marginRight: 5 }}
                      onChange={(val) => {
                        setPayCode(val);
                      }}
                    >
                      {paymentData.length > 0 &&
                        paymentData.map((cc) => {
                          return (
                            <Option value={cc.PayCode} key={cc.PayCode}>
                              {cc.PayDesc}
                            </Option>
                          );
                        })}
                      <Option value={"ALL"} key={"ALL"}>
                        All
                      </Option>
                    </Select>
                    <Button
                      type="primary"
                      size="medium"
                      disabled={!payCode}
                      icon={<SearchOutlined />}
                      onClick={() => {
                        fetchPaymodeMaster().then((res) => {
                          if (payCode !== "ALL" || payCode !== payCode) {
                            setSearchedData(
                              res.filter((xx) => xx.PayCode === payCode)
                            );
                          } else {
                            setSearchedData(res);
                          }
                        });
                        // payCode !== "ALL"
                        //   ? setSearchedData(
                        //       paymentData.filter((xx) => xx.PayCode === payCode)
                        //     )
                        //   : setSearchedData(paymentData);
                      }}
                    >
                      Search
                    </Button>
                  </Row>
                </Col> */}
              </Row>
            </Card>
          </Col>

          <Col>
            <Row>
              {searchedData &&
                searchedData.map((xx, ii) => {
                  return (
                    <Card
                      key={ii}
                      style={{
                        width: 285,
                        borderRadius: "15px",
                        // height: 250,
                        position: "relative",
                        margin: 5,
                      }}
                      bodyStyle={{ padding: 5 }}
                    >
                      <Row
                        style={{ margin: 0, borderBottom: "1px solid #000" }}
                      >
                        <Col>
                          <img
                            style={{ height: 50 }}
                            alt="example"
                            src={
                              xx.PaymentType === "CASH"
                                ? IMG_CASH
                                : xx.PaymentType === "BANK"
                                ? IMG_BANK
                                : xx.PaymentType === "WALLET"
                                ? IMG_WALLET
                                : xx.PaymentType === "UPI"
                                ? IMG_SWIPE
                                : xx.PaymentType === "CHEQUE"
                                ? IMG_CHEQUE
                                : xx.PaymentType === "GATEWAY"
                                ? IMG_GATEWAY
                                : xx.PaymentType === "CARD"
                                ? IMG_CARD
                                : null
                            }
                          />
                        </Col>
                        <Col style={{ padding: 10 }}>
                          <h4>{xx.PayDesc}</h4>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          visibility: xx.OpeningBalance ? "visible" : "hidden",
                          padding: 5,
                        }}
                      >
                        <Col>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              marginBottom: 0,
                            }}
                          >
                            Opening Balance : {lConfigCurrency.value1}
                            {parseFloat(xx.OpeningBalance).toFixed(2)}
                          </p>
                        </Col>
                      </Row>
                      <Row style={{ color: "var(--app-theme-color)" }}>
                        <Button
                          shape="circle"
                          type="link"
                          disabled={hasRight(currTran.moduleRights, "EDIT")}
                          icon={<Icon component={EditOutlined} />}
                          style={{
                            position: "absolute",
                            right: 15,
                            bottom: 10,
                          }}
                          onClick={() => {
                            setEditedData({ entryMode: "E", formData: xx });
                          }}
                        ></Button>
                      </Row>
                    </Card>
                  );
                })}
            </Row>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

export default PaymentModeNewPage;
