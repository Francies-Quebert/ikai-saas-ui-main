import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker, Row, Col, Button, Tooltip } from "antd";
import moment from "moment";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import { ReloadOutlined, RightCircleFilled } from "@ant-design/icons";
import { AlertTriangle } from "react-feather";

const OutstandingSummary = (props) => {
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
      // console.log(param, "param");
      setParamValues(param);
    } else {
      setError("no Source Exist");
    }
  };

  const getData = async (pDataSource, pParameterValues) => {
    // console.log("1");
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
    // console.log("start");
    // console.log(tempQuery);
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
    // console.log("end");
  };
  return (
    <div className=" w-full pr-1">
      <div className="shadow-lg">
        <div className="text-lg font-normal bg-primary-color px-4 py-1 text-white">
          Outstanding Summary
        </div>
        <div className="bg-white max-h-44 h-44 overflow-auto style-2 border border-solid border-primary-light">
          <div className="flex justify-between px-4 py-2 border-b border-solid border-primary-light">
            <div className="flex justify-center items-center pr-2">
              <RightCircleFilled className="text-xs text-primary-color" />
            </div>
            <div className="flex-1 flex justify-between">
              <div>Customer</div>
              <div className="font-medium text-primary-color">
                {currency.value1}{" "}
                {dataSource.length > 0 &&
                dataSource[0].Customer &&
                parseFloat(dataSource[0].Customer)
                  ? parseFloat(dataSource[0].Customer).toFixed(2)
                  : "0.00"}
              </div>
            </div>
          </div>
          <div className="flex justify-between px-4 py-2 border-b border-solid border-primary-light">
            <div className="flex justify-center items-center pr-2">
              <RightCircleFilled className="text-xs text-primary-color" />
            </div>
            <div className="flex-1 flex justify-between">
              <div>Supplier</div>
              <div className="font-medium text-primary-color">
                {currency.value1}{" "}
                {dataSource.length > 0
                  ? parseFloat(Math.abs(dataSource[0].Supplier)).toFixed(2)
                  : null}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-4 py-2 rounded border border-solid border-primary-color bg-white">
          <div className="flex-1 flex justify-between">
            <div>Total Amount</div>
            <div className="font-medium text-primary-color">
              {currency.value1}{" "}
              {dataSource.length > 0 && parseFloat(dataSource[0].Outstanding)
                ? parseFloat(dataSource[0].Outstanding).toFixed(2)
                : "0.00"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutstandingSummary;
