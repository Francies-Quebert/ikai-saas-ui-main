import React, { useEffect, useState, useContext } from "react";
import { Tabs, Card } from "antd";
import ItemBarcode from "./ItemBarcode";
import ItemUploadImages from "./ItemUploadImage";
import ItemMasterOpeningStock from "./ItemMasterOpeningStock";
import { fetchDepatmentAndBranch } from "../../../../services/item-master";

import { useDispatch, useSelector } from "react-redux";
import { hasRight } from "../../../../shared/utility";
import ItemMasterAddInfo from "./ItemMasterAddInfo";
import { fetchSubCatMasterCard } from "../../../../services/subCategory";
import ItemVariations from "./ItemVariations";
import { ItemMstConfigContext } from "../ItemMaster";
const { TabPane } = Tabs;

const ItemMasterTabsCard = (props) => {
  // let { configVariant } = React.useContext(ItemMstConfigContext);

  const config = useSelector((state) => state.AppMain.appconfigs);
  const [iCode, setICode] = useState(props.ItemCode);
  const [isResetClicked, setIsResetClicked] = useState();
  const [dataOpn, setDataOpn] = useState();
  const [templateId, setTemplateId] = useState();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  // const config = useSelector((state) => state.AppMain.appconfigs);
  const opStkRight = useSelector((state) =>
    state.AppMain.userAccess.filter((aa) => aa.ModuleId === 88)
  );
  useEffect(() => {
    setICode(props.ItemCode);
  }, [props.ItemCode]);

  useEffect(() => {
    setIsResetClicked(!isResetClicked);
  }, [props.ResetClicked]);

  useEffect(() => {
    fetchDepatmentAndBranch(CompCode).then((response) => {
      setDataOpn(response);
    });
  }, []);

  useEffect(() => {
    if (props.SubCat) {
      fetchSubCatMasterCard(CompCode, props.SubCat).then(async (res) => {
        if (res[0]) {
          setTemplateId();
          await setTemplateId(res[0].ItemInfoTemplate);
        } else {
          setTemplateId();
        }
      });
    } else {
      setTemplateId();
    }
  }, [props.SubCat]);

  return (
    <Tabs tabBarStyle={{ marginBottom: 0 }} type="card">
      {props.showBarcode == "Y" && (
        <TabPane tab="Barcode" key="1" forceRender={true}>
          <ItemBarcode ItemCode={iCode} ResetClicked={isResetClicked} />
        </TabPane>
      )}
      <TabPane tab="Upload Image" key="2" forceRender={true}>
        {/* <Card>Upload Image</Card> */}
        <ItemUploadImages ItemCode={iCode} ResetClicked={isResetClicked} />
      </TabPane>
      {/* {dataOpn &&
        dataOpn[0].length === 1 &&
        dataOpn[1].length === 1 &&
        !hasRight(
          opStkRight.length > 0 ? opStkRight[0].Rights : [],
          "VIEW"
        ) && (
          <TabPane tab={`Opening Stock`} key="3" forceRender={true}>  // <Card>Upload Image</Card>
            <ItemMasterOpeningStock
              ItemCode={iCode}
              dept={dataOpn[0][0].DeptName}
              branch={dataOpn[1][0].BranchName}
              deptCode={dataOpn[0][0].DeptCode}
              branchCode={dataOpn[1][0].BranchCode}
              entryMode={props.entryMode}
              form={props.form}
              opStkRight={opStkRight}
            />
          </TabPane>
        )} */}
      {props.showAdditionalInfo == "Y" && (
        <TabPane tab="Additional Info" key="4">
          <ItemMasterAddInfo
            Entrymode={props.entryMode}
            TemplateId={templateId}
            ItemCode={iCode}
          />
        </TabPane>
      )}
      {config &&
        config.find((aa) => aa.configCode === "ENABLE_ITM_VARIATION").value1 ===
          "Y" && (
          <TabPane tab="Item Variation" key="5" forceRender={true}>
            <ItemVariations Entrymode={props.entryMode} ItemCode={iCode} />
          </TabPane>
        )}
    </Tabs>
  );
};

export default ItemMasterTabsCard;
