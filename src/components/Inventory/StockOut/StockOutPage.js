import { LoadingOutlined } from "@ant-design/icons";
import { Select } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchBranchMasterData } from "../../../services/branch-master";
import { fetchDeptMasterService } from "../../../services/department-master";
import AddStockForm from "./AddStockForm";
import StockOutTable from "./StockOutTable";
import { useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import {
  invGetDataTranAdjustement,
  InvGetItemBalanceStockDistinctByInwardSeq,
} from "../../../services/inventory";
import { invValidateItemCodeInTransaction } from "../../../services/opening-stock";

const StockOutPage = () => {
  const dispatch = useDispatch();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  //{ type: "ADDSTOCK", record: null }
  // const [showModal, setShowModal] = useState({ type: null, record: null });
  const [showModal, setShowModal] = useState({
    type: null,
    record: null,
  });

  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const [initialValues, setinitialValues] = useState({
    branch: null,
    department: null,
  });
  const [IsLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [prevData, setPrevData] = useState([]);

  useEffect(() => {
    // setIsLoading(true);
    dispatch(setFormCaption(110));
    // setIsLoading(true);
    let branch, depart, stkMaster;
    setTimeout(async () => {
      await fetchBranchMasterData(CompCode).then((brnh) => {
        let branchMasterActive = brnh.filter((ii) => ii.IsActive === true);
        if (brnh.length > 0 && branchMasterActive.length > 0) {
          branch = branchMasterActive[0].BranchCode;
        }
      });
      await fetchDeptMasterService(CompCode).then((dept) => {
        let deptMasterActive = dept.filter((dd) => dd.IsActive.data[0] === 1);
        if (dept.length > 0 && deptMasterActive.length > 0) {
          depart = deptMasterActive[0].DeptCode;
        }
      });

      await setinitialValues({
        branch: branch ? branch : null,
        department: depart ? depart : null,
      });
      setIsLoading(false);
    }, 100);
    return () => {};
  }, []);

  const getDtlValues = (hdrData, dtlData) => {
    return new Promise(async function (resolve, reject) {
      try {
        setIsLoading(true);
        let TempDtl = [];
        let cachedData = [];
        await dtlData.forEach(async (element) => {
          let tempCurrentStock = 0;
          let checkCachedData = cachedData.filter(
            (cc) =>
              cc.BranchCode === hdrData[0].BranchCode &&
              cc.ItemCode === element.ItemCode
          );
          let itemInfo = await invValidateItemCodeInTransaction(
            CompCode,
            element.ItemCode
          );
          if (checkCachedData.length > 0) {
            // console.log("in side cached data");
            await checkCachedData.map((row) => {
              return (tempCurrentStock =
                tempCurrentStock + parseFloat(row.BalQty));
            });
          } else {
            await InvGetItemBalanceStockDistinctByInwardSeq(
              CompCode,
              hdrData[0].BranchCode,
              element.ItemCode
            ).then(async (res) => {
              console.log(
                res,
                "responce to",
                hdrData[0].BranchCode,
                element,
                CompCode
              );
              // let lCacheData=await res.map(aa=>{return })
              await cachedData.push({
                ...itemInfo[0],
                inwardSeq: [{ ...res[0], CostRate: element.CostPrice }],
              });
              await res.map((row) => {
                return (tempCurrentStock =
                  tempCurrentStock + parseFloat(row.BalQty));
              });
              // console.log(res, "inw seq");
            });
          }
          TempDtl.push({
            ...element,
            ReceiptIssue: element.RIType,
            Qty: Math.abs(parseFloat(element.Qty)),
            isDeleted: false,
            InwardSeq: -999,
            remark: element.Remark,
            PacketNo: element.SysOption1,
            Weight: element.SysOption2,
            EstimatedSalePrice: element.SysOption3,
            Cost: parseFloat(element.CostPrice),
            key: element.SrNo,
            Type: "C",
            CurrentStock: tempCurrentStock,
            isFromDB: true,
            SysOption4: element.SysOption4,
            SysOption7: element.SysOption7,
            SysOption8: element.SysOption8,
            SysOption9: element.SysOption9,
          });
          setIsLoading(false);
          resolve({ dtlData: TempDtl, cacheData: cachedData });
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  return (
    <>
      {showModal.type === null && IsLoading === false && (
        <>
          <StockOutTable
            onAddStockClick={() => {
              setShowModal({ type: "ADDSTOCK", record: null });
            }}
            showFilter={showFilter}
            onEditClick={async (data) => {
              let tdata = await invGetDataTranAdjustement(
                CompCode,
                data.VoucherId
              );
              if (tdata) {
                let hdrData = tdata[0];
                let TempDtl = await getDtlValues(hdrData, tdata[1]);

                if (TempDtl) {
                  setPrevData(tdata[1]);
                  setShowModal({
                    type: "EDITSTOCK",
                    record: {
                      hdrData: hdrData,
                      dtlData: TempDtl.dtlData,
                      cacheData: TempDtl.cacheData,
                      prvData: TempDtl.dtlData,
                    },
                  });
                }
              }
            }}
            refreshScreen={(aa) => {
              setIsLoading(true);
              setTimeout(() => {
                setShowModal({ type: null, record: null });
                setPrevData([]);
                setIsLoading(false);
                setShowFilter(aa);
              }, 100);
            }}
            onViewClick={() => {}}
          />
        </>
      )}
      {IsLoading && (
        <div
          style={{
            height: "100%",
            display: "flex",
            backgroundColor: "#ECECEC",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingOutlined
            spin
            style={{ fontSize: 85, color: "var(--app-theme-color)" }}
          />
        </div>
      )}
      {/* <Modal
        visible={showModal.type === "ADDSTOCK"}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal({ type: null, record: null });
        }}
        className="search-customer"
        width={750}
        maskClosable={false}
        closable={false}
      > */}
      {(showModal.type === "ADDSTOCK" ||
        (showModal.type === "EDITSTOCK" && !IsLoading)) &&
        IsLoading === false && (
          <AddStockForm
            branch={initialValues.branch}
            department={initialValues.department}
            entryMode={showModal}
            onBackPress={() => {
              setIsLoading(true);
              setTimeout(() => {
                setShowModal({ type: null, record: null });
                setIsLoading(false);
                setPrevData([]);
              }, 100);
            }}
            prevData={prevData}
          />
        )}
      {/* </Modal> */}
    </>
  );
};

// const columns = [
//   { title: "Name", dataIndex: "name", key: "name" },
//   { title: "Age", dataIndex: "age", key: "age" },
//   { title: "Address", dataIndex: "address", key: "address" },
//   {
//     title: "Action",
//     dataIndex: "",
//     key: "x",
//     render: () => <a>Delete</a>,
//   },
// ];

// const data = [
//   {
//     key: 1,
//     name: "John Brown",
//     age: 32,
//     address: "New York No. 1 Lake Park",
//     description:
//       "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
//   },
//   {
//     key: 2,
//     name: "Jim Green",
//     age: 42,
//     address: "London No. 1 Lake Park",
//     description:
//       "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
//   },
//   {
//     key: 3,
//     name: "Not Expandable",
//     age: 29,
//     address: "Jiangsu No. 1 Lake Park",
//     description: "This not expandable",
//   },
//   {
//     key: 4,
//     name: "Joe Black",
//     age: 32,
//     address: "Sidney No. 1 Lake Park",
//     description:
//       "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.",
//   },
// ];
export default StockOutPage;
