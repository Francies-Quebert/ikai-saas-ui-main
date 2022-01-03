import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, DatePicker, Drawer, Table, Select } from "antd";
import { setFormCaption } from "../../../store/actions/currentTran";
import PurchaseReturnCard from "./PRComponent/PurchaseReturnCard";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import INVAllTranDocViewComponent from "../../sales/CommonComponent/INVAllTranDocViewComponent";
import { fetchSupplierMasterComp } from "../../../services/supplier-master-comp";
const { Option } = Select;
const { RangePicker } = DatePicker;

const PurchaseReturn = () => {
  const dispatch = useDispatch();
  const [EntryMode, setEntryMode] = useState();
  const [DateRange, setDateRange] = useState([moment(), moment()]);
  const [refCode, setRefCode] = useState("ALL");
  const [supplierData, setSupplierData] = useState([]);
  const l_loginUserName = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [drawer, setDrawer] = useState({ visible: false, data: null });

  const [inputParam, setInputParam] = useState({
    TranType: "PURRTN",
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    RefCode: refCode,
    CurrentUserName: l_loginUserName,
  });

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(setFormCaption(111));
    fetchSupplierMasterComp(CompCode).then((res) => {
      setSupplierData(res.filter((aa) => aa.IsActive === true));
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
                  Select Supplier :
                </div>
                <Select
                  size="small"
                  allowClear
                  showSearch
                  showArrow
                  placeholder="Select Reason"
                  style={{ width: 200, marginRight: 5 }}
                  onChange={(val) => {
                    setRefCode(val);
                  }}
                  value={refCode}
                >
                  {supplierData.length > 0 &&
                    supplierData.map((cc) => {
                      return (
                        <Option value={cc.PartyId} key={cc.PartyId} option={cc}>
                          {cc.suppName} ({cc.SuppTypeDesc})
                        </Option>
                      );
                    })}
                  <Option value={"ALL"} key={"ALL"}>
                    All
                  </Option>
                </Select>
                <Button
                  type="primary"
                  size="small"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    setInputParam({
                      TranType: "PURRTN",
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
                  Create Purchase-Return
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
          <PurchaseReturnCard
            onBackPress={() => {
              setEntryMode();
            }}
            entryMode={"A"}
            // showBatch={showBatch.value1}
          />
        )}

        {/* <>
          <Drawer
            placement="right"
            closable={true}
            width={window.innerWidth > 800 ? "50%" : "100%"}
            bodyStyle={{ padding: 0 }}
            onClose={() => {
              setDrawer({ visible: false, data: {} });
            }}
            visible={drawer.visible}
          ></Drawer>
        </> */}
      </div>
    </>
  );
};

export default PurchaseReturn;
