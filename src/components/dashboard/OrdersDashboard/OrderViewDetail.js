import React, { Fragment, useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import OrderScheduleVisits from "./OrderSchedulesVisits";
import {
  fetchOrderDetail,
  acceptOrderPortal,
  rejectOrderPortal,
  cancelOrderPortal,
} from "../../../store/actions/ordersPortal";
import AppLoader from "../../common/AppLoader";
import { reInitialize } from "../../../store/actions/currentTran";
import { hasRight } from "../../../shared/utility";

const OrderViewDetail = (props) => {
  
  const dispatch = useDispatch();
  const [ssAleart, setSsAlert] = useState();
  const [slotModal, setSlotModal] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const appMain = useSelector(state => state.AppMain);
  // const SlotsMap = useSelector(state => state.AppMain.service_slot_loc_mapp);
  const currentTran = useSelector((state) => state.currentTran);
  const appPortal = useSelector((state) => state.ordersPortal);
  const slotToggle = () => {
    setSlotModal(!slotModal);
  };

  useEffect(() => {
    if (currentTran.isSuccess) {
      dispatch(reInitialize());
      dispatch(fetchOrderDetail(props.OrderId));
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);


  // let avalibleSlots = [];
  // appMain.slots.map(slot => {
  //   const arrApplicableforService = SlotsMap.filter(
  //     iiii =>
  //       iiii.ServiceId === 1 && iiii.LocationId === 1 && iiii.SlotId === slot.Id
  //   );
  //   if (arrApplicableforService.length > 0) {
  //     avalibleSlots.push(slot);
  //   }
  // });

  useEffect(() => {
    dispatch(fetchOrderDetail(props.OrderId));
  }, []);

  const showAlert = (actiontype, message) => {
    setSsAlert(
      <SweetAlert
        showCancel
        confirmBtnText="Continue"
        title="Are you sure?"
        onCancel={() => setSsAlert()}
        onConfirm={() => {
          setSsAlert();
          if (actiontype === "accept") {
            dispatch(acceptOrderPortal(props.OrderId));
            // props.OnBookingAccepted();
            props.OnBackPress();
          } else if (actiontype === "reject") {
            dispatch(rejectOrderPortal(props.OrderId));
            // props.OnBookingRejected();
            props.OnBackPress();
          } else if (actiontype === "cancel") {
            dispatch(cancelOrderPortal(props.OrderId));
            // props.onBookingCanceled();
            props.OnBackPress();
          }
        }}
      >
        {message}
      </SweetAlert>
    );
  };

  let renderContent = null;
  if (appPortal.currentOrderViewDetail) {
    renderContent = (
      <>
        <div className="card col-xl-12 m-5">
          <div className="blog-box blog-list row">
            <div
              className="ribbon ribbon-right ribbon-right ribbon-success"
              style={{
                backgroundColor: appPortal.currentOrderViewDetail.StsBackColor,
                color: appPortal.currentOrderViewDetail.StsForeColor,
              }}
            >
              {appPortal.currentOrderViewDetail.statusDesc}
            </div>
            <div className="col-sm-11">
              <div className="blog-details">
                <div className="blog-date digits">
                  <span>
                    Order No. # {appPortal.currentOrderViewDetail.orderid}
                  </span>{" "}
                  &nbsp;&nbsp;
                  {appPortal.currentOrderViewDetail.orderTitle} &nbsp; / &nbsp;
                  {moment(appPortal.currentOrderViewDetail.orderdate).format(
                    "DD-MMM-YYYY"
                  )}
                </div>
                <h6>
                  {appPortal.currentOrderViewDetail.userName} (+91
                  {appPortal.currentOrderViewDetail.mobile})
                </h6>
                <div>
                  <ul className="blog-social">
                    <h6>{appPortal.currentOrderViewDetail.PaymentStatus}</h6>
                    <li>
                      {moment(
                        appPortal.currentOrderViewDetail.ScheduledFrom
                      ).format("DD-MMM-YYYY") ===
                      moment(
                        appPortal.currentOrderViewDetail.UpComingScheduleDate
                      ).format("DD-MMM-YYYY") ? (
                        <strong>
                          {" "}
                          <i>
                            {" "}
                            {` ${moment(
                              appPortal.currentOrderViewDetail
                                .UpComingScheduleDate
                            ).format("DD-MMM-YYYY")}`}
                            /{" "}
                            {
                              appPortal.currentOrderViewDetail
                                .UpComingScheduleSlot
                            }{" "}
                            / {appPortal.currentOrderViewDetail.City}
                          </i>
                        </strong>
                      ) : (
                        <>
                          {`
                      ${moment(
                        appPortal.currentOrderViewDetail.ScheduledFrom
                      ).format("DD-MMM-YYYY")}`}
                          / {appPortal.currentOrderViewDetail.slotName}/
                          <strong>
                            {" "}
                            <i>
                              {" "}
                              {` ${moment(
                                appPortal.currentOrderViewDetail
                                  .UpComingScheduleDate
                              ).format("DD-MMM-YYYY")}`}
                              /{" "}
                              {
                                appPortal.currentOrderViewDetail
                                  .UpComingScheduleSlot
                              }{" "}
                              / {appPortal.currentOrderViewDetail.City}
                            </i>
                          </strong>
                        </>
                      )}
                    </li>
                    <li>{appPortal.currentOrderViewDetail.orderTitle}</li>
                    <li>
                      {"\u20B9" +
                        " " +
                        parseFloat(
                          appPortal.currentOrderViewDetail.NetPayable
                        ).toFixed(2)}
                    </li>
                  </ul>
                  <hr />
                  {`${appPortal.currentOrderViewDetail.add1} ${
                    appPortal.currentOrderViewDetail.add2
                  }  ${
                    appPortal.currentOrderViewDetail.geoLocationName !== null
                      ? appPortal.currentOrderViewDetail.geoLocationName
                      : ""
                  } (${appPortal.currentOrderViewDetail.City} - ${
                    appPortal.currentOrderViewDetail.Pin
                  })`}

                  <hr />
                  <div className="card-body btn-showcase p-0 p-b-15">
                    <button
                      className="btn btn-square btn-info btn-sm m-5"
                      type="button"
                      onClick={props.OnBackPress}
                    >
                      Back
                    </button>
                    {appPortal.currentOrderViewDetail.IsShowAccept === "Y" && (
                      <button
                        className="btn btn-square btn-success btn-sm m-5"
                        type="button"
                        onClick={() =>
                          showAlert(
                            "accept",
                            "Do you want to accept this booking"
                          )
                        }
                        disabled={hasRight(currentTran.moduleRights, "ACCEPT")}
                      >
                        Accept
                      </button>
                    )}

                    {appPortal.currentOrderViewDetail.IsShowReject === "Y" && (
                      <button
                        className="btn btn-square btn-danger btn-sm m-5"
                        type="button"
                        onClick={props.OnBookingRejected}
                        onClick={() =>
                          showAlert(
                            "reject",
                            "Do you want to reject this booking"
                          )
                        }
                        disabled={hasRight(currentTran.moduleRights, "REJECT")}
                      >
                        Reject
                      </button>
                    )}

                    {appPortal.currentOrderViewDetail.IsShowCancel === "Y" && (
                      <button
                        className="btn btn-square btn-danger btn-sm m-5"
                        type="button"
                        onClick={() => {
                          showAlert(
                            "cancel",
                            "Do you want to cancel this booking"
                          );
                        }}
                        disabled={hasRight(currentTran.moduleRights, "CANCEL")}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {appPortal.currentOrderViewDetail.IsShowShcedule === "Y" && (
          <div className="col-sm-12">
            <OrderScheduleVisits OrderId={props.OrderId} />
          </div>
        )}
      </>
    );
  } else {
    renderContent = <AppLoader />;
  }

  return (
    <Fragment>
      {ssAleart}
      {renderContent}
    </Fragment>
  );
};

export default OrderViewDetail;
