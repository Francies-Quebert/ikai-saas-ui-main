import React from "react";
import { Avatar, Menu, Dropdown, Row, Col, Divider, Typography } from "antd";
import {
  LockOutlined,
  PoweroffOutlined,
  KeyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { logout } from "../../../store/actions/login";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserHeader = (props) => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.LoginReducer);
  const menu = (
    <Menu>
      <div style={{ padding: 5 }}>
        <Text>
          {`${loginInfo.userData.name} (${loginInfo.userData.username})`}
        </Text>

        <br />
        <Text keyboard strong>
          {`+91 ${loginInfo.userData.mobileNo}`}
        </Text>
      </div>

      <Menu.Divider style={{ margin: 0, padding: 0 }} />

      <Menu.Item key="1">
        <Row>
          <Col>
            <KeyOutlined twoToneColor="#eb2f96" />
          </Col>
          <Col>
            <Link to={`/change-password`}>
              <span>
                <p
                  style={{
                    paddingLeft: 8,
                    marginBottom: 0,
                    textDecoration: "none",
                    color: "rgba(0, 0, 0, 0.65)",
                  }}
                >
                  Change Password
                </p>
              </span>
            </Link>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Item key="2">
        <Row>
          <Col>
            <LockOutlined twoToneColor="#eb2f96" />
          </Col>
          <Col>
            <p style={{ paddingLeft: 8, marginBottom: 0 }}>Lock</p>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Item key="">
        <Row
          onClick={() => {
            dispatch(logout());
          }}
        >
          <Col>
            <PoweroffOutlined twoToneColor="#eb2f96" />
          </Col>
          <Col>
            <p style={{ paddingLeft: 8, marginBottom: 0 }}>
              <a href="/loginLatest">Log out</a>
            </p>
          </Col>
        </Row>
      </Menu.Item>
    </Menu>
  );

  return (
    // <>
    //  <Dropdown overlay={menu}>
    //    <Avatar
    //     size="small"
    //     icon={<UserOutlined />}
    //     // style={{ margin: "20px 8px 20px 0" }}
    //   />
    //   Atul More
    // </Dropdown>
    // </>
    <>
      <Dropdown overlay={menu} overlayClassName="user-dropdown">
        <Avatar
          style={{ marginRight: 10 }}
          //  shape="square" size="large"
          //   shape="square"
          size="small"
          icon={<UserOutlined />}

          //   src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </Dropdown>
    </>
  );
};

export default UserHeader;
