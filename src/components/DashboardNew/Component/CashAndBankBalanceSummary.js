import React, { useEffect, useState } from "react";
import ImgBank from "../../../icons/bank.png";
import IMG_GATEWAY from "../../../icons/gateway.png";
import IMG_WALLET from "../../../icons/wallet.png";
import IMG_CASH from "../../../icons/cash.png";
import IMG_CHQ from "../../../icons/cheque.png";
import IMG_CARD from "../../../icons/card.png";
import { useSelector } from "react-redux";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import { DatePicker, Table } from "antd";
import moment from "moment";

const CashAndBankBalanceSummary = (props) => {
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

    setIsLoading(true);
    await fetchParamSelectQuery(tempQuery)
      .then((res) => {
        let totalValue = 0;
        res[0].map((a) => {
          totalValue = parseFloat(a.ClosingBalance) + totalValue;
        });
        setDataSource(
          [...res][0].map((res, idn) => {
            return { ...res, key: idn };
          })
        );
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
    <div className=" w-full   pr-1">
      <div className="shadow-lg">
        <div className="text-lg font-normal bg-primary-color px-4 py-1 text-white flex justify-between">
          <div> Cash and Bank Balance Summary</div>
          <div className="flex ">
            <DatePicker
              size={"small"}
              value={paramValues[1]}
              format={l_DateFormat.value1}
              onChange={(date, dateValue) => {
                setParamValues([CompCode, date]);
              }}
              allowClear={false}
            />
          </div>
        </div>
        <div className="bg-white max-h-44 h-44 overflow-auto style-2">
          {/* {dataSource.length > 0 &&
            dataSource[0].map((val) => {
              return (
                <div className="border-b border-primary-light border-solid">
                  <div className="px-4 py-1 flex justify-between">
                    <img
                      src={
                        val.PaymentType === "BANK"
                          ? ImgBank
                          : val.PaymentType === "WALLET"
                          ? IMG_WALLET
                          : val.PaymentType === "GATEWAY"
                          ? IMG_GATEWAY
                          : val.PaymentType === "CASH"
                          ? IMG_CASH
                          : val.PaymentType === "CHEQUE"
                          ? IMG_CHQ
                          : null
                      }
                      alt="icons"
                      className="w-4 h-4 mr-4 m-auto"
                    />
                    <div className="font-normal text-base text-right">
                      {val.PayDesc}
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-medium text-base text-primary-color">
                        {currency.value1}{" "}
                        {parseFloat(val.ClosingBalance)
                          ? parseFloat(val.ClosingBalance).toFixed(2)
                          : "0.00"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })} */}
          <Table
            dataSource={dataSource}
            pagination={false}
            columns={[
              {
                title: "",
                dataIndex: "PayCode",
                key: "PayCode",
                render: (text, val, index) => (
                  <img
                    src={
                      val.PaymentType === "BANK"
                        ? ImgBank
                        : val.PaymentType === "WALLET"
                        ? IMG_WALLET
                        : val.PaymentType === "GATEWAY"
                        ? IMG_GATEWAY
                        : val.PaymentType === "CASH"
                        ? IMG_CASH
                        : val.PaymentType === "CHEQUE"
                        ? IMG_CHQ
                        : val.PaymentType === "CARD"
                        ? IMG_CARD
                        : null
                    }
                    alt="icons"
                    className="w-4 h-4 mr-4 m-auto"
                  />
                ),
              },
              { title: "PayDesc", dataIndex: "PayDesc", align: "left" },
              {
                title: "Opening Bal",
                dataIndex: "OpeningBalance",
                align: "right",
                render: (text, val, index) => (
                  <>
                    <span className="font-medium text-base text-primary-color">
                      {currency.value1}{" "}
                      {parseFloat(val.OpeningBalance)
                        ? parseFloat(val.OpeningBalance).toFixed(2)
                        : "0.00"}
                    </span>
                  </>
                ),
              },
              {
                title: "Credit",
                dataIndex: "Credit",
                align: "right",
                render: (text, val, index) => (
                  <>
                    <span className="font-medium text-base text-primary-color">
                      {currency.value1}{" "}
                      {parseFloat(val.Credit)
                        ? parseFloat(val.Credit).toFixed(2)
                        : "0.00"}
                    </span>
                  </>
                ),
              },
              {
                title: "Debit",
                dataIndex: "Debit",
                align: "right",
                render: (text, val, index) => (
                  <>
                    <span className="font-medium text-base text-primary-color">
                      {currency.value1}{" "}
                      {parseFloat(val.Debit)
                        ? parseFloat(val.Debit).toFixed(2)
                        : "0.00"}
                    </span>
                  </>
                ),
              },
              {
                title: "Closing Bal",
                dataIndex: "ClosingBalance",
                align: "right",
                render: (text, val, index) => (
                  <>
                    <span className="font-medium text-base text-primary-color">
                      {currency.value1}{" "}
                      {parseFloat(val.ClosingBalance)
                        ? parseFloat(val.ClosingBalance).toFixed(2)
                        : "0.00"}
                    </span>
                  </>
                ),
              },
            ]}
          />
        </div>
        {/* <div className="flex justify-between px-4 py-2 rounded border border-solid border-primary-color bg-white">
          <div className="flex-1 flex justify-between">
            <div>Total Amount</div>
            <div className="font-medium text-primary-color">
              {currency.value1}{" "}
              {dataSource.length > 0 && parseFloat(dataSource[1])
                ? parseFloat(dataSource[1]).toFixed(2)
                : "0.00"}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CashAndBankBalanceSummary;
