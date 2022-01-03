import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDataReciepts,
  InsBillSettlemet,
} from "../../../../services/cust-outstanding";
import {
  Card,
  Typography,
  Button,
  Empty,
  Table,
  Modal,
  Descriptions,
  Divider,
  Input,
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import moment from "moment";
import {
  DeleteTwoTone,
  PlusCircleOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import _ from "lodash";
import AppLoader from "../../../common/AppLoader";
import swal from "sweetalert";
import { toast } from "react-toastify";

const Settlement = (props) => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const currentTran = useSelector((state) => state.currentTran);
  const [selectedRow, setSelectedRow] = useState([]);
  const [recieptData, setRecieptData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [showReciepts, setShowReciept] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableAdd, setDisableAdd] = useState(false);
  const [reRenderRequired, setReRenderRequired] = useState(false);
  const l_LoginUserInfo = useSelector((state) => state.LoginReducer.userData);

  useEffect(() => {
    // console.log("re-render");
  }, [reRenderRequired]);

  useEffect(() => {
    setIsLoading(true);
    getDataReciepts(props.data.CustId).then((res) => {
      setRecieptData(res);
      let l_SelectedRow = [];
      let l_RemainingAmount = props.data.BalanceAmount;
      // let l_
      res.forEach((row) => {
        if (
          parseFloat(row.BalAmount) >= l_RemainingAmount &&
          l_RemainingAmount > 0
        ) {
          l_SelectedRow.push({ ...row, SettlementAmount: l_RemainingAmount });
          l_RemainingAmount -= l_RemainingAmount;
        } else if (l_RemainingAmount > 0) {
          l_SelectedRow.push({
            ...row,
            SettlementAmount: parseFloat(row.BalAmount),
          });
          l_RemainingAmount -= parseFloat(row.BalAmount);
        }
      });
      setSelectedRow(l_SelectedRow);

      setIsLoading(false);
    });
  }, []);

  const columns = [
    {
      title: "Receipt No.",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{record.ReceiptNo}</Text>
          </>
        );
      },
    },
    {
      title: "Receipt Date",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>
              {moment(record.ReceiptDate).format(l_ConfigDateFormat.value1)}
            </Text>
          </>
        );
      },
    },
    {
      title: "Remark",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Input
              onChange={(e) => {
                record.Remark = e.target.value;
                setReRenderRequired(!reRenderRequired);
              }}
            />
          </>
        );
      },
    },
    {
      title: "Receipt Balance",
      width: 180,
      align: "right",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseFloat(record.BalAmount).toFixed(2)}</Text>
          </>
        );
      },
    },
    {
      title: "Adjustment Amount",
      width: 200,
      align: "right",
      render: (value, record, index) => {
        return (
          <>
            <InputNumber
              className="skyelient-number"
              // step={0.01}
              precision={2}
              // min={0}
              // formatter={val => {return val}}
              // max={parseInt(record.BalAmount)}
              style={{ textAlign: "right", width: 180 }}
              placeholder="Settlement Smount"
              defaultValue={record.SettlementAmount}
              // value={record.SettlementAmount}
              onChange={(e) => {
                record.SettlementAmount = e;
                setReRenderRequired(!reRenderRequired);
              }}
              onBlur={(e) => {
                // if (parseFloat(record.BalAmount) < e.target.value) {
                //   alert(
                //     "Settlement amount can't be greter than receipt balance amount...!"
                //   );
                //   record.SettlementAmount = record.BalAmount;
                // } else if (e.target.value < 0) {
                //   alert("Settlement amount can't be less than zero...!");
                //   record.SettlementAmount = 0;
                // } else {
                //   record.SettlementAmount = e.target.value;
                // }
                // e.target.value = record.SettlementAmount;
                setReRenderRequired(!reRenderRequired);
              }}
            />
          </>
        );
      },
    },
    {
      title: " ",
      key: "x",
      width: 80,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Popconfirm
              title="Are you sure delete ?"
              onConfirm={() => {
                setSelectedRow([
                  ...selectedRow.filter(
                    (rr) => rr.ReceiptId !== record.ReceiptId
                  ),
                ]);
                setReRenderRequired(!reRenderRequired);
                // record.isDeleted = true;
                // handleDelete(record);
              }}
              okText="Yes"
              cancelText="No"
            >
              <a>
                <DeleteTwoTone />
              </a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const recieptColumns = [
    {
      title: "Receipt No.",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{record.ReceiptNo}</Text>
          </>
        );
      },
    },
    {
      title: "Receipt Date",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>
              {moment(record.ReceiptDate).format(l_ConfigDateFormat.value1)}
            </Text>
          </>
        );
      },
    },
    {
      title: "Remark",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{record.ReceiptRemark}</Text>
          </>
        );
      },
    },
    {
      title: "Balance Adjustment Amount",
      width: 200,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseFloat(record.BalAmount).toFixed(2)}</Text>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {isLoading && <AppLoader />}
      {!isLoading && (
        <>
          <CardHeader title={currentTran.formTitle} />
          <Card bodyStyle={{ padding: 10 }}>
            <Card bodyStyle={{ padding: 0 }}>
              <Descriptions
                style={{ backgroundColor: "#fff" }}
                size="middle"
                bordered={true}
              >
                <Descriptions.Item style={{}} span={2} label="Invoice No.">
                  <Text style={{ fontWeight: "600" }}>
                    {props.data.InvoiceNo}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Invoice Date">
                  {moment(props.data.InvoiceDate).format(
                    l_ConfigDateFormat.value1
                  )}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Customer">
                  {props.data.Name} ({props.data.mobile})
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Settlement Amount">
                  {props.data.SettlementAmount}
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Invoice Amount">
                  {props.data.InvoiceAmount}
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Balance Settlement Amount">
                  <Text style={{ fontWeight: "600" }}>
                    {props.data.BalanceAmount}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Card bodyStyle={{ marginTop: 10, padding: 0 }} bordered={false}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                style={{ marginBottom: 5 }}
                onClick={() => {
                  setShowReciept(true);
                }}
              >
                Add
              </Button>

              <Modal
                closable={true}
                visible={showReciepts}
                onCancel={() => {
                  setShowReciept(false);
                }}
                footer={null}
                width={800}
                bodyStyle={{ padding: "5px 5px" }}
                destroyOnClose={true}
                title="Add Reciept"
              >
                {recieptData.length > 0 ? (
                  <Table
                    columns={recieptColumns}
                    bordered={true}
                    rowSelection={{
                      type: "checkbox",
                      onChange: (selectedRowKeys, selectedRows) => {
                        setTempData(selectedRows);
                      },
                      getCheckboxProps: (record) => ({
                        disabled:
                          selectedRow && selectedRow.length > 0
                            ? selectedRow.filter(
                                (ii) => ii.ReceiptId === record.ReceiptId
                              )[0] &&
                              selectedRow.filter(
                                (ii) => ii.ReceiptId === record.ReceiptId
                              )[0].SettlementAmount > 0
                            : false,
                      }),
                    }}
                    dataSource={recieptData}
                    pagination={false}
                  />
                ) : (
                  <Empty />
                )}
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  disabled={!recieptData.length > 0}
                  style={{ marginBottom: 5, marginTop: 5 }}
                  onClick={() => {
                    let l_SelectedRow = [];
                    let l_RemainingAmount = props.data.BalanceAmount;
                    tempData.forEach((row) => {
                      if (
                        parseFloat(row.BalAmount) >= l_RemainingAmount &&
                        l_RemainingAmount > 0
                      ) {
                        l_SelectedRow.push({
                          ...row,
                          SettlementAmount: l_RemainingAmount,
                        });
                        l_RemainingAmount -= l_RemainingAmount;
                      } else if (l_RemainingAmount > 0) {
                        l_SelectedRow.push({
                          ...row,
                          SettlementAmount: parseFloat(row.BalAmount),
                        });
                        l_RemainingAmount -= parseFloat(row.BalAmount);
                      }
                    });
                    setSelectedRow([...selectedRow, ...l_SelectedRow]);
                    setShowReciept(false);
                  }}
                >
                  Set
                </Button>
              </Modal>
              {selectedRow.length > 0 ? (
                <Table
                  columns={columns}
                  bordered={true}
                  dataSource={selectedRow}
                  pagination={false}
                  summary={(pageData) => {
                    let totalAmount = 0;
                    pageData.forEach(({ SettlementAmount }) => {
                      totalAmount += parseFloat(SettlementAmount);
                    });

                    return (
                      <>
                        <Table.Summary.Row>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Text style={{ fontWeight: "600" }}>Total</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <div
                              style={{
                                height: "100%",
                                width: "100%",
                                textAlign: "right",
                                paddingRight: 20,
                              }}
                            >
                              <Text style={{ fontWeight: "600" }}>
                                {parseFloat(totalAmount).toFixed(2)}
                              </Text>
                            </div>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    );
                  }}
                />
              ) : (
                <Empty />
              )}
            </Card>
            <Divider
              type="horizontal"
              style={{ marginBottom: 5, marginTop: 5 }}
            />
            <Button
              disabled={!selectedRow.length > 0}
              type="primary"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                let totalSettlementAmount = 0;
                let isLoopFailed = false;
                for (let i = 0; i < selectedRow.length; i++) {
                  totalSettlementAmount += selectedRow[i].SettlementAmount;
                  if (
                    parseFloat(selectedRow[i].BalAmount) <
                    parseFloat(selectedRow[i].SettlementAmount)
                  ) {
                    message.error(
                      `Settlement amount can't be greter than receipt balance amount...!`,
                      5
                    );
                    isLoopFailed = true;
                  } else if (selectedRow[i].SettlementAmount < 0) {
                    message.error(
                      `Settlement amount can't be less than zero...!`,
                      5
                    );
                    isLoopFailed = true;
                  }
                  if (isLoopFailed) {
                    break;
                  }
                }
                if (isLoopFailed) {
                  return;
                }

                if (
                  totalSettlementAmount > parseFloat(props.data.BalanceAmount)
                ) {
                  message.error(
                    `Settlement amount can't be greter than invoice balance amount...!`,
                    5
                  );
                  return;
                }
                swal({
                  title: "Are you sure?",
                  text: "You want to save!",
                  icon: "warning",
                  buttons: ["No", "Yes"],
                  // dangerMode: true,
                }).then((save) => {
                  if (save) {
                    let settlementData = [];
                    selectedRow.forEach((row) =>
                      settlementData.push({
                        SettlementDate: moment().format("YYYY-MM-DD"),
                        SettlementType: props.settlementType,
                        AdjTranNo: props.data.InvoiceId,
                        AdjTranDate: moment(row.InvoiceDate).format(
                          "YYYY-MM-DD"
                        ),
                        Amount: row.SettlementAmount,
                        SettlementRemark: row.Remark ? row.Remark : null,
                        ReceiptId: row.ReceiptId,
                        updt_usr: l_LoginUserInfo.username,
                      })
                    );
                    dispatch(InsBillSettlemet(settlementData));
                    swal("Data saved successfully.....!", {
                      icon: "success",
                    });
                    props.onBackPress();
                  }
                });
              }}
            >
              Save
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 5 }}
              icon={<RollbackOutlined />}
              onClick={() => {
                props.onBackPress();
              }}
            >
              Back
            </Button>
          </Card>
        </>
      )}
    </div>
  );
};

export default Settlement;
