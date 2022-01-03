import React, { Fragment, useEffect, useState } from "react";
import { PlusCircle } from "react-feather";
import CountUp from "react-countup";
// import DatePicker from "react-datepicker";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SelectLocationItem from "./SelectLocationItem";
import { useSelector, useDispatch } from "react-redux";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import { fetchUserPatientAddresses } from "../../../store/actions/patientAddress";
import UserMasterCardNew from "../../portal/backoffice/UserMaster/UserMasterCardNew";
import AddAddressCard from "./AddAddressCard";
import DisplayCustomerItem from "./DisplayCustomerItem";
import SelectableItem from "./SelectableItem";
import SelectableItemNew from "./SelecteableItemNew";
import "react-datepicker/dist/react-datepicker.css";
// import Modal from "react-responsive-modal";
import moment from "moment";
import {
  setSelectedService,
  setServicePackage,
  setSelectedSchedule,
  setSelectedPatient,
  setSelectedAddress,
  setSelectedServiceType,
  setSelectedLocation,
  saveOrder,
  reinitialize,
} from "../../../store/actions/currentOrder";
import OrderSummary from "../OrderBookingMain/OrderSummary";
import AddCard from "../OrderBookingMain/AddCard";
import SweetAlert from "react-bootstrap-sweetalert";
import { fetchOtherMasters } from "../../../store/actions/othermaster";
import { Select, Row, Col, DatePicker, Button, Modal } from "antd";

