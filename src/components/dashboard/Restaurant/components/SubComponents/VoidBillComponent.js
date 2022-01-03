import { Col, Row, Table, Skeleton, Button, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import {
  getInvoiceHdr,
  getRestaurantInvoiceDtl,
  insInvoiceDTL,
  restaurantUptInvoiceHdr,
  restaurantPOSVoidBill,
  updtRestaurantPOSKOTDtlStatus,
  uptRestarantPosKOTHdrStatus,
  saveTableStatus,
} from "../../../../../services/restaurant-pos";
import QuantityComponent from "./QuantityComponent";
import _ from "lodash";
import {
  CloseOutlined,
  DeleteTwoTone,
  FileAddOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { DivIcon } from "leaflet";
import DisplayVoidBillCalcData from "./DisplayVoidBillCalcData";
import { useSelector } from "react-redux";
import DisplayVoidBillFinalCalcData from "./DisplayVoidBillFinalCalcData";

const VoidBillComponent = (props) => {
  const [InvoiceDtl, setInvoiceDtl] = useState([]);
  const [InvoiceHdr, setInvoiceHdr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returnSummary, setReturnSummary] = useState({
    SubTotal: 0,
    Qty: 0,
    Disc: 0,
    TaxAmount: 0,
    RoundOff: 0,
    NetPayable: 0,
  });
  const [finalBillSummary, setFinalBillSummary] = useState({
    SubTotal: 0,
    Qty: 0,
    Disc: 0,
    TaxAmount: 0,
    RoundOff: 0,
    NetPayable: 0,
  });
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const appconfigs = useSelector((state) => state.AppMain.appconfigs);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const columns = [
    {
      title: "Sr No",
      dataIndex: "SrNo",
      align: "center",
      width: "50px",
    },

    {
      title: "Item Name",
      dataIndex: "ItemName",
    },
    {
      title: "Item Code",
      dataIndex: "ItemCode",
      align: "center",
    },
    {
      title: "Qty",
      dataIndex: "Qty",
      align: "center",
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      align: "center",
    },
    {
      title: "Discount",
      dataIndex: "Disc",
      align: "center",
    },
    {
      title: "Tax Amount",
      render: (value, row, index) => {
        let tempTaxAmount = 0.0;
        tempTaxAmount += parseFloat(row.CGST);
        tempTaxAmount += parseFloat(row.IGST);
        tempTaxAmount += parseFloat(row.SGST);
        tempTaxAmount += parseFloat(row.UGST);
        tempTaxAmount += parseFloat(row.Cess);
        tempTaxAmount += parseFloat(row.Surcharge);
        return tempTaxAmount.toFixed(2);
      },
      align: "right",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      align: "right",
    },
    // {
    //   title: "Action",
    //   align: "center",
    //   render: (value, row, index) => {
    //     return (
    //       <Popconfirm
    //         title="Are You Sure !!"
    //         onConfirm={() => {
    //           row.IsDeleted = "Y";
    //           setInvoiceDtl([
    //             ...InvoiceDtl.filter((ii) => ii.key !== row.key),
    //             row,
    //           ]);
    //         }}
    //         onCancel={() => {}}
    //       >
    //         <DeleteTwoTone />
    //       </Popconfirm>
    //     );
    //   },
    // },
  ];
  useEffect(() => {
    setLoading(true);
    getRestaurantInvoiceDtl(CompCode, props.InvoiceId).then((res) => {
      getInvoiceHdr(CompCode, props.InvoiceId).then(async (res1) => {
        let tempInvDtl = [];
        await res.forEach((element, index) => {
          tempInvDtl.push({
            ...element,
            IsDeleted: "N",
            IsChecked: "N",
            key: index,
          });
        });
        // console.log(res1, "invoice HDR");
        setInvoiceDtl(tempInvDtl);
        setInvoiceHdr(res1);
        onRowSelectChange(tempInvDtl, res1);
        setLoading(false);
      });
    });
  }, []);

  const onRowSelectChange = (pInvoiceDtl, pInvoiceHdr) => {
    //Cal Return Summary
    let l_R_Qty = 0;
    let l_R_SubTotal = 0;
    let l_R_Tax = 0;
    let l_R_Disc = 0;
    let l_R_RoundOff = 0;
    let l_R_NetPayable = 0;
    let l_F_Qty = 0;
    let l_F_SubTotal = 0;
    let l_F_Tax = 0;
    let l_F_Disc = 0;
    let l_F_RoundOff = 0;
    let l_F_NetPayable = 0;
    pInvoiceDtl.forEach((item) => {
      if (item.IsChecked === "Y") {
        l_R_Qty += parseFloat(item.Qty);
        // l_R_SubTotal +=
        //   parseFloat(item.Amount) +
        //   (item.SysOption5 === "B"
        //     ? parseFloat(item.Disc) * -1
        //     : parseFloat(item.Disc));
        l_R_SubTotal +=
          parseFloat(item.Amount) +
          (item.SysOption5 === "B" ? 0 : parseFloat(item.Disc));
        l_R_Disc += parseFloat(item.Disc);
        l_R_Tax +=
          parseFloat(item.CGST) +
          parseFloat(item.SGST) +
          parseFloat(item.UGST) +
          parseFloat(item.IGST) +
          parseFloat(item.Cess) +
          parseFloat(item.Surcharge);
        l_R_RoundOff += 0;
        l_R_NetPayable = l_R_SubTotal - l_R_Disc + l_R_Tax;
        // l_R_NetPayable+=
        setReturnSummary({
          SubTotal: l_R_SubTotal,
          Qty: l_R_Qty,
          Disc: l_R_Disc,
          TaxAmount: l_R_Tax,
          RoundOff: l_R_RoundOff,
          NetPayable: l_R_NetPayable,
        });
      } else {
        setReturnSummary({
          SubTotal: l_R_SubTotal,
          Qty: l_R_Qty,
          Disc: l_R_Disc,
          TaxAmount: l_R_Tax,
          RoundOff: l_R_RoundOff,
          NetPayable: l_R_NetPayable,
        });
        l_F_Qty += parseFloat(item.Qty);
      }
    });
    l_F_SubTotal = pInvoiceHdr[0].GrossAmount - _.round(l_R_SubTotal, 3);
    l_F_Tax = _.round(pInvoiceHdr[0].TaxAmount - l_R_Tax, 3);
    l_F_Disc = pInvoiceHdr[0].DiscAmount - l_R_Disc;
    l_F_NetPayable = l_F_SubTotal - l_F_Disc + l_F_Tax;
    // l_F_RoundOff=
    l_F_RoundOff = _.round(_.round(l_F_NetPayable, 0) - l_F_NetPayable, 3);
    l_F_NetPayable = l_F_NetPayable + l_F_RoundOff;
    setFinalBillSummary({
      SubTotal: l_F_SubTotal,
      Qty: l_F_Qty,
      Disc: l_F_Disc,
      TaxAmount: l_F_Tax,
      RoundOff: l_F_RoundOff,
      NetPayable: l_F_NetPayable,
    });
  };

  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      // console.log("selected");
      record.IsChecked = selected ? "Y" : "N";
      setInvoiceDtl([
        ...InvoiceDtl.filter((ii) => ii.key !== record.key),
        record,
      ]);

      onRowSelectChange(
        [...InvoiceDtl.filter((ii) => ii.key !== record.key), record],
        InvoiceHdr
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.AllowVoid === "N",
    }),
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      let tempData = [];
      InvoiceDtl.forEach((row) => {
        tempData.push({
          ...row,
          IsChecked: row.AllowVoid === "Y" && selected ? "Y" : "N",
        });
      });
      setInvoiceDtl(tempData);
      onRowSelectChange(tempData, InvoiceHdr);
    },
    selectedRowKeys: InvoiceDtl.filter(
      (dd) => dd.IsDeleted === "N" && dd.IsChecked === "Y"
    ).map((a) => a.key),
  };

  return (
    <>
      <div
        className="void-bill-header"
        style={{
          padding: "6px 15px 5px 15px",
          borderBottom: "1px solid #cecece",
        }}
      >
        <span style={{ fontWeight: "600", fontSize: 16 }}>Void Bill</span> /
        {InvoiceHdr.length > 0 &&
          ` ${InvoiceHdr[0].InvoiceNo} (${moment(InvoiceHdr[0].crt_dttm).format(
            appconfigs.find((ac) => ac.configCode === "DTFORMAT").value1
          )})`}
      </div>
      <div style={{ padding: "4px 15px" }}>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <Table
              dataSource={InvoiceDtl.sort((a, b) =>
                a.key > b.key ? 1 : -1
              ).filter((id) => id.IsDeleted !== "Y")}
              columns={columns}
              bordered={true}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              rowKey={"key"}
              pagination={false}
            />

            <div
              style={{
                border: "1px solid #cecece",
                marginTop: 4,
                display: "flex",
                backgroundColor: "#fff9f0",
              }}
            >
              <div style={{ display: "inline-block", width: "50%" }}>
                <DisplayVoidBillCalcData
                  data={returnSummary}
                  title="Return Summary"
                />
              </div>
              <div
                style={{
                  display: "inline-block",
                  width: "50%",
                  borderLeft: "1px solid #cecece",
                }}
              >
                <DisplayVoidBillFinalCalcData
                  data={finalBillSummary}
                  title="Final Bill Summary"
                />
              </div>
            </div>
            <div style={{ marginTop: 4, textAlign: "end" }}>
              <div style={{ display: "inline-block" }}>
                <Button
                  type="primary"
                  style={{ marginRight: 5 }}
                  disabled={
                    !InvoiceDtl.filter(
                      (ii) => ii.IsChecked === "Y" && ii.IsDeleted === "N"
                    ).length > 0
                  }
                  onClick={async () => {
                    // console.log(
                    //   InvoiceDtl,
                    //   finalBillSummary,
                    //   "selectedDtlRows"
                    // );

                    let VoidItems = [];
                    await InvoiceDtl.filter(
                      (ii) => ii.IsChecked === "Y" && ii.IsDeleted === "N"
                    ).forEach((filtInDtl) => {
                      VoidItems.push({
                        ...filtInDtl,
                        Qty: parseFloat(filtInDtl.Qty) * -1,
                        Disc: parseFloat(filtInDtl.Disc) * -1,
                        Amount: parseFloat(filtInDtl.Amount) * -1,
                        SGST: parseFloat(filtInDtl.SGST) * -1,
                        CGST: parseFloat(filtInDtl.CGST) * -1,
                        UGST: parseFloat(filtInDtl.UGST) * -1,
                        IGST: parseFloat(filtInDtl.IGST) * -1,
                        Cess: parseFloat(filtInDtl.Cess) * -1,
                        Surcharge: parseFloat(filtInDtl.Surcharge) * -1,
                        // UpdtUsr: loginInfo.username,
                      });
                    });

                    let InvoiceHdr = {
                      GrossAmount: finalBillSummary.SubTotal,
                      DiscAmount: finalBillSummary.Disc,
                      TaxAmount: finalBillSummary.TaxAmount,
                      RoundOff: finalBillSummary.RoundOff,
                      InvoiceAmount: finalBillSummary.NetPayable,
                      SettlementAmount: 0,
                      InvoiceId: props.InvoiceId,
                      pUpdtUsr: loginInfo.username,
                    };
                    let data = {
                      VoidItems,
                      InvoiceHdr,
                      UpdtUsr: loginInfo.username,
                      PrevDataLength: InvoiceDtl.length,
                      CompCode: CompCode,
                    };

                    console.log(data,"restaurantPOSVoidBill");
                    let gg = await restaurantPOSVoidBill(CompCode, data);
                    // console.log(gg);

                    if (finalBillSummary.NetPayable === 0) {
                      // props.onClearTable(
                      //   InvoiceDtl.filter(
                      //     (ii) => ii.IsChecked === "Y" && ii.IsDeleted === "N"
                      //   )
                      // );
                      let kotData = {
                        KOTId: [
                          ...new Set(
                            props.selectedMenu.map((item) => item.KOTId)
                          ),
                        ],
                        KOTStatus: "CMP",
                        UpdtUsr: loginInfo.username,
                      };
                      uptRestarantPosKOTHdrStatus(CompCode, kotData).then(
                        (res) => {
                          // let kotDataDtl = {
                          //   KOTId: [
                          //     ...new Set(selectedMenu.map((item) => item.KOTId)),
                          //   ],
                          //   KOTStatus: "RJCT",
                          //   UpdtUsr: loginInfo.username,
                          // };
                          let kotDataDtl = [];
                          InvoiceDtl.filter(
                            (ii) => ii.IsChecked === "Y" && ii.IsDeleted === "N"
                          ).forEach(async (row) => {
                            await kotDataDtl.push({
                              Id: row.SysOption2,
                              KOTId: row.SysOption1,
                              ItemStatus: "RJCT",
                              UpdtUsr: loginInfo.username,
                              CompCode: CompCode,
                            });
                          });
                          console.log(kotDataDtl, "void dtl 1");
                          updtRestaurantPOSKOTDtlStatus(CompCode, kotDataDtl)
                            .then((res) => {
                              // uptRestarantPosKOTdtlStatus(kotDataDtl)
                              //   .then(() => {
                              if (props.EntryMode.EntryType === "DINEIN") {
                                let tblData = {
                                  data: {
                                    ...props.EntryMode.TableInfo,
                                    SysOption1: null,
                                    SysOption2: null,
                                    SysOption3: null,
                                    SysOption4: null,
                                    SysOption5: null,
                                    Status: "BLANK",
                                    UpdtUsr: loginInfo.username,
                                    CompCode: CompCode,
                                    BranchCode: BranchConfigs.value1,
                                    DeptCode: "DINEIN",
                                    TableType:
                                      props.EntryMode.TableInfo.TableType,
                                    TableSec: props.EntryMode.TableInfo.SecCode,
                                    IsActive: 1,
                                  },
                                };
                                saveTableStatus(
                                  CompCode,
                                  tblData
                                ).then((res) => {});
                              }
                              props.onBackPress();
                              props.onSavePress();
                            })
                            .catch((err) => {});
                        }
                      );
                    } else {
                      let kotDataDtl = [];
                      InvoiceDtl.filter(
                        (ii) => ii.IsChecked === "Y" && ii.IsDeleted === "N"
                      ).forEach(async (row) => {
                        await kotDataDtl.push({
                          Id: row.SysOption2,
                          KOTId: row.SysOption1,
                          ItemStatus: "RJCT",
                          UpdtUsr: loginInfo.username,
                          CompCode: CompCode,
                        });
                      });
                      console.log(kotDataDtl, "void dtl 2");
                      updtRestaurantPOSKOTDtlStatus(CompCode, kotDataDtl)
                        .then((res) => {
                          // uptRestarantPosKOTdtlStatus(kotDataDtl)
                          //   .then(() => {
                          if (props.EntryMode.EntryType === "DINEIN") {
                            let tblData = {
                              data: {
                                ...props.EntryMode.TableInfo,
                                SysOption1: null,
                                SysOption2: null,
                                SysOption3: null,
                                SysOption4: null,
                                SysOption5: null,
                                Status: "BLANK",
                                UpdtUsr: loginInfo.username,
                                CompCode: CompCode,
                                BranchCode: BranchConfigs.value1,
                                DeptCode: "DINEIN",
                                TableType: props.EntryMode.TableInfo.TableType,
                                TableSec: props.EntryMode.TableInfo.SecCode,
                                IsActive: 1,
                              },
                            };
                          }
                          props.onBackPress();
                          props.onSavePress();
                        })
                        .catch((err) => {
                          console.error(err);
                        });
                    }
                    // return props.onBackPress;
                    // await insInvoiceDTL(
                    //   tempInvDtl.filter(
                    //     (ii) => ii.IsChecked === "Y" && ii.IsDeleted === "N"
                    //   ),
                    //   InvoiceDtl.length
                    // ).then((dtl) => {
                    //   let InvoiceHdr = {
                    //     SysOption3: dtl.SrNo,
                    //     GrossAmount: finalBillSummary.SubTotal,
                    //     DiscAmount: finalBillSummary.Disc,
                    //     TaxAmount: finalBillSummary.TaxAmount,
                    //     RoundOff: finalBillSummary.RoundOff,
                    //     InvoiceAmount: finalBillSummary.NetPayable,
                    //     InvoiceId: props.InvoiceId,
                    //     pUpdtUsr: loginInfo.username,
                    //   };
                    //   console.log(dtl,"response")
                    //   if (dtl.message === "successful") {
                    //     restaurantUptInvoiceHdr(InvoiceHdr).then((dtl) => {
                    //       props.onBackPress();
                    //     });
                    //   }
                    // });
                  }}
                  icon={<FileAddOutlined />}
                >
                  Save
                </Button>
              </div>
              <div style={{ display: "inline-block" }}>
                <Button
                  onClick={() => props.onBackPress()}
                  icon={<CloseOutlined />}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VoidBillComponent;
