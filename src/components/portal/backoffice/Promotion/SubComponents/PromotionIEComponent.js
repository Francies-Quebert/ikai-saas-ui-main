import React, { useState, useEffect } from "react";
import { Row, Col, Select, Input, Popconfirm } from "antd";

import { DeleteTwoTone } from "@ant-design/icons";

const PromotionIEComponent = (props) => {
  const [data, setData] = useState([]);
  const [promoIEValue, setPromoIEValue] = useState();
  const [reRender, setReRender] = useState(false);
  const { Option } = Select;

  useEffect(() => {
    let tempData = props.data;
    if (tempData.length > 0) {
      setData(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    if (reRender) {
      props.onSet(data);
    }
    setReRender(false);
  }, [reRender]);
  return (
    <>
      {data.length > 0 &&
        data
          .sort((a, b) => (parseInt(a.key) > parseInt(b.key) ? 1 : -1))
          .filter((id) => id.IsDeleted !== "Y")
          .map((item) => {
            return (
              <Row style={{ padding: 5 }} key={item.key}>
                <Col
                  style={{
                    width: 105,
                    paddingLeft: 5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.IETypeName}:
                </Col>
                <Col flex="1 0 auto">
                  {item.IEDataType === "select" ? (
                    <Select
                      allowClear
                      defaultValue={item.IEValue}
                      style={{ padding: "0px 5px", width: "100%" }}
                      placeholder={`Select ${item.IETypeName}`}
                      onChange={(e) => {
                        item.IEValue = e;
                        setReRender(true);
                      }}
                    >
                      {item.dataSource &&
                        item.dataSource.map((i) => {
                          return (
                            <Option key={i.ValueMember} value={i.ValueMember}>
                              {i.DisplayMember}
                            </Option>
                          );
                        })}
                    </Select>
                  ) : item.IEDataType === "input" ? (
                    <Input
                      defaultValue={item.IEValue}
                      style={{ marginLeft: 5, maxWidth: "98%" }}
                      placeholder={`Enter ${item.IETypeName}`}
                      onChange={(e) => {
                        item.IEValue = e.target.value;
                        setReRender(true);
                      }}
                    />
                  ) : (
                    <Input />
                  )}
                </Col>
                <Col
                  style={{
                    paddingLeft: 5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <a
                    onClick={() => {
                      item.IsDeleted = "Y";
                      setData([
                        ...data.filter(
                          (ii) => parseInt(ii.key) !== parseInt(item.key)
                        ),
                        item,
                      ]);
                      setReRender(true);
                    }}
                  >
                    <DeleteTwoTone />
                  </a>
                </Col>
              </Row>
            );
          })}
    </>
  );
};

export default PromotionIEComponent;
