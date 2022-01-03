import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  Row,
  Col,
  Button,
  Input,
  Card,
  Tabs,
  Radio,
  Drawer,
  Divider,
  Empty,
  Modal,
  message,
  AutoComplete,
  Tooltip,
  Menu,
  Dropdown,
} from "antd";
import moment from "moment";
import swal from "sweetalert";
import MenuCategoryCard from "./SubComponents/MenuCategoryCard";
import _ from "lodash";
import {
  RollbackOutlined,
  SearchOutlined,
  FilterOutlined,
  ApartmentOutlined,
  FileProtectOutlined,
  FileAddOutlined,
  CheckOutlined,
  SettingFilled,
} from "@ant-design/icons";
import MenuItemCard from "./SubComponents/MenuItemCard";
import MenuOption from "./SubComponents/MenuOption";
import CustomerSelectionComponent from "./SubComponents/CustomerSelectionComponent";
import NoOfPersonComponent from "./SubComponents/NoOfPersonComponent";
import CaptainSelectionCard from "./SubComponents/CaptainSelectionCard";
import DiscountComponent from "./SubComponents/DiscountComponent";
import BillSettlementComponent from "./SubComponents/BillSettlementComponent";
import IconMakeInIndia from "../../../../assets/IconSVG/Make_In_India.svg";
import IconTable from "../../../../assets/IconSVG/table.png";
import IconCust from "../../../../assets/IconSVG/cust.png";
import IconCustCount from "../../../../assets/IconSVG/cust_cnt.png";
import IconDisc from "../../../../assets/IconSVG/disc.png";
import IconSettle from "../../../../assets/IconSVG/settle.png";
import IconFood from "../../../../assets/IconSVG/food.png";
import nonveg from "../../../../assets/images/nonveg.png";
import veg from "../../../../assets/images/veg.png";
import Loader from "../../../common/loader";
import { useSelector, useDispatch } from "react-redux";
import { useHotkeys } from "react-hotkeys-hook";

import KOTItem from "./SubComponents/KOTItem";
import {
  saveKOT,
  saveTableStatus,
  fetchTableInfoAndKOTs,
  updateKOTAddInfo,
  fetchPrepareInvoiceDataRestaurant,
  uptRestarantPosKOTHdrStatus,
  uptRestarantPosKOTdtlStatus,
  restaurantPosProcessSpltTable,
  saveSplitTable,
  saveMergeTable,
  updtRestaurantPOSKOTDtlStatus,
  uptRestaurantKOTHdrTableNo,
} from "../../../../services/restaurant-pos";

import { SaveInvoice } from "../../../../services/service-managment/service-management";

import { fetchSequenceNextVal } from "../../../../shared/utility";
import SettleBillComponent from "./SubComponents/SettleBillComponent";
import VoidBillComponent from "./SubComponents/VoidBillComponent";
import SupportResolvedCardNew from "../../../support-ticket/SupportComponents/SupportResolvedCardNew";
import ReceiptRefundComponent from "./SubComponents/ReceiptRefundComponent";
import CounterSaleBillSave from "./SubComponents/CounterSaleBillSave";
import ViewHotKeysComponent from "../../../common/ViewHotKeysComponent";
import TableTransferComponent from "./SubComponents/TableTransferComponent";
import { fetchKeyboardHotKeyConfig } from "../../../../services/keyboard-hotkey-config";
// import { fetchKeyboardHotKeyConfig } from "../../../../store/actions/appMain";

const { TabPane } = Tabs;
const { TextArea } = Input;

