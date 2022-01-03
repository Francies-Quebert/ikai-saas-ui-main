import React, { Fragment, useEffect, useState } from "react";
import AntDataTable from "../../../common/AntDataTable";
import { toast } from "react-toastify";
import {
  Form,
  Button,
  Spin,
  Row,
  Col,
  Card,
  Select,
  Menu,
  Tabs,
  Empty,
  message,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { useSelector, useDispatch } from "react-redux";
import { Divider } from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  DownloadOutlined,
  PrinterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { InsUpdtreceipemasterdtl } from "../../../../store/actions/receipe-master";
import { InsUpdtreceipemasterhdr } from "../../../../store/actions/receipe-master";
import { fetchMenuMaster } from "../../../../store/actions/MenuMaster";
import { setFormCaption } from "../../../../store/actions/currentTran";

import {
  fetchGetReceipedtl,
  fetchMenulist,
} from "../../../../services/receipe-master";
import ReciepeTable from "./ReciepeTable";
import { reInitialize } from "../../../../store/actions/currentTran";

const ReciepeMasterCard = () => {
  const [form] = Form.useForm();
  const [isfetching, setIsFetching] = useState(true);
  const dispatch = useDispatch();
  const { Option } = Select;
  //call on first load
  const [itemData, setItemData] = useState();
  const [menuData, setMenuData] = useState([]);
  const [UnitCode, setUnitCode] = useState();
  const [dataSource, setdataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menucode, setmenucode] = useState();
  const [MenuCode, setMenuCode] = useState();
  const [key, setKey] = useState(1);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  // useEffect(()=>{console.log(key)},[key])

  const onFinish = (values) => {
    let data = itemData.filter((iii) => iii.isDirty == true);
    if (
      itemData.length <= 0 ||
      (itemData[itemData.length - 1].Quantity !== "" &&
        itemData[itemData.length - 1].ItemCode !== "")
    ) {
      setIsLoading(true);
      dispatch(InsUpdtreceipemasterdtl("I", data, menucode));
      dispatch(InsUpdtreceipemasterhdr("I", menucode));
    } else {
      message.error("ItemName and  Quantity is required");
    }
  };

  useEffect(() => {
    if (currentTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      onReset();
    }
  }, [currentTran.lastSavedData]);

  const onReset = () => {
    setItemData();
    setmenucode();
    form.resetFields();
  };

  const add = async (record) => {
    if (
      itemData.length <= 0 ||
      (itemData[itemData.length - 1].Quantity !== "" &&
        itemData[itemData.length - 1].ItemCode !== "")
    ) {
      setItemData([
        ...itemData,
        {
          key: key,
          MenuCode: "",
          ItemCode: "",
          Quantity: "",
          isDeleted: false,
          isDirty: true,
          FromDatabase: false,
          ...record,
        },
      ]);
      setKey(key + 1);
    } else {
      message.error("ItemName and  Quantity is required");
    }
  };

  //On First Load Fet All the necessory fetch that needed in the current form
  useEffect(() => {
    fetchMenulist(CompCode).then((res) => {
      setMenuData(res);
    });
    dispatch(setFormCaption(68));
  }, []);

  useEffect(() => {
    setKey(itemData && itemData.length > 0 ? parseInt(itemData.length + 1) : 1);
  }, [itemData]);

  return (
    <div>
      <CardHeader title={currentTran.formTitle} />
      <Row>
        <Col flex={0.36}>
          <Card bordered={true} bodyStyle={{ padding: 8, margin: 3 }}>
            <Form
              form={form}
              name="userbody"
              {...formItemLayout}
              onFinish={onFinish}
            >
              <Select
                allowClear={true}
                showSearch
                style={{ width: "50%" }}
                placeholder="Select Menu"
                optionFilterProp="children"
                onChange={(val) => setmenucode(val)}
                disabled={itemData ? true : false}
                value={menucode}
              >
                {menuData.length > 0 &&
                  menuData.map((i, l_index) => {
                    return (
                      <Option key={l_index} value={i.MenuCode}>
                        {i.MenuName} ({i.MenuDesc})
                      </Option>
                    );
                  })}
              </Select>
              <Button
                style={{ marginLeft: 5 }}
                icon={<SearchOutlined />}
                type="primary"
                onClick={() => {
                  fetchGetReceipedtl(CompCode, menucode).then((res) => {
                    setItemData(res);
                  });
                }}
                disabled={!menucode}
              >
                Show
              </Button>
              <Divider style={{ marginBottom: 5, marginTop: 5 }} />
              <Row>
                <Col>
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    style={{ marginBottom: 5, marginTop: 2 }}
                    onClick={() => add()}
                    disabled={itemData ? false : true}
                  >
                    New Row
                  </Button>
                </Col>
              </Row>
              <ReciepeTable data={itemData} />
              <Form.Item noStyle={true}>
                <Divider
                  type="horizontal"
                  style={{ marginBottom: 5, marginTop: 5 }}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  style={{ marginRight: 5 }}
                  disabled={!itemData ? true : false}
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
                  icon={<Icon component={PrinterOutlined} />}
                  style={{ marginRight: 5 }}
                >
                  Print
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReciepeMasterCard;
