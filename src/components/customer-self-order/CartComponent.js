import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Divider, Button, message } from "antd";
import AddQuantityComponent from "./AddQuantityComponent";
import _ from "lodash";
import nonveg from "../../assets/images/nonveg.png";
import veg from "../../assets/images/veg.png";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import moment from "moment";
import { saveKOT, saveTableStatus } from "../../services/self-order";
import { useSelector } from "react-redux";
// import { FaUtensils } from "react-icons/fa";
const CartComponent = (props) => {
  const [selectedMenu, setSelectedMenu] = useState([]);
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    let tempData = [];
    props.selectedMenu.forEach((row, index) => {
      let l_MenuDisplayName = `${row.MenuName} ${
        row.var ? `[${row.var.VarDesc}]` : ""
      }`;
      let l_MenuSumRate = 0;
      let l_MenuDisplayDesc = ``;
      if (row.var && row.var !== -1) {
        l_MenuSumRate += parseInt(row.var.Rate);
      } else {
        l_MenuSumRate += parseInt(row.Rate);
      }
      let tmpItem = "";
      let addOns = props.menuAddOn.filter((hh) => hh.MenuCode === row.MenuCode);
      if (row.addOn && row.addOn.length > 0) {
        addOns.forEach((ll) => {
          let tmpItem = "";
          row.addOn
            .filter((oi) => oi.AddOnCode === ll.AddonCode)
            .forEach((ki) => {
              tmpItem += (tmpItem === "" ? "" : ", ") + ki.ItemName;
              l_MenuSumRate += parseInt(ki.Rate);
            });

          if (tmpItem !== "") {
            l_MenuDisplayDesc +=
              (l_MenuDisplayDesc === "" ? "" : "~") +
              ll.AddonCode +
              " : " +
              tmpItem;
          }
        });
      }
      tempData.push({
        ...row,
        cartKey: index,
        isDirty: false,
        SrNo: index + 1,
        MenuDisplayName: l_MenuDisplayName,
        MenuDisplayDesc: l_MenuDisplayDesc,
        MenuSumRate: l_MenuSumRate,
        CookingRemark: "",
        KOTId: null,
      });
    });
    setSelectedMenu(tempData);
    return () => {
      setSelectedMenu([]);
    };
  }, []);

  const onSaveClick = () => {
    return new Promise(function (resolve, reject) {
      try {
        let l_KOTNO;
        let KOTHDR = {
          InsUpdtType: "I",
          KOTId: null,
          CompCode: props.pageData.CompCode,
          BranchCode: props.pageData.BranchCode,
          DeptCode: props.pageData.DeptCode,
          KOT_No: l_KOTNO,
          KOT_Date: moment().format("YYYY-MM-DD HH:mm:ss"),
          TableNo: props.pageData.TableNo, //table code
          SysOption1: null, //customer ID and address
          SysOption2: null, //No of person
          SysOption3: null, //selected Captian
          SysOption4: null, //discound  reason~type~disc Amount~coupon code
          SysOption5: null,
          KOT_Status:
            props.configs.find((cc) => cc.ConfigCode === "MC_SO").Value1 === "Y"
              ? "SLFORD"
              : "PND", //kot status
          KOT_Remark: "",
          OrderType: "SELFORDER",
          UpdtUsr: "self-order",
        };

        let KOTDTL = [];
        selectedMenu
          .filter((kk) => kk.KOTId === null)
          .forEach((row) => {
            KOTDTL.push({
              InsUpdtType: "I",
              Id: null,
              KOTId: null,
              SrNo: row.SrNo,
              MenuCode: row.MenuCode,
              MenuName: row.MenuName,
              MenuDisplayName: row.MenuDisplayName,
              MenuDisplayDesc: row.MenuDisplayDesc,
              VAR_Code: row.var && row.var !== -1 ? row.var.VarCode : null,
              VAR_Name: row.var && row.var !== -1 ? row.var.VarDesc : null,
              VAR_Rate: row.var && row.var !== -1 ? row.var.Rate : null,
              MenuBaseRate: row.Rate,
              MenuSumRate: row.MenuSumRate,
              Qty: row.Qty,
              Amount: row.Qty * row.MenuSumRate,
              CookingRemark: row.CookingRemark,
              UpdtUsr: "self-order",
              AddOns: row.addOn !== null ? row.addOn : [],
            });
          });
        let data = {
          data: { KOTHDR, KOTDTL, CompCode: props.pageData.CompCode },
        };
        let savedKOTId = 0;

        // if (props.EntryMode.TableInfo) {
        // console.log(customerForm.customer.address[0], "address save");
        let dataTableStatus = {
          data: {
            CompCode: props.pageData.CompCode,
            BranchCode: props.pageData.BranchCode, //bnrach value
            DeptCode: props.pageData.DeptCode,
            TableType: "REG",
            TableSec: props.pageData.SecCode,
            TableCode: props.pageData.TableNo,
            TableName: props.pageData.TableName,
            ParentTableCodes: null,
            SysOption1: null,
            SysOption2: null,
            SysOption3: null,
            SysOption4: null,
            SysOption5: "",
            Status: "RUNKOT",
            Remark: "",
            IsActive: true,
            UpdtUsr: "self-order",
          },
        };
        // console.log(KOTDTL, "lengtj kot dtl");
        if (KOTDTL.length > 0) {
          saveKOT(props.pageData.CompCode, data)
            .then((res) => {
              savedKOTId = res.KOTId;
              if (
                props.configs.find((cc) => cc.ConfigCode === "MC_SO").Value1 ===
                "Y"
              ) {
                resolve({ kot: res });
              } else {
                saveTableStatus(CompCode, dataTableStatus)
                  .then((resTbl) => {
                    resolve({ resTbl: resTbl, kot: res });
                  })
                  .catch((err) => reject(err));
              }
            })
            .catch((err) => reject(err));
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  return (
    <>
      <div
        className="back-float-button"
        style={{
          lineHeight: "45px",
          width: 45,
          borderRadius: 100,
          textAlign: "center",

          position: "fixed",
          bottom: 4,
          left: 10,
          zIndex: 99,
          cursor: "pointer",
        }}
        onClick={() => {
          props.onBackPress(selectedMenu);
        }}
        className="bg-color-style"
      >
        <ArrowLeftOutlined style={{ fontSize: 20 }} />
      </div>
      <div
        className="back-float-button"
        style={{
          lineHeight: "45px",
          width: 240,
          borderRadius: 100,
          textAlign: "center",

          position: "fixed",
          bottom: 4,
          right: 10,
          zIndex: 99,
          cursor: "pointer",
        }}
        onClick={() => {
          onSaveClick(selectedMenu)
            .then((res) => {
              props.onOrderSuccess();
            })
            .catch((err) => {});
        }}
        className="bg-color-style"
      >
        Place An Order
      </div>
      <div className="confirm-order-title">Confirm Order</div>
      <Row style={{ borderBottom: "1px solid #00000033" }}>
        {selectedMenu &&
          selectedMenu.length > 0 &&
          selectedMenu
            .filter((sm) => sm.Qty > 0)
            .sort((a, b) => (a.cartKey > b.cartKey ? 1 : -1))
            .map((menu, index) => {
              let vars = [];
              vars = props.menuVariationRates.filter(
                (xx) =>
                  xx.BranchCode === menu.BranchCode &&
                  xx.DeptCode === menu.DeptCode &&
                  xx.SecCode === menu.SecCode &&
                  xx.MenuCode === menu.MenuCode
              );
              let addOns = props.menuAddOn.filter(
                (hh) => hh.MenuCode === menu.MenuCode
              );
              return (
                <Col xl={6} lg={8} md={8} sm={24} xs={24} key={menu.cartKey}>
                  <div
                    className="self-order-card"
                    style={{
                      display: "flex",
                      margin: "5px 10px",
                      padding: "5px 5px",
                      borderBottom: `${
                        selectedMenu.length !== index + 1 ? "1px" : "0px"
                      } solid #0003`,
                    }}
                  >
                    <div style={{ marginRight: 5 }}>
                      <img
                        style={{ marginTop: 0 }}
                        src={menu.DietType === "V" ? nonveg : veg}
                        height="10"
                        width="10"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flex: 1,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#000",
                          }}
                        >
                          {menu.MenuName}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 400 }}>
                          {menu.var && menu.var !== -1
                            ? menu.var.VarDesc
                            : `${props.currency} ${parseInt(menu.Rate)}`}
                          {menu.addOn && menu.addOn.length > 0 ? "- " : ""}
                          {menu.addOn &&
                            menu.addOn.length > 0 &&
                            menu.addOn.map((addOn, index) => {
                              return `${addOn.ItemName}${
                                index != menu.addOn.length - 1 ? ", " : ""
                              }`;
                            })}
                        </div>
                      </div>
                      <AddQuantityComponent
                        data={menu}
                        addOn={[]}
                        vars={[]}
                        onClickMinus={() => {
                          if (!_.includes(["PRINTED", "PAID"], "BLANK")) {
                            let data = selectedMenu.find(
                              (fi) => fi.cartKey === menu.cartKey
                            );

                            if (data.Qty > 0) {
                              data.Qty -= 1;
                              data.isDirty = true;

                              // console.log(data);
                              setSelectedMenu([
                                ...selectedMenu.filter(
                                  (fi) => fi.cartKey !== menu.cartKey
                                ),
                                data,
                              ]);
                            } else {
                              setSelectedMenu([
                                ...selectedMenu.filter(
                                  (fi) => fi.cartKey !== menu.cartKey
                                ),
                              ]);
                            }
                          }
                        }}
                        onClickPlus={() => {
                          if (!_.includes(["PRINTED", "PAID"], "BLANK")) {
                            let data = selectedMenu.find(
                              (fi) => fi.cartKey === menu.cartKey
                            );

                            data.Qty += 1;
                            data.isDirty = true;
                            setSelectedMenu([
                              ...selectedMenu.filter(
                                (fi) => fi.cartKey !== menu.cartKey
                              ),
                              data,
                            ]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </Col>
              );
            })}
      </Row>
      {/* <Button type="primary" style={{ width: "100%", bottom: 4 }}>
        Book Now
      </Button> */}
    </>
  );
};

export default CartComponent;
