import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Spin,
  Select,
  Switch,
  InputNumber,
  message,
  Checkbox,
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
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtMenuMst } from "../../../../store/actions/MenuMaster";
import {
  fetchMenuMasterCard,
  getMenuMasterServices,
} from "../../../../services/menu-master";
import MenuMasterTabsCard from "./MenuMasterTabsCard";
// import { getTableData, deletedBarcode } from "./Me";
import { sendFireBaseData, deletedFireBaseData } from "./MenuUploadImage";
import AppLoader from "../../../common/AppLoader";
import SweetAlert from "react-bootstrap-sweetalert";
import { getSysSequenceConfig } from "../../../../services/system-sequence-config";
import { setVariatonData } from "./MenuVarAddOnCard";
import {
  fetchMenuVariationTab,
  fetchMenuAddOnTab,
} from "../../../../services/menu-master";

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

const ItemMasterCard = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const config = useSelector((state) => state.AppMain.appconfigs);
  const [form] = Form.useForm();
  const [hsnsacMaster, setHSNSACmaster] = useState([]);
  const [taxMaster, setTaxmaster] = useState([]);
  const [brandMaster, setBrandmaster] = useState([]);
  const [subCatMaster, setSubCatmaster] = useState([]);
  const [unitMaster, setUnitmaster] = useState([]);
  const [markUpDownCaption, setMarkUpDownCaption] = useState("Mark Down");
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [mCode, setMCode] = useState(
    props.formData ? props.formData.MenuCode : null
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );
  const [groupMaster, setGroupMaster] = useState([]);
  const [isResetClicked, setIsResetClicked] = useState();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [ssAleart, setSsAlert] = useState();
  const [variationType, setVariationType] = useState([]);
  const [addOn, setAddOn] = useState([]);
  const initialValues = {
    MenuCode: "",
    ShortCode: null,
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
  };
  const onReset = () => {
    setIsResetClicked(!isResetClicked);
    // setICodeDisable(false);
    form.setFieldsValue({
      // MenuCode: "",
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

  const Autocode = useSelector(
    (state) => state.sysSequenceConfig.SequenceNextVal
  );

  // useEffect(() => {

  // }, [Autocode]);
  const mapData = (data) => {
    data.map(async (i) => {
      // setIsLoadingData(true);
      // console.log(data, "here");
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
  const showAlert = (actiontype, message, data) => {
    // console.log(actiontype, "das");
    setSsAlert(
      <SweetAlert
        showCancel
        confirmBtnText="Continue"
        // confirmBtnBsStyle={"default"}
        // type={"default"}
        title="Are you sure?"
        onCancel={() => {
          setICodeDisable(false);
          onReset();
          setSsAlert();
          props.onBackPress();
        }}
        onConfirm={async () => {
          setICodeDisable(true);
          setSsAlert();
          if (actiontype === "accept") {
            await mapData(data);
          }

          // setIsLoadingData(false);
        }}
      >
        {message}
      </SweetAlert>
    );
  };
  // useEffect(() => {
  //   console.log(props.entryMode, props.formData, "atul test");
  // });
  useEffect(() => {
    // if (props.entryMode === "A") {
    //   getSysSequenceConfig("ITEM").then((res) => {
    //     if (res.length > 0) {
    //       console.log(res, "object");
    //       form.setFieldsValue({ ItemCode: res.LastGenNo });
    //     }
    //   });
    // }

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
          // if (ii.brandMaster) {
          //   setBrandmaster([]);
          //   setBrandmaster(ii.brandMaster);
          // }
          if (ii.subCategory) {
            setSubCatmaster([]);
            setSubCatmaster(ii.subCategory);
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

    // }
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
            // showAlert("accept", "Do you want to Edit this Item", resp);
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
      // setDefVarType(
      //   temp.filter((item) => item.defValue === "1").map((i) => i.value)
      // );
      //   console.log(temp, "data");
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
      //   console.log(temp, "data");
      setAddOn(temp);
    });
  }, [mCode]);

  const onFinish = (values) => {
    setVariatonData();
    setIsLoading(true);
    // console.log(values, "final value");
    dispatch(
      InsUpdtMenuMst(
        values,
        // getTableData(),
        // deletedBarcode(),
        sendFireBaseData(),
        deletedFireBaseData(),
        variationType,
        addOn
      )
    );
    // console.log(deletedFireBaseData());
  };
  // useEffect(() => {
  //   form.setFieldsValue({ ItemCode: iCode });
  // }, [iCode]);

  useEffect(() => {
    if (currentTran.isSuccess) {
      onReset();
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      // inputRef.current.focus();
      //console.log(inputRef, inputRef.current);
      // alert("Enter key pressed");
    }
  };

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        {isLoadingData && <AppLoader />}
        {!isLoadingData && (
          <Row>
            {ssAleart}
            <Col span={24}>
              <CardHeader
                title={props.title ? props.title : currentTran.formTitle}
              />
              <Card
                bodyStyle={{
                  padding: "0px 0px 5px 0px",
                  borderRight: "1px solid #F0F0F0",
                }}
              >
                <Form
                  form={form}
                  initialValues={initialValues}
                  // size='small'
                  name="userbody"
                  labelAlign="left"
                  {...formItemLayout}
                  onFinish={onFinish}
                  // layout="vertical"
                >
                  <Row>
                    <Col
                      xl={12}
                      lg={12}
                      md={12}
                      sm={24}
                      xs={24}
                      style={{ borderRight: "1px solid #f0f0fo" }}
                    >
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        {/* <Row>
                        <Col xl={18} lg={18} md={18} sm={18} xs={18}> */}
                        <Form.Item
                          // justify="center"
                          name="MenuCode"
                          style={{ marginBottom: -3 }}
                          label="Menu Code"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Item Code",
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
                            // ref={inputRef}
                            // ref={(inputEl) => (inputRef = inputEl)}
                            placeholder="Menu Code"
                            disabled={iCodeDisable}
                            style={{ textTransform: "uppercase" }}
                            onKeyDown={handleKeyDown}
                          />
                        </Form.Item>
                        {/* </Col>
                        <Col xl={6} lg={6} md={6} sm={6} xs={6}> */}

                        {/* </Col>
                      </Row> */}

                        <Form.Item
                          // justify="center"
                          name="MenuName"
                          style={{ marginBottom: -3 }}
                          label="Menu Name"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Description",
                            },
                          ]}
                        >
                          <Input
                            // ref={inputRef}
                            placeholder="Enter Item Name"
                            onKeyDown={handleKeyDown}
                          />
                        </Form.Item>
                        <Form.Item
                          // justify="center"
                          name="MenuDesc"
                          style={{ marginBottom: 4 }}
                          label="Description"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Please input your Description",
                          //   },
                          // ]}
                        >
                          <TextArea rows={3} placeholder="Enter Description" />
                        </Form.Item>

                        <Form.Item
                          // justify="center"
                          name="MenuCatCode"
                          style={{ marginBottom: -3 }}
                          label="Category Code"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Category Code",
                            },
                          ]}
                        >
                          <Select
                            onKeyDown={handleKeyDown}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            onChange={(val) => {
                              if (!props.formData) {
                                const hh = subCatMaster.filter(
                                  (i) => i.MenuCatCode === val
                                );
                                if (hh.length > 0) {
                                  form.setFieldsValue({
                                    HSNSACCode: hh[0].DefHSNSACCode,
                                    TaxCode: hh[0].DefTaxCode,
                                  });
                                }
                              }
                            }}
                          >
                            {subCatMaster.length > 0 &&
                              subCatMaster.map((ii) => {
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
                        <Form.Item
                          // justify="center"
                          name="MenuGroupCode"
                          style={{ marginBottom: -3 }}
                          label="Group Class"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Product Class",
                            },
                          ]}
                        >
                          <Select
                            onKeyDown={handleKeyDown}
                            allowClear
                            showSearch
                            optionFilterProp="children"
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
                        <Form.Item
                          justify="center"
                          name="IsActive"
                          label="Status"
                          style={{ marginBottom: -3 }}
                          valuePropName="checked"
                          // colon={false}
                        >
                          <Switch
                            checkedChildren="Active"
                            unCheckedChildren="In Active"
                          />
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col
                      xl={12}
                      lg={12}
                      md={12}
                      sm={24}
                      xs={24}
                      style={{ borderLeft: "1px solid #F0F0F0" }}
                    >
                      <Card
                        bordered={false}
                        // style={{ height: "100%" }}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Form.Item
                          // justify="center"

                          name="ShortCode"
                          style={{ marginBottom: -3 }}
                          label="Short Code"
                        >
                          <Input
                            // ref={inputRef}
                            placeholder="Enter Short Code "
                            onKeyDown={handleKeyDown}
                          />
                        </Form.Item>
                        <Form.Item
                          // justify="center"
                          name="DietType"
                          style={{ marginBottom: -3 }}
                          label="Diet Type"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Diet Type",
                            },
                          ]}
                        >
                          <Select
                            onKeyDown={handleKeyDown}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                          >
                            <Option value="V">Vegetarion</Option>
                            <Option value="N">Non-Vegetarion</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          // justify="center"
                          name="HSNSACCode"
                          style={{ marginBottom: -3 }}
                          label="HSN SAC"
                          rules={[
                            {
                              required: true,
                              message: "Please input your HSN SAC",
                            },
                          ]}
                        >
                          <Select
                            onKeyDown={handleKeyDown}
                            allowClear
                            showSearch
                            optionFilterProp="children"
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
                        <Form.Item
                          // justify="center"
                          name="TaxCode"
                          style={{ marginBottom: -3 }}
                          label="Tax"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Tax",
                            },
                          ]}
                        >
                          <Select
                            onKeyDown={handleKeyDown}
                            allowClear
                            showSearch
                            optionFilterProp="children"
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
                        <Form.Item
                          style={{ marginBottom: -3 }}
                          label="Applicable For"
                        >
                          <Form.Item
                            // justify="center"
                            name="ApplyForDineIn"
                            style={{
                              display: "inline-block",
                              width: "calc(25% - 8px)",
                              marginBottom: -3,
                            }}
                            // label="Apply For Dine In"
                            valuePropName="checked"
                            // colon={false}
                            labelCol={15}
                            // wrapperCol={6}
                          >
                            <Switch
                              checkedChildren="Dine In"
                              unCheckedChildren="Dine In"
                            />
                          </Form.Item>
                          <Form.Item
                            // justify="center"
                            name="ApplyForPickUp"
                            style={{
                              display: "inline-block",
                              width: "calc(25% - 8px)",
                              marginBottom: -3,
                            }}
                            // label="Apply For Pick Up"
                            valuePropName="checked"
                            // colon={false}
                            labelCol={15}
                          >
                            <Switch
                              checkedChildren="Pick Up"
                              unCheckedChildren="Pick Up"
                            />
                          </Form.Item>
                          <Form.Item
                            // justify="center"
                            name="ApplyForDelivery"
                            style={{
                              display: "inline-block",
                              width: "calc(25% - 8px)",
                              marginBottom: -3,
                            }}
                            // label="Apply For Delivery"
                            valuePropName="checked"
                            // colon={false}
                            labelCol={15}
                          >
                            <Switch
                              checkedChildren="Delivery"
                              unCheckedChildren="Delivery"
                            />
                          </Form.Item>

                          <Form.Item
                            // justify="center"
                            name="ApplyForOnline"
                            style={{
                              display: "inline-block",
                              width: "calc(25% - 8px)",
                              marginBottom: -3,
                            }}
                            // label="Apply For Online"
                            valuePropName="checked"
                            // colon={false}
                            labelCol={15}
                          >
                            <Switch
                              checkedChildren="Online Orders"
                              unCheckedChildren="Online Orders"
                            />
                          </Form.Item>
                        </Form.Item>
                        <Card
                          style={{ borderRightWidth: 0, borderLeftWidth: 0 }}
                          bodyStyle={{ padding: 0 }}
                        >
                          <Form.Item
                            label="Variation"
                            style={{ marginBottom: 0 }}
                          >
                            {variationType.map((item) => {
                              // console.log(item, "checkbox");
                              return (
                                <Checkbox
                                  key={item.label}
                                  style={{ marginLeft: 0, marginRight: 8 }}
                                  value={item.value}
                                  checked={item.defValue}
                                  onChange={(e) => {
                                    let hh = [...variationType];
                                    let inx = hh.findIndex(
                                      (iiii) => iiii.value === e.target.value
                                    );

                                    hh[inx].isDirty = true;
                                    hh[inx].defValue = e.target.checked;
                                    setVariationType(hh);
                                    // console.log(hh);
                                  }}
                                >
                                  {item.label}
                                </Checkbox>
                              );
                            })}
                          </Form.Item>
                        </Card>
                        <Card
                          style={{ borderRightWidth: 0, borderLeftWidth: 0 }}
                          bodyStyle={{ padding: 0 }}
                        >
                          <Form.Item label="Add-On" style={{ marginBottom: 0 }}>
                            {addOn.map((item) => {
                              return (
                                <Checkbox
                                  style={{ marginLeft: 0, marginRight: 8 }}
                                  value={item.value}
                                  checked={item.defValue}
                                  onChange={(e) => {
                                    let hh = [...addOn];
                                    let inx = hh.findIndex(
                                      (iiii) => iiii.value === e.target.value
                                    );

                                    hh[inx].isDirty = true;
                                    hh[inx].defValue = e.target.checked;
                                    setAddOn(hh);
                                    // console.log(hh);
                                  }}
                                >
                                  {item.label}
                                </Checkbox>
                              );
                            })}
                          </Form.Item>
                        </Card>
                        {/* </Col>
                        </Row> */}
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
                </Form>
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default ItemMasterCard;
