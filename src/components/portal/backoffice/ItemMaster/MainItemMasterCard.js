import React from "react";
import ItemMasterCard from "./ItemMasterCard";
import ItemMasterTabsCard from "./ItemMasterTabsCard";
const MainItemMasterCard = (props) => {
  return (
    <div>
      <ItemMasterCard
        onBackPress={props.onBackPress}
        formData={props.formData}
      />
      <ItemMasterTabsCard />
    </div>
  );
};

export default MainItemMasterCard;
