import React, { useState, useEffect } from "react";
import { MehOutlined, MobileOutlined } from "@ant-design/icons";
import { Typography, Divider, Col, Row } from "antd";
import Mobile from "../../../assets/IconSVG/mobile-icon.png";
import Computer from "../../../assets/IconSVG/computer-icon.png";
import { useSelector } from "react-redux";
import { fetchParamSelectQuery } from "../../../services/report-master";
import { CheckDataKeysNew } from "../../../shared/utility";
import AppLoader from "../../common/AppLoader";
import moment from "moment";

const { Title } = Typography;

const ComponentCustomerCount = (props) => {
  const appMainData = useSelector((state) => state.AppMain);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

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
      if (idx <= 0) {
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
    <>
      {dataSource ? (
        <div
          className="dashboard-card"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              padding: "6px 20px",
              borderBottom: "1px solid #cecece",
              fontFamily: `'Cairo', sans-serif`,
              fontSize: 18,
              color: "rgb(65, 82, 125)",
            }}
          >
            {/* <Title
              style={{
                margin: 0,
                padding: "0px 20px",
                color: "rgb(65, 82, 125)",
              }}
              level={4}
            > */}
            {props.config.DashboardName}
            {/* </Title> */}
            {/* <div
              className="card-small-header"
              style={{
                padding: "5px 20px",
                borderTop: "1px solid #fb8a2d",
                borderBottom: "1px solid #fb8a2d",
                color: "rgba(0, 0, 0, 0.8)",
              }}
            >
              This Week  
            </div> */}
          </div>
          <Row style={{ margin: "5px 0px 0px", flex: 1 }}>
            <div
              style={{
                textAlign: "center",
                fontWeight: "500",
                display: "block",
                flex: "0 0 100%",
                maxWidth: "100%",
                marginBottom: 0,
                color: "rgb(65, 82, 125)",
                fontSize: 16,
                fontFamily: `'Montserrat', sans-serif`,
              }}
            >
              {`${
                parseInt(
                  dataSource[0].CustomAppUser ? dataSource[0].CustomAppUser : 0
                ) +
                parseInt(
                  dataSource[0].CustomNonAppUser
                    ? dataSource[0].CustomNonAppUser
                    : 0
                )
              } `}
              Customer's
            </div>
            <Col
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              sm={24}
              xs={24}
              style={{
                padding: "0px 15px",
                margin: "auto 0px",
                fontFamily: `'Cairo', sans-serif`,
                display: "flex",
                flex: 1,
              }}
            >
              <img
                style={{
                  fontSize: 17,
                  flex: 0.3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 15,
                  maxWidth: 45,
                  height: 40,
                }}
                src={Mobile}
              />
              <div
                style={{
                  flex: 1,
                  margin: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                  }}
                >
                  Mobile App Users
                </div>
                <div
                  style={{
                    color: "rgb(65, 82, 125)",
                    fontWeight: "600",
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                >
                  {dataSource[0].CustomAppUser
                    ? dataSource[0].CustomAppUser
                    : 0}{" "}
                  Customer
                </div>
              </div>
            </Col>
            <Col
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              sm={24}
              xs={24}
              style={{
                padding: "0px 15px",
                fontFamily: `'Cairo', sans-serif`,
                display: "flex",
                flex: 1,
              }}
            >
              <img
                style={{
                  fontSize: 17,
                  flex: 0.3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 15,
                  maxWidth: 45,
                  height: 47,
                }}
                src={Computer}
              />
              <div
                style={{
                  flex: 1,
                  margin: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                  }}
                >
                  Other Users
                </div>
                <div
                  style={{
                    color: "rgb(65, 82, 125)",
                    fontWeight: "600",
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                >
                  {dataSource[0].CustomNonAppUser
                    ? dataSource[0].CustomNonAppUser
                    : 0}{" "}
                  Customer's
                </div>
              </div>
            </Col>

            <Col
              xxl={24}
              xl={24}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{
                padding: "0px 20px",
                borderBottom: "1px solid #ececec",
                borderTop: "1px solid #ececec",
                fontFamily: `'Cairo', sans-serif`,
                display: "flex",
              }}
            >
              <div
                className="card-small-header"
                style={{
                  padding: "0px 0px",
                  color: "rgb(65, 82, 125)",
                  textAlign: "center",
                  fontWeight: "600",
                  fontFamily: `'Cairo', sans-serif`,

                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                This Week
              </div>
            </Col>
            <div
              style={{
                textAlign: "center",
                fontWeight: "500",
                display: "block",
                flex: "0 0 100%",
                maxWidth: "100%",
                marginTop: 5,
                color: "rgb(65, 82, 125)",
                fontSize: 16,
                fontFamily: `'Montserrat', sans-serif`,
              }}
            >
              {`${
                parseInt(
                  dataSource[0].AppUserTotal ? dataSource[0].AppUserTotal : 0
                ) +
                parseInt(
                  dataSource[0].NonAppTotal ? dataSource[0].NonAppTotal : 0
                )
              } `}
              Customer's
            </div>
            <Col
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              sm={24}
              xs={24}
              style={{
                padding: "0px 15px",
                margin: "auto 0px",
                fontFamily: `'Cairo', sans-serif`,
                display: "flex",
                flex: 1,
              }}
            >
              <img
                style={{
                  fontSize: 17,
                  flex: 0.3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 15,
                  maxWidth: 45,
                  height: 40,
                }}
                src={Mobile}
              />
              <div
                style={{
                  flex: 1,
                  margin: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                  }}
                >
                  Mobile App Users
                </div>
                <div
                  style={{
                    color: "rgb(65, 82, 125)",
                    fontWeight: "600",
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                >
                  {`${parseInt(
                    dataSource[0].AppUserTotal ? dataSource[0].AppUserTotal : 0
                  )} `}
                  Customer's
                </div>
              </div>
            </Col>
            <Col
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              sm={24}
              xs={24}
              style={{ padding: "0px 15px", fontFamily: `'Cairo', sans-serif` }}
            >
              <div style={{ display: "flex" }}>
                <img
                  style={{
                    fontSize: 17,
                    flex: 0.3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 15,
                    maxWidth: 45,
                    height: 47,
                  }}
                  src={Computer}
                />
                <div
                  style={{
                    flex: 1,
                    margin: "auto",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                    }}
                  >
                    Other Users
                  </div>
                  <div
                    style={{
                      color: "rgb(65, 82, 125)",
                      fontWeight: "600",
                      fontSize: 15,
                      lineHeight: 1.4,
                    }}
                  >
                    {dataSource[0].NonAppTotal ? dataSource[0].NonAppTotal : 0}{" "}
                    Customer's
                  </div>
                </div>
              </div>
            </Col>
            <Col
              xxl={24}
              xl={24}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{
                padding: "0px 20px",
                // borderBottom: "1px solid #fb8a2d",
                borderTop: "1px solid #ececec",
                display: "flex",
              }}
            >
              <div
                className="card-small-header"
                style={{
                  padding: "0px 0px",
                  color: "rgb(65, 82, 125)",
                  textAlign: "center",
                  fontWeight: "600",
                  fontFamily: `'Cairo', sans-serif`,
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Total
              </div>
            </Col>
          </Row>
        </div>
      ) : null}
    </>
  );
};

export default ComponentCustomerCount;
