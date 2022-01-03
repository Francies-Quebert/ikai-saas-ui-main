import React, { useEffect, useState } from "react";
import { PlusCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Empty,
  Input,
  InputNumber,
  Row,
  Select,
  Slider,
  Switch,
  TimePicker,
} from "antd";
import { fetchFilterFieldTypeDefination } from "../../../../services/app-route";

const AddAppRouteForm = (props) => {
  const initialData = {
    FeildName: null,
    FeildName: null,
    DataType: null,
    Value1: null,
    Value2: null,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [filterFieldTypeData, setFilterFieldTypeData] = useState([]);
  const [formData, setFormData] = useState(initialData);
  const colSpan = 8;

  useEffect(() => {
    setIsLoading(true);
    fetchFilterFieldTypeDefination(1).then((res) => {
      setFilterFieldTypeData(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading && <Empty />}
      {!isLoading && (
        <Row style={{ display: "block" }}>
          <Col flex={1} className="mb-1.5">
            <Row gutter={[8, 8]}>
              <Col span={colSpan} style={{}}>
                <Row>Filter Type</Row>
                <Row>
                  <Select
                    value={formData.FeildName}
                    style={{ width: "100%" }}
                    placeholder="Select flied name"
                    onChange={(val, aa) => {
                      setFormData({
                        ...formData,
                        FeildName: val,
                        DataType: aa.data ? aa.data.DataType : null,
                      });
                    }}
                  >
                    {filterFieldTypeData.map((obj, idx) => {
                      return (
                        <Select.Option
                          key={idx}
                          value={obj.FieldName}
                          data={obj}
                        >
                          {obj.FieldTitle}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Row>
              </Col>
              <Col span={colSpan} style={{}}>
                <Row>Value 1</Row>
                <Row>
                  <Input
                    style={{}}
                    value={formData.Value1}
                    onChange={(e) => {
                      setFormData({ ...formData, Value1: e.target.value });
                    }}
                    placeholder="Enter Value 1"
                  />
                </Row>
              </Col>
              <Col span={colSpan}>
                <Row>Value 2</Row>
                <Row>
                  <Input
                    value={formData.Value2}
                    style={{}}
                    onChange={(e) => {
                      setFormData({ ...formData, Value2: e.target.value });
                    }}
                    placeholder="Enter Value 2"
                  />
                </Row>
              </Col>
            </Row>
          </Col>
          <Col flex={1}>
            <Button
              type="primary"
              className="mr-1"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                props.onSavePress(formData);
              }}
            >
              Set
            </Button>
            <Button
              type="ghost"
              icon={<RetweetOutlined />}
              onClick={() => {
                props.onBackPress();
              }}
            >
              Back
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default AddAppRouteForm;
