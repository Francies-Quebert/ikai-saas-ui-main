import React, { Fragment, useEffect, useState } from "react";
import {
  Form,
  Button,
  Spin,
  Row,
  Col,
  Card,
  Select,
  Modal,
  Tabs,
  Empty,
  Skeleton,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { useSelector, useDispatch } from "react-redux";
import { fetchSectionMaster } from "../../../../services/section-master";
import {
  fetchMenuRateMap,
  InsUpdtMenuRateMapp,
} from "../../../../services/menu-rate-mapp";
import { toast } from "react-toastify";
import {
  SearchOutlined,
  LoadingOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { hasRight, sysGenCode } from "../../../../shared/utility";
import { fetchSequenceNextVal } from "../../../../store/actions/sys-sequence-config";
import MenuRateTable from "./MenuRateTable";
import { reInitialize } from "../../../../store/actions/currentTran";
import MenuCategoryMasterCard from "../MenuCategoryMaster/MenuCategoryMasterCard";
import MenuMasterCard from "../MenuMaster/MenuMasterCard";
import MenuOtherMasterCard from "../MenuOtherMaster/MenuOtherMasterCard";
import AppLoader from "../../../common/AppLoader";
const { Option } = Select;
const { TabPane } = Tabs;

const MenuRateMappCard = (props) => {
  const dispatch = useDispatch();
  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("0");
  const [selectedDept, setSelectedDept] = useState("0");
  const [selectedSection, setSelectedSection] = useState("0");
  const [sectionmaster, setSectionMaster] = useState([]);
  const [menuRateMapData, setMenuRateMappData] = useState([]);
  const [menuTabs, setMenuTabs] = useState([]);
  const [menuModal, setMenuModal] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const [varGroupModal, setVarGroupModal] = useState(false);
  const [tranType, setTranType] = useState();

  //useSelector
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currentTran = useSelector((state) => state.currentTran);
  const MenuMaster = useSelector((state) => state.MenuMaster.menuMaster);
  const branchmaster = useSelector((state) => state.branchMaster.branchMaster);
  const deptmaster = useSelector((state) => state.deptMaster.deptMaster);
  const currTran = useSelector((state) => state.currentTran);
  const [addEditMenuMaster, setAddEditMenuMaster] = useState();
  const menucatmaster = useSelector(
    (state) => state.menuCategoryMaster.menuCategoryMaster
  );
  const sysConfig = useSelector((state) => state.AppMain.sysSequenceConfig);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;

  useEffect(() => {
    if (currentTran.isSuccess) {
      setIsLoading(true);
      // onReset();
      fetchMenuRateMap(
        CompCode,
        selectedBranch,
        selectedDept,
        selectedSection
      ).then((res) => {
        setMenuRateMappData(res);

        let temp = [];

        [...new Set(res.map((i) => i.MenuCatCode))].map((item) => {
          menucatmaster
            .filter((ii) => ii.MenuCatCode === item)
            .map((iii) => {
              temp = [...temp, iii];
            });
        });
        setMenuTabs(temp);
      });
      dispatch(reInitialize());
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);

  useEffect(() => {
    fetchSectionMaster(CompCode).then((res) => {
      setSectionMaster(res);
    });
  }, []);

  useEffect(() => {
    fnSetDefault();
  }, [menucatmaster]);

  const fnSetDefault = () => {
    try {
      if (menucatmaster.length > 0) {
        setIsLoading(true);
        fetchMenuRateMap(
          CompCode,
          selectedBranch,
          selectedDept,
          selectedSection
        )
          .then((res) => {
            setMenuRateMappData(res);
            console.log(res,[...new Set(res.map((i) => i.MenuCatCode))]);
            let temp = [];
            [...new Set(res.map((i) => i.MenuCatCode))].map((item) => {
              menucatmaster
                .filter((ii) => ii.MenuCatCode === item)
                .map((iii) => {
                  temp = [...temp, iii];
                });
            });
            setMenuTabs(temp);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onReset = () => {
    setSelectedBranch("0");
    setSelectedDept("0");
    setSelectedSection("0");
    setMenuRateMappData([]);
  };

  return (
    <div>
      {/* <Spin indicator={antIcon} spinning={isLoading}> */}
      <Row>
        <Col span={24}>
          <CardHeader title={currTran.formTitle} />
          <Card bordered={true} bodyStyle={{ padding: 8, margin: 3 }}>
            <Select
              disabled={menuRateMapData.length > 0}
              allowClear={true}
              showSearch
              style={{ width: 250, marginRight: 10 }}
              placeholder="Select Branch"
              onChange={(val) => {
                setSelectedBranch(val);
              }}
              value={selectedBranch}
              defaultValue={"0"}
            >
              {branchmaster.map((ii) => (
                <Option key={ii.BranchCode} value={ii.BranchCode}>
                  {ii.BranchName}
                </Option>
              ))}
              <Option key="1" value="0">
                All
              </Option>
            </Select>

            <Select
              onChange={(val) => {
                setSelectedDept(val);
              }}
              disabled={!selectedBranch || menuRateMapData.length > 0}
              allowClear={true}
              showSearch
              value={selectedDept}
              defaultValue={"0"}
              style={{ width: 200, marginRight: 10 }}
              placeholder="Select Department"
            >
              {/* {deptmaster.map((ii) => (
                  <Option key={ii.DeptCode} value={ii.DeptCode}>
                    {ii.DeptName}
                  </Option>
                ))} */}
              <Option key="DINEIN" value="DINEIN">
                Dine In
              </Option>
              <Option key="DELIVERY" value="DELIVERY">
                Delivery
              </Option>
              <Option key="PICKUP" value="PICKUP">
                Pick Up
              </Option>
              <Option key="ONLINE" value="ONLINE">
                Online Orders
              </Option>
              <Option key="2" value="0">
                All
              </Option>
            </Select>

            <Select
              onChange={(val) => {
                setSelectedSection(val);
                if (selectedDept !== "DINEIN" && selectedDept !== "0") {
                  setSelectedDept("0");
                }
              }}
              disabled={
                menuRateMapData.length > 0 ||
                (selectedDept !== "DINEIN" && selectedDept !== "0")
                  ? true
                  : false
              }
              allowClear={true}
              showSearch
              value={selectedSection}
              defaultValue={"0"}
              style={{ width: 200, marginRight: 10 }}
              placeholder="Select section"
            >
              {sectionmaster.map((ii) => (
                <Option key={ii.SecCode} value={ii.SecCode}>
                  {ii.SecDesc}
                </Option>
              ))}
              <Option key="3" value="0">
                All
              </Option>
            </Select>
            <Button
              disabled={
                // !selectedBranch ||
                // !selectedDept ||
                // !selectedSection ||
                menuRateMapData.length > 0
              }
              icon={<SearchOutlined />}
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => {
                setIsLoading(true);
                fetchMenuRateMap(
                  CompCode,
                  selectedBranch,
                  selectedDept,
                  selectedSection ? selectedSection : "0"
                )
                  .then((res) => {
                    setMenuRateMappData(res);
                    let temp = [];
                    [...new Set(res.map((i) => i.MenuCatCode))].map((item) => {
                      menucatmaster
                        .filter((ii) => ii.MenuCatCode === item)
                        .map((iii) => {
                          temp = [...temp, iii];
                        });
                    });
                    setMenuTabs(temp);
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
            >
              Show
            </Button>
          </Card>
          <Row>
            <Col span={24}>
              <Card
                bordered={true}
                bodyStyle={{ padding: "8px 8px 0px 8px", margin: 3 }}
              >
                <Row>
                  <Col
                    xl={8}
                    lg={8}
                    md={8}
                    sm={24}
                    xs={24}
                    style={{ marginBottom: 5 }}
                  >
                    <Button
                      type="primary"
                      // disabled={menuRateMapData.length > 0}
                      icon={<RetweetOutlined />}
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        onReset();
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        try {
                          setIsLoading(true);
                          let data = {
                            MenuRateMapp: [],
                            MenuRateVarMapp: [],
                            updtUsr: "",
                          };
                          menuRateMapData.map((menu) => {
                            if (menu.isDirty) {
                              data.MenuRateMapp.push({
                                BranchCode: selectedBranch,
                                DeptCode: selectedDept,
                                SecCode: selectedSection
                                  ? selectedSection
                                  : "0",
                                MenuCode: menu.MenuCode,
                                Rate: menu.Rate,
                              });
                            }
                            menu.childrens.map((menuVar) => {
                              if (menuVar.isDirty) {
                                data.MenuRateVarMapp.push({
                                  BranchCode: selectedBranch,
                                  DeptCode: selectedDept,
                                  SecCode: selectedSection
                                    ? selectedSection
                                    : "0",
                                  MenuCode: menuVar.MenuCode,
                                  VariationCode: menuVar.VariationCode,
                                  Rate: menuVar.Rate,
                                });
                              }
                            });
                          });

                          dispatch(InsUpdtMenuRateMapp(CompCode, data));
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      Save
                    </Button>
                  </Col>
                  <Col
                    xl={14}
                    lg={14}
                    md={14}
                    sm={24}
                    xs={24}
                    style={{ marginBottom: 5 }}
                  >
                    <Button
                      disabled={hasRight(currTran.moduleRights, "ADD")}
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      style={{ marginBottom: 3, marginRight: 5 }}
                      onClick={() => {
                        if (sysGenCode(sysConfig, "MENU")) {
                          dispatch(fetchSequenceNextVal("MENU"));
                        }
                        setAddEditMenuMaster({ entryMode: "A" });
                        setMenuModal(true);
                      }}
                    >
                      Add Menu
                    </Button>
                    <Button
                      disabled={hasRight(currTran.moduleRights, "ADD")}
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      style={{ marginBottom: 3, marginRight: 5 }}
                      onClick={() => {
                        setVarGroupModal(true);
                        setTranType({
                          entryMode: "A",
                          trnType: "VAR",
                          title: "Add Variation",
                        });
                      }}
                    >
                      Add Variation
                    </Button>
                    <Button
                      disabled={hasRight(currTran.moduleRights, "ADD")}
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      style={{ marginRight: 5, marginBottom: 3 }}
                      onClick={() => {
                        setVarGroupModal(true);
                        setTranType({
                          entryMode: "A",
                          trnType: "MGRP",
                          title: "Add Menu Group",
                        });
                      }}
                    >
                      Add Group
                    </Button>
                    <Button
                      disabled={hasRight(currTran.moduleRights, "ADD")}
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        setCatModal(true);
                      }}
                    >
                      Add Category
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Card bodyStyle={{ padding: "12px 10px" }}>
            {isLoading && <AppLoader />}

            {isLoading == false && menuRateMapData.length <= 0 && (
              <Empty style={{ height: 250 }} />
            )}

            {!isLoading && menuRateMapData.length > 0 && (
              <Tabs tabPosition={"left"} tabBarStyle={{ textAlign: "left" }}>
                {menuTabs.length > 0 &&
                  menuTabs.map((ii) => {
                    return (
                      <TabPane
                        tab={ii.MenuCatName}
                        key={ii.MenuCatCode}
                        forceRender={true}
                      >
                        <MenuRateTable
                          loading={isLoading}
                          onMenuEdit={(vv) => {
                            setMenuModal(true);
                            setAddEditMenuMaster({
                              entryMode: "E",
                              formData: { MenuCode: vv },
                            });
                          }}
                          data={menuRateMapData.filter(
                            (i) => i.MenuCatCode === ii.MenuCatCode
                          )}
                        />
                      </TabPane>
                    );
                  })}
              </Tabs>
            )}
            {menuModal && (
              <Modal
                closable={true}
                visible={menuModal}
                onCancel={() => setMenuModal(false)}
                footer={null}
                width={"80%"}
                bodyStyle={{ padding: "0px 15px" }}
                destroyOnClose={true}
              >
                <MenuMasterCard
                  title={"Add Menu"}
                  entryMode={addEditMenuMaster && addEditMenuMaster.entryMode}
                  formData={
                    addEditMenuMaster && addEditMenuMaster.entryMode === "E"
                      ? addEditMenuMaster.formData
                      : undefined
                  }
                  onBackPress={() => {
                    setMenuModal(false);
                  }}
                />
              </Modal>
            )}

            <Modal
              closable={false}
              visible={catModal}
              onCancel={() => setCatModal(false)}
              footer={null}
              width={"80%"}
              bodyStyle={{ padding: "0px 15px" }}
              destroyOnClose={true}
            >
              <MenuCategoryMasterCard
                title={"Add New Category"}
                entryMode={"A"}
                onBackPress={() => {
                  setCatModal(false);
                }}
                onSavePress={(val) => {}}
              />
            </Modal>
            <Modal
              closable={false}
              visible={varGroupModal}
              onCancel={() => setVarGroupModal(false)}
              footer={null}
              width={"75%"}
              bodyStyle={{ padding: "0px 15px" }}
              destroyOnClose={true}
            >
              <MenuOtherMasterCard
                title={tranType && tranType.title}
                trnType={tranType && tranType.trnType}
                entryMode={tranType && tranType.entryMode}
                onBackPress={() => {
                  setVarGroupModal(false);
                }}
              />
            </Modal>
          </Card>
        </Col>
      </Row>
      {/* </Spin> */}
    </div>
  );
};

export default MenuRateMappCard;
