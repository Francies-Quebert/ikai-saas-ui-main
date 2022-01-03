import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Row,
  Table,
  Radio,
  Skeleton,
} from "antd";
import {
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const StockDistinctPrice = (props) => {
  const [loading, setLoading] = useState(false);
  const [itemsData, setItemsData] = useState();
  useEffect(() => {
    // console.log(props, "on data");
    if (props.data) {
      setItemsData(props.data);
    }
  }, [props.data]);


  const [selectedRow, setSelectedRow] = useState(1);
  const columns = [
    {
      dataIndex: null,
      width: 30,
      render: (record) => {
        return (
          <div style={{ textAlign: "center" }}>
            <Radio
              onChange={(e) => setSelectedRow(e.target.value)}
              style={{ marginRight: 0 }}
              value={record.key}
              autoFocus={record.key === 1 ? true : false}
              checked={selectedRow === record.key}
            ></Radio>
          </div>
        );
      },
    },
    {
      title: "Sr No",
      dataIndex: "key",
      width: "10%",
      align: "center",
    },
    {
      title: "Balance Qty",
      dataIndex: "BalQty",
    },
    {
      title: "MRP",
      dataIndex: "MRP",
    },
    {
      title: "Sale price",
      dataIndex: "SaleRate",
    },
  ];
  const border = { border: "1px solid #f0f0f0" };

  return (
    <>
      <div
        onKeyDown={(e) => {
          // console.log("key down");
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
          Stock Distinct Price
        </Col>
        <Col flex={1} style={{ padding: "5px 15px" }}>
          {/* <table>
            <tr>
              <th>Sr No</th>
              <th>Balance Qty</th>
              <th>MRP</th>
              <th>Sale Price</th>
            </tr>
            {itemsData &&
              itemsData.map((ii) => {
                return (
                  <tr key={ii.key}>
                    <td>{ii.key}</td>
                    <td>{ii.BalQty}</td>
                    <td>{ii.MRp}</td>
                    <td>{ii.Salerate}</td>
                  </tr>
                );
              })}
          </table> */}
          {itemsData ? (
            <>
              {/* <Radio.Group
                ref={inputRef}
                onChange={(e) => setSelectedRow(e.target.value)}
                value={selectedRow}
              > */}
              <Table
                rowKey={(oo) => oo.key}
                loading={loading}
                bordered
                columns={columns}
                // rowSelection={{
                //   type: "radio",
                //   ...rowSelection,
                //   //   selectedRowKeys   : [selectedItem[0].key],
                // }}
                dataSource={itemsData}
                pagination={false}
              />
              {/* </Radio.Group> */}
              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
              <Row style={{ display: "flex" }}>
                <Col span={24}>
                  <Button
                    icon={<SaveOutlined />}
                    style={{ marginRight: 5 }}
                    disabled={!selectedRow}
                    type="primary"
                    onClick={() => {
                      props.onItemSelect(
                        selectedRow
                          ? itemsData.find((aa) => aa.key === selectedRow)
                          : null
                      );
                    }}
                  >
                    Set
                  </Button>
                  <Button
                    icon={<RollbackOutlined />}
                    type="primary"
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

export default StockDistinctPrice;
