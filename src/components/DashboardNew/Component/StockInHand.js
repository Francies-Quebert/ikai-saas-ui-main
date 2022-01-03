import { BankOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker, Row, Col, Button, Tooltip } from "antd";
import moment from "moment";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import { ReloadOutlined } from "@ant-design/icons";

const StockInHand = (props) => {
  const appMainData = useSelector((state) => state.AppMain);
  const l_DateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "DTFORMAT")
  );
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const l_DivisibleByN = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "ZBN_DB_CB")
  );

  const l_ClientCode = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CLIENT_CODE")
  );

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  //ZBN_DB_CB
  const [chartData, setChartData] = useState();
  const [paramValues, setParamValues] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    return getInitialData();
  }, []);

  useEffect(() => {
    if (paramValues.length > 0) {
      getData(props.config.DashboardSource, paramValues);
    }
  }, [paramValues, props.refreshRequest, isRefresh]);

  const getInitialData = () => {
    if (props.config && props.config.DashboardSource) {
      let param = props.config.DashboardSource.match(/\(([^)]+)\)/)
        ? props.config.DashboardSource.match(/\(([^)]+)\)/)[1].split(",")
        : undefined;
      let i = 0;

      for (i; i < param.length; i++) {
        param[i] = CheckDataKeysNew(appMainData, param[i]);
      }
      setParamValues(param);
    } else {
      setError("no Source Exist");
    }
  };

  const getData = async (pDataSource, pParameterValues) => {
    let tempParam = "";
    pParameterValues.forEach((row, idx) => {
      tempParam += `'${row}'`;
    });

    let tempQuery = pDataSource.replace(/\((.+?)\)/g, "(" + tempParam + ")");
    setIsLoading(true);

    await fetchParamSelectQuery(tempQuery)
      .then((res) => {
        setDataSource(res[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        setDataSource([]);
        setIsLoading(false);
        return setError("error fetching data source data");
      });
  };

  return (
    <div
      className="dashboard-card"
      style={{
        flex: 1,
        padding: 0,
        display: "flex",
        flexFlow: "column wrap",
      }}
    >
      <div
        style={{
          padding: "0px 5px",
          borderBottom: "1px solid #cecece",
          fontFamily: `'Cairo', sans-serif`,
          fontSize: 18,
          color: "#FFF",
          backgroundColor: "var(--app-theme-color)",
        }}
      >
        Stock In Hand
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          backgroundColor: "var(--app-theme-color-rbga)",
          borderColor: "var(--app-theme-color)",
          borderRight: 1,
          borderBottom: 1,
          borderStyle: "solid",
          borderTop: 0,
          borderRadius: 3,
        }}
      >
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--app-theme-color)",
            color: "#FFF",
          }}
        >
          <ShoppingCartOutlined
            style={{ fontSize: 30, transform: "rotate(-15deg)" }}
          />
        </div>
        <div
          style={{
            flex: 1,
            color: "var(--app-theme-color)",
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            padding: "0px 15px",
            borderTop: "1px solid var(--app-theme-color)",
            justifyContent: "center",
          }}
        >
          {currency.value1}{" "}
          {dataSource && dataSource.length > 0 && dataSource[0].CurrStockValue
            ? (
                parseFloat(dataSource[0].CurrStockValue) / l_DivisibleByN.value1
              ).toFixed(2)
            : (0).toFixed(2)}
        </div>
      </div>

      {/* only if mk antia */}
      {l_ClientCode.value1 === "MKANTIA" && (
        <div>
          <div
            style={{
              flex: 1,
              color: "var(--app-theme-color)",
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              padding: "0px 15px",
              borderTop: "1px solid var(--app-theme-color)",
              justifyContent: "center",
            }}
          >
            {currency.value1}
            {dataSource.length > 0 && dataSource[0].NetVal
              ? (
                  parseFloat(dataSource[0].NetVal) / l_DivisibleByN.value1
                ).toFixed(2)
              : (0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockInHand;
