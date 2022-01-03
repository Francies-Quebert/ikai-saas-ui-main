import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Tooltip,
  Button,
  Table,
  Select,
  Modal,
  notification,
  InputNumber,
} from "antd";
import _ from "lodash";
import CardHeader from "../../common/CardHeader";
import {
  RetweetOutlined,
  SaveFilled,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import SelectableItem from "../Adjustment/SelectableItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchMasterData } from "../../../services/branch-master";
import {
  getInvItemMasterData,
  getItemCodeFromBarcode,
  invValidateItemCodeInTransaction,
} from "../../../services/opening-stock";
import { setFormCaption } from "../../../store/actions/currentTran";
import {
  invGetDataItemRates,
  InvSaveAdjustments,
} from "../../../services/inventory";
import moment from "moment";
import { fetchDeptMasterService } from "../../../services/department-master";
import { hasRightToBeUsedNext } from "../../../shared/utility";

const RateChangePage = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const [modal, setModal] = useState(false);
  // const [isDisable, setIsDisable] = useState(false);
  // const [mode, setMode] = useState("A");
  const [IsLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [inputParam, setInputParam] = useState({
    branch: null,
    itemcode: null,
    itemname: null,
    deptcode: null,
  });

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currTran = useSelector((state) => state.currentTran);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const l_ModuleRights = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 128)[0]
  );
  const handleNewSalePriceChange = (record, val) => {
    let tempData = tableData;
    let indexData = tempData.findIndex((aa) => aa.key === record.key);
    tempData[indexData].NewSalePrice = val;
    tempData[indexData].IsDirty = true;
    setTableData([...tempData]);
  };

  const handleNewMRPChange = (record, val) => {
    let tempData = tableData;
    let indexData = tempData.findIndex((aa) => aa.key === record.key);
    tempData[indexData].NewMRP = val;
    tempData[indexData].IsDirty = true;
    setTableData([...tempData]);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    dispatch(setFormCaption(128));
  }, []);

  async function fetchData() {
    let branch = null;
    let depart = null;

    await fetchBranchMasterData(CompCode).then((brnh) => {
      if (brnh.length > 0) {
        setBranchData(brnh.filter((ii) => ii.IsActive === true));
        branch = brnh[0].BranchCode;
      }
    });

    await fetchDeptMasterService(CompCode).then((dept) => {
      if (dept.length > 0) {
        depart = dept[0].DeptCode;
      }
    });

    await getInvItemMasterData(CompCode, branch).then((itemData) => {
      setItemsData(itemData);
    });

    setInputParam({ ...inputParam, branch: branch, deptcode: depart });
    setIsLoading(false);
  }

  const validateItemCode = async (ItemCode, barcode) => {
    await invValidateItemCodeInTransaction(CompCode, ItemCode).then(
      (valData) => {
        if (valData.length > 0) {
          if (valData.filter((i) => i.IsActive).length > 0) {
            setInputParam({
              ...inputParam,
              itemcode: valData[0].ItemCode,
              itemname: valData[0].ItemName,
            });
          } else {
            setInputParam({ ...inputParam, itemcode: null, itemname: null });
            notification.error({
              message: "Item In-Active",
              description: `Selected item is in-active `,
            });
          }
        } else {
          setInputParam({ ...inputParam, itemcode: null, itemname: null });
          notification.error({
            message: "Incorrect Item Code",
            description: `No such item exist`,
          });
        }
      }
    );
  };

  const onfetchItemData = async () => {
    let data = await invGetDataItemRates(
      CompCode,
      inputParam.branch,
      inputParam.itemcode
    );
    let tdata = data.map((aa, i) => {
      return {
        ...aa,
        NewMRP: null,
        NewSalePrice: null,
        IsDirty: false,
        key: i + 1,
      };
    });

    setTableData([...tdata]);
    return tdata;
  };

  const onGetItemCode = async (data) => {
    await getItemCodeFromBarcode(CompCode, data)
      .then(async (ires) => {
        if (ires.length > 0) {
          validateItemCode(ires[0].ItemCode);
        } else {
          notification.error({
            message: "Incorrect Code",
            description: `No such item exist with barcode: ${data}`,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        notification.error({ message: "Invalid Data", description: "Invalid" });
      });
  };

  const columns = [
    { title: "Item Code", dataIndex: "ItemCode", width: 100 },
    { title: "Item Name", dataIndex: "ItemName" },
    {
      title: "InwardSeq",
      dataIndex: "InwardSeq",
      width: 80,
    },
    {
      title: `Quantity`,
      dataIndex: "CurrentStock",
      align: "right",
      width: 130,
    },
    {
      title: `Cost `,
      dataIndex: "Cost",
      align: "right",
      width: 120,
      render: (text, record) => {
        return <div readOnly>{record.Cost}</div>;
      },
    },

    {
      title: `MRP`,
      dataIndex: "MRP",
      align: "right",
      width: 120,
      render: (text, record) => {
        return <div readOnly>{record.MRP}</div>;
      },
    },
    {
      title: `Sale`,
      dataIndex: "Sale",
      align: "right",
      width: 120,
      render: (text, record) => {
        return <div readOnly>{record.Sale}</div>;
      },
    },

    {
      title: `New MRP`,
      align: "right",
      width: 150,
      render: (text, record) => {
        return (
          <InputNumber
            className="w-full"
            placeholder="Enter New MRP"
            value={record.NewMRP}
            onChange={(val) => handleNewMRPChange(record, val)}
          />
        );
      },
    },
    {
      title: `New Sale Price`,
      align: "right",
      width: 150,
      render: (text, record) => {
        return (
          <InputNumber
            className="w-full"
            placeholder="Enter New Sale Price"
            value={record.NewSalePrice}
            onChange={(val) => handleNewSalePriceChange(record, val)}
          />
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Col span={24}>
          <CardHeader title={currTran.formTitle} />
          <Card bordered={true} bodyStyle={{ padding: 0, margin: 3 }}>
            <Row style={{ margin: 3 }}>
              <Col style={{ display: "flex", alignItems: "center" }}>
                <Col style={{ marginRight: 5 }}>Branch :</Col>
                <Col>
                  <Select
                    disabled={tableData.length > 0}
                    placeholder="Select Branch"
                    style={{ width: 250 }}
                    value={inputParam.branch}
                    onChange={(val) => {
                      setInputParam({ ...inputParam, branch: val });
                      if (val) {
                        getInvItemMasterData(CompCode, val).then((res1) => {
                          setItemsData([...res1]);
                        });
                      }
                    }}
                  >
                    {branchData.length > 0 &&
                      branchData.map((aa) => {
                        return (
                          <Option value={aa.BranchCode} key={aa.BranchCode}>
                            {aa.BranchName}
                          </Option>
                        );
                      })}
                  </Select>
                </Col>
              </Col>
              <Col
                style={{ display: "flex", alignItems: "center", marginLeft: 8 }}
              >
                <Col style={{ marginRight: 3 }}>Product :</Col>
                <Col style={{ display: "flex" }}>
                  <Input
                    disabled={tableData.length > 0}
                    style={{ width: 200 }}
                    value={inputParam.itemcode}
                    onChange={(e) => {
                      setInputParam({
                        ...inputParam,
                        itemcode: e.target.value,
                      });
                    }}
                    addonBefore={
                      <div
                        className={`${
                          tableData.length > 0
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          if (tableData.length <= 0) {
                            setModal(true);
                          }
                        }}
                      >
                        <Tooltip title="Search Items">
                          <i>
                            <ShoppingCartOutlined />
                          </i>
                        </Tooltip>
                      </div>
                    }
                    onKeyDown={(event) => {
                      // console.log(event.keyCode, "sss");
                      if (
                        event.keyCode === 13 ||
                        (!event.shiftKey && event.keyCode === 9)
                      ) {
                        if (
                          !_.includes([null, "", undefined], event.target.value)
                        ) {
                          event.preventDefault();
                          onGetItemCode(event.target.value);
                        } else {
                          setInputParam({
                            ...inputParam,
                            itemcode: null,
                            itemname: null,
                          });
                        }
                      }
                      // setIsDisable(true)
                    }}
                    placeholder={"Item Code"}
                  />

                  <Input
                    readOnly
                    style={{}}
                    value={inputParam.itemname}
                    placeholder="Item Name"
                  />
                </Col>
              </Col>
              <Col style={{ marginLeft: 8 }}>
                <Button
                  disabled={
                    tableData.length > 0 ||
                    _.includes([null, undefined, ""], inputParam.itemcode) ||
                    _.includes([null, undefined, ""], inputParam.branch)
                  }
                  icon={<SearchOutlined />}
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={async () => {
                    setIsLoading(true);
                    let data = await onfetchItemData();
                    if (data.length <= 0) {
                      notification.warning({
                        message: "Not Enough Quantity",
                        description:
                          "This Item does not have enough stock quantity",
                      });
                    }
                    setIsLoading(false);
                  }}
                >
                  Show
                </Button>
                <Button
                  icon={<RetweetOutlined />}
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    setInputParam({
                      ...inputParam,
                      branch: null,
                      itemcode: null,
                      itemname: null,
                      // depart:deptcode
                    });
                    setTableData([]);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Card>
          <Card bordered={true} bodyStyle={{ padding: 0, margin: 3 }}>
            <Row style={{ display: "flex", marginBottom: 5 }}>
              <Col span={24}>
                <div>
                  <Table
                    loading={IsLoading}
                    size="small"
                    rowKey="InwardSeq"
                    bordered
                    className="custom-pagination"
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                  />
                </div>
                <div>
                  <Button
                    disabled={
                      !hasRightToBeUsedNext(l_ModuleRights.Rights, "EDIT") ||
                      tableData.filter((aa) => aa.IsDirty === true).length <= 0
                      // _.includes([null, undefined, ""], inputParam.itemcode)
                    }
                    icon={<SaveFilled />}
                    type="primary"
                    style={{ margin: 6, float: "right" }}
                    onClick={() => {
                      if (
                        tableData.filter(
                          (aa) =>
                            _.includes([null, undefined, ""], aa.NewMRP) ||
                            _.includes([null, undefined, ""], aa.NewSalePrice)
                        ).length > 0
                      ) {
                        notification.error({
                          message: "Required Fields are Empty",
                          description: (
                            <span>
                              Input's with (
                              <span style={{ color: "red" }}> * </span> ) cannot
                              be empty
                            </span>
                          ),
                          duration: 1,
                        });
                      } else {
                        setIsLoading(true);
                        let tempAdjustmentHdr = {
                          VoucherDate: moment().format("YYYY-MM-DD"),
                          VoucherNo: null,
                          VoucherId: null,
                          CompCode: CompCode,
                          BranchCode: inputParam.branch,
                          DeptCode: inputParam.deptcode,
                          AdjustmentType: "RADJ",
                          Remark: null,
                          ReasonCode: null,
                          SysOption1: null,
                          SysOption2: null,
                          SysOption3: null,
                          SysOption4: null,
                          SysOption5: null,
                          UpdtUsr: l_loginUser,
                        };
                        let tempAdjustmentDtl = [];
                        for (let index = 1; index <= 2; index++) {
                          tableData.map((aa) => {
                            return tempAdjustmentDtl.push({
                              RIType: index === 1 ? "I" : "R",
                              SrNo: 1,
                              ItemCode: inputParam.itemcode,
                              ScannedBarcode: null,
                              InwardSeq: aa.InwardSeq,
                              BatchNo: null,
                              ExpiryDate: null,
                              Qty: 0,
                              CostPrice: aa.Cost,
                              SalePrice:
                                index === 1 ? aa.SalePrice : aa.NewSalePrice,
                              MRP: index === 1 ? aa.MRP : aa.NewMRP,
                              SysOption2: null,
                              SysOption3: null,
                              SysOption4: null,
                              SysOption5: null,
                              SysOption6: null,
                              SysOption7: null,
                              SysOption8: null,
                              SysOption9: null,
                              SysOption10: null,
                              UpdtUsr: l_loginUser,
                            });
                          });
                        }
                        let tdata = {
                          AdjustmentHdr: tempAdjustmentHdr,
                          AdjustmentDtl: tempAdjustmentDtl,
                          AdjustmentPrevDtl: [],
                          CompCode: CompCode,
                        };
                        InvSaveAdjustments(CompCode, tdata).then((aa) => {
                          notification.success({
                            message: "Succesfull",
                            description: "Data saved Successfully, ",
                          });
                          onfetchItemData();
                          setIsLoading(false);
                        });
                      }
                    }}
                    // disabled={_.includes([null, ""], tableData)}
                  >
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
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
            selectType={"radio"}
            branch={inputParam.branch}
            onItemSelect={(data) => {
              if (data) {
                console.log(data);
                setIsLoading(true);
                setInputParam({
                  ...inputParam,
                  itemcode: data.ItemCode,
                  itemname: data.ItemName,
                });
                setModal(false);
                setIsLoading(false);
              }
            }}
            onBackPress={() => {
              setModal(false);
            }}
          />
        </Modal>
      </Row>
    </>
  );
};

export default RateChangePage;
