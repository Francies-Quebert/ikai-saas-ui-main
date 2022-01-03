import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker, Row, Col, Button, Tooltip } from "antd";
import moment from "moment";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import { ReloadOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const DayBookSummmary = (props) => {
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
      for (i; i < param.length; i++) {
        if (i === 1 || i === 2) {
          param[i] = moment(
            CheckDataKeysNew(appMainData, param[i]),
            "YYYY-MM-DD"
          );
        } else {
          param[i] = CheckDataKeysNew(appMainData, param[i]);
        }
      }

      setParamValues(param);
    } else {
      setError("no Source Exist");
    }
  };

  const getData = async (pDataSource, pParameterValues) => {
    let tempParam = "";
    pParameterValues.forEach((row, idx) => {
      if (idx === 0) {
        tempParam += `'${row}'`;
      } else {
        tempParam += `,'${moment(row).format("YYYY-MM-DD")}'`;
      }
    });

    let tempQuery = pDataSource.replace(/\((.+?)\)/g, "(" + tempParam + ")");
    // console.log('alal',tempQuery)
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
    // <div>hey there{JSON.stringify(dataSource)}</div>
    // <div
    //   className="dashboard-card"
    //   style={{
    //     flex: 1,
    //     // backgroundColor: "var(--app-theme-color-rbga)",
    //     // border: "1px solid var(--app-theme-color)",
    //     padding: 0,
    //   }}
    // >
    //   <div
    //     style={{
    //       // borderBottom: "1px solid #cecece",
    //       fontFamily: `'Cairo', sans-serif`,
    //       fontSize: 18,
    //       color: "#FFF",
    //       backgroundColor: "var(--app-theme-color)",
    //       padding: "0px 5px",
    //     }}
    //   >
    //     Day Book Summary
    //   </div>

    //   <div
    //     style={{
    //       backgroundColor: "var(--app-theme-color-rbga)",
    //       display: "flex",
    //       border: "1px solid var(--app-theme-color)",
    //     }}
    //   >
    //     <div style={{ position: "relative", padding: "10px 10px", flex: 1 }}>
    //       <div
    //         style={{
    //           backgroundColor: "var(--app-theme-color)",
    //           opacity: 0.5,
    //           zIndex: 1,
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       ></div>
    //       <span
    //         style={{
    //           color: "#FFF",
    //           zIndex: 5,
    //           opacity: 1,
    //           position: "relative",
    //         }}
    //       >
    //         Opening Balance
    //       </span>
    //     </div>
    //     <div
    //       style={{
    //         position: "relative",
    //         textAlign: "center",
    //         // minWidth: 100,
    //         padding: "10px 0px",
    //         width: 130,
    //       }}
    //     >
    //       <div
    //         style={{
    //           backgroundColor: "var(--app-theme-color)",
    //           opacity: 0.8,
    //           zIndex: 1,
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       ></div>
    //       <span
    //         style={{
    //           color: "#FFF",
    //           zIndex: 5,
    //           opacity: 1,
    //           position: "relative",
    //         }}
    //       >
    //         {currency.value1}{" "}
    //         {dataSource && dataSource.length > 0
    //           ? (
    //               parseFloat(dataSource[0].Opening) / l_DivisibleByN.value1
    //             ).toFixed(2)
    //           : 0}
    //       </span>
    //     </div>
    //   </div>
    //   <div
    //     style={{
    //       backgroundColor: "var(--app-theme-color-rbga)",
    //       display: "flex",
    //       // border: "1px solid var(--app-theme-color)",
    //     }}
    //   >
    //     <div style={{ position: "relative", padding: "10px 10px", flex: 1 }}>
    //       <div
    //         style={{
    //           backgroundColor: "var(--app-theme-color)",
    //           opacity: 0.2,
    //           zIndex: 1,
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       ></div>
    //       <span
    //         style={{
    //           color: "var(--app-theme-color)",
    //           zIndex: 5,
    //           opacity: 1,
    //           position: "relative",
    //         }}
    //       >
    //         Total Credit
    //       </span>
    //     </div>
    //     <div
    //       style={{
    //         position: "relative",
    //         textAlign: "center",
    //         // minWidth: 100,
    //         padding: "10px 0px",
    //         width: 130,
    //       }}
    //     >
    //       <div
    //         style={{
    //           backgroundColor: "var(--app-theme-color)",
    //           opacity: 0.8,
    //           zIndex: 1,
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       ></div>
    //       <span
    //         style={{
    //           color: "#FFF",
    //           zIndex: 5,
    //           opacity: 1,
    //           position: "relative",
    //         }}
    //       >
    //         {currency.value1}{" "}
    //         {dataSource && dataSource.length > 0
    //           ? (
    //               parseFloat(dataSource[0].Credit) / l_DivisibleByN.value1
    //             ).toFixed(2)
    //           : 0}
    //       </span>
    //     </div>
    //   </div>
    //   <div
    //     style={{
    //       backgroundColor: "var(--app-theme-color-rbga)",
    //       display: "flex",
    //       border: "1px solid var(--app-theme-color)",
    //     }}
    //   >
    //     <div style={{ position: "relative", padding: "10px 10px", flex: 1 }}>
    //       <div
    //         style={{
    //           backgroundColor: "var(--app-theme-color)",
    //           opacity: 0.5,
    //           zIndex: 1,
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       ></div>
    //       <span
    //         style={{
    //           color: "#FFF",
    //           zIndex: 5,
    //           opacity: 1,
    //           position: "relative",
    //         }}
    //       >
    //         Total Debit
    //       </span>
    //     </div>
    //     <div
    //       style={{
    //         position: "relative",
    //         textAlign: "center",
    //         // minWidth: 100,
    //         padding: "10px 0px",
    //         width: 130,
    //       }}
    //     >
    //       <div
    //         style={{
    //           backgroundColor: "var(--app-theme-color)",
    //           opacity: 0.8,
    //           zIndex: 1,
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       ></div>
    //       <span
    //         style={{
    //           color: "#FFF",
    //           zIndex: 5,
    //           opacity: 1,
    //           position: "relative",
    //         }}
    //       >
    //         {currency.value1}{" "}
    //         {dataSource && dataSource.length > 0
    //           ? (
    //               parseFloat(dataSource[0].Debit) / l_DivisibleByN.value1
    //             ).toFixed(2)
    //           : 0}
    //       </span>
    //     </div>
    //   </div>
    //   <div
    //     style={{
    //       backgroundColor: "var(--app-theme-color-rbga)",
    //       display: "flex",
    //       // border: "1px solid var(--app-theme-color)",
    //     }}
    //   >
    //     <div style={{ position: "relative", padding: "10px 10px", flex: 1 }}>
    //       <div
    //         style={{
    //           backgroundColor: "var(--app-theme-color)",
    //           opacity: 0.2,
    //           zIndex: 1,
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       ></div>
    //       <span
    //         style={{
    //           color: "var(--app-theme-color)",
    //           zIndex: 5,
    //           opacity: 1,
    //           position: "relative",
    //         }}
    //       >
    //         Closing Balance
    //       </span>
    //     </div>
    //     <div
    //       style={{
    //         position: "relative",
    //         textAlign: "center",
    //         // minWidth: 100,
    //         padding: "10px 0px",
    //         width: 130,
    //       }}
    //     >
    //       <div
    //         style={{
    //           backgroundColor: "var(--app-theme-color)",
    //           opacity: 0.8,
    //           zIndex: 1,
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       ></div>
    //       <span
    //         style={{
    //           color: "#FFF",
    //           zIndex: 5,
    //           opacity: 1,
    //           position: "relative",
    //         }}
    //       >
    //         {currency.value1}{" "}
    //         {dataSource && dataSource.length > 0
    //           ? (
    //               parseFloat(dataSource[0].Closing) / l_DivisibleByN.value1
    //             ).toFixed(2)
    //           : 0}
    //       </span>
    //     </div>
    //   </div>
    //   {/* day book summary */}
    // </div>
    <div className=" w-full text-white mr-1">
      <div className="grid grid-cols-1 gap-1 py-1 px-1 border border-solid border-primary-color rounded my-1">
        <div className="px-1 border border-primary-color bg-primary-color rounded text-lg flex justify-between">
          <div>Day Book Summary</div>
          <div className="flex py-1">
            <DatePicker
              value={paramValues[1]}
              size={"small"}
              //   format={"DD MMM YYYY"}
              format={l_DateFormat.value1}
              onChange={(dates) => {
                // console.log(dates);
                setParamValues([CompCode, dates, dates]);
              }}
              allowClear={false}
            />
            {/* <RangePicker
              value={[paramValues[1], paramValues[2]]}
              size={"small"}
              //   format={"DD MMM YYYY"}
              format={l_DateFormat.value1}
              onChange={(dates) => {
                setParamValues([CompCode, ...dates]);
              }}
              allowClear={false}
            /> */}
          </div>
        </div>
        <div className="grid grid-cols-4 text-primary-color font-semibold gap-1 text-base">
          <div className="bg-primary-light  rounded flex justify-center items-center py-1  border border-solid border-primary-color ">
            Opening Balance
          </div>
          <div className="bg-primary-light  rounded flex justify-center items-center py-1  border border-solid border-primary-color">
            Total Credit
          </div>
          <div className="bg-primary-light  rounded flex justify-center items-center py-1  border border-solid border-primary-color">
            Total Debit
          </div>
          <div className="bg-primary-light  rounded flex justify-center items-center py-1 border border-solid border-primary-color">
            Closing Balance
          </div>
        </div>
        <div className="grid grid-cols-4 text-primary-color font-semibold gap-1 text-base">
          <div className="bg-white border border-primary-light rounded flex justify-center items-center py-1">
            {currency.value1}{" "}
            {dataSource && dataSource.length > 0
              ? (
                  parseFloat(dataSource[0].Opening) / l_DivisibleByN.value1
                ).toFixed(2)
              : 0}
          </div>
          <div className="bg-white border border-primary-light  rounded flex justify-center items-center py-1">
            {currency.value1}{" "}
            {dataSource && dataSource.length > 0
              ? (
                  parseFloat(dataSource[0].Credit) / l_DivisibleByN.value1
                ).toFixed(2)
              : 0}
          </div>
          <div className="bg-white border border-primary-light  rounded flex justify-center items-center py-1">
            {currency.value1}{" "}
            {dataSource && dataSource.length > 0
              ? (
                  parseFloat(dataSource[0].Debit) / l_DivisibleByN.value1
                ).toFixed(2)
              : 0}
          </div>
          <div className="bg-white border border-primary-light  rounded flex justify-center items-center py-1">
            {currency.value1}{" "}
            {dataSource && dataSource.length > 0
              ? (
                  parseFloat(dataSource[0].Closing) / l_DivisibleByN.value1
                ).toFixed(2)
              : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayBookSummmary;
