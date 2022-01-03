import React, { useEffect, useState } from "react";
import { Table, Card, Row, Col, Input, Typography, Tooltip, Badge } from "antd";
import { EditTwoTone, EditOutlined } from "@ant-design/icons";
import nonveg from "../../../../assets/images/nonveg.png";
import veg from "../../../../assets/images/veg.png";

const MenuRateTable = (props) => {
  const { Text } = Typography;
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const NestedTable = (props) => {
    const expandedRowRender = (val, val2, val3) => {
      const columns = [
        {
          title: "Variation Desc",
          dataIndex: "VariationDesc",
          key: "key",
          width: "50%",
          render: (val, record) => {
            return (
              <Input
                readOnly={true}
                style={{ width: 150 }}
                value={record.VariationDesc}
              />
            );
          },
        },
        {
          title: "Rate",
          dataIndex: "Rate",
          key: "key",
          width: "50%",
          render: (val, record) => {
            return (
              <Input
                type="number"
                step="0.01"
                min="0"
                max="10"
                style={{ width: 90 }}
                defaultValue={record.Rate}
                onChange={(e) => {
                  record.Rate = e.target.value;
                  record.isDirty = true;
                }}
              />
            );
          },
        },
      ];

      return (
        <div style={{ margin: 15, marginLeft: 10 }}>
          <Table
            loading={props.loading}
            bordered={true}
            showHeader={false}
            columns={columns}
            dataSource={val.childrens}
            pagination={false}
          />
        </div>
      );
    };

    const columns = [
      {
        title: "Menu Code",
        dataIndex: "MenuCode",
        key: "key",
        width: 100,
      },
      {
        align: "center",
        title: "Menu Name",
        dataIndex: "MenuName",
        // width: 300,
        render: (record) => {
          return <Input value={record} readOnly={true} />;
        },
      },
      {
        align: "center",
        title: "Short Code",
        dataIndex: "ShortCode",
        width: 100,
        render: (record) => {
          return <Input value={record} readOnly={true} />;
        },
      },
      {
        align: "center",
        title: "Type",
        dataIndex: "DietType",
        width: 60,
        render: (record) => (
          <Text>
            {record === "N" ? (
              <img src={nonveg} height="20" width="20" />
            ) : (
              <img src={veg} height="20" width="20" />
            )}
          </Text>
        ),
      },
      {
        align: "center",
        title: "Source",
        dataIndex: "ApplyForDelivery",
        width: 100,
        render: (val, record) => {
          return (
            <>
              {record.ApplyForOnline === "Y" && (
                <Tooltip title="Available Online">
                  <span style={{ color: "deepskyblue", marginRight: 5 }}>
                    <i className="fa fa-globe" aria-hidden="true"></i>
                  </span>
                </Tooltip>
              )}
              {record.ApplyForDelivery === "Y" && (
                <Tooltip title="Delivery Applicable">
                  <span style={{ color: "green", marginRight: 5 }}>
                    <i className="fa fa-truck" aria-hidden="true"></i>
                  </span>
                </Tooltip>
              )}
              {record.ApplyForPickUp === "Y" && (
                <Tooltip title="Pickup Available">
                  <span style={{ color: "darkblue", marginRight: 5 }}>
                    <i className="fa fa-shopping-bag" aria-hidden="true"></i>
                  </span>
                </Tooltip>
              )}
              {record.ApplyForDineIn === "Y" && (
                <Tooltip title="Dine-In Available ">
                  <span style={{ color: "purple", marginRight: 5 }}>
                    <i className="fa fa-cutlery" aria-hidden="true"></i>
                  </span>
                </Tooltip>
              )}
            </>
          );
        },
      },
      {
        align: "center",
        title: "Rate",
        dataIndex: "Rate",
        width: 90,
        render: (val, record) => {
          return (
            record.childrens.length <= 0 && (
              <Input
                type="number"
                defaultValue={record.Rate}
                // value={record.Rate}
                onChange={(e) => {
                  record.Rate = e.target.value;
                  record.isDirty = true;
                }}
              />
            )
          );
        },
      },
      {
        width: 80,
        align: "center",
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (val, record) => {
          return (
            <a
              style={{ marginRight: 10 }}
              onClick={() => {
                props.onMenuEdit(record.MenuCode);
              }}
            >
              <Tooltip title="Edit Menu Item">
                <EditTwoTone />
              </Tooltip>
            </a>
          );
        },
      },
    ];

    return (
      <Row gutter={[8, 8]}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card bodyStyle={{ padding: "10px 10px" }}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Table
                  className="components-table-demo-nested"
                  columns={columns}
                  expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.childrens.length > 0,
                  }}
                  dataSource={data}
                  pagination={false}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };

  return <NestedTable onMenuEdit={props.onMenuEdit} />;
};

export default MenuRateTable;
