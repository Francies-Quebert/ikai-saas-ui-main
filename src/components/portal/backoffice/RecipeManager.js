import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Select,
  Divider,
  Input,
  Tag,
  Table,
  Modal,
  message,
  Skeleton,
  Tooltip,
  Popconfirm,
} from "antd";
import CardHeader from "../../common/CardHeader";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import {
  SaveOutlined,
  DeleteOutlined,
  RetweetOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditTwoTone,
} from "@ant-design/icons";
import {
  DeleteReciepeMgmtDtl,
  fetchMenulist,
  fetchReceipeMenuVariationInfo,
  fetchRestaurantGetRecipeConsumptionDtl,
  InsUpdtReceipeManager,
} from "../../../services/receipe-master";
import _ from "lodash";
import SelectableItem from "./OpeningStock/Component/SelectableItem";
import { getInvItemMasterData } from "../../../services/opening-stock";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import { EditableCell, EditableRow } from "../../common/AntTableRowColEdit";
import swal from "sweetalert";

const ReciepeManager = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const { TextArea } = Input;
  const [menuData, setMenuData] = useState([]);
  const [menuCode, setMenuCode] = useState();
  const [branch, setBranch] = useState();
  const [loading, setLoading] = useState(false);
  const [reciepeData, setReciepeData] = useState([]);
  const [columns, setColoumns] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [modal, setModal] = useState(false);
  const [hdrData, setHdrData] = useState({
    recipeId: 0,
    cookingSteps: "",
    ingredients: "",
    remark: "",
  });
  const currentTran = useSelector((state) => state.currentTran);
  const branchMaster = useSelector((state) => state.branchMaster.branchMaster);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  // console.log(hdrData, "sssssssssss");
  const [ReciepeId, setReciepeId] = useState();
  useEffect(() => {
    dispatch(setFormCaption(91));
    dispatch(fetchBranchMaster());
    fetchMenulist(CompCode).then((res) => {
      setMenuData(res);
      // console.log(res, "menu fetch");
    });
    getInvItemMasterData(CompCode,"ANDHERI").then((res1) => {
      setItemsData(res1);
    });
  }, []);

  const fetchReceipeData = (menucode) => {
    setLoading(true);
    if (menucode) {
      let tempColoums = [
        {
          title: "Item Code",
          dataIndex: "ItemCode",
          align: "center",
          width: "98px",
          // render: (value, record) => {
          //   console.log(record, "itemCIde");
          //   return (
          //     <div>{record.IsDeleted !== "Y" ? record.ItemCode : null}</div>
          //   );
          // },
        },
        {
          title: "Item Name",
          dataIndex: "ItemName",
          align: "center",
        },
        {
          title: "Unit",
          dataIndex: "UnitDesc",
          align: "center",
          width: "110px",
        },
      ];
      //Fetch Variation for the menu
      fetchReceipeMenuVariationInfo(CompCode,menucode).then((res) => {
        if (res.length > 0) {
          res.map((item) => {
            tempColoums.push({
              title: `Qty [${item.VariationDesc}]`,
              dataIndex: `qtyVar${item.VariationCode}`,
              align: "right",
              width: "110px",
              editable: true,
              isRequired: true,
              isNumber: true,
            });
          });
        } else {
          tempColoums.push({
            title: "Qty",
            dataIndex: "qty",
            align: "right",
            width: "110px",
            editable: true,
            isRequired: true,
            isNumber: true,
          });
        }

        setColoumns([
          ...tempColoums,
          {
            title: "",
            align: "center",
            width: 10,
            render: (record) => {
              return (
                <div>
                  <Popconfirm
                    title="Are You Sure You Want To Delete"
                    onConfirm={() => {
                      record.IsDeleted = "Y";
                      record.isDirty = true;
                      handleDelete(record);
                     
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined className="color-style" />
                  </Popconfirm>
                </div>
              );
            },
          },
        ]);

        //fetch previously saved data to prepare table data
        fetchRestaurantGetRecipeConsumptionDtl(CompCode,branch, menucode).then((res) => {
          if (res[0].length > 0) {
            setHdrData({
              recipeId: res[0][0].ReciepeId,
              ingredients: res[0][0].Ingredients,
              cookingSteps: res[0][0].CookingSteps,
              remark: res[0][0].Remark,
            });
          }
          if (res[1].length > 0) {
            let tempTableData = [];
            let columnsList = [
              "RecipeId",
              "IsDeleted",
              "ItemCode",
              "ItemName",
              "ItemDesc",
              "UnitCode",
              "UnitDesc",
            ];
            tempColoums
              .filter((ll) => ll.dataIndex.startsWith("qty"))
              .forEach((col) => {
                columnsList.push(col.dataIndex);
              });

            res[1].map((recipeItem) => {
              let dataIndex = tempTableData.findIndex(
                (ii) => ii.ItemCode === recipeItem.ItemCode
              );

              if (dataIndex >= 0) {
                columnsList.map((sa1) => {
                  if (sa1.startsWith("qty")) {
                    if (recipeItem.VariationCode) {
                      if (
                        recipeItem.VariationCode === sa1.replace("qtyVar", "")
                      ) {
                        tempTableData[dataIndex] = {
                          ...tempTableData[dataIndex],
                          [sa1]: recipeItem.ConsumptionQty,
                        };
                      }
                    } else {
                    }
                  }
                });
              } else {
                tempTableData.push({
                  key: tempTableData.length,
                  RecipeId: res[0][0].ReciepeId,
                  ItemCode: recipeItem.ItemCode,
                  ItemName: recipeItem.ItemName,
                  ItemDesc: recipeItem.ItemDesc,
                  UnitCode: recipeItem.UnitCode,
                  UnitDesc: recipeItem.UnitDesc,
                  FromDatabase: true,
                });
                columnsList.map((sa1) => {
                  if (sa1.startsWith("qty")) {
                    if (recipeItem.VariationCode) {
                      if (
                        recipeItem.VariationCode === sa1.replace("qtyVar", "")
                      ) {
                        tempTableData[tempTableData.length - 1] = {
                          ...tempTableData[tempTableData.length - 1],
                          [sa1]: recipeItem.ConsumptionQty,
                        };
                      }
                    } else {
                      tempTableData[tempTableData.length - 1] = {
                        ...tempTableData[tempTableData.length - 1],
                        [sa1]: recipeItem.ConsumptionQty,
                      };
                    }
                  }
                });
              }
            });
            setReciepeData(tempTableData);
          }
        });
      });

      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    if (record.FromDatabase) {
      DeleteReciepeMgmtDtl(CompCode,record).then((res) => {
        if (res.message === "successful") {
          fetchReceipeData(menuCode);
        }
        //console.log("ss");
      });
    } else {
      const newData = [...reciepeData];
      newData[newData.findIndex((ii) => ii.key === record.key)] = record;
      setReciepeData([...newData]);
    }
  };

  const handleAdd = (data) => {
    const newData = [...reciepeData];
    newData.push({
      key: newData.length,
      Id: 0,
      ItemCode: data.ItemCode,
      ItemName: data.ItemName,
      UnitCode: data.UnitCode,
      UnitDesc: data.UnitDesc,
      isDirty: true,
      FromDatabase: false,
    });
    setReciepeData(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
        isRequired: col.isRequired,
        isNumber: col.isNumber,
      }),
    };
  });
  // const onError = (row) => {
  //   if (row.errorFields.length > 0) {
  //     message.error("Fill the Details");
  //   }
  // };

  const handleSave = (row) => {
    const newData = [...reciepeData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row, isDirty: row.isDirty });
    setReciepeData(newData);
  };

  const onSave = () => {
    setLoading(true);
    let data = {
      reciepeHdr: null,
      reciepeDtl: [],
      updtUsr: l_loginUser,
    };
    data.reciepeHdr = {
      CompCode: CompCode,
      BranchCode: branch,
      ReciepeId: hdrData.recipeId,
      MenuCode: menuCode,
      Ingredients: hdrData.ingredients,
      CookingSteps: hdrData.cookingSteps,
      Remark: hdrData.remark,
    };

    reciepeData
      .filter((ll) => ll.isDirty === true || ll.IsDeleted === "Y")
      .forEach((row) => {
        for (var key of Object.keys(row)) {
          if (key.startsWith("qty")) {
            data.reciepeDtl.push({
              ReciepeId: hdrData.recipeId,
              ItemCode: row.ItemCode,
              UnitCode: row.UnitCode,
              VariationCode: key.startsWith("qtyVar")
                ? key.replace("qtyVar", "")
                : null,
              Remark: "",
              ConsumptionQty: parseFloat(row[key]).toFixed(3),
            });
          }
        }
      });

    swal("Are you sure you want to save this ..!", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtReceipeManager(CompCode,data).then((res) => {
          if (res.message === "successful") {
            fetchReceipeData(menuCode);
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
          } else if (res.message === "unsuccessful") {
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
        });
      }
      setLoading(false);
    });
  };

  return (
    <>
      <CardHeader title={currentTran.formTitle} />
      <Card bordered={true} bodyStyle={{ padding: 0 }}>
        <Row style={{ margin: " 5px 0px 0 0px" }}>
          <Col style={{ marginRight: 5 }}>
            <label style={{ margin: 6 }}>Branch :</label>
            <Select
              allowClear={true}
              value={branch}
              showSearch
              disabled={reciepeData.length > 0}
              style={{ width: 250 }}
              placeholder="Select Branch"
              onChange={(val) => {
                setBranch(val);
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
            </Select>
          </Col>
          <Col style={{ marginRight: 5 }}>
            <label style={{ margin: 6 }}>Menu :</label>
            <Select
              allowClear={true}
              value={menuCode}
              showSearch
              disabled={reciepeData.length > 0}
              style={{ width: 250 }}
              placeholder="Select Menu"
              onChange={(val) => {
                setMenuCode(val);
              }}
            >
              {menuData.length > 0 &&
                menuData.map((i) => {
                  return (
                    <Option key={i.MenuCode} value={i.MenuCode}>
                      {i.MenuName}
                    </Option>
                  );
                })}
            </Select>
            
          </Col>
          <Col>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              style={{ marginRight: 5 }}
              disabled={reciepeData.length > 0 || !branch || !menuCode}
              onClick={() => {
                fetchReceipeData(menuCode);
              }}
            >
              Show
            </Button>
            <Button
              icon={<RetweetOutlined />}
              type="primary"
              style={{ marginRight: 5 }}
              onClick={() => {
                setBranch();
                setMenuCode();
                setColoumns([]);
                setReciepeData([]);
                setHdrData({
                  recipeId: 0,
                  remark: null,
                  cookingSteps: null,
                  ingredients: null,
                });
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>
        <Divider type="horizontal" style={{ marginBottom: 5, marginTop: 5 }} />
        {reciepeData && columns.length > 0 && (
          <>
            <Row>
              <Col
                xs={24}
                sm={24}
                md={14}
                lg={16}
                xl={16}
                style={{ padding: "0px 5px 0px 5px" }}
              >
                <Row style={{ marginBottom: 5 }}>
                  <Button
                    // size="small"
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setModal(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.keyCode === 13 || event.keyCode === 9) {
                        const form = event.target.form;
                        const index = Array.prototype.indexOf.call(
                          form,
                          event.target
                        );
                        form.elements[index + 1].focus();
                      }
                    }}
                  >
                    Add Item
                  </Button>
                </Row>
                <Row>
                  {columns.length > 0 && (
                    <Table
                      style={{ flex: 1 }}
                      // size="small"
                      loading={loading}
                      bordered
                      components={components}
                      rowClassName="editable-row"
                      dataSource={
                        reciepeData.filter((i) => i.IsDeleted !== "Y").length >
                        0
                          ? reciepeData
                          : null
                      }
                      pagination={false}
                      columns={mergedColumns}
                      // onRow={(record, rowIndex) => {
                      //   return {
                      //     onClick: (event) => {console.log('onClick',event)}, // click row
                      //      onDoubleClick: (event) => {console.log('onDoubleClick',event)}, // double click row
                      //     onContextMenu: (event) => {console.log('onButtonCLick',event)}, // right button click row
                      //     onMouseEnter: (event) => {console.log('onMouseEnter',event)}, // mouse enter row
                      //     onMouseLeave: (event) => {console.log('onMouseLeave',event)}, // mouse leave row
                      //   };
                      // }}
                      // onHeaderRow={(column) => {
                      //   return {
                      //     onClick: () => {
                      //     }, // click header row
                      //   };
                      // }}
                    />
                  )}
                </Row>
              </Col>
              <Col xs={24} sm={24} md={10} lg={8} xl={8}>
                <Row style={{ display: "block" }}>
                  <Col>
                    <Card
                      size="small"
                      bodyStyle={{ padding: 5 }}
                      title="Ingredients"
                    >
                      {loading && <Skeleton active />}
                      {!loading && (
                        <Input.TextArea
                          rows={4}
                          value={hdrData.ingredients}
                          placeholder="Ingredients"
                          onChange={(e) => {
                            setHdrData({
                              ...hdrData,
                              ingredients: e.target.value,
                            });
                          }}
                        />
                      )}
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      bodyStyle={{ padding: 5 }}
                      size="small"
                      title="Cooking Steps"
                    >
                      {loading && <Skeleton active />}
                      {!loading && (
                        <Input.TextArea
                          rows={4}
                          value={hdrData.cookingSteps}
                          placeholder="Cooking Steps"
                          onChange={(e) => {
                            setHdrData({
                              ...hdrData,
                              cookingSteps: e.target.value,
                            });
                          }}
                        />
                      )}
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      bodyStyle={{ padding: 5 }}
                      size="small"
                      title="Remarks"
                    >
                      {loading && <Skeleton active />}
                      {!loading && (
                        <Input.TextArea
                          rows={4}
                          value={hdrData.remark}
                          placeholder="Remarks"
                          onChange={(e) => {
                            setHdrData({
                              ...hdrData,
                              remark: e.target.value,
                            });
                          }}
                        />
                      )}
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Divider
              type="horizontal"
              style={{ marginBottom: 5, marginTop: 5 }}
            />
            <Row>
              <Col
                style={{
                  padding: "0px 0px 5px 5px",
                }}
              >
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    onSave();
                  }}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </>
        )}
        {modal && (
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
              reciepeData={reciepeData}
              data={itemsData}
              onItemSelect={(data) => {
                handleAdd(data);
                setModal(false);
              }}
              onBackPress={() => {
                setModal(false);
              }}
            />
          </Modal>
        )}
      </Card>
    </>
  );
};

export default ReciepeManager;
