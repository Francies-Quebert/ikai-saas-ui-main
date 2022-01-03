import { UserOutlined } from "@ant-design/icons";
import { Avatar, Empty } from "antd";
import React, { useEffect, useState, Fragment } from "react";
import { invValidateItemCodeInTransaction } from "../../../services/opening-stock";
import { useSelector } from "react-redux";
import _ from "lodash";

const LastScannedItemDtl = (props) => {
  const [DtlData, setDtlData] = useState();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    if (props.lastScanned && props.lastScanned !== null) {
      invValidateItemCodeInTransaction(CompCode, props.lastScanned.Code).then(
        (res) => {
          setDtlData(res[0]);
          // console.log(res[0]);
        }
      );
    }
  }, [props.lastScanned]);
  return (
    <Fragment>
      {DtlData ? (
        <div
          className="style-2"
          style={{
            height: "100%",
            fontFamily: "Cairo",
            overflow: "auto",
            padding: "15px 20px 0px 20px",
          }}
        >
          <div className="d-flex">
            <div className="sales-ls-image">
              <img
                src={
                  DtlData.URL && DtlData.URL !== null
                    ? DtlData.URL
                    : require("../../../assets/images/product-img.png")
                }
                style={{ width: 50, objectFit: "contain" }}
              />
              {/* ) : (
                <Avatar size="large" icon={<UserOutlined />} />
           )} */}
            </div>
            <div className="flex-1 sales-ls-item-head">
              <div className="sales-ls-name">
                {DtlData.ItemName}
                <span className="sales-ls-code"> ({DtlData.ItemCode})</span>
              </div>
              <div className="sales-ls-barcode">
                {props.lastScanned.Barcode}
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 7 }}>
            <div className="d-flex">
              <div className="sales-ls-label">Brand</div>
              <div className="sales-ls-desc">{DtlData.BrandDesc}</div>
            </div>
            <div className="d-flex">
              <div className="sales-ls-label">Manufacturer</div>
              <div className="sales-ls-desc">{DtlData.MfrDesc}</div>
            </div>
            <div className="d-flex">
              <div className="sales-ls-label">Class</div>
              <div className="sales-ls-desc">{DtlData.ClassName}</div>
            </div>
            <div className="d-flex">
              <div className="sales-ls-label">Category</div>
              <div className="sales-ls-desc">{DtlData.CatDesc}</div>
            </div>
            <div className="d-flex">
              <div className="sales-ls-label">Sub Category</div>
              <div className="sales-ls-desc">{DtlData.SubCatDesc}</div>
            </div>
            <div className="d-flex">
              <div className="sales-ls-label">Current Stock</div>
              <div
                className="sales-ls-desc sales-ls-curr-stk"
                style={{
                  color: `${
                    parseFloat(DtlData.CurrStockQty).toFixed(2) > 0
                      ? "green"
                      : "red"
                  }`,
                }}
              >
                {!_.includes([null, "", undefined], DtlData.CurrStockQty)
                  ? parseFloat(Math.abs(DtlData.CurrStockQty)).toFixed(2)
                  : 0}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Empty
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            description={<span>No Item Scanned</span>}
          />
          {/* <img
            src={require("../../../assets/images/no-barcode.png")}
            style={{ width: 50 }}
          /> */}
          {/* <div>No Item Scanned</div> */}
        </div>
      )}
    </Fragment>
  );
};
export default LastScannedItemDtl;
