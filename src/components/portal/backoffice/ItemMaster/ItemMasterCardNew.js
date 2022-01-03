import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Radio,
  Button,
  Row,
  Col,
  Form,
  Card,
  Input,
  Spin,
  Select,
  Switch,
  Modal,
  message,
  Tooltip,
  InputNumber,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
  FileAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { InsUpdtItemMst } from "../../../../store/actions/ItemMaster";
import {
  getItemMasterServices,
  fetchItemMasterCard,
  InsUpdtItemMaster,
  saveItemMstAddInfoDtl,
  fetchVariationTypesConfigHdr,
  fetchDataItemVariants,
} from "../../../../services/item-master";
import swal from "sweetalert";
import ItemMasterTabsCard from "./ItemMasterTabsCard";
import { getTableData, deletedBarcode } from "./ItemBarcode";
import { sendFireBaseData, deletedFireBaseData } from "./ItemUploadImage";
import AppLoader from "../../../common/AppLoader";
import { getSysSequenceConfig } from "../../../../services/system-sequence-config";
import SubMasterCategoryCard from "../SubCategoryMaster/SubCategoryCardNew";
import { fetchCategoryMasters } from "../../../../store/actions/categoryMaster";
import BrandMasterCard from "../../Administration/BrandMaster/BrandMasterNew";
import ClassMasterCard from "../ClassMaster/ClassMasterCard";
import UnitMasterCard from "../../Administration/UnitMaster/UnitMasterCard";
import HSNSACMasterCard from "../../Administration/HSNSACmaster/hsnacCardNew";
// import HSNSACMasterCard from "../../Administration/NewHsnSacMaster/components/HsnsacMasterCardNew";
// import TaxMasterCard from "../../Administration/TaxMaster/TaxMasterCard";
import TaxMasterCard from "../../Administration/NewTaxMaster/components/TaxMasterNewCard";
import { fetchManufacturerMasters } from "../../../../store/actions/manufactureMaster";
import _ from "lodash";
import { fetchUnitMaster } from "../../../../store/actions/unitmaster";
import { getOpeningStockData } from "./ItemMasterOpeningStock";
import {
  InsOpeningStock,
  InvDeleteOpeningStock,
  InvUpdateOpeningStock,
} from "../../../../services/inventory";
import { useHotkeys } from "react-hotkeys-hook";
import { fetchSequenceNextVal } from "../../../../shared/utility";
import { getItemInfoDtlData } from "./ItemMasterAddInfo";
import ViewHotKeysComponent from "../../../common/ViewHotKeysComponent";
import { fetchKeyboardHotKeyConfig } from "../../../../services/keyboard-hotkey-config";

const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const initialValues = {
  ItemCode: "",
  ItemName: "",
  ItemDesc: null,
  UnitCode: null,
  SubCategoryCode: null,
  BrandCode: null,
  ProductType: null,
  PrintLabel: true,
  HSNSACCode: null,
  classCode: null,
  TaxCode: null,
  IsActive: true,
  SaleOnMRP: true,
  MarkUpDown: null,
  MarkUpDowType: "P",
  Cost: null,
  SalePrice: null,
  MRP: null,
  SecondaryUnitCode: null,
  ConversionRate: null,
  OpnMRP: null,
  OpnQuantity: null,
  OpnSalePrice: null,
  OpnCostPrice: null,
  MaintainInventory: true,
  MBQ: null,
  LabelCopies: null,
  TaxType: null,
};

