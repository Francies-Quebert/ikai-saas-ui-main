import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import { DatePicker, Row, Col, Button, Tooltip, Select, Empty } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchParamSelectQuery } from "../../../../services/report-master";
import { CheckDataKeysNew } from "../../../../shared/utility";
import AppLoader from "../../../common/AppLoader";
import { ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;

const InventoryDateWiseSalesAnalysis = (props) => {
  const appMainData = useSelector((state) => state.AppMain);
  const l_DateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "DTFORMAT")
  );
  const [chartData, setChartData] = useState([]);
  const [paramValues, setParamValues] = useState([]);
  const [dataSource, setDataSource] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    return getInitialData();
  }, []);

  useEffect(() => {
    if (paramValues.length > 0) {
      getData(props.config.DashboardSource, paramValues);
    }
  }, [paramValues, props.refreshRequest, isRefresh]);

  useEffect(() => {
    let tmpDataSource = [[`Day`, "Sales"]];
    // console.log(object)
    if (dataSource && dataSource.length > 0) {
      //   console.log("hari", dataSource);
      dataSource.map((ii) => {
        return tmpDataSource.push([
          moment(ii.VoucherDate).format("DD MMM"),
          parseFloat(ii.Amount),
        ]);
      });
      setChartData(tmpDataSource);
    } else {
      setChartData([]);
    }
  }, [dataSource]);

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
        tempParam += `,${row}`;
      }
    });

    let tempQuery = pDataSource.replace(/\((.+?)\)/g, "(" + tempParam + ")");
    setIsLoading(true);
    // console.log("ddd", tempQuery);
    await fetchParamSelectQuery(tempQuery)
      .then((res) => {
        setDataSource(res[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        setDataSource();
        setIsLoading(false);
        return setError("error fetching data source data");
      });
  };

  return (
    <div
      className="dashboard-card"
      style={{
        padding: "0px 8px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "2px 0px",
          borderBottom: "1px solid #cecece",
          fontFamily: `'Cairo', sans-serif`,
          fontSize: 18,
          color: "rgb(65, 82, 125)",
        }}
      >
        <Row>
          <Col flex="1 1 200px">Sales Analysis</Col>
          <Col flex="0 1 30px">
            <Tooltip title="Refresh">
              <Button
                type="dashed"
                shape="circle"
                size={"small"}
                icon={<ReloadOutlined />}
                onClick={() => {
                  setIsRefresh(!isRefresh);
                }}
              />
            </Tooltip>
          </Col>
          <Col flex="0 1 110px">
            <Select
              value={parseInt(paramValues[1]) ? parseInt(paramValues[1]) : 1}
              style={{ width: 100 }}
              size={"small"}
              onChange={(vvv) => {
                setParamValues([]);
                setParamValues([CompCode, vvv]);
              }}
            >
              <Option value={1}>1 Day</Option>
              <Option value={7}>7 Days</Option>
              <Option value={15}>15 Days</Option>
              <Option value={30}>30 Days</Option>
            </Select>
          </Col>
        </Row>
      </div>
      <div style={{ flex: 1, padding: "8px 0px" }}>
        {isLoading && <AppLoader />}
        {!isLoading && chartData && chartData.length > 0 ? (
          <Chart
            chartType="ComboChart"
            loader={<div>Loading Chart</div>}
            chartArea={{ width: "100%" }}
            data={chartData}
            options={{
              // title: 'Monthly Coffee Production by Country',
              vAxis: { title: "Sales" },
              hAxis: { title: "Day" },
              seriesType: "bars",
              series: { 5: { type: "line" } },
            }}
            rootProps={{ "data-testid": "2" }}
          />
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default InventoryDateWiseSalesAnalysis;
