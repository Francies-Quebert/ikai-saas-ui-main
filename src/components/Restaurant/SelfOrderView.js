import { RedoOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Radio, Row } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelfOrderKOTData } from "../../services/self-order";
import { setFormCaption } from "../../store/actions/currentTran";
import AppLoader from "../common/AppLoader";
import ViewDtlComponent from "../dashboard/Restaurant/components/KotViewSubComponent/ViewDtlComponent";
// import SelfOrderDtlComp from "./components/SelfOrderDtlComp";
import _ from "lodash";

const SelfOrderView = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selfOrderData, setSelfOrderData] = useState([]);
  const [selfOrderStatus, setSelfOrderStatus] = useState("PND");
  const kotStatusColor = useSelector((state) => state.AppMain.kotMasterStatus);
  const appconfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const fnSetDefault = () => {
    setIsLoading(true);
    fetchSelfOrderKOTData(CompCode, appconfigs.value1).then((res) => {
      setSelfOrderData(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    dispatch(setFormCaption(86));
    fnSetDefault();
  }, []);

  return (
    <div>
      {isLoading && <AppLoader />}
      {!isLoading && (
        <div style={{ height: "100%", width: "100%" }}>
          <div
            style={{ padding: "5px 7px", display: "flex", background: "#fff" }}
          >
            <div style={{ flex: 1 }}>
              <Button
                type="primary"
                icon={<RedoOutlined style={{ transform: "rotate(240deg)" }} />}
                onClick={() => {
                  setIsLoading(true);
                  fetchSelfOrderKOTData(CompCode, appconfigs.value1).then(
                    (res) => {
                      setSelfOrderData(res);
                      setIsLoading(false);
                    }
                  );
                }}
              >
                Refresh
              </Button>
            </div>
            <div style={{ flex: 1, textAlign: "end" }}>
              <Radio.Group
                onChange={(e) => {
                  setSelfOrderStatus(e.target.value);
                }}
                defaultValue={selfOrderStatus}
              >
                <Radio.Button value="ALL">All</Radio.Button>
                <Radio.Button value="PND">Pending</Radio.Button>
                <Radio.Button value="ACPT">Accepted</Radio.Button>
                <Radio.Button value="RJCT">Cancelled</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          {(selfOrderStatus === "ALL" || selfOrderStatus === "PND") && (
            <>
              <div
                className={`${
                  selfOrderStatus !== "PND" ? "view-pos" : "manage-height"
                }`}
                style={{
                  display: "flex",
                  marginBottom: 10,
                  border: `6px solid ${
                    kotStatusColor.find((i) => i.ShortCode === "PND").SysOption2
                  }`,
                  borderLeftWidth: 0,
                }}
              >
                <Card
                  style={{ flex: "0 1 15px", marginRight: 7, borderWidth: 0 }}
                  bodyStyle={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    fontFamily: `Cairo, sans-serif`,
                    color: `${
                      kotStatusColor.find((i) => i.ShortCode === "PND")
                        .SysOption1
                    }`,
                    background: `${
                      kotStatusColor.find((i) => i.ShortCode === "PND")
                        .SysOption2
                    }`,
                    padding: 12,
                  }}
                >
                  <strong>P E N D I N G</strong>
                </Card>
                <Row
                  className="style-2 kot-view-row"
                  style={{
                    flex: 1,
                    overflowX: `auto`,
                    flexWrap: `nowrap`,
                    margin: "5px 5px",
                  }}
                  gutter={[8, 8]}
                >
                  {selfOrderData.filter((ii) => ii.KOT_Status === "SLFORD")
                    .length <= 0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {selfOrderData &&
                    selfOrderData
                      .filter((ii) => ii.KOT_Status === "SLFORD")
                      .map((i) => {
                        return (
                          <Col
                            xs={24}
                            sm={12}
                            md={8}
                            lg={8}
                            xl={6}
                            key={i.KOTId}
                          >
                            <ViewDtlComponent data={i} refresh={fnSetDefault} />
                          </Col>
                        );
                      })}
                </Row>
              </div>
            </>
          )}
          {(selfOrderStatus === "ALL" || selfOrderStatus === "ACPT") && (
            <>
              <div
                className={`${
                  selfOrderStatus !== "ACPT" ? "view-pos" : "manage-height"
                }`}
                style={{
                  display: "flex",
                  marginBottom: 10,
                  border: `6px solid ${
                    kotStatusColor.find((i) => i.ShortCode === "ACPT")
                      .SysOption2
                  }`,
                  borderLeftWidth: 0,
                }}
              >
                <Card
                  style={{ flex: "0 1 15px", marginRight: 7, borderWidth: 0 }}
                  bodyStyle={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    fontFamily: `Cairo, sans-serif`,
                    color: `${
                      kotStatusColor.find((i) => i.ShortCode === "ACPT")
                        .SysOption1
                    }`,
                    background: `${
                      kotStatusColor.find((i) => i.ShortCode === "ACPT")
                        .SysOption2
                    }`,
                    padding: 12,
                  }}
                >
                  <strong>A C C E P T E D</strong>
                </Card>
                <Row
                  className="style-2 kot-view-row"
                  style={{
                    flex: 1,
                    overflowX: `auto`,
                    flexWrap: `nowrap`,
                    margin: "5px 5px",
                  }}
                  gutter={[8, 8]}
                >
                  {selfOrderData.filter((ii) =>
                    _.includes(["RDY", "PND", "CMP", "PPND"], ii.KOT_Status)
                  ).length <= 0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {selfOrderData &&
                    selfOrderData
                      .filter((ii) =>
                        _.includes(["RDY", "PND", "CMP", "PPND"], ii.KOT_Status)
                      )
                      .map((i) => {
                        return (
                          <Col
                            xs={24}
                            sm={12}
                            md={8}
                            lg={8}
                            xl={6}
                            key={i.KOTId}
                          >
                            <ViewDtlComponent data={i} refresh={fnSetDefault} />
                          </Col>
                        );
                      })}
                </Row>
              </div>
            </>
          )}
          {(selfOrderStatus === "ALL" || selfOrderStatus === "RJCT") && (
            <>
              <div
                className={`${
                  selfOrderStatus !== "RJCT" ? "view-pos" : "manage-height"
                }`}
                style={{
                  display: "flex",
                  marginBottom: 10,
                  border: `6px solid ${
                    kotStatusColor.find((i) => i.ShortCode === "RJCT")
                      .SysOption2
                  }`,
                  borderLeftWidth: 0,
                }}
              >
                <Card
                  style={{ flex: "0 1 15px", marginRight: 7, borderWidth: 0 }}
                  bodyStyle={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    fontFamily: `Cairo, sans-serif`,
                    color: `${
                      kotStatusColor.find((i) => i.ShortCode === "RJCT")
                        .SysOption1
                    }`,
                    background: `${
                      kotStatusColor.find((i) => i.ShortCode === "RJCT")
                        .SysOption2
                    }`,
                    padding: 12,
                  }}
                >
                  <strong>C A N C E L L E D</strong>
                </Card>
                <Row
                  className="style-2 kot-view-row"
                  style={{
                    flex: 1,
                    overflowX: `auto`,
                    flexWrap: `nowrap`,
                    margin: "5px 5px",
                  }}
                  gutter={[8, 8]}
                >
                  {selfOrderData.filter((ii) => ii.KOT_Status === "CNL")
                    .length <= 0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {selfOrderData &&
                    selfOrderData
                      .filter((ii) => ii.KOT_Status === "CNL")
                      .map((i) => {
                        return (
                          <Col
                            xs={24}
                            sm={12}
                            md={8}
                            lg={8}
                            xl={6}
                            key={i.KOTId}
                          >
                            <ViewDtlComponent data={i} refresh={fnSetDefault} />
                          </Col>
                        );
                      })}
                </Row>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SelfOrderView;
