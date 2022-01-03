import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import CustomDataTable from "../../common/CustomDataTable";
import { hasRight } from "../../../shared/utility";
import ColumnProperties from "../../../models/columnProperties";
import { fetchPromotions } from "../../../store/actions/promotions";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import PromotionCard from "./Promotion/PromotionCard";
import { fetchPromotionsData } from "../../../services/promotions";

const Promotions = (props) => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const currTran = useSelector((state) => state.currentTran);
  // const promotions = useSelector((state) => state.promotion);
  const [promotions, setPromotion] = useState([]);
  const [loading, setLoading] = useState(false);
  let renderItem = null;
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setLoading(true);
    dispatch(
      setFormCaption(
        props.promoType === "COUPON"
          ? 84
          : props.promoType === "SCHEME"
          ? 83
          : null
      )
    );
    fetchPromotionsData(CompCode).then((res) => {
      if (props.promoType === "COUPON") {
        setPromotion(res.filter((i) => i.PromotionType === "COUPON"));
      } else if (props.promoType === "SCHEME") {
        setPromotion(res.filter((i) => i.PromotionType === "SCHEME"));
      }
      setLoading(false);
    });
    // dispatch(fetchPromotions());
    dispatch(fetchBranchMaster());
  }, []);

  const Refresh = () => {
    setLoading(true);
    fetchPromotionsData(CompCode).then((res) => {
      if (props.promoType === "COUPON") {
        setPromotion(res.filter((i) => i.PromotionType === "COUPON"));
      } else if (props.promoType === "SCHEME") {
        setPromotion(res.filter((i) => i.PromotionType === "SCHEME"));
      }
      setLoading(false);
    });
  };

  if (loading) {
    renderItem = <div>.....Loading</div>;
  } else if (promotions.length < 0) {
    renderItem = <div>Error...........!</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <>
            <PromotionCard
              {...props}
              // promoType={props.promoType}
              onBackPress={() => {
                setEditedData();
                Refresh();
              }}
              data={editedData.data}
              entryMode={editedData.entryMode}
            />
          </>
        )}

        {!loading && !editedData && (
          <div>
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={columnProperties}
              myData={promotions}
              onAddClick={() => {
                setEditedData({ entryMode: "A" });
              }}
              onEditPress={(values) => {
                setEditedData({ entryMode: "E", data: values });
              }}
              pageDefaultSize={15}
            />
          </div>
        )}
      </Fragment>
    );
  }

  return renderItem;
};

export const columnProperties = [
  new ColumnProperties("CompCode", false, "Comp. Code", true, 130),
  new ColumnProperties("PromotionCode", true, "Promo Code", true, 130),
  new ColumnProperties("BranchCode", false, "Branch Code", true),
  new ColumnProperties("PromotionType", true, "Promo Type", true, 120),
  new ColumnProperties("SchemeType", true, "Scheme Type", true, 120),
  new ColumnProperties("PromotionName", true, "Promo Name", true, 150),
  new ColumnProperties("PromotionDesc", true, "Promo Desc.", true),
  new ColumnProperties("DiscountType", false, "Discount Type", true),
  new ColumnProperties("DiscountValue", false, "Discount Value", true, 150),
  // new ColumnProperties("ApplicableFrom", false, "ApplicableFrom", true),
  // new ColumnProperties("ApplicableTo", false, "Applicable To", true),
  new ColumnProperties("FromQty", false, "From Quantity", true),
  new ColumnProperties("ToQty", false, "To Quantity", true),
  new ColumnProperties("DiscQty", false, "Discount Qty", true),
  new ColumnProperties("FromAmount", false, "From Amount", true),
  new ColumnProperties("ToAmount", false, "To Amount", false),
  new ColumnProperties("MaxDiscount", false, "MaxDiscount", false, 150),
  // new ColumnProperties("ApplicableFromHrs", false, "ApplicableFrom Hrs", false),
  // new ColumnProperties("ApplicableToHrs", false, "ApplicableTo Hrs", false),
  // new ColumnProperties("App_Sun", false, "App_Sun", false),
  // new ColumnProperties("App_Mon", false, "App_Mon", false),
  // new ColumnProperties("App_Tue", false, "App_Tue", false),
  // new ColumnProperties("App_Wed", false, "App_Wed", false),
  // new ColumnProperties("App_Thu", false, "App_Thu", false),
  // new ColumnProperties("App_Fri", false, "App_Fri", false),
  // new ColumnProperties("App_Sat", false, "App_Sat", false),
  new ColumnProperties("TaxIncludeExclude", false, "TaxIncludeExclude", false),
  new ColumnProperties("IsActive", false, "IsActive", false),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];
export default Promotions;