const OrderBookingCard = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const appMain = useSelector((state) => state.AppMain);
  const [selectedLocationId, setSelectedLocationId] = useState();
  const [selectedServiceTypeCode, setSelectedServiceTypeCode] = useState();
  const [selectedServiceId, setSelectedServiceId] = useState(1);
  const [selectedPackageId, setSectedPackageId] = useState();
  const [selectedSlotId, setSelectedSlotId] = useState();
  const userMaster = useSelector((state) => state.userMaster);
  const [selcetedCustomer, setSelectedCustomer] = useState();
  const [showPakage, setShowPakage] = useState(false);
  const [packDesc, setPackDesc] = useState("Select a Package Please");
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const SlotsMap = useSelector((state) => state.AppMain.service_slot_loc_mapp);
  const currentOrder = useSelector((state) => state.currentOrder);
  const [selectedAddress, setSelectedAddresss] = useState();
  const [ssAleart, setSsAlert] = useState();
  const brfMasters = useSelector((state) => state.otherMaster.brfMasters);
  const [selectedReference, setSelectedReference] = useState();
  useEffect(() => {
    dispatch(fetchUserMasters("U"));
    dispatch(fetchOtherMasters("BRF", 1));
  }, []);

  useEffect(() => {
    dispatch(
      fetchUserPatientAddresses(
        "U",
        selcetedCustomer ? selcetedCustomer.userId : 0
      )
    );
  }, [selcetedCustomer]);

  useEffect(() => {
    dispatch(setSelectedSchedule(selectedDate, selectedDate, null, null));
  }, []);

  const appservices = useSelector((state) => state.AppMain.services);

  // if (BkgMins) {
  //   moment(selectedDate).format("YYYY-MM-DD");
  //   const currTime = moment()
  //     .add(BkgMins.value1, "minutes")
  //     .format("YYYY-MM-DD HH:mm");

  //   const sss = moment(
  //     "2020-02-27" + " " + "09:00",
  //     "YYYY-MM-DD hh:mm:ss"
  //   ).format("YYYY-MM-DD HH:mm");

  // }
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
              selcetedCustomer.userId,
              currentOrder.patientAddress,
              currentOrder.serviceProfile,
              currentOrder.package,
              currentOrder.schedule,
              currentOrder.location,
              selectedReference
            )
          );
          setSelectedReference();
          setSelectedLocationId();
          setSelectedCustomer();
          setSelectedServiceTypeCode();
          setSelectedServiceId();
          setSelectedSlotId();
          setSectedPackageId();
          setShowPakage(false);
          setSectedPackageId();
          setPackDesc("Select a Package Please");
          reinitialize();
          handleReset();
          props.finishClick();
        }}
      >
        {message}
      </SweetAlert>
    );
  };

  const RenderLocation = () => {
    const onLocationChange = (val) => {
      setSelectedLocationId(val);
      setSelectedServiceTypeCode();
      setSelectedServiceId();
      setSelectedSlotId();
      setSectedPackageId();
      setShowPakage(false);
      setPackDesc("Select a Package Please");
      dispatch(
        setSelectedLocation(
          appMain.locations.filter((ii) => ii.LocationId === val)
        )
      );
    };
    const { Option } = Select;
    return (
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          paddingRight: 15,
          paddingLeft: 15,
        }}
      >
        <Col
          flex={1}
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 14,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          {/* <label> */}
          <div
            style={{
              color: "#ff4d4f",
              fontSize: 14,
              lineHeight: 1,
              fontFamily: "SimSun, sans-serif",
              display: "inline-block",
            }}
          >
            *
          </div>
          &nbsp;Location:&nbsp;&nbsp;
          {/* </label> */}
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a Location"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={selectedLocationId}
            onChange={onLocationChange}
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
        </Col>
        <Col
          flex={1}
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 14,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <div
            style={{
              color: "#ff4d4f",
              fontSize: 14,
              lineHeight: 1,
              fontFamily: "SimSun, sans-serif",
              display: "inline-block",
            }}
          >
            *
          </div>
          &nbsp;Reference:&nbsp;&nbsp;
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a Reference Type"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.StoLowerCase().indexOf(input.toLowerCase()) >= 0
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
        </Col>
      </Row>
    );
  };

  const RenderReference = () => {
    return (
      <div
        className="row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        {brfMasters &&
          brfMasters.map((item) => {
            return (
              <div key={item.ShortCode} className="col-md-4">
                <div className="row">
                  <SelectableItem
                    key={item.ShortCode}
                    ServiceTitle={item.MasterDesc}
                    IsSelected={selectedReference === item.ShortCode}
                    OnServiceSelect={() => {
                      if (selectedLocationId === item.LocationId) {
                        setSelectedReference();
                      } else {
                        setSelectedReference(item.ShortCode);
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const RenderCustomer = () => {
    const [isShowCustomerModal, setIsShowCustomerModal] = useState(false);
    const [editedData, setEditedData] = useState();
    const closeModal = () => {
      setIsShowCustomerModal(false);
    };
    return (
      <div
        className="card-body row p-t-10 p-b-10"
        // style={{
        //   display: "flex",
        //   justifyContent: "center",
        //   flexDirection: "column"
        // }}
      >
        <div className=" col-md-12 dzu-dropzone p-20">
          {selcetedCustomer && <DisplayCustomerItem data={selcetedCustomer} />}
          {!selcetedCustomer && "Customer Not Selected"}
        </div>
        <div className="col-md-12 p-l-0 p-r-0" style={{ paddingBottom: 70 }}>
          <CustomDataTable
            // isInvisibleAdd={true}
            columnProperties={customerMasterColumnProperties}
            myData={userMaster.customerMasters}
            onAddClick={() => {
              setIsShowCustomerModal(true);
              setEditedData({ entryMode: "A" });
            }}
            onEditPress={(values) => {
              setEditedData({ entryMode: "E", formData: values });
              setIsShowCustomerModal(true);
            }}
            pageDefaultSize={15}
            allowSingleSelect={true}
            showViewDetail={true}
            IsInVisibleAction={true}
            onRowSelectChange={(ss) => {
              setSelectedCustomer(ss);
              dispatch(setSelectedPatient(ss));
            }}
          />
        </div>
        <Modal
          // title="Basic Modal"
          visible={isShowCustomerModal}
          // visible={true}
          // onOk={this.handleOk}
          onCancel={closeModal}
          footer={null}
          // open={isShowCustomerModal}
          // onClose={() => setIsShowCustomerModal(false)}
          // center
        >
          <UserMasterCardNew
            trnType="U"
            onBackPress={() => {
              setIsShowCustomerModal(false);
            }}
            showUserCredentials={false}
            // onBackPress={() =>  setIsShowCustomerModal(false)}
          />
        </Modal>
      </div>
    );
  };

  const RenderServiceTypes = () => {
    return (
      <div className="row">
        {appMain.serviceTypes &&
          appMain.serviceTypes
            .filter((ll) => ll.IsActive === true)
            .map((item) => {
              return (
                <div className="col-md-4">
                  {/* <ul style={{border:"1px solid #A9A9A9"}}>
                    <li class="ant-list-item">
                      <div class="ant-list-item-meta">
                        <div class="ant-list-item-meta-avatar">
                          <span class="ant-avatar ant-avatar-circle ant-avatar-image">
                          <Radio checked={true} />
                          </span>
                        </div>
                        <div class="ant-list-item-meta-content">
                          <h4 class="ant-list-item-meta-title">
                            <a href="https://ant.design">Ant Design Title 1</a>
                          </h4>
                          <div class="ant-list-item-meta-description">
                            Ant Design, a design language for background
                            applications, is refined by Ant UED Team
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul> */}
                  <SelectableItemNew
                    key={item.serviceTypeCode}
                    Title={item.serviceTypeTitle}
                    Description={item.serviceTypeDesc}
                    onSelect={() => {
                      if (selectedServiceTypeCode === item.serviceTypeCode) {
                        setSelectedServiceTypeCode();
                        setSelectedServiceId();
                        setSelectedSlotId();
                        setSectedPackageId();
                        setShowPakage(false);
                        setSectedPackageId();
                        setPackDesc("Select a Package Please");
                      } else {
                        setSelectedServiceTypeCode(item.serviceTypeCode);
                        setSelectedServiceId();
                        setSelectedSlotId();
                        setSectedPackageId();
                        setShowPakage(false);
                        setSectedPackageId();
                        setPackDesc("Select a Package Please");
                        dispatch(setSelectedServiceType(item));
                      }
                    }}
                    IsSelected={
                      selectedServiceTypeCode === item.serviceTypeCode
                    }
                  />
                </div>
              );
            })}
      </div>
    );
  };

  const RenderServices = () => {
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
    }, []);

    return (
      <Fragment>
        <div className="row">
          {distinctServices &&
            distinctServices
              .filter(
                (item) =>
                  item.locationId === selectedLocationId &&
                  item.serviceType === selectedServiceTypeCode
              )
              .map((item) => {
                return (
                  <div
                    key={item.serviceId}
                    style={{ marginBottom: 8 }}
                    className="col-md-4"
                  >
                    <SelectableItemNew
                      // ServiceImg={item.serviceTypeImageURI}
                      Title={item.serviceTitle}
                      Description={item.serviceDesc}
                      onSelect={() => {
                        if (selectedServiceId === item.serviceId) {
                          setSelectedServiceId();
                          setSectedPackageId();
                          setShowPakage(false);
                          setSectedPackageId();
                          setPackDesc("Select a Package Please");
                        } else {
                          setSelectedServiceId(item.serviceId);
                          dispatch(setSelectedService(item));
                          setShowPakage(true);
                        }
                      }}
                      IsSelected={selectedServiceId === item.serviceId}
                    />
                  </div>
                );
              })}
        </div>

        {showPakage === true && (
          <div>
            <div className="card-header text-center p-2 bg-primary ">
              <h5 style={{ fontSize: 12, color: "#FFF" }}>Select Package</h5>
            </div>
            <div className="row">
              <div className="col-md-4" style={{ marginBottom: 8 }}>
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
                          netAmount = grossTotal - discAmont;
                          return (
                            <SelectableItemNew
                              key={item.PackageId}
                              Title={item.PackageTitle}
                              // ServiceDesc={item.serviceDesc}
                              onSelect={() => {
                                if (selectedPackageId === item.PackageId) {
                                  setSectedPackageId();
                                  setPackDesc("Select a Package Please");
                                } else {
                                  setPackDesc(item.PackageDesc);
                                  setSectedPackageId(item.PackageId);
                                  dispatch(
                                    setServicePackage(
                                      item,
                                      item.PackageUnit,
                                      grossTotal,
                                      netAmount,
                                      discAmont
                                    )
                                  );
                                }
                              }}
                              IsSelected={selectedPackageId === item.PackageId}
                            />
                          );
                        })
                    )}
              </div>
              <div className="col-md-8 card">
                {packDesc}
                {/* <div>
                  <strong>Gross Amount:</strong>  &#8377;
                  {grossTotal? grossTotal : null}
                </div>
                <div>
                  <strong>Discount Amount:</strong>  &#8377;
                  {discAmont? discAmont : null}
                </div> */}
                <div>
                  <strong>Total Amount:</strong> &#8377;
                  {netAmount ? netAmount : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  };

  const RenderSchedule = () => {
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
    function disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    }

    return (
      <div className="row">
        <div className="col-md-3">
          {/* <div className="datepicker-here" data-language="en"> */}
          <DatePicker
            // className="form-control digits"
            // minDate={new Date()}
            // fetchHelpGrpUsrMapp
            // selected={selectedDate}
            // onChange={(date) => {
            //   setSelectedDate(date);

            //   setSelectedSlotId();
            //   dispatch(
            //     setSelectedSchedule(
            //       moment(date).format("YYYY-MM-DD"),
            //       moment(date).format("YYYY-MM-DD"),
            //       null,
            //       null
            //     )
            //   );
            // }}
            // inline
            disabledDate={disabledDate}
            value={moment(selectedDate)}
            onChange={(date, dateString) => {
              setSelectedDate(dateString);
              dispatch(setSelectedSchedule(dateString, dateString, null, null));
            }}
            style={{ width: "100%" }}
          />
          {/* </div> */}
        </div>
        <div className="col-md-9 row ">
          {avalibleSlots &&
            avalibleSlots.map((item) => {
              return (
                <div className="col-md-3" style={{ background: "#FFF" }}>
                  <SelectableItemNew
                    key={item.Id}
                    // ServiceImg={item.serviceTypeImageURI}
                    Title={item.SlotName}
                    onSelect={() => {
                      if (selectedSlotId === item.Id) {
                        setSelectedSlotId();
                      } else {
                        setSelectedSlotId(item.Id);
                        dispatch(
                          setSelectedSchedule(
                            moment(selectedDate).format("YYYY-MM-DD"),
                            moment(selectedDate).format("YYYY-MM-DD"),
                            item.Id,
                            item.SlotName
                          )
                        );
                      }
                    }}
                    IsSelected={selectedSlotId === item.Id}
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const RenderAddress = () => {
    const [showAddAddress, setShowAddAddress] = useState(false);
    return (
      <div className="row">
        {appMain.patientAddresses.length > 0 &&
          appMain.patientAddresses.map((item) => {
            return (
              <div className="col-md-4" key={item.addressId}>
                <SelectableItemNew
                  // ServiceImg={item.serviceTypeImageURI}
                  Title={`${item.add1},${item.add2}`}
                  Description={`Address :${
                    item.geoLocationName === "null"
                      ? item.geoLocationName
                      : ` N/A`
                  }`}
                  onSelect={() => {
                    if (selectedAddress === item.addressId) {
                      setSelectedAddresss();
                    } else {
                      setSelectedAddresss(item.addressId);
                      dispatch(setSelectedAddress(item));
                    }
                  }}
                  IsSelected={selectedAddress === item.addressId}
                />
              </div>
            );
          })}
        <div className="col-md-4" style={{ minHeight: 120 }}>
          <AddCard
            onAddClick={() => {
              setShowAddAddress(true);
            }}
            title="Add Address"
          />
        </div>

        <Modal
          title="Add Address"
          visible={showAddAddress}
          //  onOk={this.handleOk}
          onCancel={() => {
            setShowAddAddress(false);
          }}
          footer={null}
          // showCloseIcon={false}
          //   open={showAddAddress}
          //   onClose={() => setShowAddAddress(false)}
          //   center
        >
          <AddAddressCard
            // trnType="U"
            onBackPress={() => {
              setShowAddAddress(false);
            }}
            // showUserCredentials={false}
          />
        </Modal>
      </div>
    );
  };

  const RenderSummary = () => {
    return (
      <div className="row m-30">
        <OrderSummary
          orderTitle={currentOrder.serviceType.serviceTypeTitle}
          orderSubTitle={currentOrder.serviceProfile.serviceTitle}
          // orderPackDesc={currentOrder.serviceProfile.serviceDesc}
          // orderdate={new Date()}
          userName={selcetedCustomer.Name}
          mobile={selcetedCustomer.mobile}
          // PaymentStatus="TEst"
          slot={currentOrder.schedule.slotDesc}
          ScheduledFrom={currentOrder.schedule.fromDate}
          ScheduledTo={currentOrder.schedule.toDate}
          add1={currentOrder.patientAddress.add1}
          add2={currentOrder.patientAddress.add2}
          geoLocationName={currentOrder.patientAddress.geoLocationName}
          City={currentOrder.location[0].LocationName}
          Pin={currentOrder.patientAddress.add3}
          NetPayable={currentOrder.package.amount}
          // City="Mumbai"
          // statusBackColor="TEst"
          // statusForeColor="TEst"
          // statusDesc="TEst"
          // ScheduleStatus="TEst"
        />
      </div>
    );
  };

  let renderWorkingComponent = null;
  if (activeStep === 0) {
    renderWorkingComponent = <RenderLocation />;
  } else if (activeStep === 1) {
    renderWorkingComponent = <RenderCustomer />;
  } else if (activeStep === 2) {
    renderWorkingComponent = <RenderServiceTypes />;
  } else if (activeStep === 3) {
    renderWorkingComponent = <RenderServices />;
  } else if (activeStep === 4) {
    renderWorkingComponent = <RenderSchedule />;
  } else if (activeStep === 5) {
    renderWorkingComponent = <RenderAddress />;
  } else if (activeStep === 6) {
    renderWorkingComponent = <RenderSummary />;
  }
  return (
    <div className="col-sm-12 card m-5">
      {ssAleart}
      <div className={classes.root}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          style={{ padding: 10, color: "red" }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                Are you Sure You Want to Book ?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className="m-r-10"
                onClick={() => {
                  dispatch(
                    saveOrder(
                      selcetedCustomer.userId,
                      currentOrder.patientAddress,
                      currentOrder.serviceProfile,
                      currentOrder.package,
                      currentOrder.schedule,
                      currentOrder.location,
                      "P"
                    )
                  );
                  setSelectedLocationId();
                  setSelectedCustomer();
                  setSelectedServiceTypeCode();
                  setSelectedServiceId();
                  setSelectedSlotId();
                  setSectedPackageId();
                  setShowPakage(false);
                  setSectedPackageId();
                  setPackDesc("Select a Package Please");
                  reinitialize();
                  handleReset();
                }}
              >
                Book now
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleReset();
                  reinitialize();
                  setSelectedLocationId();
                  setSelectedCustomer();
                  setSelectedServiceTypeCode();
                  setSelectedServiceId();
                  setSelectedSlotId();
                  setSectedPackageId();
                  setShowPakage(false);
                  setSectedPackageId();
                  setPackDesc("Select a Package Please");
                }}
              >
                Reset
              </Button>
            </div>
          ) : (
            <div>
              <div style={{ minHeight: 380 }}>
                <div className="card-header p-2" style={{ borderRadius: 0 }}>
                  <div className="text-center p-2 bg-primary">
                    <h5 style={{ fontSize: 12 }} className="text-light">
                      {getStepContent(activeStep)}
                    </h5>
                  </div>

                  {/* <Header HeaderText= /> */}
                  {/* <h4>{getStepContent(activeStep)}</h4> */}
                </div>
                {renderWorkingComponent}
              </div>

              <div
                className="card-footer"
                style={{ position: "fixed", bottom: 0, width: "100%" }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button
                  disabled={
                    (activeStep === 0 && !selectedLocationId) ||
                    !selectedReference
                      ? true
                      : activeStep == 1 && !selcetedCustomer
                      ? true
                      : activeStep == 2 && !selectedServiceTypeCode
                      ? true
                      : activeStep == 3 &&
                        // !selectedServiceId &&
                        !selectedPackageId
                      ? true
                      : activeStep == 4 &&
                        // !selectedDate &&
                        !selectedSlotId
                      ? true
                      : activeStep == 5 && !selectedAddress
                      ? true
                      : false
                  }
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (activeStep === steps.length - 1) {
                      showAlert("success", "Do you Book Now?");
                    } else {
                      handleNext();
                    }
                  }}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getSteps() {
  return [
    "Area & Refrence",
    "Customer",
    "Type of Service",
    "Service",
    "Schedule",
    "Address",
    "Summary",
  ];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "Select Service Area";
    case 1:
      return "Select Customer";
    case 2:
      return "Select Service Type";
    case 3:
      return "Select Service";
    case 4:
      return "Select Schedule";
    case 5:
      return "Select Service Address";
    case 6:
      return "Order Summary";
    default:
      return "Unknown stepIndex";
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export const customerMasterColumnProperties = [
  new ColumnProperties("SrNo", true, "Sr No", true, 100),
  new ColumnProperties("userType", false, "UserType", true, 250),
  new ColumnProperties("userId", false, "User Id", true, 80),
  new ColumnProperties("Name", true, "Display Name", true),
  new ColumnProperties("userTypeRef", false, "userTypeRef", true, 350),
  new ColumnProperties("userName", false, "User Name", true, 150),
  new ColumnProperties("Gender", true, "Gender", true, 80),
  new ColumnProperties("email", true, "Email", true, 250),
  new ColumnProperties("mobile", true, "Mobile No.", true, 100),
  new ColumnProperties("password", false, "password", true, 350),
  new ColumnProperties("RegisterFrom", false, "RegisterFrom", true, 350),
  new ColumnProperties(
    "hasDemographyInfo",
    false,
    "hasDemographyInfo",
    true,
    350
  ),
];

export default OrderBookingCard;
