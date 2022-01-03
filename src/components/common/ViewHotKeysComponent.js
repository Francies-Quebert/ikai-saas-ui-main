import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Divider, Tooltip, Table } from "antd";
import { SettingOutlined, SettingTwoTone } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import ChangeKeyBoardHotKeys from "./Hotkey-Sub-Components/ChangeKeyBoardHotKeys";
import { UpdtHotKeyConfigDtl } from "../../services/key-config";
import swal from "sweetalert";
const { Text, Link } = Typography;

const ViewHotKeysComponent = (props) => {
  const [showComp, setShowComp] = useState(false);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    // console.log(props.keyboardKey, "prosp");
  }, []);
  // console.log("Bill Save & Print: CTRL+P".length);

  return (
    <div style={{ padding: "0px 0px 0px", height: 28 }}>
      <div
        style={{
          backgroundColor: "#FFF",
          padding: "0px 0px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          // border: "1px solid #fb8a2d",
          overflowX: "auto",
        }}
        className="style-2 border-style"
      >
        {props.keyboardKey.length > 0 &&
          props.keyboardKey
            .filter((ee) => ee.IsVisible === true)
            .map((aa) => {
              return (
                <Fragment key={aa.EventSrNo}>
                  <div
                    style={{
                      minWidth: "max-content",
                      fontWeight: "600",
                      padding: "0px 3px",
                      fontSize: 10,
                      // display: "inline-block",
                    }}
                  >
                    {aa.EventName} :{"  "}
                    <Text code>
                      <span
                        style={{
                          fontSize: 10,
                        }}
                        className="color-style"
                      >{`${
                        aa.HotKey !== null ? aa.HotKey.toUpperCase() : ""
                      }`}</span>
                    </Text>
                  </div>
                  <Divider
                    type="vertical"
                    style={{
                      margin: 0,
                    }}
                    className="border-style"
                  />
                </Fragment>
              );
            })}

        <div
          style={{
            borderLeft: "1px solid #d9d9d9",
            borderBottom: "1px solid #d9d9d9",
            background: "#f7f7f7",
            // padding: "2.4px 0",
            width: 20,
            textAlign: "center",
            cursor: "pointer",
            marginLeft: "auto",
            borderRadius: 2,
          }}
          onClick={() => {
            setShowComp(true);
          }}
        >
          <Tooltip title="Change Keyboard shortcuts" placement="topRight">
            <SettingOutlined className="color-style" />
          </Tooltip>
        </div>

        <Modal
          title={
            <span
              className="color-style"
              style={{ textDecoration: "underline" }}
            >
              {props.title}
            </span>
          }
          footer={false}
          bodyStyle={{ padding: 0 }}
          destroyOnClose={true}
          width={750}
          closeIcon={null}
          visible={showComp}
          onCancel={() => {
            setShowComp(false);
          }}
        >
          <ChangeKeyBoardHotKeys
            data={
              props.keyboardKey.length > 0 &&
              props.keyboardKey.filter((ee) => ee.IsVisible === true)
            }
            onBackPress={() => {
              setShowComp(false);
            }}
            onSavePress={(values) => {
              let keyConfig = [];
              values.forEach((element) => {
                keyConfig.push({ ...element, updt_usrId: l_loginUser });
              });
              swal("Are you sure you want to continue...!!", {
                buttons: ["Cancel", "Yes!"],
              }).then((val) => {
                if (val) {
                  UpdtHotKeyConfigDtl(CompCode, keyConfig).then((res) => {
                    if (res.data.message === "successful") {
                      swal("Data saved successfully   !!!", {
                        icon: "success",
                      });
                      props.RefreshKeyConfig();
                      setShowComp(false);
                    } else if (res.data.message === "unsuccessful") {
                      swal(
                        `${
                          res.data.data.code === "ER_DUP_ENTRY"
                            ? "Duplicate Entry"
                            : "Something Went Wrong Try Again Later...."
                        }`,
                        {
                          icon: "error",
                        }
                      );
                      setShowComp(false);
                    } else {
                      setShowComp(false);
                    }
                  });
                }
              });
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ViewHotKeysComponent;
