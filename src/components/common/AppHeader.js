import React, { useState, useRef } from "react";
import { Layout, Col, AutoComplete, Input, Typography, Breadcrumb } from "antd";
import {
  SearchOutlined,
  FullscreenOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import sm_logo from "../../assets/images/logo.png";
import _ from "lodash";
import UserHeader from "./ant-header-component/UserHeader";
import { HomeOutlined } from "@ant-design/icons";
const { Header } = Layout;
const { Title } = Typography;

const AppHeader = (props) => {
  const [showSearch, setShowSearch] = useState(false);
  // const [options, setOptions] = useState([]);
  const history = useHistory();
  const searchRef = useRef();

  function goFull() {
    if (
      (document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  return (
    // <Layout className="site-layout">
    <Header
      className="site-layout-background"
      style={{
        padding: 0,
        height: 48,
        lineHeight: "48px",
        // width: "100%",
        // zIndex: 100,
        // right: 0,
        // top: 0,
        // position: "fixed",
        // flexDirection: "row"
      }}
      theme={props.theme}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: 48,
          padding: "0 16px",
          // background: "#fff",
          boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          // backgroundColor: "#ffe9ec"
        }}
      >
        {/* <div
          style={{
            position: "relative",
            overflow: "hidden",
            lineHeight: "48px",
            transition: "all .3s"
          }}
        >
          <a
            href="/"
            style={{ display: "flex", alignItems: "center", height: 48 }}
          >
            <img src={sm_logo} height="28px" alt="logo" />
            <Title
              style={{
                height: 32,
                margin: " 0 0 0 12px",
                color: "#89888f",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: "32px"
              }}
              className="header-text"
            >
              {props.brandName}
            </Title>
          </a>
        </div> */}

        <div
          style={{
            height: 32,
            lineHeight: "32px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Breadcrumb>
            {/* {JSON.stringify(props.currentTran)} */}
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {props.currentTran.parent ? props.currentTran.parent : ""}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {props.currentTran.formTitle ? props.currentTran.formTitle : ""}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <span
          className="header-menu-button open"
          style={{
            height: 32,
            margin: " 0 0 0 12px",
            color: "#89888f",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: "32px",
          }}
          onClick={props.showMenuBar}
        >
          <MenuUnfoldOutlined />
        </span>

        <Col flex="1 1 0%" style={{ height: "100%" }}></Col>

        <div
          style={{
            display: "flex",
            float: "right",
            height: 48,
            marginLeft: "auto",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              padding: "0 12px",
              cursor: "pointer",
              transition: "all .3s",
            }}
          >
            <SearchOutlined
              onClick={() => {
                setShowSearch(!showSearch);
                if (searchRef) {
                  searchRef.current.focus();
                }
              }}
              style={{ height: "100%", display: "flex", alignItems: "center" }}
            />
            <AutoComplete
              dropdownClassName="certain-category-search-dropdown"
              className={`custom-header-search ${showSearch ? "open" : ""}`}
              dropdownMatchSelectWidth={200}
              options={props.options}
              ref={searchRef}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              onSelect={(value, option) => {
                history.push(option.path);
              }}
            >
              <Input
                style={{ transition: "all .3s" }}
                allowClear={true}
                size="small"
                placeholder="search menu"
                // onFocus={(val, sad) => console.log(val, sad)}
              />
            </AutoComplete>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              padding: "0 12px",
              cursor: "pointer",
              transition: "all .3s",
            }}
          >
            <FullscreenOutlined onClick={goFull} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              padding: "0 12px",
              cursor: "pointer",
              transition: "all .3s",
            }}
          >
            <UserHeader />
          </div>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
