import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Spin,
  Switch,
  message,
  Divider,
  Table,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { fetchItemAddInfoTemplDtl } from "../../../../services/item-add-info";
import Icon, {
  DeleteTwoTone,
  PrinterOutlined,
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  InsUpdtItemInfoTemplate,
  InsUpdtItemInfoTemp,
} from "../../../../services/item-add-info-template";
import swal from "sweetalert";

const ItemAddInfoCardNew = (props) => {
  const initialTable = [
    {
      key: 0,
      SrNo: 0,
      FieldTitle: null,
      DefaultValue: null,
      orderBy: null,
      IsReadOnly: "N",
      IsCompulsary: "N",
      isDeleted: false,
    },
  ];
  const [formData, setFormData] = useState({
    TempId: props.formData ? props.formData.TempId : 0,
    TemplateName: props.formData ? props.formData.TemplateName : "",
    IsActive: props.formData ? props.formData.IsActive : true,
    dtlData: [{ ...initialTable[0] }],
  });
  const currentTran = useSelector((state) => state.currentTran);
  const l_LoginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    if (formData.TempId) {
      fetchItemAddInfoTemplDtl(CompCode, formData.TempId).then((res) => {
        if (res.length > 0) {
          setFormData({ ...formData, dtlData: res });
        } else {
          setFormData({ ...formData, dtlData: res });
        }
      });
    }
  }, [formData.TempId]);

  const onFinish = (values) => {
    if (
      formData.dtlData.find(
        (aa) =>
          (aa.FieldTitle === null || aa.FieldTitle === "") &&
          aa.isDeleted === false
      ) ||
      formData.TemplateName === null ||
      formData.TemplateName === ""
    ) {
      message.error("Fields Cannot Be Empty");
    } else {
      const data = {
        Hdr: {
          InsUpdtType: props.formData ? "U" : "I",
          TempId: formData.TempId,
          TemplateName: formData.TemplateName,
          IsActive: formData.IsActive,
          updt_usrId: l_LoginUser,
        },
        Dtl: formData.dtlData,
      };

      swal("Are you sure you want to save this item", {
        buttons: ["Cancel", "Yes!"],
      }).then((resp) => {
        if (resp) {
          InsUpdtItemInfoTemp(CompCode, data).then((res) => {
            if (res.data.message === "successful") {
              swal("Data saved successfully   !!!", {
                icon: "success",
              });
              props.onBackPress();
              props.onSavePress(res.data.data);
            } else if (res.data.message === "unsuccessful") {
              swal(
                `${
                  res.data.data.code === "ER_DUP_ENTRY"
                    ? "Duplicate Entry"
                    : "Something Went Wrong Try Again Later...."
                }`,
                {
                  icon: "error",
                }
              );
            }
          });
        }
      });
    }
  };

  const columns = [
    {
      title: "Field Title",
      dataIndex: "FieldTitle",
      width: "15%",
      render: (text, record) => {
        return (
          <Input
            placeholder="Enter Field Title"
            value={record.FieldTitle}
            onChange={(e) => {
              let tempTable = formData.dtlData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].FieldTitle = e.target.value;
              setFormData({
                ...formData,
                dtlData: [...tempTable],
              });
            }}
          />
        );
      },
    },
    {
      title: "Default Value",
      dataIndex: "DefaultValue",
      render: (text, record) => {
        return (
          <Input
            placeholder="Enter Default Value"
            value={record.DefaultValue}
            onChange={(e) => {
              let tempTable = formData.dtlData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].DefaultValue = e.target.value;
              setFormData({
                ...formData,
                dtlData: [...tempTable],
              });
            }}
          />
        );
      },
    },
    {
      title: "Order By",
      dataIndex: "orderBy",
      width: "10%",
      render: (text, record) => {
        return (
          <Input
            placeholder="Enter Order By"
            type="number"
            value={record.orderBy}
            onChange={(e) => {
              let tempTable = formData.dtlData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].orderBy = e.target.value;
              setFormData({
                ...formData,
                dtlData: [...tempTable],
              });
            }}
          />
        );
      },
    },
    {
      align: "center",
      title: "Read Only",
      dataIndex: "IsReadOnly",
      width: "10%",
      render: (text, record) => {
        return (
          <Switch
            checkedChildren="Yes"
            unCheckedChildren="No"
            checked={record.IsReadOnly === "Y"}
            onChange={(e) => {
              let tempTable = formData.dtlData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].IsReadOnly = e ? "Y" : "N";
              setFormData({
                ...formData,
                dtlData: [...tempTable],
              });
            }}
          />
        );
      },
    },
    {
      align: "center",
      title: "Compulsary",
      width: "10%",
      dataIndex: "IsCompulsary",
      render: (text, record) => {
        return (
          <Switch
            checkedChildren="Yes"
            unCheckedChildren="No"
            checked={record.IsCompulsary === "Y"}
            onChange={(e) => {
              let tempTable = formData.dtlData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].IsCompulsary = e ? "Y" : "N";
              setFormData({
                ...formData,
                dtlData: [...tempTable],
              });
            }}
          />
        );
      },
    },
    {
      title: "",
      dataIndex: "key",
      align: "center",
      fixed: "right",
      width: 50,
      render: (text, record) => {
        return (
          <>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                setTimeout(() => {
                  let tempTable = formData.dtlData;
                  let findIndex = tempTable.findIndex(
                    (aa) => aa.key == record.key
                  );
                  tempTable[findIndex].isDeleted = true;
                  let newData = [];
                  let i = 0;
                  let iKey = 1;
                  while (i < tempTable.length) {
                    newData.push({
                      ...tempTable[i],
                      key: tempTable[i].isDeleted === false ? iKey : 0,
                    });
                    if (tempTable[i].isDeleted === false) {
                      iKey++;
                    }
                    i++;
                  }
                  setFormData({ ...formData, dtlData: newData });
                }, 100);
              }}
            >
              <DeleteTwoTone twoToneColor="#ff1919" />
            </span>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Col flex={1}>
          <CardHeader
            title={props.title ? props.title : currentTran.formTitle}
          />
          <Card bordered={true} bodyStyle={{ padding: 5 }}>
            <Row style={{ display: "block" }}>
              <Col flex={1}>
                <Row style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      alignSelf: "center",
                      padding: "5px 5px 7px 0px",
                      width: "30%",
                    }}
                  >
                    <Col
                      style={{
                        marginRight: 5,
                        fontWeight: 500,
                        alignSelf: "center",
                      }}
                    >
                      <span style={{ color: "red" }}>*</span> Template Name :
                    </Col>
                    <Col style={{ flex: 1 }}>
                      <Input
                        placeholder="Enter Template Name"
                        style={{ flex: 1 }}
                        value={formData.TemplateName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            TemplateName: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignSelf: "center",
                      padding: "5px 5px 7px 0px",
                    }}
                  >
                    <Col style={{ marginRight: 5, fontWeight: 500 }}>
                      <span style={{ color: "red" }}>*</span> Status :
                    </Col>
                    <Col>
                      <Switch
                        checkedChildren="Active"
                        unCheckedChildren="In Active"
                        checked={formData.IsActive}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            IsActive: e,
                          });
                        }}
                      />
                    </Col>
                  </div>
                </Row>
              </Col>
              <Col flex={1}>
                <Table
                  dataSource={formData.dtlData.filter(
                    (tt) => tt.isDeleted === false
                  )}
                  bordered
                  pagination={false}
                  columns={columns}
                />
                <div
                  style={{
                    padding: "0px 5px",
                  }}
                >
                  <Button
                    type="dashed"
                    // ref={refAddByProduct}
                    style={{
                      borderColor: "var(--app-theme-color)",
                      width: "100%",
                    }}
                    onClick={() => {
                      if (
                        formData.dtlData.find(
                          (aa) =>
                            (aa.FieldTitle === null || aa.FieldTitle === "") &&
                            aa.isDeleted === false
                        )
                      ) {
                        message.error("Field Title Cannot Be Empty");
                      } else {
                        let newData = [];
                        let i = formData.dtlData.length;
                        let iKey = 1;

                        while (i < formData.dtlData.length) {
                          newData.push({
                            ...formData.dtlData[i],
                            key:
                              formData.dtlData[i].isDeleted === false
                                ? iKey
                                : 0,
                          });
                          if (formData.dtlData[i].isDeleted === false) {
                            iKey++;
                          }
                          i++;
                        }
                        newData = [
                          ...newData,
                          {
                            key: formData.dtlData.length + 1,
                            FieldTitle: null,
                            DefaultValue: null,
                            orderBy: 0,
                            IsReadOnly: "N",
                            IsCompulsary: "N",
                            isDeleted: false,
                            SrNo: formData.dtlData.length + 1,
                          },
                        ];

                        setFormData({
                          ...formData,
                          dtlData: [...formData.dtlData, ...newData],
                        });
                      }
                    }}
                  >
                    Add New Row
                  </Button>
                </div>
              </Col>
            </Row>

            <Divider style={{ marginBottom: 5, marginTop: 5 }} />

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                onFinish();
              }}
            >
              Save
            </Button>

            {/* <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              //   onClick={}
            >
              Reset
            </Button> */}

            <Button
              type="primary"
              icon={<Icon component={RollbackOutlined} />}
              style={{ marginRight: 5 }}
              onClick={() => {
                props.onBackPress();
              }}
            >
              Back
            </Button>
            <Button
              type="primary"
              icon={<Icon component={PrinterOutlined} />}
              style={{ marginRight: 5 }}
              //   onClick={props.OnPrint}
            >
              Print
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ItemAddInfoCardNew;
