import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  Empty,
  Card,
  Select,
  Input,
  Skeleton,
  message,
} from "antd";
import PromotionIESelect from "../SubComponents/PromoIESelectable";
import PromotionIEComponent from "../SubComponents/PromotionIEComponent";
import { DeleteTwoTone } from "@ant-design/icons";
import {
  fetchPromotionsIEData,
  fetchSelectQuery,
} from "../../../../../services/promotions";
const { Option } = Select;

const Inclusive = (props) => {
  const [selectedData, setSelectedData] = useState([]);
  const [isShowIEModal, setIsShowIEModal] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.IEData && props.IEData.Inclusive) {
      setLoading(true);
      let tempData = [];
      props.IEData.Inclusive.forEach((element, index) => {
        tempData.push({
          key: index,
          IsDeleted: "N",
          IEValue: null,
          IsDirty: false,
          ...element,
        });
      });
      if (tempData.length > 0) {
        tempData.forEach((element) => {
          if (
            element.IEDataSource &&
            element.IEDataSource.split("|")[0] === "SP"
          ) {
            fetchSelectQuery(element.IEDataSource.split("|")[1]).then((res) => {
              tempData = [
                ...tempData.filter((ii) => ii.key !== element.key),
                { ...element, dataSource: res },
              ];

              setSelectedData(tempData);
            });
          } else if (
            element.IEDataSource &&
            element.IEDataSource.split("|")[0] === "FIXED"
          ) {
            let param_values = element.IEDataSource.split("|")[1];
            let paramDataSource = [];
            param_values.split("#").map((i) => {
              paramDataSource.push({
                ValueMember: i.split("~")[0],
                DisplayMember: i.split("~")[1],
              });
            });
            tempData = [
              ...tempData.filter((ii) => ii.key !== element.key),
              { ...element, dataSource: paramDataSource },
            ];
            setSelectedData(tempData);
          }
        });
      }
    }
    setLoading(false);
  }, [props.IEData]);

  useEffect(() => {
    if (reRender) {
      props.onSaveClick(selectedData);
    }
    setReRender(false);
  }, [reRender]);

  return (
    <>
      {isShowIEModal && (
        <Modal
          visible={isShowIEModal}
          onCancel={() => setIsShowIEModal(false)}
          footer={null}
          width={800}
          bodyStyle={{ padding: 0 }}
          destroyOnClose={true}
        >
          <PromotionIESelect
            data={selectedData}
            onSetClick={(data) => {
              let tempData = [...selectedData];
              data.forEach((row) => {
                tempData.push({
                  ...row,
                  key: [...tempData].length,
                  IEType: "I",
                  IsDeleted: "N",
                  IEValue: null,
                  IsDirty: true,
                });
              });
              props.onSaveClick(tempData);
              setSelectedData(tempData);
            }}
            onBackPress={() => setIsShowIEModal(false)}
          />
        </Modal>
      )}

      <Col flex="100%" style={{ border: "1px solid #d9d9d9" }}>
        <Row className="header-title-promo" style={{ padding: "1px 0px" }}>
          <Col flex={1}>Inclusive</Col>
          <Col flex={1} style={{ textAlign: " end", marginTop: 2 }}>
            <a
              onClick={() => {
                setIsShowIEModal(true);
              }}
            >
              <i className="fa fa-plus-circle" style={{ fontSize: 18 }}></i>
            </a>
          </Col>
        </Row>
        <Card bodyStyle={{ padding: 0, minHeight: 168 }}>
          {selectedData.length <= 0 && (
            <Empty
              style={{ height: 168 }}
              description="Please add some data to view"
            />
          )}
          {loading && <Skeleton active />}
          {selectedData.length > 0 &&
            selectedData
              .sort((a, b) => (parseInt(a.key) > parseInt(b.key) ? 1 : -1))
              .filter((id) => id.IsDeleted !== "Y")
              .map((item, index) => {
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
                          key={item.key}
                          allowClear
                          defaultValue={item.IEValue}
                          style={{ padding: "0px 5px", width: "100%" }}
                          placeholder={`Select ${item.IETypeName}`}
                          onChange={(e) => {
                            item.IEValue = e;
                            item.IsDirty = true;
                            setReRender(true);
                            setSelectedData([
                              ...selectedData.filter(
                                (ii) => parseInt(ii.key) !== parseInt(item.key)
                              ),
                              item,
                            ]);
                          }}
                        >
                          {item.dataSource &&
                            item.dataSource.map((i) => {
                              return (
                                <Option
                                  key={i.ValueMember}
                                  value={i.ValueMember}
                                >
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
                            item.IsDirty = true;
                            setReRender(true);
                            setSelectedData([
                              ...selectedData.filter(
                                (ii) => parseInt(ii.key) !== parseInt(item.key)
                              ),
                              item,
                            ]);
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
                          // item.IsDeleted = "Y";
                          // item.IsDirty = true;
                          let data = item;
                          data.IsDeleted = "Y";
                          data.IsDirty = "Y";
                          setReRender(true);
                          setSelectedData([
                            ...selectedData.filter(
                              (ii) => parseInt(ii.key) !== parseInt(item.key)
                            ),
                            data,
                          ]);
                        }}
                      >
                        <DeleteTwoTone />
                      </a>
                    </Col>
                  </Row>
                );
              })}
        </Card>
      </Col>
    </>
  );
};

export default Inclusive;
