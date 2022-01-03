import React, { useState, useEffect } from "react";
import {
  DeleteTwoTone,
  PlusCircleOutlined,
  RetweetOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Input,
  Radio,
  Divider,
  Button,
  Select,
  Switch,
  Table,
  Modal,
  Empty,
  InputNumber,
  DatePicker,
  TimePicker,
  notification,
  message,
  Tooltip,
} from "antd";
import { useSelector } from "react-redux";
import CardHeader from "../../../common/CardHeader";
import AddAppRouteForm from "./AddAppRouteForm";
import FieldFilterSelectComponent from "./Component/FieldFilterSelectComponent";
import {
  fetchFilterFieldTypeDefination,
  getAppRouteDtl,
  insUpdtAppRoute,
} from "../../../../services/app-route";
import { fetchParamSelectQuery } from "../../../../services/report-master";
import { CheckDataKeysNew } from "../../../../shared/utility";
import moment from "moment";
import _ from "lodash";

const AppRouteCard = (props) => {
  const labelColSpan = 4;
  const TextColSpan = 14;
  const initialData = {
    RouteName: null,
    RouteSlug: null,
    RouteType: "F",
    Status: true,
  };
  const [mode, setMode] = useState();
  const [tableData, setTableData] = useState([]);
  const [prevData, setPrevData] = useState([]);
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [filterFieldTypeData, setFilterFieldTypeData] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const appMainData = useSelector((state) => state.AppMain);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_ConfigTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "TIMEFORMAT")
  );
  const l_ConfigDateTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTTMFORMAT")
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  useEffect(() => {
    setIsLoading(true);
    let tdata = [];
    const fetchData = async () => {
      try {
        await fetchFilterFieldTypeDefination(CompCode).then(
          async (filterRes) => {
            // console.log(res, "fecth");
            const filterFiledTypes = getData(filterRes);
            Promise.all(filterFiledTypes).then((res) => {
              setFilterFieldTypeData(res);
            });
          }
        );

        if (props.RouteId) {
          setTableDataLoading(true);
          await getAppRouteDtl(CompCode, props.RouteId).then((res) => {
            let tempData = [...tableData];
            const selectedData = getData(res);
            if (selectedData) {
              Promise.all(selectedData).then((sd) => {
                sd.map((aa) => {
                  tempData.push({
                    key: tempData.length + 1,
                    Id: aa.Id,
                    FieldType: aa.FieldType,
                    FieldTitle: aa.FieldTitle,
                    FieldValue: aa.FieldValue,
                    DataType: aa.DataType,
                    DataSource: aa.DataSource,
                    isDeleted: false,
                    IsDirty: false,
                  });
                });

                if (tempData.length > 0) {
                  tdata = [...tempData];
                  setTableData([...tempData]);
                  setPrevData([...tempData]);
                  setTableDataLoading(false);
                } else {
                  setTableData([]);
                  setPrevData([]);
                  setTableDataLoading(false);
                }
              });
            } else {
            }
          });
        }

        if (props.data) {
          let tempData = props.data;
          setFormData({
            RouteName: tempData.RouteName,
            RouteSlug: tempData.RouteSlug,
            Status: tempData.IsActive,
            // RouteType: tdata.length > 0 ? "F" : "P",
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    fetchData();
  }, []);

  const getData = (res) => {
    let tempData = [...res];
    if (tempData.length > 0) {
      let tData = tempData.map(async (element) => {
        if (element.DataSource && element.DataSource.split("|")[0] === "SP") {
          let param = element.DataSource.split("|")[1].match(/\(([^)]+)\)/)
            ? element.DataSource.split("|")[1]
                .match(/\(([^)]+)\)/)[1]
                .split(",")
            : undefined;

          let i = 0;
          for (i; i < (param && param.length); i++) {
            param[i] = await CheckDataKeysNew(appMainData, param[i]);
          }

          let tempParam = "";
          param.forEach((row, idx) => {
            if (idx <= 0) {
              tempParam += `'${row}'`;
            } else {
              tempParam += `,'${row}'`;
            }
          });

          let tempQuery = element.DataSource.split("|")[1].replace(
            /\((.+?)\)/g,
            "(" + tempParam + ")"
          );

          let data = await fetchParamSelectQuery(tempQuery).then((res) => {
            tempData = [
              ...tempData.filter((ii) => ii.key !== element.key),
              { ...element, DataSource: res[0] },
            ];
            return { ...element, DataSource: res[0] };
          });
          return data;
        } else if (
          element.DataSource &&
          element.DataSource.split("|")[0] === "FIXED"
        ) {
          let param_values = element.DataSource.split("|")[1];
          let paramDataSource = [];
          param_values.split("#").map((i) => {
            paramDataSource.push({
              ValueMember: i.split("~")[0],
              DisplayMember: i.split("~")[1],
            });
          });

          tempData = [
            ...tempData.filter((ii) => ii.key !== element.key),
            { ...element, DataSource: paramDataSource },
          ];

          return { ...element, DataSource: paramDataSource };
        } else {
          tempData = [
            ...tempData.filter((ii) => ii.key !== element.key),
            { ...element },
          ];
          return { ...element };
        }
      });

      return tData;
    }
  };

  const RouteFilter = () => {
    return (
      <Row className="header-title-promo" style={{ padding: "1px 0px" }}>
        <Col flex={1}>{mode !== "A" ? "Route Filter" : "Add Form"} </Col>
        {mode !== "A" && (
          <Col flex={1} style={{ textAlign: " end", marginTop: 2 }}>
            <a
              onClick={() => {
                setMode("A");
              }}
            >
              <i className="fa fa-plus-circle" style={{ fontSize: 18 }}></i>
            </a>
          </Col>
        )}
      </Row>
    );
  };

  const GenrateRouteSlug = (value) => {
    let slugText = value;
    let tempText;

    if (!_.includes([null, undefined, ""], slugText)) {
      tempText = slugText
        .replace(/[^-a-zA-Z0-9\s+]+/gi, "")
        .replace(/\s+/gi, "-")
        .toLowerCase();
    } else {
      message.error("To generate slug enter route name");
    }

    return tempText;
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <CardHeader title="App Route" />
          <Card bordered bodyStyle={{ padding: 5 }} loading={isLoading}>
            <Col>
              <Row style={{ display: "block" }}>
                <Col style={{ marginBottom: 5 }}>
                  <Row style={{}}>
                    <Col
                      style={{ alignSelf: "center", fontWeight: 500 }}
                      span={labelColSpan}
                    >
                      <span style={{ color: "red" }}>*</span> Route Name :
                    </Col>
                    <Col span={TextColSpan} style={{ display: "flex" }}>
                      <Input
                        allowClear
                        style={{ marginRight: 3 }}
                        value={formData.RouteName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            RouteName: e.target.value,
                          });
                        }}
                        placeholder="Enter Route Name"
                      />
                      <Tooltip placement="top" title={"Generate Route Slug"}>
                        <Button
                          type="primary"
                          icon={<SendOutlined />}
                          onClick={() => {
                            let slug = GenrateRouteSlug(formData.RouteName);
                            setFormData({ ...formData, RouteSlug: slug });
                          }}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
                <Col style={{ marginBottom: 5 }}>
                  <Row style={{}}>
                    <Col
                      span={labelColSpan}
                      style={{ alignSelf: "center", fontWeight: 500 }}
                    >
                      Route Slug :
                    </Col>
                    <Col span={TextColSpan}>
                      <Input
                        allowClear
                        placeholder="Enter Route Slug"
                        value={formData.RouteSlug}
                        onChange={(e) => {
                          let slugText = e.target.value;
                          let tempText = slugText
                            .replace(/[^-a-zA-Z0-9\s+]+/gi, "")
                            .replace(/\s+/gi, "-")
                            .toLowerCase();

                          setFormData({
                            ...formData,
                            RouteSlug: tempText,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col style={{ marginBottom: 5 }} className="">
                  <Row style={{}}>
                    <Col
                      span={labelColSpan}
                      style={{ alignSelf: "center", fontWeight: 500 }}
                    >
                      Route Type :
                    </Col>
                    <Col span={TextColSpan}>
                      <Select
                        allowClear
                        style={{ width: "100%" }}
                        value={formData.RouteType}
                        onChange={(val) => {
                          setFormData({
                            ...formData,
                            RouteType: val,
                          });
                        }}
                        placeholder="Select Route Type"
                      >
                        <Select.Option value="P">Page</Select.Option>
                        <Select.Option value="F">Filter</Select.Option>
                      </Select>
                    </Col>
                  </Row>
                </Col>
                <Col style={{ marginBottom: 5 }}>
                  <Row style={{}}>
                    <Col
                      span={labelColSpan}
                      style={{ alignSelf: "center", fontWeight: 500 }}
                    >
                      Status :
                    </Col>
                    <Col span={TextColSpan}>
                      <Switch
                        checkedChildren="Active"
                        unCheckedChildren="In-Active"
                        checked={formData.Status}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            Status: e,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col>
              <RouteFilter />
              <Row style={{ display: "flex" }}>
                <Col flex={1}>
                  {!isLoading &&
                    !tableDataLoading &&
                    tableData.filter((id) => id.isDeleted !== true).length <=
                      0 && <Empty />}
                  {!isLoading && (
                    <Card
                      loading={tableDataLoading}
                      bodyStyle={{ padding: 0 }}
                      bordered
                    >
                      {!tableDataLoading &&
                        tableData.length > 0 &&
                        tableData
                          .sort((a, b) =>
                            parseInt(a.key) > parseInt(b.key) ? 1 : -1
                          )
                          .filter((id) => id.isDeleted !== true)
                          .map((item, index) => {
                            let tempValue = _.includes(
                              [null, ""],
                              item.FieldValue
                            )
                              ? []
                              : _.split(item.FieldValue, "#");

                            return (
                              <Row
                                key={index}
                                style={{
                                  padding: "0px 5px",
                                  margin: "4px 0px",
                                }}
                              >
                                <Col
                                  span={8}
                                  style={{
                                    alignSelf: "center",
                                  }}
                                >
                                  {item.FieldTitle}:
                                </Col>
                                <Col
                                  span={15}
                                  style={{ display: "flex" }}
                                  flex="1 0 auto"
                                >
                                  {item.DataType === "select" && (
                                    <Select
                                      key={item.key}
                                      allowClear
                                      value={item.FieldValue}
                                      style={{ width: "100%" }}
                                      placeholder={`Select ${item.FieldTitle}`}
                                      onChange={(e) => {
                                        item.FieldValue = e;
                                        item.IsDirty = true;
                                        setTableData([
                                          ...tableData.filter(
                                            (ii) =>
                                              parseInt(ii.key) !==
                                              parseInt(item.key)
                                          ),
                                          item,
                                        ]);
                                      }}
                                    >
                                      {item.DataSource &&
                                        item.DataSource.map((i) => {
                                          return (
                                            <Select.Option
                                              key={i.ValueMember}
                                              value={i.ValueMember}
                                            >
                                              {i.DisplayMember}
                                            </Select.Option>
                                          );
                                        })}
                                    </Select>
                                  )}
                                  {item.DataType === "string" && (
                                    <Input
                                      defaultValue={item.FieldValue}
                                      style={{}}
                                      placeholder={`Enter ${item.FieldTitle}`}
                                      onChange={(e) => {
                                        item.FieldValue = e.target.value;
                                        item.IsDirty = true;
                                        setTableData([
                                          ...tableData.filter(
                                            (ii) =>
                                              parseInt(ii.key) !==
                                              parseInt(item.key)
                                          ),
                                          item,
                                        ]);
                                      }}
                                    />
                                  )}
                                  {item.DataType === "boolean" && (
                                    <Switch
                                      style={{ marginRight: 5, marginTop: 5 }}
                                      checked={item.FieldValue === "Y"}
                                      onChange={(val) => {
                                        item.FieldValue = val;
                                        item.IsDirty = true;
                                        setTableData([
                                          ...tableData.filter(
                                            (ii) =>
                                              parseInt(ii.key) !==
                                              parseInt(item.key)
                                          ),
                                          item,
                                        ]);
                                      }}
                                    />
                                  )}
                                  {item.DataType === "number" && (
                                    <InputNumber
                                      style={{ width: "100%" }}
                                      value={item.FieldValue}
                                      placeholder={`Enter ${item.FieldTitle}`}
                                      onChange={(e) => {
                                        item.FieldValue = e;
                                        item.IsDirty = true;

                                        setTableData([
                                          ...tableData.filter(
                                            (ii) =>
                                              parseInt(ii.key) !==
                                              parseInt(item.key)
                                          ),
                                          item,
                                        ]);
                                      }}
                                    />
                                  )}
                                  {item.DataType === "date" && (
                                    <DatePicker
                                      format={l_ConfigDateFormat.value1}
                                      value={item.FieldValue}
                                      onChange={(val) => {
                                        item.FieldValue = moment(val).format(
                                          l_ConfigDateFormat.value1
                                        );
                                        item.IsDirty = true;

                                        setTableData([
                                          ...tableData.filter(
                                            (ii) =>
                                              parseInt(ii.key) !==
                                              parseInt(item.key)
                                          ),
                                          item,
                                        ]);
                                      }}
                                    />
                                  )}
                                  {item.DataType === "time" && (
                                    <TimePicker
                                      value={item.FieldValue}
                                      format={l_ConfigTimeFormat.value1}
                                      onChange={(val) => {
                                        item.FieldValue = moment(val).format(
                                          l_ConfigTimeFormat.value1
                                        );
                                        item.IsDirty = true;
                                        setTableData([
                                          ...tableData.filter(
                                            (ii) =>
                                              parseInt(ii.key) !==
                                              parseInt(item.key)
                                          ),
                                          item,
                                        ]);
                                      }}
                                    />
                                  )}
                                  {item.DataType === "datetime" && (
                                    <DatePicker
                                      showTime
                                      value={item.FieldValue}
                                      format={l_ConfigDateTimeFormat.value1}
                                      onChange={(val) => {
                                        item.FieldValue = moment(val).format(
                                          l_ConfigDateTimeFormat.value1
                                        );
                                        item.IsDirty = true;
                                        setTableData([
                                          ...tableData.filter(
                                            (ii) =>
                                              parseInt(ii.key) !==
                                              parseInt(item.key)
                                          ),
                                          item,
                                        ]);
                                      }}
                                    />
                                  )}
                                  {item.DataType === "multiselect" && (
                                    <>
                                      <Select
                                        mode="multiple"
                                        value={tempValue}
                                        placeholder={`Select ${item.FieldTitle}`}
                                        style={{
                                          width: "100%",
                                          marginRight: 5,
                                        }}
                                        onChange={(val) => {
                                          let mode = "";
                                          if (val.length > 0) {
                                            val.map((value, index) => {
                                              return (mode += `${
                                                index > 0 ? "#" : ""
                                              }${value}`);
                                            });
                                          }

                                          item.FieldValue = mode;
                                          item.IsDirty = true;
                                          setTableData([
                                            ...tableData.filter(
                                              (ii) =>
                                                parseInt(ii.key) !==
                                                parseInt(item.key)
                                            ),
                                            item,
                                          ]);
                                        }}
                                      >
                                        {item.DataSource &&
                                          item.DataSource.map((rrr) => {
                                            return (
                                              <Select.Option
                                                key={rrr.ValueMember}
                                                value={rrr.ValueMember}
                                              >
                                                {rrr.DisplayMember}
                                              </Select.Option>
                                            );
                                          })}
                                      </Select>
                                    </>
                                  )}
                                  {item.DataType === "range" && (
                                    <>
                                      <Input
                                        defaultValue={
                                          item.FieldValue.split("#")[0]
                                        }
                                        style={{ marginRight: 5 }}
                                        placeholder={`Enter ${item.FieldTitle}`}
                                        onChange={(e) => {
                                          let value =
                                            item.FieldValue.split("#");
                                          value[0] = e.target.value;
                                          item.FieldValue = `${value[0]}#${value[1]}`;
                                          item.IsDirty = true;
                                          setTableData([
                                            ...tableData.filter(
                                              (ii) =>
                                                parseInt(ii.key) !==
                                                parseInt(item.key)
                                            ),
                                            item,
                                          ]);
                                        }}
                                      />
                                      <Input
                                        defaultValue={
                                          item.FieldValue.split("#")[1]
                                        }
                                        style={{}}
                                        placeholder={`Enter ${item.FieldTitle}`}
                                        onChange={(e) => {
                                          let value =
                                            item.FieldValue.split("#");
                                          value[1] = e.target.value;
                                          item.FieldValue = `${value[0]}#${value[1]}`;
                                          item.IsDirty = true;
                                          setTableData([
                                            ...tableData.filter(
                                              (ii) =>
                                                parseInt(ii.key) !==
                                                parseInt(item.key)
                                            ),
                                            item,
                                          ]);
                                        }}
                                      />
                                    </>
                                  )}
                                </Col>
                                <Col
                                  span={1}
                                  style={{
                                    paddingLeft: 5,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <a
                                    onClick={() => {
                                      item.isDeleted = true;
                                      item.IsDirty = true;
                                      setTableData([
                                        ...tableData.filter(
                                          (ii) =>
                                            parseInt(ii.key) !==
                                            parseInt(item.key)
                                        ),
                                        item,
                                      ]);
                                    }}
                                  >
                                    <DeleteTwoTone />
                                  </a>
                                </Col>
                              </Row>
                            );
                          })}
                    </Card>
                  )}
                </Col>
                {mode === "A" && (
                  <Modal
                    visible={mode === "A"}
                    onCancel={() => setMode()}
                    footer={null}
                    width={800}
                    bodyStyle={{ padding: 0 }}
                    destroyOnClose={true}
                  >
                    <FieldFilterSelectComponent
                      data={filterFieldTypeData}
                      selectType="radio"
                      onSetClick={(data) => {
                        if (data) {
                          setTableDataLoading(true);
                          let tempData = [...tableData];
                          let selectedData = [{ ...data }];
                          selectedData.map((aa) => {
                            tempData.push({
                              key: tempData.length + 1,
                              FieldType: aa.FieldType,
                              FieldTitle: aa.FieldTitle,
                              FieldValue: aa.DataType === "range" ? "#" : null,
                              DataType: aa.DataType,
                              DataSource: aa.DataSource,
                              isDeleted: false,
                              IsDirty: false,
                            });
                          });
                          console.log("#".split("#"));

                          if (tempData.length > 0) {
                            setTableData([...tempData]);
                            setTableDataLoading(false);
                          } else {
                            setTableData([]);
                            setTableDataLoading(false);
                          }
                          setMode();
                        }
                        // let tempData = [...tableData];

                        // props.onSaveClick(tempData);
                        // setSelectedData(tempData);
                      }}
                      onBackPress={() => setMode()}
                    />
                  </Modal>
                )}
                {/* {mode !== "A" ? (
                  <Col flex={1}>
                    <Table
                      pagination={false}
                      dataSource={tableData}
                      columns={[
                        {
                          title: "Field Type",
                          dataIndex: "FieldType",
                        },
                        {
                          title: "Data Type",
                          dataIndex: "dataType",
                        },
                        {
                          title: "Value 1",
                          dataIndex: "Value1",
                        },
                        {
                          title: "Value 2",
                          dataIndex: "Value2",
                        },
                      ]}
                    />
                  </Col>
                ) : (
                  <Col flex={1}>
                    <AddAppRouteForm
                      onSavePress={(data) => {
                        let tempData = [];
                        if (data) {
                        }
                        setMode();
                        console.log(data);
                      }}
                      onBackPress={() => {
                        setMode();
                      }}
                    />
                  </Col>
                )} */}
              </Row>
            </Col>
            <Col flex={1} style={{ marginTop: 3 }}>
              <Button
                type="primary"
                className="mr-1"
                loading={isLoading}
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setIsLoading(true);
                  let appRouteHdrData = {
                    CompCode: CompCode,
                    RouteId: props.RouteId ? props.RouteId : null,
                    RouteName: formData.RouteName,
                    RouteSlug: formData.RouteSlug,
                    IsActive: formData.Status,
                    UpdtUsr: l_loginUser,
                  };
                  let tempDtl = [];
                  tableData
                    .filter((row) => row.isDeleted === false)
                    .forEach((element, indx) => {
                      tempDtl.push({
                        Id: element.Id,
                        FieldType: element.FieldType,
                        FieldValue: element.FieldValue,
                        DataType: element.DataType,
                      });
                    });

                  let finalData = {
                    AppRouteHdr: appRouteHdrData,
                    AppRouteDtl: tempDtl,
                    AppRoutePrevDtlData: prevData,
                  };
                  if (
                    !_.includes(
                      [null, undefined, ""],
                      appRouteHdrData.RouteName
                    )
                  ) {
                    insUpdtAppRoute(finalData).then((res) => {
                      props.onSavePress();
                      notification.success({
                        message: "Data Saved Successfully!!!",
                      });
                      setIsLoading(false);
                    });
                  } else {
                    message.error("Enter required fields");
                    setIsLoading(false);
                  }
                }}
              >
                Save
              </Button>
              <Button
                type="ghost"
                loading={isLoading}
                icon={<RetweetOutlined />}
                onClick={() => {
                  props.onBackPress();
                }}
              >
                Back
              </Button>
            </Col>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AppRouteCard;
