import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersPortalHome } from "../../../store/actions/ordersPortal";
import OrderItem from "../OrdersDashboard/OrdersCard";

const OrderBookingRecentOrders = props => {
  const data = useSelector(state => state.ordersPortal.ordersPortalHome);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrdersPortalHome());
  }, []);
  const statusColor = useSelector(
    state => state.AppMain.otherMasterOrderStatus
  );
  const [viewDetailData, setViewDetailData] = useState();
  const [foreColor, setForeColor] = useState();
  const [backColor, setBackColor] = useState();
  const [showViewDetail, setShowViewDetail] = useState();
  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header b-l-primary" style={{ padding: 10 }}>
          <h5>RECENT ORDERS</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive active-order-table">
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
                      data={item}
                      statusForeColor={colVal ? colVal.SysOption2 : ""}
                      statusBackColor={colVal ? colVal.SysOption1 : ""}
                      onViewDetailClick={() => {
                        setViewDetailData([item]);
                        setShowViewDetail(!showViewDetail);
                        setForeColor(colVal ? colVal.SysOption2 : "");
                        setBackColor(colVal ? colVal.SysOption1 : "");
                      }}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBookingRecentOrders;