export var variationDetailContext = React.createContext(null);
const ItemMasterCardNew = (props) => {
  const [variationDataSource, setVariationDataSource] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [fetchImageUpload, setFetchImageUpload] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });

  const dispatch = useDispatch();
  const saveRef = useRef();
  const itemNameRef = useRef();
  const backRef = useRef();
  const formRef = useRef();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [keyboardKey, setKeyboardKey] = useState([]);
  const config = useSelector((state) => state.AppMain.appconfigs);
  const [secondaryUnit, setSecondaryUnit] = useState(
    props.formData && props.formData.SecondaryUnitCode ? true : false
  );
  const [iCode, setICode] = useState(
    props.formData ? props.formData.ItemCode : null
  );
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const defaultTax = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "DEFSALS_TAX")
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );
  const l_LoginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [form] = Form.useForm();
  const [isResetClicked, setIsResetClicked] = useState();
  const [hsnsacMaster, setHSNSACmaster] = useState([]);
  const [taxMaster, setTaxmaster] = useState([]);
  const [brandMaster, setBrandmaster] = useState([]);
  const [subCatMaster, setSubCatmaster] = useState([]);
  const [classMaster, setClassMaster] = useState([]);
  const [unitMaster, setUnitmaster] = useState([]);
  const [markUpDownCaption, setMarkUpDownCaption] = useState("Mark Down");
  const [markUpDownType, setMarkUpDownType] = useState(
    props.formData ? props.formData.MarkUpDownPV : "P"
  );
  const Autocode = useSelector(
    (state) => state.sysSequenceConfig.SequenceNextVal
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [isShowModal, setIsShowModal] = useState();
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const [btnDisable, setBtnDisable] = useState({
    subCat: !props.formData ? true : false,
    brand: !props.formData ? true : false,
    class: !props.formData ? true : false,
    hsnsac: !props.formData ? true : false,
    unit: !props.formData ? true : false,
    tax: !props.formData ? true : false,
  });
  const [unit, setUnit] = useState(
    props.formData ? props.formData.SecondaryUnitCode : null
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const [openingstockData, setOpeningstockData] = useState([
    { Qty: null, Mrp: null, Sale: null, Cost: null, key: 1, isDeleted: false },
  ]);
  const [subCatCode, setSubCatCode] = useState();
  const [printLabel, setPrintLabel] = useState(initialValues.PrintLabel);
  const keyboardHotkeyConfig = useSelector((state) =>
    state.AppMain.keyboardHotKeyConfig.filter(
      (flt) => flt.CompName === "ItemMaster"
    )
  );
  const [uploadedImg, setUploadedImg] = useState([]);

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "save")
      ? keyboardKey.find((key) => key.EventCode === "save").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      saveRef.current.click();
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "back")
      ? keyboardKey.find((key) => key.EventCode === "back").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      backRef.current.click();
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  const [itemData, setItemData] = useState();
  const mapData = async (data) => {
    if (data) {
      data.map(async (i) => {
        let data = {
          ItemCode: i.ItemCode,
          ItemName: i.ItemName,
          ItemDesc: i.ItemDesc,
          UnitCode: i.UnitCode,
          SubCategoryCode: i.SubCategoryCode,
          BrandCode: i.BrandCode,
          ProductType: i.ProductType,
          PrintLabel: i.PrintLabel === "Y" ? true : false,
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
          SecondaryUnitCode: i.SecondaryUnitCode,
          ConversionRate: i.ConversionRate,
          OpnMRP: null,
          OpnQuantity: null,
          OpnSalePrice: null,
          OpnCostPrice: null,
          MaintainInventory: i.MaintainInventory === "Y" ? true : false,
          MBQ: i.MBQ,
          LabelCopies: i.LabelCopies,
          TaxType: i.TaxType,
        };
        await form.setFieldsValue(data);
        setItemData(data);
      });
      setICodeDisable(true);
      setSubCatCode(data[0].SubCategoryCode);
      setPrintLabel(data[0].PrintLabel === "Y" ? true : false);
    }

    // itemNameRef.current.focus();
    // itemNameRef.current.select();
  };

  // useEffect(() => {
  //   if (props.entryMode == "A") {
  //     if (Autocode.length > 0) {
  //       form.setFieldsValue({
  //         ItemCode: Autocode[0].NextVal,
  //       });
  //       setICode();
  //       setICode(Autocode[0].NextVal);
  //       setICodeDisable(true);
  //     }
  //   }
  // }, [Autocode]);

  useEffect(() => {
    if (iCode) {
      fetchItemMasterCard(CompCode, iCode).then((resp) => {
        try {
          if (resp.length > 0) {
            if (props.entryMode === "A") {
              swal(
                "Item Code Already Exist",
                "Are you sure you want to edit this item?",
                {
                  buttons: ["Cancel", "Yes!"],
                }
              ).then(async (val) => {
                if (val) {
                  await mapData(resp);
                } else {
                  setICode();
                  mapData();
                  form.setFieldsValue({
                    ItemCode: null,
                  });
                  setICodeDisable(false);
                }
              });
            } else {
              // console.log(resp);
              mapData(resp);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
        }
      });
    }
  }, [iCode]);

  useEffect(() => {
    getItemMasterServices(CompCode).then(async (res) => {
      let variantType = await fetchVariationTypesConfigHdr(CompCode);
      if (variantType) {
        setVariantTypes(variantType);
      }

      let tmp = [];
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

        await keyboardHotkeyConfig.forEach((row, index) => {
          tmp.push({ ...row, key: index, isDirty: false });
        });
      } catch (err) {
        console.error(err);
      }

      setKeyboardKey(tmp);
      dispatch(fetchCategoryMasters());
      dispatch(fetchManufacturerMasters());
      dispatch(fetchUnitMaster());
      setIsLoadingData(false);
      itemNameRef.current.focus();
      // itemNameRef.current.select();
    });

    if (props.entryMode === "A") {
      fetchSequenceNextVal(CompCode, "ITEM", l_LoginUser).then((seqNextVal) => {
        if (seqNextVal.length > 0) {
          if (seqNextVal[0].NextVal) {
            form.setFieldsValue({
              ItemCode: seqNextVal[0].NextVal,
            });
            setICode(seqNextVal[0].NextVal);
            setICodeDisable(true);
          }
        }
      });
    }
  }, []);

  const onRefreshKeyConfig = (mode) => {
    fetchKeyboardHotKeyConfig(CompCode).then((res) => {
      if (res && res.length > 0) {
        let tmp = [];
        res
          .filter((flt) => flt.CompName === mode)
          .forEach((row, index) => {
            tmp.push({ ...row, key: index, isDirty: false });
          });
        setKeyboardKey(tmp);
      }
    });
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
    }
  };

  const onReset = () => {
    setIsResetClicked(!isResetClicked);
    // setICodeDisable(false);
    form.setFieldsValue({
      ItemName: "",
      ItemDesc: "",
      UnitCode: null,
      SubCategoryCode: null,
      BrandCode: null,
      ProductType: null,
      PrintLabel: true,
      HSNSACCode: null,
      classCode: null,
      TaxCode: null,
      IsActive: true,
      SaleOnMRP: true,
      MarkUpDown: "",
      MarkUpDowType: "P",
      Cost: "",
      SalePrice: "",
      MRP: "",
      SecondaryUnitCode: null,
      ConversionRate: "",
      OpnMRP: null,
      OpnQuantity: null,
      OpnSalePrice: null,
      OpnCostPrice: null,
      MaintainInventory: true,
      MBQ: null,
      LabelCopies: null,
      TaxType: null,
    });
  };

  const onFinish = (values) => {
    let ItemInfoDtlData = getItemInfoDtlData();
    const data = {
      val: {
        ItemCode: values.ItemCode.toUpperCase(),
        ItemName: values.ItemName,
        ItemDesc: values.ItemDesc,
        UnitCode: values.UnitCode,
        SubCategoryCode: values.SubCategoryCode,
        BrandCode: values.BrandCode,
        classCode: values.classCode,
        IsActive: values.IsActive,
        ProductType: values.ProductType,
        PrintLabel: values.PrintLabel === true ? "Y" : "N",
        HSNSACCode: values.HSNSACCode,
        TaxCode: values.TaxCode,
        IsSaleOnMRP: values.SaleOnMRP === true ? "Y" : "N",
        MarkUpDown: values.MarkUpDown,
        MarkUpDownPV: values.MarkUpDowType,
        Cost: values.Cost,
        MRP: values.MRP,
        SalePrice: values.SalePrice,
        SecondaryUnitCode: values.SecondaryUnitCode,
        ConversionRate: values.ConversionRate,
        updt_usrId: l_loginUser,
        MaintainInventory: values.MaintainInventory === true ? "Y" : "N",
        MBQ: values.MBQ,
        LabelCopies: values.LabelCopies,
        TaxType: defaultTax.value1 === "P" ? values.TaxType : null,
        MainItemCode: null,
        Var1: null,
        Var2: null,
        Var3: null,
        Var4: null,
        Var5: null,
      },
      bData: getTableData(),
      dData: deletedBarcode(),
      iData: sendFireBaseData(),
      idData: deletedFireBaseData(),
      uploadPath: FileUploadPath,
    };

    let OpnData = getOpeningStockData();
    let tempItemTemplateData;
    if (
      ItemInfoDtlData.dtlData &&
      ItemInfoDtlData.dtlData.filter(
        (q) =>
          (q.IsCompulsary === "Y" && _.includes([null, ""], q.FieldValue)) ||
          q.FieldTitle === "" ||
          q.FieldTitle === null
      ).length > 0
    ) {
      message.error("Additional info required fields cannot be empty");
      return;
    } else if (ItemInfoDtlData.dtlData) {
      tempItemTemplateData = {
        Hdrdata: {
          ItemCode: ItemInfoDtlData.hdrData.ItemCode,
          TemplateId: ItemInfoDtlData.hdrData.TemplateId,
        },
        dtlData: [],
      };

      ItemInfoDtlData.dtlData.forEach((row) => {
        tempItemTemplateData.dtlData.push({
          ItemCode: row.ItemCode,
          FieldTitle: row.FieldTitle,
          FieldValue: row.FieldValue,
          TemplId: row.TempId,
          TemplSrNo: row.TmplSrNo,
          UpdtUsr: l_loginUser,
        });
      });
    }

    let TmpOpnData = [];
    OpnData.forEach((row) => {
      TmpOpnData.push({
        ...row,
        CompCode: CompCode,
        BranchCode: row.BranchCode,
        DeptCode: row.DeptCode,
        ItemCode: values.ItemCode.toUpperCase(),
        BatchNo: null,
        ExpiryDate: null,
        Rate: row.Cost,
        SaleRate: row.Sale,
        MRP: row.MRP,
        Qty: row.Qty,
        Remark: null,
        UpdtUsr: l_loginUser,
        isDirty: row.isDirty,
        isDeleted: row.isDeleted,
        isFromDatabase: row.isFromDatabase,
      });
    });

    let variantData = variationDataSource
      .filter((ff) => (props.entryMode === "A" ? ff.isDeleted === false : true))
      .map((aa) => {
        let ItemCodeSKU = _.padStart(aa.key, 3, "0");
        let varBarData = !_.includes([null, "", undefined], aa.barcode)
          ? [
              {
                key: 1,
                barcode: aa.barcode,
                isDirty: true,
                itemCode: `${values.ItemCode.toUpperCase()}-${ItemCodeSKU}`,
              },
            ]
          : [];
        let varDeleteBarData =
          !_.includes([null, "", undefined], aa.initialBarcode) &&
          aa.initialBarcode !== aa.barcode
            ? [
                {
                  key: 1,
                  barcode: aa.initialBarcode,
                  isDirty: false,
                  itemCode: `${values.ItemCode.toUpperCase()}-${ItemCodeSKU}`,
                },
              ]
            : [];
        let varT = {
          Var1: null,
          Var2: null,
          Var3: null,
          Var4: null,
          Var5: null,
        };
        let tempVariants = variantTypes;

        aa.variantType.map((vt) => {
          let i = tempVariants.findIndex((tvt) => tvt.ValueMember === vt.name);
          tempVariants[i].toBeStoredData = vt.tag;
        });
        tempVariants.map((b) => {
          varT[b.ValueMember] = b.toBeStoredData ? b.toBeStoredData : null;
        });

        let skuCode = `${values.ItemCode.toUpperCase()}-${ItemCodeSKU}`;
        let tempVarValData = {
          ItemCode: `${values.ItemCode.toUpperCase()}-${ItemCodeSKU}`,
          ItemName: values.ItemName,
          ItemDesc: values.ItemDesc,
          UnitCode: values.UnitCode,
          SubCategoryCode: values.SubCategoryCode,
          BrandCode: values.BrandCode,
          classCode: values.classCode,
          IsActive: aa.isDeleted ? false : true,
          ProductType: values.ProductType,
          PrintLabel: values.PrintLabel === true ? "Y" : "N",
          HSNSACCode: values.HSNSACCode,
          TaxCode: values.TaxCode,
          IsSaleOnMRP: values.SaleOnMRP === true ? "Y" : "N",
          MarkUpDown: values.MarkUpDown,
          MarkUpDownPV: values.MarkUpDowType,
          Cost: aa.costPrice ? aa.costPrice : aa.price,
          MRP: aa.MRP ? aa.MRP : aa.price,
          SalePrice: aa.price,
          SecondaryUnitCode: values.SecondaryUnitCode,
          ConversionRate: values.ConversionRate,
          updt_usrId: l_loginUser,
          MaintainInventory: values.MaintainInventory === true ? "Y" : "N",
          MBQ: values.MBQ,
          LabelCopies: values.LabelCopies,
          TaxType: defaultTax.value1 === "P" ? values.TaxType : null,
          MainItemCode: values.ItemCode.toUpperCase(),
          Var1: null,
          Var2: null,
          Var3: null,
          Var4: null,
          Var5: null,
          ...varT,
        };
        let tdata = {
          bData: aa.isDeleted ? [] : varBarData,
          val: tempVarValData,
          dData: varDeleteBarData,
          iData: aa.isDeleted
            ? []
            : uploadedImg.filter(
                (aa) => aa.ItemCode === skuCode && aa.isDeleted === false
              ),
          idData: aa.isDeleted
            ? uploadedImg.filter((aa) => aa.ItemCode === skuCode)
            : uploadedImg.filter(
                (aa) => aa.ItemCode === skuCode && aa.isDeleted === true
              ),
        };
        return { ...tdata };
      });

    // console.log(variantData, "final insert");
    // return;
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtItemMaster(CompCode, data).then((res) => {
          let insOpnStk = TmpOpnData.filter(
            (ii) =>
              ii.isFromDatabase === false &&
              ii.isDirty === true &&
              ii.isDeleted === false &&
              !_.includes([null, ""], ii.Rate) &&
              !_.includes([null, ""], ii.SaleRate) &&
              !_.includes([null, ""], ii.MRP) &&
              !_.includes([null, ""], ii.Qty)
          );
          let dltOpnStk = TmpOpnData.filter(
            (ii) => ii.isFromDatabase === true && ii.isDeleted === true
          );

          let updtOpnStk = TmpOpnData.filter(
            (ii) => ii.isFromDatabase === true && ii.isDirty === true
          );

          Promise.all([
            InsOpeningStock(CompCode, insOpnStk).then((res1) => {
              return res1;
            }),
            InvDeleteOpeningStock(CompCode, dltOpnStk).then((res2) => {
              return res2;
            }),
            InvUpdateOpeningStock(CompCode, updtOpnStk).then((res3) => {
              return res3;
            }),
            saveItemMstAddInfoDtl(CompCode, tempItemTemplateData).then(
              (res4) => {
                return res4;
              }
            ),
            variantData.map((vd) => {
              InsUpdtItemMaster(CompCode, vd).then((res5) => {
                return res5;
              });
            }),
          ]).then((res) => {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress(values);
            props.onBackPress();
            setICode();
          });
        });
      } else {
        itemNameRef.current.focus();
      }
    });
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
                  ref={formRef}
                  labelAlign="left"
                  {...formItemLayout}
                  onFinish={onFinish}
                  onFieldsChange={(val) => {
                    setItemData({ ...form.getFieldsValue(true) });
                  }}
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
                            <span style={{ color: "red" }}>*</span> Item Code :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="ItemCode"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Enter Item Code",
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
                                  placeholder="Item Code"
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
                            <span style={{ color: "red" }}>*</span> Item Name :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="ItemName"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Enter Item Name",
                                  },
                                ]}
                              >
                                <Input
                                  ref={itemNameRef}
                                  placeholder="Please Enter Item Name"
                                  onKeyDown={handleKeyDown}
                                  onChange={(e) => {
                                    if (props.entryMode == "A") {
                                      form.setFieldsValue({
                                        ItemDesc: e.target.value,
                                      });
                                    }
                                  }}
                                />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                            Description :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="ItemDesc"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                              >
                                <TextArea rows={3} />
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
                            <span style={{ color: "red" }}>*</span> Product Type
                            :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="ProductType"
                                style={{ marginBottom: -3, flex: 1 }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Product Type",
                                  },
                                ]}
                              >
                                <Select
                                  onKeyDown={handleKeyDown}
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  placeholder="Please Select Product Type"
                                  onChange={(val) => {
                                    if (val === "D") {
                                      form.setFieldsValue({ UnitCode: "PC" });
                                    }
                                  }}
                                >
                                  <Option value="D">Direct</Option>
                                  <Option value="L">Loose</Option>
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
                            <span style={{ color: "red" }}>*</span> Sub Category
                            :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="SubCategoryCode"
                                style={{
                                  marginBottom: -3,
                                  flex: 1,
                                  width: "85%",
                                }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Sub Category",
                                  },
                                ]}
                              >
                                <Select
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  placeholder="Please Select Sub Category"
                                  onChange={(val) => {
                                    if (val) {
                                      const hh = subCatMaster.filter(
                                        (i) => i.SubCatCode === val
                                      );
                                      if (hh.length > 0) {
                                        form.setFieldsValue({
                                          HSNSACCode: hh[0].defHsnSacCode,
                                          TaxCode: hh[0].DefTaxCode,
                                        });
                                        setBtnDisable({
                                          ...btnDisable,
                                          subCat: false,
                                          hsnsac: false,
                                          tax: false,
                                        });
                                      }
                                      setSubCatCode(val);
                                    } else {
                                      form.setFieldsValue({
                                        HSNSACCode: null,
                                        TaxCode: null,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        subCat: true,
                                        hsnsac: true,
                                        tax: true,
                                      });
                                      setSubCatCode();
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
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Add New Sub-Category"
                              >
                                <Button
                                  icon={<FileAddOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  type="primary"
                                  size="small"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 42
                                    ).Rights.find((i) => i.RightCode === "ADD")
                                      .RightVal === "N"
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "SUBCAT",
                                      entryMode: "A",
                                    });
                                  }}
                                />
                              </Tooltip>

                              <Tooltip
                                style={{ width: "5%" }}
                                title="Edit this Sub-Category"
                              >
                                <Button
                                  icon={<EditOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  size="small"
                                  type="primary"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 42
                                    ).Rights.find((i) => i.RightCode === "EDIT")
                                      .RightVal === "N" || btnDisable.subCat
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "SUBCAT",
                                      entryMode: "E",
                                      formData: subCatMaster.find(
                                        (i) =>
                                          i.SubCatCode ===
                                          form.getFieldValue("SubCategoryCode")
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
                            <span style={{ color: "red" }}>*</span> Brand :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="BrandCode"
                                style={{
                                  marginBottom: -3,
                                  flex: 1,
                                  width: "85%",
                                }}
                                wrapperCol={24}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Brand",
                                  },
                                ]}
                              >
                                <Select
                                  onKeyDown={handleKeyDown}
                                  allowClear
                                  showSearch
                                  placeholder="Please Select Brand"
                                  optionFilterProp="children"
                                  onChange={(val) => {
                                    if (val) {
                                      setBtnDisable({
                                        ...btnDisable,
                                        brand: false,
                                      });
                                    } else {
                                      setBtnDisable({
                                        ...btnDisable,
                                        brand: true,
                                      });
                                    }
                                  }}
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
                              </Form.Item>{" "}
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Add New Brand"
                              >
                                <Button
                                  icon={<FileAddOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  type="primary"
                                  size="small"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 45
                                    ).Rights.find((i) => i.RightCode === "ADD")
                                      .RightVal === "N"
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "BRAND",
                                      entryMode: "A",
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Edit this Brand"
                              >
                                <Button
                                  icon={<EditOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  size="small"
                                  type="primary"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 45
                                    ).Rights.find((i) => i.RightCode === "EDIT")
                                      .RightVal === "N" || btnDisable.brand
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "BRAND",
                                      entryMode: "E",
                                      formData: brandMaster.find(
                                        (i) =>
                                          i.BrandCode ===
                                          form.getFieldValue("BrandCode")
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
                            <span style={{ color: "red" }}>*</span> Product
                            Class :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                // justify="center"
                                name="classCode"
                                style={{
                                  marginBottom: -3,
                                  flex: 1,
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
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Add New Class"
                              >
                                <Button
                                  icon={<FileAddOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  type="primary"
                                  size="small"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 58
                                    ).Rights.find((i) => i.RightCode === "ADD")
                                      .RightVal === "N"
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "CLASS",
                                      entryMode: "A",
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                style={{ width: "5%" }}
                                title="Edit this Class"
                              >
                                <Button
                                  icon={<EditOutlined />}
                                  style={{ margin: "3px 3px" }}
                                  size="small"
                                  type="primary"
                                  shape="circle"
                                  disabled={
                                    UserAccess.find(
                                      (i) => i.ModuleId === 58
                                    ).Rights.find((i) => i.RightCode === "EDIT")
                                      .RightVal === "N" || btnDisable.class
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    setIsShowModal({
                                      modalType: "CLASS",
                                      entryMode: "E",
                                      formData: classMaster.find(
                                        (i) =>
                                          i.ClassCode ===
                                          form.getFieldValue("classCode")
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
                            Status :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <Row>
                              <Col
                                style={{ alignSelf: "center" }}
                                xl={4}
                                lg={4}
                                md={4}
                                sm={4}
                                xs={24}
                              >
                                <Form.Item
                                  name="IsActive"
                                  style={{ marginBottom: -3, flex: 1 }}
                                  wrapperCol={24}
                                  valuePropName="checked"
                                  colon={false}
                                >
                                  <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="In-Active"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                style={{ alignSelf: "center" }}
                                xl={20}
                                lg={20}
                                md={20}
                                sm={20}
                                xs={24}
                              >
                                <Row>
                                  <Col
                                    style={{
                                      alignSelf: "center",
                                      paddingRight: 15,
                                      paddingLeft: 15,
                                    }}
                                  >
                                    {`Maintain Inventory`} :
                                  </Col>
                                  <Col style={{ alignSelf: "center" }}>
                                    <Form.Item
                                      name="MaintainInventory"
                                      style={{ marginBottom: -3, flex: 1 }}
                                      wrapperCol={24}
                                      valuePropName="checked"
                                      colon={false}
                                    >
                                      <Switch
                                        checkedChildren="Active"
                                        unCheckedChildren="In-Active"
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
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
                            <span style={{ color: "red" }}>*</span> Primary Unit
                            :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <div style={{ display: "flex", flex: 1 }}>
                                <Form.Item
                                  name="UnitCode"
                                  style={{
                                    marginBottom: -3,
                                    flex: 1,
                                    width: "70%",
                                  }}
                                  wrapperCol={24}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please Select Unit",
                                    },
                                  ]}
                                >
                                  <Select
                                    onKeyDown={handleKeyDown}
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="Please Select Unit"
                                    onChange={(val) => {
                                      if (val) {
                                        setBtnDisable({
                                          ...btnDisable,
                                          unit: false,
                                        });
                                      } else {
                                        setBtnDisable({
                                          ...btnDisable,
                                          unit: true,
                                        });
                                      }
                                    }}
                                  >
                                    {unitMaster.length > 0 &&
                                      unitMaster
                                        .filter(
                                          (i) =>
                                            i.IsActive === true &&
                                            i.UnitCode !==
                                              form.getFieldValue(
                                                "SecondaryUnitCode"
                                              )
                                        )
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
                                <Tooltip
                                  style={{ width: "5%" }}
                                  title="Add New Unit"
                                >
                                  <Button
                                    icon={<FileAddOutlined />}
                                    type="primary"
                                    style={{ margin: "3px 3px" }}
                                    size="small"
                                    disabled={
                                      UserAccess.find(
                                        (i) => i.ModuleId === 48
                                      ).Rights.find(
                                        (i) => i.RightCode === "ADD"
                                      ).RightVal === "N"
                                        ? true
                                        : false
                                    }
                                    shape="circle"
                                    onClick={() => {
                                      setIsShowModal({
                                        modalType: "UNIT",
                                        entryMode: "A",
                                      });
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip
                                  style={{ width: "5%" }}
                                  title="Edit this Unit"
                                >
                                  <Button
                                    icon={<EditOutlined />}
                                    size="small"
                                    type="primary"
                                    style={{ margin: "3px 3px" }}
                                    shape="circle"
                                    disabled={
                                      UserAccess.find(
                                        (i) => i.ModuleId === 48
                                      ).Rights.find(
                                        (i) => i.RightCode === "EDIT"
                                      ).RightVal === "N" || btnDisable.unit
                                        ? true
                                        : false
                                    }
                                    onClick={() => {
                                      setIsShowModal({
                                        modalType: "UNIT",
                                        entryMode: "E",
                                        formData: unitMaster.find(
                                          (i) =>
                                            i.UnitCode ===
                                            form.getFieldValue("UnitCode")
                                        ),
                                      });
                                    }}
                                  />
                                </Tooltip>
                              </div>
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
                                      .filter((i) => i.IsActive === true)
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
                        <Row>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}>*</span> Sale On MRP
                            :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <Row style={{ margin: "0px 0px 5px 0px" }}>
                              <Col xl={3} lg={3} md={3} sm={24} xs={24}>
                                <div style={{ display: "flex" }}>
                                  <Form.Item
                                    name="SaleOnMRP"
                                    rules={[
                                      {
                                        required: true,
                                        message: `Please select`,
                                      },
                                    ]}
                                    valuePropName="checked"
                                    style={{ marginBottom: -3, flex: 1 }}
                                    wrapperCol={24}
                                  >
                                    <Switch
                                      onChange={(val) => {
                                        if (val) {
                                          setMarkUpDownCaption("Mark Down");
                                        } else {
                                          setMarkUpDownCaption("Mark Up");
                                        }
                                      }}
                                    />
                                  </Form.Item>
                                </div>
                              </Col>
                              <Col xl={21} lg={21} md={21} sm={24} xs={24}>
                                <Row>
                                  <Col
                                    style={{ alignSelf: "center" }}
                                    xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={24}
                                  >
                                    {` ${markUpDownCaption}`} :
                                  </Col>
                                  <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                                    <div style={{ display: "flex" }}>
                                      <Form.Item
                                        colon={false}
                                        name="MarkUpDown"
                                        style={{
                                          marginBottom: -3,
                                          // display: "inline-block",
                                          // width: "calc(70% - 8px)",
                                          flex: 1,
                                          // minWidth: "70%",
                                        }}
                                        wrapperCol={24}
                                        rules={
                                          markUpDownType == "P"
                                            ? [
                                                {
                                                  pattern:
                                                    /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)/g,
                                                  message: "Wrong format!",
                                                },
                                              ]
                                            : [
                                                {
                                                  pattern:
                                                    /((\d+)((\.\d{1,2})?))$/gm,
                                                  message: "Wrong format!",
                                                },
                                              ]
                                        }
                                      >
                                        <Input
                                          type="number"
                                          style={{ textAlign: "right" }}
                                          step={0.001}
                                          min={0}
                                          placeholder={`${markUpDownCaption}`}
                                          onKeyDown={handleKeyDown}
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        name="MarkUpDowType"
                                        style={{
                                          marginBottom: -3,
                                          // display: "inline-block",
                                          // width: "calc(30% - 8px)",
                                          margin: "0 8px",
                                          // minWidth: "50%",
                                          // width: 82.02,
                                          // flex: 1,
                                        }}
                                        wrapperCol={24}
                                      >
                                        <Radio.Group
                                          onChange={(val) => {
                                            setMarkUpDownType(val.target.value);
                                            form.setFieldsValue({
                                              MarkUpDown: "",
                                            });
                                          }}
                                          // defaultValue="a"
                                          buttonStyle="solid"
                                          rules={[
                                            {
                                              required: true,
                                              message: `Select input your Mark Up!`,
                                            },
                                          ]}
                                        >
                                          <Radio.Button value="P">
                                            %
                                          </Radio.Button>
                                          <Radio.Button value="V">{`${
                                            config.filter(
                                              (ii) =>
                                                ii.configCode === "CURRENCY"
                                            )[0].value1
                                          }`}</Radio.Button>
                                        </Radio.Group>
                                      </Form.Item>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row
                          style={{
                            margin: "0px 0px 0px 0px",
                            display: "flex",
                          }}
                        >
                          <div
                            style={{
                              border: `1px solid #d9d9d9`,
                              display: "flex",
                              margin: "0px 5px 5px 0px",
                              width: "50%",
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                padding: "0px 5px",
                                backgroundColor: "#FFF",
                                display: "flex",
                                alignItems: "center",
                                color: "#000",
                              }}
                            >
                              Print Label :
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                margin: "0px 0px",
                                marginLeft: 1,
                                background: "#F1f1f1",
                                flex: 1,
                              }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  paddingLeft: 1,
                                  display: "flex",
                                }}
                              >
                                <Form.Item
                                  name="PrintLabel"
                                  style={{
                                    marginBottom: -3,
                                    margin: "0px 5px",
                                  }}
                                  valuePropName="checked"
                                >
                                  <Switch
                                    onChange={(e) => {
                                      setPrintLabel(e);
                                    }}
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                  />
                                </Form.Item>{" "}
                                <Form.Item
                                  colon={false}
                                  name="LabelCopies"
                                  style={{
                                    marginBottom: 0,
                                    width: "100%",
                                    textAlignLast: "right",
                                  }}
                                  wrapperCol={24}
                                >
                                  <Input
                                    // allowClear
                                    type="number"
                                    min={0}
                                    style={{
                                      width: "100%",
                                    }}
                                    disabled={!printLabel}
                                    placeholder={"Copies"}
                                    onKeyDown={handleKeyDown}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              border: `1px solid #d9d9d9`,
                              display: "flex",
                              // width: "50%",
                              margin: "0px 5px 5px 0px",
                              width: "50%",
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                padding: "0px 5px",
                                backgroundColor: "#FFF",
                                display: "flex",
                                alignItems: "center",
                                color: "#000",
                                // minWidth: 100,
                              }}
                            >
                              Re-Order :
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                margin: "0px 0px",
                                marginLeft: 1,
                                background: "#F1f1f1",
                                flex: 1,
                              }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  paddingLeft: 1,
                                  display: "flex",
                                }}
                              >
                                <Form.Item
                                  colon={false}
                                  name="MBQ"
                                  style={{
                                    marginBottom: 0,
                                    width: "100%",
                                    textAlignLast: "right",
                                  }}
                                  wrapperCol={24}
                                >
                                  <Input
                                    allowClear
                                    type="number"
                                    min={0}
                                    style={{
                                      width: "100%",
                                      textAlign: "right",
                                    }}
                                    placeholder={"Re-Order level"}
                                    onKeyDown={handleKeyDown}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </Row>
                        <Row style={{ margin: "0px 0px 0px 0px" }}>
                          <div
                            style={{
                              border: `1px solid #d9d9d9`,
                              display: "flex",
                              width: "32%",
                              margin: "0px 5px 5px 0px",
                            }}
                            // className="btn-custom-style"
                          >
                            <div
                              style={{
                                padding: "0px 5px",
                                backgroundColor: "#FFF",
                                display: "flex",
                                alignItems: "center",
                                color: "#000",
                                // minWidth: 100,
                              }}
                            >
                              Cost :
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                margin: "0px 0px",
                                marginLeft: 1,
                                background: "#F1f1f1",
                                flex: 1,
                                // maxWidth: 120,
                              }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  paddingLeft: 1,
                                  display: "flex",
                                }}
                              >
                                <span
                                  style={{
                                    color: "rgb(0,0,0,0.6)",
                                    padding: " 0px 6px",
                                  }}
                                >
                                  {currency.value1}
                                </span>
                                <Form.Item noStyle name="Cost">
                                  <Input
                                    type="number"
                                    placeholder={`Enter Cost`}
                                    onKeyDown={handleKeyDown}
                                    step={0.001}
                                    min={0}
                                    style={{ textAlign: "right" }}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              border: `1px solid #d9d9d9`,
                              display: "flex",
                              width: "32%",
                              margin: "0px 5px 5px 0px",
                            }}
                            // className="btn-custom-style"
                          >
                            <div
                              style={{
                                padding: "0px 5px",
                                backgroundColor: "#FFF",
                                display: "flex",
                                alignItems: "center",
                                color: "#000",
                                // minWidth: 100,
                              }}
                            >
                              Sale :
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                margin: "0px 0px",
                                marginLeft: 1,
                                background: "#F1f1f1",
                                flex: 1,
                              }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  paddingLeft: 1,
                                  display: "flex",
                                }}
                              >
                                <span
                                  style={{
                                    color: "rgb(0,0,0,0.6)",
                                    padding: " 0px 6px",
                                  }}
                                >
                                  {currency.value1}
                                </span>
                                <Form.Item name="SalePrice" noStyle>
                                  <Input
                                    type="number"
                                    onKeyDown={handleKeyDown}
                                    style={{
                                      width: "100%",
                                      textAlign: "right",
                                    }}
                                    placeholder={`Enter Sale Price`}
                                    onBlur={(val) => {
                                      if (props.entryMode === "A") {
                                        form.setFieldsValue({
                                          MRP: val.target.value,
                                        });
                                      }
                                    }}
                                    step={0.003}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              border: `1px solid #d9d9d9`,
                              display: "flex",
                              width: "32%",
                              margin: "0px 5px 5px 0px",
                            }}
                            // className="btn-custom-style"
                          >
                            <div
                              style={{
                                padding: "0px 5px",
                                backgroundColor: "#FFF",
                                display: "flex",
                                alignItems: "center",
                                color: "#000",
                                // minWidth: 100,
                              }}
                            >
                              MRP :
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                margin: "0px 0px",
                                marginLeft: 1,
                                background: "#F1f1f1",
                                flex: 1,
                                // maxWidth: 120,
                              }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  paddingLeft: 1,
                                  display: "flex",
                                }}
                              >
                                <span
                                  style={{
                                    color: "rgb(0,0,0,0.6)",
                                    padding: " 0px 6px",
                                  }}
                                >
                                  {currency.value1 ? currency.value1 : "1"}
                                </span>
                                <Form.Item name="MRP" noStyle>
                                  <Input
                                    type="number"
                                    placeholder={`Enter MRP`}
                                    onKeyDown={handleKeyDown}
                                    step={0.001}
                                    style={{ textAlign: "right" }}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </Row>
                        {defaultTax.value1 === "P" && (
                          <Row style={{ margin: "0px 0px 5px 0px" }}>
                            <Col
                              style={{ alignSelf: "center" }}
                              xl={6}
                              lg={6}
                              md={6}
                              sm={6}
                              xs={24}
                            >
                              <span style={{ color: "red" }}>*</span> Tax Type :
                            </Col>
                            <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                              <div style={{ display: "flex" }}>
                                <Form.Item
                                  name="TaxType"
                                  style={{ marginBottom: -3, flex: 1 }}
                                  wrapperCol={24}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please Select Tax Type",
                                    },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                  >
                                    <Option value={"I"}>Inclusive</Option>
                                    <Option value={"E"}>Exclusive</Option>
                                  </Select>
                                </Form.Item>
                              </div>
                            </Col>
                          </Row>
                        )}
                      </Card>
                    </Col>
                  </Row>
                  {/* </Form> */}
                  <variationDetailContext.Provider
                    value={{
                      variationDataSource,
                      setVariationDataSource,
                      variantTypes,
                      itemData,
                      CompCode,
                      uploadedImg,
                      setUploadedImg,
                      fetchImageUpload,
                      setFetchImageUpload,
                    }}
                  >
                    <ItemMasterTabsCard
                      showBarcode={`${
                        config.filter((ii) => ii.configCode === "BARCODE")[0]
                          .value1
                      }`}
                      showAdditionalInfo={`${
                        config.filter(
                          (ii) => ii.configCode === "ENABLE_ADD_Item_Info"
                        )[0].value1
                      }`}
                      ItemCode={iCode}
                      ResetClicked={isResetClicked}
                      entryMode={props.entryMode}
                      form={form}
                      SubCat={subCatCode}
                    />
                  </variationDetailContext.Provider>
                  <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                  {/* <Form form={form} onFinish={onFinish}> */}
                  <Form.Item noStyle={true}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      ref={saveRef}
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
                      ref={backRef}
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
                {isShowModal && (
                  <Modal
                    forceRender
                    getContainer={false}
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
                    {isShowModal.modalType === "SUBCAT" && (
                      <SubMasterCategoryCard
                        title={"SubCategory Master"}
                        formData={isShowModal.formData}
                        onBackPress={() => {
                          setIsShowModal();
                        }}
                        entryMode={isShowModal.formData ? "E" : "A"}
                        onSavePress={(val) => {
                          setSubCatCode();
                          if (val.IsActive) {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                try {
                                  await res.map((ii) => {
                                    setSubCatCode();
                                    if (ii.subCategory) {
                                      setSubCatmaster(ii.subCategory);
                                      setSubCatCode(val.SubCatCode);
                                      form.setFieldsValue({
                                        SubCategoryCode: val.SubCatCode,
                                        HSNSACCode: ii.subCategory.filter(
                                          (i) => i.SubCatCode === val.SubCatCode
                                        )[0].defHsnSacCode,
                                        TaxCode: ii.subCategory.filter(
                                          (i) => i.SubCatCode === val.SubCatCode
                                        )[0].DefTaxCode,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        subCat: false,
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
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                try {
                                  await res.map((ii) => {
                                    if (ii.subCategory) {
                                      setSubCatmaster(ii.subCategory);
                                      form.setFieldsValue({
                                        SubCategoryCode: null,
                                        HSNSACCode: null,
                                        TaxCode: null,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        subCat: true,
                                        hsnsac: true,
                                        tax: true,
                                      });
                                    }
                                    setSubCatCode();
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
                    {isShowModal.modalType === "BRAND" && (
                      <BrandMasterCard
                        title={"Brand Master"}
                        entryMode={isShowModal.entryMode}
                        formData={isShowModal.formData}
                        onBackPress={() => {
                          setIsShowModal();
                        }}
                        onSavePress={(val) => {
                          if (val.IsActive) {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.brandMaster) {
                                    setBrandmaster(ii.brandMaster);
                                    form.setFieldsValue({
                                      BrandCode: val.BrandCode,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
                                      brand: false,
                                    });
                                  }
                                });
                              }
                            );
                          } else {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.brandMaster) {
                                    setBrandmaster(ii.brandMaster);
                                    form.setFieldsValue({
                                      BrandCode: null,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
                                      brand: true,
                                    });
                                  }
                                });
                              }
                            );
                          }
                        }}
                      />
                    )}
                    {isShowModal.modalType === "CLASS" && (
                      <ClassMasterCard
                        title={"Class Master"}
                        formData={isShowModal.formData}
                        onBackPress={() => {
                          setIsShowModal();
                        }}
                        onSavePress={(val) => {
                          if (val.IsActive) {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.classMaster) {
                                    setClassMaster(ii.classMaster);
                                    form.setFieldsValue({
                                      classCode: val.ClassCode,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
                                      class: false,
                                    });
                                  }
                                });
                              }
                            );
                          } else {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.classMaster) {
                                    setClassMaster(ii.classMaster);
                                    form.setFieldsValue({
                                      classCode: null,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
                                      class: true,
                                    });
                                  }
                                });
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
                            getItemMasterServices(CompCode).then(
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
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.taxMaster) {
                                    setTaxmaster(ii.taxMaster);
                                    form.setFieldsValue({
                                      TaxCode: null,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
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
                    {isShowModal.modalType === "UNIT" && (
                      <UnitMasterCard
                        title={"Unit Master"}
                        formData={isShowModal.formData}
                        onBackPress={() => {
                          setIsShowModal();
                        }}
                        onSavePress={(val) => {
                          if (val.IsActive) {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.unitMaster) {
                                    setUnitmaster(ii.unitMaster);
                                    form.setFieldsValue({
                                      UnitCode: val.UnitCode,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
                                      unit: false,
                                    });
                                  }
                                });
                              }
                            );
                          } else {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                try {
                                  await res.map((ii) => {
                                    if (ii.unitMaster) {
                                      setUnitmaster(ii.unitMaster);
                                      form.setFieldsValue({
                                        UnitCode: null,
                                      });
                                      setBtnDisable({
                                        ...btnDisable,
                                        unit: true,
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
                          if (val.hsnsaccode && val.IsActive) {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.hsnsacMaster) {
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
                              }
                            );
                          } else {
                            getItemMasterServices(CompCode).then(
                              async (res) => {
                                await res.map((ii) => {
                                  if (ii.hsnsacMaster) {
                                    setHSNSACmaster(ii.hsnsacMaster);
                                    form.setFieldsValue({
                                      HSNSACCode: null,
                                    });
                                    setBtnDisable({
                                      ...btnDisable,
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
                  </Modal>
                )}
                <Col span={24} style={{ marginTop: 2 }}>
                  {keyboardKey.length > 0 && (
                    <Col span={24}>
                      <ViewHotKeysComponent
                        keyboardKey={keyboardKey}
                        title={`Item Master  (Hotkey Config)`}
                        RefreshKeyConfig={() => {
                          onRefreshKeyConfig("ItemMaster");
                        }}
                      />
                    </Col>
                  )}
                </Col>
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </>
  );
};

export default ItemMasterCardNew;
