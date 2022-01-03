import {
  LoadingOutlined,
  PlusOutlined,
  PrinterOutlined,
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  InputNumber,
  message,
  notification,
  Radio,
  Row,
  Spin,
  Upload,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";
import CardHeader from "../../../common/CardHeader";
import { useSelector, useDispatch } from "react-redux";
import {
  InsUpdtAppLayoutDtl,
  // fetchLayoutTypeConfigDtl,
} from "../../../../services/app-layout";

const labelColSpan = 8;
const TextColSpan = 10;

const AppLayoutDtlCard = (props) => {
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  // console.log(props, "the");
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const initialData = {
    Id: props.data && props.data.Id ? props.data.Id : 0,
    LayoutId:
      props.hdrData && props.hdrData.LayoutId
        ? props.hdrData.LayoutId
        : props.data.LayoutId || null,
    LayoutType:
      props.hdrData && props.hdrData.LayoutType
        ? props.hdrData.LayoutType
        : null,
    PromoTitle:
      props.data && props.data.PromoTitle ? props.data.PromoTitle : null,
    PromoImageUri: props.data
      ? props.data.pathType === "C"
        ? `${FileUploadPath.value1}/${props.data.PromoImageUri}`
        : props.data.PromoImageUri
      : "",
    path: props.data && props.data.path ? props.data.path : null,
    pathType: props.data && props.data.pathType ? props.data.pathType : null,
    RouteCode: props.data && props.data.RouteCode ? props.data.RouteCode : null,
    SysOption1:
      props.data && props.data.SysOption1 ? props.data.SysOption1 : null,
    SysOption2:
      props.data && props.data.SysOption2 ? props.data.SysOption2 : null,
    SysOption3:
      props.data && props.data.SysOption3 ? props.data.SysOption3 : null,
    SysOption4:
      props.data && props.data.SysOption4 ? props.data.SysOption4 : null,
    SysOption5:
      props.data && props.data.SysOption5 ? props.data.SysOption5 : null,
    OrderBy: props.data && props.data.OrderBy ? props.data.OrderBy : null,
    IsActive: props.data && props.data.IsActive ? props.data.IsActive : true,
  };
  const [dtlData, setDtlData] = useState(initialData);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState(dtlData.PromoImageUri);
  const [isLoading, setIsLoading] = useState(false);

  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );

  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  useEffect(() => {
    setUrl({
      url: props.data
        ? props.data.pathType === "C"
          ? `${FileUploadPath.value1}/${props.data.PromoImageUri}`
          : props.data.PromoImageUri
        : null,
      path: props.data ? `${props.data.PromoImageUri}` : null,
      pathType: props.data ? props.data.pathType : null,
    });
  }, []);

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const onFinish = () => {
    if (dtlData) {
      setIsLoading(true);
      const data = {
        CompCode: CompCode,
        DeviceType: props.DeviceType,
        Id: dtlData.Id,
        LayoutId: dtlData.LayoutId,
        PromoTitle: dtlData.PromoTitle,
        PromoImageUri: url ? url.path : null,
        pathType: url ? url.pathType : null,
        RouteCode: dtlData.RouteCode,
        SysOption1: dtlData.SysOption1,
        SysOption2: dtlData.SysOption2,
        SysOption3: dtlData.SysOption3,
        SysOption4: dtlData.SysOption4,
        SysOption5: dtlData.SysOption5,
        OrderBy: dtlData.OrderBy,
        IsActive: dtlData.IsActive,
        updt_usr: l_loginUser,
      };
      InsUpdtAppLayoutDtl(data).then((res) => {
        notification.success({
          message: "Succesfull",
          description: "Data saved Successfully, ",
        });
        setIsLoading(false);
        props.onBackPress();
      });
    }
  };

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={0.37}>
            <CardHeader title="App Layout Detail Form" />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    HomeScreen Title:
                  </Col>
                  <Col span={TextColSpan}>
                    <Input
                      placeholder="Please input Homescreen Title!"
                      value={dtlData.PromoTitle}
                      onChange={(e) => {
                        setDtlData({ ...dtlData, PromoTitle: e.target.value });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    HomeScreen Image:
                  </Col>
                  <Col span={TextColSpan}>
                    <Upload
                      beforeUpload={(file) => {
                        return new Promise(function (resolve, reject) {
                          if (file.size / 1024 <= 3000) {
                            return resolve(true);
                          } else {
                            message.error("Image must smaller than 3MB!");
                            return reject(false);
                          }
                        });
                      }}
                      action={(file) => {
                        // console.log(file,"saiu")
                        setImageLoading(true);
                        return new Promise(function (resolve, reject) {
                          if (DefaultUplodConfig.value1 === "FIREBASE") {
                            UploadImageFirebase(
                              `${CompCode}/AppLayout`,
                              file
                            ).then((res) => {
                              setUrl(res.url);
                              setImageLoading(false);
                            });
                          } else {
                            UploadImageOwnWebServer(
                              `${CompCode}/${"AppLayout"}/`,
                              file
                            ).then((res) => {
                              setUrl({
                                url: `${
                                  FileUploadPath.value1
                                }/${CompCode}/${"AppLayout"}/${res.fileName}`,
                                path: `${CompCode}/${"AppLayout"}/${
                                  res.fileName
                                }`,
                                pathType:
                                  DefaultUplodConfig.value1 === "OWN"
                                    ? "C"
                                    : "U",
                              });
                            });
                          }
                        });
                      }}
                      listType="picture-card"
                      multiple={false}
                    >
                      {url ? (
                        <img src={url.url} style={{ width: "100%" }} />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    Route Code:
                  </Col>
                  <Col span={TextColSpan}>
                    <Input
                      placeholder="Please input Homescreen Title!"
                      value={dtlData.RouteCode}
                      onChange={(e) => {
                        setDtlData({ ...dtlData, RouteCode: e.target.value });
                      }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    SysOption1:
                  </Col>
                  <Col span={TextColSpan}>
                    <Input
                      placeholder="Please input SysOption1!"
                      value={dtlData.SysOption1}
                      onChange={(e) => {
                        setDtlData({ ...dtlData, SysOption1: e.target.value });
                      }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    SysOption2:
                  </Col>
                  <Col span={TextColSpan}>
                    <Input
                      placeholder="Please input SysOption2!"
                      value={dtlData.SysOption2}
                      onChange={(e) => {
                        setDtlData({ ...dtlData, SysOption2: e.target.value });
                      }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    SysOption3:
                  </Col>
                  <Col span={TextColSpan}>
                    <Input
                      placeholder="Please input SysOption3!"
                      value={dtlData.SysOption3}
                      onChange={(e) => {
                        setDtlData({ ...dtlData, SysOption3: e.target.value });
                      }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    SysOption4:
                  </Col>
                  <Col span={TextColSpan}>
                    <Input
                      placeholder="Please input SysOption4!"
                      value={dtlData.SysOption4}
                      onChange={(e) => {
                        setDtlData({ ...dtlData, SysOption4: e.target.value });
                      }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    SysOption5:
                  </Col>
                  <Col span={TextColSpan}>
                    <Input
                      placeholder="Please input SysOption5!"
                      value={dtlData.SysOption5}
                      onChange={(e) => {
                        setDtlData({ ...dtlData, SysOption5: e.target.value });
                      }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    Order By:
                  </Col>
                  <Col span={TextColSpan}>
                    <InputNumber
                      placeholder="Please input OrderBy!"
                      value={dtlData.OrderBy}
                      onChange={(val) => {
                        setDtlData({ ...dtlData, OrderBy: val });
                      }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row style={{ padding: 6 }}>
                  <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                    Status:
                  </Col>
                  <Col span={TextColSpan}>
                    <Radio.Group
                      value={dtlData.IsActive}
                      onChange={(e) => {
                        setDtlData({ ...dtlData, IsActive: e.target.value });
                      }}
                    >
                      <Radio value={true}>Active</Radio>
                      <Radio value={false}>InActive</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>

              <Divider style={{ marginBottom: 5, marginTop: 5 }} />
              <Col>
                <Row style={{ padding: 6 }}>
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        onFinish();
                        props.onBackPress();
                      }}
                    >
                      Save
                    </Button>

                    <Button
                      type="primary"
                      icon={<RetweetOutlined />}
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        setDtlData(initialData);
                      }}
                    >
                      Reset
                    </Button>

                    <Button
                      type="primary"
                      icon={<RollbackOutlined />}
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        props.onBackPress();
                      }}
                    >
                      Back
                    </Button>

                    {/* <Button
                      type="primary"
                      icon={<PrinterOutlined />}
                      style={{ marginRight: 5 }}
                      // onClick={props.OnPrint}
                    >
                      Print
                    </Button> */}
                  </Col>
                </Row>
              </Col>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default AppLayoutDtlCard;
