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

const StockSummary = (props) => {
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
        // console.log(res, "response 1");
        let Outstanding = parseFloat(res[0][0].Outstanding);
        let CashAndBank = 0;
        res[1].map((a) => {
          CashAndBank = parseFloat(a.ClosingBalance) + CashAndBank;
        });
        let StockInHand = parseFloat(res[2][0].CurrStockValue);
        let UnSoldStockVal = 0;
        res[3].map((a) => {
          UnSoldStockVal = parseFloat(a.EstimatedAmount) + UnSoldStockVal;
        });
        let totalNetValue = 0;
        totalNetValue = parseFloat(
          Outstanding + CashAndBank + StockInHand + UnSoldStockVal
        );

        setDataSource([
          ...res,
          [
            { name: "Outstanding", value: Outstanding.toFixed(2) },
            { name: "Cash And Bank", value: CashAndBank.toFixed(2) },
            { name: "Stock In Hand", value: StockInHand.toFixed(2) },
            {
              name: "Unsold Stock Value",
              value: UnSoldStockVal.toFixed(2),
            },
          ],

          [{ name: "Net Value", value: totalNetValue.toFixed(2) }],
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
          <div>Net Valuation</div>
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
          {dataSource.length > 0 &&
            dataSource[5].map((aa) => {
              // console.log(aa);
              return (
                <div key={aa.name}>
                  <div className="flex justify-between px-4 py-2 border-b border-solid border-primary-light">
                    <div className="flex justify-center items-center pr-2">
                      <RightCircleFilled className="text-xs text-primary-color" />
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div>{aa.name}</div>
                      <div className="font-medium text-primary-color">
                        {currency.value1}{" "}
                        {parseFloat(aa.value)
                          ? parseFloat(aa.value).toFixed(2)
                          : "0.00"}
                        {/* {dataSource.length > 0 ? dataSource[0][0].CurrStockValue : ""} */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-between px-4 py-2 rounded border border-solid border-primary-color bg-white">
          <div className="flex-1 flex justify-between">
            <div>Total Amount</div>
            <div className="font-medium text-primary-color">
              {currency.value1}{" "}
              {dataSource.length > 0 && parseFloat(dataSource[6][0].value)
                ? parseFloat(dataSource[6][0].value).toFixed(2)
                : "0.00"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSummary;
