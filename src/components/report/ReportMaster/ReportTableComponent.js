import React, { useState, useEffect, useRef } from "react";
import { Table, Avatar, Tooltip, Typography } from "antd";
import { fetchReportMaster } from "../../../services/report-master";
import _ from "lodash";
import moment from "moment";
import { useSelector } from "react-redux";

const { Text } = Typography;

const ReportTableComponent = (props) => {
  const [coloumnProperties, setColoumnProperties] = useState([]);
  const [data, setData] = useState([]);
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const table = useRef();
  useEffect(() => {
    groupData(props.colData);
  }, []);

  useEffect(() => {
    return setData(props.data);
  }, [props.data]);

  const groupData = (data) => {
    let reportMasterColData = [];
    var grouped = _.mapValues(_.groupBy(data, "ColumnParentName"), (x) =>
      x.map((y) => y)
    );

    Object.keys(grouped).map((key, index) => {
      if (key === "null") {
        reportMasterColData = [...reportMasterColData, ...grouped[key]];
      } else {
        var tempChildren = [];
        grouped[key].map((ii) => {
          return tempChildren.push({
            width: ii.ColumnWidth,
            title: ii.ColumnTitle,
            dataIndex: ii.ColumnName,
            key: ii.Id,
            align: ii.ColumnAlign,
          });
        });

        return (reportMasterColData = [
          ...reportMasterColData,
          {
            Id: grouped[key][0].Id,
            ColumnPosition: grouped[key][0].ColumnPosition,
            ColumnParentName: key,
            children: tempChildren,
            ColumnFixed: grouped[key][0].ColumnFixed,
            ColumnShowToolTip: "N",
          },
        ]);
      }
    });
    fetchColoumProperties(reportMasterColData);
  };

  const fetchColoumProperties = (data) => {
    let tempColoumn = [];
    let reportMasterColData = data.sort((a, b) =>
      a.ColumnPosition > b.ColumnPosition ? 1 : -1
    );
    for (const key in reportMasterColData) {
      tempColoumn.push({
        key: "key",
        dataIndex:
          reportMasterColData[key].ColumnParentName === null
            ? reportMasterColData[key].ColumnName
            : null,
        title:
          reportMasterColData[key].ColumnParentName === null
            ? reportMasterColData[key].ColumnTitle
            : reportMasterColData[key].ColumnParentName,
        sorter:
          reportMasterColData[key].ColumnAllowFilter === "Y"
            ? (a, b) => {
                return (
                  a[reportMasterColData[key].ColumnName].toString().length -
                  b[reportMasterColData[key].ColumnName].toString().length
                );
              }
            : null,
        fixed:
          reportMasterColData[key].ColumnFixed === "true"
            ? "right"
            : reportMasterColData[key].ColumnFixed === "left"
            ? "left"
            : reportMasterColData[key].ColumnFixed === "right"
            ? "right"
            : false,
        align: reportMasterColData[key].ColumnAlign,
        width: reportMasterColData[key].ColumnWidth,
        render: (value, record) => {
          if (reportMasterColData[key].ColumnDataType === "image") {
            return <Avatar shape="square" size="small" src={value} />;
          } else if (reportMasterColData[key].ColumnDataType === "boolean") {
            if (typeof (value === "object")) {
              if (value.data[0]) {
                return <i class="fa fa-circle font-success f-12"></i>;
              } else {
                return <i class="fa fa-circle font-danger f-12"></i>;
              }
            } else {
              if (value === "Y") {
                return <i class="fa fa-circle font-success f-12"></i>;
              } else {
                return <i class="fa fa-circle font-danger f-12"></i>;
              }
            }
          } else {
            return reportMasterColData[key].ColumnShowToolTip === "Y" ? (
              <Tooltip placement="topLeft" title={value}>
                {reportMasterColData[key].ColumnDataType === "date"
                  ? moment(value).format(l_ConfigDateFormat)
                  : value}
              </Tooltip>
            ) : (
              <>
                {reportMasterColData[key].ColumnDataType === "date"
                  ? moment(value).format(l_ConfigDateFormat)
                  : value}
              </>
            );
          }
        },
        children:
          reportMasterColData[key].ColumnParentName === null
            ? undefined
            : reportMasterColData[key].children,
      });
    }
    setColoumnProperties(tempColoumn);
  };
  return (
    <>
      <div ref={table}>
        <Table
          dataSource={data}
          columns={coloumnProperties}
          bordered={true}
          scroll={{ x: 400 }}
          size="small"
          pagination={false}
          summary={(pageData) => {
            // console.log(pageData);
            let summaryColWise = [...props.colData];
            if (pageData.length > 0) {
              for (let i = 0; i < summaryColWise.length; i++) {
                if (summaryColWise[i].ColumnShowSummary === "Y") {
                  pageData.forEach((pd) => {
                    if (
                      summaryColWise[i].ColumnSummaryType === "sum" ||
                      summaryColWise[i].ColumnSummaryType === "avg"
                    ) {
                      summaryColWise[i] = {
                        ...summaryColWise[i],
                        SummaryValue: _.isUndefined(
                          summaryColWise[i].SummaryValue
                        )
                          ? parseFloat(pd[summaryColWise[i].ColumnName])
                          : summaryColWise[i].SummaryValue +
                            parseFloat(pd[summaryColWise[i].ColumnName]),
                      };
                    } else if (summaryColWise[i].ColumnSummaryType === "min") {
                      summaryColWise[i] = {
                        ...summaryColWise[i],
                        SummaryValue: _.isUndefined(
                          summaryColWise[i].SummaryValue
                        )
                          ? parseFloat(pd[summaryColWise[i].ColumnName])
                          : summaryColWise[i].SummaryValue >
                            parseFloat(pd[summaryColWise[i].ColumnName])
                          ? parseFloat(pd[summaryColWise[i].ColumnName])
                          : summaryColWise[i].SummaryValue,
                      };
                    } else if (summaryColWise[i].ColumnSummaryType === "max") {
                      summaryColWise[i] = {
                        ...summaryColWise[i],
                        SummaryValue: _.isUndefined(
                          summaryColWise[i].SummaryValue
                        )
                          ? parseFloat(pd[summaryColWise[i].ColumnName])
                          : summaryColWise[i].SummaryValue <
                            parseFloat(pd[summaryColWise[i].ColumnName])
                          ? parseFloat(pd[summaryColWise[i].ColumnName])
                          : summaryColWise[i].SummaryValue,
                      };
                    } else if (
                      summaryColWise[i].ColumnSummaryType === "count"
                    ) {
                      summaryColWise[i] = {
                        ...summaryColWise[i],
                        SummaryValue: pageData.length,
                      };
                    }
                  });
                }
              }
              for (let i = 0; i < summaryColWise.length; i++) {
                if (
                  summaryColWise[i].ColumnShowSummary === "Y" &&
                  summaryColWise[i].ColumnSummaryType === "avg"
                ) {
                  // console.log("avg", summaryColWise[i].SummaryValue, count);
                  summaryColWise[i].SummaryValue =
                    summaryColWise[i].SummaryValue / pageData.length;
                }
              }
            }

            return pageData.length > 0 ? (
              <>
                <Table.Summary.Row>
                  {summaryColWise.map((col, i) => {
                    return (
                      <Table.Summary.Cell key={i}>
                        <div
                          style={{
                            textAlign: col.ColumnAlign
                              ? col.ColumnAlign
                              : "right",
                          }}
                        >
                          <Text strong>{`${
                            col.ColumnShowSummary === "Y" &&
                            col.ColumnSummaryType !== "sum"
                              ? "[" + col.ColumnSummaryType + "]"
                              : ""
                          } ${
                            col.SummaryValue ? col.SummaryValue.toFixed(2) : ""
                          }`}</Text>
                        </div>
                      </Table.Summary.Cell>
                    );
                  })}
                </Table.Summary.Row>
              </>
            ) : null;
          }}
        />
      </div>
      {/* <button
        onClick={() => {
          // console.log(table);
          // let newWin = window.open("");
          // table.current.print();
          // newWin.document.write(table.current.outerHTML);
          // newWin.print();
          // newWin.close();
        }}
      >
        print
      </button> */}
    </>
  );
};

export default ReportTableComponent;
