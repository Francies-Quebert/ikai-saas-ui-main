import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Radio,
  Select,
  Button,
  notification,
  Skeleton,
  Input,
  InputNumber,
} from "antd";
import {
  getRoundOffConfigData,
  UpdtRounOffConfig,
} from "../../../../services/round-off-config";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../../../store/actions/currentTran";
import Icon, { CheckOutlined, CloseOutlined } from "@ant-design/icons";
const { Option } = Select;
const labelColSpan = 2;
const TextColSpan = 4;

const RoundOffConfig = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setIsLoading(true);
    dispatch(setFormCaption(116));
    fetchRoundOffData();
  }, []);

  const fetchRoundOffData = () => {
    getRoundOffConfigData(CompCode).then((res) => {
      let tempData = [];
      res.forEach((element, idx) => {
        tempData.push({ ...element, key: idx, isDirty: false });
      });
      setData(tempData);
      setIsLoading(false);
    });
  };

  const roundOffType = [
    {
      Name: "Round-Off",
      Value: "R",
    },
    {
      Name: "Ceiling",
      Value: "C",
    },
    {
      Name: "Floor",
      Value: "F",
    },
  ];
  // const roundOffValue = [
  //   {
  //     Name: "0.5",
  //     Value: "0.5",
  //   },
  //   {
  //     Name: "1",
  //     Value: "1",
  //   },
  //   {
  //     Name: "5",
  //     Value: "5",
  //   },
  //   {
  //     Name: "10",
  //     Value: "10",
  //   },
  //   {
  //     Name: "50",
  //     Value: "50",
  //   },
  //   {
  //     Name: "100",
  //     Value: "100",
  //   },
  // ];

  return (
    <>
      {isLoading && (
        <Row style={{ height: 200 }} className="card-sales">
          <Skeleton active={isLoading} />
        </Row>
      )}
      {!isLoading &&
        data.length > 0 &&
        data.map((xx, inx) => {
          return (
            <>
              <Row
                key={xx.key}
                className="card-sales"
                style={{ minWidth: "100%", height: 63 }}
              >
                <Col
                  colSpan={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    minWidth: 120,
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, margin: 13 }}>
                    {xx.TransactionTypeDesc}
                  </div>
                </Col>
                <Col
                  colSpan={6}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    padding: 12,
                  }}
                >
                  <Radio.Group
                    defaultValue="Y"
                    value={xx.IsEnabled}
                    buttonStyle="solid"
                    onChange={(e) => {
                      console.log(e.target.value);
                      let tempData = [...data];
                      const findIndex = data.findIndex(
                        (aa) => aa.key === xx.key
                      );
                      tempData[findIndex].IsEnabled = e.target.value;
                      tempData[findIndex].isDirty = true;
                      setData(tempData);
                    }}
                  >
                    <Radio.Button value="Y">Enable</Radio.Button>
                    <Radio.Button value="N">Disable</Radio.Button>
                  </Radio.Group>
                  {/* <Switch
                  checkedChildren="Enable"
                  unCheckedChildren="Disable"
                  checked={xx.IsEnabled === "Y" ? true : false}
                  onChange={(e) => {
                    let tempData = [...data];
                    const findIndex = data.findIndex((aa) => aa.key === xx.key);
                    tempData[findIndex].IsEnabled = e === true ? "Y" : "N";
                    tempData[findIndex].isDirty = true;

                    setData(tempData);
                  }}
                /> */}
                </Col>
                <div
                  style={{
                    margin: "12px 0px",
                    border: "1px solid #d9d9d9",
                    backgroundColor: "var(--app-theme-color-secondary)",
                  }}
                >
                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      padding: "4px 0px",
                      width: 110,
                    }}
                  >
                    <p style={{ margin: 0, color: "#fff" }}>Type</p>
                  </Col>
                </div>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "12px 12px 12px 0px",
                    width: 125,
                  }}
                >
                  <Select
                    disabled={xx.IsEnabled === "N"}
                    style={{ width: "100%" }}
                    placeholder="Select Payment Type"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    value={xx.RoundType}
                    onChange={(val) => {
                      let tempData = [...data];
                      const findIndex = data.findIndex(
                        (aa) => aa.key === xx.key
                      );
                      tempData[findIndex].RoundType = val;
                      tempData[findIndex].isDirty = true;
                      setData(tempData);
                    }}
                  >
                    {roundOffType.length > 0 &&
                      roundOffType.map((xx, ii) => {
                        return (
                          <Option key={ii} value={xx.Value}>
                            {xx.Name}
                          </Option>
                        );
                      })}
                  </Select>
                </Col>
                <div
                  style={{
                    margin: "12px 0px",
                    border: "1px solid #d9d9d9",
                    backgroundColor: "var(--app-theme-color-secondary)",
                  }}
                >
                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      padding: "4px 0px",
                      width: 110,
                    }}
                  >
                    <p style={{ margin: 0, color: "#fff" }}>
                      {xx.RoundType === "R"
                        ? "Decimal Point"
                        : xx.RoundType === "C"
                        ? "Ceiling Value"
                        : xx.RoundType === "F"
                        ? "Floor Value"
                        : " "}
                    </p>
                  </Col>
                </div>

                <Col
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "12px 12px 12px 0px",
                    width: 125,
                  }}
                >
                  <Input
                    disabled={xx.IsEnabled === "N"}
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Enter Round-Off Value"
                    value={xx.RoundValue}
                    onChange={(e) => {
                      let tempData = [...data];
                      const findIndex = data.findIndex(
                        (aa) => aa.key === xx.key
                      );
                      if (e.target.value) {
                        tempData[findIndex].RoundValue = e.target.value;
                        tempData[findIndex].isDirty = true;
                        setData(tempData);
                      } else {
                        tempData[findIndex].RoundValue = 0;
                        tempData[findIndex].isDirty = true;
                        setData(tempData);
                      }
                    }}
                  />
                  {/* <Select
                    style={{ width: 150 }}
                    disabled={xx.IsEnabled === "N"}
                    style={{ width: "100%" }}
                    placeholder="Select Payment Type"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    value={parseFloat(xx.RoundValue)}
                    onChange={(val) => {
                      let tempData = [...data];
                      const findIndex = data.findIndex(
                        (aa) => aa.key === xx.key
                      );
                      tempData[findIndex].RoundValue = val;
                      tempData[findIndex].isDirty = true;

                      setData(tempData);
                    }}
                  > */}
                  {/* {roundOffValue.length > 0 &&
                      roundOffValue.map((xx, ii) => {
                        return (
                          <Option key={ii} value={xx.Value}>
                            {xx.Name}
                          </Option>
                        );
                      })}
                  </Select> */}
                </Col>

                <div style={{ margin: 0, padding: "11px 0px" }}>
                  <Col colSpan={6} style={{ display: "flex" }}>
                    <Button
                      icon={<CheckOutlined style={{ color: "#fff" }} />}
                      loading={isLoading}
                      // type="primary"
                      style={{
                        height: 33,
                        fontSize: "16px",
                        fontWeight: "600",
                        flex: 1,
                        width: "40px",
                        marginRight: 5,
                        backgroundColor: "#22af47",
                      }}
                      onClick={() => {
                        // onFinish();
                        setIsLoading(true);
                        if (data.length > 0) {
                          let tempData = data.find((aa) => aa.key === xx.key);
                          let finaldata = {
                            CompCode: tempData.CompCode,
                            ProjectType: tempData.ProjectType,
                            TransactionType: tempData.TransactionType,
                            IsEnabled: tempData.IsEnabled,
                            RoundValue: tempData.RoundValue,
                            RoundType: tempData.RoundType,
                            Updt_Usr: "saurav",
                          };
                          UpdtRounOffConfig(CompCode, finaldata).then((res) => {
                            // console.log(res, "donew");
                            if (res.message === "successful") {
                              notification.success({
                                message: "Data Saved",
                                description: "Data saved successfully!!!",
                              });
                              fetchRoundOffData();
                            }
                          });
                        }
                      }}
                    ></Button>
                    <Button
                      icon={<CloseOutlined style={{ color: "#fff" }} />}
                      // type="primary"
                      style={{
                        height: 33,
                        fontSize: "16px",
                        fontWeight: "600",
                        flex: 1,
                        width: "40px",
                        backgroundColor: "#ff5370",
                      }}
                      onClick={() => {
                        fetchRoundOffData();
                      }}
                    ></Button>
                  </Col>
                </div>
              </Row>
            </>
          );
        })}
    </>
  );
};

export default RoundOffConfig;
