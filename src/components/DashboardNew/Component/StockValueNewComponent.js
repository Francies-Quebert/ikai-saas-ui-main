import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import { useSelector } from "react-redux";
import { DatePicker, Row, Col, Button, Tooltip, Menu, Dropdown } from "antd";
import moment from "moment";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import {
  ReloadOutlined,
  EllipsisOutlined,
  PieChartOutlined,
  BarsOutlined,
  RightCircleFilled,
} from "@ant-design/icons";

const StockValueNewComponent = (props) => {
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
        if (i === 1) {
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

  const getData = (pDataSource, pParameterValues) => {
    let tempParam = "";
    pParameterValues.forEach((row, idx) => {
      if (idx === 0) {
        tempParam += `'${row}'`;
      } else {
        tempParam += `,'${moment(row).format("YYYY-MM-DD")}'`;
      }
    });

    let tempQuery = pDataSource.replace(/\((.+?)\)/g, "(" + tempParam + ")");

    setIsLoading(true);
    fetchParamSelectQuery(tempQuery)
      .then((res) => {
        let totalValue = 0;
        let totalCostAmount = 0;
        totalValue = parseFloat(res[0][0].CurrStockValue);
        totalCostAmount = parseFloat(res[0][0].CurrStockValue);
        res[1].forEach((a) => {
          totalValue = parseFloat(a.EstimatedAmount) + parseFloat(totalValue);
          totalCostAmount =
            parseFloat(a.CostAmount) + parseFloat(totalCostAmount);
        });

        setDataSource([
          ...res,
          [{ totalValue: totalValue.toFixed(2) }],
          [{ totalCostAmount: totalCostAmount.toFixed(2) }],
        ]);

        setIsLoading(false);
      })
      .catch((err) => {
        setDataSource([]);
        setIsLoading(false);
        return setError("error fetching data source data");
      });
  };

  return (
    <div className=" w-full  pr-1">
      <div className="shadow-lg">
        <div className="flex justify-between text-lg font-normal bg-primary-color px-4 py-1 text-white">
          <div>Stock And Unsold Valuation</div>
          <div className="flex py-1">
            {/* <DatePicker
              value={paramValues[1]}
              size={"small"}
              //   format={"DD MMM YYYY"}
              format={l_DateFormat.value1}
              onChange={(dates) => {
                console.log(dates);
                setParamValues([CompCode, dates]);
              }}
              allowClear={false}
            /> */}
          </div>
        </div>
        <div className="bg-white max-h-44 h-44 overflow-auto style-2">
          <>
            {" "}
            <div className="flex justify-between px-4 py-2 border-b border-solid border-primary-light">
              <div className="flex justify-center items-center pr-2 d-none">
                <RightCircleFilled className="d-none text-xs text-primary-color" />
              </div>
              <div className="flex-1 flex justify-between">
                <div
                  className="justify-center text-center font-medium"
                  style={{ width: 100 }}
                >
                  Source
                </div>
                <div className="font-medium">Cost Amt.</div>
                <div className="font-medium">Esti. Amt.</div>
              </div>
            </div>
            <div className="flex justify-between px-4 py-2 border-b border-solid border-primary-light">
              <div className="flex justify-center items-center pr-2">
                <RightCircleFilled className="text-xs text-primary-color" />
              </div>
              <div className="flex-1 flex justify-between">
                <div style={{ width: 100 }}>Stock in hand</div>
                <div className="font-medium text-primary-color">
                  {currency.value1}{" "}
                  {dataSource.length > 0 &&
                  parseFloat(dataSource[0][0].CurrStockValue)
                    ? parseFloat(dataSource[0][0].CurrStockValue).toFixed(2)
                    : "0.00"}
                </div>{" "}
                <div className="font-medium text-primary-color">
                  {currency.value1}{" "}
                  {dataSource.length > 0 &&
                  parseFloat(dataSource[0][0].CurrStockValue)
                    ? parseFloat(dataSource[0][0].CurrStockValue).toFixed(2)
                    : "0.00"}
                </div>
              </div>
            </div>
            {dataSource.length > 0
              ? dataSource[1].map((a) => {
                  return (
                    <div className="flex justify-between px-4 py-2 border-b border-solid border-primary-light">
                      <div className="flex justify-center items-center pr-2">
                        <RightCircleFilled className="text-xs text-primary-color" />
                      </div>
                      <div className="flex-1 flex justify-between">
                        <div style={{ width: 100 }}>{a.DeliveryStatus}</div>{" "}
                        <div className="font-medium text-primary-color">
                          {currency.value1}{" "}
                          {parseFloat(a.CostAmount)
                            ? parseFloat(a.CostAmount).toFixed(2)
                            : "0.00"}
                        </div>
                        <div className="font-medium text-primary-color">
                          {currency.value1}{" "}
                          {parseFloat(a.EstimatedAmount)
                            ? parseFloat(a.EstimatedAmount).toFixed(2)
                            : "0.00"}
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </>
        </div>
        <div className="flex justify-between px-4 py-2 rounded border border-solid border-primary-color bg-white">
          <div className="flex-1 flex justify-between">
            <div style={{ width: 100 }}>Total Amount</div>
            <div className="font-medium text-primary-color">
              {currency.value1}{" "}
              {dataSource.length > 0 && parseFloat(dataSource[3][0].totalValue)
                ? parseFloat(dataSource[4][0].totalCostAmount).toFixed(2)
                : "-"}
            </div>
            <div className="font-medium text-primary-color">
              {currency.value1}{" "}
              {dataSource.length > 0 && parseFloat(dataSource[3][0].totalValue)
                ? parseFloat(dataSource[3][0].totalValue).toFixed(2)
                : "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockValueNewComponent;
