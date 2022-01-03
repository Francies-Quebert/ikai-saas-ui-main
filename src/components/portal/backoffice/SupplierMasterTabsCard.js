import React, { useEffect, useState } from "react";
import { Tabs, Card } from "antd";
import ItemBarcode from "./ItemBarcode";
import ItemUploadImages from "./ItemUploadImage";
import ItemMasterOpeningStock from "./ItemMasterOpeningStock";

const { TabPane } = Tabs;

const ItemMasterTabsCard = (props) => {
  const [iCode, setICode] = useState(props.ItemCode);
  const [isResetClicked, setIsResetClicked] = useState();
  useEffect(() => {
    setICode(props.ItemCode);
  }, [props.ItemCode]);
  useEffect(() => {
    setIsResetClicked(!isResetClicked);
  }, [props.ResetClicked]);
  return (
    <Tabs tabBarStyle={{ marginBottom: 0 }} type="card">
      {props.showBarcode == "Y" && (
        <TabPane tab="Bank Info" key="1" forceRender={true}>
          <ItemBarcode ItemCode={iCode} ResetClicked={isResetClicked} />
        </TabPane>
      )}
      <TabPane tab="Opening Balance" key="2" forceRender={true}>
        {/* <Card>Upload Image</Card> */}
        <ItemUploadImages ItemCode={iCode} ResetClicked={isResetClicked} />
      </TabPane>
      {/* <TabPane tab="Opening Stock" key="3" forceRender={true}>
        {/* <Card>Upload Image</Card> */}
        {/* <ItemMasterOpeningStock />
    //   </TabPane> */}
    </Tabs>
  );
};

export default ItemMasterTabsCard;