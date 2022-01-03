import React, { useState, Fragment, useEffect } from "react";
import OrderItem from "./OrderItem";
import OrderViewDetail from "./OrderViewDetail";
import { Chart } from "react-google-charts";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOrdersPortalHome,
  acceptOrderPortal,
  rejectOrderPortal,
  cancelOrderPortal,
  sendScheduleSms
} from "../../../store/actions/ordersPortal";
import _ from "lodash";
import { toast } from "react-toastify";
import { reInitialize } from "../../../store/actions/currentTran";

const OrdersDashboardHome = props => {
  const data = useSelector(state => state.ordersPortal.ordersPortalHome);
  const statusColor = useSelector(
    state => state.AppMain.otherMasterOrderStatus
  );
  const [chartData, setChartData] = useState({ data: [], color: [] });
  const dispatch = useDispatch();
  const currTran = useSelector(state => state.currentTran);
  const [viewDetailOrderId, setViewDetailOrderId] = useState()
  useEffect(() => {
    dispatch(fetchOrdersPortalHome());
  }, [viewDetailOrderId]);

  useEffect(() => {
    if (currTran.isSuccess) {
      toast.success("Action Completed successfully...!");
    }
    dispatch(reInitialize())
  }, [currTran.isSuccess]); 

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
    let dddd = [["Task", "Status wise Booking"]];
    let cccc = [];

    mm.map(ji => {
      dddd.push([ji.statusDesc, ji.Count]);
      cccc.push(ji.BackColor);
    });
    if (dddd.length > 1) {
      setChartData({ data: _.slice(dddd, 0), color: _.slice(cccc, 0) });
    }
 }, [data, statusColor]);
   return (
    <Fragment>
      {!viewDetailOrderId && (
        <div className="tab-content active default" id="tab-1">
          <div className="row">
            <div className="col-sm-6 p-10">
              <div className="card">
                {chartData && (
                  <Chart
                    width={"100%"}
                    height={"400px"}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={chartData.data}
                    options={{
                      title: "Open Booking Status Summary",
                      colors: chartData.color
                    }}
                    rootProps={{ "data-testid": "1" }}
                  />
                )}
              </div>
              <div>
                <div className="card">
                  <div className="card-header">
                    <h5>Action Required</h5>
                  </div>
                  {data &&
                    data
                      .filter(yy => yy.ActionRequired === "Y")
                      .map(item => {
                        const colVal = statusColor
                          ? statusColor.find(
                              col => col.ShortCode === item.OrderStatus
                            )
                          : null;
                        return (
                          <OrderItem
                            key={item.orderid}
                            data={item}
                            statusForeColor={colVal ? colVal.SysOption2 : ""}
                            statusBackColor={colVal ? colVal.SysOption1 : ""}
                            onViewDetailClick={() => {
                              setViewDetailOrderId(item.orderid);
                            }}
                          />
                        );
                      })}
                </div>
              </div>
            </div>

            <div className="col-sm-6 p-10">
              <div className="card">
                <div className="card-header">
                  <h5>Your Bookings</h5>
                </div>
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
                        <OrderItem
                        key={item.orderid}
                          data={item}
                          statusForeColor={colVal ? colVal.SysOption2 : ""}
                          statusBackColor={colVal ? colVal.SysOption1 : ""}
                          onViewDetailClick={() => {
                            setViewDetailOrderId(item.orderid)
                          }}
                        />
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      )}
      {viewDetailOrderId && (
        <OrderViewDetail 
          OrderId = {viewDetailOrderId}
          OnBackPress={() => {
            setViewDetailOrderId(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default OrdersDashboardHome;
