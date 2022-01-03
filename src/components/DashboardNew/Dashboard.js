import React, { useState, useEffect } from "react";
import { Row, Col, Empty } from "antd";
import {
  fetchDashboardLayout,
  fetchDashboardConfig,
  fetchDashboardLayoutConfigMapp,
} from "../../services/dashboard";
// import ComponentSmallCard from "./Component/ComponentSmallCard";
// import ComponentChartHdr from "./Component/ComponentChartHdr";
// import DtlCardComponent from "./Component/DtlCardComponent";
// import DtlRightCartComponent from "./Component/DtlRightCartComponent";
import ServiceTypeRevenue from "./Component/ServiceTypeRevenue";
import ComponentCustomerCount from "./Component/ComponentCustomerCount";
import BilledDataComponent from "./Component/BilledDataComponent";
import NotificationComponent from "./Component/NotificationComponent";
import SupportCenterComponent from "./Component/SupportCenterComponent";
import { fetchParamSelectQuery } from "../../services/report-master";
import { useSelector, useDispatch } from "react-redux";
import { CheckDataKeys } from "../../shared/utility";
import { setFormCaption } from "../../store/actions/currentTran";
import ServiceTypeWeeklyRevenue from "./Component/ServiceTypeWeeklyRevenue";
import RestaurantPOSCatWiseRevenue from "./Component/RestaurantPOSCatWiseRevenue";
import RestaurantPOSCatWiseRevenueHourly from "./Component/RestaurantPOSCatWiseRevenueHourly";
import RestaurantPOSDeptWiseRevenueHourly from "./Component/RestaurantPOSDeptWiseRevenueHourly";
import DayBookSummmary from "./Component/DayBookSummmary";
import OutstandingSummmary from "./Component/OutstandingSummmary";
import StockInHand from "./Component/StockInHand";
import MKMonthlyStatistic from "./Component/MKMonthlyStatistic";
import MKLocationWiseUnsoldStockValue from "./Component/MKLocationWiseUnsoldStockValue";
import MKLocationWiseUnsoldStockValueChart from "./Component/MKLocationWiseUnsoldStockValueChart";

//Hari on 20210129
import InventorySubCategoryWiseRevenue from "./Component/Inventory/InventorySubCategoryWiseRevenue";
import InventoryDateWiseSalesAnalysis from "./Component/Inventory/InventoryDateWiseSalesAnalysis";
import InventoryCategoryWiseHourlySales from "./Component/Inventory/InventoryCategoryWiseHourlySales";
import InventoryCategoryWiseRevenue from "./Component/Inventory/InventoryCategoryWiseRevenue";
import InventoryBrandWiseRevenue from "./Component/Inventory/InventoryBrandWiseRevenue";
import InventoryManufacturerWiseRevenue from "./Component/Inventory/InventoryManufacturerWiseRevenue";
import InventoryTopSellingProducts from "./Component/Inventory/InventoryTopSellingProducts";
import InventoryItemReOrder from "./Component/Inventory/InventoryItemReOrder";

