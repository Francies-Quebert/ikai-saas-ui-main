import React, { useState, Fragment, useEffect } from "react";
import {
  fetchOrdersPortalHome,
  acceptOrderPortal,
  rejectOrderPortal,
  cancelOrderPortal,
  sendScheduleSms,
  fetchOrdersPortalUpcoming
} from "../../../store/actions/ordersPortal";
import { useSelector, useDispatch } from "react-redux";
import OrderViewDetail from "./OrderViewDetail";
import OrderItem from "./OrderItem";
import _ from "lodash";

const OrdersDashboarUpcomingSchedule = props => {
  const data = useSelector(state => state.ordersPortal.ordersPortalUpcoming);
  const statusColor = useSelector(
    state => state.AppMain.otherMasterOrderStatus
  );
  const [foreColor, setForeColor] = useState();
  const [backColor, setBackColor] = useState();
  const [showViewDetails, setShowViewDetail] = useState(false);
  const dispatch = useDispatch();
  const [viewDetailData, setViewDetailData] = useState();

  useEffect(() => {
    dispatch(fetchOrdersPortalUpcoming());

  }, [showViewDetails, viewDetailData]);

  useEffect(() => {
    let mm = [];
    if (data) {
      data.map(item => {
        const gg = mm.findIndex(kk => kk.statusCode === item.OrderStatus);
        if (gg >= 0) {
          mm[gg].Count = mm[gg].Count + 1;
        } else {
          const backColor = statusColor
            ? statusColor.find(color => color.ShortCode === item.OrderStatus)
                .SysOption1
            : null;
          mm.push({
            statusCode: item.OrderStatus,
            statusDesc: item.statusDesc,
            Count: 1,
            BackColor: backColor
          });
        }
      });
    }
  }, [data, statusColor]);

  return (
    <Fragment>
      {!showViewDetails && (
        <div className="tab-content active default" id="tab-1">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Your Bookings</h5>
                </div>
                <div className="row">
                  {data &&
                    data
                      .filter(yy => yy.ActionRequired === "N")
                      .map(item => {
                        const colVal = statusColor
                          ? statusColor.find(
                              col => col.ShortCode === item.OrderStatus
                            )
                          : null;
                        return (
                          <div className="col-sm-6">
                          <OrderItem
                            data={item}
                            statusForeColor={colVal ? colVal.SysOption2 : ""}
                            statusBackColor={colVal ? colVal.SysOption1 : ""}
                            onViewDetailClick={() => {
                              setShowViewDetail(!showViewDetails);
                              setViewDetailData([item]);
                              setForeColor(colVal ? colVal.SysOption2 : "");
                              setBackColor(colVal ? colVal.SysOption1 : "");
                            }}
                          /></div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewDetailData && showViewDetails && (
        <OrderViewDetail
          data={viewDetailData[0]}
          OrderId={viewDetailData[0].orderid}
          statusBackColor={backColor}
          statusForeColor={foreColor}
          OnBookingAccepted={() => {
            dispatch(acceptOrderPortal(viewDetailData[0].orderid));
            setShowViewDetail(!showViewDetails);
          }}
          OnBookingRejected={() => {
            dispatch(rejectOrderPortal(viewDetailData[0].orderid));
            setShowViewDetail(!showViewDetails);
          }}
          onBookingCanceled={() => {
            dispatch(cancelOrderPortal(viewDetailData[0].orderid));
            setShowViewDetail(!showViewDetails);
          }}
          onBookingRescheduled={() => {
            setShowViewDetail(!showViewDetails);
          }}
          OnBackPress={() => {
            setShowViewDetail(!showViewDetails);
            setViewDetailData();
          }}
          SendSMS={() => {
            dispatch(sendScheduleSms(viewDetailData[0].orderid));
          }}
        />
      )}
    </Fragment>
  );
};

export default OrdersDashboarUpcomingSchedule;
