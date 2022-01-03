import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Input, InputNumber, Row } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import PartyOutstandingDtlComp from "./PartyOutstandingDtlComp";

const PartyOutstaningComp = (props) => {
  const [isShow, setIsShow] = useState();
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );

  useEffect(() => {
    // console.log(parseFloat(props.data.Debit).toFixed(2));
    setIsShow();
  }, [props.data]);

  return (
    <>
      <Row
        style={{
          border: "1px solid var(--app-theme-color)",
          borderRadius: 3,
          marginBottom: 5,
        }}
      >
        <Col
          style={{
            width: "100%",
            padding: "5px 10px",
          }}
        >
          <div style={{ height: "calc(100% - 40px)", marginBottom: 5 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "var(--app-theme-color)",
              }}
            >
              {props.data.PartyName} ({props.data.AddInfo1})
            </div>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--app-theme-color)",
                alignItems: "center",
                marginRight: 5,
                width: "25%",
              }}
            >
              <div style={{ marginRight: 5 }}>Debit :</div>
              <div
                style={{
                  display: "inline-block",
                  width: "50%",
                  textAlign: "end",
                  fontWeight: "600",
                  border: "1px solid var(--app-theme-color)",
                  borderRadius: 4,
                  backgroundColor: "#f1f1f1",
                  fontSize: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {currency.value1}
                </div>
                <div
                  style={{
                    width: "calc(100% - 40px)",
                    display: "inline-block",
                  }}
                >
                  <Input
                    type="number"
                    style={{
                      width: "100%",
                      fontSize: 14,
                      color: "var(--app-theme-color)",
                      textAlign: "end",
                      left: 0,
                    }}
                    min={0}
                    step={0.0}
                    value={parseFloat(props.data.Debit).toFixed(2)}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--app-theme-color)",
                alignItems: "center",
                marginRight: 5,
                width: "25%",
              }}
            >
              <div style={{ marginRight: 5 }}>Credit :</div>
              <div
                style={{
                  display: "inline-block",
                  width: "50%",
                  textAlign: "end",
                  fontWeight: "600",
                  border: "1px solid var(--app-theme-color)",
                  borderRadius: 4,
                  backgroundColor: "#f1f1f1",
                  fontSize: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {currency.value1}
                </div>
                <div
                  style={{
                    width: "calc(100% - 40px)",
                    display: "inline-block",
                  }}
                >
                  <Input
                    type="number"
                    style={{
                      width: "100%",
                      fontSize: 14,
                      color: "var(--app-theme-color)",
                      textAlign: "end",
                      left: 0,
                    }}
                    min={0}
                    step={0.0}
                    value={parseFloat(props.data.Credit).toFixed(2)}
                    // className="bill-input"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--app-theme-color)",
                alignItems: "center",
                marginRight: 5,
                width: "25%",
              }}
            >
              <div style={{ marginRight: 5 }}>Outstanding :</div>
              <div
                style={{
                  display: "inline-block",
                  width: "50%",
                  textAlign: "end",
                  fontWeight: "600",
                  border: "1px solid var(--app-theme-color)",
                  borderRadius: 4,
                  backgroundColor: "#f1f1f1",
                  fontSize: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {currency.value1}
                </div>
                <div
                  style={{
                    width: "calc(100% - 40px)",
                    display: "inline-block",
                  }}
                >
                  <Input
                    type="number"
                    style={{
                      width: "100%",
                      fontSize: 14,
                      color: "var(--app-theme-color)",
                      textAlign: "end",
                      left: 0,
                    }}
                    min={0}
                    step={0.0}
                    value={parseFloat(props.data.Outstanding).toFixed(2)}
                    // className="bill-input"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>
        {isShow && (
          <Col lg={24} sm={24}>
            <PartyOutstandingDtlComp
              partyId={props.data.PartyId}
              FromDate={props.FromDate}
              ToDate={props.ToDate}
            />
          </Col>
        )}

        <div
          style={{
            flex: 1,
            fontWeight: 600,
            borderTop: "1px solid var(--app-theme-color)",
            textAlign: "center",
            color: "var(--app-theme-color)",
            // cursor: "pointer",
          }}
          // onClick={() => {}}
        >
          {isShow ? (
            <span>
              <Button
                type="link"
                style={{ color: "var(--app-theme-color)" }}
                icon={<MinusCircleOutlined />}
                onClick={() => {
                  setIsShow(!isShow);
                }}
              >
                Collapse
              </Button>
            </span>
          ) : (
            <span>
              &nbsp;
              <Button
                type="link"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setIsShow(!isShow);
                }}
                style={{ color: "var(--app-theme-color)" }}
              >
                Expand to view this
              </Button>
            </span>
          )}
        </div>
      </Row>
    </>
  );
};

export default PartyOutstaningComp;
