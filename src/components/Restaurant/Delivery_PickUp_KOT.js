import React, { useEffect, useState } from "react";
import { Card, Divider, Row, Col, Button, Radio, Checkbox, Empty } from "antd";
import {
  FormOutlined,
  RetweetOutlined,
  RedoOutlined,
  EnvironmentFilled,
} from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../store/actions/currentTran";
import RestaurantPOSTran from "../dashboard/Restaurant/components/RestaurantPOSTran";
import KOTCardDtl from "./components/KOTCardDtl";
import {
  fetchPOSRestaurantMenuRates,
  fetchPOSRestaurantUserFavoriteMenus,
  fetchPOSRestaurantMenuAddOnDtl,
  fetchPOSRestaurantMenuAddOns,
  fetchPOSRestaurantMenuVariationRates,
  getDataRestaurantPOSDeliveryPickupView,
} from "../../services/restaurant-pos";
import icon_delivery from "../../assets/images/icon/delivery.png";
import icon_DineIn from "../../assets/images/icon/DineIn.png";
import icon_home from "../../assets/images/icon/home.png";
import icon_merchant from "../../assets/images/icon/merchant.png";
import icon_Online from "../../assets/images/icon/Online.png";
import icon_pickup from "../../assets/images/icon/pickup.png";
import icon_DineInSvg from "../../assets/images/icon/delivery.svg";
import OrderDetailsComponent from "./components/OrderDetailsComponent";
import BillsDetailsComponent from "./components/BillsDetailsComponent";

