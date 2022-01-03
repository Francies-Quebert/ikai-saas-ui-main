import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import { DatePicker, Row, Col, Button, Tooltip, Empty } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchParamSelectQuery } from "../../../../services/report-master";
import { CheckDataKeysNew } from "../../../../shared/utility";
import AppLoader from "../../../common/AppLoader";
import { ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const InventoryCategoryWiseRevenue = (props) => {
  const appMainData = useSelector((state) => state.AppMain);
  const l_DateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "DTFORMAT")
  );
  const [chartData, setChartData] = useState();
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
    let tmpDataSource = [[`Category`, "Amount"]];

    if (dataSource && dataSource.length > 0) {
      //   console.log("hari", dataSource);
      dataSource.map((ii) => {
        return tmpDataSource.push([ii.CatDesc, parseFloat(ii.Amount)]);
      });
      setChartData(tmpDataSource);
    } else {
      setChartData();
    }
  }, [dataSource]);

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
          <Col flex="1 1 200px">Category Wise Revenue</Col>
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
          <Col flex="0 1 220px">
            <RangePicker
              value={[paramValues[1], paramValues[2]]}
              size={"small"}
              //   format={"DD MMM YYYY"}
              format={l_DateFormat.value1}
              onChange={(dates) => {
                setParamValues([CompCode, ...dates]);
              }}
            />
          </Col>
        </Row>
      </div>
      <div style={{ flex: 1, padding: "8px 0px" }}>
        {isLoading && <AppLoader />}
        {!isLoading && chartData && chartData.length > 0 ? (
          <Chart
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={chartData}
            options={{
              // title: "My Daily Activities",
              // Just add this option
              is3D: true,
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

export default InventoryCategoryWiseRevenue;
