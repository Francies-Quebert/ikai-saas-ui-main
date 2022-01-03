import React, { useEffect, useState } from "react";
import { Skeleton, Button, DatePicker, Drawer, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranchMasterData } from "../../../services/branch-master";
import { fetchDeptMasterService } from "../../../services/department-master";
import { setFormCaption } from "../../../store/actions/currentTran";
import INVAllTranDocViewComponent from "../../sales/CommonComponent/INVAllTranDocViewComponent";
import AdjustmentCard from "./AdjustmentCard";
import moment from "moment";
import _ from "lodash";
import {
  CheckCircleTwoTone,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AdjustmentViewTran from "../TranViewableComponents/AdjustmentViewTran";
import StockReprocessingViewTran from "../TranViewableComponents/StockReprocessingViewTran";
import {
  getReportDataAdjustment,
  getReasonsMasterData,
  getReportDataReprocessing,
} from "../../../services/inventory";
import fileDownload from "js-file-download";
import { PrintPdfOrFromElectron } from "../../../shared/utility";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AdjustmentPage = (props) => {
  const dispatch = useDispatch();
  const [BranchDept, setBranchDept] = useState();
  const [IsLoading, setIsLoading] = useState(true);
  const [EntryMode, setEntryMode] = useState();
  const [DateRange, setDateRange] = useState([moment(), moment()]);
  const [refCode, setRefCode] = useState("ALL");
  const [reasonsData, setReasonsData] = useState([]);
  const [salesDrawer, setSalesDrawer] = useState({ visible: false, data: {} });

  const l_loginUserName = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const [inputParam, setInputParam] = useState({
    TranType: props.TranType,
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    RefCode: refCode,
    CurrentUserName: l_loginUserName,
  });

  useEffect(() => {
    dispatch(
      setFormCaption(
        props.TranType === "ADJS" ? 104 : props.TranType === "REPRO" ? 105 : 106
      )
    );
    initialLoad();

    getReasonsMasterData(CompCode).then((res) => {
      setReasonsData(res);
    });
    return () => {};
  }, []);

  const initialLoad = async () => {
    let branch;
    let depart;
    await fetchBranchMasterData(CompCode).then(async (brnh) => {
      if (brnh.length > 0) {
        branch = await brnh.filter((ii) => ii.IsActive === true)[0];
      }
    });
    await fetchDeptMasterService(CompCode).then(async (dept) => {
      if (dept.length > 0) {
        depart = await dept.filter((dd) => dd.IsActive.data[0] === 1)[0];
      }
    });
    console.log(depart);
    setBranchDept({ branch: branch, dept: depart });
    setIsLoading(false);
  };

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
                // backgroundColor: "#FFF",
                // padding: "5px 10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    padding: "0px 8px 0px 0px",
                    color: "#000",
                    alignSelf: "center",
                  }}
                >
                  Select Date Range :
                </div>
                <RangePicker
                  size="small"
                  style={{ marginRight: 5 }}
                  onChange={(val, aa) => {
                    setDateRange(val !== null ? [...val] : [null, null]);
                  }}
                  format={l_ConfigDateFormat.value1}
                  defaultValue={DateRange}
                />
                <div
                  style={{
                    padding: "0px 8px 0px 0px",
                    color: "#000",
                    alignSelf: "center",
                  }}
                >
                  Select Reason :
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
                  {reasonsData.length > 0 &&
                    reasonsData.map((cc) => {
                      return (
                        <Option value={cc.ShortCode} key={cc.ShortCode}>
                          {cc.MasterDesc}
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
                  style={{ alignSelf: "center" }}
                  icon={<SearchOutlined />}
                  disabled={
                    !DateRange[0] ||
                    !DateRange[1] | _.includes(["", undefined], refCode)
                  }
                  onClick={() => {
                    setInputParam({
                      TranType: props.TranType,
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
                  Create
                  {props.TranType === "ADJS"
                    ? " Adjustment"
                    : props.TranType === "REPRO"
                    ? " Re-Processing"
                    : ""}
                </Button>
              </div>
            </div>

            <INVAllTranDocViewComponent
              viewParam={inputParam}
              onViewClick={(data) => {
                setSalesDrawer({
                  visible: data.visible,
                  data: data.TranId,
                });
              }}
              onDownloadPdf={(record) => {
                let dataType = "pdf";
                if (window.electron) {
                  dataType = "html";
                }
                if (props.TranType === "ADJS") {
                  getReportDataAdjustment(
                    CompCode,
                    record.TranId,
                    dataType
                  ).then((res) => {
                    if (res) {
                      PrintPdfOrFromElectron(res, `${record.TranNo}`, dataType);
                    }
                  });
                } else if (props.TranType === "REPRO") {
                  getReportDataReprocessing(
                    CompCode,
                    record.TranId,
                    dataType
                  ).then((res) => {
                    if (res) {
                      PrintPdfOrFromElectron(res, `${record.TranNo}`, dataType);
                    }
                  });
                }
              }}
            />
          </>
        )}

        {salesDrawer.visible && salesDrawer.data && (
          <>
            <Drawer
              placement="right"
              closable={true}
              width={"50%"}
              bodyStyle={{ padding: 0 }}
              onClose={() => {
                setSalesDrawer({ visible: false, data: {} });
              }}
              visible={salesDrawer.visible}
            >
              {props.TranType === "ADJS" ? (
                <AdjustmentViewTran
                  VoucherId={salesDrawer.data}
                  onClose={() => {
                    setSalesDrawer({ visible: false, data: {} });
                  }}
                />
              ) : props.TranType === "REPRO" ? (
                <StockReprocessingViewTran
                  VoucherId={salesDrawer.data}
                  onClose={() => {
                    setSalesDrawer({ visible: false, data: {} });
                  }}
                />
              ) : (
                " "
              )}
            </Drawer>
          </>
        )}

        {EntryMode === "A" && (
          <>
            {IsLoading && (
              <div style={{ backgroundColor: "#FFF", padding: "5px 10px" }}>
                <Skeleton active />
              </div>
            )}
            {!IsLoading && EntryMode && BranchDept && (
              <div>
                <AdjustmentCard
                  TranType={props.TranType}
                  branch={BranchDept.branch}
                  dept={BranchDept.dept}
                  onBackPress={() => {
                    setEntryMode();
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdjustmentPage;