const Delivery_PickUp_KOT = () => {
  const dispatch = useDispatch();
  const [entryMode, setEntryMode] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [menuRates, setMenuRates] = useState();
  const [menuVariationRates, setMenuVariationRates] = useState();
  const [favMenus, setFavMenus] = useState();
  const [menuAddOnDtl, setMenuAddOnDtl] = useState();
  const [menuAddOn, setMenuAddOn] = useState();
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const [selectedType, setSelectedType] = useState("ALL");
  const [KOTdtl, setKOTdtl] = useState([]);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const [AutoRefresh, setAutoRefresh] = useState(true);
  const [IntervalId, setIntervalId] = useState();
  const R_DINEIN = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_DP_VIEW")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    let tempIntervalId;
    let refreshSeconds = parseInt(R_DINEIN.value2) * 1000;
    if (AutoRefresh && !IntervalId) {
      tempIntervalId = setInterval(() => {
        setIsLoading(true);
        Promise.all([
          fetchPOSRestaurantMenuRates(CompCode).then((res) => {
            // console.log("menuRates list", res);
            setMenuRates(res);
          }),
          fetchPOSRestaurantUserFavoriteMenus(
            CompCode,
            loginInfo.userType,
            loginInfo.userId
          ).then((res) => {
            // console.log("favMenus list", res);
            setFavMenus(res);
          }),
          fetchPOSRestaurantMenuAddOnDtl(CompCode).then((res) => {
            // console.log("menuAddOnDtl list", tempData);
            setMenuAddOnDtl(res);
          }),
          fetchPOSRestaurantMenuAddOns(CompCode).then((res) => {
            //  console.log("menuAddOn list", res);

            setMenuAddOn(res);
          }),
          fetchPOSRestaurantMenuVariationRates(CompCode).then((res) => {
            //console.log("menuVariationRates list", res);
            setMenuVariationRates(res);
          }),
          getDataRestaurantPOSDeliveryPickupView(
            CompCode,
            BranchConfigs.value1
          ).then((res) => {
            setKOTdtl(res);
          }),
        ])
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err, "initial Load Error");
            setIsLoading(false);
          });
      }, refreshSeconds);
      setIntervalId(tempIntervalId);
    } else {
      clearInterval(IntervalId);
      setIntervalId();
    }

    return () => {
      clearInterval(IntervalId);
      setIntervalId();
    };
  }, [AutoRefresh]);

  useEffect(() => {
    dispatch(setFormCaption(80));
    setIsLoading(true);
    Promise.all([
      fetchPOSRestaurantMenuRates(CompCode).then((res) => {
        // console.log("menuRates list", res);
        setMenuRates(res);
      }),
      fetchPOSRestaurantUserFavoriteMenus(
        CompCode,
        loginInfo.userType,
        loginInfo.userId
      ).then((res) => {
        // console.log("favMenus list", res);
        setFavMenus(res);
      }),
      fetchPOSRestaurantMenuAddOnDtl(CompCode).then((res) => {
        // console.log("menuAddOnDtl list", tempData);
        setMenuAddOnDtl(res);
      }),
      fetchPOSRestaurantMenuAddOns(CompCode).then((res) => {
        //  console.log("menuAddOn list", res);

        setMenuAddOn(res);
      }),
      fetchPOSRestaurantMenuVariationRates(CompCode).then((res) => {
        //console.log("menuVariationRates list", res);
        setMenuVariationRates(res);
      }),
      getDataRestaurantPOSDeliveryPickupView(
        CompCode,
        BranchConfigs.value1
      ).then((res) => {
        setKOTdtl(res);
      }),
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchInitialData = () => {
    setIsLoading(true);
    Promise.all([
      fetchPOSRestaurantMenuRates(CompCode).then((res) => {
        // console.log("menuRates list", res);
        setMenuRates(res);
      }),
      fetchPOSRestaurantUserFavoriteMenus(
        CompCode,
        loginInfo.userType,
        loginInfo.userId
      ).then((res) => {
        // console.log("favMenus list", res);
        setFavMenus(res);
      }),
      fetchPOSRestaurantMenuAddOnDtl(CompCode).then((res) => {
        // console.log("menuAddOnDtl list", tempData);
        setMenuAddOnDtl(res);
      }),
      fetchPOSRestaurantMenuAddOns(CompCode).then((res) => {
        //  console.log("menuAddOn list", res);

        setMenuAddOn(res);
      }),
      fetchPOSRestaurantMenuVariationRates(CompCode).then((res) => {
        //console.log("menuVariationRates list", res);
        setMenuVariationRates(res);
      }),
      getDataRestaurantPOSDeliveryPickupView(
        CompCode,
        BranchConfigs.value1
      ).then((res) => {
        setKOTdtl(res);
      }),
    ]).then(() => {
      setIsLoading(false);
    });
  };
  // useEffect(() => {
  //   console.log("called", autoRefresh);
  //   let interval = 0;
  //   if (autoRefresh) {
  //     interval = setInterval(() => {
  //       fetchInitialData();
  //     }, 3000)
  //   } else {
  //     return () => clearInterval(interval);
  //   }
  // }, [autoRefresh]);
  return (
    <>
      {!isLoading && !entryMode && (
        <div style={{ height: "100%", width: "100%" }}>
          <div
            style={{ padding: "5px 7px", background: "#fff", display: "flex" }}
          >
            <div style={{ display: "inline-block" }}>
              <Button
                type=""
                style={{ marginRight: 6, padding: "4px 7px" }}
                icon={
                  <img
                    src={icon_pickup}
                    width="18px"
                    style={{ paddingBottom: 3, display: "inline-block" }}
                  />
                }
                onClick={() => {
                  setEntryMode({
                    EntryType: "PICKUP",
                  });
                  setAutoRefresh(false);
                }}
              >
                <span style={{ marginLeft: 5, display: "inline-block" }}>
                  Pick Up Order
                </span>
              </Button>
              <Button
                type=""
                style={{ marginRight: 6, padding: "4px 7px" }}
                icon={
                  <img
                    src={icon_delivery}
                    width="18px"
                    style={{ paddingBottom: 3, display: "inline-block" }}
                  />
                }
                onClick={() => {
                  setEntryMode({
                    EntryType: "DELIVERY",
                  });
                  setAutoRefresh(false);
                }}
              >
                <span style={{ marginLeft: 5, display: "inline-block" }}>
                  Delivery Order
                </span>
              </Button>
            </div>
            <div style={{ flex: "1 1 0%" }}></div>
            <div
              style={{
                display: "inline-block",
                textAlign: "end",
              }}
            >
              <div
                style={{
                  textAlign: "end",
                }}
              >
                <Button
                  icon={
                    <RetweetOutlined
                      style={{ color: process.env.REACT_APP_PRIMARY_COLOR }}
                    />
                  }
                  // type="primary"
                  style={{
                    marginRight: 5,
                    display: "inline-block",
                    padding: "4px 7px",
                  }}
                  onClick={fetchInitialData}
                >
                  Refresh
                </Button>
                {/* <Checkbox
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              >
                Refreshing Every 30 Seconds
              </Checkbox> */}
                <Radio.Group
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                  }}
                  value={selectedType}
                  style={{ display: "inline-block" }}
                >
                  <Radio.Button value="ALL">
                    <img
                      width="16px"
                      style={{
                        marginRight: 4,
                        paddingBottom: 4,
                        display: "inline-block",
                      }}
                      src={icon_DineIn}
                    />
                    All
                  </Radio.Button>
                  <Radio.Button value="DELIVERY">
                    <img
                      width="16px"
                      style={{
                        marginRight: 4,
                        paddingBottom: 4,
                        display: "inline-block",
                      }}
                      src={icon_delivery}
                    />
                    Home Delivery
                  </Radio.Button>
                  <Radio.Button value="PICKUP">
                    <img
                      width="16px"
                      style={{
                        marginRight: 4,
                        paddingBottom: 4,
                        display: "inline-block",
                      }}
                      src={icon_pickup}
                    />
                    Pick Up
                  </Radio.Button>
                  <Radio.Button value="ONLINE">
                    <img
                      width="16px"
                      style={{
                        marginRight: 4,
                        paddingBottom: 4,
                        display: "inline-block",
                      }}
                      src={icon_Online}
                    />
                    Online Orders
                  </Radio.Button>
                  <Radio.Button value="MERCHANT">
                    <img
                      width="16px"
                      style={{
                        marginRight: 4,
                        paddingBottom: 4,
                        display: "inline-block",
                      }}
                      src={icon_merchant}
                    />
                    Merchant Orders
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
          </div>
          <Row style={{ height: "calc(100vh - 100px)", width: "100%" }}>
            <Col
              span={17}
              style={{
                backgroundColor: "#FFF",
                padding: 5,
              }}
            >
              <div
                className="ready-pos"
                style={{
                  display: "flex",
                  marginBottom: 5,
                  border: "6px solid cadetblue",
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
                    color: "white",
                    background: "cadetblue",
                    padding: 12,
                  }}
                >
                  <strong> R E A D Y </strong>
                </Card>
                <Row
                  className="style-2"
                  style={{
                    flex: 1,
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    paddingBottom: 7,
                    margin: "6px 0px 0px",
                  }}
                  gutter={[8, 8]}
                >
                  {KOTdtl.filter((ii) => ii.IsReady === "Y").length <= 0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {KOTdtl.length > 0 &&
                    KOTdtl.filter((ii) => ii.IsReady === "Y")
                      .filter(
                        (kk) =>
                          (kk.OrderType !== "DINEIN" &&
                            kk.OrderType !== "CNTRSALE" &&
                            selectedType === "ALL") ||
                          kk.OrderType === selectedType
                      )
                      .map((ii, index) => {
                        return (
                          <Col
                            key={ii.KOTId}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={8}
                            xl={8}
                          >
                            <KOTCardDtl
                              EntryMode={entryMode}
                              data={ii}
                              login={loginInfo}
                              refreshScreen={fetchInitialData}
                            />
                          </Col>
                        );
                      })}
                </Row>
              </div>

              <div
                className="preparing-pos"
                style={{
                  display: "flex",
                  border: "6px solid #ff9912",
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
                    color: "white",
                    background: "#ff9912",
                    padding: 12,
                  }}
                >
                  <strong> P R E P A R I N G</strong>
                </Card>
                <Row
                  className="style-2"
                  style={{
                    flex: 1,
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    // margin: "6px 0px 0px",
                    paddingBottom: 7,
                    margin: "6px 0px 0px",
                  }}
                  gutter={[8, 8]}
                >
                  {KOTdtl.filter((ii) => ii.IsPreparing === "Y").length <=
                    0 && (
                    <div
                      style={{ flex: 1, textAlign: "center", margin: "auto" }}
                    >
                      <Empty />
                    </div>
                  )}
                  {KOTdtl.length > 0 &&
                    KOTdtl.filter((ii) => ii.IsPreparing === "Y")
                      .filter(
                        (kk) =>
                          (kk.OrderType !== "DINEIN" &&
                            kk.OrderType !== "CNTRSALE" &&
                            selectedType === "ALL") ||
                          kk.OrderType === selectedType
                      )
                      .map((ii, index) => {
                        return (
                          <Col
                            key={ii.KOTId}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={8}
                            xl={8}
                          >
                            <KOTCardDtl
                              data={ii}
                              login={loginInfo}
                              refreshScreen={() => fetchInitialData()}
                            />
                          </Col>
                        );
                      })}
                </Row>
              </div>
            </Col>
            <Col span={7} style={{ height: "100%" }}>
              <Card
                style={{ height: "50%" }}
                // className="style-2"
                bodyStyle={{ padding: 0, height: "100%" }}
              >
                <OrderDetailsComponent />
              </Card>
              <Card
                style={{ height: "50%" }}
                bodyStyle={{ padding: 0, height: "100%" }}
              >
                <BillsDetailsComponent />
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {entryMode && !isLoading && (
        <RestaurantPOSTran
          EntryMode={entryMode}
          data={{
            MenuRates: menuRates,
            MenuVariationRates: menuVariationRates,
            FavMenus: favMenus,
            MenuAddOnDtl: menuAddOnDtl,
            MenuAddOn: menuAddOn,
          }}
          CompName={entryMode.EntryType === "DELIVERY" ? "Delivery" : "PickUp"}
          CompType={
            entryMode.EntryType === "DELIVERY"
              ? "delivery-default"
              : "pick-up-default"
          }
          onBackPress={() => {
            setEntryMode();
            fetchInitialData();
            setAutoRefresh(true);
            // setIsLoading(true);
          }}
        />
      )}
    </>
  );
};

export default Delivery_PickUp_KOT;
