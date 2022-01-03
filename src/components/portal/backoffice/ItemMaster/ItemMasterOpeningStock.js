import React, { useState, useEffect } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Space,
  Table,
} from "antd";
import { EditableCell } from "../../../common/AntEditedCell";
import OpeningStockCard from "./OpeningStockCard";
import {
  getInvGetOpeningStock,
  getInvItemMasterData,
} from "../../../../services/opening-stock";
import { hasRight } from "../../../../shared/utility";
import { useSelector } from "react-redux";

let TempData = [];

export const getOpeningStockData = () => {
  return TempData;
};
const ItemMasterOpeningStock = (props) => {
  const l_INV_TYPE = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "INV_TYPE")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (props.entryMode) {
      getInvGetOpeningStock(
        CompCode,
        props.branchCode,
        props.deptCode,
        props.ItemCode !== null ? props.ItemCode : ""
      ).then(async (res) => {
        let tempData = [];
        if (res.length > 0) {
          res.map((aa) => {
            return tempData.push({
              Qty: aa.Qty,
              MRP: aa.MRP,
              Sale: aa.SaleRate,
              Cost: aa.Rate,
              key: aa.key,
              BranchCode: aa.BranchCode,
              DeptCode: aa.DeptCode,
              InwardSeq: aa.InwardSeq,
              IsAllowModification: aa.IsAllowModification,
              CompCode: aa.CompCode,
              isDeleted: false,
              isDirty: false,
              isFromDatabase: true,
            });
          });
        } else {
          tempData = [
            {
              Qty: null,
              MRP: null,
              Sale: null,
              Cost: null,
              key: 1,
              isDeleted: false,
              BranchCode: props.branchCode,
              DeptCode: props.deptCode,
              isDirty: true,
              isFromDatabase: false,
            },
          ];
        }
        setData([...tempData]);
      });
    } else {
      setData([
        {
          Qty: null,
          MRP: null,
          Sale: null,
          Cost: null,
          key: 1,
          isDeleted: false,
          BranchCode: props.branchCode,
          DeptCode: props.deptCode,
          isDirty: true,
          isFromDatabase: false,
        },
      ]);
    }
    // console.log(hasRight(props.opStkRight[0].Rights, "ADD"), "imitrial opn");
  }, []);

  useEffect(() => {
    TempData = data;
    // console.log(data, "c effect");
  }, [data]);
  return (
    <>
      <Card bodyStyle={{ padding: 5 }} style={{ borderBottom: 0 }}>
        <div style={{ margin: "5px 0px" }}>
          <span style={{ marginRight: 5 }}>
            Branch :
            <span
              style={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #d9d9d9",
                borderRadius: 2,
                // color: "#000",
                padding: "2px 4px",
                margin: "0px 5px",
              }}
            >
              {props.branch}
            </span>
          </span>
          <span>
            Department :
            <span
              style={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #d9d9d9",
                borderRadius: 2,
                // color: "#000",
                padding: "2px 4px",
                margin: "0px 5px",
              }}
            >
              {props.dept}
            </span>
          </span>
          {l_INV_TYPE.value1 === "Y" && (
            <span>
              <Button
                size="small"
                type="primary"
                style={{ marginLeft: 5 }}
                disabled={hasRight(
                  props.opStkRight.length ? props.opStkRight[0].Rights : [],
                  "ADD"
                )}
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  if (
                    data.filter(
                      (q) =>
                        (q.Qty === null || q.Qty < 0) && q.isDeleted === false
                    ).length > 0 ||
                    data.filter(
                      (q) =>
                        (q.MRP === null || q.MRP < 0) && q.isDeleted === false
                    ).length > 0 ||
                    data.filter(
                      (q) =>
                        (q.Cost === null || q.Cost < 0) && q.isDeleted === false
                    ).length > 0 ||
                    data.filter(
                      (q) =>
                        (q.Sale === null || q.Sale < 0) && q.isDeleted === false
                    ).length > 0
                  ) {
                    message.error("Opening Stock Field Cannot Be Empty");
                  } else {
                    setData((old) => {
                      return [
                        ...old,
                        {
                          Qty: null,
                          MRP: null,
                          Sale: null,
                          Cost: null,
                          key: old.length + 1,
                          isDeleted: false,
                          BranchCode: props.branchCode,
                          DeptCode: props.deptCode,
                          isDirty: true,
                          isFromDatabase: false,
                        },
                      ];
                    });
                  }
                }}
              >
                Add
              </Button>
            </span>
          )}
        </div>
        {/* <Divider style={{ margin: 0 }} /> */}
        <div
          className="style-2"
          style={{ width: "calc(100%)", overflowX: "auto", display: "flex" }}
        >
          {data.length > 0 &&
            data
              .filter((aa) => aa.isDeleted === false)
              .map((dd, inx) => {
                // console.log(
                //   hasRight(
                //     props.opStkRight.length ? props.opStkRight[0].Rights : [],
                //     "EDIT"
                //   ),
                //   dd.IsAllowModification
                //     ? dd.IsAllowModification === "Y"
                //       ? false
                //       : true
                //     : false,
                //   "eeee dddd iii t"
                // );
                return (
                  <OpeningStockCard
                    INVTYPE={l_INV_TYPE}
                    key={inx}
                    editRights={
                      hasRight(
                        props.opStkRight.length
                          ? props.opStkRight[0].Rights
                          : [],
                        "EDIT"
                      ) ||
                      (dd.IsAllowModification
                        ? dd.IsAllowModification === "Y"
                          ? false
                          : true
                        : false)
                    }
                    deleteRights={
                      hasRight(
                        props.opStkRight.length
                          ? props.opStkRight[0].Rights
                          : [],
                        "DELETE"
                      ) ||
                      (dd.IsAllowModification && dd.IsAllowModification !== "Y")
                        ? true
                        : false
                    }
                    showDeleteButton={true}
                    // key={dd.key}
                    datasource={dd}
                    onDeleteCLick={async () => {
                      if (data.length > 1) {
                        let existingData = data;
                        let Index = existingData.findIndex((ff) => {
                          return ff.key === dd.key;
                        });
                        existingData[Index].isDeleted = true;
                        // console.log(existingData, "deleteing");
                        setData([...existingData]);
                      } else {
                        message.error("Opening Stock Cannot Be Empty");
                      }
                    }}
                    onQtyChange={(val) => {
                      let existingData = data;
                      let Index = existingData.findIndex((ff) => {
                        return ff.key === dd.key;
                      });
                      existingData[Index].Qty = val;
                      existingData[Index].isDirty = true;
                      setData(existingData);
                    }}
                    onMrpChange={(val) => {
                      let existingData = data;
                      let Index = existingData.findIndex((ff) => {
                        return ff.key === dd.key;
                      });
                      existingData[Index].MRP = val;
                      existingData[Index].isDirty = true;
                      setData(existingData);
                    }}
                    onSaleChange={(val) => {
                      let existingData = data;
                      let Index = existingData.findIndex((ff) => {
                        return ff.key === dd.key;
                      });
                      existingData[Index].Sale = val;
                      existingData[Index].isDirty = true;
                      setData(existingData);
                    }}
                    onCostChange={(val) => {
                      if (l_INV_TYPE.value1 === "Y") {
                        let existingData = data;
                        let Index = existingData.findIndex((ff) => {
                          return ff.key === dd.key;
                        });
                        existingData[Index].Cost = val;
                        existingData[Index].isDirty = true;
                        setData(existingData);
                      } else {
                        let existingData = data;
                        let Index = existingData.findIndex((ff) => {
                          return ff.key === dd.key;
                        });
                        existingData[Index].Cost = val;
                        existingData[Index].Sale = val;
                        existingData[Index].MRP = val;
                        existingData[Index].isDirty = true;
                        setData(existingData);
                      }
                    }}
                  />
                );
              })}
        </div>
        <Divider style={{ margin: 0 }} />
      </Card>
    </>
  );
};

export default ItemMasterOpeningStock;
