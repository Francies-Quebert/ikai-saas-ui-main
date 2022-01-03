import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row, Table, Radio, Skeleton } from "antd";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";

const SalesDIstinctItem = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [itemsData, setItemsData] = useState();

  useEffect(() => {
    // console.log(props, "on data");
    if (props.data) {
      setItemsData(props.data);
    }
  }, [props.data]);

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      width: "10%",
      align: "center",
    },
    {
      title: "Item",
      dataIndex: "ItemName",
    },
    {
      title: "Qty",
      dataIndex: "SaleQty",
      align: "right",
    },
    {
      title: "Sale price",
      dataIndex: "SalePrice",
      align: "right",
    },
    {
      title: "MRP",
      dataIndex: "MRP",
      align: "right",
    },
  ];
  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            props.onItemSelect(
              selectedRow
                ? itemsData.find((aa) => aa.key === selectedRow)
                : null
            );
          }
        }}
      >
        <Col style={{ padding: "5px 15px" }} className="card-sales-inner">
          Items to return
        </Col>
        <Col flex={1} style={{ padding: "5px 15px" }}>
          {itemsData ? (
            <>
              <Table
                rowKey={(oo) => oo.key}
                loading={loading}
                bordered
                columns={columns}
                rowSelection={{
                  type: "checkbox",
                  //   ...rowSelection,
                  //   selectedRowKeys: [selectedItem[0].key],
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedRow(selectedRowKeys);
                  },
                }}
                dataSource={itemsData}
                pagination={false}
              />

              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
              <Row style={{ display: "flex" }}>
                <Col span={24}>
                  <Button
                    icon={<SaveOutlined />}
                    style={{ marginRight: 5 }}
                    disabled={!selectedRow.length > 0}
                    type="primary"
                    onClick={() => {
                      props.onItemSelect(selectedRow);
                    }}
                  >
                    Set
                  </Button>
                  <Button
                    icon={<RollbackOutlined />}
                    type="primary"
                    ghost
                    onClick={() => {
                      props.onBackPress();
                    }}
                  >
                    Back
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <Skeleton />
          )}
        </Col>
      </div>
    </>
  );
};

export default SalesDIstinctItem;
