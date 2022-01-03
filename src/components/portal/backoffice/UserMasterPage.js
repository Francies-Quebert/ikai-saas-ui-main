import React, { Fragment, useEffect, useState } from "react";
import AntDataTable from "../../common/AntDataTable";
import UserMasterCard from "./UserMaster/UserMasterCardNew";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { Popconfirm, Card, Form, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserMasters,
  fetchUserAccess,
  fetchUserGroup,
  fetchUserAddress,
} from "../../../store/actions/usermaster";
import ColumnPropertiesAnt from "../../../models/columnPropertiesAnt.js";
import { PlusCircleOutlined } from "@ant-design/icons";
import { hasRight } from "../../../shared/utility";

const UserMaster = (props) => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const userMaster = useSelector((state) => state.userMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchUserMasters(props.trnType));
    dispatch(
      setFormCaption(props.trnType === "U" ? 5 : props.trnType === "G" ? 6 : 4)
    );
    dispatch(fetchUserGroup("G"));
    // dispatch(fetchUserAddress(3));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {
    // console.log(userMaster);
  }, [
    userMaster.userMasters,
    userMaster.customerMasters,
    userMaster.userGroupMaster,
  ]);

  const columns = [
    new ColumnPropertiesAnt("SrNo", "Sr No", false, true, 80),
    new ColumnPropertiesAnt("Name", "Display Name", true, true),
    // new ColumnPropertiesAnt("userType", "UserType", false, true,0),
    // new ColumnPropertiesAnt("userId", "User Id", false, true,0),
    // new ColumnPropertiesAnt("userTypeRef", "userTypeRef", true, true,0),
    props.trnType !== "G" &&
      props.trnType !== "U" &&
      new ColumnPropertiesAnt("userName", "User Name", true, true, 200),
    props.trnType !== "G" &&
      new ColumnPropertiesAnt("Gender", "Gender", true, true, 20),
    props.trnType !== "G" &&
      new ColumnPropertiesAnt("email", "Email", true, true, 100),
    props.trnType !== "G" &&
      new ColumnPropertiesAnt("mobile", "Mobile No.", true, true, 100),
    // new ColumnPropertiesAnt("password", "password", true, true,0),
    // new ColumnPropertiesAnt("RegisterFrom", "RegisterFrom", true, true,0),
    // new ColumnPropertiesAnt("hasDemographyInfo", "hasDemographyInfo", true, true,0),
    {
      title: "Action",
      dataIndex: "edit",
      render: (text, record) => (
        //   <Popconfirm title="Sure to Edit?">
        <a disabled={hasRight(currTran.moduleRights, "EDIT")} href="#">
          <i
            className="fa fa-pencil"
            style={{
              width: 35,
              fontSize: 16,
              padding: 11,
              color: "rgb(40, 167, 69)",
            }}
            onClick={() => {
              setEditedData({ entryMode: "E", formData: record });
              // console.log(record);
            }}
          ></i>
        </a>
      ),
      align: "center",
    },
  ];

  let renderItem = null;
  if (userMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (userMaster.error) {
    renderItem = <div>Error : {userMaster.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <UserMasterCard
            trnType={props.trnType}
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={props.trnType === "A"}
          />
        )}

        {!editedData && (
          <div>
            <div
              style={{
                padding: "8px 15px",
                fontSize: 15,
                background: "#FFFFFF",
                border: "1px solid #f0f0f0",
              }}
            >
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  setEditedData({ entryMode: "A" });
                }}
                disabled={hasRight(currTran.moduleRights, "ADD")}
              >
                Add
              </Button>
            </div>
            <AntDataTable
              columns={columns}
              scroll={{ x: 1300 }}
              data={
                props.trnType === "A"
                  ? userMaster.userMasters
                  : props.trnType === "U"
                  ? userMaster.customerMasters
                  : userMaster.userGroupMaster
              }
            />
          </div>
        )}
      </Fragment>
    );
  }

  return renderItem;
};

export default UserMaster;
