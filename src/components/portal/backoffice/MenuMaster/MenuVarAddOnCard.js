import React, { useState, useEffect } from "react";
import { Card, Row, Col, Checkbox, Form } from "antd";
import {
  fetchMenuVariationTab,
  fetchMenuAddOnTab,
} from "../../../../services/menu-master";
import { useDispatch, useSelector } from "react-redux";

let varData = [];
let addondata = [];
export const setVariatonData = () => {
  return console.log(varData);
};

const MenuVarAddOnCard = (props) => {
  const [variationType, setVariationType] = useState([]);
  const [defVarType, setDefVarType] = useState([]);
  const [defAddOn, setDefAddOn] = useState([]);
  const [addOn, setAddOn] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    fetchMenuVariationTab(CompCode, props.MenuCode).then((res) => {
      let temp = [];
      res.map((item) => {
        temp = [
          ...temp,
          {
            label: item.MasterDesc,
            value: item.ShortCode,
            isDirty: false,
            defValue: item.isChecked === "1" ? true : false,
          },
        ];
      });
      setVariationType(temp);
      setDefVarType(
        temp.filter((item) => item.defValue === "1").map((i) => i.value)
      );
      //   console.log(temp, "data");
    });

    fetchMenuAddOnTab(CompCode, props.MenuCode).then((res) => {
      let temp = [];
      res.map((item) => {
        temp = [
          ...temp,
          {
            label: item.AddOnName,
            value: item.AddOnCode,
            isDirty: item.isChecked === "1" ? false : true,
            defValue: item.isChecked,
          },
        ];
      });
      //   console.log(temp, "data");
      setAddOn(temp);
      setDefAddOn(
        temp.filter((item) => item.defValue === "1").map((i) => i.value)
      );
    });
  }, [props.MenuCode]);
  //   useEffect(() => {
  //   }, [defVarType])

  const varDataDirty = (data) => {
    let exitistingData = variationType.filter((item) => item.isDirty === false);
    // let DeletedData = [];
    // console.log(
    //   data.map((i) => {
    //     exitistingData=exitistingData.filter((item) => item.value !== i);
    //     return exitistingData
    //   }),
    //   "here"
    // );
  };
  return (
    <Row>
      <Col xl={12} lg={12} md={12} sm={12} xs={24}>
        <Header title={`Variation`} />
        <Card bodyStyle={{ minHeight: 100 }}>
          {variationType.map((item) => {
            return (
              <Checkbox
                value={item.value}
                checked={item.defValue}
                onChange={(e) => {
                  let hh = [...variationType];
                  let inx = hh.findIndex(
                    (iiii) => iiii.value === e.target.value
                  );

                  hh[inx].isDirty = true;
                  hh[inx].defValue = e.target.checked;
                  setVariationType(hh);
                }}
              >
                {item.label}
              </Checkbox>
            );
          })}
          {/* <Checkbox.Group
            // options={variationType}
            onChange={(checkvalue) => {
              setDefVarType(checkvalue);
              varDataDirty(checkvalue);
            }}
            value={defVarType}
            style={{ width: "100%" }}
          >
            <Row>
              {variationType.map((item) => {
                return (
                  <Col span={8}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group> */}
        </Card>
      </Col>
      <Col xl={12} lg={12} md={12} sm={12} xs={24}>
        <Header title={`Add-On`} />
        <Card bodyStyle={{ minHeight: 100 }}>
          <Checkbox.Group
            // options={variationType}
            onChange={(checkvalue) => {
              setDefAddOn(checkvalue);
              //   console.log(checkvalue);
              //   varDataDirty(checkvalue);
            }}
            value={defAddOn}
            style={{ width: "100%" }}
          >
            <Row>
              {addOn.map((item) => {
                return (
                  <Col span={8}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>
        </Card>
      </Col>
    </Row>
  );
};

export const Header = (props) => {
  return (
    <div
      style={{
        padding: "2px 24px",
        fontSize: 15,
        background: "#FFFFFF",
        border: "1px solid #f0f0f0",
      }}
    >
      <div style={{ margin: 0, fontSize: 15, fontWeight: "500" }}>
        {props.title}
      </div>
    </div>
  );
};
export default MenuVarAddOnCard;
