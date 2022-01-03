import React, { useEffect, useState } from "react";
import { Divider, Button, Table, Skeleton } from "antd";
import {
  fetchPromotionsIEData,
  fetchSelectQuery,
} from "../../../../../services/promotions";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
const PromoIESelectable = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setLoading(true);
    fetchPromotionsIEData(CompCode).then((res) => {
      console.log(res, "ss");
      let tempData = [];
      res.forEach((element, index) => {
        tempData.push({
          ...element,
          key: index,
        });
      });
      if (tempData.length > 0) {
        tempData.forEach((element) => {
          if (
            element.IEDataSource &&
            element.IEDataSource.split("|")[0] === "SP"
          ) {
            fetchSelectQuery(CompCode, element.IEDataSource.split("|")[1]).then(
              (res) => {
                tempData = [
                  ...tempData.filter((ii) => ii.key !== element.key),
                  { ...element, dataSource: res },
                ];
                setData(tempData);
              }
            );
          } else if (
            element.IEDataSource &&
            element.IEDataSource.split("|")[0] === "FIXED"
          ) {
            let param_values = element.IEDataSource.split("|")[1];
            let paramDataSource = [];
            param_values.split("#").map((i) => {
              paramDataSource.push({
                ValueMember: i.split("~")[0],
                DisplayMember: i.split("~")[1],
              });
            });
            tempData = [
              ...tempData.filter((ii) => ii.key !== element.key),
              { ...element, dataSource: paramDataSource },
            ];
            setData(tempData);
          }
        });
      }

      setLoading(false);
    });
  }, []);

  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      setSelectedRow(selectedRows);
    },

    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelectedRow(selectedRows);
    },
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "IETypeName",
      align: "center",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "IETypeDesc",
    },
  ];
  return (
    <>
      <div
        style={{
          padding: "6px 15px 5px 15px",
          borderBottom: "1px solid #cecece",
        }}
      >
        <span style={{ fontWeight: "600", fontSize: 16 }}>
          {props.Type === "I" ? "Inclusive" : "Exclusive"}
        </span>
      </div>
      <div style={{ padding: "4px 15px" }}>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <Table
              dataSource={data
                .sort((a, b) => (a.key > b.key ? 1 : -1))
                .filter((id) => id.IsDeleted !== "Y")}
              columns={columns}
              bordered={true}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
                hideSelectAll: true,
              }}
              rowKey={"key"}
              pagination={false}
            />
            <Divider style={{ marginBottom: 5, marginTop: 5 }} />
            <Button
              type="primary"
              style={{ flex: 1, margin: "3px 3px" }}
              icon={<SaveOutlined />}
              onClick={() => {
                props.onSetClick(selectedRow);
                props.onBackPress();
              }}
            >
              <span style={{ fontWeight: "600" }}>Set</span>
            </Button>
            <Button
              type="primary"
              style={{ flex: 1, margin: "3px 3px" }}
              icon={<RollbackOutlined />}
              onClick={() => {
                props.onBackPress();
              }}
            >
              <span style={{ fontWeight: "600" }}>Back</span>
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default PromoIESelectable;
