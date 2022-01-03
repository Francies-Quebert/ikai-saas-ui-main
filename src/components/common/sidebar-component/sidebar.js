import React, { Fragment, useState, useEffect } from "react";
import logo from "../../../assets/images/logo.png";
// import logo_compact from '../../../assets/images/logo/compact-logo.png';

import UserPanel from "./userPanel";
import CompanyPanel from "./companyPanel";

// import { MENUITEMS } from "../../../constant/menu";
import { Link } from "react-router-dom";
import { translate } from "react-switch-lang";
import { useSelector, useDispatch } from "react-redux";
const Sidebar = props => {
  const dispatch = useDispatch();
  const MENUITEMS = useSelector(state => state.AppMain.userMenu);
  const [margin, setMargin] = useState(0);
  const [width, setWidth] = useState(0);
  const [hideRightArrow, setHideRightArrow] = useState(false);
  const [hideLeftArrow, setHideLeftArrow] = useState(true);

  const [mainmenu, setMainMenu] = useState(MENUITEMS);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    var currentUrl = window.location.pathname;

    mainmenu.filter(items => {
      if (items.path === currentUrl) setNavActive(items);
      if (!items.children) return false;
      items.children.filter(subItems => {
        if (subItems.path === currentUrl) setNavActive(subItems);
        if (!subItems.children) return false;
        subItems.children.filter(subSubItems => {
          if (subSubItems.path === currentUrl) setNavActive(subSubItems);
        });
      });
    });

    return () => {
      window.addEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setWidth(window.innerWidth - 310);
  };

  const setNavActive = item => {
    MENUITEMS.filter(menuItem => {
      if (menuItem != item) menuItem.active = false;
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true;
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
    item.active = !item.active;
    setMainMenu({ mainmenu: MENUITEMS });
  };

  // Click Toggle menu
  const toggletNavActive = item => {
    if (!item.active) {
      MENUITEMS.forEach(a => {
        if (MENUITEMS.includes(item)) a.active = false;
        if (!a.children) return false;
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
          if (!b.children) return false;
          b.children.forEach(c => {
            if (b.children.includes(item)) {
              c.active = false;
            }
          });
        });
      });
    }
    item.active = !item.active;
    setMainMenu({ mainmenu: MENUITEMS });
  };

  const scrollToRight = () => {
    const elmnt = document.getElementById("myDIV");
    const menuWidth = elmnt.offsetWidth;
    const temp = menuWidth + margin;
    // Checking condition for remaing margin
    if (temp < menuWidth) {
      setMargin(-temp);
      setHideRightArrow(true);
    } else {
      setMargin(margin => (margin += -width));
      setHideLeftArrow(false);
    }
  };

  const scrollToLeft = () => {
    // If Margin is reach between screen resolution
    if (margin >= -width) {
      setMargin(0);
      setHideLeftArrow(true);
    } else {
      setMargin(margin => (margin += width));
      setHideRightArrow(false);
    }
  };

  return (
    <Fragment>
      <div className="page-sidebar">
        <div
          className="main-header-left d-none d-lg-block"
          style={{ background: "white" }}
        >
          <div className="logo-wrapper compactLogo">
            <Link to="/dashboard/default">
              <img className="blur-up lazyloaded" src={logo} alt="" />
              <img className="blur-up lazyloaded" src={logo} alt="" />
            </Link>
          </div>
        </div>
        <div className="sidebar custom-scrollbar">
          <UserPanel />

          <ul
            className="sidebar-menu"
            id="myDIV"
            style={{ marginLeft: margin + "px" }}
          >
            <li
              className={`left-arrow ${
                hideLeftArrow ? "d-none" : "hideLeftArrow"
              }`}
              onClick={scrollToLeft}
            >
              <i className="fa fa-angle-left"></i>
            </li>
            {MENUITEMS.map((menuItem, i) => (
              <li className={`${menuItem.active ? "active" : ""}`} key={i}>
                {menuItem.sidebartitle ? (
                  <div className="sidebar-title">{menuItem.sidebartitle}</div>
                ) : (
                  ""
                )}
                {menuItem.type === "sub" ? (
                  <a
                    className="sidebar-header"
                    href="#javascript"
                    onClick={() => toggletNavActive(menuItem)}
                  >
                    <menuItem.icon />
                    <span>{props.t(menuItem.title)}</span>
                    <i className="fa fa-angle-right pull-right"></i>
                  </a>
                ) : (
                  ""
                )}
                {menuItem.type === "link" ? (
                  <Link
                    to={`${process.env.PUBLIC_URL}${menuItem.path}`}
                    className={`sidebar-header ${
                      menuItem.active ? "active" : ""
                    }`}
                    onClick={() => toggletNavActive(menuItem)}
                  >
                    <menuItem.icon />
                    <span>{props.t(menuItem.title)}</span>
                    {menuItem.children ? (
                      <i className="fa fa-angle-right pull-right"></i>
                    ) : (
                      ""
                    )}
                  </Link>
                ) : (
                  ""
                )}
                {menuItem.children ? (
                  <ul
                    className={`sidebar-submenu ${
                      menuItem.active ? "menu-open" : ""
                    }`}
                    style={
                      menuItem.active
                        ? { opacity: 1, transition: "opacity 500ms ease-in" }
                        : {}
                    }
                  >
                    {menuItem.children.map((childrenItem, index) => (
                      <li
                        key={index}
                        className={
                          childrenItem.children
                            ? childrenItem.active
                              ? "active"
                              : ""
                            : ""
                        }
                      >
                        {childrenItem.type === "sub" ? (
                          <a
                            href="#javascript"
                            onClick={() => toggletNavActive(childrenItem)}
                          >
                            <i className="fa fa-circle"></i>
                            {props.t(childrenItem.title)}{" "}
                            <i className="fa fa-angle-right pull-right"></i>
                          </a>
                        ) : (
                          ""
                        )}

                        {childrenItem.type === "link" ? (
                          <Link
                            to={`${process.env.PUBLIC_URL}${childrenItem.path}`}
                            className={childrenItem.active ? "active" : ""}
                            onClick={() => toggletNavActive(childrenItem)}
                          >
                            <i className="fa fa-circle"></i>
                            {props.t(childrenItem.title)}{" "}
                          </Link>
                        ) : (
                          ""
                        )}
                        {childrenItem.children ? (
                          <ul
                            className={`sidebar-submenu ${
                              childrenItem.active ? "menu-open" : "active"
                            }`}
                          >
                            {childrenItem.children.map(
                              (childrenSubItem, key) => (
                                <li
                                  className={
                                    childrenSubItem.active ? "active" : ""
                                  }
                                  key={key}
                                >
                                  {childrenSubItem.type === "link" ? (
                                    <Link
                                      to={`${process.env.PUBLIC_URL}${childrenSubItem.path}`}
                                      className={
                                        childrenSubItem.active ? "active" : ""
                                      }
                                      onClick={() =>
                                        toggletNavActive(childrenSubItem)
                                      }
                                    >
                                      <i className="fa fa-circle"></i>
                                      {props.t(childrenSubItem.title)}
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          ""
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
              </li>
            ))}
            <li
              className={`right-arrow ${
                hideRightArrow ? "d-none" : "hideRightArrow"
              }`}
              onClick={scrollToRight}
            >
              <i className="fa fa-angle-right"></i>
            </li>
          </ul>
        </div>
        {/* <CompanyPanel /> */}
      </div>
    </Fragment>
  );
};

export default translate(Sidebar);
