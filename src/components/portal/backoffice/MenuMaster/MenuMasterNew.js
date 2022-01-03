import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Input,
  Spin,
  Select,
  Switch,
  Checkbox,
  Tooltip,
  Modal,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
  FileAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtMenuMst } from "../../../../store/actions/MenuMaster";
import {
  fetchMenuMasterCard,
  getMenuMasterServices,
  InsUpdtMenuMaster,
} from "../../../../services/menu-master";
import MenuMasterTabsCard from "./MenuMasterTabsCard";
// import { getTableData, deletedBarcode } from "./Me";
import { sendFireBaseData, deletedFireBaseData } from "./MenuUploadImage";
import AppLoader from "../../../common/AppLoader";
import SweetAlert from "react-bootstrap-sweetalert";
import { setVariatonData } from "./MenuVarAddOnCard";
import {
  fetchMenuVariationTab,
  fetchMenuAddOnTab,
} from "../../../../services/menu-master";
import MenuCategoryCard from "../MenuCategoryMaster/MenuCategoryMasterCard";
import MenuGroupCard from "../MenuOtherMaster/MenuOtherMasterCard";
import TaxMasterCard from "../../Administration/TaxMaster/TaxMasterCard";
import HSNSACMasterCard from "../../Administration/HSNSACmaster/hsnacCardNew";
import swal from "sweetalert";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const { TextArea } = Input;
const MenuMasterNew = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [hsnsacMaster, setHSNSACmaster] = useState([]);
  const [taxMaster, setTaxmaster] = useState([]);
  const [menuCatMaster, setMenuCatmaster] = useState([]);
  const [groupMaster, setGroupMaster] = useState([]);
  const [isResetClicked, setIsResetClicked] = useState();
  const [mCode, setMCode] = useState(
    props.formData ? props.formData.MenuCode : null
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [ssAleart, setSsAlert] = useState();
  const [variationType, setVariationType] = useState([]);
  const [addOn, setAddOn] = useState([]);
  const Autocode = useSelector(
    (state) => state.sysSequenceConfig.SequenceNextVal
  );
  const [isShowModal, setIsShowModal] = useState();
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [unitMaster, setUnitmaster] = useState([]);
  const [btnDisable, setBtnDisable] = useState({
    menuCat: !props.formData ? true : false,
    group: !props.formData ? true : false,
    class: !props.formData ? true : false,
    hsnsac: !props.formData ? true : false,
    tax: !props.formData ? true : false,
  });

  const initialValues = {
    MenuCode: "",
    ShortCode: null,
    MenuName: "",
    MenuDesc: "",
    DietType: "V",
    UnitCode: null,
    MenuCatCode: null,
    MenuGroupCode: null,
    HSNSACCode: null,
    TaxCode: null,
    ApplyForDineIn: true,
    ApplyForPickUp: true,
    ApplyForDelivery: true,
    ApplyForOnline: true,
    IsActive: true,
  };

  const onReset = () => {
    setIsResetClicked(!isResetClicked);
    form.setFieldsValue({
      ShortCode: "",
      MenuName: "",
      MenuDesc: "",
      DietType: "",
      UnitCode: "",
      MenuCatCode: "",
      MenuGroupCode: "",
      HSNSACCode: "",
      TaxCode: "",
      ApplyForDineIn: true,
      ApplyForPickUp: true,
      ApplyForDelivery: true,
      ApplyForOnline: true,
      IsActive: true,
    });
  };

  const mapData = (data) => {
    data.map(async (i) => {
      await form.setFieldsValue({
        MenuCode: i.MenuCode,
        ShortCode: i.ShortCode,
        MenuName: i.MenuName,
        MenuDesc: i.MenuDesc,
        DietType: i.DietType,
        UnitCode: i.UnitCode,
        MenuCatCode: i.MenuCatCode,
        MenuGroupCode: i.MenuGroupCode,
        HSNSACCode: i.HSNSACCode,
        TaxCode: i.TaxCode,
        ApplyForDineIn: i.ApplyForDineIn,
        ApplyForPickUp: i.ApplyForPickUp,
        ApplyForDelivery: i.ApplyForDelivery,
        ApplyForOnline: i.ApplyForOnline,
        IsActive: i.IsActive,
      });
    });
    setICodeDisable(true);
  };

  useEffect(() => {
    getMenuMasterServices(CompCode).then(async (res) => {
      try {
        await res.map((ii) => {
          if (ii.hsnsacMaster) {
            setHSNSACmaster([]);
            setHSNSACmaster(ii.hsnsacMaster);
          }
          if (ii.taxMaster) {
            setTaxmaster([]);
            setTaxmaster(ii.taxMaster);
          }
          if (ii.subCategory) {
            setMenuCatmaster([]);
            setMenuCatmaster(ii.subCategory);
          }
          if (ii.unitMaster) {
            setUnitmaster([]);
            setUnitmaster(ii.unitMaster);
          }
          if (ii.groupMaster) {
            setGroupMaster([]);
            setGroupMaster(ii.groupMaster);
          }
        });
      } catch (err) {
        console.error(err);
      }
      setIsLoadingData(false);
    });
  }, []);

  useEffect(() => {
    if (props.entryMode === "A") {
      if (Autocode.length > 0) {
        form.setFieldsValue({ MenuCode: Autocode[0].NextVal });
        setMCode(Autocode[0].NextVal);
        setICodeDisable(true);
      }
    } else if (props.entryMode === "E") {
      setMCode(props.formData.MenuCode);
    }
  }, [Autocode]);

  useEffect(() => {
    fetchMenuMasterCard(CompCode, mCode).then((resp) => {
      try {
        if (resp.length > 0) {
          if (props.entryMode === "E") {
            mapData(resp);
          }
        } else {
          mapData([]);
        }
      } catch (err) {
        console.error(err);
      }
    });
    fetchMenuVariationTab(CompCode, mCode).then((res) => {
      let temp = [];
      res.map((item) => {
        temp = [
          ...temp,
          {
            label: item.MasterDesc,
            value: item.ShortCode,
            isDirty: false,
            defValue: item.isChecked === "1" ? true : false,
          },
        ];
      });
      setVariationType(temp);
    });
    fetchMenuAddOnTab(CompCode, mCode).then((res) => {
      let temp = [];
      res.map((item) => {
        temp = [
          ...temp,
          {
            label: item.AddOnName,
            value: item.AddOnCode,
            isDirty: false,
            defValue: item.isChecked === "1" ? true : false,
          },
        ];
      });
      setAddOn(temp);
    });
  }, [mCode]);

  const onFinish = (values) => {
    setVariatonData();
    const data = {
      val: {
        MenuCode: values.MenuCode.toUpperCase(),
        ShortCode: values.ShortCode,
        MenuName: values.MenuName,
        MenuDesc: values.MenuDesc,
        DietType: values.DietType,
        UnitCode: values.UnitCode,
        MenuCatCode: values.MenuCatCode,
        MenuGroupCode: values.MenuGroupCode,
        HSNSACCode: values.HSNSACCode,
        TaxCode: values.TaxCode,
        ApplyForDineIn: values.ApplyForDineIn === true ? "Y" : "N",
        ApplyForPickUp: values.ApplyForPickUp === true ? "Y" : "N",
        ApplyForDelivery: values.ApplyForDelivery === true ? "Y" : "N",
        ApplyForOnline: values.ApplyForOnline === true ? "Y" : "N",
        IsActive: values.IsActive,
        updt_usrId: l_loginUser,
      },
      iData: sendFireBaseData(),
      idData: deletedFireBaseData(),
      variationType: variationType,
      addOn: addOn,
    };

    // setVariatonData();
    // setIsLoading(true);
    // dispatch(
    //   InsUpdtMenuMst(
    //     values,
    //     sendFireBaseData(),
    //     deletedFireBaseData(),
    //     variationType,
    //     addOn
    //   )
    // );
    // props.onBackPress();

    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((resp) => {
      if (resp) {
        InsUpdtMenuMaster(CompCode, data).then((res) => {
          if (res.data.message === "successful") {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress(values);
            props.onBackPress();
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
        });
      }
    });
  };

  // useEffect(() => {
  //   if (currentTran.isSuccess) {
  //     onReset();
  //     dispatch(reInitialize());
  //     // props.onBackPress();
  //   } else if (currentTran.error) {
  //     toast.error(currentTran.error);
  //   }
  //   setIsLoading(false);
  // }, [currentTran.error, currentTran.isSuccess]);

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
    }
  };

  return (
    <>
      <Spin indicator={antIcon} spinning={isLoading}>
        {isLoadingData && <AppLoader />}
        {!isLoadingData && (
          <Row>
            <Col span={24}>
              <CardHeader
                title={props.title ? props.title : currentTran.formTitle}
              />
              <Card
                bodyStyle={{
                  padding: "0px 0px 5px 0px",
                }}
              >
                <Form
                  form={form}
                  initialValues={initialValues}
                  name="userbody"
                  labelAlign="left"
                  {...formItemLayout}
                  onFinish={onFinish}
                >
                  <Row>
                    <Col
                      xl={12}
                      lg={12}
                      md={24}
                      sm={24}
                      xs={24}
                      style={{ borderRight: "1px solid #f0f0fo" }}
                    >
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}>*</span> Menu Code :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="MenuCode"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your Menu Code",
                                  },
                                ]}
                              >
                                <Input
                                  onBlur={(val) => {
                                    if (val.target.value !== "") {
                                      setICodeDisable(true);
                                      setMCode(val.target.value);
                                    }
                                  }}
                                  placeholder="Menu Code"
                                  disabled={iCodeDisable}
                                  style={{ textTransform: "uppercase" }}
                                  onKeyDown={handleKeyDown}
                                />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}>*</span> Menu Name :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="MenuName"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your Description",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Enter Item Name"
                                  onKeyDown={handleKeyDown}
                                />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Description :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="MenuDesc"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                              >
                                <TextArea
                                  rows={3}
                                  placeholder="Enter Description"
                                />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}>*</span> Category
                            Code :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="MenuCatCode"
                                style={{
                                  marginBottom: -3,
                                  flex: 1,
                                  width: "85%",
                                }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Category Code",
                                  },
                                ]}
                              >
                                <Select
                                  onKeyDown={handleKeyDown}
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  placeholder="Please Select Category Code"
                                  onChange={(val) => {
                                    if (val) {
                                      const hh = menuCatMaster.filter(
                                        (i) => i.MenuCatCode === val
                                      );
                                      if (hh.length > 0) {
                                        form.setFieldsValue({
                                          HSNSACCode: hh[0].DefHSNSACCode,
                                          TaxCode: hh[0].DefTaxCode,
                                        });
                                        setBtnDisable({
                                          ...btnDisable,
                                          menuCat: false,
                                          hsnsac: false,
                                          tax: false,
                                        });
                                      }
                                    } else {
                                      form.setFieldsValue({
                                        MenuCatCode: null,
                                        HSNSACCode: null,
                                        TaxCode: null,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        menuCat: true,
                                        hsnsac: true,
                                        tax: true,
                                      });
                                    }
                                  }}
                                >
                                  {menuCatMaster.length > 0 &&
                                    menuCatMaster.map((ii) => {
                                      return (
                                        <Option
                                          key={`${ii.MenuCatCode}`}
                                          value={`${ii.MenuCatCode}`}
                                        >
                                          {ii.MenuCatName}
                                        </Option>
                                      );
                                    })}
                                </Select>
                              </Form.Item>
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Add New Category"
                              >
                                <Button
                                  icon={<FileAddOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  type="primary"
                                  size="small"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 61
                                    ).Rights.find((i) => i.RightCode === "ADD")
                                      .RightVal === "N"
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "CAT",
                                      entryMode: "A",
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Edit this Category"
                              >
                                <Button
                                  icon={<EditOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  size="small"
                                  type="primary"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 61
                                    ).Rights.find((i) => i.RightCode === "EDIT")
                                      .RightVal === "N" || btnDisable.menuCat
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "CAT",
                                      entryMode: "E",
                                      formData: menuCatMaster.find(
                                        (i) =>
                                          i.MenuCatCode ===
                                          form.getFieldValue("MenuCatCode")
                                      ),
                                    });
                                  }}
                                />
                              </Tooltip>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}>*</span> Group Class
                            :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="MenuGroupCode"
                                style={{
                                  marginBottom: -3,
                                  flex: 1,
                                  // maxWidth: 380,
                                  width: "85%",
                                }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Product Class",
                                  },
                                ]}
                              >
                                <Select
                                  onKeyDown={handleKeyDown}
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  placeholder="Please Select Product Class"
                                  onChange={(val) => {
                                    if (val) {
                                      setBtnDisable({
                                        ...btnDisable,
                                        class: false,
                                      });
                                    } else {
                                      setBtnDisable({
                                        ...btnDisable,
                                        class: true,
                                      });
                                    }
                                  }}
                                >
                                  {groupMaster.length > 0 &&
                                    groupMaster
                                      .filter((i) => i.IsActive === true)
                                      .map((ii) => {
                                        return (
                                          <Option
                                            key={ii.ShortCode}
                                            value={ii.ShortCode}
                                          >{`${ii.MasterDesc}`}</Option>
                                        );
                                      })}
                                </Select>
                              </Form.Item>
                              {/* <div style={{ width: "10%", display: "flex" }}> */}
                              <Tooltip
                                title="Add New Menu Group"
                                style={{ width: "5%" }}
                              >
                                <Button
                                  icon={<FileAddOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  type="primary"
                                  size="small"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 63
                                    ).Rights.find((i) => i.RightCode === "ADD")
                                      .RightVal === "N"
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "GRP",
                                      entryMode: "A",
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                title="Edit this Menu Group"
                                style={{ width: "5%" }}
                              >
                                <Button
                                  icon={<EditOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  size="small"
                                  type="primary"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 63
                                    ).Rights.find((i) => i.RightCode === "EDIT")
                                      .RightVal === "N" || btnDisable.class
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "GRP",
                                      entryMode: "E",
                                      formData: groupMaster.find(
                                        (i) =>
                                          i.ShortCode ===
                                          form.getFieldValue("MenuGroupCode")
                                      ),
                                    });
                                  }}
                                />
                              </Tooltip>
                              {/* </div> */}
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Status :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                justify="center"
                                name="IsActive"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                                valuePropName="checked"
                                colon={false}
                              >
                                <Switch
                                  checkedChildren="Active"
                                  unCheckedChildren="In Active"
                                />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col
                      xl={12}
                      lg={12}
                      md={24}
                      sm={24}
                      xs={24}
                      style={{ borderLeft: "1px solid #f0f0fo" }}
                    >
                      <Card
                        bordered={false}
                        // style={{ height: "100%" }}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Short Code :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="ShortCode"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                              >
                                <Input // ref={inputRef}
                                  placeholder="Enter Short Code"
                                  onKeyDown={handleKeyDown}
                                />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}>*</span> Diet Type :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="DietType"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Diet Type",
                                  },
                                ]}
                              >
                                <Select
                                  onKeyDown={handleKeyDown}
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  placeholder="Please Select Diet Type"
                                >
                                  <Option value="V">Vegetarian</Option>
                                  <Option value="N">Non-Vegetarian</Option>
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}>*</span> HSN SAC :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="HSNSACCode"
                                style={{
                                  marginBottom: -3,
                                  flex: 1,
                                  width: "85%",
                                }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select HSN SAC",
                                  },
                                ]}
                              >
                                <Select
                                  onKeyDown={handleKeyDown}
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  placeholder="Please Select HSN SAC"
                                  onChange={(val) => {
                                    if (val) {
                                      form.setFieldsValue({
                                        TaxCode: hsnsacMaster.filter(
                                          (i) => i.hsnsaccode === val
                                        )[0].DefTaxCode,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        hsnsac: false,
                                      });
                                    } else {
                                      form.setFieldsValue({
                                        TaxCode: null,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        hsnsac: true,
                                      });
                                    }
                                  }}
                                >
                                  {hsnsacMaster.length > 0 &&
                                    hsnsacMaster
                                      .filter((i) => i.IsActive === true)
                                      .map((ii) => {
                                        return (
                                          <Option
                                            key={ii.hsnsaccode}
                                            value={ii.hsnsaccode}
                                          >{`${ii.hsnsaccode} (${ii.hsnsacdesc})`}</Option>
                                        );
                                      })}
                                </Select>
                              </Form.Item>
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Add New HSNSAC"
                              >
                                <Button
                                  icon={<FileAddOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  type="primary"
                                  size="small"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 46
                                    ).Rights.find((i) => i.RightCode === "ADD")
                                      .RightVal === "N"
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "HSNSAC",
                                      entryMode: "A",
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Edit this HSNSAC"
                              >
                                <Button
                                  icon={<EditOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  size="small"
                                  type="primary"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 46
                                    ).Rights.find((i) => i.RightCode === "EDIT")
                                      .RightVal === "N" || btnDisable.hsnsac
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "HSNSAC",
                                      entryMode: "E",
                                      formData: hsnsacMaster.find(
                                        (i) =>
                                          i.hsnsaccode ===
                                          form.getFieldValue("HSNSACCode")
                                      ),
                                    });
                                  }}
                                />
                              </Tooltip>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}>*</span> Tax :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="TaxCode"
                                style={{
                                  marginBottom: -3,
                                  flex: 1,
                                  width: "85%",
                                }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Tax",
                                  },
                                ]}
                              >
                                <Select
                                  onKeyDown={handleKeyDown}
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  placeholder="Please Select Tax"
                                  onChange={(val) => {
                                    if (val) {
                                      setBtnDisable({
                                        ...btnDisable,
                                        tax: false,
                                      });
                                    } else {
                                      setBtnDisable({
                                        ...btnDisable,
                                        tax: true,
                                      });
                                    }
                                  }}
                                >
                                  {taxMaster.length > 0 &&
                                    taxMaster
                                      .filter(
                                        (i) => i.IsActive === true
                                        // i.TaxCode === HSNSACCodeTax
                                      )
                                      .map((ii) => {
                                        return (
                                          <Option
                                            key={ii.TaxCode}
                                            value={ii.TaxCode}
                                          >{`${ii.TaxCode} (${ii.TaxName})`}</Option>
                                        );
                                      })}
                                </Select>
                              </Form.Item>
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Add New TAX"
                              >
                                <Button
                                  icon={<FileAddOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  type="primary"
                                  size="small"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 43
                                    ).Rights.find((i) => i.RightCode === "ADD")
                                      .RightVal === "N"
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "TAX",
                                      entryMode: "A",
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Edit this TAX"
                              >
                                <Button
                                  icon={<EditOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  size="small"
                                  type="primary"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 43
                                    ).Rights.find((i) => i.RightCode === "EDIT")
                                      .RightVal === "N" || btnDisable.tax
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "TAX",
                                      entryMode: "E",
                                      formData: taxMaster.find(
                                        (i) =>
                                          i.TaxCode ===
                                          form.getFieldValue("TaxCode")
                                      ),
                                    });
                                  }}
                                />
                              </Tooltip>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Applicable For :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="ApplyForDineIn"
                                style={{
                                  display: "inline-block",
                                  width: "calc(25% - 8px)",
                                  marginBottom: -3,
                                }}
                                valuePropName="checked"
                                labelCol={15}
                              >
                                <Switch
                                  checkedChildren="Dine In"
                                  unCheckedChildren="Dine In"
                                />
                              </Form.Item>
                              <Form.Item
                                name="ApplyForPickUp"
                                style={{
                                  display: "inline-block",
                                  width: "calc(25% - 8px)",
                                  marginBottom: -3,
                                }}
                                valuePropName="checked"
                                labelCol={15}
                              >
                                <Switch
                                  checkedChildren="Pick Up"
                                  unCheckedChildren="Pick Up"
                                />
                              </Form.Item>
                              <Form.Item
                                name="ApplyForDelivery"
                                style={{
                                  display: "inline-block",
                                  width: "calc(25% - 8px)",
                                  marginBottom: -3,
                                }}
                                valuePropName="checked"
                                labelCol={15}
                              >
                                <Switch
                                  checkedChildren="Delivery"
                                  unCheckedChildren="Delivery"
                                />
                              </Form.Item>

                              <Form.Item
                                name="ApplyForOnline"
                                style={{
                                  display: "inline-block",
                                  width: "calc(25% - 8px)",
                                  marginBottom: -3,
                                }}
                                valuePropName="checked"
                                labelCol={15}
                              >
                                <Switch
                                  checkedChildren="Online Orders"
                                  unCheckedChildren="Online Orders"
                                />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Variation :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Card
                                style={{
                                  borderRightWidth: 0,
                                  borderLeftWidth: 0,
                                  flex: 1,
                                }}
                                bodyStyle={{ padding: 0 }}
                              >
                                {variationType.map((item) => {
                                  return (
                                    <Checkbox
                                      key={item.label}
                                      style={{
                                        marginLeft: 0,
                                        marginRight: 8,
                                      }}
                                      value={item.value}
                                      checked={item.defValue}
                                      onChange={(e) => {
                                        let hh = [...variationType];
                                        let inx = hh.findIndex(
                                          (iiii) =>
                                            iiii.value === e.target.value
                                        );
                                        hh[inx].isDirty = true;
                                        hh[inx].defValue = e.target.checked;
                                        setVariationType(hh);
                                        // console.error(hh);
                                      }}
                                    >
                                      {item.label}
                                    </Checkbox>
                                  );
                                })}
                              </Card>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Add-On :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Card
                                style={{
                                  borderRightWidth: 0,
                                  borderLeftWidth: 0,
                                  flex: 1,
                                }}
                                bodyStyle={{ padding: 0 }}
                              >
                                <Form.Item style={{ marginBottom: 0 }}>
                                  {addOn.map((item) => {
                                    return (
                                      <Checkbox
                                        key={item.value}
                                        style={{
                                          marginLeft: 0,
                                          marginRight: 8,
                                        }}
                                        value={item.value}
                                        checked={item.defValue}
                                        onChange={(e) => {
                                          let hh = [...addOn];
                                          let inx = hh.findIndex(
                                            (iiii) =>
                                              iiii.value === e.target.value
                                          );
                                          hh[inx].isDirty = true;
                                          hh[inx].defValue = e.target.checked;
                                          setAddOn(hh);
                                        }}
                                      >
                                        {item.label}
                                      </Checkbox>
                                    );
                                  })}
                                </Form.Item>
                              </Card>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </Form>
                <MenuMasterTabsCard
                  MenuCode={mCode}
                  ResetClicked={isResetClicked}
                />
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                <Form
                  form={form}
                  // initialValues={initialValues}
                  // size='small'
                  // name="userbody"
                  // labelAlign="left"
                  // {...formItemLayout}
                  onFinish={onFinish}
                >
                  <Form.Item noStyle={true}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      style={{ marginRight: 5 }}
                    >
                      Save
                    </Button>

                    {props.entryMode == "A" && (
                      <Button
                        type="primary"
                        icon={<RetweetOutlined />}
                        style={{ marginRight: 5 }}
                        onClick={onReset}
                      >
                        Reset
                      </Button>
                    )}

                    <Button
                      type="primary"
                      icon={<Icon component={RollbackOutlined} />}
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        props.onBackPress();
                      }}
                    >
                      Back
                    </Button>

                    <Button
                      type="primary"
                      icon={<Icon component={PrinterOutlined} />}
                      style={{ marginRight: 5 }}
                      onClick={props.OnPrint}
                    >
                      Print
                    </Button>
                  </Form.Item>
                </Form>{" "}
                {isShowModal && (
                  <Modal
                    visible={isShowModal}
                    onCancel={() => {
                      setIsShowModal();
                    }}
                    footer={null}
                    bodyStyle={{ padding: 0 }}
                    closable={true}
                    width={750}
                    destroyOnClose={true}
                  >
                    {isShowModal.modalType === "CAT" && (
                      <MenuCategoryCard
                        title={"Menu Category Master"}
                        formData={isShowModal.formData}
                        onBackPress={() => {
                          setIsShowModal();
                        }}
                        onSavePress={(val) => {
                          if (val.IsActive) {
                            getMenuMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.subCategory) {
                                    setMenuCatmaster(ii.subCategory);
                                    form.setFieldsValue({
                                      MenuCatCode: val.MenuCatCode,
                                      HSNSACCode: ii.subCategory.filter(
                                        (i) => i.MenuCatCode === val.MenuCatCode
                                      )[0].DefHSNSACCode,
                                      TaxCode: ii.subCategory.filter(
                                        (i) => i.MenuCatCode === val.MenuCatCode
                                      )[0].DefTaxCode,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
                                      menuCat: false,
                                      hsnsac: false,
                                      tax: false,
                                    });
                                  }
                                });
                              }
                            );
                          } else {
                            getMenuMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.subCategory) {
                                    setMenuCatmaster(ii.subCategory);
                                    form.setFieldsValue({
                                      MenuCatCode: null,
                                      HSNSACCode: null,
                                      TaxCode: null,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
                                      menuCat: true,
                                      hsnsac: true,
                                      tax: true,
                                    });
                                  }
                                });
                              }
                            );
                          }
                        }}
                      />
                    )}
                    {isShowModal.modalType === "GRP" && (
                      <MenuGroupCard
                        trnType="MGRP"
                        title={"Menu Group Master"}
                        formData={isShowModal.formData}
                        onBackPress={() => {
                          setIsShowModal();
                        }}
                        onSavePress={(val) => {
                          if (val.Status) {
                            getMenuMasterServices(CompCode).then(
                              async (res) => {
                                try {
                                  await res.map((ii) => {
                                    if (ii.groupMaster) {
                                      setGroupMaster(ii.groupMaster);
                                      form.setFieldsValue({
                                        MenuGroupCode: val.ShortCode,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        group: false,
                                      });
                                    }
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            );
                          } else {
                            getMenuMasterServices(CompCode).then(
                              async (res) => {
                                try {
                                  await res.map((ii) => {
                                    if (ii.groupMaster) {
                                      setGroupMaster(ii.groupMaster);
                                      form.setFieldsValue({
                                        MenuGroupCode: null,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        group: true,
                                      });
                                    }
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            );
                          }
                        }}
                      />
                    )}
                    {isShowModal.modalType === "HSNSAC" && (
                      <HSNSACMasterCard
                        title={"HSNSAC Master"}
                        formData={isShowModal.formData}
                        onBackPress={() => {
                          setIsShowModal();
                        }}
                        onSavePress={(val) => {
                          if (val.IsActive) {
                            getMenuMasterServices(CompCode).then(
                              async (res) => {
                                try {
                                  await res.map((ii) => {
                                    if (ii.hsnsacMaster) {
                                      setHSNSACmaster([]);
                                      setHSNSACmaster(ii.hsnsacMaster);
                                      form.setFieldsValue({
                                        HSNSACCode: val.hsnsaccode,
                                        TaxCode: ii.hsnsacMaster.filter(
                                          (i) => i.hsnsaccode === val.hsnsaccode
                                        )[0].DefTaxCode,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        hsnsac: false,
                                        tax: false,
                                      });
                                    }
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            );
                          } else {
                            getMenuMasterServices(CompCode).then(
                              async (res) => {
                                try {
                                  await res.map((ii) => {
                                    if (ii.hsnsacMaster) {
                                      setHSNSACmaster(ii.hsnsacMaster);
                                      form.setFieldsValue({
                                        HSNSACCode: null,
                                        TaxCode: null,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        hsnsac: true,
                                        tax: true,
                                      });
                                    }
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            );
                          }
                        }}
                      />
                    )}
                    {isShowModal.modalType === "TAX" && (
                      <TaxMasterCard
                        title={"Tax Master"}
                        formData={isShowModal.formData}
                        onBackPress={() => {
                          setIsShowModal();
                        }}
                        onSavePress={(val) => {
                          if (val.IsActive) {
                            getMenuMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.taxMaster) {
                                    setTaxmaster(ii.taxMaster);
                                    form.setFieldsValue({
                                      TaxCode: val.TaxCode,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
                                      tax: false,
                                    });
                                  }
                                });
                              }
                            );
                          } else {
                            getMenuMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.taxMaster) {
                                    setTaxmaster(ii.taxMaster);
                                    form.setFieldsValue({
                                      TaxCode: null,
                                    });
                                    setBtnDisable({ ...btnDisable, tax: true });
                                  }
                                });
                              }
                            );
                          }
                        }}
                      />
                    )}
                  </Modal>
                )}
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </>
  );
};

export default MenuMasterNew;
