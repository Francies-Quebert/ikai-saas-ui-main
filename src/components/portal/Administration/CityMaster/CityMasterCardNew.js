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
  Select,
  Checkbox,
  Cascader,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtCityMaster } from "../../../../store/actions/CityMaster";
import CityMaster from "../../../../models/CityMater";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const CityMasterCardNew = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const [isDefault, setIsDefault] = useState(
    props.formData ? props.formData.IsDefault : true
  );
  const Country = useSelector((state) => state.countryMaster.countryMasters);
  const State = useSelector((state) => state.stateMaster.stateMasters);

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    CityCode: props.formData ? props.formData.CityCode : "",
    CityName: props.formData ? props.formData.CityName : "",
    CountryCode: props.formData ? props.formData.CountryCode : "",
    StateCode: props.formData ? props.formData.StateCode : "",
    lat: props.formData ? props.formData.lat : "",
    lng: props.formData ? props.formData.lng : "",
    IsDefault: props.formData ? props.formData.IsDefault.toString() : "true",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
    residence: props.formData
      ? [props.formData.CountryCode, props.formData.StateCode]
      : [],
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new CityMaster(
      values.CityCode,
      values.CityName,
      values.residence[0],
      values.residence[1],
      values.lat,
      values.lng,
      values.IsDefault === "true" ? true : false,
      values.Status === "true" ? true : false
    );

    console.log(val, "asf");
    dispatch(InsUpdtCityMaster(props.formData ? "U" : "I", val));
  };
  const addressOption = () => {
    let temp = [];
    for (const key in Country) {
      temp.push({
        value: Country[key].CountryCode,
        label: Country[key].CountryName,
        children: stateOption(Country[key].CountryCode),
      });
    }
    return temp;
  };
  const stateOption = (CountryCode) => {
    let state = [];
    State.filter((ii) => ii.CountryCode === CountryCode).map((item) => {
      state.push({
        value: item.StateCode,
        label: item.StateName,
      });
    });
    return state;
  };

  useEffect(() => {
    if (currentTran.isSuccess) {
      form.resetFields();
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={0.37}>
            <CardHeader title={currentTran.formTitle} />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="residence"
                  style={{ marginBottom: 5 }}
                  label="Country / State"
                 
                  rules={[
                    {
                      type: "array",
                      required: true,
                      message: "Please input your country / state name!",
                    },
                  ]}
                >
                  <Cascader showSearch options={addressOption()} />
                </Form.Item>
                <Form.Item
                  name="CityCode"
                  style={{ marginBottom: 5 }}
                  label="City Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your city code!",
                    },
                  ]}
                >
                  <Input style={{textTransform:"uppercase"}} />
                </Form.Item>
                <Form.Item
                  name="CityName"
                  style={{ marginBottom: 5 }}
                  label="City Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your city name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="lat"
                  style={{ marginBottom: 5 }}
                  label="Lattitude"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="lng"
                  style={{ marginBottom: 5 }}
                  label="Longitude"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="IsDefault"
                  style={{ marginBottom: 5 }}
                  label="Default City"
                >
                  <Checkbox
                    checked={isDefault}
                    onChange={(e) => {
                      setIsDefault(e.target.checked);
                    }}
                  ></Checkbox>
                </Form.Item>

                <Form.Item
                  name="Status"
                  label="Status"
                  style={{ marginBottom: 5 }}
                  rules={[{ required: true, message: "Please select Status!" }]}
                >
                  <Radio.Group>
                    <Radio value="true">Active</Radio>
                    <Radio value="false">InActive</Radio>
                  </Radio.Group>
                </Form.Item>
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                <Form.Item noStyle={true}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    style={{ marginRight: 5 }}
                  >
                    Save
                  </Button>

                  <Button
                    type="primary"
                    icon={<RetweetOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={onReset}
                  >
                    Reset
                  </Button>

                  <Button
                    type="primary"
                    icon={<Icon component={RollbackOutlined} />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      dispatch(reInitialize());
                      props.onBackPress();
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    type="primary"
                    icon={<Icon component={PrinterOutlined} />}
                    style={{ marginRight: 5 }}
                    onClick={props.OnPrint}
                  >
                    Print
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default CityMasterCardNew;
