import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Spin,
  Select,
  Row,
  Col,
  Card,
  Input,
  Typography,
  Switch,
  Button,
  message,
} from "antd";
import { Divider } from "antd";
import { toast } from "react-toastify";
import {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import swal from "sweetalert";
import moment from "moment";
import AppLoader from "../../../common/AppLoader";
import DiscountType from "./Components/DiscountType";
import BillAmount from "./Components/BillAmount";
import ApplicableDates from "./Components/ApplicableDates";
import Quantity from "./Components/Quantity";
import ApplicableTIme from "./Components/ApplicableTIme";
import DiscountQuantity from "./Components/DiscountQuantity";
import Inclusive from "./Components/Inclusive";
import Exclusive from "./Components/Exclusive";
import ApplicableDays from "./Components/ApplicableDays";
import {
  fetchPromotionIEConfig,
  fetchPromotionSchedule,
  InsUpdtPromotions,
} from "../../../../services/promotions";
import _ from "lodash";
import PromoSchedule from "./Components/PromoSchedule";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

class SchDay {
  constructor(
    // CompCode,
    // PromotionCode,
    // BranchCode,
    SchDay,
    FromDate,
    ToDate,
    FromTime,
    ToTime,
    IsChecked,
    IsDirty
  ) {
    // this.CompCode = CompCode,
    //   this.PromotionCode = PromotionCode,
    //   this.BranchCode = BranchCode,
    this.key = SchDay;
    this.SchDay = SchDay;
    this.FromDate = FromDate;
    this.ToDate = ToDate;
    this.FromTime = FromTime;
    this.ToTime = ToTime;
    this.IsChecked = IsChecked;
    this.IsDirty = IsDirty;
  }
}

const PromotionCard = (props) => {
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const initialValue = {
    CompCode: CompCode,
    BranchCode: null,
    PromotionType: props ? props.promoType : null,
    SchemeType: null,
    PromotionCode: "",
    PromotionName: "",
    PromotionDesc: "",
    FromAmount: "",
    ToAmount: "",
    DiscountType: "P",
    MaxDiscount: null,
    FromQty: "",
    ToQty: "",
    DiscQty: null,
    DiscountValue: null,
    TaxIncludeExclude: "I",
    IsActive: true,
    isEdited: false,
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const [promoForm, setPromoForm] = useState(
    props.data ? props.data : initialValue
  );
  const currentTran = useSelector((state) => state.currentTran);
  const branch = useSelector((state) => state.branchMaster.branchMaster);
  const [resetClick, onResetClick] = useState(true);
  const l_LoginUsr = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [promoIEData, setPromoIEData] = useState({
    Inclusive: [],
    Exclusive: [],
  });

  const [promoSchData, setPromoSchData] = useState([
    new SchDay("ALL", null, null, null, null, false, false),
    new SchDay("MON", null, null, null, null, false, false),
    new SchDay("TUE", null, null, null, null, false, false),
    new SchDay("WED", null, null, null, null, false, false),
    new SchDay("THU", null, null, null, null, false, false),
    new SchDay("FRI", null, null, null, null, false, false),
    new SchDay("SAT", null, null, null, null, false, false),
    new SchDay("SUN", null, null, null, null, false, false),
  ]);

  useEffect(() => {
    if (props.data) {
      setIsLoading(true);
      Promise.all([
        fetchPromotionIEConfig(
          CompCode,
          promoForm.BranchCode,
          promoForm.PromotionCode
        ),
        fetchPromotionSchedule(
          CompCode,
          promoForm.BranchCode,
          promoForm.PromotionCode
        ),
      ]).then((res) => {
        if (res[0].length > 0) {
          res[0].forEach((element) => {
            if (element.IEType === "I") {
              let tempData = promoIEData.Inclusive;
              tempData.push(element);
              setPromoIEData({ ...promoIEData, Inclusive: tempData });
            } else if (element.IEType === "E") {
              let tempData = promoIEData.Exclusive;
              tempData.push(element);
              setPromoIEData({ ...promoIEData, Exclusive: tempData });
            }
          });
        }
        if (res[1].length > 0) {
          let tmpData = promoSchData;
          res[1].forEach((row, idx) => {
            tmpData[tmpData.findIndex((ii) => ii.SchDay === row.SchDay)] = {
              ...tmpData.find((ii) => ii.SchDay === row.SchDay),
              FromDate: row.FromDate,
              ToDate: row.ToDate,
              FromTime: row.FromTime,
              ToTime: row.ToTime,
              IsChecked: row.IsChecked === "Y" ? true : false,
              IsDirty: true,
            };
          });
          setPromoSchData(tmpData);
        } else {
          setPromoSchData([
            new SchDay("ALL", null, null, null, null, false),
            new SchDay("MON", null, null, null, null, false),
            new SchDay("TUE", null, null, null, null, false),
            new SchDay("WED", null, null, null, null, false),
            new SchDay("THU", null, null, null, null, false),
            new SchDay("FRI", null, null, null, null, false),
            new SchDay("SAT", null, null, null, null, false),
            new SchDay("SUN", null, null, null, null, false),
          ]);
        }
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <div>
      {isLoading && <AppLoader />}
      {!isLoading && (
        <Row>
          <Col span={24}>
            <div className="header-promo-card">
              {props.title ? props.title : currentTran.formTitle}
            </div>
            <Card
              bodyStyle={{
                padding: "0px 0px 5px 0px",
                borderRight: "1px solid #F0F0F0",
              }}
            >
              <Row style={{ display: "flex" }}>
                <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "red" }}>*&nbsp;</span>
                      Branch Code :
                    </Col>
                    <Col flex="1">
                      <Select
                        style={{ width: "100%", paddingLeft: 10 }}
                        placeholder="Please select branch code"
                        value={promoForm.BranchCode}
                        disabled={props.data}
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            BranchCode: e,
                            isEdited: true,
                          });
                        }}
                      >
                        {branch &&
                          branch.map((i) => {
                            return (
                              <Option key={i.BranchCode} value={i.BranchCode}>
                                {i.BranchName}
                              </Option>
                            );
                          })}
                        <Option key="1" value="0">
                          All
                        </Option>
                      </Select>
                    </Col>
                  </Row>
                </Col>
                {/* <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "red" }}>*&nbsp;</span>
                      Promo Type :
                    </Col>
                    <Col flex="1">
                      <Select
                        style={{ width: "100%", paddingLeft: 10 }}
                        allowClear
                        disabled={props.data}
                        placeholder="Please select promo type"
                        value={promoForm.PromotionType}
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            PromotionType: e,
                            isEdited: true,
                          });
                        }}
                      >
                        <Option key="1" value="COUPON">
                          Coupon
                        </Option>
                        <Option key="2" value="SCHEME">
                          Scheme
                        </Option>
                      </Select>
                    </Col>
                  </Row>
                </Col> */}
                <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "red" }}>*&nbsp;</span>
                      Scheme Type :
                    </Col>
                    <Col flex="1">
                      <Select
                        allowClear
                        style={{ width: "100%", paddingLeft: 5 }}
                        placeholder="Please select scheme type"
                        value={promoForm.SchemeType}
                        disabled={props.data}
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            SchemeType: e,
                            isEdited: true,
                          });
                        }}
                      >
                        <Option key="1" value="BILL">
                          Bill
                        </Option>
                        <Option key="2" value="GROUP">
                          Group
                        </Option>
                      </Select>
                    </Col>
                  </Row>
                </Col>
                <Col xxl={3} xl={3} lg={3} md={12} sm={12} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "red" }}>*&nbsp;</span>
                      Is Active :
                    </Col>
                    <Col flex="1" style={{ display: "flex", paddingLeft: 10 }}>
                      <Switch
                        defaultChecked={promoForm.IsActive === 1 ? true : false}
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            IsActive: e,
                            isEdited: true,
                          });
                        }}
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xxl={5} xl={5} lg={5} md={12} sm={12} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Tax Include Exclude :
                    </Col>
                    <Col flex="1" style={{ display: "flex", paddingLeft: 10 }}>
                      <Switch
                        checked={
                          promoForm.TaxIncludeExclude === "I" ? true : false
                        }
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            TaxIncludeExclude: e === true ? "I" : "E",
                            isEdited: true,
                          });
                        }}
                        checkedChildren="Include"
                        unCheckedChildren="Exclude"
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ padding: "5px 5px", display: "flex" }}>
                <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "red" }}>*&nbsp;</span>
                      Promo Code :
                    </Col>
                    <Col flex="1" style={{ paddingLeft: 10 }}>
                      <Input
                        maxLength={10}
                        style={{ width: "100%", textTransform: "uppercase" }}
                        placeholder="Enter promotional code"
                        disabled={props.data}
                        // disabled={promoForm.PromotionCode}
                        value={promoForm.PromotionCode}
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            PromotionCode: e.target.value,
                            isEdited: true,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "red" }}>*&nbsp;</span>
                      Promo Name :
                    </Col>
                    <Col flex="1" style={{ paddingLeft: 5, display: "flex" }}>
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Enter promotional name"
                        value={promoForm.PromotionName}
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            PromotionName: e.target.value,
                            isEdited: true,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col
                      style={{
                        // display: "flex",
                        // alignItems: "center",
                        paddingRight: 10,
                      }}
                    >
                      Promo Desc :
                    </Col>
                    <Col flex="1">
                      <TextArea
                        rows={2}
                        placeholder="Enter promotional description"
                        value={promoForm.PromotionDesc}
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            PromotionDesc: e.target.value,
                            isEdited: true,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* <Row style={{ display: "flex" }}>
                <Col xxl={12} xl={8} lg={8} md={24} sm={24} xs={24}>
                  <Row style={{ padding: "5px 5px" }}>
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Tax Include Exclude :
                    </Col>
                    <Col flex="1" style={{ display: "flex", paddingLeft: 10 }}>
                      <Switch
                        checked={
                          promoForm.TaxIncludeExclude === "I" ? true : false
                        }
                        onChange={(e) => {
                          let tempPromo = { ...promoForm };
                          setPromoForm({
                            ...tempPromo,
                            TaxIncludeExclude: e === true ? "I" : "E",
                            isEdited: true,
                          });
                        }}
                        checkedChildren="Include"
                        unCheckedChildren="Exclude"
                      />
                    </Col>
                  </Row>
                </Col>
              </Row> */}
              <Divider style={{ marginBottom: 5, marginTop: 5 }} />
              <Row>
                {/* <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                  <Row style={{ marginBottom: 5, padding: 5 }}>
                    <ApplicableDates
                      valuereset={resetClick}
                      Title="Applicable dates"
                      data={promoForm}
                      OnSaveClick={(fromDate, toDate) => {
                        let tempPromo = { ...promoForm };
                        setPromoForm({
                          ...tempPromo,
                          ApplicableFrom: moment(fromDate).format("YYYY-MM-DD"),
                          ApplicableTo: moment(toDate).format("YYYY-MM-DD"),
                          isEdited: true,
                        });
                      }}
                    />
                  </Row>
                </Col> */}
                <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
                  <Row style={{ marginBottom: 5, padding: 5 }}>
                    <BillAmount
                      Title="Bill Amount"
                      data={promoForm}
                      valuereset={resetClick}
                      OnSaveClick={(fromAmount, toAmount) => {
                        let tempPromo = { ...promoForm };
                        setPromoForm({
                          ...tempPromo,
                          FromAmount: fromAmount,
                          ToAmount: toAmount,
                          isEdited: true,
                        });
                      }}
                    />
                  </Row>
                </Col>
                <Col xxl={6} xl={86} lg={6} md={12} sm={12} xs={24}>
                  <Row style={{ marginBottom: 5, padding: 5 }}>
                    <DiscountType
                      Title="Discount"
                      valuereset={resetClick}
                      data={promoForm}
                      OnSaveClick={(type, amount) => {
                        let tempPromo = { ...promoForm };
                        setPromoForm({
                          ...tempPromo,
                          DiscountType: type,
                          DiscountValue: amount,
                          isEdited: true,
                        });
                      }}
                    />
                  </Row>
                </Col>
                {/* </Row>
                <Row> */}
                {/* <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                  <Row style={{ marginBottom: 5, padding: 5 }}>
                    <ApplicableTIme
                      Title="Applicable hours"
                      valuereset={resetClick}
                      data={promoForm}
                      OnSaveClick={(fromTime, toTime) => {
                        let tempPromo = { ...promoForm };
                        setPromoForm({
                          ...tempPromo,
                          ApplicableFromHrs: moment(
                            fromTime,
                            "HH:mm:ss"
                          ).format("HH:mm:ss"),
                          ApplicableToHrs: moment(toTime, "HH:mm:ss").format(
                            "HH:mm:ss"
                          ),
                          isEdited: true,
                        });
                      }}
                    />
                  </Row>
                </Col> */}
                <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
                  <Row style={{ marginBottom: 5, padding: 5 }}>
                    <Quantity
                      valuereset={resetClick}
                      Title="Quantity"
                      data={promoForm}
                      OnSaveClick={(from, to) => {
                        let tempPromo = { ...promoForm };
                        setPromoForm({
                          ...tempPromo,
                          FromQty: from,
                          ToQty: to,
                          isEdited: true,
                        });
                      }}
                    />
                  </Row>
                </Col>
                <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
                  <Row style={{ marginBottom: 5, padding: 5 }}>
                    <DiscountQuantity
                      valuereset={resetClick}
                      Title="Discount Variation"
                      data={promoForm}
                      OnSaveClick={(discQty, maxDisc) => {
                        let tempPromo = { ...promoForm };
                        setPromoForm({
                          ...tempPromo,
                          DiscQty: discQty,
                          MaxDiscount: maxDisc,
                          isEdited: true,
                        });
                      }}
                    />
                  </Row>
                </Col>
                {/* <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                  <Row style={{ marginBottom: 5, padding: 5 }}>
                    <ApplicableDays
                      valuereset={resetClick}
                      Title="Applicable Days"
                      data={promoForm}
                      onValueChange={(value) => {
                        let tempPromo = { ...promoForm };
                        setPromoForm({
                          ...tempPromo,
                          App_Mon: value.find((ii) => ii === "MON") ? "Y" : "N",
                          App_Tue: value.find((ii) => ii === "TUE") ? "Y" : "N",
                          App_Wed: value.find((ii) => ii === "WED") ? "Y" : "N",
                          App_Thu: value.find((ii) => ii === "THU") ? "Y" : "N",
                          App_Fri: value.find((ii) => ii === "FRI") ? "Y" : "N",
                          App_Sat: value.find((ii) => ii === "SAT") ? "Y" : "N",
                          App_Sun: value.find((ii) => ii === "SUN") ? "Y" : "N",
                          isEdited: true,
                        });
                      }}
                    />
                  </Row>
                </Col> */}
              </Row>
              <Divider style={{ marginBottom: 5, marginTop: 5 }} />
              <Row>
                <Col
                  xxl={16}
                  xl={16}
                  lg={16}
                  md={16}
                  sm={24}
                  xs={24}
                  style={{ padding: "0px 5px" }}
                >
                  <PromoSchedule
                    Title="Schedule"
                    valuereset={resetClick}
                    data={promoSchData}
                    onSetSchData={(data) => {
                      if (data) {
                        setPromoSchData(data);
                      }
                    }}
                  />
                </Col>
                <Col
                  xxl={8}
                  xl={8}
                  lg={8}
                  md={8}
                  sm={24}
                  xs={24}
                  style={{ padding: "0px 5px" }}
                >
                  <Col>
                    <Inclusive
                      IEData={promoIEData}
                      valuereset={resetClick}
                      onSaveClick={(data) => {
                        let tempData = promoIEData;
                        setPromoIEData({ ...tempData, Inclusive: data });
                      }}
                    />
                  </Col>
                  <Col>
                    <Exclusive
                      IEData={promoIEData}
                      onSaveClick={(data) => {
                        let tempData = promoIEData;
                        setPromoIEData({ ...tempData, Exclusive: data });
                      }}
                    />
                  </Col>
                </Col>
              </Row>
              <Divider style={{ marginBottom: 5, marginTop: 5 }} />
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  promoForm.BranchCode === null ||
                  promoForm.PromotionType === null ||
                  promoForm.SchemeType === null ||
                  promoForm.PromotionCode === "" ||
                  promoForm.PromotionName === ""
                }
                icon={<SaveOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  if (
                    promoIEData.Inclusive.filter(
                      (ii) =>
                        (_.isUndefined(ii.IEValue) || ii.IEValue === null) &&
                        ii.IsDeleted === "N"
                    ).length > 0
                  ) {
                    message.error("Inclusive Data Cannot be Empty");
                  } else if (
                    promoIEData.Exclusive.filter(
                      (ii) =>
                        (_.isUndefined(ii.IEValue) || ii.IEValue === null) &&
                        ii.IsDeleted === "N"
                    ).length > 0
                  ) {
                    message.error("Exclusive Data Cannot be Empty");
                  } else if (
                    promoSchData.filter((ii) =>
                      ii.IsChecked === true
                        ? (ii.FromDate === null && ii.FromTime === null) ||
                          (ii.FromDate &&
                            (_.isUndefined(ii.ToDate) || ii.ToDate === null)) ||
                          (ii.ToDate &&
                            (_.isUndefined(ii.FromDate) ||
                              ii.FromDate === null)) ||
                          (ii.FromTime &&
                            (_.isUndefined(ii.ToTime) || ii.ToTime === null)) ||
                          (ii.ToTime &&
                            (_.isUndefined(ii.FromTime) ||
                              ii.FromTime === null))
                        : ""
                    ).length > 0
                  ) {
                    message.error("please enter details");
                  } else {
                    swal("Are you sure you want to continue...!!", {
                      buttons: ["Cancel", "Yes!"],
                    }).then((val) => {
                      if (val) {
                        let tempSchdata = [];
                        promoSchData.forEach((i) => {
                          tempSchdata.push({
                            SchDay: i.SchDay,
                            FromDate: i.FromDate
                              ? moment(i.FromDate).format("YYYY-MM-DD")
                              : null,
                            ToDate: i.ToDate
                              ? moment(i.ToDate).format("YYYY-MM-DD")
                              : null,
                            FromTime:
                              i.FromTime && i.FromTime !== null
                                ? moment(i.FromTime, "HH:mm:ss").format(
                                    "HH:mm:ss"
                                  )
                                : null,
                            ToTime:
                              i.ToTime && i.ToTime !== null
                                ? moment(i.ToTime, "HH:mm:ss").format(
                                    "HH:mm:ss"
                                  )
                                : null,
                            IsChecked: i.IsChecked,
                            IsDirty: i.IsDirty,
                          });
                        });
                        InsUpdtPromotions(CompCode, {
                          ...promoForm,
                          updt_usr: l_LoginUsr,
                          promoIE: promoIEData,
                          promoSchData: tempSchdata,
                        }).then((res, rej) => {
                          if (res.data) {
                            setIsLoading(false);
                            props.onBackPress();
                            swal("Data saved successfully   !!!", {
                              icon: "success",
                            });
                          }
                        });
                      } else {
                        setIsLoading(false);
                      }
                    });
                  }
                }}
              >
                Save
              </Button>
              {props.entryMode == "A" && (
                <Button
                  type="primary"
                  icon={<RetweetOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    onResetClick(!resetClick);
                    setPromoForm(props.data ? props.data : initialValue);
                  }}
                >
                  Reset
                </Button>
              )}
              {/* <Button
                type="primary"
                icon={<RetweetOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  setPromoForm(props.data ? props.data : initialValue);
                  onResetClick(!resetClick);
                }}
              >
                Reset
              </Button> */}
              <Button
                type="primary"
                icon={<RollbackOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  // dispatch(reInitialize());
                  props.onBackPress();
                }}
              >
                Back
              </Button>
            </Card>
          </Col>
        </Row>
      )}
      {/* </Spin> */}
    </div>
  );
};

export default PromotionCard;
