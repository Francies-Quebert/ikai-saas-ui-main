import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import ServiceMasterCard from "./ServiceMaster/ServiceMasterCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ServiceMaster = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFormCaption("Administrator", "Service Master"));
  }, []);
  return (
    <Fragment>
      {/* <Breadcrumb parent="Dashboard" title="Service  Master" /> */}
      <ServiceMasterCard />
    </Fragment>
  );
};

export default ServiceMaster;
