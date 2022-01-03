import React, { useEffect, useState } from "react";
import { Tabs, Card } from "antd";
// import MenuVarAddOnCard from "./MenuVarAddOnCard";
import MenuUploadImages from "./MenuUploadImage";

const { TabPane } = Tabs;

const MenuMasterTabsCard = (props) => {
  const [mCode, setMCode] = useState(props.MenuCode);
  const [isResetClicked, setIsResetClicked] = useState(true);
  useEffect(() => {
    setMCode(props.MenuCode);
  }, [props.MenuCode]);

  useEffect(() => {
    setIsResetClicked(!isResetClicked);
  }, [props.ResetClicked]);
  return (
    <Tabs tabBarStyle={{ marginBottom: 0 }} forceRender={true} type="card">
      <TabPane tab="Upload Image" key="2">
        <MenuUploadImages MenuCode={mCode} ResetClicked={isResetClicked} />
      </TabPane>
      {/* <TabPane tab="Variation and Add-On" key="3" forceRender={true}>
        <MenuVarAddOnCard MenuCode={mCode} ResetClicked={isResetClicked} />
      </TabPane> */}
    </Tabs>
  );
};

export default MenuMasterTabsCard;
