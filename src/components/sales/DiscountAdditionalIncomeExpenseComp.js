import React, { useState, useEffect } from "react";
import {
  Tabs,
  Radio,
  Button,
  InputNumber,
  Table,
  Input,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import _ from "lodash";
import { DeleteOutlined, FallOutlined, RiseOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const DiscountAdditionalIncomeExpenseComp = (props) => {
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const [discountType, setDiscountType] = useState({ type: "F", value: null });
  const [TableData, setTableData] = useState([
    { key: 1, reason: null, amount: null, IEtype: "I", IsDeleted: false },
  ]);
  const [ActiveTab, setActiveTab] = useState("1");
  useEffect(() => {
    if (props.type === "DISC") {
      setActiveTab("1");
    } else {
      setActiveTab("2");
    }
    if (props.discount !== null) {
      // console.log(props.discount, "props.discount.discount");
      setDiscountType({ ...props.discount });
    }
    if (props.addIncomeExpense.length > 0) {
      // console.log(props.addIncomeExpense, "propsaddIncomeExpense");
      setTableData([...props.addIncomeExpense]);
    }

    return () => {};
  }, []);
  return (
    <div style={{ border: "1px solid var(--app-theme-color)" }}>
      {/* <div style={{ display: "flex" }}>
        <div style={{}}>Discount</div>
        <div>Additional Income and Expense</div>
      </div> */}
      <Tabs
        // defaultActiveKey="1"
        // type="card"
        onChange={(e) => {
          setActiveTab(e);
        }}
        activeKey={ActiveTab}
        size={"small"}
        tabBarStyle={{ marginBottom: 0, padding: "0px 10px" }}
      >
        {/* <TabPane tab="Discount" key="1">
          <div
            style={{
              border: "1px solid var(--app-theme-color",
              padding: "10px",
              display: "flex",
            }}
          >
            <Radio.Group
              value={discountType.type}
              buttonStyle="solid"
              style={{ marginRight: 5 }}
              onChange={(e) => {
                setDiscountType({ ...discountType, type: e.target.value });
                // console.log(e.target.value);
              }}
            >
              <Radio.Button value="F">{currency.value1}</Radio.Button>
              <Radio.Button value="P">%</Radio.Button>
            </Radio.Group>
            <InputNumber
              className="bill-input"
              placeholder="Discount Value"
              style={{ flex: 1 }}
              onChange={(e) => {
                setDiscountType({ ...discountType, value: e });
              }}
              value={discountType.value}
              max={discountType.type === "P" ? 100 : undefined}
              min={0}
              // precision={discountType.type === "P" ? 2 : undefined}
              precision={3}
            />
          </div>
        </TabPane> */}
        <TabPane tab="Income And Expenses" key="2">
          <div style={{ border: "1px solid var(--app-theme-color" }}>
            <Table
              className="primary-color-head"
              dataSource={TableData.filter((aa) => aa.IsDeleted === false)}
              rowKey="key"
              pagination={false}
              columns={[
                {
                  title: "Reason",
                  dataIndex: "reason",
                  render: (text, record) => {
                    return (
                      <div style={{ display: "flex" }}>
                        <Input
                          defaultValue={record.reason}
                          placeholder="Enter Reason"
                          onBlur={(e) => {
                            // console.log(e.target.value);
                            let tempIndex = TableData.findIndex(
                              (aa) => aa.key === record.key
                            );
                            if (tempIndex >= 0) {
                              TableData[tempIndex].reason = e.target.value;
                            }
                          }}
                        />
                        <Radio.Group
                          defaultValue={record.IEtype}
                          optionType="button"
                          style={{ width: 140 }}
                          onChange={(e) => {
                            // console.log(e.target.value);
                            let tempIndex = TableData.findIndex(
                              (aa) => aa.key === record.key
                            );
                            if (tempIndex >= 0) {
                              TableData[tempIndex].IEtype = e.target.value;
                            }
                          }}
                        >
                          <Radio.Button value="I">
                            <RiseOutlined style={{ color: "darkgreen" }} />
                          </Radio.Button>
                          <Radio.Button value="E">
                            <FallOutlined style={{ color: "red" }} />
                          </Radio.Button>
                        </Radio.Group>
                      </div>
                    );
                  },
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  width: 200,
                  render: (text, record) => {
                    return (
                      <InputNumber
                        defaultValue={record.amount}
                        placeholder="Amount"
                        style={{ width: "100%" }}
                        className="bill-input"
                        onBlur={(e) => {
                          // console.log(e.target.value);
                          let tempIndex = TableData.findIndex(
                            (aa) => aa.key === record.key
                          );
                          if (tempIndex >= 0) {
                            TableData[tempIndex].amount = e.target.value;
                          }
                        }}
                      />
                    );
                  },
                },
                {
                  title: "",
                  dataIndex: "x",
                  render: (text, record) => {
                    return (
                      <>
                        <Button
                          onClick={() => {
                            let tempIndex = TableData.findIndex(
                              (aa) => aa.key === record.key
                            );
                            if (tempIndex >= 0) {
                              TableData[tempIndex].IsDeleted = true;
                              setTableData([...TableData]);
                            }
                          }}
                          icon={<DeleteOutlined />}
                          shape="circle"
                          size="small"
                          type="primary"
                        />
                      </>
                    );
                  },
                },
              ]}
              style={
                {
                  // borderBottom: "1px solid var(--app-theme-color)",
                }
              }
            />
            <Button
              type="dashed"
              style={{ width: "100%", margin: "2px 4px" }}
              onClick={() => {
                if (
                  TableData.filter(
                    (aa) =>
                      (_.includes([null, undefined, ""], aa.reason) ||
                        _.includes([null, undefined, "", 0], aa.amount)) &&
                      aa.IsDeleted === false
                  ).length > 0
                ) {
                  notification.error({
                    message: "Invalid Input",
                    description: "Some of ur Field are Empty",
                  });
                } else {
                  setTableData([
                    ...TableData,
                    {
                      key: TableData.length + 1,
                      reason: null,
                      IEtype: "I",
                      amount: null,
                      IsDeleted: false,
                    },
                  ]);
                }
              }}
            >
              Add New Row
            </Button>
          </div>
        </TabPane>
      </Tabs>
      <div style={{ textAlign: "end", padding: "2px" }}>
        <Button
          type="primary"
          style={{ marginRight: 5 }}
          onClick={() => {
            props.onBackPress();
          }}
        >
          Back
        </Button>
        <Button
          type="primary"
          onClick={() => {
            let discount = discountType;
            let IncomeExpense = TableData.filter(
              (aa) =>
                !_.includes([null, "", undefined], aa.reason) &&
                !_.includes([null, "", undefined], aa.amount) &&
                aa.IsDeleted === false
            );
            const data = { discount, IncomeExpense };
            // console.log(data);
            props.onSaveClick(data);
            props.onBackPress();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default DiscountAdditionalIncomeExpenseComp;
