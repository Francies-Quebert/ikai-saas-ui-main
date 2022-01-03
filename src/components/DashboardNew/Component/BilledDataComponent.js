import React, { useEffect, useState } from "react";
import { Typography, Col, Row, Divider } from "antd";
import Bill from "../../../assets/IconSVG/bill.png";
import { useSelector } from "react-redux";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import moment from "moment";

const { Title } = Typography;
const BilledDataComponent = (props) => {
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const appMainData = useSelector((state) => state.AppMain);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

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
        setDataSource();
        setIsLoading(false);
        return setError("error fetching data source data");
      });
  };
  return (
    <div
      className="dashboard-card"
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      {dataSource && dataSource.length > 0 && (
        <>
          <Row style={{ flex: 1 }}>
            <Col flex={1}>
              <div
                style={{
                  fontFamily: `'Cairo', sans-serif`,
                  padding: "15px 30px 0px",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Balance Deposit
              </div>
              <div
                style={{
                  padding: "10px 30px",
                  fontFamily: `'Montserrat', sans-serif`,
                }}
              >
                <Title style={{ color: "#41527d", fontSize: 16 }} level={2}>
                  {currency.value1}
                  {dataSource[0].BalanceDeposit
                    ? parseFloat(dataSource[0].BalanceDeposit).toFixed(2)
                    : 0.0}
                </Title>
              </div>
            </Col>
            <Col
              flex={1}
              style={{
                margin: "auto",
              }}
            >
              <img
                src={Bill}
                height="50px"
                width="40px"
                style={{
                  transform:
                    "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
                }}
              />
            </Col>
          </Row>

          <Row
            style={{
              backgroundColor: "#f8f9fa",
              padding: "10px 15px",
              flex: 1,
            }}
          >
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              style={{ padding: "0px 15px" }}
              className="bill-card"
            >
              <div
                style={{
                  fontFamily: `'Cairo', sans-serif`,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Amount Billed
              </div>
              <div
                style={{
                  padding: "10px 0px",
                  fontFamily: `'Montserrat', sans-serif`,
                  color: "#41527d",
                }}
              >
                <Title style={{ color: "#41527d", fontSize: 16 }} level={2}>
                  {currency.value1}
                  {dataSource[0].BilledAmount
                    ? parseFloat(dataSource[0].BilledAmount).toFixed(2)
                    : 0.0}
                </Title>
              </div>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              style={{ padding: "0px 15px" }}
              className="bill-card1"
            >
              <div
                style={{
                  fontFamily: `'Cairo', sans-serif`,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Amount Not Billed
              </div>
              <div
                style={{
                  padding: "10px 0px",
                  fontFamily: `'Montserrat', sans-serif`,
                  color: "#41527d",
                }}
              >
                <Title style={{ color: "#41527d", fontSize: 18 }} level={2}>
                  {currency.value1}
                  {dataSource[0].UnBilledAmount
                    ? parseFloat(dataSource[0].UnBilledAmount).toFixed(2)
                    : 0.0}
                </Title>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: `'Cairo', sans-serif`,
                  padding: "15px 30px 0px",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Outstanding
              </div>
              <div
                style={{
                  padding: "10px 30px",
                  fontFamily: `'Montserrat', sans-serif`,
                }}
              >
                <Title style={{ color: "#41527d", fontSize: 16 }} level={2}>
                  {currency.value1}
                  {dataSource[0].OutStanding
                    ? parseFloat(dataSource[0].OutStanding).toFixed(2)
                    : 0.0}
                </Title>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default BilledDataComponent;
