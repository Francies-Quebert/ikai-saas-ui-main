import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import {
  Table,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Button,
  Tooltip,
  InputNumber,
  notification,
} from "antd";
import InvoiceInputComponent from "./Component/InvoiceInputComponent";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import Modal from "antd/lib/modal/Modal";
import SearchCustomer from "../../sales/SearchCustomer";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import CustomerSelectionComponent from "../../dashboard/Restaurant/components/SubComponents/CustomerSelectionComponent";
import { fetchBranchMasterData } from "../../../services/branch-master";
import { fetchDeptMasterService } from "../../../services/department-master";
import { fetchReceiptAndPaymentReferenceHelp } from "../../../services/receipts-payments";
import {
  getInvoiceTranData,
  InvGenerateInvoiceMKStockOut,
  modifyServiceInvoice,
} from "../../../services/inventory";
import { stringify } from "postcss";
const { Option } = Select;
const GenricInvoiceCard = (props) => {
  const dispatch = useDispatch();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const initialInvoiceData = {
    voucherNo: null,
    voucherDate: moment(),
    customer: null,
    Remark: null,
    formSize: "small",
  };
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );

  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [showModal, setShowModal] = useState();
  const [tableData, setTableData] = useState([
    {
      SrNo: 1,
      Particular: null,
      Qty: null,
      Rate: null,
      Amount: null,
    },
  ]);
  const [prevData, setPrevData] = useState([]);
  const [initialRequiredValue, setInitialRequiredValue] = useState({
    branch: null,
    department: null,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [customer, setCustomer] = useState([]);
  useEffect(() => {
    fetchReceiptAndPaymentReferenceHelp(CompCode).then((res) => {
      if (res.length > 0) {
        setCustomer(res.filter((i) => i.DataSetType === "PARTY"));
      }
    });
  }, []);

  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const fetchData = () => {
    return new Promise(async function (resolve, reject) {
      try {
        let branch = await fetchBranchMasterData(CompCode)
          .then((brnh) => {
            if (brnh.length > 0) {
              return brnh[0].BranchCode;
            }
          })
          .catch((err) => {
            reject(err);
          });
        let depart = await fetchDeptMasterService(CompCode)
          .then((dept) => {
            if (dept.length > 0) {
              return dept[0].DeptCode;
            }
          })
          .catch((err) => {
            reject(err);
          });
        let invoiceData;
        if (props.entryType.EntryMode === "E") {
          invoiceData = await getInvoiceTranData(CompCode, props.entryType.data)
            .then(async (res) => {
              let hdr = res[0][0];
              let dtl = res[1];

              let invoiceHdr = {
                voucherNo: hdr.InvoiceNo,
                voucherDate: moment(hdr.InvoiceDate),
                customer: hdr.CustId,
                Remark: hdr.InvoiceRemark,
              };
              let invoiceDtl = dtl.map((aa, i) => {
                return {
                  SrNo: i + 1,
                  Particular: aa.ItemName,
                  Qty: aa.Qty,
                  Rate: aa.Rate,
                  Amount: aa.Amount,
                };
              });
              return { invoiceHdr, invoiceDtl };
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          invoiceData = null;
        }
        if (branch && depart && invoiceData) {
          resolve([branch, depart, invoiceData]);
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  useEffect(() => {
    fetchData()
      .then((res) => {
        setInitialRequiredValue({
          branch: res[0],
          department: res[1],
        });
        if (props.entryType.EntryMode === "E") {
          setInvoiceData({ ...invoiceData, ...res[2].invoiceHdr });
          setTableData([...res[2].invoiceDtl]);
          setPrevData([...res[2].invoiceDtl]);
        }
      })
      .catch((err) => {
        notification.error({ message: "Error Occured", description: err });
      })
      .finally(() => {});
  }, []);
  let columns = [
    {
      dataIndex: "SrNo",
      title: "Sr No.",
      width: 55,
      align: "center",
    },
    {
      dataIndex: "Particular",
      title: "Particular",
      render: (text, record, dar) => {
        return (
          <Input
            placeholder="Particular"
            addonBefore={
              <i>
                <ShoppingCartOutlined />
              </i>
            }
            value={record.Particular}
            onChange={(e) => {
              let tempIndex = tableData.findIndex(
                (aa) => aa.SrNo === record.SrNo
              );
              let tempTable = tableData;
              if (tempIndex >= 0) {
                tempTable[tempIndex].Particular = e.target.value;
                setTableData([...tempTable]);
              }
            }}
          />
        );
      },
    },
    {
      dataIndex: "Qty",
      title: "Quantity",
      width: 120,
      render: (text, record) => {
        return (
          <InputNumber
            min={1}
            className="bill-input width-100"
            placeholder="Quantity"
            value={record.Qty}
            onChange={(val) => {
              let qty =
                parseFloat(val) && parseFloat(val) !== "NaN"
                  ? parseFloat(val)
                  : 1;
              let rate = record.Rate ? parseFloat(record.Rate) : 0;
              let amount = parseFloat(qty) * parseFloat(rate);

              let tempIndex = tableData.findIndex(
                (aa) => aa.SrNo === record.SrNo
              );
              let tempTable = tableData;
              if (tempIndex >= 0) {
                tempTable[tempIndex].Qty = qty;
                tempTable[tempIndex].Amount = amount.toFixed(2);
                setTableData([...tempTable]);
              }
            }}
          />
        );
      },
    },
    {
      dataIndex: "Rate",
      title: "Rate",
      width: 120,
      render: (text, record) => {
        return (
          <InputNumber
            className="bill-input width-100"
            placeholder="Rate"
            value={record.Rate}
            onChange={(val) => {
              let qty = parseFloat(record.Qty) ? parseFloat(record.Qty) : 1;
              let rate =
                parseFloat(val) && parseFloat(val) !== "NaN"
                  ? parseFloat(val)
                  : 0;
              let amount = parseFloat(qty) * parseFloat(rate);

              let tempIndex = tableData.findIndex(
                (aa) => aa.SrNo === record.SrNo
              );
              let tempTable = tableData;
              if (tempIndex >= 0) {
                tempTable[tempIndex].Rate = rate;
                tempTable[tempIndex].Amount = amount.toFixed(2);
                setTableData([...tempTable]);
              }
            }}
          />
        );
      },
    },
    {
      dataIndex: "Amount",
      title: "Amount",
      width: 80,
      align: "right",
    },
    {
      dataIndex: "x",
      title: "Action",
      width: 60,
      align: "center",
      render: (text, record) => {
        return (
          <a
            onClick={async () => {
              let tempData = await tableData
                .filter((aa) => aa.SrNo !== record.SrNo)
                .map((aa, index) => {
                  return {
                    ...aa,
                    SrNo: index + 1,
                  };
                });
              if (tempData) {
                setTableData(tempData);
              }
            }}
            style={{ color: "red" }}
          >
            <DeleteOutlined />
          </a>
        );
      },
    },
  ];
  // console.log("sss", invoiceData, customer);
  return (
    <div>
      <div className="genric-invoice-data">
        <Row>
          <Col xs={24} sm={4}>
            <InvoiceInputComponent label="Voucher No">
              <Input
                placeholder="*Auto Generated*"
                disabled={true}
                size={invoiceData.formSize}
                value={invoiceData.voucherNo}
                onChange={(e) => {
                  setInvoiceData({ ...invoiceData, voucherNo: e.target.value });
                }}
              />
            </InvoiceInputComponent>
          </Col>
          <Col xs={24} sm={4}>
            <InvoiceInputComponent label="Voucher Date">
              <DatePicker
                className="genric-invoice-datepicker"
                size={invoiceData.formSize}
                value={invoiceData.voucherDate}
                onChange={(val) => {
                  setInvoiceData({ ...invoiceData, voucherDate: val });
                }}
                format={l_ConfigDateFormat}
              />
            </InvoiceInputComponent>
          </Col>
          <Col xs={24} sm={6}>
            <InvoiceInputComponent label="Customer">
              <div className="d-flex gen-inv-cust-inp-container">
                <a
                  onClick={() => {
                    setShowModal("SEARCH_CUSTOMER");
                  }}
                  className="gen-inv-cust-inp-helper"
                >
                  <Tooltip title="Search Customer">
                    <span>
                      <i>
                        <UserOutlined />
                      </i>
                    </span>
                  </Tooltip>
                </a>
                <Select
                  className="genric-invoice-select"
                  placeholder="Select Customer"
                  size={invoiceData.formSize}
                  allowClear={true}
                  showSearch
                  optionFilterProp="children"
                  value={invoiceData.customer}
                  onChange={(val) => {
                    setInvoiceData({ ...invoiceData, customer: val });
                  }}
                >
                  {customer.length > 0 &&
                    customer.map((item) => {
                      return (
                        <Select.Option key={item.RefId} value={parseInt(item.RefId) }>
                          {`${item.RefName} ${
                            item.AddInfo !== null ? `(${item.AddInfo})` : ""
                          }`}
                        </Select.Option>
                      );
                    })}
                </Select>
              </div>
              <div style={{ width: 58, minWidth: 58 }}>
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  style={{
                    margin: "auto 5px auto",
                  }}
                  onClick={() => setShowModal("CUSTOMER")}
                  icon={<PlusOutlined />}
                ></Button>
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  onClick={() => setShowModal("CUSTOMER")}
                  icon={<EditOutlined />}
                ></Button>
              </div>
            </InvoiceInputComponent>
          </Col>
          <Col xs={24} sm={6}>
            <InvoiceInputComponent label="Remark">
              <Input
                className="genric-invoice-datepicker"
                size={invoiceData.formSize}
                value={invoiceData.Remark}
                onChange={(e) => {
                  console.log(e.target.value, "sau");
                  setInvoiceData({ ...invoiceData, Remark: e.target.value });
                }}
              />
            </InvoiceInputComponent>
          </Col>
        </Row>
      </div>
      <div className="genric-invoice-data">
        <Table
          columns={columns}
          bordered="true"
          className="gen-invoice-table"
          dataSource={tableData}
          rowKey="SrNo"
          pagination={false}
          summary={(pageData) => {
            let amount = 0;

            pageData.forEach(({ Amount }) => {
              if (parseFloat(Amount) && parseFloat(Amount) !== "NaN") {
                amount += parseFloat(Amount);
              }
            });
            setTotalAmount(amount);
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>Total Amount</Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: "600",
                        color: "var(--app-theme-color)",
                      }}
                    >
                      {amount === 0 ? null : amount.toFixed(2)}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
          f
        />
        <div className="d-flex width-100">
          <Button
            type="dashed"
            className="gen-inv-new-row"
            onClick={async () => {
              const validateArr = [null, undefined, "", NaN];
              const valTable = tableData.filter(
                (tt) =>
                  _.includes(validateArr, tt.Particular) ||
                  _.includes(validateArr, tt.Rate) ||
                  _.includes(validateArr, tt.Qty)
              );
              if (valTable.length <= 0) {
                let tempTableData = [
                  ...tableData,
                  {
                    SrNo: null,
                    Particular: null,
                    Qty: null,
                    Rate: null,
                  },
                ];
                let tempData = await tempTableData.map((aa, index) => {
                  return {
                    ...aa,
                    SrNo: index + 1,
                  };
                });
                if (tempData) {
                  setTableData(tempData);
                }
              } else {
                notification.error({
                  message: "Empty Fields",
                  description:
                    "Some of your input fields are empty in the table",
                });
              }
            }}
          >
            Add New Row
          </Button>
        </div>
      </div>
      <div className="genric-invoice-data" style={{ padding: 5 }}>
        <Button
          size="small"
          type="primary"
          style={{ marginRight: 5 }}
          disabled={tableData.length <= 0}
          onClick={() => {
            let tempTable = tableData;
            if (props.entryType.EntryMode === "A") {
              Promise.all([
                tempTable.map((aa) => {
                  return {
                    VoucherId: null,
                    BoxNo: "Generic Invoice",
                    ItemCode: aa.Particular,
                    ItemName: aa.Particular,
                    PacketNo: null,
                    ActualSalePrice: aa.Rate,
                    CompCode: CompCode,
                    BranchCode: initialRequiredValue.branch,
                    DeptCode: initialRequiredValue.department,
                    Qty: aa.Qty,
                    ActualAmount: aa.Amount,
                    Party: invoiceData.customer,
                    UpdtUsr: l_loginUser,
                    Remark: invoiceData.Remark,
                  };
                }),
              ]).then((res) => {
                InvGenerateInvoiceMKStockOut(CompCode, res[0])
                  .then((res) => {
                    setInvoiceData(initialInvoiceData);
                    setTableData([]);
                    props.onBackPress();
                    notification.success({
                      message: "Data Saved Successfully",
                      description: "Transaction complted successfully",
                    });
                  })
                  .catch((er) => {
                    notification.error({
                      message: "Error Occured",
                      description: er,
                    });
                    console.error(er);
                  });
              });
            } else {
              let invoiceHdr = {
                InvoiceId: props.entryType.data,
                InvoiceNo: invoiceData.voucherNo,
                InvoiceDate: invoiceData.voucherDate,
                CompCode: CompCode,
                BranchCode: initialRequiredValue.branch,
                CustId: invoiceData.customer,
                CustAddressId: null,
                SysOption1: null,
                SysOption2: null,
                SysOption3: null,
                SysOption4: initialRequiredValue.department,
                SysOption5: null,
                InvoiceRemark: invoiceData.Remark,
                GrossAmount: 0,
                DiscAmount: 0,
                TaxAmount: 0,
                RoundOff: 0,
                InvoiceAmount: totalAmount,
                SettlementAmount: 0,
                UpdtUsr: l_loginUser,
              };
              Promise.all([
                tempTable.map((bb) => {
                  return {
                    InvoiceId: props.entryType.data,
                    SrNo: bb.SrNo,
                    ItemType: "I",
                    ItemCode: bb.Particular,
                    ItemName: bb.Particular,
                    ItemDesc: null,
                    HSNSACCode: null,
                    TaxCode: null,
                    UnitCode: null,
                    UnitName: "PCS",
                    Qty: bb.Qty,
                    Rate: bb.Rate,
                    Disc: 0,
                    Amount: bb.Amount,
                    SGST: 0,
                    CGST: 0,
                    UGST: 0,
                    IGST: 0,
                    Surcharge: 0,
                    Cess: 0,
                    SysOption1: null,
                    SysOption2: null,
                    SysOption3: null,
                    SysOption4: null,
                    SysOption5: null,
                    UpdtUsr: l_loginUser,
                  };
                }),
              ]).then((res) => {
                modifyServiceInvoice(CompCode, {
                  invoiceHdr,
                  invoiceDtl: res[0],
                })
                  .then((res) => {
                    // console.log('res',res)
                    setInvoiceData(initialInvoiceData);
                    setTableData([]);
                    props.onBackPress();
                    notification.success({
                      message: "Data Saved Successfully",
                      description: "Transaction complted successfully",
                    });
                  })
                  .catch((er) => {
                    notification.error({
                      message: "Error Occured",
                      description: "er",
                    });
                    // console.error(er);
                  });
              });
            }
          }}
        >
          Save
        </Button>
        <Button
          type="primary"
          onClick={() => {
            props.onBackPress();
          }}
          style={{ marginRight: 5 }}
          size="small"
        >
          Back
        </Button>
      </div>
      <Modal
        visible={showModal === "SEARCH_CUSTOMER"}
        // title={"Customer"}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
        }}
        className="search-customer"
        width={750}
        // width={"50%"}
      >
        <SearchCustomer
          data={customer}
          onItemSelect={(data) => {
            if (data) {
              //console.log(data, "on select");
              setInvoiceData((oldD) => {
                return { ...oldD, customer: data.userId };
              });
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
      <Modal
        visible={showModal === "CUSTOMER"}
        // title={"Customer"}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
        }}
        width={750}
      >
        <Col style={{ padding: "10px 15px" }} className="card-sales-inner">
          Customer Selection
        </Col>
        <CustomerSelectionComponent
          onBackPress={() => {
            setShowModal();
          }}
          onCustomerSet={(values) => {
            // console.log(values);
            dispatch(fetchUserMasters("U"));
            setInvoiceData((oldD) => {
              return {
                ...oldD,
                customer: values.customer.userId,
              };
            });
            setShowModal();
          }}
          data={{
            customer:
              invoiceData.customer !== null
                ? customer.find((aa) => aa.userId === invoiceData.customerId)
                : null,
          }}
        />
      </Modal>
    </div>
  );
};

export default GenricInvoiceCard;

//   const onGetItemCode = (ItemCode, record) => {
//     return new Promise(async function (resolve, reject) {
//       try {
//         await getItemCodeFromBarcode(ItemCode)
//           .then(async (ires) => {
//             if (ires.length > 0) {

//               let data = await validateItemCode(
//                 ires[0].ItemCode,
//                 ires[0].Barcode,
//                 record
//               ).catch((e) => {
//                 throw e;
//               });
//             } else {
//               throw "Item does not esist";
//             }
//           })
//           .catch((e) => {
//             throw e;
//           });
//       } catch (error) {
//         reject(error);
//         notification.error({
//           message: "Incorrect Code",
//           description: `No such item exist with code: ${ItemCode}`,
//         });
//       }
//     });
//   };
