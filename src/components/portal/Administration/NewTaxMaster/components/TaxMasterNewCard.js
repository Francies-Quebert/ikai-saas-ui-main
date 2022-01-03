import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Select,
  InputNumber,
  Radio,
  Button,
  Divider,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import CardHeader from "../../../../common/CardHeader";
import Icon, {
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import swal from "sweetalert";
import _ from "lodash";
import {
  fetchTaxMasterData,
  InsUpdtTaxMaster,
} from "../../../../../services/taxMaster";
const { Option } = Select;

const TaxMasterNewCard = (props) => {
  const initialValues = {
    TaxCode: props.formData ? props.formData.TaxCode : null,
    TaxName: props.formData ? props.formData.TaxName : null,
    TaxType: props.formData ? props.formData.TaxType : null,
    TranType: props.formData ? props.formData.TranType : null,
    TaxPer: props.formData ? props.formData.TaxPer : null,
    IGSTPer: props.formData ? props.formData.IGSTPer : null,
    CGSTPer: props.formData ? props.formData.CGSTPer : null,
    SGSTPer: props.formData ? props.formData.SGSTPer : null,
    UTSTPer: props.formData ? props.formData.UTSTPer : null,
    CESSPer: props.formData ? props.formData.CESSPer : null,
    SURCHARGPer: props.formData ? props.formData.SURCHARGPer : null,
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [taxData, setTaxData] = useState([]);
  const [btnLoding, setbtnLoding] = useState(false);

  //useSelector
  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  //useEffect
  useEffect(() => {
    setIsLoading(true);
    fetchTaxMasterData(CompCode).then((res) => {
      setTaxData(res);

      setIsLoading(false);
    });
  }, []);

  // reset field
  const onReset = () => {
    setFormData(initialValues);
  };

  //submit page
  const onFinish = (values) => {
    setbtnLoding(true);
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((xx) => {
      const Tdata = {
        TaxCode: formData.TaxCode,
        TaxName: formData.TaxName,
        TaxType: formData.TaxType,
        TranType: formData.TranType,
        TaxPer: formData.TaxPer,
        IGSTPer: formData.IGSTPer,
        CGSTPer: formData.CGSTPer,
        SGSTPer: formData.SGSTPer,
        UTSTPer: formData.UTSTPer,
        CESSPer: formData.CESSPer,
        SURCHARGPer: formData.SURCHARGPer,
        IsActive: formData.IsActive,
        updt_usrId: l_loginUser,
        CompCode: CompCode,
      };
      setbtnLoding(false);
      if (xx) {
        // console.log(Tdata, "finish");
        InsUpdtTaxMaster(Tdata)
          .then((res) => {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress(Tdata);
            props.onBackPress();
          })
          .catch((er) => {
            swal("Something went wrong   !!!", {
              icon: "error",
            });
          })
          .finally(() => {
            setbtnLoding(false);
          });
      }
    });
  };
  return (
    <>
      <Row>
        <Col flex={1}>
          <CardHeader title={props.title ? props.title : currTran.formTitle} />
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
                <span style={{ color: "red" }}>*</span> Tax Code :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Input
                  value={formData.TaxCode}
                  maxLength={10}
                  style={{ textTransform: "uppercase" }}
                  placeholder="Please enter Tax Code"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      TaxCode: e.target.value,
                    })
                  }
                  disabled={props.formData ? true : false}
                />
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
                <span style={{ color: "red" }}>*</span> Tax Name :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Input
                  value={formData.TaxName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      TaxName: e.target.value,
                    })
                  }
                />
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
                <span style={{ color: "red" }}>*</span> Tax Type :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Select
                  value={formData.TaxType}
                  style={{ width: "100%" }}
                  allowClear
                  showSearch
                  placeholder="Select Tax Type"
                  optionFilterProp="children"
                  onChange={(value) =>
                    setFormData({ ...formData, TaxType: value })
                  }
                >
                  <Option value="G">GST</Option>
                  <Option value="V">VAT</Option>
                </Select>
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
                <span style={{ color: "red" }}>*</span> Tran Type :
              </Col>
              <Col
                xl={14}
                lg={14}
                md={14}
                sm={14}
                xs={24}
                style={{ display: "flex" }}
              >
                <Select
                  value={formData.TranType}
                  style={{ width: "100", flex: 1 }}
                  // allowClear
                  showSearch
                  placeholder="Select Tran Type"
                  optionFilterProp="children"
                  onChange={(value) =>
                    setFormData({ ...formData, TranType: value })
                  }
                >
                  <Option value="I">Inward</Option>
                  <Option value="O">Outward</Option>
                  <Option value="B">Both</Option>
                </Select>
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
                <span style={{ color: "red" }}>*</span> Tax :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <InputNumber
                  precision={3}
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  value={formData.TaxPer}
                  onChange={(value) =>
                    setFormData({ ...formData, TaxPer: value })
                  }
                />
              </Col>
            </Row>

            {/* <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> IGST :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Row style={{ marginBottom: 5, flex: 1 }}>
                    <InputNumber
                      precision={3}
                      max={100}
                      style={{ width: "100%" }}
                      value={formData.IGSTPer}
                      onChange={(value) =>
                        setFormData({ ...formData, IGSTPer: value })
                      }
                    />
                  </Row>
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
                <span style={{ color: "red" }}>*</span> CGST :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Row style={{ marginBottom: 5, flex: 1 }}>
                    <InputNumber
                      precision={3}
                      max={100}
                      style={{ width: "100%" }}
                      value={formData.CGSTPer}
                      onChange={(value) =>
                        setFormData({ ...formData, CGSTPer: value })
                      }
                    />
                  </Row>
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
                <span style={{ color: "red" }}>*</span> SGST :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Row style={{ marginBottom: 5, flex: 1 }}>
                    <InputNumber
                      precision={3}
                      max={100}
                      style={{ width: "100%" }}
                      value={formData.SGSTPer}
                      onChange={(value) =>
                        setFormData({ ...formData, SGSTPer: value })
                      }
                    />
                  </Row>
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
                <span style={{ color: "red" }}>*</span> UTST :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Row style={{ marginBottom: 5, flex: 1 }}>
                    <InputNumber
                      precision={3}
                      max={100}
                      style={{ width: "100%" }}
                      value={formData.UTSTPer}
                      onChange={(value) =>
                        setFormData({ ...formData, UTSTPer: value })
                      }
                    />
                  </Row>
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
                <span style={{ color: "red" }}>*</span> CESS :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Row style={{ marginBottom: 5, flex: 1 }}>
                    <InputNumber
                      precision={3}
                      max={100}
                      style={{ width: "100%" }}
                      value={formData.CESSPer}
                      onChange={(value) =>
                        setFormData({ ...formData, CESSPer: value })
                      }
                    />
                  </Row>
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
                <span style={{ color: "red" }}>*</span> SURCHARG :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Row style={{ marginBottom: 5, flex: 1 }}>
                    <InputNumber
                      precision={3}
                      max={100}
                      style={{ width: "100%" }}
                      value={formData.SURCHARGPer}
                      onChange={(value) =>
                        setFormData({ ...formData, SURCHARGPer: value })
                      }
                    />
                  </Row>
                </div>
              </Col>
            </Row> */}

            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> Status :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Radio.Group
                  value={formData.IsActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      IsActive: e.target.value,
                    })
                  }
                >
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>InActive</Radio>
                </Radio.Group>
              </Col>
            </Row>

            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              onClick={async () => {
                if (
                  _.includes([null, ""], formData.TaxCode) ||
                  _.includes([null, ""], formData.TaxName) ||
                  _.includes([null, ""], formData.TaxType) ||
                  _.includes([null, ""], formData.TranType) ||
                  _.includes([null, ""], formData.TaxPer)
                  // _.includes([null, ""], formData.IGSTPer) ||
                  // _.includes([null, ""], formData.CGSTPer) ||
                  // _.includes([null, ""], formData.UTSTPer) ||
                  // _.includes([null, ""], formData.CESSPer) ||
                  // _.includes([null, ""], formData.SURCHARGPer)
                ) {
                  notification.error({
                    message: "Required Fields are Empty",
                    description: (
                      <span>
                        Input's with (<span style={{ color: "red" }}> * </span>)
                        Can't be Empty
                      </span>
                    ),
                    duration: 2,
                  });
                } else {
                  onFinish();
                }
              }}
              loading={btnLoding}
              disabled={btnLoding}
            >
              Save
            </Button>

            <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              onClick={onReset}
              loading={btnLoding}
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
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TaxMasterNewCard;
