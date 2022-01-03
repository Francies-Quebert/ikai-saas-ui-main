import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Collapse, Divider, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  RetweetOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { hasRight } from "../../../shared/utility";
import { setFormCaption } from "../../../store/actions/currentTran";
import { getItemVariationConfigData } from "../../../services/item-variation-config";

const ItemVariationConfigPage = () => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);

  useEffect(() => {
    dispatch(setFormCaption(126));
    getItemVariationConfigData(1).then((res) => console.log(res));
  }, []);

  const text = (
    <Table
      columns={[
        { title: "Value", dataIndex: "Value", key: 1 },
        { title: "Additional Info", dataIndex: "AddInfo", key: 2 },
        {
          title: "Actions",
          dataIndex: "",
          key: 3,
        },
      ]}
      bordered
    />
  );

  return (
    <>
      <Card bodyStyle={{ padding: 5 }} bordered>
        <Collapse accordion defaultActiveKey={1} className="custom-collapse">
          <Panel header="Color" key="1">
            <p>{text}</p>
          </Panel>
          <Panel header="Size" key="2">
            <p>{text}</p>
          </Panel>
          <Panel header="Material" key="3">
            <p>{text}</p>
          </Panel>
        </Collapse>{" "}
        <Divider style={{ marginBottom: 5, marginTop: 5 }} />
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          disabled={hasRight(currTran.moduleRights, "EDIT")}
          style={{ marginRight: 5 }}
          onClick={() => {}}
        >
          Save
        </Button>
        <Button
          type="primary"
          ghost
          icon={<RetweetOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => {}}
        >
          Reset
        </Button>
      </Card>
    </>
  );
};

export default ItemVariationConfigPage;
