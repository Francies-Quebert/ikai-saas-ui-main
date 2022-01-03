import React, { Fragment, useEffect, useState } from "react";
import { Row, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../../store/actions/login";
import SweetAlert from "react-bootstrap-sweetalert";
import _ from "lodash";
import { Form, Input, Button, Checkbox } from "antd";
import Cryptr from "cryptr";
import "antd/dist/antd.css";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const LoginPageNew = (props) => {
  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.LoginReducer);
  const cryptr = new Cryptr(process.env.REACT_APP_CRYPTOKEY);
  const [isLoading, setIsLoading] = useState(false);
  // console.log("less styles", styles.main);
  return (
    // <div style={{ margin: "auto", width: "50%", padding: 10 }}>
    <div >
      {/* <p className={styles.red}>Hari </p> */}
      <Form
        {...layout}
        //   size=''
        name="basic"
        initialValues={{
          remember: true,
        }}
        //   onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPageNew;
