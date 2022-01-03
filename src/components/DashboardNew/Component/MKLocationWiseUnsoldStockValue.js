import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker, Row, Col, Button, Tooltip } from "antd";
import moment from "moment";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import { ReloadOutlined } from "@ant-design/icons";

const MKLocationWiseUnsoldStockValue = (props) => {
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
      if (idx === 0) {
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
      })
      .catch((err) => {
        setDataSource([]);
        setIsLoading(false);
        return setError("error fetching data source data");
      });
  };

  return (
    <div className="dashboard-card" style={{ flex: 1 }}>
      <div
        style={{
          padding: "0px 5px",
          //   borderBottom: "1px solid #cecece",
          fontFamily: `'Cairo', sans-serif`,
          fontSize: 18,
          color: "#FFF",
          backgroundColor: "var(--app-theme-color)",
        }}
      >
        Unsold Stock Value
      </div>
      <Table
        dataSource={dataSource}
        pagination={false}
        rowKey="DeliveryStatus"
        columns={[
          {
            dataIndex: "DeliveryStatus",
            title: "Delivery Status",
            key: "DeliveryStatus",
          },
          {
            dataIndex: "EstimatedAmount",
            title: "Amount",
            key: "EstimatedAmount",
            align: "right",
            render: (text, record) => {
              return (
                <>
                  {currency.value1}{" "}
                  {(parseFloat(text) / l_DivisibleByN.value1).toFixed(2)}
                </>
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default MKLocationWiseUnsoldStockValue;
