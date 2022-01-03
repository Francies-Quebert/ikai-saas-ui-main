import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import { Select, Radio, Button, Card, Row, Col, Empty } from "antd";
import KotViewComponent from "./components/KotViewSubComponent/KotViewComponent";
import { getKOTData } from "../../../services/kot-view";
import AppLoader from "../../common/AppLoader";
import _ from "lodash";
import { RedoOutlined } from "@ant-design/icons";
import ViewDtlComponent from "./components/KotViewSubComponent/ViewDtlComponent";

const KOTView = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [kotStatus, setKotStatus] = useState("PND");
  const kotStatusColor = useSelector((state) => state.AppMain.kotMasterStatus);
  const appconfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [kotData, setKotData] = useState([]);

  useEffect(() => {
    dispatch(setFormCaption(81));
    fnSetDefault();
  }, []);

  const fnSetDefault = () => {
    setIsLoading(true);
    getKOTData(CompCode, appconfigs.value1).then((res) => {
      setKotData(res);
      setIsLoading(false);
    });
  };
  const [AutoRefresh, setAutoRefresh] = useState(true);
  const [IntervalId, setIntervalId] = useState();
  const R_DINEIN = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_DP_VIEW")
  );
  useEffect(() => {
    let tempIntervalId;
    let refreshSeconds = parseInt(R_DINEIN.value2) * 1000;
    if (AutoRefresh && !IntervalId) {
      tempIntervalId = setInterval(() => {
        // console.log("called");
        setIsLoading(true);
        getKOTData(CompCode, appconfigs.value1).then((res) => {
          setKotData(res);
          setIsLoading(false);
        });
      }, refreshSeconds);
      setIntervalId(tempIntervalId);
    } else {
      clearInterval(IntervalId);
      setIntervalId();
    }
  }, [AutoRefresh]);
  return (
    <>
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
                  fnSetDefault();
                }}
              >
                Refresh
              </Button>
            </div>
            <div style={{ flex: 1, textAlign: "end" }}>
              <Radio.Group
                onChange={(e) => {
                  setKotStatus(e.target.value);
                }}
                defaultValue={kotStatus}
              >
                <Radio.Button value="ALL">All</Radio.Button>
                <Radio.Button value="PND">Pending</Radio.Button>
                <Radio.Button value="RDY">Ready</Radio.Button>
                <Radio.Button value="CMP">Completed</Radio.Button>
                <Radio.Button value="CNL">Cancel</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {(kotStatus === "ALL" || kotStatus === "PND") && (
            <>
              <div
                className={`${
                  kotStatus !== "PND" ? "view-pos" : "manage-height"
                }`}
                style={{
                  display: "flex",
                  marginBottom: 10,
                  border: `6px solid ${
                    kotStatusColor.find((i) => i.ShortCode === "PND").SysOption2
                  }`,
                  borderLeftWidth: 0,
                  // height: `${kotStatus !== "PND" ? "40%" : ""}`,
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
                    // paddingBottom: 7,
                    margin: "5px 5px",
                  }}
                  gutter={[8, 8]}
                >
                  {kotData.filter(
                    (ii) => ii.KOT_Status === "PND" || ii.KOT_Status === "PPND"
                  ).length <= 0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {kotData &&
                    kotData
                      .filter(
                        (ii) =>
                          ii.KOT_Status === "PND" || ii.KOT_Status === "PPND"
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
                            // style={{ padding: "0px 0px 10px" }}
                          >
                            <ViewDtlComponent data={i} refresh={fnSetDefault} />
                          </Col>
                        );
                      })}
                </Row>
              </div>
            </>
          )}
          {(kotStatus === "ALL" || kotStatus === "RDY") && (
            <>
              <div
                className={`${
                  kotStatus !== "RDY" ? "view-pos" : "manage-height"
                }`}
                style={{
                  display: "flex",
                  marginBottom: 10,
                  border: `6px solid${
                    kotStatusColor.find((i) => i.ShortCode === "RDY").SysOption2
                  }`,
                  borderLeftWidth: 0,
                  // height: `${kotStatus !== "RDY" ? "40%" : ""}`,
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
                      kotStatusColor.find((i) => i.ShortCode === "RDY")
                        .SysOption1
                    }`,
                    background: `${
                      kotStatusColor.find((i) => i.ShortCode === "RDY")
                        .SysOption2
                    }`,
                    padding: 12,
                  }}
                >
                  <strong>R E A D Y</strong>
                </Card>
                <Row
                  className="style-2 kot-view-row"
                  style={{
                    flex: 1,
                    overflowX: `auto`,
                    flexWrap: `nowrap`,
                    // paddingBottom: 7,
                    margin: 0,
                  }}
                  gutter={[8, 8]}
                >
                  {kotData.filter((ii) => ii.KOT_Status === "RDY").length <=
                    0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {kotData &&
                    kotData
                      .filter((ii) => ii.KOT_Status === "RDY")
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
          {(kotStatus === "ALL" || kotStatus === "CMP") && (
            <>
              <div
                className={`${
                  kotStatus !== "CMP" ? "view-pos" : "manage-height"
                }`}
                style={{
                  display: "flex",
                  marginBottom: 10,
                  border: `6px solid ${
                    kotStatusColor.find((i) => i.ShortCode === "CMP").SysOption2
                  }`,
                  borderLeftWidth: 0,
                  // height: `${kotStatus !== "CMP" ? "40%" : ""}`,
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
                      kotStatusColor.find((i) => i.ShortCode === "CMP")
                        .SysOption1
                    }`,
                    background: `${
                      kotStatusColor.find((i) => i.ShortCode === "CMP")
                        .SysOption2
                    }`,
                    padding: 12,
                  }}
                >
                  <strong>C O M P L E T E D</strong>
                </Card>
                <Row
                  className="style-2 kot-view-row"
                  style={{
                    flex: 1,
                    overflowX: `auto`,
                    flexWrap: `nowrap`,
                    // paddingBottom: 7,
                    margin: "6px 0px 0px",
                  }}
                  gutter={[8, 8]}
                >
                  {kotData.filter((ii) => ii.KOT_Status === "CMP").length <=
                    0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {kotData &&
                    kotData
                      .filter((ii) => ii.KOT_Status === "CMP")
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
          {(kotStatus === "ALL" || kotStatus === "CNL") && (
            <>
              <div
                className={`${
                  kotStatus !== "CNL" ? "view-pos" : "manage-height"
                }`}
                style={{
                  display: "flex",
                  marginBottom: 10,
                  border: `6px solid ${
                    kotStatusColor.find((i) => i.ShortCode === "CNL").SysOption2
                  }`,
                  borderLeftWidth: 0,
                  // height: `${kotStatus !== "CNL" ? "40%" : ""}`,
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
                      kotStatusColor.find((i) => i.ShortCode === "CNL")
                        .SysOption1
                    }`,
                    background: `${
                      kotStatusColor.find((i) => i.ShortCode === "CNL")
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
                    // paddingBottom: 7,
                    margin: "6px 0px 0px",
                  }}
                  gutter={[8, 8]}
                >
                  {kotData.filter((ii) => ii.KOT_Status === "CNL").length <=
                    0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {kotData &&
                    kotData
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

          {/* {kotData.length > 0 &&
            kotGroup.map((ii) => {
              return (
                <KotViewComponent
                  group={ii.group}
                  data={ii.data}
                  color={kotStatusColor}
                  key={ii.group}
                />
              );
            })} */}
        </div>
      )}
    </>
  );
};

export default KOTView;
