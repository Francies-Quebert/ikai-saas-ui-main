import React, { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import moment from "moment";
import {
  setSelectedService,
  setServicePackage,
  setSelectedSchedule,
  setSelectedPatient,
  setSelectedAddress,
  setSelectedServiceType,
  setSelectedLocation,
  setSelectedSlot,
  saveOrder,
  reinitialize,
} from "../../../store/actions/currentOrder";
import { fetchOtherMasters } from "../../../store/actions/othermaster";
import { useSelector, useDispatch } from "react-redux";
import {
  Select,
  Row,
  Col,
  DatePicker,
  Button,
  Modal,
  Descriptions,
  InputNumber,
  Card,
  Input,
} from "antd";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import { fetchUserPatientAddresses } from "../../../store/actions/patientAddress";
// import UserMasterCardNew from "../../portal/backoffice/UserMaster/UserMasterCardNew";
import UserMasterCardNew from "../Restaurant/components/SubComponents/CustomerSelectionComponent";
// import AddAddressCard from "./AddAddressCard";
import AddAddressCard from "../../portal/backoffice/CustomerAddress/CustomerAddressCard";
import Icon, {
  SaveOutlined,
  FileAddOutlined,
  RetweetOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import CardHeader from "../../common/CardHeader";
import { hasRight } from "../../../shared/utility";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const OrderBookingCardNew = (props) => {
  const { Option } = Select;
  const dispatch = useDispatch();

  // useSelector
  const appMain = useSelector((state) => state.AppMain);
  const brfMasters = useSelector((state) => state.otherMaster.brfMasters);
  const userMaster = useSelector((state) => state.userMaster);
  const appservices = useSelector((state) => state.AppMain.services);
  const SlotsMap = useSelector((state) => state.AppMain.service_slot_loc_mapp);
  const currentOrder = useSelector((state) => state.currentOrder);
  // useState
  const [selectedLocationId, setSelectedLocationId] = useState();
  const [selectedReference, setSelectedReference] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedServiceTypeCode, setSelectedServiceTypeCode] = useState();
  const [selectedServiceId, setSelectedServiceId] = useState();
  const [selectedPackageId, setSectedPackageId] = useState();
  const [selectedAddress, setSelectedAddressId] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState();
  const [ssAleart, setSsAlert] = useState();
  const [selectedUnit, setSelectedUnit] = useState(1);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isShowCustomerModal, setIsShowCustomerModal] = useState(false);
  const [orderRemark, setOrderRemark] = useState("");
  const currTran = useSelector((state) => state.currentTran);
  // useEffect
  useEffect(() => {
    dispatch(setSelectedSchedule(null, null));
    dispatch(fetchUserMasters("U"));
    dispatch(fetchOtherMasters("BRF", 1));
  }, []);

  useEffect(() => {
    selectedCustomer &&
      dispatch(
        fetchUserPatientAddresses(
          "U",
          selectedCustomer !== undefined && selectedCustomer
        )
      );
  }, [selectedCustomer]);

  //Get service
  var netAmount = null;
  var grossTotal = null;
  let discAmont = null;
  const [distinctServices, setDistinctServices] = useState([]);
  let tempappservices = [];
  if (appservices) {
    tempappservices = appservices.filter(
      (item) => item.serviceType === selectedServiceTypeCode
    );
  }
  useEffect(() => {
    let tmpServices = [];
    if (tempappservices) {
      tempappservices.map((item) => {
        if (
          !tmpServices.find(
            (ii) =>
              ii.serviceId === item.serviceId &&
              ii.locationId === selectedLocationId
          )
        ) {
          tmpServices.push(item);
        }
      });
    }
    setDistinctServices(tmpServices);
  }, [selectedServiceTypeCode]);

  // Disable Date
  function disabledDate(current) {
    return moment(current).add(1, "days") < moment().endOf("day");
  }

  // get slot
  const [ss, sssss] = useState(1);
  let avalibleSlots = [];
  appMain.slots.map((slot) => {
    const arrApplicableforService = SlotsMap.filter(
      (iiii) =>
        iiii.ServiceId === ss &&
        iiii.LocationId === selectedLocationId &&
        iiii.SlotId === slot.Id
    );
    if (arrApplicableforService.length > 0) {
      avalibleSlots.push(slot);
    }
  });

  const packvalue = (val) => {
    const packageSelected =
      appMain.packageMasters &&
      appMain.services.filter(
        (service) =>
          service.serviceId === selectedServiceId &&
          service.locationId === selectedLocationId &&
          service.packageId === val
      )[0];
    var gTotal = null;
    var dAmount = null;
    var nAmount = null;
    if (packageSelected) {
      gTotal = packageSelected.actualrate;
      dAmount =
        packageSelected.discType === "P"
          ? (packageSelected.actualrate * packageSelected.discValue) / 100
          : packageSelected.discValue;
      nAmount = gTotal * selectedUnit - dAmount * selectedUnit;
    }

    return {
      grossTotal: gTotal * selectedUnit,
      discAmount: dAmount * selectedUnit,
      netAmount: nAmount,
    };
  };

  const showAlert = (actiontype, message) => {
    setSsAlert(
      <SweetAlert
        showCancel
        confirmBtnText="Continue"
        title="Are you sure?"
        onCancel={() => setSsAlert()}
        onConfirm={() => {
          setSsAlert();
          dispatch(
            saveOrder(
              currentOrder.patientProfile.userId,
              currentOrder.patientAddress,
              currentOrder.serviceProfile,
              currentOrder.package,
              currentOrder.schedule,
              // selectedLocationId,
              currentOrder.location,
              selectedReference,
              currentOrder.slot.slotId,
              selectedUnit,
              orderRemark
            )
          );
          onReset();
          props.finishClick();
        }}
      >
        {message}
      </SweetAlert>
    );
  };

  const onReset = () => {
    setSelectedReference();
    setSelectedLocationId();
    setSelectedCustomer();
    setSelectedServiceTypeCode();
    setSelectedServiceId();
    setSelectedSlotId();
    setSectedPackageId();
    setSelectedAddressId();
    setSelectedUnit(1);
    setOrderRemark("");
    setSelectedDate(null);
    setSelectedEndDate(null);
    dispatch(reinitialize());
  };

  return (
    <div style={{ width: "100%", padding: "10px 15px" }}>
      {ssAleart}
      <div>
        <CardHeader title="Add Booking" />
        <Descriptions bordered size="small">
          <Descriptions.Item label="Select Customer" span={1.5}>
            <Row>
              <Col flex="1 1 200px">
                <div style={{ display: "flex" }}>
                  <Select
                    showSearch
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder="Select a Customer"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toString().toLowerCase()) >= 0
                    }
                    value={selectedCustomer}
                    onChange={(val) => {
                      setSelectedCustomer();
                      setSelectedAddressId();
                      setSelectedCustomer(val);
                      dispatch(
                        setSelectedPatient(
                          userMaster.customerMasters.filter(
                            (ii) => ii.userId === val
                          )[0]
                        )
                      );
                    }}
                    // loading={userMaster.isLoading}
                  >
                    {userMaster.customerMasters.length > 0 &&
                      userMaster.customerMasters.map((item) => {
                        return (
                          <Option key={item.userId} value={item.userId}>
                            {item.Name} ({item.mobile})
                          </Option>
                        );
                      })}
                  </Select>
                  <div
                    style={{
                      marginBottom: "auto",
                      marginTop: "auto",
                      marginLeft: 8,
                    }}
                  >
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<FileAddOutlined />}
                      size={"small"}
                      onClick={() => {
                        setIsShowCustomerModal(true);
                      }}
                      disabled={
                        hasRight(currTran.moduleRights, "ADD")
                        // appMain.userMenu
                        //   .filter((ii) => ii.ModGroupId === 8)[0]
                        //   .children.filter((iii) => iii.Id === 5)[0]
                        //   .Rights.filter(
                        //     (rit) =>
                        //       rit.RightCode === "ADD" && rit.RightVal === "Y"
                        //   ).length <= 0
                      }
                    />
                  </div>
                </div>
              </Col>

              {/* <Col flex="0 1 200px">
              <Button
                type="primary"
                style={{ marginLeft: 10 }}
               
              >
                Add Customer
              </Button>
            </Col> */}
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="Customer Address" span={1.5}>
            <div style={{ display: "flex" }}>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a Address"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                }
                value={selectedAddress}
                onChange={(val) => {
                  setSelectedAddressId(val);
                  dispatch(
                    setSelectedAddress(
                      appMain.patientAddresses.filter(
                        (ii) => ii.addressId === val
                      )[0]
                    )
                  );
                }}
                allowClear={true}
                // loading={selectedCustomer === undefined ? true : false}
              >
                {appMain.patientAddresses !== null &&
                  appMain.patientAddresses.length > 0 &&
                  appMain.patientAddresses.map((item) => {
                    return (
                      <Option key={item.addressId} value={item.addressId}>
                        {`${item.add1}, ${item.add2} `}
                        {`${
                          item.geoLocationName === "null"
                            ? `/ ${item.geoLocationName}`
                            : ``
                        }`}
                      </Option>
                    );
                  })}
              </Select>
              {/* <div
                style={{
                  marginBottom: "auto",
                  marginTop: "auto",
                  marginLeft: 8,
                }}
              >
                <Button
                  disabled={!selectedCustomer}
                  type="primary"
                  shape="circle"
                  icon={<FileAddOutlined />}
                  size={"small"}
                  onClick={() => {
                    setShowAddAddress(true);
                  }}
                />
              </div> */}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Service Location" span={1.5}>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a Location"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              allowClear={true}
              value={selectedLocationId}
              onChange={(val) => {
                setSelectedLocationId(val);
                setSelectedServiceId();
                setSelectedServiceTypeCode();
                setSectedPackageId();
                dispatch(
                  setSelectedLocation(
                    appMain.locations.filter((ii) => ii.LocationId === val)[0]
                  )
                );
              }}
            >
              {appMain.locations &&
                appMain.locations.map((item) => {
                  return (
                    <Option key={item.LocationId} value={item.LocationId}>
                      {item.LocationName}
                    </Option>
                  );
                })}
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="Order Reference" span={3}>
            <Select
              showSearch
              allowClear={true}
              style={{ width: "100%" }}
              placeholder="Select a Reference Type"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={selectedReference}
              onChange={(val) => {
                setSelectedReference(val);
              }}
            >
              {brfMasters &&
                brfMasters.map((item) => {
                  return (
                    <Option key={item.ShortCode} value={item.ShortCode}>
                      {item.MasterDesc}
                    </Option>
                  );
                })}
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="Service Type" span={3}>
            <Select
              allowClear={true}
              showSearch
              style={{ display: "flex", flex: 1 }}
              placeholder="Select a Service Type"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={selectedServiceTypeCode}
              onChange={(val) => {
                setSelectedServiceTypeCode(val);
                setSelectedServiceId();
                setSectedPackageId();
                dispatch(
                  setSelectedServiceType(
                    appMain.serviceTypes.filter(
                      (ii) => ii.serviceTypeCode === val
                    )[0]
                  )
                );
              }}
              // loading={selectedLocationId === undefined ? true : false}
            >
              {appMain.serviceTypes &&
                appMain.serviceTypes
                  .filter((ll) => ll.IsActive === true)
                  .map((item) => {
                    return (
                      <Option
                        key={item.serviceTypeCode}
                        value={item.serviceTypeCode}
                      >
                        {item.serviceTypeTitle} ({item.serviceTypeDesc})
                      </Option>
                    );
                  })}
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="Service" span={1.5}>
            <Select
              allowClear={true}
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a Service"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={selectedServiceId}
              onChange={(val) => {
                setSelectedServiceId(val);
                setSectedPackageId();
                setSelectedDate(null);
                setSelectedEndDate(null);
                dispatch(
                  setSelectedService(
                    distinctServices
                      .filter(
                        (ii) =>
                          ii.locationId === selectedLocationId &&
                          ii.serviceType === selectedServiceTypeCode
                      )
                      .filter((iii) => iii.serviceId === val)[0]
                  )
                );
              }}
              // loading={selectedServiceTypeCode === undefined ? true : false}
            >
              {distinctServices &&
                distinctServices
                  .filter(
                    (ii) =>
                      ii.locationId === selectedLocationId &&
                      ii.serviceType === selectedServiceTypeCode
                  )
                  .map((item) => {
                    return (
                      <Option key={item.serviceId} value={item.serviceId}>
                        {item.serviceTitle} ({item.serviceDesc})
                      </Option>
                    );
                  })}
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="Package" span={1.5}>
            {/* <div style={{ display: "flex" }}> */}
            <Select
              allowClear={true}
              // loading={selectedServiceId === undefined ? true : false}
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a Package "
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={selectedPackageId}
              onChange={(val) => {
                setSectedPackageId(val);
                setSelectedDate(null);
                setSelectedEndDate(null);
                if (val) {
                  dispatch(
                    setServicePackage(
                      appMain.packageMasters.filter(
                        (ii) => ii.PackageId === val
                      )[0],
                      appMain.packageMasters.filter(
                        (ii) => ii.PackageId === val
                      )[0].PackageUnit,
                      packvalue(val).grossTotal,
                      packvalue(val).netAmount,
                      packvalue(val).discAmount
                    )
                  );
                } else {
                  dispatch(
                    setServicePackage(null, null, null, null, null, null)
                  );
                }
              }}
            >
              {appMain.packageMasters &&
                appMain.services
                  .filter(
                    (service) =>
                      service.serviceId === selectedServiceId &&
                      service.locationId === selectedLocationId
                  )
                  .map((ss) =>
                    appMain.packageMasters
                      .filter((ii) => ii.PackageId === ss.packageId)
                      .map((item) => {
                        grossTotal = ss.actualrate;
                        discAmont =
                          ss.discType === "P"
                            ? (ss.actualrate * ss.discValue) / 100
                            : ss.discValue;
                        netAmount =
                          grossTotal * selectedUnit - discAmont * selectedUnit;
                        return (
                          <Option key={item.PackageId} value={item.PackageId}>
                            {item.PackageTitle} {"( \u20B9 " + netAmount + ")"}
                          </Option>
                        );
                      })
                  )}
            </Select>

            {/* </div> */}
          </Descriptions.Item>
          <Descriptions.Item label="Unit" span={1.5}>
            {/* <div> */}
            <InputNumber
              placeholder="Unit"
              value={selectedUnit}
              style={{ width: "100%" }}
              onChange={(val) => {
                setSelectedUnit(val);
              }}
              required={true}
              precision={0}
            />
            {/* {!selectedUnit && <div style={{color:'red',fontSize:12}}>Unit cannot be Empty</div>} */}
            {/* </div> */}
          </Descriptions.Item>
          <Descriptions.Item label="Schedule" span={1.5}>
            <div style={{ display: "flex" }}>
              {currentOrder.package.packeProfile !== null &&
              currentOrder.package.packeProfile.VisitType === "REGULAR" &&
              currentOrder.package.packeProfile.PackageUnit > 1 ? (
                <RangePicker
                  disabled={[false, true]}
                  disabledDate={disabledDate}
                  // defaultValue={[null, null]}
                  value={[
                    selectedDate === null
                      ? null
                      : moment(selectedDate, "YYYY-MM-DD"),
                    selectedEndDate === null
                      ? null
                      : moment(selectedEndDate, "YYYY-MM-DD"),
                  ]}
                  allowEmpty={[true, true]}
                  onChange={(val, string) => {
                    let fromDate =
                      val === null || val[0] === null
                        ? null
                        : moment(val[0]).format("YYYY-MM-DD");
                    let toDate =
                      val === null || val[0] === null
                        ? null
                        : moment(val[0])
                            .add(
                              "days",
                              currentOrder.package.packeProfile.PackageUnit - 1
                            )
                            .format("YYYY-MM-DD");
                    setSelectedDate(fromDate);
                    setSelectedEndDate(toDate);
                    // console.log(string)
                    dispatch(setSelectedSchedule(fromDate, toDate));
                  }}
                  format="DD-MM-YYYY"
                  style={{ flex: 1 }}
                />
              ) : (
                <DatePicker
                  allowClear={true}
                  disabledDate={disabledDate}
                  value={
                    selectedDate === null
                      ? null
                      : moment(selectedDate, "YYYY-MM-DD")
                  }
                  onChange={(date, dateString) => {
                    setSelectedDate(
                      date === null ? null : moment(date).format("YYYY-MM-DD")
                    );
                    dispatch(
                      setSelectedSchedule(
                        date === null
                          ? null
                          : moment(date).format("YYYY-MM-DD"),
                        date === null ? null : moment(date).format("YYYY-MM-DD")
                      )
                    );
                  }}
                  style={{ flex: 1 }}
                  format="DD-MM-YYYY"
                />
              )}

              <Select
                // loading={selectedPackageId === undefined ? true : false}
                showSearch
                allowClear={true}
                style={{ flex: 1, marginLeft: 5 }}
                placeholder="Select a Slot"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={selectedSlotId}
                onChange={(val) => {
                  setSelectedSlotId(val);
                  dispatch(
                    setSelectedSlot(
                      avalibleSlots.filter((ii) => ii.Id === val)[0].Id,
                      avalibleSlots.filter((ii) => ii.Id === val)[0].SlotName
                    )
                  );
                }}
              >
                {avalibleSlots &&
                  avalibleSlots.map((item) => {
                    return (
                      <Option key={item.Id} value={item.Id}>
                        {item.SlotName}
                      </Option>
                    );
                  })}
              </Select>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Order Remark" span={3}>
            <TextArea
              // name="text-area"
              value={orderRemark}
              onChange={({ target: { value } }) => {
                // this.setState({ value });
                setOrderRemark(value);
              }}
              placeholder="Remark"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Descriptions.Item>
          {/* <Descriptions.Item label="Slot" span={1}></Descriptions.Item> */}
        </Descriptions>
        <Modal
          visible={isShowCustomerModal}
          onCancel={() => {
            setIsShowCustomerModal(false);
          }}
          footer={null}
          title={"Add Customer"}
          bodyStyle={{ padding: 0 }}
          closable={false}
          destroyOnClose={true}
          width={750}
        >
          <UserMasterCardNew
            trnType="U"
            onBackPress={() => {
              setIsShowCustomerModal(false);
            }}
            showUserCredentials={false}
            // onBackPress={() => setIsShowCustomerModal(false)}
            onCustomerSet={(values) => {
              setIsShowCustomerModal();
              setSelectedAddressId(
                values.customer.address && values.customer.address.length > 0
                  ? values.customer.address[0]
                  : null
              );
              dispatch(fetchUserMasters("U"));
              setSelectedCustomer(
                values.customer.userId ? values.customer.userId : null
              );
              if (values.customer.userId !== null) {
                dispatch(
                  setSelectedPatient(
                    userMaster.customerMasters.filter(
                      (ii) => ii.userId === values.customer.userId
                    )[0]
                  )
                );
              }
            }}
            data={{ customer: { userId: selectedCustomer } }}
          />
        </Modal>
        <Modal
          destroyOnClose={true}
          // title="Add Address"
          closable={false}
          visible={showAddAddress}
          onCancel={() => {
            setShowAddAddress(false);
          }}
          bodyStyle={{ padding: 0 }}
          footer={null}
        >
          <AddAddressCard
            onBackPress={() => {
              setShowAddAddress(false);
            }}
          />
        </Modal>
      </div>

      <Card style={{ marginTop: 4 }} bodyStyle={{ padding: 0 }}>
        <Button
          disabled={
            (selectedCustomer &&
              selectedAddress &&
              selectedLocationId &&
              selectedServiceTypeCode &&
              selectedServiceId &&
              selectedPackageId &&
              selectedSlotId) === undefined || selectedDate === null
          }
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => {
            showAlert("success", "Do you Book Now?");
          }}
          style={{ marginRight: 5 }}
        >
          Save
        </Button>
        <Button
          type="primary"
          style={{ marginRight: 5 }}
          icon={<Icon component={RollbackOutlined} />}
          onClick={() => {
            onReset();
            props.finishClick();
          }}
        >
          Back
        </Button>

        <Button
          type="primary"
          icon={<RetweetOutlined />}
          style={{ marginRight: 5 }}
          onClick={onReset}
        >
          Reset
        </Button>
      </Card>
    </div>
  );
};

export default OrderBookingCardNew;
