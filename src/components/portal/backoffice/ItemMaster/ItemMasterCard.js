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
  EditTwoTone,
  EditOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtItemMst } from "../../../../store/actions/ItemMaster";
import {
  getItemMasterServices,
  fetchItemMasterCard,
} from "../../../../services/item-master";
import ItemMasterTabsCard from "./ItemMasterTabsCard";
import { getTableData, deletedBarcode } from "./ItemBarcode";
import { sendFireBaseData, deletedFireBaseData } from "./ItemUploadImage";
import AppLoader from "../../../common/AppLoader";
import SweetAlert from "react-bootstrap-sweetalert";
import { getSysSequenceConfig } from "../../../../services/system-sequence-config";
import SubMasterCategoryCard from "../SubCategoryMaster/SubMasterCategoryCard";
import { fetchCategoryMasters } from "../../../../store/actions/categoryMaster";
import BrandMasterCard from "../../Administration/BrandMaster/BrandMasterCard";

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
  const [iCode, setICode] = useState(
    props.formData ? props.formData.ItemCode : null
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );

  const [saveClick, setSaveClick] = useState(false);
  const [classMaster, setClassMaster] = useState([]);
  const [isResetClicked, setIsResetClicked] = useState();
  const [markUpDownType, setMarkUpDownType] = useState(
    props.formData ? props.formData.MarkUpDownPV : "P"
  );
  const [isRerender, setIsRerender] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [ssAleart, setSsAlert] = useState();
  const initialValues = {
    ItemCode: "",
    ItemName: "",
    ItemDesc: "",
    UnitCode: "",
    SubCategoryCode: "",
    BrandCode: "",
    ProductType: "",
    PrintLabel: true,
    HSNSACCode: "",
    classCode: "",
    TaxCode: "",
    IsActive: true,
    SaleOnMRP: true,
    MarkUpDown: "",
    MarkUpDowType: "P",
    Cost: "",
    SalePrice: "",
    MRP: "",
  };
  const onReset = () => {
    setIsResetClicked(!isResetClicked);
    // setICodeDisable(false);
    form.setFieldsValue({
      ItemName: "",
      ItemDesc: "",
      UnitCode: "",
      SubCategoryCode: "",
      BrandCode: "",
      ProductType: "",
      PrintLabel: true,
      HSNSACCode: "",
      classCode: "",
      TaxCode: "",
      IsActive: true,
      SaleOnMRP: true,
      MarkUpDown: "",
      MarkUpDowType: "P",
      Cost: "",
      SalePrice: "",
      MRP: "",
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
      await form.setFieldsValue({
        ItemCode: i.ItemCode,
        ItemName: i.ItemName,
        ItemDesc: i.ItemDesc,
        UnitCode: i.UnitCode,
        SubCategoryCode: i.SubCategoryCode,
        BrandCode: i.BrandCode,
        ProductType: i.ProductType,
        PrintLabel: i.PrintLabel,
        HSNSACCode: i.HSNSACCode,
        classCode: i.classCode,
        TaxCode: i.TaxCode,
        IsActive: i.IsActive,
        SaleOnMRP: i.IsSaleOnMRP,
        MarkUpDown: i.MarkUpDown,
        MarkUpDowType: i.MarkUpDownPV ? i.MarkUpDownPV : "P",
        Cost: i.Cost,
        SalePrice: i.SalePrice,
        MRP: i.MRP,
      });
    });
    setICodeDisable(true);
  };

  const showAlert = (actiontype, message, data) => {
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
  useEffect(() => {
    // if (props.entryMode === "A") {
    //   getSysSequenceConfig("ITEM").then((res) => {
    //     if (res.length > 0) {
    //       form.setFieldsValue({ ItemCode: res.LastGenNo });
    //     }
    //   });
    // }
    getItemMasterServices().then(async (res) => {
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
          if (ii.brandMaster) {
            setBrandmaster([]);
            setBrandmaster(ii.brandMaster);
          }
          if (ii.subCategory) {
            setSubCatmaster([]);
            setSubCatmaster(ii.subCategory);
          }
          if (ii.unitMaster) {
            setUnitmaster([]);
            setUnitmaster(ii.unitMaster);
          }
          if (ii.classMaster) {
            setClassMaster([]);
            setClassMaster(ii.classMaster);
          }
        });
      } catch (err) {
        console.error(err);
      }
      dispatch(fetchCategoryMasters());
      
      setIsLoadingData(false);
    });
    // }
  }, []);

  useEffect(() => {
    if (props.entryMode == "A") {
      if (Autocode.length > 0) {
        form.setFieldsValue({ ItemCode: Autocode[0].NextVal });
        setICode(Autocode[0].NextVal);
        setICodeDisable(true);
      }
    }
  }, [Autocode]);

  useEffect(() => {
    fetchItemMasterCard(iCode).then((resp) => {
      try {
        if (resp.length > 0) {
          if (props.entryMode === "A") {
            showAlert("accept", "Do you want to Edit this Item", resp);
          } else {
            mapData(resp);
            // onReset();
            // message.error("Product Already Exist")
          }
        }
        // setIsLoadingData(false);
      } catch (err) {
        console.error(err);
      }
    });
  }, [iCode]);

  const onFinish = (values) => {
    setIsLoading(true);
    dispatch(
      InsUpdtItemMst(
        values,
        getTableData(),
        deletedBarcode(),
        sendFireBaseData(),
        deletedFireBaseData()
      )
    );
    // console.error(deletedFireBaseData());
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
              <CardHeader title={currentTran.formTitle} />
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
                          name="ItemCode"
                          style={{ marginBottom: -3 }}
                          label="Item Code"
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
                                setICode(val.target.value);
                              }
                            }}
                            // ref={inputRef}
                            // ref={(inputEl) => (inputRef = inputEl)}
                            placeholder="Item Code"
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

                          name="ItemName"
                          style={{ marginBottom: -3 }}
                          label="Item Name"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Item Name",
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
                          name="ItemDesc"
                          style={{ marginBottom: 5 }}
                          label="Description"
                        >
                          <TextArea rows={3} placeholder="Enter Description" />
                        </Form.Item>
                        <Form.Item
                          // justify="center"
                          name="SubCategoryCode"
                          style={{ marginBottom: -3 }}
                          label="Sub Category"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Sub Category",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            onChange={(val) => {
                              if (!props.formData) {
                                const hh = subCatMaster.filter(
                                  (i) => i.SubCatCode === val
                                );
                                if (hh.length > 0) {
                                  form.setFieldsValue({
                                    HSNSACCode: hh[0].defHsnSacCode,
                                    TaxCode: hh[0].DefTaxCode,
                                  });
                                }
                              }
                            }}
                            onKeyDown={handleKeyDown}
                          >
                            {subCatMaster.length > 0 &&
                              subCatMaster.map((ii) => {
                                return (
                                  <Option
                                    key={ii.SubCatCode}
                                    value={ii.SubCatCode}
                                  >{`${ii.SubCatDesc} (${ii.CatDesc})`}</Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          // justify="center"
                          name="BrandCode"
                          style={{ marginBottom: -3 }}
                          label="Brand"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Brand",
                            },
                          ]}
                        >
                          <Select
                            onKeyDown={handleKeyDown}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                          >
                            {brandMaster.length > 0 &&
                              brandMaster
                                .filter((i) => i.IsActive === true)
                                .map((ii) => {
                                  return (
                                    <Option
                                      key={ii.BrandCode}
                                      value={ii.BrandCode}
                                    >{`${ii.BrandDesc} (${ii.MfrDesc})`}</Option>
                                  );
                                })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          // justify="center"
                          name="ProductType"
                          style={{ marginBottom: -3 }}
                          label="Product Type"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Product Type",
                            },
                          ]}
                        >
                          <Select
                            onKeyDown={handleKeyDown}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                          >
                            <Option value="D">Direct</Option>
                            <Option value="L">Loose</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          // justify="center"
                          name="classCode"
                          style={{ marginBottom: -3 }}
                          label="Product Class"
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
                            {classMaster.length > 0 &&
                              classMaster
                                .filter((i) => i.IsActive === true)
                                .map((ii) => {
                                  return (
                                    <Option
                                      key={ii.ClassCode}
                                      value={ii.ClassCode}
                                    >{`${ii.ClassName}`}</Option>
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
                          colon={false}
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
                          name="UnitCode"
                          style={{ marginBottom: -3 }}
                          label="Unit"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Unit",
                            },
                          ]}
                        >
                          <Select
                            onKeyDown={handleKeyDown}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                          >
                            {unitMaster.length > 0 &&
                              unitMaster
                                .filter((i) => i.IsActive === true)
                                .map((ii) => {
                                  return (
                                    <Option
                                      key={ii.UnitCode}
                                      value={ii.UnitCode}
                                    >{`${ii.UnitCode} (${ii.UnitDesc})`}</Option>
                                  );
                                })}
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
                          // justify="center"
                          name="SaleOnMRP"
                          style={{ marginBottom: -3 }}
                          label="Sale On MRP"
                          valuePropName="checked"
                          colon={false}
                          rules={[
                            {
                              required: true,
                              message: `Please select`,
                            },
                          ]}
                        >
                          <Switch
                            onChange={(val) => {
                              if (val) {
                                setMarkUpDownCaption("Mark Down");
                              } else {
                                setMarkUpDownCaption("Mark Up");
                              }
                            }}
                            // checkedChildren="Print Label"
                            // unCheckedChildren="Don't Print Label"
                          />
                        </Form.Item>
                        <Form.Item
                          label={`${markUpDownCaption}`}
                          style={{ marginBottom: 0 }}
                        >
                          <Form.Item
                            // justify="center"
                            colon={false}
                            name="MarkUpDown"
                            style={{
                              marginBottom: -3,
                              display: "inline-block",
                              width: "calc(70% - 8px)",
                            }}
                            rules={
                              markUpDownType == "P"
                                ? [
                                    {
                                      required: true,
                                      message: `Please input your ${markUpDownCaption}!`,
                                    },
                                    {
                                      pattern: /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)/g,
                                      message: "Wrong format!",
                                    },
                                  ]
                                : [
                                    {
                                      required: true,
                                      message: `Please input your ${markUpDownCaption}!`,
                                    },
                                    {
                                      pattern: /((\d+)((\.\d{1,2})?))$/gm,
                                      message: "Wrong format!",
                                    },
                                  ]
                            }
                          >
                            <Input
                              placeholder={`${markUpDownCaption}`}
                              onKeyDown={handleKeyDown}
                            />
                          </Form.Item>

                          <Form.Item
                            // justify="center"
                            name="MarkUpDowType"
                            style={{
                              marginBottom: -3,
                              display: "inline-block",
                              width: "calc(30% - 8px)",
                              margin: "0 8px",
                            }}
                            label=""
                            // colon={false}
                          >
                            <Radio.Group
                              onChange={(val) => {
                                setMarkUpDownType(val.target.value);
                                form.setFieldsValue({ MarkUpDown: "" });
                              }}
                              defaultValue="a"
                              buttonStyle="solid"
                              rules={[
                                {
                                  required: true,
                                  message: `Select input your Mark Up!`,
                                },
                              ]}
                            >
                              <Radio.Button value="P">%</Radio.Button>
                              <Radio.Button value="V">{`${
                                config.filter(
                                  (ii) => ii.configCode === "CURRENCY"
                                )[0].value1
                              }`}</Radio.Button>
                            </Radio.Group>
                          </Form.Item>
                        </Form.Item>

                        <Form.Item
                          // justify="center"
                          name="Cost"
                          style={{
                            marginBottom: -3,
                          }}
                          label="Cost"
                        >
                          <InputNumber
                            onKeyDown={handleKeyDown}
                            style={{ width: "100%" }}
                            placeholder={`Enter Cost`}
                            step={0.3}
                          />
                        </Form.Item>
                        <Form.Item
                          // justify="center"
                          name="SalePrice"
                          style={{
                            marginBottom: -3,
                          }}
                          label="Sale Price"
                        >
                          <InputNumber
                            onKeyDown={handleKeyDown}
                            style={{ width: "100%" }}
                            placeholder={`Enter Sale Price`}
                            onBlur={(val) => {
                              if (props.entryMode === "A") {
                                form.setFieldsValue({ MRP: val.target.value });
                              }
                            }}
                            step={0.3}
                          />
                        </Form.Item>
                        <Form.Item
                          // justify="center"
                          name="MRP"
                          style={{
                            marginBottom: -3,
                          }}
                          label="MRP"
                        >
                          <InputNumber
                            onKeyDown={handleKeyDown}
                            style={{ width: "100%" }}
                            placeholder={`Enter MRP`}
                            step={0.3}
                          />
                        </Form.Item>

                        <Form.Item
                          // justify="center"
                          name="PrintLabel"
                          style={{ marginBottom: -3 }}
                          label="Print Label"
                          valuePropName="checked"
                          // colon={false}
                        >
                          <Switch
                          // onKeyDown={handleKeyDown}
                          // checkedChildren="Print Label"
                          // unCheckedChildren="Don't Print Label"
                          />
                        </Form.Item>
                      </Card>
                    </Col>
                  </Row>
                </Form>
                <ItemMasterTabsCard
                  showBarcode={`${
                    config.filter((ii) => ii.configCode === "BARCODE")[0].value1
                  }`}
                  ItemCode={iCode}
                  ResetClicked={isResetClicked}
                />
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                <Form form={form} onFinish={onFinish}>
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
                        dispatch(reInitialize());
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