//Hari on 20210225
import MKShortcutMenus from "./Component/MKShortcutMenus";
import CashAndBankBalance from "./Component/CashAndBankBalance";
import OutstandingSummary from "./Component/OutstandingSummary";
import StockValueNewComponent from "./Component/StockValueNewComponent";
import StockSummary from "./Component/StockSummary";
import CashAndBankBalanceSummary from "./Component/CashAndBankBalanceSummary";
const Comp = (props) => {
  const [datasource, setDatasource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const dataKeys = useSelector((state) => state.AppMain);
  const dispatch = useDispatch();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(setFormCaption(79));
  }, []);

  return (
    <div style={{ display: "flex", flex: 1 }}>
      {!error && !isLoading ? (
        props.layout.ComponentName === "ComponentCustomerCount" ? (
          <ComponentCustomerCount CompCode={CompCode} config={props.layout} />
        ) : props.layout.ComponentName === "BilledDataComponent" ? (
          <BilledDataComponent config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "PromotionNotification" ? (
          <NotificationComponent
            CompCode={CompCode}
            type={"Promotions"}
            title={props.layout.DashboardName}
            config={props.layout}
          />
        ) : props.layout.ComponentName === "TransactionNotification" ? (
          <NotificationComponent
            CompCode={CompCode}
            type={"Transaction"}
            title={props.layout.DashboardName}
            config={props.layout}
          />
        ) : props.layout.ComponentName === "SupportCenterComponent" ? (
          <SupportCenterComponent
            CompCode={CompCode}
            type={"SupportCenterComponent"}
            title={"Support Center"}
            config={props.layout}
          />
        ) : // ) : props.layout.ComponentName === "ServiceTypeRevenue" ? (
        //   <ServiceTypeRevenue
        //     config={props.layout}
        //     // data={datasource.length > 0 ? datasource : null}
        //   />
        // ) : props.layout.ComponentName === "ServiceTypeWeeklyRevenue" ? (
        //   <ServiceTypeWeeklyRevenue
        //     config={props.layout}
        //     // data={datasource.length > 0 ? datasource : null}
        //   />
        props.layout.ComponentName === "RestaurantPOSCatWiseRevenue" ? (
          <RestaurantPOSCatWiseRevenue
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName ===
          "RestaurantPOSCatWiseRevenueHourly" ? (
          <RestaurantPOSCatWiseRevenueHourly
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName ===
          "RestaurantPOSDeptWiseRevenueHourly" ? (
          <RestaurantPOSDeptWiseRevenueHourly
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName === "DayBookSummmary" ? (
          <DayBookSummmary config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "OutstandingSummmary" ? (
          <OutstandingSummmary config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "StockInHand" ? (
          <StockInHand config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "MKMonthlyStatistic" ? (
          <MKMonthlyStatistic config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "MKLocationWiseUnsoldStockValue" ? (
          <MKLocationWiseUnsoldStockValue
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName ===
          "MKLocationWiseUnsoldStockValueChart" ? (
          <MKLocationWiseUnsoldStockValueChart
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName === "InventorySubCategoryWiseRevenue" ? (
          <InventorySubCategoryWiseRevenue
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName === "InventoryDateWiseSalesAnalysys" ? (
          <InventoryDateWiseSalesAnalysis
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName ===
          "InventoryCategoryWiseHourlySales" ? (
          <InventoryCategoryWiseHourlySales
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName === "InventoryCategoryWiseRevenue" ? (
          <InventoryCategoryWiseRevenue
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName === "InventoryBrandWiseRevenue" ? (
          <InventoryBrandWiseRevenue
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName ===
          "InventoryManufacturerWiseRevenue" ? (
          <InventoryManufacturerWiseRevenue
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName === "InventoryTopSellingProducts" ? (
          <InventoryTopSellingProducts
            config={props.layout}
            CompCode={CompCode}
          />
        ) : props.layout.ComponentName === "MKShortcutMenus" ? (
          <MKShortcutMenus config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "StockValueNewComponent" ? (
          <StockValueNewComponent config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "CashAndBankBalance" ? (
          <CashAndBankBalance config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "OutstandingSummary" ? (
          <OutstandingSummary config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "StockSummary" ? (
          <StockSummary config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "ItemReOrder" ? (
          <InventoryItemReOrder config={props.layout} CompCode={CompCode} />
        ) : props.layout.ComponentName === "CashAndBankBalanceSummary" ? (
          <CashAndBankBalanceSummary
            config={props.layout}
            CompCode={CompCode}
          />
        ) : (
          <div>Component Does Not Exist</div>
        )
      ) : error ? (
        <div className="dashboard-card">error fetching Data Source,{error}</div>
      ) : (
        <div className="dashboard-card" style={{ flex: 1 }}>
          <Empty description={false} />
        </div>
      )}
      {/* {error && (
        <div className="dashboard-card">error fetching Data Source,{error}</div>
      )} */}
    </div>
  );
};

const Dashboard = () => {
  const [dashboardLayout, setDashboardLayout] = useState([]);
  const [dashboardConfig, setDashboardConfig] = useState([]);
  const [dashboardLayoutConfigMapp, setDashboardLayoutConfigMapp] = useState(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [AutoRefresh, setAutoRefresh] = useState(true);
  const [IntervalId, setIntervalId] = useState();
  const R_DINEIN = useSelector((state) => state.AppMain.appconfigs).find(
    (ii) => ii.configCode === "R_DSHBRD"
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    if (R_DINEIN.value1 === "Y") {
      let tempIntervalId;
      let refreshSeconds = parseInt(R_DINEIN.value2) * 1000;
      if (AutoRefresh && !IntervalId) {
        tempIntervalId = setInterval(() => {
          const LoadingData = () => {
            setIsLoading(true);
            Promise.all([
              fetchDashboardLayout(CompCode).then((res) => {
                // console.log(res);
                setDashboardLayout(res);
                return res;
              }),
              fetchDashboardConfig(CompCode).then((res) => {
                // console.log(res);
                setDashboardConfig(res);
                return res;
              }),
              fetchDashboardLayoutConfigMapp(CompCode).then((res) => {
                // console.log(res);
                setDashboardLayoutConfigMapp(res);
                return res;
              }),
            ]).then((res) => {
              setIsLoading(false);
            });
          };
          return LoadingData();
        }, refreshSeconds);
        setIntervalId(tempIntervalId);
      } else {
        clearInterval(IntervalId);
        setIntervalId();
      }
    }
  }, [AutoRefresh]);

  useEffect(() => {
    const LoadingData = () => {
      setIsLoading(true);
      Promise.all([
        fetchDashboardLayout(CompCode).then((res) => {
          // console.log(res);
          setDashboardLayout(res);
          return res;
        }),
        fetchDashboardConfig(CompCode).then((res) => {
          // console.log(res);
          setDashboardConfig(res);
          return res;
        }),
        fetchDashboardLayoutConfigMapp(CompCode).then((res) => {
          // console.log(res);
          setDashboardLayoutConfigMapp(res);
          return res;
        }),
      ]).then((res) => {
        setIsLoading(false);
      });
    };
    return LoadingData();
  }, []);

  return (
    <div>
      <Row>
        {isLoading === false &&
        dashboardLayout &&
        dashboardLayout.length > 0 ? (
          dashboardLayout.map((layout) => {
            return (
              <Col
                key={layout.LayoutId}
                xs={layout.xs}
                sm={layout.sm}
                md={layout.md}
                lg={layout.lg}
                style={{ display: "flex" }}
              >
                {dashboardLayoutConfigMapp
                  .filter((mapp) => mapp.LayoutId === layout.LayoutId)
                  .map((dash) => {
                    return dashboardConfig
                      .filter(
                        (config) => config.DashboardId === dash.DashboardId
                      )
                      .map((ii) => {
                        return <Comp key={ii.DashboardId} layout={ii} />;
                      });
                  })}
              </Col>
            );
          })
        ) : (
          <div>is Loading</div>
        )}
        {/* <Col lg={6}>
          <CashAndBankBalance />
        </Col> */}
        {/* <Col lg={6}>
          <OutstandingSummary />
        </Col> */}
        {/* <Col lg={12}>
          <StockValueNewComponent />
        </Col> */}
      </Row>
    </div>
  );
};

export default Dashboard;
