import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SelectableItem from "./OrderBookingMain/SelectableItem";
import ServiceItemComponent from "./Bookings/ServiceItemSelect";
import AddressSelectComponent from "./Bookings/AddressSelect";
import PackageSelectComponent from "./Bookings/PackageSelect";
import ScheduleSelectComponent from "./Bookings/ScheduleSelect";
import StepZilla from "react-stepzilla";
import AddressCardComponent from "./Bookings/AddressCard";
import BookingSummaryComponent from "./Bookings/BookingSummary";


const ServiceType = props => {
  const [selectedServiceType, setSelectedServiceType] = useState("");
  return (
    <div className="row">
      <div className="col-md-12">
        <Header HeaderText="Please Select Your Service" />
      </div>
      {props.data &&
        props.data.map(item => (
          <div className="col-md-6">
            <SelectableItem
              OnServiceSelect={() => {
                setSelectedServiceType(item.serviceTypeCode);
              }}
              isSelected={item.serviceTypeCode === selectedServiceType}
              ServiceImg={item.serviceTypeImageURI}
              ServiceTitle={item.serviceTypeTitle}
              ServiceDesc={item.serviceTypeDesc}
            />
          </div>
        ))}
    </div>
  );
};
const ServiceItem = props => {
  return (
    <div className="row">
      <div className="col-md-12">
        <Header HeaderText="Please Select Your Service Type" />
      </div>
      <div className="col-md-12">
        <ServiceItemComponent
          title="Ro Repair and Service"
          desc="Service for Ro Reparing"
          amount={199}
        />
      </div>
    </div>
  );
};

const PackageSelect = props => {
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <Header HeaderText="Please Select Your Package" />
        </div>
        <PackageSelectComponent
          title="Package Title"
          desc="Package Description"
          amount={250}
        />
        <PackageSelectComponent
          title="Package Title"
          desc="Package Description"
          amount={250}
        />
      </div>
    </div>
  );
};

const AddressSelect = props => {
  const [showAddAddress, setShowAddAddress] = useState();
  const [selectedAddress, setSelectedAddress] = useState("");
  return (
    <div className="row">
      <div className="col-md-12">
        <Header HeaderText="Please Select Your Service Type" />
      </div>
      
      {showAddAddress && (
        <div className="col-md-12">
          <AddressSelectComponent 
          onAddressSave={()=>{setShowAddAddress(!showAddAddress)
          setSelectedAddress()
          }} />
        </div>
      )}

      {!showAddAddress && (
        <div className="col-md-12 row">
          <div className="col-md-6">
            <AddressCardComponent building="Nisl malesuad"
            isSelected={selectedAddress==="TEST"}
            onServiceSelect={()=>{
              setSelectedAddress("TEST")
            }} landmark="lorem ipsum" detail="Duis nec nulla turpis. Nulla lacinia laoreet odio, non lacinia
              nisl malesuada vel." />
          </div>
          <div className="col-md-6">
            <AddressCardComponent
            isSelected={selectedAddress==="ADD"}
            isShowAddNew={true} 
            onAddNewClick={()=> {
              setSelectedAddress("ADD")
            setShowAddAddress(!showAddAddress);
            
          }} />
          </div>
        </div>
      )}
    </div>
  );
};

const ScheduleSelect = props => {
  return (
    <div className="row">
      <div className="col-md-12">
        <Header HeaderText="Please Select Your Schedule" />
      </div>
      <ScheduleSelectComponent />
    </div>
  );
};

const BookingSummary = props => {
  return (
    <div className="row">
      <div className="col-md-12">
        <Header HeaderText="Your Booking Summary" />
      </div>
      <BookingSummaryComponent />
    </div>
  );
};

const Header = props => {
  return (
    <div className="card-header text-center p-2 bg-primary ">
      <h5 style={{ fontSize: 12 }}>{props.HeaderText}</h5>
    </div>
  );
};

const BookingScreen = () => {
  const data = useSelector(state =>
    state.AppMain.serviceTypes
      ? state.AppMain.serviceTypes.filter(item => item.IsActive === true)
      : null
  );

  const steps = [
    { name: "Service", component: <ServiceType data={data} /> },
    { name: "Type", component: <ServiceItem /> },
    { name: "Address", component: <AddressSelect /> },
    { name: "Schedule", component: <ScheduleSelect /> },
    { name: "Summary", component: <BookingSummary /> }
  ];

  return (
    <Fragment>
      {/* <Breadcrumb parent="Dashboard" title="University" /> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <StepZilla
                  steps={steps}
                  showSteps={true}
                  showNavigation={true}
                  stepsNavigation={true}
                  prevBtnOnLastStep={true}
                  dontValidate={true}
                  hocValidationAppliedTo={[4]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h5>Add Service</h5>
              </div>
            </div>
            <div className="row">
              <ServiceItemComponent />
              <PackageSelectComponent />
              <AddressSelectComponent />
              <ScheduleSelectComponent />
            </div>
          </div>
        </div>
      </div> */}
    </Fragment>
  );
};

export default BookingScreen;
