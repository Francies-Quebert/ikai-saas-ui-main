import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, DatePicker, Drawer, Table, Select, InputNumber } from "antd";
import { setFormCaption } from "../../../store/actions/currentTran";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import SaleReturnCard from "./SaleReturnCard";
import INVAllTranDocViewComponent from "../../sales/CommonComponent/INVAllTranDocViewComponent";
import { getDataCustomers } from "../../../services/user-master";
import _ from "lodash";
const { Option } = Select;

const { RangePicker } = DatePicker;

const SaleReturn = () => {
  const dispatch = useDispatch();
  const l_loginUserName = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [EntryMode, setEntryMode] = useState();
  const [DateRange, setDateRange] = useState([moment(), moment()]);
  const [refCode, setRefCode] = useState("ALL");
  const [drawer, setDrawer] = useState({ visible: false, data: null });
  const [customerData, setCustomerData] = useState([]);
  const [inputParam, setInputParam] = useState({
    TranType: "SALERTN",
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    RefCode: refCode,
    CurrentUserName: l_loginUserName,
  });

  useEffect(() => {
    dispatch(setFormCaption(115));
    getDataCustomers(CompCode).then((res) => {
      setCustomerData(res);
    });
  }, []);

  return (
    <>
      <div
        style={{
          height: "100%",
          position: "relative",
        }}
      >
        {!EntryMode && (
          <>
            <div
              className="card-sales"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ padding: "0px 8px 4px 0px", color: "#000" }}>
                  Select Date Range :
                </div>
                <RangePicker
                  size="small"
                  style={{ marginRight: 5 }}
                  onChange={(val, aa) => {
                    setDateRange(val !== null ? [...val] : [null, null]);
                  }}
                  defaultValue={DateRange}
                />
                <div
                  style={{
                    padding: "0px 8px 0px 0px",
                    color: "#000",
                    alignSelf: "center",
                  }}
                >
                  Select Customer :
                </div>
                <Select
                  size="small"
                  allowClear
                  showSearch
                  showArrow
                  placeholder="Select Customer"
                  style={{ width: 200, marginRight: 5 }}
                  onChange={(val) => {
                    setRefCode(val);
                  }}
                  value={refCode}
                >
                  {customerData.length > 0 &&
                    customerData.map((cc) => {
                      return (
                        <Option value={cc.UserId} key={cc.UserId}>
                          {cc.Name} ({cc.mobile})
                        </Option>
                      );
                    })}
                  <Option value={"ALL"} key={"ALL"}>
                    All
                  </Option>
                </Select>
                <Button
                  type="primary"
                  ref={searchRef}
                  size="small"
                  icon={<SearchOutlined />}
                  disabled={
                    !DateRange[0] ||
                    !DateRange[1] | _.includes(["", undefined], refCode)
                  }
                  onClick={() => {
                    setInputParam({
                      TranType: "SALERTN",
                      FromDate: moment(DateRange[0]).format("YYYY-MM-DD"),
                      ToDate: moment(DateRange[1]).format("YYYY-MM-DD"),
                      RefCode: refCode,
                      CurrentUserName: l_loginUserName,
                    });
                  }}
                >
                  Search
                </Button>
              </div>
              <div style={{ display: "flex", padding: "0px 3px" }}>
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  type="primary"
                  onClick={() => {
                    setEntryMode("A");
                  }}
                >
                  Create Sale-Return
                </Button>
              </div>
            </div>

            <INVAllTranDocViewComponent
              viewParam={inputParam}
              isEdit={false}
              onEditPress={async (data) => {}}
              onViewClick={(data) => {
                setDrawer({
                  visible: data.visible,
                  data: data.TranId,
                });
              }}
              onDownloadPdf={(record) => {}}
            />
          </>
        )}

        {EntryMode && (
          <>
            <SaleReturnCard
              onBackPress={() => {
                setEntryMode();
              }}
              entryMode={"A"}
              // showBatch={showBatch.value1}
            />
          </>
        )}
      </div>
    </>
  );
};

export default SaleReturn;
