import React, { useState, useEffect, useRef } from "react";
// import Header from "./common/header-component/header";
import Sidebar from "./common/sidebar-component/sidebar";
// import RightSidebar from './common/right-sidebar'
// import Footer from "./common/footer";
import ThemeCustomizer from "./common/theme-customizer";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./common/loader";
import "./App.less";
import { logout } from "../store/actions/login";
import _ from "lodash";
// import "antd/dist/antd.css";
// import 'antd/lib/style/themes/default.less';
// import 'antd/dist/antd.less'; // Import Ant Design styles by less entry
// import './antd-t heme.less'; // variables to override above

import "./app.css";
import {
  Layout,
  Menu,
  Row,
  Col,
  AutoComplete,
  Input,
  Breadcrumb,
  Typography,
  Drawer,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenOutlined,
  HomeOutlined,
  AlertOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  SnippetsOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import sm_logo from "../assets/images/logo.png"; //livkwick
// import sm_logo from "../assets/images/res-logo.png"; // resturant

import UserHeader from "./common/ant-header-component/UserHeader";
import { ConfigProvider } from "antd";
import hiIN from "antd/es/locale/ar_EG";

import { Link, Route } from "react-router-dom";
import HexSpinner from "./common/HoneyCombSpinner";

import { authenticate } from "../store/actions/login";
import { fetchAppMain } from "../store/actions/appMain";

import { useHistory } from "react-router-dom";
import {
  Home,
  File,
  Headphones,
  HelpCircle,
  Settings,
  Database,
  AlertTriangle,
  Users,
  FileText,
} from "react-feather";

import AppHeader from "./common/AppHeader";
import IdleTimer from "react-idle-timer";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title, Text } = Typography;

const getIcon = (iconName) => {
  let icon;
  if (iconName === "Home") {
    icon = <HomeOutlined />;
  } else if (iconName === "File") {
    icon = <File />;
  } else if (iconName === "Headphones") {
    icon = <Headphones />;
  } else if (iconName === "HelpCircle") {
    icon = <QuestionCircleOutlined />;
  } else if (iconName === "Settings") {
    icon = <SettingOutlined />;
  } else if (iconName === "Database") {
    icon = <Database />;
  } else if (iconName === "AlertTriangle") {
    icon = <AlertOutlined />;
  } else if (iconName === "FileText") {
    icon = <FileOutlined />;
  } else if (iconName === "Users") {
    icon = <UserOutlined />;
  } else if (iconName === "SnippetsOutlined") {
    icon = <SnippetsOutlined />;
  } else if (iconName === "TagsOutlined") {
    icon = <TagsOutlined />;
  } else if (iconName === "UserGroup") {
    icon = <UsergroupAddOutlined />;
  } else if (iconName === "Connection") {
    icon = <ApiOutlined />;
  } else {
    icon = <FileOutlined />;
  }

  return icon;
};

