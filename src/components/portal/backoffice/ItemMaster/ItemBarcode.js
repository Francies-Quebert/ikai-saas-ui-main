import React, { useEffect, useState } from "react";
import {
  message,
  Form,
  Col,
  Card,
  Input,
  Button,
  Row,
  Table,
  Popconfirm,
  Empty,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTwoTone, PlusCircleOutlined } from "@ant-design/icons";
import { fetchItemBarcode } from "../../../../store/actions/ItemMaster";
import {
  getValidateItemMaster,
  ValidateItemBarcode,
} from "../../../../services/item-master";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

let data = [];

export const getTableData = () => {
  return data;
};

let DelData = [];
export const deletedBarcode = () => {
  return DelData;
};

const ItemBarcode = (props) => {
  const dispatch = useDispatch();
  const [formBarcode] = Form.useForm();
  const [count, setCount] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const barData = useSelector((state) => state.ItemMaster.ItemBarcode);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(fetchItemBarcode(props.ItemCode !== "" ? props.ItemCode : null));
    DelData = [];
  }, [props.ItemCode]);
  useEffect(() => {
    data = dataSource;
  }, [dataSource]);

  useEffect(() => {
    // console.log("object")
    setDataSource([]);
  }, [props.ResetClicked]);

  useEffect(() => {
    let tcount = 0;
    let temp = [];
    barData.map((item) => {
      temp.push({ key: tcount, ...item, isDirty: false });
      tcount = tcount + 1;
    });
    setCount(tcount + 1);
    setDataSource(temp);
  }, [barData]);

  const initialValues = {
    Barcode: "",
  };
  const onBarCodeAdd = async (val) => {
    if (dataSource.filter((ii) => ii.barcode === val.Barcode).length <= 0) {
      await getValidateItemMaster(CompCode, val.Barcode).then((res1) => {
        if (res1.length > 0) {
          message.error("Barcode Exist As Item");
          formBarcode.resetFields();
        } else {
          ValidateItemBarcode(CompCode, val.Barcode).then((res) => {
            if (res.length > 0) {
              message.error(
                `This Barcode Has Already Been Assigned to ${res[0].itemCode}`
              );
              formBarcode.resetFields();
            } else {
              const newData = {
                key: count,
                barcode: val.Barcode,
                isDirty: true,
              };
              setDataSource([...dataSource, newData]);
              setCount(count + 1);
              formBarcode.resetFields();
              document.getElementById("barcode_Barcode").focus();
            }
          });
        }
      });
    } else {
      message.error("Barcode Already Exist");
      formBarcode.resetFields();
    }
  };

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));

    let iIndex = dataSource.findIndex((xx) => xx.key === key);
    dataSource[iIndex].isDeleted = true;
    DelData.push(...DelData, dataSource.filter((item) => item.key === key)[0]);
  };

  const columns = [
    {
      title: "Barcode",
      dataIndex: "barcode",
      // defaultSortOrder: "ascc",
      // sorter: (a, b) => a.barcode.length - b.barcode.length,
    },
    {
      align: "center",
      title: "Action",
      dataIndex: "",
      key: "x",
      width: 180,
      render: (record) => (
        <Popconfirm
          // disabled={record.isDirty===false}
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.key)}
        >
          <a>
            <DeleteTwoTone />
          </a>
        </Popconfirm>
      ),
    },
  ];
  return (
    <div>
      <Card bodyStyle={{ padding: "5px 10px" }} style={{ borderBottom: 0 }}>
        <Form
          form={formBarcode}
          initialValues={initialValues}
          size="middle"
          name="barcode"
          labelAlign="left"
          {...formItemLayout}
          onFinish={onBarCodeAdd}
        >
          <Row gutter={[8, 0]}>
            <Col xl={18} lg={18} md={18} sm={24} xs={24}>
              <Form.Item
                // justify="center"
                name="Barcode"
                style={{ marginBottom: -3 }}
                label="Scan Product Barcode"
                rules={[
                  { required: true, message: "This field cannot be empty" },
                ]}
              >
                <Input placeholder="Enter Barcode" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <Form.Item noStyle={true}>
                <Button
                  type="primary"
                  htmlType="submit"
                  // icon={<SaveOutlined />}
                  // style={{ marginRight: 5 }}
                  onClick={() => {}}
                  icon={<PlusCircleOutlined />}
                >
                  Add
                </Button>
              </Form.Item>
            </Col>
            <Col span={24}>
              {dataSource.length > 0 && (
                <Table
                  bordered={true}
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  size="small"
                />
              )}
              {dataSource.length <= 0 && (
                <Table
                  bordered={true}
                  dataSource={null}
                  columns={columns}
                  size="small"
                />
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ItemBarcode;
