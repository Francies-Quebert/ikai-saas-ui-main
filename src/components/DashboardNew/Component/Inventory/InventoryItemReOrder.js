import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import { DatePicker, Row, Col, Button, Tooltip, Select, Table } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchParamSelectQuery } from "../../../../services/report-master";
import { CheckDataKeysNew } from "../../../../shared/utility";
import AppLoader from "../../../common/AppLoader";
import { ReloadOutlined } from "@ant-design/icons";

const InventoryItemReOrder = (props) => {
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

    await fetchParamSelectQuery(tempQuery)
      .then((res) => {
        setDataSource(
          res[0].map((xx, xxx) => {
            return { ...xx, key: xxx };
          })
        );
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
          <Col flex="1 1 200px">Item Re-Order</Col>
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
          {/* <Col flex="0 1 110px">
            <Select
              value={parseInt(paramValues[1])}
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
          </Col> */}
        </Row>
      </div>
      <div
        className=" max-h-44 h-44 overflow-auto style-2"
        style={{ flex: 1, padding: "8px 0px" }}
      >
        {isLoading && <AppLoader />}
        {!isLoading && (
          <Table
            // scroll={{ y: 200 }}
            className="custom-table-scroll style-3"
            // style={{ height: 150 }}
            columns={[
              {
                title: "Rank",
                dataIndex: "ItemCode",
                key: "ItemCode",
                render: (text, record, index) => <b># {index + 1}</b>,
              },
              {
                title: "Product Name (SKU)",
                dataIndex: "ItemName",
                key: "ItemName",
                align: "left",
              },
              {
                title: "Curr Qty",
                dataIndex: "CSTOCK_QTY",
                key: "CSTOCK_QTY",
                align: "right",
              },
              {
                title: "MBQ",
                dataIndex: "MBQ",
                key: "MBQ",
                align: "right",
                render: (text, record, index) => (
                  //   <b>{parseFloat(text) ? parseFloat(text) : null}</b>
                  <b>{text}</b>
                ),
              },
            ]}
            dataSource={dataSource}
            pagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryItemReOrder;
