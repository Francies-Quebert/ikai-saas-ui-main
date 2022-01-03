import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Select,
  Row,
  Col,
  Card,
  Input,
  Table,
  Tooltip,
  Form,
  DatePicker,
  message,
  Cascader,
  Typography,
} from "antd";
import {
  SearchOutlined,
  PlusCircleOutlined,
  RetweetOutlined,
  SaveOutlined,
  EditTwoTone,
  DeleteTwoTone,
  BarcodeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import CardHeader from "../../common/CardHeader";
import { setFormCaption } from "../../../store/actions/currentTran";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import { fetchDeptMaster } from "../../../store/actions/deptmaster";
import Modal from "antd/lib/modal/Modal";
import SelectableItem from "./OpeningStock/Component/SelectableItem";
import {
  getInvGetOpeningStock,
  getInvItemMasterData,
  getItemCodeFromBarcode,
  invValidateItemCodeInTransaction,
} from "../../../services/opening-stock";
import {
  InsOpeningStock,
  InvDeleteOpeningStock,
  InvUpdateOpeningStock,
} from "../../../services/inventory";
import moment from "moment";
import swal from "sweetalert";
import { hasRight } from "../../../shared/utility";
const { Text, Link } = Typography;
const OpeningStockPage = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const defBranch = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH").value1
  );
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const l_ConfigDateTimeFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTTMFORMAT").value1
  );
  const currTran = useSelector((state) => state.currentTran);
  const branchMaster = useSelector((state) => state.branchMaster.branchMaster);
  const departmentMaster = useSelector((state) => state.deptMaster.deptMaster);
  const [ss, setSS] = useState({
    comp: CompCode,
    branch: null,
    department: null,
  });
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );

  const showBatch = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "ENABLE_BATCH")
  );
  const INV_TYPE = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "INV_TYPE")
  );

  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [barcode, setBarcode] = useState();
  const [itemCode, setItemcode] = useState(null);
  const [updateStock, setUpdateStock] = useState();
  const [mode, setMode] = useState("A");
  const itemCodeRef = useRef();

  const initialValues = {
    ItemCode: null,
    ItemName: null,
    Quantity: null,
    Rate: null,
    SaleRate: null,
    MRP: null,
    BatchNo: null,
    Remark: null,
    InwardSeq: null,
  };

  useEffect(() => {
    dispatch(setFormCaption(88));
    dispatch(fetchBranchMaster());
    dispatch(fetchDeptMaster());
  }, []);

  useEffect(() => {
    if (
      mode === "A" &&
      itemCode &&
      INV_TYPE.value1 === "N" &&
      stockData.filter((i) => i.ItemCode === itemCode).length > 0
    ) {
      if (
        stockData.filter(
          (i) => i.ItemCode === itemCode && i.IsAllowModification === "Y"
        ).length > 0
      ) {
        swal(
          `Item ${itemCode} already exist`,
          "Do you want to edit this item",
          {
            buttons: ["Cancel", "Yes!"],
          }
        ).then(async (val) => {
          if (val) {
            let tempData = stockData.filter((i) => i.ItemCode === itemCode);
            await mapStockData([...tempData], "U");
            setMode("U");
            setLoading(false);
          } else {
            setMode("A");
            // setItemcode();
            form.resetFields();
            setLoading(false);
          }
        });
      } else {
        message.error("Item already exist and Item Cannot be modified");
        form.resetFields();
        // setItemcode();
        setMode("A");
        setLoading(false);
      }
    } else {
      if (mode === "A" && itemCode) {
        validatesss(CompCode, itemCode);
      }
    }

    //setLoading(true);
  }, [itemCode]);

  const fnDefault = async () => {
    getInvGetOpeningStock(CompCode, ss.branch, ss.department, null)
      .then((res) => {
        getInvItemMasterData(CompCode, ss.branchcode).then((res1) => {
          setItemsData(res1);
        });
        setStockData(
          res.sort((a, b) => (parseInt(a.key) < parseInt(b.key) ? 1 : -1))
        );
      })
      .finally((ee) => {
        setShowCard(true);
        setLoading(false);
      });
  };

  const onFinish = (values) => {
    let data = {
      CompCode: CompCode,
      BranchCode: values.BranchCode ? values.BranchCode : ss.branch,
      DeptCode: values.DeptCode ? values.DeptCode : ss.department,
      ItemCode: values.ItemCode ? values.ItemCode : itemCode,
      BatchNo: values.BatchNo ? values.BatchNo : null,
      InwardSeq: values.InwardSeq ? values.InwardSeq : -6,
      ExpiryDate: values.ExpiryDate
        ? moment(values.ExpiryDate).format("YYYY-MM-DD")
        : null,
      Rate: values.Rate,
      SaleRate: values.SaleRate,
      MRP: values.MRP,
      Qty: values.Qty,
      Remark: values.Remark ? values.Remark : null,
      UpdtUsr: l_loginUser,
    };

    swal("Are you sure you want to save this ..!", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        setLoading(true);
        if (mode === "A") {
          InsOpeningStock(CompCode, [{ ...data }])
            .then((res) => {
              if (res.data.message === "successful") {
                fnDefault();
                swal("Data saved successfully   !!!", {
                  icon: "success",
                });
                setItemcode();
                form.resetFields();
              } else if (res.data.message === "unsuccessful") {
                swal(
                  `${
                    res.data.data.code === "ER_DUP_ENTRY"
                      ? "Duplicate Entry"
                      : "Something Went Wrong Try Again Later...."
                  }`,
                  {
                    icon: "error",
                  }
                );
              }
            })
            .catch((err) => {
              console.erroe(err, "error");
            });
        } else if (mode === "U") {
          InvUpdateOpeningStock([{ ...data }]).then((res) => {
            if (res.data.message === "successful") {
              fnDefault();
              swal("Data saved successfully   !!!", {
                icon: "success",
              });
              setItemcode();
              form.resetFields();
              setMode("A");
            } else if (res.data.message === "unsuccessful") {
              swal(
                `${
                  res.data.data.code === "ER_DUP_ENTRY"
                    ? "Duplicate Entry"
                    : "Something Went Wrong Try Again Later...."
                }`,
                {
                  icon: "error",
                }
              );
              //setLoading(true);
            }
          });
        }
      }
      //setLoading(true);
    });
    // }
  };

  const handleDelete = (data) => {
    //setLoading(true);
    let tempData = [];
    tempData.push({
      CompCode: data.CompCode,
      BranchCode: data.BranchCode,
      DeptCode: data.DeptCode,
      ItemCode: data.ItemCode,
      InwardSeq: data.InwardSeq,
      UpdtUsr: l_loginUser,
    });

    swal("Are you sure you want to delete this ..!", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InvDeleteOpeningStock(tempData).then((res) => {
          if (res.data.message === "successful") {
            fnDefault();
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
          } else if (res.data.message === "unsuccessful") {
            swal(
              `${
                res.data.data.code === "ER_DUP_ENTRY"
                  ? "Duplicate Entry"
                  : "Something Went Wrong Try Again Later...."
              }`,
              {
                icon: "error",
              }
            );
            setLoading(true);
          }
        });
      } else {
        setLoading(true);
      }
    });
  };

  const onGetItemCode = (data) => {
    setLoading(true);
    setItemcode();
    getItemCodeFromBarcode(CompCode, data).then((res) => {
      if (res.length > 0) {
        setItemcode(res[0].ItemCode);
      } else {
        message.error("Item not found for this barcode");
        form.resetFields();
        itemCodeRef.current.focus();
        setLoading(false);
      }
    });
  };

  const mapStockData = async (data, aa) => {
    if (aa === "A") {
      await data.map((i) => {
        form.setFieldsValue({
          ItemCode: i.ItemCode,
          ItemName: i.ItemName,
          Qty: i.Quantity,
          Rate: i.Cost,
          SaleRate: i.SalePrice,
          MRP: i.MRP,
        });
        setItemcode(i.ItemCode);
      });
    } else {
      await data.map((i) => {
        form.setFieldsValue({
          ItemCode: i.ItemCode,
          ItemName: i.ItemName,
          Qty: i.Qty,
          Rate: i.Rate,
          SaleRate: i.SaleRate,
          MRP: i.MRP,
          BatchNo: i.BatchNo,
          ExpiryDate: i.ExpiryDate ? moment(i.ExpiryDate) : null,
          Remark: i.Remark,
          InwardSeq: i.InwardSeq,
        });
        setItemcode(i.ItemCode);
      });
    }
  };

  // useEffect(() => {
  //   let tempBranch = branchMaster.filter((ii) => ii.IsActive === true);
  //   let tempDept = departmentMaster.filter((ii) => ii.IsActive === true);
  //   if (tempBranch.length === 1 && tempDept.length === 1) {
  //     setSS({
  //       ...ss,
  //       branch: tempBranch[0].BranchCode,
  //       department: tempDept[0].DeptCode,
  //     });
  //     getInvGetOpeningStock(
  //       CompCode,
  //       tempBranch[0].BranchCode,
  //       tempDept[0].DeptCode,
  //       null
  //     ).then((res) => {
  //       getInvItemMasterData(CompCode, tempBranch[0].BranchCode).then(
  //         (res1) => {
  //           setItemsData(res1);
  //         }
  //       );
  //       setStockData(
  //         res.sort((a, b) => (parseInt(a.key) < parseInt(b.key) ? 1 : -1))
  //       );
  //     });
  //   //setLoading(true);
  //     setShowCard(true);
  //   }
  // }, []);

  const validatesss = (CompCode, itemCode) => {
    invValidateItemCodeInTransaction(CompCode, itemCode).then(async (res) => {
      if (res.length > 0) {
        if (res.filter((i) => i.IsActive).length > 0) {
          await mapStockData([...res], "A");
          setItemcode(res[0].ItemCode);
          setLoading(false);
        } else {
          message.error("Selected Item is not active");
          form.setFieldsValue({ ItemCode: null });
          setItemcode();
          setLoading(false);
        }
      } else {
        message.error("No Item Found");
        form.resetFields();
        setItemcode();
        setLoading(false);
      }
    });
  };

  const addressOption = () => {
    let temp = [];
    branchMaster
      .filter((ii) => ii.IsActive)
      .map((item) => {
        temp.push({
          value: item.BranchCode,
          label: item.BranchName,
          children: DeptOption(item.BranchCode),
        });
      });
    return temp;
  };

  const DeptOption = (BranchCode) => {
    let state = [];
    departmentMaster
      .filter((ii) => ii.IsActive && ii.BranchCode === BranchCode)
      .map((item) => {
        state.push({
          value: item.DeptCode,
          label: item.DeptName,
        });
      });
    return state;
  };

  const columns = [
    { title: "Item Code", dataIndex: "ItemCode", width: "8%" },
    { title: "Item Name", dataIndex: "ItemName" },
    {
      title: "InwardSeq",
      dataIndex: "InwardSeq",
      width: "7%",
    },
    {
      title: "Batch No",
      dataIndex: "BatchNo",
      width: "7%",
    },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDate",
      width: "9%",
      render(text, record) {
        return (
          <div>
            {record.ExpiryDate
              ? moment(record.ExpiryDate).format(l_ConfigDateFormat)
              : ""}
          </div>
        );
      },
    },
    {
      title: `Quantity`,
      dataIndex: "Qty",
      align: "right",
      width: "7%",
    },
    {
      title: `MRP (${currency.value1})`,
      dataIndex: "MRP",
      align: "right",
      width: "7%",
      render: (text, record) => {
        return <div>{record.MRP}</div>;
      },
    },
    {
      title: `Sale (${currency.value1})`,
      dataIndex: "SaleRate",
      align: "right",
      width: "7%",
      render: (text, record) => {
        return <div>{record.SaleRate}</div>;
      },
    },
    {
      title: `Cost (${currency.value1})`,
      dataIndex: "Rate",
      align: "right",
      width: "7%",
      render: (text, record) => {
        return <div>{record.Rate}</div>;
      },
    },
    {
      title: `Last Modified`,
      dataIndex: "LastModifiedDTTM",
      width: 120,
      render: (text, record) => {
        return (
          <Text ellipsis={true}>
            {moment(text).format(l_ConfigDateTimeFormat)}
          </Text>
        );
      },
    },
    {
      title: "",
      dataIndex: "x",
      width: "4%",
      render: (text, record) => {
        return (
          <>
            <a
              className={`edit-btn ${
                hasRight(currTran.moduleRights, "EDIT") ||
                (INV_TYPE.value1 === "N" &&
                  record.IsAllowModification === "N") ||
                record.IsAllowModification === "N"
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={
                hasRight(currTran.moduleRights, "EDIT") ||
                (INV_TYPE.value1 === "N" &&
                  record.IsAllowModification === "N") ||
                record.IsAllowModification === "N"
              }
              style={{ marginRight: 5 }}
              onClick={() => {
                setMode("U");
                mapStockData([{ ...record }], "U");
              }}
            >
              <EditTwoTone />
            </a>

            <a
              className={`edit-btn ${
                record.IsAllowModification === "N" ? `disabled` : `edit-btn`
              }`}
              disabled={record.IsAllowModification === "N"}
              onClick={() => {
                setLoading(true);
                handleDelete(record);
              }}
            >
              <DeleteTwoTone />
            </a>
          </>
        );
      },
    },
  ];

  const size = "middle";

  return (
    <>
      <Row>
        <Col span={24}>
          <CardHeader title={currTran.formTitle} />
          <Card bordered={true} bodyStyle={{ padding: 0, margin: 3 }}>
            <Row style={{ marginBottom: 3 }}>
              <Col>
                <label style={{ margin: 6, fontSize: 14 }}>
                  Branch / Department :
                </label>
                <Cascader
                  size={size}
                  disabled={stockData.length > 0}
                  style={{ width: 250, marginRight: 5 }}
                  showSearch
                  options={addressOption()}
                  value={[ss.branch, ss.department]}
                  onChange={(val, ss) => {
                    setSS({ ...ss, branch: val[0], department: val[1] });
                  }}
                />
                {/* <Select
                  size={size}
                  allowClear={true}
                  value={ss.branch}
                  showSearch
                  disabled={stockData.length > 0}
                  style={{ width: 250, marginRight: 5 }}
                  placeholder="Select Branch"
                  onChange={(val) => {
                    setSS({ ...ss, branch: val });
                  }}
                >
                  {branchMaster.length > 0 &&
                    branchMaster
                      .filter((i) => i.IsActive)
                      .map((i) => {
                        return (
                          <Option key={i.BranchCode} value={i.BranchCode}>
                            {i.BranchName}
                          </Option>
                        );
                      })}
                </Select> */}
              </Col>
              {/* <Col>
                <label style={{ margin: 6, fontSize: 14 }}>Department:</label>
                <Select
                  size={size}
                  onChange={(val) => {
                    setSS({ ...ss, department: val });
                  }}
                  value={ss.department}
                  disabled={stockData.length > 0}
                  allowClear={true}
                  showSearch
                  style={{ width: 200, marginRight: 5 }}
                  placeholder="Select Department"
                >
                  {departmentMaster.length > 0 &&
                    departmentMaster
                      .filter((i) => i.IsActive)
                      .map((i, idx) => {
                        return (
                          <Option key={idx} value={i.DeptCode}>
                            {i.DeptName}
                          </Option>
                        );
                      })}
                </Select>
              </Col> */}
              <Col style={{ alignSelf: "center" }}>
                <Button
                  size={size}
                  loading={loading}
                  icon={<SearchOutlined />}
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    setLoading(true);
                    fnDefault();
                  }}
                  disabled={
                    !ss.branch || !ss.department || stockData.length > 0
                  }
                >
                  Show
                </Button>
                <Button
                  loading={loading}
                  size={size}
                  icon={<RetweetOutlined />}
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    setSS({ comp: 1, branch: null, department: null });
                    setShowCard(false);
                    setStockData([]);
                  }}
                >
                  Reset
                </Button>
              </Col>
            </Row>

            {showCard && (
              <>
                <Row style={{ display: "flex" }}>
                  <Col span={24} style={{ margin: "5px 0px" }}>
                    <Form
                      layout="vertical"
                      initialValues={initialValues}
                      form={form}
                      onFinish={onFinish}
                      requiredMark={false}
                      size="small"
                    >
                      <Row style={{ border: "1px solid #d9d9d9" }}>
                        {/* <Row style={{ width: "100%" }}> */}
                        <Col
                          style={{
                            margin: "0px 0px",
                            padding: "0px 2px 0px 0px",
                          }}
                          className="sales-item-input-outer"
                          span={4}
                        >
                          <Form.Item
                            // noStyle={true}
                            label="Scan Barcode"
                            name="scanbarcode"
                            style={{
                              marginBottom: 5,
                            }}
                            className="custom-label-opening-stock sales-item-input-inner"
                          >
                            <Input
                              ref={itemCodeRef}
                              addonBefore={
                                <a
                                  onClick={() => {
                                    setModal(true);
                                  }}
                                >
                                  <Tooltip title="Search Items">
                                    <i>
                                      <ShoppingCartOutlined />
                                    </i>
                                  </Tooltip>
                                </a>
                              }
                              onChange={(e) => {
                                if (e.target.value) {
                                  setBarcode(e.target.value);
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value) {
                                  onGetItemCode(e.target.value);
                                }
                              }}
                              placeholder={" Scan Barcode"}
                              onKeyDown={(event) => {
                                if (
                                  event.keyCode === 13 ||
                                  event.keyCode === 9
                                ) {
                                  const form = event.target.form;
                                  const index = Array.prototype.indexOf.call(
                                    form,
                                    event.target
                                  );
                                  form.elements[index + 1].focus();
                                  onGetItemCode(barcode);
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col
                          style={{
                            margin: "0px 0px 0px 0px",
                            padding: "0px 2px 0px 0px",
                          }}
                          span={8}
                          className="sales-item-input-outer"
                        >
                          <Form.Item
                            label="Product (SKU)"
                            className="custom-label-opening-stock sales-item-input-inner"
                            style={{ marginBottom: 5 }}
                          >
                            <div
                              style={{
                                padding: "0px 0px",
                                flex: 1,
                                display: "flex",
                              }}
                            >
                              <Form.Item
                                hidden
                                name="ItemCode"
                                style={{ marginBottom: 0, width: 120 }}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Enter Item Code",
                                  },
                                ]}
                                className="custom-label-opening-stock"
                              >
                                <Input
                                  addonBefore={
                                    <a
                                      onClick={() => {
                                        setModal(true);
                                      }}
                                    >
                                      <Tooltip title="Search Items">
                                        <i>
                                          <ShoppingCartOutlined />
                                        </i>
                                      </Tooltip>
                                    </a>
                                  }
                                  disabled={mode === "U"}
                                  placeholder="Item Code"
                                  onBlur={(e) => {
                                    setItemcode();
                                    setItemcode(e.target.value);
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.keyCode === 13) {
                                      const form = event.target.form;
                                      const index =
                                        Array.prototype.indexOf.call(
                                          form,
                                          event.target
                                        );
                                      form.elements[index + 2].focus();
                                    }
                                  }}
                                />
                              </Form.Item>
                              <Form.Item
                                name="ItemName"
                                style={{
                                  marginBottom: 0,
                                  width: "100%",
                                  fontWeight: 300,
                                }}
                                className="custom-label-opening-stock"
                              >
                                <Input
                                  style={{ fontWeight: 500, color: "#000000" }}
                                  disabled
                                  placeholder="Item Name"
                                  size="small"
                                />
                              </Form.Item>
                            </div>
                          </Form.Item>
                          {/* </div> */}
                        </Col>
                        {/* <Col
                          style={{
                            marginRight: 5,
                          }}
                          span={8}
                        >
                          <Form.Item
                            label="Item Name"
                            name="ItemName"
                            style={{ marginBottom: 5 }}
                            className="custom-label-opening-stock"
                          >
                            <Input disabled placeholder="Item Name" />
                          </Form.Item>
                        </Col> */}
                        <Col
                          style={{
                            marginRight: 0,
                            padding: "0px 2px 0px 0px",
                          }}
                          span={3}
                          className="sales-item-input-outer"
                        >
                          <Form.Item
                            label="Quantity"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            name="Qty"
                            style={{
                              marginBottom: 5,
                              alignItems: "flex-end",
                              // width: 110,
                            }}
                            labelAlign="right"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Quantity",
                              },
                            ]}
                            className="custom-label-opening-stock custom-numeric-label-opening-stock sales-item-input-inner"
                          >
                            <Input
                              style={{ textAlign: "right" }}
                              placeholder="Quantity"
                              type="number"
                              className="bill-input"
                              step={0.001}
                              min={0}
                            />
                          </Form.Item>
                        </Col>
                        <Col
                          style={{
                            marginRight: 0,
                            padding: "0px 2px 0px 0px",
                          }}
                          span={3}
                          className="sales-item-input-outer"
                        >
                          <Form.Item
                            label="Cost Price"
                            name="Rate"
                            style={{
                              marginBottom: 5,
                              alignItems: "flex-end",
                              // width: 110,
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Cost Price",
                              },
                            ]}
                            className="custom-label-opening-stock custom-numeric-label-opening-stock sales-item-input-inner"
                          >
                            <Input
                              style={{ textAlign: "right" }}
                              placeholder="Cost Price"
                              type="number"
                              className="bill-input"
                              step={0.001}
                              min={0}
                            />
                          </Form.Item>
                        </Col>
                        <Col
                          span={3}
                          className="sales-item-input-outer"
                          style={{
                            marginRight: 0,
                            padding: "0px 2px 0px 0px",
                          }}
                        >
                          <Form.Item
                            label="Sale Price"
                            name="SaleRate"
                            style={{
                              marginBottom: 5,
                              alignItems: "flex-end",
                              // width: 110,
                            }}
                            className="custom-label-opening-stock custom-numeric-label-opening-stock sales-item-input-inner"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Sale Price",
                              },
                            ]}
                          >
                            <Input
                              style={{ textAlign: "right" }}
                              placeholder="Sale Price"
                              type="number"
                              className="bill-input"
                              step={0.001}
                              min={0}
                            />
                          </Form.Item>
                        </Col>
                        <Col
                          span={3}
                          style={{
                            marginRight: 0,
                            // width: 110,
                            padding: "0px 2px 0px 0px",
                          }}
                          className="sales-item-input-outer"
                        >
                          <Form.Item
                            label="MRP"
                            name="MRP"
                            style={{
                              marginBottom: 5,
                              alignItems: "flex-end",
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Please Enter MRP",
                              },
                            ]}
                            className="custom-label-opening-stock custom-numeric-label-opening-stock sales-item-input-inner"
                          >
                            <Input
                              style={{ textAlign: "right" }}
                              placeholder="MRP"
                              type="number"
                              className="bill-input"
                              step={0.001}
                              min={0}
                            />
                          </Form.Item>
                        </Col>

                        {/* </Row> */}
                        {/* <Row> */}
                        <Col
                          span={3}
                          style={{
                            margin: "0px",
                            display:
                              showBatch.value1 === "Y" ? "block" : "none",
                          }}
                          className="sales-item-input-outer"
                        >
                          <Form.Item
                            label="Batch No"
                            name="BatchNo"
                            style={{ marginBottom: 5 }}
                            className="custom-label-opening-stock sales-item-input-inner"
                          >
                            <Input placeholder="Batch No" />
                          </Form.Item>
                        </Col>
                        <Col
                          span={3}
                          style={{
                            marginRight: 5,
                            display:
                              showBatch.value1 === "Y" ? "block" : "none",
                          }}
                          className="sales-item-input-outer"
                        >
                          <Form.Item
                            label="Expiry Date"
                            name="ExpiryDate"
                            style={{ marginBottom: 5 }}
                            className="custom-label-opening-stock sales-item-input-inner"
                          >
                            <DatePicker />
                          </Form.Item>
                        </Col>
                        <Col
                          span={4}
                          style={{
                            marginRight: 5,
                          }}
                          className="sales-item-input-outer"
                        >
                          <Form.Item
                            label="Remark"
                            name="Remark"
                            style={{ marginBottom: 5 }}
                            className="custom-label-opening-stock sales-item-input-inner"
                          >
                            <Input placeholder={"Remark"} />
                          </Form.Item>
                        </Col>
                        <Col
                          span={5}
                          style={{
                            marginRight: 0,
                            padding: "0px 2px 0px 0px",
                          }}
                          className="sales-item-input-outer"
                        >
                          <Form.Item
                            name="InwardSeq"
                            labelAlign="right"
                            label="Inward Sequence"
                            style={{ marginBottom: 5 }}
                            className="custom-label-opening-stock sales-item-input-inner"
                          >
                            <Input disabled placeholder="Auto Generated" />
                          </Form.Item>
                        </Col>
                        {/* <Col
                          style={{
                            marginRight: 5,
                          }}
                        >
                          <Form.Item
                            name="InwardSeq"
                            label="Inward Sequence"
                            style={{ marginBottom: 5 }}
                            className="custom-label-opening-stock"
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col> */}
                        <Col
                          span={8}
                          style={{
                            margin: "0px",
                            // padding: "0px 5px",
                            alignSelf: "flex-end",
                            height: 54,
                            paddingBottom: 5,
                          }}
                          className="custom-label-opening-stock"
                        >
                          <Button
                            loading={loading}
                            icon={
                              mode === "A" ? (
                                <PlusCircleOutlined />
                              ) : (
                                <SaveOutlined />
                              )
                            }
                            size="large"
                            style={{ marginRight: 5, height: "100%" }}
                            type="primary"
                            disabled={
                              !itemCode ||
                              UserAccess.find(
                                (i) => i.ModuleId === 88
                              ).Rights.find((i) => i.RightCode === "ADD")
                                .RightVal === "N"
                            }
                            onKeyDown={(event) => {
                              event.preventDefault();
                            }}
                            htmlType="submit"
                          >
                            {mode === "A" ? "Add & Save" : "Update  & Save"}
                          </Button>
                          <Button
                            loading={loading}
                            icon={<RetweetOutlined />}
                            type="primary"
                            style={{ height: "100%" }}
                            onClick={() => {
                              setItemcode();
                              form.resetFields();
                              setMode("A");
                            }}
                            size="large"
                          >
                            Clear
                          </Button>
                        </Col>
                        {/* </Row> */}
                      </Row>
                    </Form>
                  </Col>
                </Row>
                <Row style={{ display: "flex", marginBottom: 5 }}>
                  <Col span={24}>
                    <div>
                      <Table
                        size="small"
                        loading={loading}
                        bordered
                        className="custom-pagination"
                        columns={columns}
                        dataSource={stockData.filter((i) => !i.isDeleted)}
                        pagination={
                          stockData.filter((i) => !i.isDeleted).length > 25
                            ? {
                                pageSize: 20,
                                size: "small",
                              }
                            : false
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </>
            )}

            <Modal
              visible={modal}
              title={"Add Item"}
              footer={false}
              bodyStyle={{ padding: "10px 10px" }}
              destroyOnClose={true}
              onCancel={() => {
                setModal(false);
              }}
              width={"90%"}
            >
              <SelectableItem
                data={itemsData}
                onItemSelect={(data) => {
                  if (data) {
                    // setLoading(true);
                    onGetItemCode(data.ItemCode);
                    setMode("A");
                    setModal(false);
                  }
                }}
                onBackPress={() => {
                  setModal(false);
                }}
              />
            </Modal>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OpeningStockPage;