const AppLayout = ({ props, children }) => {
  const dispatch = useDispatch();
  const isLoaded = useSelector((state) => state.AppMain.isLoaded);
  const AppMainError = useSelector((state) => state.AppMain.error);
  const [collapsed, setCollapsed] = useState(true);
  const loginInfo = useSelector((state) => state.LoginReducer);
  const currTran = useSelector((state) => state.currentTran);
  const userMenu = useSelector((state) => state.AppMain.userMenu);
  const [appTheme, setAppTheme] = useState("dark");
  const [options, setOptions] = useState([]);
  //const idleTimer = useRef();
  let idleTimer;
  const [defaultRoute, setDefaultRoute] = useState("/dashboard/default");
  const login_user = useSelector((state) => state.LoginReducer.userData);
  const login_reducer = useSelector((state) => state.LoginReducer);
  const l_BrandName = useSelector(
    (state) =>
      state.AppMain.appconfigs &&
      state.AppMain.appconfigs.length > 0 &&
      state.AppMain.appconfigs.find((ii) => ii.configCode === "BRAND_NAME")
  );

  const history = useHistory();

  const handleOnAction = (event) => {
    // console.log("user did something", event);
  };

  const handleOnActive = (event) => {
    // console.log("user is active", event);
    // console.log("time remaining", idleTimer.getRemainingTime());
  };

  const handleOnIdle = (event) => {
    // console.log("user is idle", event);
    // console.log("last active", idleTimer.getLastActiveTime());
    dispatch(logout());
  };

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
  // console.log("electron", dialog);
  useEffect(() => {
    // if (!_.isNull(loginInfo.token) && loginInfo.token.length  > 0){
    dispatch(authenticate());
    return () => {};
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (
      login_reducer &&
      login_reducer.userData.userId !== null &&
      login_reducer.CompCode !== null
    ) {
      if (token && login_reducer.CompCode != null) {
        // console.log("fetch app main", token);
        dispatch(fetchAppMain());
        if (login_user) {
          if (
            login_user &&
            !_.includes([null, undefined, "", "null"], login_user.defaultPath)
          ) {
            setDefaultRoute(login_user.defaultPath);
          } else {
            setDefaultRoute("/dashboard/default");
          }
        }
      } else {
        history.push("/loginLatest");
      }
    }
  }, [login_reducer]);
  useEffect(() => {
    if (AppMainError !== null) {
      // history.push("/loginLatest");
    }
    return () => {};
  }, [AppMainError]);
  // console.log(defaultRoute);
  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     // props.push("/login");
  //     history.push("/login");

  //     return;
  //   }

  //   dispatch(authenticate());
  // }, [loginInfo.token]);

  useEffect(() => {
    if (isLoaded) {
      let option = [];

      userMenu
        .filter((aa) => aa.ModType !== "report")
        .map((group) => {
          group.children.map((item) => {
            option.push({ value: item.title, path: item.path });
          });
        });

      setOptions(option);
    }
  }, [isLoaded === true]);

  return (
    <IdleTimer
      ref={(ref) => {
        idleTimer = ref;
      }}
      timeout={
        1000 *
        60 *
        (parseInt(process.env.REACT_APP_MAX_IDEAL_MINS)
          ? parseInt(process.env.REACT_APP_MAX_IDEAL_MINS)
          : 720)
      }
      onActive={handleOnActive}
      onIdle={handleOnIdle}
      onAction={handleOnAction}
      debounce={250}
    >
      <div>
        {!isLoaded && <HexSpinner />}
        {isLoaded && (
          <Layout
            style={{
              minHeight: "100vh",
              backgroundColor: "#fff",
              paddingLeft: collapsed ? 48 : 254,
            }}
          >
            {/* <div style={{ width: "100%", overflow: "hidden" }}>

          </div> */}
            <Sider
              theme={appTheme}
              onCollapse={() => setCollapsed(!collapsed)}
              collapsed={collapsed}
              style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                flex: "0 0 48px",
                maxWidth: 48,
                minWidth: 48,
                width: 48,
                zIndex: 109,
                height: "100%",
                boxShadow: " 2px 0 8px 0 rgba(29,35,41,.05)",
                // paddingTop: 48,
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div>
                  <div
                    key="logo"
                    style={{
                      padding: !collapsed ? "0px 24px" : "0px 5px",
                      margin: "4px 0px",
                      height: 45,
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="slider-icon"
                  >
                    <Link to={defaultRoute}>
                      <span
                        style={{
                          fontSize: 16,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? process.env.REACT_APP_API_PATH_LIVE
                              : process.env.REACT_APP_API_PATH_DEV
                          }cust-logo.png`}
                          style={{
                            marginRight: 15,
                            width: 40,
                            transform:
                              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
                          }}
                        />
                        {/* <span style={{ flex: 1, textAlign: "center" }}> */}
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: "600",
                            animation: "fade-in",
                            animationDuration: "0.2s",
                            display: "inline-block",
                            color: appTheme === "light" ? "inherit" : "#FFF",
                          }}
                        >
                          {!collapsed ? l_BrandName.value1 : ""}
                        </div>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div
                id="style-1"
                style={{ flex: "1 1 0%", overflow: " hidden auto" }}
              >
                <Menu
                  theme={appTheme}
                  defaultSelectedKeys={["1"]}
                  mode="inline"
                >
                  {userMenu.length &&
                    userMenu
                      .filter((aa) => aa.ModType !== "report")
                      .map((item) => {
                        return (
                          <SubMenu
                            key={item.ModGroupId}
                            title={
                              <span>
                                {getIcon(item.icon)}
                                <span>{item.title}</span>
                              </span>
                            }
                          >
                            {item.children.map((subitem) => {
                              return (
                                <Menu.Item key={subitem.Id}>
                                  <Link to={subitem.path}>
                                    <span>{subitem.title}</span>
                                  </Link>
                                </Menu.Item>
                              );
                            })}
                          </SubMenu>
                        );
                      })}
                </Menu>
              </div>
              <div style={{ width: "100%", overflow: "hidden" }}>
                {/* <div>
                <MenuFoldOutlined />
              </div> */}
                <ul
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                  className="ant-menu ant-menu-light ant-menu-inline-collapsed ant-menu-root ant-menu-vertical"
                  role="menu"
                >
                  <li
                    className="ant-menu-item ant-menu-item-only-child ant-menu-item-selected active"
                    role="menuitem"
                  >
                    <MenuFoldOutlined />
                  </li>
                </ul>
              </div>
            </Sider>
            <Layout
              className="site-layout"
              style={{
                position: "relative",
              }}
            >
              {/* <Header
              theme={appTheme}
              style={{ height: 48, lineHeight: 48 }}
            ></Header> */}
              <AppHeader
                theme={appTheme}
                showMenuBar={() => {
                  setCollapsed(!collapsed);
                }}
                brandName={l_BrandName}
                options={options}
                currentTran={currTran}
              />
              <Content
                // className="site-layout-background"
                style={{
                  margin: "3px 3px",
                  padding: 2,
                  minHeight: 280,
                }}
              >
                {children}
              </Content>
              {/* <Footer
              style={{
                textAlign: "right",
                padding: 5,
                // backgroundColor: "black",
              }}
            >
              <Text>Design and developed by :</Text>
              <a href="https://www.skyelint.com">
                <Text code>Skyelint Technologies Pvt. Ltd.</Text>
              </a>
              <Text>UI :</Text>
              <Text strong>{process.env.REACT_APP_VERSION}</Text>
            </Footer> */}
            </Layout>
          </Layout>
        )}

        <ToastContainer />
        <Loader />
      </div>
    </IdleTimer>
  );
};

export default AppLayout;
