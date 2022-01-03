import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker, Row, Col, Button, Tooltip } from "antd";
import moment from "moment";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import { ReloadOutlined } from "@ant-design/icons";
import { AlertTriangle } from "react-feather";

const OutstandingSummmary = (props) => {
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
      for (i; i < (param && param.length); i++) {
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
      if (idx <= 0) {
        tempParam += `'${row}'`;
      } else {
        tempParam += `,'${row}'`;
      }
    });

    let tempQuery = pDataSource.replace(/\((.+?)\)/g, "(" + tempParam + ")");

    setIsLoading(true);
    await fetchParamSelectQuery(tempQuery)
      .then((res) => {
        setDataSource(res[0]);
        setIsLoading(false);
        // return null
      })
      .catch((err) => {
        // alert(err)
        setDataSource();
        setIsLoading(false);
        return setError("error fetching data source data");
      });
  };

  return (
    dataSource &&
    dataSource.length > 0 && (
      <div
        className="dashboard-card"
        style={{
          flex: 1,
          display: "flex",
          flexFlow: "column wrap",
          // paddingTop: 0,
          // paddingBottom: 0,

          padding: "0px 0px",
        }}
      >
        <div
          style={{
            padding: "0px 5px",
            // borderBottom: "1px solid #cecece",
            fontFamily: `'Cairo', sans-serif`,
            fontSize: 18,
            color: "#FFF",
            backgroundColor: "var(--app-theme-color)",
          }}
        >
          Outstanding Summary
        </div>
        <div
          style={{
            backgroundColor: "var(--app-theme-color-rbga)",
            display: "flex",
            border: "1px solid var(--app-theme-color)",
            flex: 1,
            //   margin: "5px 0px",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "10px 10px",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--app-theme-color)",
                opacity: 0.5,
                zIndex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></div>
            <span
              style={{
                color: "#FFF",
                zIndex: 5,
                opacity: 1,
                position: "relative",
              }}
            >
              Customer
            </span>
          </div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              // minWidth: 100,
              padding: "10px 0px",
              width: 130,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div
              className="bg-gray-50"
              style={{
                // backgroundColor: "var(--app-theme-color)",
                opacity: 0.8,
                zIndex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></div>
            <span
              className={`${
                parseFloat(dataSource[0].Customer) / l_DivisibleByN.value1 >= 0
                  ? "text-green-700"
                  : "text-red-500"
              }`}
              style={{
                zIndex: 5,
                opacity: 1,
                position: "relative",
              }}
            >
              {currency.value1}{" "}
              {dataSource[0].Customer &&
              (l_DivisibleByN.value1 !== 0 || l_DivisibleByN.value1 !== null)
                ? (
                    parseFloat(dataSource[0].Customer) / l_DivisibleByN.value1
                  ).toFixed(2)
                : (0).toFixed(2)}
            </span>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "var(--app-theme-color-rbga)",
            display: "flex",
            //   border: "1px solid var(--app-theme-color)",
            flex: 1,
            //   margin: "5px 0px",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "10px 10px",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--app-theme-color)",
                opacity: 0.2,
                zIndex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></div>
            <span
              style={{
                color: "var(--app-theme-color)",
                zIndex: 5,
                opacity: 1,
                position: "relative",
              }}
            >
              Supplier
            </span>
          </div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              // minWidth: 100,
              padding: "10px 0px",
              width: 130,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div
              className="bg-gray-50 border-1 border-primary-light"
              style={{
                // backgroundColor: "var(--app-theme-color)",
                opacity: 0.8,
                zIndex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></div>
            <span
              className={`${
                parseFloat(dataSource[0].Supplier) / l_DivisibleByN.value1 >= 0
                  ? "text-green-700"
                  : "text-red-500"
              }`}
              style={{
                zIndex: 5,
                opacity: 1,
                position: "relative",
              }}
            >
              {currency.value1}{" "}
              {dataSource[0].Supplier &&
              (l_DivisibleByN.value1 !== 0 || l_DivisibleByN.value1 !== null)
                ? (
                    parseFloat(dataSource[0].Supplier) / l_DivisibleByN.value1
                  ).toFixed(2)
                : (0).toFixed(2)}
            </span>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "var(--app-theme-color-rbga)",
            display: "flex",
            border: "1px solid var(--app-theme-color)",
            flex: 1,
            //   margin: "5px 0px",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "10px 10px",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--app-theme-color)",
                opacity: 0.5,
                zIndex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></div>
            <span
              style={{
                color: "#FFF",
                zIndex: 5,
                opacity: 1,
                position: "relative",
              }}
            >
              Total Outstanding
            </span>
          </div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              // minWidth: 100,
              padding: "10px 0px",
              width: 130,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div
              className="bg-gray-50"
              style={{
                // backgroundColor: "var(--app-theme-color)",
                opacity: 0.8,
                zIndex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></div>
            <span
              className={`${
                parseFloat(dataSource[0].Outstanding) / l_DivisibleByN.value1 >=
                0
                  ? "text-green-700"
                  : "text-red-500"
              }`}
              style={{
                zIndex: 5,
                opacity: 1,
                position: "relative",
              }}
            >
              {currency.value1}{" "}
              {dataSource[0].Outstanding &&
              (l_DivisibleByN.value1 !== 0 || l_DivisibleByN.value1 !== null)
                ? (
                    parseFloat(dataSource[0].Outstanding) /
                    l_DivisibleByN.value1
                  ).toFixed(2)
                : (0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default OutstandingSummmary;
