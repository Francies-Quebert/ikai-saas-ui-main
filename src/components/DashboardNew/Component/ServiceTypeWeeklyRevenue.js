import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import { ReloadOutlined } from "@ant-design/icons";

const ServiceTypeWeeklyRevenue = (props) => {
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

  useEffect(() => {
    return getInitialData();
  }, []);

  useEffect(() => {
    if (paramValues.length > 0) {
      getData(props.config.DashboardSource, paramValues);
    }
  }, [paramValues, props.refreshRequest, isRefresh]);

  useEffect(() => {
    let distinctServiceType = [];
    dataSource.forEach((row) => {
      if (
        !distinctServiceType.find(
          (distinct) => distinct === row.ServiceTypeTitle
        )
      ) {
        distinctServiceType.push(row.ServiceTypeTitle);
      }
    });

    let distinctWeek = [];
    dataSource.forEach((row) => {
      if (!distinctWeek.find((distinct) => distinct === row.weekNo)) {
        distinctWeek.push(row.weekNo);
      }
    });

    let tmpDataSource = [`Week`, ...distinctServiceType];
    let actualData = [tmpDataSource];
    distinctWeek.forEach((week) => {
      let tempvalue = [week];
      tmpDataSource.forEach((row) => {
        if (row !== "Week") {
          let sumValue = 0;
          dataSource
            .filter(
              (item) => item.weekNo === week && item.ServiceTypeTitle === row
            )
            .forEach((result) => (sumValue += parseFloat(result.NetValue)));
          tempvalue.push(sumValue);
        }
      });
      actualData.push(tempvalue);
    });

    setChartData(actualData);
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
        setDataSource([]);
        setIsLoading(false);
        return setError("error fetching data source data");
      });
  };

  return (
    <div
      className="dashboard-card"
      style={{
        padding: "0px 20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "7px 0px",
          // borderBottom: "1px solid #cecece",
          fontFamily: `'Cairo', sans-serif`,
          fontSize: 18,
          color: "rgb(65, 82, 125)",
        }}
      >
        Service Type Wise Revenue
      </div>
      <div style={{ flex: 1, padding: "8px 0px" }}>
        <Chart
          chartType="Bar"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{}}
          rootProps={{ "data-testid": 1 }}
        />
      </div>
    </div>
  );
};

export default ServiceTypeWeeklyRevenue;
