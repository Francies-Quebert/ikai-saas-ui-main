import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import { Input, Button } from "antd";
import _ from "lodash";

const ReportComponentGoogleChart = (props) => {
  const [chartData, setChartData] = useState();

  React.useEffect(() => {

    let dataSource = [];
    if (props.data && props.data.length > 0) {
      //Set Header
      let hdr = [];
      props.config.ChartDtl.forEach((hh) => {
        hdr = [...hdr, hh.ColumnTitle];
      });
      dataSource.push(hdr);

      //Add rows
      props.data.forEach((row) => {
        let dtl = [];
        props.config.ChartDtl.forEach((hh) => {
          dtl = [
            ...dtl,
            hh.ColumnDataType === "decimal"
              ? parseFloat(row[hh.ColumnName])
              : hh.ColumnDataType === "integer"
              ? parseInt(row[hh.ColumnName])
              : row[hh.ColumnName],
          ];
        });
        let rrrr = dataSource.findIndex((ii) => ii[0] === dtl[0]);
        if (rrrr >= 0) {
          let tmp = [];
          for (var index = 0; index < dtl.length; index++) {
            tmp.push(
              _.isNumber(dtl[index])
                ? dataSource[rrrr][index] + dtl[index]
                : dtl[index]
            );
          }
          dataSource[rrrr] = tmp;
        } else {
          dataSource.push(dtl);
        }
      });
      setChartData(dataSource);
    }
  }, []);

  return (
    <div>
      <Chart
        width={
          props.config.ChartHdr.ChartWidth === 0
            ? "100%"
            : `${props.config.ChartHdr.ChartWidth}px`
        }
        height={
          props.config.ChartHdr.ChartHeight === 0
            ? "100%"
            : `${props.config.ChartHdr.ChartHeight}px`
        }

        chartType={props.config.ChartHdr.ChartType}
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          title: props.config.ChartHdr.ChartTitle,
        }}
        rootProps={{ "data-testid": props.config.ChartHdr.ChartId }}
      />
    </div>
  );
};

export default ReportComponentGoogleChart;
