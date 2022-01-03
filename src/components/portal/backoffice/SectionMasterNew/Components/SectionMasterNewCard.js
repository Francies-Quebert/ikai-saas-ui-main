import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Upload,
  message,
  Divider,
  Select,
} from "antd";
import CardHeader from "../../../../common/CardHeader";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  fetchSequenceNextVal,
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../../shared/utility";
import { fetchBranchMasterData } from "../../../../../services/branch-master";
import {
  fetchSectionMasterCardData,
  InsUpdtSecMaster,
} from "../../../../../services/section-master";
import swal from "sweetalert";
// import { is } from "immer/dist/internal";
// import sysSequenceConfig from "../../../../../store/reducers/sys-sequence-config";
const { Option } = Select;

const SectionMasterNewCard = (props) => {
  const initialValues = {
    SecCode: null,
    BranchCode: null,
    SecDesc: null,
    ImageURL: null,
    path: null,
    pathType: null,
    IsActive: true,
  };
  const [isDisable, setIsDisable] = useState({
    add: false,
    edit: !props.formData ? true : false,
  });
  const [branch, setBranch] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [sectionValues, setSectionValues] = useState(initialValues);
  const [url, setUrl] = useState(sectionValues.ImageURL);
  const [imageLoading, setImageLoading] = useState(false);
  const [secCode, setSecCode] = useState(
    props.formData ? props.formData.SecCode : null
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );

  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  // const systemSequenceConfig = useSelector(
  //   (state) => state.sysSequenceConfig.sysSequenceConfig
  // );

  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const mapData = (data) => {
    data.map(async (i) => {
      await setSectionValues({
        SecCode: i.SecCode,
        BranchCode: i.BranchCode,
        SecDesc: i.SecDesc,
        ImageURL: i.ImageURL,
        pathType: i.pathType,
        IsActive: i.IsActive,
      });
      setSecCode(i.SecCode);
      setUrl({
        url:
          i.pathType === "C"
            ? `${FileUploadPath.value1}/${i.ImageURL}`
            : i.ImageURL,
        path: `${i.ImageURL}`,
        pathType: i.pathType,
      });
    });
    // setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchBranchMasterData(CompCode).then((res) => {
      setBranch(res);
    });
    if (props.entryMode === "A") {
      fetchSequenceNextVal(CompCode, "SEC", l_loginUser).then((seqNextVal) => {
        if (seqNextVal.length > 0) {
          if (seqNextVal[0].NextVal) {
            setSecCode(seqNextVal[0].NextVal);
            setSectionValues({
              ...sectionValues,
              SecCode: seqNextVal[0].NextVal,
            });
            setICodeDisable(true);
          }
        }
      });
      setIsLoading(false);
    } else {
      fetchSectionMasterCardData(CompCode, props.formData.SecCode).then(
        (resp) => {
          console.log(resp, "resp");
          try {
            if (resp.length > 0) {
              setSecCode();
              mapData(resp);
              // setSectionValues({ ...sectionValues, SecCode: null });
              // if (props.entryMode === "A") {
              //   swal(
              //     `Section Code ${ props.formData.SecCode} Already Exist`,
              //     "Are you sure you want to edit this item?",
              //     {
              //       buttons: ["Cancel", "Yes!"],
              //     }
              //   ).then(async (val) => {
              //     if (val) {
              //       await mapData(resp);
              //     } else {
              //       setSecCode();
              //       mapData([{ ...initialValues }]);
              //       setSectionValues({ ...sectionValues, SecCode: null });
              //     }
              //   });
              // } else {
              //   mapData(resp);
              // }
            } else {
              mapData([{ ...initialValues }]);
              // setIsLoading(false);
            }
          } catch (err) {
            console.error(err);
          }
        }
      );
      setIsLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   if (secCode) {
  //     setIsLoading(true);

  // }
  // }, [secCode]);

  const onFinish = async () => {
    fetchSectionMasterCardData(CompCode, secCode).then((resp) => {
      try {
        if (resp.length > 0) {
          const data = {
            SecCode: secCode,
            BranchCode: sectionValues.BranchCode,
            SecDesc: sectionValues.SecDesc,
            ImageURL: url ? url.path : null,
            pathType: url ? url.pathType : null,
            IsActive: sectionValues.IsActive,
            updt_usr: l_loginUser,
          };
          if (props.entryMode === "A") {
            swal(
              `Section Code ${secCode} Already Exist`,
              "Are you sure you want to edit this item?",
              {
                buttons: ["Cancel", "Yes!"],
              }
            ).then(async (val) => {
              if (val) {
                if (sectionValues) {
                  //   let tempSecCode = sectionValues.SecCode;
                  //   if (props.entryMode === "A") {
                  //     if(sysSequenceConfig.CofigType === "A") {
                  //       await fetchSequenceNextVal(CompCode, "SEC", l_loginUser).then(
                  //         (seqNextVal) => {
                  //           if (seqNextVal.length > 0) {
                  //             if (seqNextVal[0].NextVal) {
                  //               // setICodeDisable(true);
                  //               tempSecCode = seqNextVal[0].NextVal;
                  //               // setSecCode(seqNextVal[0].NextVal);
                  //               // setSectionValues({
                  //               //   ...sectionValues,
                  //               //   SecCode: seqNextVal[0].NextVal,
                  //               // });
                  //             }
                  //           }
                  //         }
                  //       );
                  //     }
                  //   }

                  swal("Are you sure you want to save this item", {
                    buttons: ["Cancel", "Yes!"],
                  }).then((val) => {
                    if (val) {
                      setIsLoading(true);
                      InsUpdtSecMaster(CompCode, data).then((res) => {
                        if (res.data.message === "successful") {
                          swal("Data saved successfully   !!!", {
                            icon: "success",
                          });

                          props.onSavePress(data);
                          props.onBackPress();
                          setIsLoading(false);
                        } else if (res.data.message === "unsuccessful") {
                          swal(
                            `${
                              res.data.code === "ER_DUP_ENTRY"
                                ? "Duplicate Entry"
                                : "Something Went Wrong Try Again Later...."
                            }`,
                            {
                              icon: "error",
                            }
                          );
                        }
                        setIsLoading(false);
                      });
                    }
                  });
                }
              } else {
                mapData([{ ...initialValues }]);
                // setIsLoading(true);
              }
            });
          } else {
            swal("Are you sure you want to save this item", {
              buttons: ["Cancel", "Yes!"],
            }).then((val) => {
              if (val) {
                setIsLoading(true);
                InsUpdtSecMaster(CompCode, data).then((res) => {
                  if (res.data.message === "successful") {
                    swal("Data saved successfully   !!!", {
                      icon: "success",
                    });

                    props.onSavePress(data);
                    props.onBackPress();
                    setIsLoading(false);
                  } else if (res.data.message === "unsuccessful") {
                    swal(
                      `${
                        res.data.code === "ER_DUP_ENTRY"
                          ? "Duplicate Entry"
                          : "Something Went Wrong Try Again Later...."
                      }`,
                      {
                        icon: "error",
                      }
                    );
                  }
                  setIsLoading(false);
                });
              }
            });
          }
        } else {
          if (sectionValues) {
            //   let tempSecCode = sectionValues.SecCode;
            //   if (props.entryMode === "A") {
            //     if(sysSequenceConfig.CofigType === "A") {
            //       await fetchSequenceNextVal(CompCode, "SEC", l_loginUser).then(
            //         (seqNextVal) => {
            //           if (seqNextVal.length > 0) {
            //             if (seqNextVal[0].NextVal) {
            //               // setICodeDisable(true);
            //               tempSecCode = seqNextVal[0].NextVal;
            //               // setSecCode(seqNextVal[0].NextVal);
            //               // setSectionValues({
            //               //   ...sectionValues,
            //               //   SecCode: seqNextVal[0].NextVal,
            //               // });
            //             }
            //           }
            //         }
            //       );
            //     }
            //   }

            const data = {
              SecCode: secCode,
              BranchCode: sectionValues.BranchCode,
              SecDesc: sectionValues.SecDesc,
              ImageURL: url ? url.path : null,
              pathType: url ? url.pathType : null,
              IsActive: sectionValues.IsActive,
              updt_usr: l_loginUser,
            };
            swal("Are you sure you want to save this item", {
              buttons: ["Cancel", "Yes!"],
            }).then((val) => {
              if (val) {
                setIsLoading(true);
                InsUpdtSecMaster(CompCode, data).then((res) => {
                  if (res.data.message === "successful") {
                    swal("Data saved successfully   !!!", {
                      icon: "success",
                    });

                    props.onSavePress(data);
                    props.onBackPress();
                    setIsLoading(false);
                  } else if (res.data.message === "unsuccessful") {
                    swal(
                      `${
                        res.data.code === "ER_DUP_ENTRY"
                          ? "Duplicate Entry"
                          : "Something Went Wrong Try Again Later...."
                      }`,
                      {
                        icon: "error",
                      }
                    );
                  }
                  setIsLoading(false);
                });
              }
            });
          }
          // setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <>
      <CardHeader title="Add Section" />
      <Row>
        <Col flex={1}>
          <Card
            bordered={true}
            bodyStyle={{ paddingBottom: 5 }}
            loading={isLoading}
          >
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> Branch Code :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Select
                    showSearch
                    allowClear={true}
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    placeholder="Select Branch Code"
                    value={sectionValues.BranchCode}
                    disabled={props.formData}
                    onChange={(val) => {
                      setSectionValues({
                        ...sectionValues,
                        BranchCode: val,
                      });
                      if (val) {
                        setIsDisable({
                          ...isDisable,
                          add: false,
                          edit: false,
                        });
                      } else {
                        setIsDisable({
                          ...isDisable,
                          add: false,
                          edit: true,
                        });
                      }
                    }}
                  >
                    {branch &&
                      branch
                        .filter((i) => i.IsActive === true)
                        .map((h) => {
                          return (
                            <Option key={h.BranchCode} value={h.BranchCode}>
                              {h.BranchName}
                            </Option>
                          );
                        })}
                  </Select>
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> Section Code :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Input
                    value={secCode}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setICodeDisable(true);
                        setSecCode(e.target.value);
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value !== "") {
                        setICodeDisable(true);
                        setSecCode(e.target.value);
                      }
                    }}
                    placeholder="Enter Section Code"
                    disabled={iCodeDisable}
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                Section Description :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Input
                    onChange={(e) => {
                      setSectionValues({
                        ...sectionValues,
                        SecDesc: e.target.value,
                      });
                    }}
                    value={sectionValues.SecDesc}
                    placeholder="Please input section description!"
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                Section Image :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Upload
                    style={{ width: "128px", height: "128px" }}
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
                      setImageLoading(true);
                      return new Promise(function (resolve, reject) {
                        if (DefaultUplodConfig.value1 === "FIREBASE") {
                          UploadImageFirebase(
                            `${CompCode}/Section-Images`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: res.url,
                              path: res.url,
                              pathType: "U",
                            });
                            setImageLoading(false);
                          });
                        } else {
                          UploadImageOwnWebServer(
                            `${CompCode}/${"Section-Images"}/`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: `${
                                FileUploadPath.value1
                              }/${CompCode}/${"Section-Images"}/${
                                res.fileName
                              }`,
                              path: `${CompCode}/${"Section-Images"}/${
                                res.fileName
                              }`,
                              pathType: "C",
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
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                Status :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Radio.Group
                    onChange={(e) => {
                      setSectionValues({
                        ...sectionValues,
                        IsActive: e.target.value,
                      });
                    }}
                    value={sectionValues.IsActive}
                  >
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>InActive</Radio>
                  </Radio.Group>
                </div>
              </Col>
            </Row>
            <Divider
              type="horizontal"
              style={{ marginBottom: 5, marginTop: 5 }}
            />

            <Button
              type="primary"
              // loading={isLoading}
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                onFinish();
                setIsLoading(false);
              }}
              // loading={isLoading}
              // disable={isLoading}
            >
              Save
            </Button>

            <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                setSectionValues(initialValues);
              }}
            >
              Reset
            </Button>

            <Button
              type="primary"
              icon={<Icon component={RollbackOutlined} />}
              style={{ marginRight: 5 }}
              onClick={props.onBackPress}
            >
              Back
            </Button>
            {/* {    setIsLoading(false)} */}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SectionMasterNewCard;
