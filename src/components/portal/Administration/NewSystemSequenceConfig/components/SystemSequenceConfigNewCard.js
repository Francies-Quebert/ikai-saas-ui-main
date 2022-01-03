import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardHeader from "../../../../common/CardHeader";
import Icon, {
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
  notification,
  Radio,
  Row,
  Checkbox,
  Select,
} from "antd";
import _ from "lodash";
import { fetchOtherMasterSequence } from "../../../../../store/actions/appMain";
import {
  fetchSequenceTranMaster,
  InsUpdtSystemSequenceConfigMaster,
} from "../../../../../services/system-sequence";
import swal from "sweetalert";

const SystemSequenceConfigNewCard = (props) => {
  const { Option } = Select;
  const dispatch = useDispatch();

  const initialValues = {
    Id: props.formData ? props.formData.Id : 0,
    TranType: props.formData ? props.formData.TranType : null,
    configType: props.formData ? props.formData.ConfigType : null,
    ResetOn: props.formData ? props.formData.ResetOn : null,
    Preffix: props.formData ? props.formData.Preffix : null,
    Suffix: props.formData ? props.formData.Suffix : null,
    Value: props.formData ? props.formData.Value : null,
    LastGenNo: props.formData ? props.formData.LastGenNo : null,
    EnablePadding: props.formData
      ? props.formData.EnablePadding === "Y"
        ? true
        : false
      : false,
    PaddingLength: props.formData ? props.formData.PaddingLength : null,
    PaddingChar: props.formData ? props.formData.PaddingChar : null,
    IsActive: props.formData
      ? props.formData.IsActive.data[0] === 1
        ? true
        : false
      : true,
  };
  //useState
  const [formData, setFormData] = useState(initialValues);
  const [tranTypes, setTranTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //useEffect for trantypes
  useEffect(() => {
    setIsLoading(true);

    //useEffect for systemsequence
    dispatch(fetchOtherMasterSequence("SEQ"));

    fetchSequenceTranMaster(CompCode).then((res) => {
      setTranTypes(res);
      setIsLoading(false);
    });
  }, []);

  //useSelector
  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const SystemSequence = useSelector((state) => state.AppMain.otherMasterSEQ);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const onReset = () => {
    setFormData(initialValues);
  };

  const onSubmit = () => {
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      const SData = {
        CompCode: CompCode,
        InsUpdtType: props.formData ? "U" : "I",
        Id: formData.Id ? formData.Id : initialValues.Id,
        TranType: formData.TranType,
        ConfigType: formData.configType,
        ResetOn: formData.ResetOn,
        Preffix: formData.Preffix,
        Suffix: formData.Suffix,
        Value: formData.Value,
        LastGenNo: formData.LastGenNo,
        EnablePadding: formData.EnablePadding ? "Y" : "N",
        PaddingLength: formData.PaddingLength,
        PaddingChar: formData.PaddingChar,
        IsActive: formData.IsActive,
        updt_usr: l_loginUser,
      };

      if (val) {
        setIsLoading(true);
        InsUpdtSystemSequenceConfigMaster(SData)
          .then((res) => {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress();
            props.onBackPress();
          })
          .catch((er) => {
            swal("Something went wrong   !!!", {
              icon: "error",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <Row>
        <Col span={16}>
          <CardHeader title={currTran.formTitle} />
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
                <span style={{ color: "red" }}>*</span> Transaction Type :
              </Col>
              <Col
                xl={18}
                lg={18}
                md={18}
                sm={18}
                xs={24}
                style={{ marginBottom: 5 }}
              >
                <Select
                  value={formData.TranType}
                  showSearch
                  disabled={props.formData ? true : false}
                  allowClear={true}
                  style={{ width: "100%", marginLeft: 1 }}
                  optionFilterProp="children"
                  placeholder="Select Type"
                  onChange={(data) =>
                    setFormData({ ...formData, TranType: data })
                  }
                >
                  {tranTypes.map((row, l_index) => {
                    return (
                      <Option key={l_index} value={row.TranCode}>
                        {row.TranDesc}
                      </Option>
                    );
                  })}
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
                <span style={{ color: "red" }}>*</span> Sequence Gen Mode :
              </Col>
              <Col
                xl={18}
                lg={18}
                md={18}
                sm={18}
                xs={24}
                style={{ marginBottom: 5 }}
              >
                <Select
                  showSearch
                  value={formData.configType}
                  allowClear={true}
                  style={{ width: "100%", marginLeft: 1 }}
                  optionFilterProp="children"
                  placeholder="Select Mode"
                  onChange={(value) =>
                    setFormData({ ...formData, configType: value })
                  }
                >
                  <Option value="A">Automatic</Option>
                  <Option value="M">Manual</Option>
                </Select>
              </Col>
            </Row>

            {formData.configType === "A" && (
              <>
                <Row>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    <span style={{ color: "red" }}>*</span> Reset On :
                  </Col>
                  <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Row style={{ marginBottom: 5, marginRight: 8 }}>
                        <Select
                          value={formData.ResetOn}
                          showSearch
                          style={{ width: "377px", marginBottom: 5 }}
                          allowClear={true}
                          optionFilterProp="children"
                          placeholder="Select Rest On"
                          onChange={(value) => {
                            setFormData({ ...formData, ResetOn: value });
                          }}
                        >
                          {SystemSequence &&
                            SystemSequence.map((h, l_index) => {
                              return (
                                <Option key={l_index} value={h.ShortCode}>
                                  {h.MasterDesc}
                                </Option>
                              );
                            })}
                        </Select>
                      </Row>
                      <Input
                        value={formData.LastGenNo}
                        style={{
                          display: "inline-block",
                          width: "calc(55% - 4px)",
                        }}
                        //disabled={false}
                        addonBefore="LastGenNo"
                        min={0}
                        max={9}
                        disabled
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            LastGenNo: e.target.value,
                          })
                        }
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    <span style={{ color: "red" }}>*</span> Sequence :
                  </Col>
                  <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Row // "Preffix"
                        style={{
                          marginBottom: 5,
                          display: "inline-block",
                          width: "calc(33% - 4px)",
                        }}
                      >
                        <Input
                          value={formData.Preffix}
                          addonBefore={"Prefix"}
                          min={0}
                          max={9}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Preffix: e.target.value,
                            })
                          }
                        />
                      </Row>

                      <Row // "Value"
                        style={{
                          display: "inline-block",
                          width: "calc(33% - 4px)",
                          marginLeft: 8,
                          marginRight: 8,
                        }}
                      >
                        <InputNumber
                          value={formData.Value}
                          style={{ width: "100%" }}
                          // addonBefore={"Value"}
                          min={0}
                          // max={20}
                          onChange={(value) =>
                            setFormData({ ...formData, Value: value })
                          }
                        />
                      </Row>

                      <Row // "Suffix"
                        style={{
                          display: "inline-block",
                          width: "calc(35% - 8px)",
                        }}
                      >
                        <Input
                          value={formData.Suffix}
                          addonBefore={"Suffix"}
                          maxLength={1}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              Suffix: e.target.value,
                            });
                          }}
                        />
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Row style={{ marginTop: 6 }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    <span style={{ color: "red" }}>*</span> Padding :
                  </Col>
                  <Col
                    width={100}
                    style={{
                      display: "inline-block",
                      width: "calc(21% - 4px)",
                    }}
                  >
                    <Checkbox
                      checked={formData.EnablePadding}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          EnablePadding: e.target.checked,
                        });
                      }}
                    >
                      Enable
                    </Checkbox>
                  </Col>
                  <Col
                    // "PaddingLength"
                    style={{
                      display: "inline-block",
                      width: "calc(29% - 22px)",
                      marginRight: 3,
                    }}
                  >
                    <Input
                      value={formData.PaddingLength}
                      addonBefore={"Padding Length"}
                      disabled={!formData.EnablePadding}
                      min={0}
                      maxLength={1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          PaddingLength: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col
                    // "PaddingChar"
                    style={{
                      marginInline: 4,
                      display: "inline-block",
                      width: "calc(28% - 8px)",
                    }}
                  >
                    <Input
                      value={formData.PaddingChar}
                      addonBefore=" Padding Character"
                      disabled={!formData.EnablePadding}
                      maxLength={1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          PaddingChar: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </>
            )}
            <Row>
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
              <Col
                xl={14}
                lg={14}
                md={14}
                sm={14}
                xs={24}
                style={{ marginBottom: 14, marginTop: 18 }}
              >
                <Radio.Group
                  defaultValue={true}
                  value={formData.IsActive}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      IsActive: e.target.value,
                    });
                  }}
                >
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>InActive</Radio>
                </Radio.Group>
              </Col>
            </Row>

            <Divider style={{ marginBottom: 5, marginTop: 5 }} />

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              onClick={async () => {
                // if default/manual - trantype , sqe gen mode,status
                // if auto - resetOn ,pref,Value,
                const NANValue = [null, "", undefined];
                if (
                  _.includes(NANValue, formData.configType) ||
                  _.includes(NANValue, formData.TranType) ||
                  _.includes(NANValue, formData.IsActive)
                ) {
                  // old
                  notification.error({
                    message: "Required Fields are Empty",
                    description: (
                      <span>
                        Input's with (<span style={{ color: "red" }}> * </span>)
                        Can't be Empty
                      </span>
                    ),
                    duration: 3,
                  });
                } else {
                  if (formData.configType === "A") {
                    if (
                      _.includes(NANValue, formData.ResetOn) ||
                      _.includes(NANValue, formData.Preffix) ||
                      _.includes(NANValue, formData.Value) ||
                      (_.includes([true,"true"], formData.EnablePadding)
                        ? _.includes(NANValue, formData.PaddingLength) ||
                          _.includes(NANValue, formData.PaddingChar)
                        : false)
                    ) {
                      notification.error({
                        message: "Required Fields are Empty",
                        description: (
                          <span>
                            Input's with (
                            <span style={{ color: "red" }}> * </span>) Can't be
                            Empty
                          </span>
                        ),
                        duration: 3,
                      });
                    } else {
                      onSubmit();
                      console.log("Should Submit");
                    }
                  } else {
                    console.log("Should Submit");
                    onSubmit();
                  }
                }
              }}
              loading={isLoading}
              disabled={isLoading}
            >
              Save
            </Button>

            <Button
              value="reset"
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              onClick={onReset}
              loading={isLoading}
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

export default SystemSequenceConfigNewCard;