const RestaurantPOSTran = (props) => {
  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const [currBranch, setCurrBranch] = useState("0");
  const [currMenuCategory, setCurrMenuCategory] = useState();
  const [currMenus, setCurrMenus] = useState();
  const [menuOptions, setMenuOptions] = useState();
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("ALL");
  const [pOSOptionDrawer, setPOSOptionDrawer] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCounterSaleSave, setShowCounterSaleSave] = useState(false);
  const l_LoginUserInfo = useSelector((state) => state.LoginReducer.userData);
  const [storedMenuData, setStoredMenuData] = useState({
    menu: {},
    var: [],
    addOn: [],
    selectedVar: -1,
    selectedAddOn: [],
  });
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [IsLoading, setIsLoading] = useState(false);
  const appconfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const [specialNote, setSpecialNote] = useState();
  const [NoteModal, setNoteModal] = useState();
  const handleModal = () => {
    setShowModal(!showModal);
    setStoredMenuData({
      menu: {},
      var: [],
      addOn: [],
      selectedVar: -1,
      selectedAddOn: [],
    });
  };
  const [showTableTransferModal, setShowTableTransferModal] = useState(false);

  const [checkData, setCheckData] = useState({
    Captian: false,
    NoOfPerson: false,
    customer: false,
    discount: false,
  });
  const [filterType, setFilterType] = useState("B");
  const [ModalType, setModalType] = useState();
  const [customerForm, setCustomerForm] = useState({
    customer: {
      userId: null,
      mobileNo: "",
      email: "",
      customerName: "",
      gender: null,
      GSTNo: "",
      address: [],
    },
    dob: {
      day: null,
      month: null,
      year: "",
    },
    anniversary: { day: null, month: null, year: "" },
  });
  const [selectedCaptain, setSelectedCaptain] = useState();
  const [selectedNoOfPerson, setSelectedNoOfPerson] = useState(0);
  const [discount, setDiscount] = useState({
    reason: "",
    type: "P",
    discountAmount: 0,
    couponCode: "",
  });
  const messagesEndRef = useRef(null);
  const [TotalData, setPrevTotalData] = useState(0);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [lastKOTId, setLastKOTId] = useState();
  const [settlementModal, setSettlementModal] = useState(false);
  const appConfigs = useSelector((state) => state.AppMain.appconfigs);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const [TotalAmount, setTotalAmount] = useState(0);
  const [voidBillModal, setVoidBillModal] = useState(false);
  const keyboardHotkeyConfig = useSelector((state) =>
    state.AppMain.keyboardHotKeyConfig.filter(
      (flt) => flt.CompName === props.CompName
    )
  );
  // console.log(props.CompName ? props.CompName : "RestaurantPOSTran", "result");
  const [keyboardKey, setKeyboardKey] = useState([]);

  // const gggg = () => {
  //   console.log("gggg", selectedMenu);
  // };
  const [amount, setAmount] = useState(0);
  const refBillSave = useRef();
  const refBillSaveAndPrint = useRef();
  const saveKot = useRef();
  const splitTable = useRef();
  const VoidBill = useRef();
  const Settle = useRef();
  const ClearTable = useRef();
  const customerSelectionRef = useRef();
  const DiscountRef = useRef();
  const CaptianRef = useRef();
  const NoofPersonRef = useRef();
  const SearchRef = useRef();
  const backRef = useRef();

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "SaveAndPrint")
      ? keyboardKey.find((key) => key.EventCode === "SaveAndPrint").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      if (refBillSaveAndPrint.current) {
        refBillSaveAndPrint.current.click();
      }
    }
  );
  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "splitTable")
      ? keyboardKey.find((key) => key.EventCode === "splitTable").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      splitTable.current.click();
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "kot")
      ? keyboardKey.find((key) => key.EventCode === "kot").HotKey
      : null,
    (a, b) => {
      a.preventDefault();

      if (saveKot.current) {
        saveKot.current.click();
      }
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "save")
      ? keyboardKey.find((key) => key.EventCode === "save").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      if (refBillSave.current) {
        refBillSave.current.click();
      }
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "settlement")
      ? keyboardKey.find((key) => key.EventCode === "settlement").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      if (Settle.current) {
        Settle.current.click();
      }
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "voidBill")
      ? keyboardKey.find((key) => key.EventCode === "voidBill").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      if (VoidBill.current) {
        VoidBill.current.click();
      }
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "clearTable")
      ? keyboardKey.find((key) => key.EventCode === "clearTable").HotKey
      : null,

    (a, b) => {
      a.preventDefault();

      if (ClearTable.current) {
        ClearTable.current.click();
      }
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "back")
      ? keyboardKey.find((key) => key.EventCode === "back").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      backRef.current.click();
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "customerSelection")
      ? keyboardKey.find((key) => key.EventCode === "customerSelection").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      customerSelectionRef.current.click();
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "discount")
      ? keyboardKey.find((key) => key.EventCode === "discount").HotKey
      : null,
    (a, b) => {
      a.preventDefault();

      // console.log(DiscountRef, "discount ref");
      if (DiscountRef.current) {
        DiscountRef.current.click();
      }
    }
  );
  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "noOfPerson")
      ? keyboardKey.find((key) => key.EventCode === "noOfPerson").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      if (NoofPersonRef.current) {
        NoofPersonRef.current.click();
      }
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "captain")
      ? keyboardKey.find((key) => key.EventCode === "captain").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      CaptianRef.current.click();
    }
  );
  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "search")
      ? keyboardKey.find((key) => key.EventCode === "search").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      SearchRef.current.focus();
    }
  );

  useEffect(() => {
    if (selectedMenu.length > 0) {
      // if (parseInt(selectedMenu.length + 1) > TotalData) {
      scrollToBottom();
      // }
    }
    // console.log(selectedMenu, "selection modified");
  }, [selectedMenu.length]);

  const onRefreshKeyConfig = (mode) => {
    fetchKeyboardHotKeyConfig(CompCode).then((res) => {
      if (res && res.length > 0) {
        let tmp = [];
        if (mode === "dine-in-default") {
          res
            .filter((flt) => flt.CompName === props.CompName)
            .forEach((row, index) => {
              if (
                _.includes(
                  ["BLANK", "RUNKOT"],
                  props.EntryMode.TableInfo.TableStatus
                ) &&
                _.includes(
                  ["settlement", "voidBill", "clearTable"],
                  row.EventCode
                )
              ) {
                tmp.push({ ...row, IsVisible: false });
              } else if (
                props.EntryMode.TableInfo.TableStatus === "PRINTED" &&
                _.includes(
                  ["save", "SaveAndPrint", "kot", "splitTable", "clearTable"],
                  row.EventCode
                )
              ) {
              } else {
                tmp.push({ ...row, key: index, isDirty: false });
              }
            });

          setKeyboardKey(tmp);
        }
      }
    });
  };

  const updateKeyBoardConfig = (mode) => {
    //hari-france
    let tmp = [];
    if (mode === "dine-in-default") {
      // console.log(props.EntryMode.TableInfo, "entry type");
      keyboardHotkeyConfig.forEach((row, index) => {
        if (
          _.includes(
            ["BLANK", "RUNKOT"],
            props.EntryMode.TableInfo.TableStatus
          ) &&
          _.includes(["settlement", "voidBill", "clearTable"], row.EventCode)
        ) {
          tmp.push({ ...row, IsVisible: false });
        } else if (
          props.EntryMode.TableInfo.TableStatus === "PRINTED" &&
          _.includes(
            ["save", "SaveAndPrint", "kot", "splitTable", "clearTable"],
            row.EventCode
          )
        ) {
          // console.log(row.CompName);
        } else {
          tmp.push({ ...row, key: index, isDirty: false });
        }
      });
      setKeyboardKey(tmp);
    } else if (
      (_.includes[
        ("counter-sale-default", "delivery-default", "pick-up-default")
      ],
      mode)
    ) {
      keyboardHotkeyConfig.forEach((row, index) => {
        // if (
        //   _.includes(
        //     ["BLANK", "RUNKOT"],
        //     props.EntryMode.EntryType === "CNTRSALE"
        //   ) &&
        //   _.includes([], row.EventCode)
        // ) {
        // tmp.push({ ...row, IsVisible: false });
        // }
        // else if (
        //   props.EntryMode.TableInfo.TableStatus === "PRINTED" &&
        //   _.includes(
        //     ["save", "SaveAndPrint", "kot", "splitTable", "clearTable"],
        //     row.EventCode
        //   )
        // )
        //  {
        // }
        // else {
        tmp.push({ ...row, key: index, isDirty: false });
        // }
      });

      setKeyboardKey(tmp);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchInitialLoad()
      .then((res) => {
        // let tmpKeyboardValue = keyboardHotkeyConfig.filter(
        //   (ff) => ff.CompName === "RestaurantPOSTran"
        // );
        // console.log(props);
        // if (
        //   props.EntryMode &&
        //   props.EntryMode.EntryType === "DINEIN" &&
        //   props.EntryMode.TableInfo.TableStatus === "RUNKOT"
        // ) {
        //   let tempData = tmpKeyboardValue.filter((fi) =>_.includes(["settlement", "voidBill", "clearTable", "back"],fi.EventCode));
        //   tempData.forEach((data, index) => {
        //     tempData[index].IsVisible = false;
        //   });
        //   console.log([...tmpKeyboardValue,...tempData],"tempData")
        // }
        // tmpKeyboardValue
        //setKeyboardKey(keyboardHotkeyConfig);
        updateKeyBoardConfig(props.CompType);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

    // console.log(props.EntryMode.TableInfo, "table info");
  }, []);

  const fetchInitialLoad = () => {
    return new Promise(async function (resolve, reject) {
      try {
        let tmpBranch, tmpDept, tmpSecCode;

        //Check Rates availible for current branch and Dept
        //Branch
        if (
          props.data.MenuRates.filter((ii) => ii.BranchCode === currBranch)
            .length > 0
        ) {
          tmpBranch = currBranch;
        } else {
          tmpBranch = "0";
        }
        //Dept
        if (
          props.data.MenuRates.filter(
            (ii) =>
              ii.BranchCode === tmpBranch &&
              ii.DeptCode === props.EntryMode.EntryType
          ).length > 0
        ) {
          tmpDept = props.EntryMode.EntryType;
        } else {
          tmpDept = "0";
        }

        //Sec
        if (
          props.EntryMode.EntryType === "DINEIN" &&
          props.data.MenuRates.filter(
            (ii) =>
              ii.BranchCode === tmpBranch &&
              ii.DeptCode === tmpDept &&
              ii.SecCode === props.EntryMode.TableInfo.SecCode
          ).length > 0
        ) {
          tmpSecCode = props.EntryMode.TableInfo.SecCode;
        } else {
          tmpSecCode = "0";
        }

        let applicableMenus = props.data.MenuRates.filter(
          (ii) =>
            ii.BranchCode === tmpBranch &&
            ii.DeptCode === tmpDept &&
            ii.SecCode === tmpSecCode
        );
        let menuCat = [];
        await applicableMenus.map((mn, index) => {
          if (
            menuCat.filter((oo) => oo.MenuCatCode === mn.MenuCatCode).length ===
            0
          ) {
            menuCat.push({
              MenuCatCode: mn.MenuCatCode,
              MenuCatName: mn.MenuCatName,
            });
          }
        });

        menuCat = _.sortBy(menuCat, [
          function (o) {
            return o.MenuCatName;
          },
        ]);
        let tempApplicable = [];
        let tempMenuOptions = [];
        for (const key in applicableMenus) {
          await tempApplicable.push({
            ...applicableMenus[key],
            menuQuantity: 0,
          });
          tempMenuOptions.push({
            value: `${applicableMenus[key].MenuName} [${applicableMenus[key].ShortCode}]`,
            ...applicableMenus[key],
          });
        }
        setCurrMenuCategory(menuCat);
        setCurrMenus(tempApplicable);
        setMenuOptions(tempMenuOptions);
        if (props.EntryMode.TableInfo) {
          setSelectedNoOfPerson(props.EntryMode.TableInfo.SysOption2);
        }
        //fetch kot for the selected table if applicable
        if (
          props.EntryMode.EntryType === "DINEIN" &&
          props.EntryMode.TableInfo
        ) {
          await fetchKOTDtl()
            .then((fres) => {
              return fres;
            })
            .catch((eerr) => {
              return eerr;
            });
        }
        resolve({ data: "success" });
      } catch (error) {
        reject(error);
      }
    });
  };
  useEffect(() => {
    let tempAmount = 0;
    let tempQty = 0;
    selectedMenu
      .filter((aa) => aa.Qty > 0 && !_.includes(["RJCT", "CNL"], aa.ItemStatus))
      .map((ii) => {
        tempAmount += ii.MenuSumRate * parseInt(ii.Qty);
        tempQty += parseInt(ii.Qty);
      });
    setPrevTotalData(tempQty);
    setTotalAmount(tempAmount);
  }, [selectedMenu]);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const fetchKOTDtl = () => {
    return new Promise(function (resolve, reject) {
      // console.log("fetch kots");
      try {
        let tmpSelectedMenu = [];
        fetchTableInfoAndKOTs(
          CompCode,
          props.EntryMode.TableInfo.TableCode
        ).then((res) => {
          //Set Kot Global params e.g. customer, no of persons, captain etc...
          //Read data from first data set

          //set kot details

          res[1].forEach((kothdr) => {
            res[2]
              .filter((uu) => uu.KOTId === kothdr.KOTId)
              .forEach((kotdtl) => {
                tmpSelectedMenu.push({
                  KOTId: kothdr.KOTId,
                  KOTNo: kothdr.KOT_No,
                  KOTDate: kothdr.KOT_Date,
                  SrNo: kotdtl.SrNo,
                  MenuCode: kotdtl.MenuCode,
                  MenuName: kotdtl.MenuName,
                  MenuDisplayName: kotdtl.MenuDisplayName,
                  MenuDisplayDesc: kotdtl.MenuDisplayDesc,
                  Variation: {
                    VariationCode: kotdtl.VAR_Code,
                    VariationName: kotdtl.VAR_Name,
                    VariationRate: kotdtl.VAR_Rate,
                  },
                  MenuBaseRate: kotdtl.MenuBaseRate,
                  MenuSumRate: kotdtl.MenuSumRate,
                  ArrAddOns: [],
                  Qty: kotdtl.Qty,
                  Amount: kotdtl.Qty * kotdtl.MenuSumRate,
                  DietType: kotdtl.DietType,
                  CookingRemark: kotdtl.CookingRemark,
                  InvoiceId: kothdr.InvoiceId,
                  InvoiceNo: kothdr.InvoiceNo,
                  ItemStatus: kotdtl.ItemStatus,
                });
              });
          });
          let tempCheckData = checkData;
          let customer =
            res[0].length > 0 ? _.split(res[0][0].SysOption1, "~") : [];

          let tempDiscount =
            res[0].length > 0 ? _.split(res[0][0].SysOption4, "~") : [];
          // console.log(customer, "dta of customer");
          if (tempDiscount.length > 0) {
            tempCheckData = {
              ...tempCheckData,
              discount:
                (tempDiscount[2] &&
                  parseInt(_.isNull(tempDiscount[2]) ? 0 : tempDiscount[2]) >
                    0) ||
                (tempDiscount[3] && _.isNull(tempDiscount[3])
                  ? ""
                  : tempDiscount[3]),
            };
            setDiscount({
              reason: tempDiscount[0] ? tempDiscount[0] : "",
              type: tempDiscount[1] ? tempDiscount[1] : "P",
              discountAmount: tempDiscount[2] ? tempDiscount[2] : 0,
              couponCode: tempDiscount[3] ? tempDiscount[3] : "",
            });
          }
          if (customer.length > 0) {
            tempCheckData = {
              ...tempCheckData,
              customer: customer[0] && customer[0] !== null ? true : false,
            };

            setCustomerForm({
              ...customerForm,
              customer: {
                ...customerForm.customer,
                userId: customer[0] ? customer[0] : null,
                address: customer[1] ? [customer[1]] : [],
              },
            });
          }
          if (res[0].length > 0) {
            tempCheckData = {
              ...tempCheckData,
              NoOfPerson:
                parseInt(
                  _.isNull(res[0][0].SysOption2) ? 0 : res[0][0].SysOption2
                ) > 0,
              Captian:
                parseInt(
                  _.isNull(res[0][0].SysOption3) ? 0 : res[0][0].SysOption3
                ) > 0,
            };
            setSelectedNoOfPerson(res[0].length > 0 ? res[0][0].SysOption2 : 0);
            setSelectedCaptain(
              res[0].length > 0 && res[0][0].SysOption3 !== null
                ? res[0][0].SysOption3
                : null
            );
            setCheckData(tempCheckData);
          }
          // console.log(tmpSelectedMenu, "fetcehde kot dtl");
          setSelectedMenu(tmpSelectedMenu);
          // setPrevTotalData(parseInt(tmpSelectedMenu.length));
          if (tmpSelectedMenu.length > 0) {
            setLastKOTId(tmpSelectedMenu[tmpSelectedMenu.length - 1].KOTId);
          }

          resolve(tmpSelectedMenu);
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  };

  const onBillSave = () => {
    if (selectedMenu.length > 0) {
      if (
        props.EntryMode.EntryType === "PICKUP" &&
        customerForm.customer.userId === null
      ) {
        swal({
          title: "Customer Not Selected",
          icon: "warning",
          dangerMode: true,
          // dangerMode: true,
        });
      } else if (
        props.EntryMode.EntryType === "DELIVERY" &&
        customerForm.customer.userId === null
      ) {
        swal({
          title: "Customer Not Selected",
          icon: "warning",
          dangerMode: true,
          // dangerMode: true,
        });
      } else if (
        props.EntryMode.EntryType === "DELIVERY" &&
        customerForm.customer.address.length <= 0
      ) {
        swal({
          title: "Customer Address Not Selected",
          icon: "warning",
          dangerMode: true,
          // dangerMode: true,
        });
      } else if (props.EntryMode.EntryType === "CNTRSALE") {
        PrpareAndSaveKOT()
          .then((res) => {
            setShowCounterSaleSave("SAVE");
          })
          .catch((err) => console.log("in error", err));
      } else {
        PrpareAndSaveKOT()
          .then((res) => {
            setModalType("BILL SETTLEMENT");
          })
          .catch((err) => console.log("in error", err));
      }
    }
  };
  const PrpareAndSaveKOT = () => {
    // console.log("prparing");
    return new Promise(function (resolve, reject) {
      try {
        let l_KOTNO;
        let KOTHDR = {
          InsUpdtType: "I",
          KOTId: null,
          CompCode: CompCode,
          BranchCode: BranchConfigs.value1,
          DeptCode: props.EntryMode.EntryType,
          KOT_No: l_KOTNO,
          KOT_Date: moment().format("YYYY-MM-DD HH:mm:ss"),
          TableNo: props.EntryMode.TableInfo
            ? props.EntryMode.TableInfo.TableCode
            : null,
          SysOption1: `${
            customerForm.customer.userId ? customerForm.customer.userId : ""
          }${
            customerForm.customer.address &&
            customerForm.customer.address.length > 0
              ? "~" + customerForm.customer.address[0]
              : ""
          }`,
          SysOption2:
            selectedNoOfPerson && selectedNoOfPerson !== ""
              ? selectedNoOfPerson
              : 0,
          SysOption3: selectedCaptain ? selectedCaptain : null,
          SysOption4: `${discount.reason}~${discount.type}~${discount.discountAmount}~${discount.couponCode}`,
          SysOption5: "",
          KOT_Status:
            props.EntryMode.EntryType === "PICKUP" ||
            props.EntryMode.EntryType === "DELIVERY"
              ? "TMP"
              : "PND",
          KOT_Remark: "",
          OrderType: props.EntryMode.EntryType,
          UpdtUsr: loginInfo.username,
        };

        let KOTDTL = [];
        selectedMenu
          .filter((kk) => kk.KOTId === null)
          .forEach((row) => {
            KOTDTL.push({
              InsUpdtType: "I",
              Id: null,
              KOTId: null,
              SrNo: row.SrNo,
              MenuCode: row.MenuCode,
              MenuName: row.MenuName,
              MenuDisplayName: row.MenuDisplayName,
              MenuDisplayDesc: row.MenuDisplayDesc,
              VAR_Code: _.isNull(row.Variation) ? null : row.Variation.VarCode,
              VAR_Name: _.isNull(row.Variation) ? null : row.Variation.VarDesc,
              VAR_Rate: _.isNull(row.Variation) ? null : row.Variation.Rate,
              MenuBaseRate: row.MenuBaseRate,
              MenuSumRate: row.MenuSumRate,
              Qty: row.Qty,
              Amount: row.Qty * row.MenuSumRate,
              CookingRemark: row.CookingRemark,
              UpdtUsr: loginInfo.username,
              AddOns: row.ArrAddOns !== null ? row.ArrAddOns : [],
              CompCode: CompCode,
            });
          });
        let data = {
          data: { KOTHDR, KOTDTL, CompCode },
        };
        let savedKOTId = 0;
        if (KOTDTL.length > 0) {
          saveKOT(data)
            .then((res) => {
              if (
                (props.EntryMode.EntryType === "DINEIN" &&
                  props.EntryMode.TableInfo) ||
                props.EntryMode.EntryType === "CNTRSALE"
              ) {
                fetchKOTDtl()
                  .then((fres) => {
                    return fres;
                  })
                  .catch((eerr) => {
                    return eerr;
                  });
              }
              savedKOTId = res.KOTId;
              setLastKOTId(savedKOTId);
              if (props.EntryMode.EntryType !== "DINEIN") {
                resolve(res);
              }
            })
            .catch((err) => reject(err));
        } else {
          selectedMenu.forEach((row) => {
            if (parseInt(row.KOTId) > savedKOTId) {
              savedKOTId = row.KOTId;
              setLastKOTId(savedKOTId);
            }
          });
          data = {
            KOTId: savedKOTId,
            SysOption1: KOTHDR.SysOption1,
            SysOption2: KOTHDR.SysOption2,
            SysOption3: KOTHDR.SysOption3,
            SysOption4: KOTHDR.SysOption4,
            SysOption5: KOTHDR.SysOption5,
            UpdtUsr: loginInfo.username,
          };
          updateKOTAddInfo(CompCode, data)
            .then((res) => {
              // console.log("here in update");
              if (props.EntryMode.EntryType !== "DINEIN") {
                resolve(res);
              }
            })
            .catch((err) => reject(err));
        }
        // console.log(
        //   customerForm,
        //   props.EntryMode.TableInfo,
        //   selectedNoOfPerson,
        //   discount,
        //   selectedCaptain,
        //   "on bill save customer Data"
        // );
        if (props.EntryMode.TableInfo) {
          // console.log(customerForm.customer.address[0], "address save");
          let dataTableStatus = {
            data: {
              CompCode: CompCode,
              BranchCode: BranchConfigs.value1,
              DeptCode: props.EntryMode.EntryType,
              TableType:
                props.EntryMode.TableInfo && props.EntryMode.TableInfo.TableType
                  ? props.EntryMode.TableInfo.TableType
                  : "REG",
              TableSec: props.EntryMode.TableInfo
                ? props.EntryMode.TableInfo.SecCode
                : null,
              TableCode: props.EntryMode.TableInfo
                ? props.EntryMode.TableInfo.TableCode
                : null,
              TableName: props.EntryMode.TableInfo
                ? props.EntryMode.TableInfo.TableName
                : null,
              ParentTableCodes: props.EntryMode.TableInfo
                ? props.EntryMode.TableInfo.ParentTableCodes
                : null,
              SysOption1: `${
                customerForm.customer.userId ? customerForm.customer.userId : ""
              }${
                customerForm.customer.address &&
                customerForm.customer.address.length > 0
                  ? "~" + customerForm.customer.address[0]
                  : ""
              }`,
              SysOption2:
                selectedNoOfPerson && selectedNoOfPerson !== ""
                  ? selectedNoOfPerson
                  : 0,
              SysOption3: selectedCaptain ? selectedCaptain : null,
              SysOption4: `${discount.reason}~${discount.type}~${discount.discountAmount}~${discount.couponCode}`,
              SysOption5: "",
              Status: "RUNKOT",
              Remark: "",
              IsActive: true,
              UpdtUsr: loginInfo.username,
            },
          };

          saveTableStatus(CompCode, dataTableStatus)
            .then((res) => {
              resolve(res);
              // console.log("save response table status", res);
            })
            .catch((err) => reject(err));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const onMenuIncrementDecrement = (pMenuItem, pType) => {
    let tempData = [...selectedMenu];
    let menuIndex = selectedMenu.findIndex(
      (item) => item.SrNo === pMenuItem.SrNo
    );

    if (pType === "INC") {
      tempData[menuIndex] = {
        ...tempData[menuIndex],
        Qty: tempData[menuIndex].Qty + 1,
      };
    } else {
      if (tempData[menuIndex].Qty === 1) {
        tempData = selectedMenu.filter(
          (aa) =>
            !(
              aa.MenuCode === tempData[menuIndex].MenuCode &&
              aa.SrNo === tempData[menuIndex].SrNo
            )
        );
      } else {
        tempData[menuIndex] = {
          ...tempData[menuIndex],
          Qty: tempData[menuIndex].Qty - 1,
        };
      }
    }
    setSelectedMenu(tempData);
  };

  const onMenuItemClick = (pMenuItem, pVariationObject, pArrOfAddOns) => {
    let tempData = [...selectedMenu];
    // console.log(
    //   pMenuItem,
    //   pVariationObject,
    //   pArrOfAddOns,
    //   selectedMenu,
    //   "menu item add on"
    // );
    let menuIndex = selectedMenu.findIndex(
      (item) =>
        item.MenuCode === pMenuItem.MenuCode &&
        item.KOTId === null &&
        !pMenuItem.Variation &&
        pArrOfAddOns.length === 0 &&
        item.ArrAddOns.length === 0
    );

    if (menuIndex >= 0 && pMenuItem.hasVariation === "N") {
      tempData[menuIndex] = {
        ...tempData[menuIndex],
        Qty: parseInt(tempData[menuIndex].Qty) + 1,
      };
    } else {
      let l_MenuDisplayName = "";
      let l_MenuDisplayDesc = "";
      let l_MenuSumRate = 0;
      if (!_.isNull(pVariationObject) && pVariationObject !== -1) {
        l_MenuDisplayName = `${pMenuItem.MenuName} [${pVariationObject.VarDesc}]`;
        l_MenuSumRate = parseInt(pVariationObject.Rate);
      } else {
        l_MenuDisplayName = `${pMenuItem.MenuName}`;
        l_MenuSumRate = parseInt(pMenuItem.Rate);
      }

      // console.log(pArrOfAddOns, storedMenuData.addOn, "diffrence in add ONm");
      if (pArrOfAddOns && pArrOfAddOns.length > 0) {
        storedMenuData.addOn.forEach((ll) => {
          let tmpItem = "";
          pArrOfAddOns
            .filter((oi) => oi.AddOnCode === ll.AddonCode)
            .forEach((ki) => {
              tmpItem += (tmpItem === "" ? "" : ", ") + ki.ItemName;
              l_MenuSumRate += parseInt(ki.Rate);
            });

          if (tmpItem !== "") {
            l_MenuDisplayDesc +=
              (l_MenuDisplayDesc === "" ? "" : "~") +
              ll.AddonCode +
              " : " +
              tmpItem;
          }
        });
      }

      tempData.push({
        KOTId: null,
        KOTNo: null,
        KOTDate: null,
        SrNo: tempData.length + 1,
        MenuCode: pMenuItem.MenuCode,
        MenuName: pMenuItem.MenuName,
        MenuDisplayName: l_MenuDisplayName,
        MenuDisplayDesc: l_MenuDisplayDesc,
        Variation: pVariationObject,
        MenuBaseRate: pMenuItem.Rate,
        MenuSumRate: l_MenuSumRate,
        ArrAddOns: pArrOfAddOns,
        Qty: 1,
        Amount: l_MenuSumRate * 1,
        DietType: pMenuItem.DietType,
        CookingRemark: "",
      });
    }
    // setPrevTotalData(parseInt(tempData.length));
    setSelectedMenu(tempData);
  };
  const onMenuNameClick = (data) => {
    setNoteModal(data);
  };

  return (
    <div style={{ height: "100%" }}>
      {IsLoading ? (
        <Loader />
      ) : (
        <>
          <Modal
            maskClosable={false}
            visible={ModalType}
            title={
              <span style={{ color: "#fb8a2d", textDecoration: "underline" }}>
                {_.capitalize(ModalType)}
              </span>
            }
            onCancel={() => setModalType()}
            footer={false}
            bodyStyle={{ padding: 0 }}
            destroyOnClose={true}
            width={750}
            closeIcon={null}
          >
            {ModalType === "CUSTOMER" ? (
              <CustomerSelectionComponent
                onBackPress={() => {
                  setModalType();
                }}
                onCustomerSet={(values) => {
                  // console.log(values);
                  setCustomerForm(values);
                  setCheckData({
                    ...checkData,
                    customer:
                      parseInt(
                        _.isNull(values.customer.userId)
                          ? 0
                          : values.customer.userId
                      ) > 0,
                  });
                }}
                data={customerForm}
              />
            ) : ModalType === "CAPTAIN" ? (
              <CaptainSelectionCard
                onBackPress={() => {
                  setModalType();
                }}
                onCaptainSelect={(values) => {
                  setSelectedCaptain(values);
                  setCheckData({
                    ...checkData,
                    Captian: parseInt(_.isNull(values) ? 0 : values) > 0,
                  });
                  setModalType();
                }}
                data={selectedCaptain}
              />
            ) : ModalType === "DISCOUNT" ? (
              <DiscountComponent
                onBackPress={() => {
                  setModalType();
                }}
                data={discount}
                onDiscountSave={(value) => {
                  setCheckData({
                    ...checkData,
                    discount:
                      (value.discountAmount &&
                        parseInt(
                          _.isNull(value.discountAmount)
                            ? 0
                            : value.discountAmount
                        ) > 0) ||
                      (value.couponCode && _.isNull(value.couponCode)
                        ? ""
                        : value.couponCode),
                  });
                  setDiscount(value);
                  setModalType();
                }}
              />
            ) : ModalType === "BILL SETTLEMENT" ||
              ModalType === "BILL SETTLEMENT AND PRINT" ? (
              <BillSettlementComponent
                onBackPress={() => {
                  setModalType();
                }}
                OnBillSaveClick={() => {
                  props.onBackPress();
                }}
                menu={selectedMenu}
                discount={discount}
                EntryMode={props.EntryMode}
                lastKOTId={lastKOTId}
                PrpareAndSaveKOT={PrpareAndSaveKOT}
                loginInfo={loginInfo}
                customerForm={customerForm}
                selectedCaptain={selectedCaptain}
                selectedNoOfPerson={selectedNoOfPerson}
                discount={discount}
                printData={
                  ModalType === "BILL SETTLEMENT AND PRINT" ? true : false
                }
              />
            ) : ModalType === "NO. OF PERSON" ? (
              <NoOfPersonComponent
                onBackPress={() => {
                  setModalType();
                }}
                onNoSaved={(values) => {
                  setSelectedNoOfPerson(values);
                  setCheckData({
                    ...checkData,
                    NoOfPerson: parseInt(_.isNull(values) ? 0 : values) > 0,
                  });
                  setModalType();
                }}
                data={selectedNoOfPerson}
              />
            ) : null}
          </Modal>
          <Modal
            visible={NoteModal}
            title={NoteModal ? NoteModal.MenuDisplayName : ""}
            onCancel={() => setNoteModal()}
            footer={false}
            bodyStyle={{ padding: "0px" }}
            destroyOnClose={true}
            // style={{ width: "911px" }}
            // className={`menu-var-addOn`}
          >
            <div style={{ fontSize: 15, padding: "5px 20px" }}>
              Special Notes:
            </div>
            <div style={{ fontSize: 15, padding: "5px 20px" }}>
              <TextArea
                rows={4}
                onChange={(e) => {
                  setSpecialNote(e.target.value);
                }}
                defaultValue={NoteModal && NoteModal.CookingRemark}
              />
            </div>
            <div style={{ padding: "7px 20px", textAlign: "end" }}>
              <Button
                style={{ marginRight: 7 }}
                onClick={() => {
                  setNoteModal();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  selectedMenu[
                    selectedMenu.findIndex(
                      (aa) =>
                        aa.SrNo === NoteModal.SrNo &&
                        aa.MenuCode === NoteModal.MenuCode
                    )
                  ].CookingRemark = specialNote;
                  setNoteModal();
                }}
                disabled={NoteModal && NoteModal.KOTId > 0}
              >
                Save
              </Button>
            </div>
          </Modal>
          <Modal
            visible={showModal}
            title={storedMenuData.menu.MenuName}
            onOk={handleModal}
            onCancel={handleModal}
            footer={false}
            bodyStyle={{ padding: "10px 10px" }}
            destroyOnClose={true}
            style={{ width: "911px" }}
            className={`menu-var-addOn`}
          >
            {storedMenuData.var.length > 0 && (
              <>
                <div style={{ fontWeight: "600", fontSize: 15 }}>Variation</div>
                <Row gutter={[8, 8]}>
                  {storedMenuData.var
                    .sort((a, b) => (a.Rate > b.Rate ? 1 : -1))
                    .map((ii) => {
                      return (
                        <Col
                          xs={3}
                          sm={3}
                          md={3}
                          lg={3}
                          xl={3}
                          onClick={() => {
                            setStoredMenuData({
                              ...storedMenuData,
                              selectedVar: ii,
                            });
                          }}
                          key={ii.VarCode}
                        >
                          <div
                            style={{
                              fontWeight: "bold",
                            }}
                            className={`variation ${
                              storedMenuData.selectedVar.VarCode === ii.VarCode
                                ? "active"
                                : ""
                            }`}
                          >
                            <div>{ii.VarDesc}</div>
                            <div style={{ fontSize: 11 }}>
                              ₹ {parseInt(ii.Rate)}
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                </Row>
              </>
            )}
            {storedMenuData.addOn.map((stAddon) => {
              let tempData = props.data.MenuAddOnDtl.filter(
                (dtl) => dtl.AddOnCode === stAddon.AddonCode
              );
              return (
                tempData.length > 0 && (
                  <Fragment key={stAddon.AddonCode}>
                    <div style={{ fontWeight: "640", fontSize: 15 }}>
                      {tempData[0].AddOnName}
                    </div>
                    <Row gutter={[8, 8]}>
                      {tempData.map((addOn) => {
                        return (
                          <Col
                            xs={4}
                            sm={4}
                            md={4}
                            lg={4}
                            xl={4}
                            key={addOn.Id}
                            onClick={() => {
                              let tempAddOn = storedMenuData.selectedAddOn;
                              if (
                                tempAddOn.filter((aa) => aa.Id === addOn.Id)
                                  .length <= 0
                              ) {
                                tempAddOn.push({
                                  ...addOn,
                                  Rate: parseInt(addOn.Rate),
                                });
                              } else {
                                tempAddOn = tempAddOn.filter(
                                  (aa) => aa.Id !== addOn.Id
                                );
                              }
                              // let tt = _.countBy(tempAddOn, (c) => c);

                              setStoredMenuData({
                                ...storedMenuData,
                                selectedAddOn: tempAddOn,
                              });
                            }}
                          >
                            <div
                              style={{}}
                              className={`addons ${
                                storedMenuData.selectedAddOn.filter(
                                  (aa) => aa.Id === addOn.Id
                                ).length > 0
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <div>{addOn.ItemName}</div>
                              <div style={{ fontSize: 11, fontWeight: "bold" }}>
                                ₹ {parseInt(addOn.Rate)}
                              </div>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Fragment>
                )
              );
            })}

            <Divider style={{ margin: "5px 0px" }} />
            <div style={{ textAlign: "right" }}>
              <Button
                onClick={() => {
                  handleModal();
                }}
                style={{ marginRight: 7 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  let tempData = [...selectedMenu];
                  if (storedMenuData.menu.hasVariation === "N") {
                    onMenuItemClick(
                      storedMenuData.menu,
                      storedMenuData.selectedVar,
                      storedMenuData.selectedAddOn
                    );
                    handleModal();
                  } else {
                    if (
                      storedMenuData.menu.hasVariation === "Y" &&
                      storedMenuData.selectedVar !== -1
                    ) {
                      onMenuItemClick(
                        storedMenuData.menu,
                        storedMenuData.selectedVar,
                        storedMenuData.selectedAddOn
                      );
                      handleModal();
                    } else {
                      message.error("select an Variation");
                    }
                  }
                }}
              >
                Save
              </Button>
            </div>
          </Modal>
          {/* <Col flex="1 1 200px"> */}
          <Row style={{}}>
            <Col
              xxl={18}
              xl={16}
              lg={14}
              md={24}
              sm={24}
              xs={24}
              // flex="1 1 300px"
              style={{ height: "calc(100vh - 83px)" }}
            >
              <Card
                style={{ height: "100%" }}
                bodyStyle={{
                  padding: "5px 5px 5px 5px ",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  flexFlow: "column",
                }}
              >
                <div style={{ display: "flex", paddingBottom: 3, height: 35 }}>
                  <div
                    style={{
                      display: "inline-block",
                      height: 32,
                      flex: "0 1 165px",
                    }}
                  >
                    <Tooltip
                      title={`${
                        keyboardKey.length > 0
                          ? keyboardKey.find((key) => key.EventCode === "back")
                              .EventName
                          : "Back"
                      } [ ${
                        keyboardKey.length > 0
                          ? keyboardKey.find((key) => key.EventCode === "back")
                              .HotKey
                          : ""
                      } ]`}
                      overlayStyle={{ fontSize: 12 }}
                    >
                      <Button
                        onClick={props.onBackPress}
                        style={{ width: "100%" }}
                        type="primary"
                        ref={backRef}
                        icon={<RollbackOutlined />}
                      >
                        Back
                      </Button>
                    </Tooltip>
                  </div>
                  <div style={{ display: "inline-block", height: 32, flex: 1 }}>
                    <Card
                      bordered={false}
                      bodyStyle={{
                        padding: "0px 0px 0px 4px",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          margin: "auto",
                          padding: "4px 5px",
                          border: "1px solid #d9d9d9",
                          color:
                            filterType === "N"
                              ? "red"
                              : filterType === "V"
                              ? "green"
                              : "inherit",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (filterType === "N") {
                            setFilterType("B");
                          } else if (filterType === "V") {
                            setFilterType("N");
                          } else {
                            setFilterType("V");
                          }
                        }}
                      >
                        <FilterOutlined />
                        <span style={{ paddingLeft: 5 }}>
                          {filterType === "N"
                            ? "Non-Veg"
                            : filterType === "V"
                            ? "Veg"
                            : "Both"}
                        </span>
                      </div>
                      <Tooltip
                        title={`${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "search"
                              ).EventName
                            : ""
                        } [ ${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "search"
                              ).HotKey
                            : ""
                        } ]`}
                        overlayStyle={{ fontSize: 12 }}
                      >
                        <AutoComplete
                          dropdownMatchSelectWidth={252}
                          style={{
                            flex: 1,
                          }}
                          options={menuOptions}
                          filterOption={(inputValue, option) =>
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                          ref={SearchRef}
                          onSelect={(value, option) => {
                            let vars = [];
                            vars = props.data.MenuVariationRates.filter(
                              (xx) =>
                                xx.BranchCode === option.BranchCode &&
                                xx.DeptCode === option.DeptCode &&
                                xx.SecCode === option.SecCode &&
                                xx.MenuCode === option.MenuCode
                            );
                            let addOns = props.data.MenuAddOn.filter(
                              (hh) => hh.MenuCode === option.MenuCode
                            );

                            if (vars.length > 0 || addOns.length > 0) {
                              handleModal();
                              setStoredMenuData({
                                ...storedMenuData,
                                menu: option,
                                var: vars,
                                addOn: addOns,
                              });
                            } else {
                              onMenuItemClick(option, null, []);
                            }
                            // history.push(option.path);
                          }}
                        >
                          <Input.Search
                            // size="large"
                            style={{ flex: 1 }}
                            placeholder="Search menu"
                            prefix={<SearchOutlined />}
                          />
                        </AutoComplete>
                      </Tooltip>
                    </Card>
                  </div>
                </div>
                <Row gutter={[0, 0]} style={{ height: "calc(100% - 35px)" }}>
                  <Col
                    flex="0 1 165px"
                    style={{
                      // backgroundColor: "rgba(238,162,138,0.3)",
                      backgroundColor: "rgba(248,168,132,0.2)",
                      border: "1px solid rgba(225,91,49,0.6)",
                      height: "100%",
                      overflow: "hidden auto",
                      borderRadius: 2,
                    }}
                    id="style-1"
                  >
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      xxl={24}
                      style={{
                        minHeight: 50,
                        display: "flex",
                        alignItems: "center",
                        fontSize: 12,
                        fontFamily: "Montserrat",
                        fontWeight: "600",
                      }}
                      className={`menu-category ${
                        "ALL" === selectedMenuCategory ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedMenuCategory();
                        setSelectedMenuCategory("ALL");
                      }}
                      key={"ALL"}
                    >
                      All Categories
                    </Col>
                    {/* <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  xxl={24}
                  style={{
                    minHeight: 65,
                    display: "flex",
                    alignItems: "center",
                    fontSize: 15,
                  }}
                  className={`menu-category ${
                    "FAV" === selectedMenuCategory ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedMenuCategory();
                    setSelectedMenuCategory("FAV");
                  }}
                  key={"FAV"}
                >
                  Favorites
                </Col> */}
                    {currMenuCategory &&
                      currMenuCategory.map((ii) => {
                        return (
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                            xxl={24}
                            style={{
                              minHeight: 50,
                              display: "flex",
                              alignItems: "center",
                              fontSize: 12,
                              fontFamily: "Montserrat",
                              fontWeight: "600",
                            }}
                            className={`menu-category ${
                              ii.MenuCatCode === selectedMenuCategory
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedMenuCategory();
                              setSelectedMenuCategory(ii.MenuCatCode);
                            }}
                            key={ii.MenuCatCode}
                          >
                            {ii.MenuCatName}
                          </Col>
                        );
                      })}
                  </Col>
                  <Col
                    flex="1"
                    style={{
                      padding: 5,
                      overflow: "hidden auto",
                      border: "1px solid rgba(225,91,49,0.6)",
                      margin: "0px 0px 0px 5px",
                      height: "100%",
                      // backgroundColor:'rgba(248, 168, 132, 0.5)'
                    }}
                    id="style-1"
                  >
                    <Row gutter={[8, 8]} style={{ overflow: "hidden auto" }}>
                      {/* <Col
                    xs={24}
                    sm={12}
                    md={24}
                    lg={12}
                    xl={8}
                    xxl={6}
                    className="menu-name-category-card"
                  >
                    <div className="style-2 menu-name-category-border non-veg">
                      <div
                        style={{
                          position: "absolute",
                          top: -6,
                          left: 3,
                        }}
                      >
                        <img src={nonveg} height="10" width="10" />
                      </div>
                      <div
                        className="menu-name-category-title"
                        style={{ fontSize: 16, textAlign: "center",backgroundColor:'#FFF',fontWeight:'600' }}
                      >
                        Mutton Panner
                      </div>
                      <Divider style={{ margin: 0, borderColor: "#afafaf" }} />
                      <div
                        className="menu-name-category-desc"
                        style={{
                          fontSize: 12,
                          textAlign: "center",
                          color: "#696969",
                        }}
                      >
                        Mutton Panner
                      </div>
                    </div>
                  </Col> */}
                      {selectedMenuCategory &&
                        currMenus &&
                        currMenus
                          .filter(
                            (kk) =>
                              (selectedMenuCategory === "ALL" ||
                                kk.MenuCatCode === selectedMenuCategory) &&
                              (filterType === "B" || kk.DietType === filterType)
                          )
                          .map((menu) => {
                            let vars = [];
                            vars = props.data.MenuVariationRates.filter(
                              (xx) =>
                                xx.BranchCode === menu.BranchCode &&
                                xx.DeptCode === menu.DeptCode &&
                                xx.SecCode === menu.SecCode &&
                                xx.MenuCode === menu.MenuCode
                            );
                            let addOns = props.data.MenuAddOn.filter(
                              (hh) => hh.MenuCode === menu.MenuCode
                            );
                            // console.log("on menu click", vars, addOns);

                            return (
                              <Col
                                xs={24}
                                sm={12}
                                md={24}
                                lg={12}
                                xl={8}
                                xxl={4}
                                className={`menu-name-category-card ${
                                  props.EntryMode.TableInfo &&
                                  (props.EntryMode.TableInfo.TableStatus ===
                                    "PRINTED" ||
                                    props.EntryMode.TableInfo.TableStatus ===
                                      "PAID")
                                    ? "disabled"
                                    : ""
                                }`}
                                key={menu.MenuCode}
                              >
                                <div
                                  className={`style-2 ${
                                    menu.DietType === "V" ? "veg" : "non-veg"
                                  } menu-name-category-border `}
                                  onClick={() => {
                                    if (
                                      _.includes(
                                        ["PICKUP", "DELIVERY", "CNTRSALE"],
                                        props.EntryMode.EntryType
                                      ) ||
                                      (props.EntryMode.TableInfo &&
                                        !_.includes(
                                          ["PRINTED", "PAID"],
                                          props.EntryMode.TableInfo.TableStatus
                                        ))
                                    ) {
                                      if (
                                        vars.length > 0 ||
                                        addOns.length > 0
                                      ) {
                                        handleModal();
                                        setStoredMenuData({
                                          ...storedMenuData,
                                          menu: menu,
                                          var: vars,
                                          addOn: addOns,
                                        });
                                      } else {
                                        onMenuItemClick(menu, null, []);
                                      }
                                    }
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      bottom: 0,
                                      right: 5,
                                    }}
                                  >
                                    {menu.DietType === "V" ? (
                                      <img src={veg} height="10" width="10" />
                                    ) : (
                                      <img
                                        src={nonveg}
                                        height="10"
                                        width="10"
                                      />
                                    )}
                                  </div>
                                  <div
                                    className="style-2 menu-name-category-title"
                                    style={{
                                      fontSize: 14,
                                      textAlign: "center",
                                      backgroundColor: "#FFF",
                                      fontWeight: "600",
                                      minHeight: 30,
                                      overflowY: "auto",
                                    }}
                                  >
                                    {menu.MenuName}
                                  </div>
                                  <Divider
                                    style={{
                                      margin: 0,
                                      borderColor: "#afafaf",
                                    }}
                                  />
                                  <div
                                    className="menu-name-category-desc"
                                    style={{
                                      fontSize: 12,
                                      textAlign: "center",
                                      color: "#696969",
                                      paddingTop: 4,
                                      flex: 1,
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {vars.length <= 0
                                      ? `₹ ${parseInt(menu.Rate)}`
                                      : vars.map((varrrr, index) => {
                                          return `${varrrr.VarDesc}${
                                            index != vars.length - 1 ? ", " : ""
                                          }`;
                                        })}
                                  </div>
                                </div>
                              </Col>
                              // <Col
                              //   xs={24}
                              //   sm={12}
                              //   md={24}
                              //   lg={12}
                              //   xl={8}
                              //   xxl={6}
                              //   key={menu.MenuCode}
                              // >
                              //   <div
                              //     className={`menu-category-card ${
                              //       menu.DietType === "V"
                              //         ? "menu-category-card-veg"
                              //         : ""
                              //     }`}
                              //     style={{
                              //       flexDirection: "column",
                              //       // color: "rgb(225,91,49)",
                              //       cursor: "pointer",
                              //       height: 65,
                              //     }}
                              //     onClick={() => {
                              //       if (vars.length > 0 || addOns.length > 0) {
                              //         handleModal();
                              //         setStoredMenuData({
                              //           ...storedMenuData,
                              //           menu: menu,
                              //           var: vars,
                              //           addOn: addOns,
                              //         });
                              //       } else {
                              //         onMenuItemClick(menu, null, null);
                              //       }
                              //     }}
                              //   >
                              //     <div
                              //       style={{
                              //         position: "absolute",
                              //         top: -6,
                              //         left: 3,
                              //       }}
                              //     >
                              //       {menu.DietType === "V" ? (
                              //         <img src={veg} height="10" width="10" />
                              //       ) : (
                              //         <img src={nonveg} height="10" width="10" />
                              //       )}
                              //     </div>
                              //     <div
                              //       style={{
                              //         fontSize: 11,
                              //         textAlign: "center",
                              //         padding: "0px 10px 10px 0px",
                              //         marginBottom: 5,
                              //         marginTop: 5,
                              //       }}
                              //     >
                              //       {menu.MenuName}
                              //     </div>
                              //     <div
                              //       style={{
                              //         fontSize: 10,
                              //         textAlign: "center",
                              //         width: "100%",
                              //         borderTop: `${
                              //           menu.DietType === "V"
                              //             ? "1px solid  rgb(84,225,49)"
                              //             : "1px solid  rgb(225,91,49)"
                              //         }`,
                              //         position: "absolute",
                              //         bottom: 0,
                              //       }}
                              //       className="menu-rate"
                              //     >
                              //       {vars.length <= 0
                              //         ? `₹ ${parseInt(menu.Rate)}`
                              //         : vars.map((varrrr, index) => {
                              //             return `${varrrr.VarDesc}${
                              //               index != vars.length - 1 ? ", " : ""
                              //             }`;
                              //           })}
                              //       {}
                              //     </div>
                              //   </div>
                              // </Col>
                            );
                          })}
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col
              xxl={6}
              xl={8}
              lg={10}
              md={24}
              sm={24}
              xs={24}
              // flex="0 1 500px"
              style={{ height: "calc(100vh - 83px)" }}
            >
              <Card
                style={{ height: "100%" }}
                bodyStyle={{
                  padding: 5,
                  height: "100%",
                }}
              >
                {props.EntryMode.EntryType === "DINEIN" && (
                  <div style={{ display: "flex", height: 32 }}>
                    <div
                      style={{ borderColor: "#fb8a2d" }}
                      className="ant-btn ant-btn"
                    >
                      {`${props.EntryMode.TableInfo.SecCode}- ${props.EntryMode.TableInfo.TableName}`}
                    </div>
                    <div
                      style={{ flex: 1 }}
                      className="ant-btn ant-btn-primary"
                    >
                      Dine In
                    </div>
                  </div>
                )}

                {props.EntryMode.EntryType !== "DINEIN" && (
                  <div style={{ display: "flex", height: 32 }}>
                    <div
                      style={{ flex: 1 }}
                      className="ant-btn ant-btn-primary"
                    >
                      {props.EntryMode.EntryType === "PICKUP"
                        ? "Pick Up"
                        : props.EntryMode.EntryType === "CNTRSALE"
                        ? "Counter Sale"
                        : "Home Delivery"}
                    </div>
                  </div>
                )}

                <div style={{ height: 60, border: "1px solid #fb8a2d" }}>
                  <Row>
                    {" "}
                    <Col
                      style={{
                        display: "flex",
                        borderRight: "1px solid #f0f0f0",
                        position: "relative",
                      }}
                    >
                      {checkData.customer && (
                        <div className="check-button-layout">
                          <CheckOutlined
                            style={{ color: "#fff", fontSize: 12 }}
                          />
                        </div>
                      )}
                      <Tooltip
                        title={`${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "customerSelection"
                              ).EventName
                            : "Customer Selection"
                        } [ ${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "customerSelection"
                              ).HotKey
                            : ""
                        } ]`}
                        overlayStyle={{ fontSize: 12 }}
                      >
                        <span
                          ref={customerSelectionRef}
                          onClick={() => setModalType("CUSTOMER")}
                        >
                          <MenuOption title={"Customer"} image={IconCust} />
                        </span>
                      </Tooltip>
                      {/* <Divider type="vertical" style={{ margin: 2 }} /> */}
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        borderRight: "1px solid #f0f0f0",
                        position: "relative",
                      }}
                    >
                      {checkData.Captian && (
                        <div className="check-button-layout">
                          <CheckOutlined
                            style={{ color: "#fff", fontSize: 12 }}
                          />
                        </div>
                      )}{" "}
                      <Tooltip
                        title={`${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "captain"
                              ).EventName
                            : "Captain"
                        } [ ${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "captain"
                              ).HotKey
                            : ""
                        } ]`}
                        overlayStyle={{ fontSize: 12 }}
                      >
                        <span
                          ref={CaptianRef}
                          onClick={() => setModalType("CAPTAIN")}
                        >
                          <MenuOption title={"Captain"} image={IconTable} />
                        </span>
                      </Tooltip>
                      {/* <Divider type="vertical" style={{ margin: 2 }} /> */}
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        borderRight: "1px solid #f0f0f0",
                        position: "relative",
                      }}
                    >
                      {checkData.NoOfPerson && (
                        <div className="check-button-layout">
                          <CheckOutlined
                            style={{ color: "#fff", fontSize: 12 }}
                          />
                        </div>
                      )}
                      <Tooltip
                        title={`${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "noOfPerson"
                              ).EventName
                            : "No of Person"
                        } [ ${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "noOfPerson"
                              ).HotKey
                            : ""
                        } ]`}
                        overlayStyle={{ fontSize: 12 }}
                      >
                        <span
                          ref={NoofPersonRef}
                          onClick={() => setModalType("NO. OF PERSON")}
                        >
                          <MenuOption
                            title={"No. of Person"}
                            image={IconCustCount}
                          />
                        </span>
                      </Tooltip>
                      {/* <Divider type="vertical" style={{ margin: 2 }} /> */}
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        borderRight: "1px solid #f0f0f0",
                        position: "relative",
                      }}
                    >
                      {checkData.discount && (
                        <div className="check-button-layout">
                          <CheckOutlined
                            style={{ color: "#fff", fontSize: 12 }}
                          />
                        </div>
                      )}

                      <Tooltip
                        title={`${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "discount"
                              ).EventName
                            : "Discount"
                        } [ ${
                          keyboardKey.length > 0
                            ? keyboardKey.find(
                                (key) => key.EventCode === "discount"
                              ).HotKey
                            : ""
                        } ]`}
                        overlayStyle={{ fontSize: 12 }}
                      >
                        <span
                          ref={DiscountRef}
                          onClick={() => setModalType("DISCOUNT")}
                        >
                          <MenuOption title={"Discount"} image={IconDisc} />
                        </span>
                      </Tooltip>
                    </Col>
                    <Col
                      style={{
                        border: "1px solid #fb8a2d",
                        padding: 0,
                        fontFamily: "Cairo",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      flex={"1 1 0%"}
                    >
                      <div
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: 25,
                            textAlign: "center",
                          }}
                        >
                          {`${
                            appConfigs &&
                            appConfigs.find(
                              (app) => app.configCode === "CURRENCY"
                            ).value1
                          } ${TotalAmount.toFixed(2)}  `}
                        </span>
                        <span
                          style={{
                            fontWeight: "600",
                          }}
                        >
                          ({TotalData})
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
                <Row style={{ marginTop: 0, height: "calc(100% - 92px)" }}>
                  <Col span={24} style={{ height: "100%" }}>
                    <Card
                      style={{
                        border: "0.6px solid rgb(225,91,49)",
                        height: "100%",
                      }}
                      bodyStyle={{
                        padding: "5px 5px 0px",
                        display: "flex",
                        flexFlow: "column",
                        height: "100%",
                      }}
                    >
                      <div style={{ height: 22 }}>
                        <div>
                          <Row>
                            <Col
                              span={14}
                              flex="1"
                              style={{ fontWeight: "bold" }}
                            >
                              Order
                            </Col>
                            <Col
                              span={5}
                              style={{ padding: "0px 8px", fontWeight: "bold" }}
                            >
                              Quantity
                            </Col>
                            <Col
                              span={3}
                              style={{
                                padding: "0px 8px",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              Rate
                            </Col>
                            <Col span={2}></Col>
                          </Row>
                        </div>
                        <Divider
                          style={{
                            margin: 0,
                            borderColor: "rgb(225,91,49)",
                            // ,borderStyle:'solid',borderWidth:1
                          }}
                        />
                      </div>
                      <div
                        className="style-2"
                        style={{ flex: " 1 1 0%", overflowY: "auto" }}
                      >
                        <div
                          id="style-1"
                          style={{
                            overflow: "hidden auto",
                          }}
                        >
                          {selectedMenu.length > 0 ? (
                            selectedMenu
                              .filter((iii) => iii.Qty > 0)
                              .sort((a, b) =>
                                a.KOTId === b.KOTId && a.SrNo < b.SrNo ? -1 : 1
                              )
                              .map((ii, idx, completeData) => {
                                let printHeader = false;

                                if (idx === 0) {
                                  printHeader = true;
                                } else {
                                  if (
                                    completeData[idx - 1].KOTId !==
                                    completeData[idx].KOTId
                                  ) {
                                    printHeader = true;
                                  }
                                }
                                return (
                                  <>
                                    {printHeader === true && (
                                      <div
                                        key={`1-${ii.SrNo}`}
                                        style={{
                                          padding: "3px 5px",
                                          borderBottom:
                                            "2px solid rgba(225,91,49,1)",
                                          //  color: "rgb(225,91,49)",
                                          backgroundColor: "#ffb578",
                                          color: "#0e0e0e",
                                          fontSize: 12,
                                        }}
                                      >
                                        {ii.KOTId
                                          ? `# ${ii.KOTId} / `
                                          : "New KOT"}
                                        {ii.KOTId
                                          ? moment(ii.KOTDate).format(
                                              "DD-MM-YYYY hh:mm A"
                                            )
                                          : ""}
                                        {/* {JSON.stringify(ii)} */}
                                      </div>
                                    )}
                                    {/* {console.log(ii, "selected Menu")} */}
                                    <KOTItem
                                      onMenuNameClick={onMenuNameClick}
                                      key={ii.SrNo}
                                      data={ii}
                                      onIncrement={() => {
                                        onMenuIncrementDecrement(ii, "INC");
                                      }}
                                      onDecrement={() => {
                                        onMenuIncrementDecrement(ii, "DEC");
                                      }}
                                      onDelete={() => {
                                        setSelectedMenu(
                                          selectedMenu.filter(
                                            (aa) =>
                                              !(
                                                aa.MenuCode === ii.MenuCode &&
                                                aa.SrNo === ii.SrNo
                                              )
                                          )
                                        );
                                      }}
                                    />
                                  </>
                                );
                              })
                          ) : (
                            <Empty style={{ margin: "75px 0px" }} />
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                      <Divider
                        style={{
                          margin: 0,
                          borderColor: "rgb(225,91,49)",
                        }}
                      />
                      <div style={{ minHeight: 32 }}>
                        <div
                          className="style-2"
                          style={{
                            display: "flex",
                            justifyContent:
                              props.EntryMode.TableInfo &&
                              (props.EntryMode.TableInfo.TableStatus ===
                                "PRINTED" ||
                                props.EntryMode.TableInfo.TableStatus ===
                                  "PAID")
                                ? "center"
                                : "left",
                            overflowX: "auto",
                          }}
                        >
                          {selectedMenu &&
                          selectedMenu.length > 0 &&
                          selectedMenu[0].InvoiceId &&
                          props.EntryMode.TableInfo.TableStatus !== "PAID" ? (
                            <>
                              <Tooltip
                                title={`${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "settlement"
                                      ).EventName
                                    : "Settlement"
                                } [ ${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "settlement"
                                      ).HotKey
                                    : ""
                                } ]`}
                                // color={process.env.REACT_APP_PRIMARY_COLOR}
                                overlayStyle={{ fontSize: 12 }}
                              >
                                <Button
                                  ref={Settle}
                                  type="primary"
                                  style={{ margin: "5px 0px", marginRight: 5 }}
                                  onClick={() => {
                                    setSettlementModal(true);
                                  }}
                                >
                                  Settlement
                                </Button>
                              </Tooltip>
                              <Tooltip
                                title={`${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "voidBill"
                                      ).EventName
                                    : "Void Bill"
                                } [ ${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "voidBill"
                                      ).HotKey
                                    : ""
                                } ]`}
                                // color={process.env.REACT_APP_PRIMARY_COLOR}
                                overlayStyle={{ fontSize: 12 }}
                              >
                                <Button
                                  ref={VoidBill}
                                  style={{ margin: "5px 0px", marginRight: 5 }}
                                  onClick={() => {
                                    setVoidBillModal(true);
                                  }}
                                >
                                  Void Bill
                                </Button>
                              </Tooltip>
                            </>
                          ) : selectedMenu &&
                            selectedMenu.length > 0 &&
                            selectedMenu[0].InvoiceId &&
                            props.EntryMode.TableInfo.TableStatus === "PAID" ? (
                            <>
                              <Tooltip
                                title={`${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "clearTable"
                                      ).EventName
                                    : "Clear Table"
                                } [ ${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "clearTable"
                                      ).HotKey
                                    : ""
                                } ]`}
                                overlayStyle={{ fontSize: 12 }}
                              >
                                <Button
                                  type="primary"
                                  style={{ margin: "5px 0px", marginRight: 5 }}
                                  onClick={async () => {
                                    let tblData = {
                                      data: {
                                        ...props.EntryMode.TableInfo,
                                        SysOption1: null,
                                        SysOption2: null,
                                        SysOption3: null,
                                        SysOption4: null,
                                        SysOption5: null,
                                        Status: "BLANK",
                                        UpdtUsr: loginInfo.username,
                                        CompCode: CompCode,
                                        BranchCode: BranchConfigs.value1,
                                        DeptCode: "DINEIN",
                                        TableType:
                                          props.EntryMode.TableInfo.TableType,
                                        TableSec:
                                          props.EntryMode.TableInfo.SecCode,
                                        IsActive: 1,
                                      },
                                    };
                                    let tempKOTId = [];
                                    await selectedMenu.forEach((row) => {
                                      if (!tempKOTId.includes(row.KOTId)) {
                                        tempKOTId.push(row.KOTId);
                                      }
                                    });
                                    // if(props.EntryMode.TableInfo.TableType==="REG")
                                    let data = {
                                      KOTId: tempKOTId,
                                      KOTStatus: "CMP",
                                      UpdtUsr: loginInfo.username,
                                    };
                                    uptRestarantPosKOTHdrStatus(
                                      CompCode,
                                      data
                                    ).then((khdr) => {
                                      uptRestarantPosKOTdtlStatus(
                                        CompCode,
                                        data
                                      ).then((kdtl) => {
                                        if (
                                          props.EntryMode.TableInfo
                                            .TableType === "REG"
                                        ) {
                                          saveTableStatus(
                                            CompCode,
                                            tblData
                                          ).then((res) => {
                                            props.onBackPress();
                                          });
                                        } else if (
                                          props.EntryMode.TableInfo
                                            .TableType === "MRG"
                                        ) {
                                          saveMergeTable(
                                            CompCode,
                                            tblData
                                          ).then((res) => {
                                            props.onBackPress();
                                          });
                                        } else {
                                          saveSplitTable(
                                            CompCode,
                                            tblData
                                          ).then((res) => {
                                            props.onBackPress();
                                          });
                                        }
                                      });
                                    });
                                  }}
                                  ref={ClearTable}
                                >
                                  Clear Table
                                </Button>
                              </Tooltip>
                              <Tooltip
                                title={`${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "voidBill"
                                      ).EventName
                                    : "Void Bill"
                                } [ ${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "voidBill"
                                      ).HotKey
                                    : ""
                                } ]`}
                                overlayStyle={{ fontSize: 12 }}
                              >
                                <Button
                                  type="primary"
                                  style={{ margin: "5px 0px", marginRight: 5 }}
                                  onClick={async () => {
                                    setShowRefundModal(true);
                                  }}
                                >
                                  Void Bill
                                </Button>
                              </Tooltip>
                            </>
                          ) : (
                            // props.EntryMode.TableInfo.TableStatus !==
                            //   "PRINTED" && (
                            <>
                              {}
                              <Tooltip
                                title={`${
                                  keyboardKey && keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "save"
                                      ).EventName
                                    : "Save"
                                } [ ${
                                  keyboardKey && keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) => key.EventCode === "save"
                                      ).HotKey
                                    : ""
                                } ]`}
                                overlayStyle={{ fontSize: 12 }}
                              >
                                <Button
                                  disabled={selectedMenu.length <= 0}
                                  type="primary"
                                  style={{
                                    margin: "5px 0px",
                                    marginRight: 5,
                                  }}
                                  icon={<FileProtectOutlined />}
                                  ref={refBillSave}
                                  onClick={() => {
                                    onBillSave();
                                  }}
                                >
                                  Bill Save
                                </Button>
                              </Tooltip>
                              <Tooltip
                                title={`${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) =>
                                          key.EventCode === "SaveAndPrint"
                                      ).EventName
                                    : "Save And Print"
                                } [ ${
                                  keyboardKey.length > 0
                                    ? keyboardKey.find(
                                        (key) =>
                                          key.EventCode === "SaveAndPrint"
                                      ).HotKey
                                    : ""
                                } ]`}
                                overlayStyle={{ fontSize: 12 }}
                              >
                                <Button
                                  ref={refBillSaveAndPrint}
                                  disabled={selectedMenu.length <= 0}
                                  type="primary"
                                  style={{
                                    margin: "5px 0px",
                                    marginRight: 5,
                                  }}
                                  onClick={() => {
                                    if (
                                      props.EntryMode.EntryType === "PICKUP" &&
                                      customerForm.customer.userId === null
                                    ) {
                                      swal({
                                        title: "Customer Not Selected",
                                        icon: "warning",
                                        dangerMode: true,
                                        // dangerMode: true,
                                      });
                                    } else if (
                                      props.EntryMode.EntryType ===
                                        "DELIVERY" &&
                                      customerForm.customer.userId === null
                                    ) {
                                      swal({
                                        title: "Customer Not Selected",
                                        icon: "warning",
                                        dangerMode: true,
                                        // dangerMode: true,
                                      });
                                    } else if (
                                      props.EntryMode.EntryType ===
                                        "DELIVERY" &&
                                      customerForm.customer.address.length <= 0
                                    ) {
                                      swal({
                                        title: "Customer Address Not Selected",
                                        icon: "warning",
                                        dangerMode: true,
                                        // dangerMode: true,
                                      });
                                    } else if (
                                      props.EntryMode.EntryType === "CNTRSALE"
                                    ) {
                                      PrpareAndSaveKOT()
                                        .then((res) => {
                                          setShowCounterSaleSave("SAVEPRINT");
                                        })
                                        .catch((err) =>
                                          console.error("in error", err)
                                        );
                                    } else {
                                      PrpareAndSaveKOT()
                                        .then((res) => {
                                          setModalType(
                                            "BILL SETTLEMENT AND PRINT"
                                          );
                                        })
                                        .catch((err) =>
                                          console.error("in error", err)
                                        );
                                    }
                                  }}
                                >
                                  {`Bill Save & Print`}
                                </Button>
                              </Tooltip>
                              {props.EntryMode.EntryType === "DINEIN" && (
                                <>
                                  <Tooltip
                                    title={`${
                                      keyboardKey.length > 0
                                        ? keyboardKey.find(
                                            (key) => key.EventCode === "kot"
                                          ).EventName
                                        : "Kot"
                                    } [ ${
                                      keyboardKey.length > 0
                                        ? keyboardKey.find(
                                            (key) => key.EventCode === "kot"
                                          ).HotKey
                                        : ""
                                    } ]`}
                                    overlayStyle={{ fontSize: 12 }}
                                  >
                                    <Button
                                      ref={saveKot}
                                      type="primary"
                                      icon={<FileAddOutlined />}
                                      style={{
                                        margin: "5px 0px",
                                        marginRight: 5,
                                      }}
                                      disabled={selectedMenu.length <= 0}
                                      onClick={() => {
                                        PrpareAndSaveKOT().then((res) => {
                                          props.onBackPress();
                                        });
                                      }}
                                    >
                                      KOT
                                    </Button>
                                  </Tooltip>
                                </>
                              )}

                              <Dropdown
                                overlay={
                                  <Menu>
                                    {props.EntryMode.EntryType === "DINEIN" &&
                                      props.EntryMode.TableInfo.TableStatus ===
                                        "RUNKOT" && (
                                        <>
                                          <Menu.Item className="custom-menu">
                                            <Tooltip
                                              // title={`${
                                              //   keyboardKey.find(
                                              //     (key) => key.EventCode === "kot"
                                              //   ).EventName
                                              // } [ ${
                                              //   keyboardKey.find(
                                              //     (key) => key.EventCode === "kot"
                                              //   ).HotKey
                                              // } ]`}
                                              placement="leftTop"
                                              overlayStyle={{ fontSize: 12 }}
                                            >
                                              <div
                                                className="ant-btn ant-btn-primary"
                                                ref={saveKot}
                                                type="primary"
                                                icon={<FileAddOutlined />}
                                                style={{
                                                  margin: "0px 0px",
                                                  marginRight: 0,
                                                }}
                                                disabled={
                                                  selectedMenu.length <= 0
                                                }
                                                onClick={() => {
                                                  setShowTableTransferModal(
                                                    true
                                                  );
                                                }}
                                              >
                                                Transfer Table
                                              </div>
                                            </Tooltip>
                                          </Menu.Item>
                                        </>
                                      )}{" "}
                                    {props.EntryMode.EntryType === "DINEIN" &&
                                      props.EntryMode.TableInfo &&
                                      props.EntryMode.TableInfo.TableType ===
                                        "REG" &&
                                      appConfigs.find(
                                        (ii) => ii.configCode === "TBL_SPLIT"
                                      ).value1 === "Y" && (
                                        <Menu.Item className="custom-menu">
                                          <Tooltip
                                            placement="leftTop"
                                            title={`${
                                              keyboardKey.length > 0
                                                ? keyboardKey.find(
                                                    (key) =>
                                                      key.EventCode ===
                                                      "splitTable"
                                                  ).EventName
                                                : "Split Table"
                                            } [ ${
                                              keyboardKey.length > 0
                                                ? keyboardKey.find(
                                                    (key) =>
                                                      key.EventCode ===
                                                      "splitTable"
                                                  ).HotKey
                                                : ""
                                            } ]`}
                                            overlayStyle={{ fontSize: 12 }}
                                          >
                                            <Button
                                              disabled={
                                                selectedMenu.length > 0 &&
                                                selectedMenu[0].InvoiceId
                                              }
                                              ref={splitTable}
                                              icon={<ApartmentOutlined />}
                                              type="primary"
                                              // style={{
                                              //   margin: "5px 0px",
                                              //   marginRight: 5,
                                              // }}
                                              onClick={() => {
                                                swal({
                                                  text: "Are you sure You want to split table",
                                                  buttons: [
                                                    "Cancel",
                                                    "Split Table",
                                                  ],
                                                })
                                                  .then((name) => {
                                                    if (name === null)
                                                      throw null;
                                                    // console.log(props);
                                                    // return true;
                                                    if (
                                                      props.EntryMode.TableInfo
                                                    ) {
                                                      const data = {
                                                        BranchCode:
                                                          BranchConfigs.value1,
                                                        CompCode: CompCode,
                                                        DeptCode: "DINEIN",
                                                        TableSec:
                                                          props.EntryMode
                                                            .TableInfo.SecCode,
                                                        TableCode:
                                                          props.EntryMode
                                                            .TableInfo
                                                            .TableType ===
                                                          "SPLT"
                                                            ? props.EntryMode
                                                                .TableInfo
                                                                .ParentTableCodes
                                                            : props.EntryMode
                                                                .TableInfo
                                                                .TableCode,
                                                        TableName:
                                                          props.EntryMode
                                                            .TableInfo
                                                            .TableType ===
                                                          "SPLT"
                                                            ? props.EntryMode.TableInfo.TableName.split(
                                                                "~"
                                                              )[0]
                                                            : props.EntryMode
                                                                .TableInfo
                                                                .TableName,
                                                        UpdtUsr:
                                                          loginInfo.username,
                                                      };
                                                      restaurantPosProcessSpltTable(
                                                        CompCode,
                                                        data
                                                      ).then((res) => {
                                                        setSelectedMenu([]);
                                                        return props.routeSplitTable(
                                                          res[0][0]
                                                        );
                                                      });
                                                    }
                                                  })
                                                  .catch((err) => {
                                                    if (err) {
                                                      console.error(err);
                                                      swal(
                                                        "Oh noes!",
                                                        "The AJAX request failed!",
                                                        "error"
                                                      );
                                                    } else {
                                                      swal.stopLoading();
                                                      swal.close();
                                                    }
                                                  });
                                              }}
                                            >{`Split Table`}</Button>
                                          </Tooltip>
                                        </Menu.Item>
                                      )}
                                  </Menu>
                                }
                                placement="topCenter"
                              >
                                <Button
                                  style={{
                                    margin: "5px 0px",
                                    marginRight: 5,
                                  }}
                                  icon={<SettingFilled />}
                                  type="primary"
                                ></Button>
                              </Dropdown>

                              {/* {props.EntryMode.EntryType === "DINEIN" && (
                            <Button
                              type="primary"
                              style={{ margin: "5px 0px", marginRight: 5 }}
                            >{`KOT & Print`}</Button>
                          )}
                          {props.EntryMode.EntryType === "DINEIN" && (
                            <Button
                              type="primary"
                              style={{ margin: "5px 0px", marginRight: 5 }}
                            >
                              {`Hold`}
                            </Button>
                          )} */}
                              {/* {props.EntryMode.EntryType === "DINEIN" &&
                                props.EntryMode.TableInfo &&
                                props.EntryMode.TableInfo.TableType === "REG" &&
                                appConfigs.find(
                                  (ii) => ii.configCode === "TBL_SPLIT"
                                ).value1 === "Y" && (
                                  <Tooltip
                                    title={`${
                                      keyboardKey.length > 0
                                        ? keyboardKey.find(
                                            (key) =>
                                              key.EventCode === "splitTable"
                                          ).EventName
                                        : "Split Table"
                                    } [ ${
                                      keyboardKey.length > 0
                                        ? keyboardKey.find(
                                            (key) =>
                                              key.EventCode === "splitTable"
                                          ).HotKey
                                        : ""
                                    } ]`}
                                    overlayStyle={{ fontSize: 12 }}
                                  >
                                    <Button
                                      disabled={
                                        selectedMenu.length > 0 &&
                                        selectedMenu[0].InvoiceId
                                      }
                                      ref={splitTable}
                                      icon={<ApartmentOutlined />}
                                      type="primary"
                                      style={{
                                        margin: "5px 0px",
                                        marginRight: 5,
                                      }}
                                      onClick={() => {
                                        swal({
                                          text:
                                            "Are you sure You want to split table",
                                          buttons: ["Cancel", "Split Table"],
                                        })
                                          .then((name) => {
                                            if (name === null) throw null;
                                            // console.log(props);
                                            // return true;
                                            if (props.EntryMode.TableInfo) {
                                              const data = {
                                                BranchCode:
                                                  BranchConfigs.value1,
                                                CompCode: CompCode,
                                                DeptCode: "DINEIN",
                                                TableSec:
                                                  props.EntryMode.TableInfo
                                                    .SecCode,
                                                TableCode:
                                                  props.EntryMode.TableInfo
                                                    .TableType === "SPLT"
                                                    ? props.EntryMode.TableInfo
                                                        .ParentTableCodes
                                                    : props.EntryMode.TableInfo
                                                        .TableCode,
                                                TableName:
                                                  props.EntryMode.TableInfo
                                                    .TableType === "SPLT"
                                                    ? props.EntryMode.TableInfo.TableName.split(
                                                        "~"
                                                      )[0]
                                                    : props.EntryMode.TableInfo
                                                        .TableName,
                                                UpdtUsr: loginInfo.username,
                                              };
                                              restaurantPosProcessSpltTable(
                                                data
                                              ).then((res) => {
                                                setSelectedMenu([]);
                                                return props.routeSplitTable(
                                                  res[0][0]
                                                );
                                              });
                                            }
                                          })
                                          .catch((err) => {
                                            if (err) {
                                             
                                              swal(
                                                "Oh noes!",
                                                "The AJAX request failed!",
                                                "error"
                                              );
                                            } else {
                                              swal.stopLoading();
                                              swal.close();
                                            }
                                          });
                                      }}
                                    >{`Split Table`}</Button>
                                  </Tooltip>
                                )} */}
                            </>
                            // )
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          {keyboardKey.length > 0 && (
            <ViewHotKeysComponent
              keyboardKey={keyboardKey}
              title={`${
                props.EntryMode.EntryType === "DINEIN"
                  ? `Restaurant`
                  : props.EntryMode.EntryType === "DELIVERY"
                  ? `Delivery`
                  : props.EntryMode.EntryType === "PICKUP"
                  ? `Pick Up`
                  : props.EntryMode.EntryType === "CNTRSALE"
                  ? `Counter Sale`
                  : "POS Screen (Hotkey Config)"
              } POS Screen (Hotkey Config)`}
              RefreshKeyConfig={() => {
                onRefreshKeyConfig("dine-in-default");
              }}
            />
          )}

          <Modal
            maskClosable={false}
            visible={settlementModal}
            title={"Bill Settlement"}
            onCancel={() => setSettlementModal(false)}
            footer={false}
            bodyStyle={{ padding: 0 }}
            destroyOnClose={true}
            width={750}
            closeIcon={null}
          >
            <SettleBillComponent
              comp={props}
              totalData={TotalData}
              lastKOTId={lastKOTId}
              customer={customerForm}
              onBackPress={() => setSettlementModal(false)}
              CloseKOT={() => props.onBackPress()}
            />
          </Modal>
          <Modal
            maskClosable={false}
            visible={voidBillModal}
            // title={"Void Bill"}
            onCancel={() => setVoidBillModal(false)}
            footer={false}
            bodyStyle={{ padding: 0 }}
            destroyOnClose={true}
            width={750}
            closeIcon={null}
            closable={false}
          >
            {selectedMenu.length > 0 ? (
              <VoidBillComponent
                EntryMode={props.EntryMode}
                InvoiceId={selectedMenu[0].InvoiceId}
                onBackPress={() => {
                  setVoidBillModal(false);
                }}
                onSavePress={() => {
                  props.onBackPress();
                }}
                selectedMenu={selectedMenu}
                onClearTable={(invDtl) => {
                  let kotData = {
                    KOTId: [...new Set(selectedMenu.map((item) => item.KOTId))],
                    KOTStatus: "CMP",
                    UpdtUsr: loginInfo.username,
                  };
                  uptRestarantPosKOTHdrStatus(CompCode, kotData).then((res) => {
                    let kotDataDtl = [];
                    invDtl.forEach(async (row) => {
                      await kotDataDtl.push({
                        Id: row.SysOption2,
                        KOTId: row.SysOption1,
                        ItemStatus: "RJCT",
                        UpdtUsr: loginInfo.username,
                        CompCode: CompCode,
                      });
                    });
                    updtRestaurantPOSKOTDtlStatus(CompCode, kotDataDtl)
                      .then((res) => {
                        let tblData = {
                          data: {
                            ...props.EntryMode.TableInfo,
                            SysOption1: null,
                            SysOption2: null,
                            SysOption3: null,
                            SysOption4: null,
                            SysOption5: null,
                            Status: "BLANK",
                            UpdtUsr: loginInfo.username,
                            CompCode: CompCode,
                            BranchCode: BranchConfigs.value1,
                            DeptCode: "DINEIN",
                            TableType: props.EntryMode.TableInfo.TableType,
                            TableSec: props.EntryMode.TableInfo.SecCode,
                            IsActive: 1,
                          },
                        };
                        saveTableStatus(CompCode, tblData).then((res) => {
                          props.onBackPress();
                        });
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  });
                }}
                CloseKOT={() => props.onBackPress()}
              />
            ) : (
              <div>Generate A Bill</div>
            )}
          </Modal>
          <Modal
            maskClosable={false}
            visible={showRefundModal}
            onCancel={() => setShowRefundModal(false)}
            footer={false}
            bodyStyle={{ padding: 0 }}
            destroyOnClose={true}
            width={815}
            closeIcon={null}
            closable={false}
          >
            <ReceiptRefundComponent
              selectedMenu={selectedMenu}
              onBackPress={() => {
                setShowRefundModal(false);
              }}
              onSavePress={() => {
                props.onBackPress();
              }}
              customerForm={customerForm}
              comp={props}
              EntryMode={props.EntryMode}
              InvoiceId={
                selectedMenu.length > 0 ? selectedMenu[0].InvoiceId : null
              }
            />
          </Modal>
          <Modal
            maskClosable={false}
            visible={showCounterSaleSave}
            onCancel={() => setShowCounterSaleSave(false)}
            footer={false}
            bodyStyle={{
              padding: 0,
              border: `1px solid ${process.env.REACT_APP_PRIMARY_COLOR}`,
            }}
            destroyOnClose={true}
            width={815}
            closeIcon={null}
            closable={false}
          >
            <CounterSaleBillSave
              selectedMenu={selectedMenu}
              onBackPress={() => {
                setShowCounterSaleSave(false);
              }}
              onSavePress={() => {
                props.onBackPress();
              }}
              comp={props}
              EntryMode={props.EntryMode}
              InvoiceId={
                selectedMenu.length > 0 ? selectedMenu[0].InvoiceId : null
              }
              menu={selectedMenu}
              discount={discount}
              lastKOTId={lastKOTId}
              PrpareAndSaveKOT={PrpareAndSaveKOT}
              loginInfo={loginInfo}
              customerForm={customerForm}
              selectedCaptain={selectedCaptain}
              selectedNoOfPerson={selectedNoOfPerson}
              discount={discount}
              printData={showCounterSaleSave === "SAVEPRINT" ? true : false}
            />
          </Modal>
          <Modal
            maskClosable={false}
            visible={showTableTransferModal}
            onCancel={() => setShowTableTransferModal(false)}
            footer={false}
            bodyStyle={{
              padding: 0,
              border: `1px solid ${process.env.REACT_APP_PRIMARY_COLOR}`,
            }}
            destroyOnClose={true}
            width={815}
            closeIcon={null}
            centered={true}
            // closable={false}
          >
            <TableTransferComponent
              onBackPress={() => setShowTableTransferModal(false)}
              FromTable={props.EntryMode.TableInfo}
              tableList={
                props.data.TablesList &&
                props.data.TablesList.find(
                  (aa) => aa.SecCode === props.EntryMode.TableInfo.SecCode
                )
              }
              selectedMenu={selectedMenu}
              loginUser={loginInfo.username}
              onSavePress={() => {
                props.onBackPress();
              }}
              customerForm={customerForm}
              selectedCaptain={selectedCaptain}
              selectedNoOfPerson={selectedNoOfPerson}
              discount={discount}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default RestaurantPOSTran;
