import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  fetchPOSRestaurantMenuAddOnDtl,
  fetchPOSRestaurantMenuAddOns,
  fetchPOSRestaurantMenuRates,
  fetchPOSRestaurantMenuVariationRates,
  fetchPOSRestaurantUserFavoriteMenus,
} from "../../services/restaurant-pos";
import AppLoader from "../common/AppLoader";
import RestaurantPOS from "../dashboard/Restaurant/Restaurant-POS";
import BillsDetailsComponent from "./components/BillsDetailsComponent";
import OrderDetailsComponent from "./components/OrderDetailsComponent";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../store/actions/currentTran";
import RestaurantPOSTran from "../dashboard/Restaurant/components/RestaurantPOSTran";
import { useHotkeys } from "react-hotkeys-hook";

const CounterSale = () => {
  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const appConfigs = useSelector((state) => state.AppMain.appconfigs);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [isLoading, setIsLoading] = useState(false);
  const [tablesList, setTablesList] = useState();
  const [menuRates, setMenuRates] = useState();
  const [menuVariationRates, setMenuVariationRates] = useState();
  const [favMenus, setFavMenus] = useState();
  const [menuAddOnDtl, setMenuAddOnDtl] = useState();
  const [menuAddOn, setMenuAddOn] = useState();
  const [entryMode, setEntryMode] = useState();
  useEffect(() => {
    dispatch(setFormCaption(57));
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
    ])
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err, "initial Load Error");
        setIsLoading(false);
      });

    setAa("alt + shift +  5   ");
  }, []);

  const [aa, setAa] = useState(null);

  useHotkeys(aa, (a) => {
    a.preventDefault();
    setEntryMode({
      EntryType: "CNTRSALE",
    });
  });

  return (
    <Fragment>
      {isLoading && <AppLoader />}
      {!isLoading && !entryMode && (
        <Row style={{ height: "calc(100vh - 59px)" }}>
          <Col
            flex="1 1 0%"
            style={{ height: "100%" }}
            className="booking-counter-sale"
          >
            <Card
              style={{
                flex: 1,
              }}
              bodyStyle={{
                height: "100%",
              }}
            >
              <Button
                type="primary"
                style={{
                  height: 80,
                  lineHeight: "80px",
                  textAlign: "center",
                  fontSize: 26,
                  fontWeight: 600,
                  display: "block",
                  width: "100%",
                }}
                onClick={() => {
                  setEntryMode({
                    EntryType: "CNTRSALE",
                  });
                }}
                icon={<PlusCircleOutlined style={{}} />}
              >
                <span style={{}}> New Bill</span>
              </Button>
              {/* <Button
                type="primary"
                onClick={() => {
                  const { ipcRenderer } = window.require("electron");

                  ipcRenderer.send("channel1", "some message");

                  // console.log('hari',process.versions['electron'])
                }}
                // icon={<PlusCircleOutlined/>}
              >
                <span> Test</span>
              </Button> */}
            </Card>
          </Col>
          <Col flex="0 0 300px" style={{ height: "100%" }}>
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
      )}
      {entryMode && (
        <RestaurantPOSTran
          EntryMode={entryMode}
          data={{
            TablesList: tablesList,
            MenuRates: menuRates,
            MenuVariationRates: menuVariationRates,
            FavMenus: favMenus,
            MenuAddOnDtl: menuAddOnDtl,
            MenuAddOn: menuAddOn,
          }}
          CompName="CounterSale"
          CompType="counter-sale-default"
          onBackPress={() => {
            setEntryMode();
            // setIsLoading(true);
          }}
          appConfigs={appConfigs}
          routeSplitTable={(tCode) => {
            setEntryMode({
              EntryType: "DINEIN",
              TableInfo: tCode,
            });
          }}
        />
      )}
    </Fragment>
  );
};

export default CounterSale;
