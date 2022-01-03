import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Input, Select, Table, Button, message } from "antd";
import {
  fetchDataItemInfoHdr,
  fetchAddInfoTmplDtl,
} from "../../../../services/item-add-info-template";
import {
  DeleteTwoTone,
  RetweetOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { fetchDataItemAdditionalInfoTemplate } from "../../../../services/item-master";
import _ from "lodash";

let tempInfoData = [];

export const getItemInfoDtlData = () => {
  return tempInfoData;
};

const ItemMasterAddInfo = (props) => {
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const { Option } = Select;
  const refSearch = useRef();
  const [selectedTempId, setSelectedTempId] = useState();
  const [templateHdrData, setTemplateHdrData] = useState([]);
  const [templateDtlData, setTemplateDtlData] = useState([]);
  const [itemAddInfoDtl, setItemAddInfoDtl] = useState([]);

  useEffect(() => {
    fetchDataItemInfoHdr(CompCode).then((res) => {
      setTemplateHdrData(res);
    });
  }, []);

  useEffect(() => {
    if (props.TemplateId) {
      setSelectedTempId(props.TemplateId);
      fetchItemAddInfoTemplate(props.TemplateId);
    } else {
      setSelectedTempId();
      setTemplateDtlData([]);
    }
  }, [props.TemplateId]);

  useEffect(() => {
    if (templateDtlData.length > 0) {
      let tempData = [];
      templateDtlData
        .filter((i) => !i.isDeleted)
        .forEach((item, inx) => {
          tempData.push({
            ...item,
            ItemCode: props.ItemCode,
            TempId: selectedTempId,
            FieldTitle: item.FieldTitle,
            FieldValue: item.FieldValue,
            TmplSrNo: inx + 1,
          });
        });
      // console.log(tempData);
      tempInfoData = {
        hdrData: {
          ItemCode: props.ItemCode,
          TemplateId: selectedTempId,
        },
        dtlData: tempData,
      };
    }
  }, [templateDtlData]);

  const fetchItemAddInfoTemplate = async (templateId) => {
    try {
      if (templateId) {
        let infoTemplateDtlData = [];

        // await fetchAddInfoTmplDtl(selectedTempId).then((res) => {
        //   infoTemplateDtlData = [];
        //   res.forEach((element) => {
        //     infoTemplateDtlData.push({
        //       ...element,
        //       FieldTitle: element.FieldTitle,
        //       FieldValue: element.DefaultValue,
        //     });
        //   });
        // });

        const TemplateDtl = await fetchAddInfoTmplDtl(CompCode, templateId);

        await TemplateDtl.forEach(async (td) => {
          await infoTemplateDtlData.push({
            ...td,
            FieldTitle: td.FieldTitle,
            FieldValue: td.DefaultValue,
            isDeleted: false,
          });
        });

        if (props.Entrymode === "E") {
          // await fetchDataItemAdditionalInfoTemplate(
          //   props.ItemCode,
          //   selectedTempId
          // ).then((res) => {
          //   for (let i = 0; i < res.length; i++) {
          //     const element = res[i];
          //     let findIndexData = infoTemplateDtlData.findIndex(
          //       (aa) => aa.FieldTitle === element.FieldTitle
          //     );
          //     infoTemplateDtlData[findIndexData].FieldTitle =
          //       element.FieldTitle;
          //     infoTemplateDtlData[findIndexData].FieldValue =
          //       element.FieldValue;
          //   }
          // });
          const ItemMasterTempData = await fetchDataItemAdditionalInfoTemplate(
            CompCode,
            props.ItemCode,
            templateId
          );

          for (let i = 0; i < ItemMasterTempData.length; i++) {
            const element = ItemMasterTempData[i];
            let findIndexData = await infoTemplateDtlData.findIndex((aa) =>
              _.includes([null, undefined, ""], element.FieldTitle) ||
              _.includes([null, undefined, ""], aa.FieldTitle)
                ? false
                : aa.FieldTitle === element.FieldTitle
            );
            // console.log(findIndexData, "index data");
            if (findIndexData >= 0) {
              infoTemplateDtlData[findIndexData].FieldTitle =
                element.FieldTitle;
              infoTemplateDtlData[findIndexData].FieldValue =
                element.FieldValue;
            } else {
              await infoTemplateDtlData.push({
                ...element,
                isDeleted: false,
                key: infoTemplateDtlData.length + 1,
              });
            }
          }
        }

        setTemplateDtlData([...infoTemplateDtlData]);
      } else {
        setTemplateDtlData([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Field Title",
      dataIndex: "FieldTitle",
      width: 150,
      render: (text, record) => {
        return (
          <>
            {record.isAddedNew ? (
              <Input
                placeholder="Enter Field Title"
                value={record.FieldTitle}
                onBlur={(e) => {
                  let tempTable = templateDtlData;
                  let findIndex = tempTable.findIndex(
                    (aa) => aa.key == record.key
                  );

                  if (
                    templateDtlData.find(
                      (i) =>
                        !i.isDeleted &&
                        i.key !== record.key &&
                        i.FieldTitle === e.target.value &&
                        i.FieldTitle !== null
                    )
                  ) {
                    message.error("Duplicate Entry");
                    tempTable[findIndex].FieldTitle = null;
                    setTemplateDtlData([...templateDtlData]);
                  } else {
                    tempTable[findIndex].FieldTitle = e.target.value;
                    setTemplateDtlData([...templateDtlData]);
                  }
                }}
                onChange={(e) => {
                  let tempTable = templateDtlData;
                  let findIndex = tempTable.findIndex(
                    (aa) => aa.key == record.key
                  );
                  tempTable[findIndex].FieldTitle = e.target.value;
                  setTemplateDtlData([...tempTable]);
                }}
              />
            ) : (
              <span>
                {record.IsCompulsary === "Y" ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )}
                {record.FieldTitle}
              </span>
            )}
          </>
        );
      },
    },
    {
      title: "Field Value",
      dataIndex: "FieldValue",
      render: (text, record) => {
        return (
          <Input
            placeholder="Enter Value"
            value={record.FieldValue}
            disabled={record.IsReadOnly === "Y" ? true : false}
            onChange={(e) => {
              let tempTable = templateDtlData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].FieldValue = e.target.value;
              setTemplateDtlData([...tempTable]);
            }}
          />
        );
      },
    },
    {
      width: 30,
      render: (txt, record) => {
        return record.isAddedNew && record.isAddedNew === true ? (
          <a
            onClick={() => {
              let newData = [...templateDtlData];
              record.isDeleted = true;
              newData[
                newData.findIndex((ii) => ii.key === record.key)
              ] = record;
              setTemplateDtlData([...newData]);
              // setTemplateDtlData(
              //   templateDtlData.filter((item) => item.key !== record.key)
              // );
            }}
          >
            <DeleteTwoTone />
          </a>
        ) : (
          ""
        );
      },
    },
  ];

  return (
    <>
      <Card
        bodyStyle={{ padding: "0px 7px", width: 500 }}
        style={{ borderBottom: 0, width: 500 }}
      >
        <div style={{ margin: "5px 0px", display: "block" }}>
          <span
            style={{
              padding: 2,
              display: "flex",
              backgroundColor: "#f9f9f9",
              border: "1px solid var(--app-theme-color)",
            }}
          >
            <span
              style={{ fontWeight: 500, marginRight: 5, alignSelf: "center" }}
            >
              Template :
            </span>
            <span style={{ marginRight: 10, flex: 1 }}>
              <Select
                placeholder={"Select Template"}
                style={{ width: "100%" }}
                allowClear
                showSearch
                optionFilterProp="children"
                value={selectedTempId}
                onChange={(val) => {
                  setTemplateDtlData([]);
                  setSelectedTempId(val);
                }}
              >
                {templateHdrData.length > 0 &&
                  templateHdrData.map((i) => (
                    <Option key={i.TempId} value={i.TempId}>
                      {i.TemplateName}
                    </Option>
                  ))}
              </Select>
            </span>
            <span style={{ marginRight: 5 }}>
              <Button
                ref={refSearch}
                disabled={templateDtlData.length > 0}
                icon={<SearchOutlined />}
                onClick={() => {
                  if (selectedTempId) {
                    fetchItemAddInfoTemplate(selectedTempId);
                  } else {
                    message.error("Select Template");
                    setTemplateDtlData([]);
                  }
                }}
                type="primary"
              >
                Show
              </Button>
            </span>
            <span style={{}}>
              <Button
                icon={<RetweetOutlined />}
                type="primary"
                onClick={() => {
                  setSelectedTempId();
                  setTemplateDtlData([]);
                }}
              >
                Reset
              </Button>
            </span>
          </span>
          <span style={{ height: 200 }}>
            <div>
              <Table
                dataSource={templateDtlData.filter(
                  (ii) => ii.isDeleted === false
                )}
                bordered
                style={{ height: 180 }}
                scroll={{ y: 150 }}
                columns={columns}
                pagination={false}
              />
            </div>
            <div
              style={{
                padding: "0px 5px",
              }}
            >
              <Button
                type="dashed"
                style={{
                  borderColor: "var(--app-theme-color)",
                  width: "100%",
                }}
                disabled={!selectedTempId}
                onClick={() => {
                  if (
                    templateDtlData.find(
                      (aa) =>
                        (!aa.isDeleted &&
                          aa.FieldTitle === null &&
                          aa.FieldTitle === "") ||
                        (aa.FieldValue === null && aa.FieldValue === "")
                    )
                  ) {
                    message.error("Fields Cannot Be Empty");
                  } else {
                    let newData = [];
                    let i = templateDtlData.length;
                    let iKey = 1;

                    while (i < templateDtlData.length) {
                      newData.push({
                        ...templateDtlData[i],
                        key: templateDtlData[i].isDeleted === false ? iKey : 0,
                      });
                      if (templateDtlData[i].isDeleted === false) {
                        iKey++;
                      }
                      i++;
                    }
                    newData = [
                      ...newData,
                      {
                        key: templateDtlData.length + 1,
                        SrNo: 0,
                        FieldTitle: "",
                        FieldValue: "",
                        isAddedNew: true,
                        isDeleted: false,
                      },
                    ];

                    setTemplateDtlData([...templateDtlData, ...newData]);
                  }
                }}
              >
                Add New Row
              </Button>
            </div>
          </span>
        </div>
      </Card>
    </>
  );
};

export default ItemMasterAddInfo;
