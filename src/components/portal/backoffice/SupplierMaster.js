import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import {
  Button,
  Table,
  Badge,
} from "antd";
import {
  PlusCircleOutlined,
  EditTwoTone,
} from "@ant-design/icons";
import SupplierMasterComp from "./SupplierMaster/SupplierMasterComp";
import { fetchSupplierMasterComp } from "../../../services/supplier-master-comp";
import { fetchCityMasters } from "../../../store/actions/CityMaster";
import { fetchCountryMasters } from "../../../store/actions/CountryMaster";
import { fetchStateMasters } from "../../../store/actions/StateMaster";

const SupplierMaster = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(setFormCaption(89));
    dispatch(fetchCountryMasters());
    dispatch(fetchStateMasters());
    dispatch(fetchCityMasters());
    fetchSupplierMasterComp(CompCode).then((res) => {
      setData(res);
    });
  }, []);

  const columns = [
    {
      title: "Supp. Code",
      dataIndex: "suppCode",
      key: "suppCode",
      width: 80,
      align: "center",
    },
    {
      title: "Supplier Name",
      dataIndex: "suppName",
      key: "suppliername",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "emailId",
      key: "email",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "SuppTypeDesc",
      key: "type",
      width: 100,
      align: "center",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   width: 90
    // },
    {
      title: "Mobile No",
      align: "center",
      dataIndex: "mobileNo",
    },
    {
      title: "Cheque Name",
      dataIndex: "chequeName",
      align: "center",
    },
    {
      title: "Status",
      align: "center",
      width: 90,
      render: (value, record) => {
        return (
          <>
            {record.IsActive ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            )}
          </>
        );
      },
    },
    {
      title: "",
      width: "5%",
      align: "center",
      render: (record, value) => {
        return (
          <EditTwoTone
            onClick={() => {
              setEditedData({ entryMode: "E", formData: record });
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      {!editedData && (
        <>
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            onClick={() => {
              setEditedData({ entryMode: "A" });
              // console.log(record);
            }}
          >
            Add
          </Button>
          {/* <Button type="secondary" style={{ marginLeft: 8}}><FilterOutlined />Filter</Button> */}
          <Table
            style={{ marginTop: 8 }}
            bordered
            size="small"
            dataSource={data}
            columns={columns}
            pagination={data.length > 25 ? true : false}
          ></Table>
        </>
      )}

      {editedData && (
        <SupplierMasterComp
          datasource={data}
          onBackPress={() => {
            setEditedData();
            fetchSupplierMasterComp(CompCode).then((res) => {
              setData(res);
            });
          }}
          formData={editedData.formData}
        />
      )}
    </>
  );
};

export default SupplierMaster;
