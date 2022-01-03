import { ShoppingCartOutlined } from "@ant-design/icons";
import { Row, Col, Modal, Divider, Button, message, Result } from "antd";
import React, { useState, useEffect, Fragment } from "react";
import nonveg from "../../assets/images/nonveg.png";
import veg from "../../assets/images/veg.png";
import AddQuantityComponent from "./AddQuantityComponent";
import {
  fetchPOSRestaurantMenuRatesSelfOrder,
  fetchPOSRestaurantUserFavoriteMenusSelfOrder,
  fetchPOSRestaurantMenuAddOnDtlSelfOrder,
  fetchPOSRestaurantMenuAddOnsSelfOrder,
  fetchPOSRestaurantMenuVariationRatesSelfOrder,
} from "../../services/self-order";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import CartComponent from "./CartComponent";

const CustomerSelfOrder = (props) => {
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const [menuRates, setMenuRates] = useState();
  const [menuVariationRates, setMenuVariationRates] = useState();
  const [favMenus, setFavMenus] = useState();
  const [menuAddOnDtl, setMenuAddOnDtl] = useState();
  const [menuAddOn, setMenuAddOn] = useState();
  const [currMenuCategory, setCurrMenuCategory] = useState();
  const [currMenus, setCurrMenus] = useState();
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [storedMenuData, setStoredMenuData] = useState({
    menu: {},
    var: [],
    addOn: [],
    selectedVar: -1,
    selectedAddOn: [],
  });
  const [TotalQuatity, setTotalQuatity] = useState(0);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    let tempQty = 0;
    selectedMenu.forEach((row) => {
      tempQty += row.Qty;
    });
    setTotalQuatity(tempQty);
  }, [selectedMenu]);
  useEffect(() => {
    initialFetch();
    return () => {};
  }, []);
  const [showCart, setShowCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => {
    setShowModal(!showModal);
    setStoredMenuData({
      menu: {},
      var: [],
      addOn: [],
      selectedVar: -1,
      selectedAddOn: [],
    });
  };

  const initialFetch = () => {
    Promise.all([
      fetchPOSRestaurantMenuRatesSelfOrder(props.pageData.CompCode),
      fetchPOSRestaurantUserFavoriteMenusSelfOrder(props.pageData.CompCode, "U", 0),
      fetchPOSRestaurantMenuAddOnDtlSelfOrder(props.pageData.CompCode),
      fetchPOSRestaurantMenuAddOnsSelfOrder(props.pageData.CompCode),
      fetchPOSRestaurantMenuVariationRatesSelfOrder(props.pageData.CompCode),
    ])
      .then(async (res) => {
        // setIsLoading(false);
        setMenuRates(res[0]);
        setFavMenus(res[1]);
        setMenuAddOnDtl(res[2]);
        setMenuAddOn(res[3]);
        setMenuVariationRates(res[4]);

        let tmpBranch, tmpDept, tmpSecCode;

        //Check Rates availible for current branch and Dept
        //Branch
        if (
          res[0].filter((ii) => ii.BranchCode === props.pageData.BranchCode)
            .length > 0
        ) {
          tmpBranch = props.pageData.BranchCode;
        } else {
          tmpBranch = "0";
          // props.onErrorFound();
        }

        //Dept
        if (
          res[0].filter(
            (ii) =>
              ii.BranchCode === tmpBranch &&
              ii.DeptCode === props.pageData.DeptCode
          ).length > 0
        ) {
          tmpDept = props.pageData.DeptCode;
        } else {
          tmpDept = "0";
          // tmpDept = props.onErrorFound();
        }

        //Sec
        if (
          res[0].filter(
            (ii) =>
              ii.BranchCode === tmpBranch &&
              ii.DeptCode === tmpDept &&
              ii.SecCode === props.pageData.SecCode
          ).length > 0
        ) {
          tmpSecCode = props.pageData.SecCode;
        } else {
          tmpSecCode = "0";
        }
        let menuCat = [];
        let applicableMenus = res[0].filter(
          (ii) =>
            ii.BranchCode === tmpBranch &&
            ii.DeptCode === tmpDept &&
            ii.SecCode === tmpSecCode
        );

        await applicableMenus.map((mn, index) => {
          if (
            menuCat.filter((oo) => oo.MenuCatCode === mn.MenuCatCode).length ===
            0
          ) {
            menuCat.push({
              MenuCatCode: mn.MenuCatCode,
              MenuCatName: mn.MenuCatName,
            });
          }
        });

        menuCat = _.sortBy(menuCat, [
          function (o) {
            return o.MenuCatName;
          },
        ]);

        let tempApplicable = [];
        let tempMenuOptions = [];
        for (const key in applicableMenus) {
          await tempApplicable.push({
            ...applicableMenus[key],
            Qty: 0,
          });
          tempMenuOptions.push({
            value: `${applicableMenus[key].MenuName} [${applicableMenus[key].ShortCode}]`,
            ...applicableMenus[key],
          });
        }

        setCurrMenuCategory(menuCat);
        setCurrMenus(tempApplicable);
      })
      .catch((err) => {
        // setIsLoading(false);
      });
  };
  const onMenuItemClick = (
    pMenuItem,
    pVariationObject,
    pArrOfAddOns,
    pAction
  ) => {
    let tempData = [...currMenus];
    let menuIndex = currMenus.findIndex(
      (item) => item.MenuCode === pMenuItem.MenuCode
    );
    if (
      menuIndex >= 0 &&
      pMenuItem.hasVariation === "N" &&
      pArrOfAddOns.length <= 0
    ) {
      if (pAction === "INC") {
        tempData[menuIndex] = {
          ...tempData[menuIndex],
          Qty: parseInt(tempData[menuIndex].Qty) + 1,
        };
      } else {
        if (tempData[menuIndex].Qty > 0) {
          tempData[menuIndex] = {
            ...tempData[menuIndex],
            Qty: parseInt(tempData[menuIndex].Qty) - 1,
          };
          if (tempData[menuIndex].Qty === 0) {
            setSelectedMenu([
              ...selectedMenu.filter(
                (ff) => ff.MenuCode !== tempData[menuIndex].MenuCode
              ),
            ]);

            setCurrMenus(tempData);
            return false;
          }
        }
      }
    } else {
      handleModal();
    }
    setSelectedMenu([
      ...selectedMenu.filter(
        (ff) => ff.MenuCode !== tempData[menuIndex].MenuCode
      ),
      tempData[menuIndex],
    ]);
    setCurrMenus(tempData);
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "#F1F1F1",
          // height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div className="header-self-order">
          {props.configs.find((cc) => cc.ConfigCode === "BRAND_NAME").Value1}
        </div>
        {!showCart && showCart !== "SUCCESS" && (
          <>
            <div
              className="hovicon effect-1 sub-a"
              onClick={() => {
                setShowCart(true);
              }}
              style={{
                lineHeight: "45px",
                width: 45,
                borderRadius: 100,
                textAlign: "center",

                position: "fixed",
                bottom: 4,
                right: 10,
                zIndex: 99,
              }}
              className="bg-color-style"
            >
              <div className="quantity-display">{TotalQuatity}</div>
              <ShoppingCartOutlined style={{ fontSize: 20 }} />
            </div>

            {currMenuCategory &&
              currMenuCategory.map((cat) => {
                return (
                  <div className="self-order-body" key={cat.MenuCatCode}>
                    <div className="self-order-cat">{cat.MenuCatName}</div>
                    <Row>
                      {currMenus &&
                        currMenus
                          .filter((ff) => ff.MenuCatCode === cat.MenuCatCode)
                          .map((menu) => {
                            let vars = [];
                            vars = menuVariationRates.filter(
                              (xx) =>
                                xx.BranchCode === menu.BranchCode &&
                                xx.DeptCode === menu.DeptCode &&
                                xx.SecCode === menu.SecCode &&
                                xx.MenuCode === menu.MenuCode
                            );
                            let addOns = menuAddOn.filter(
                              (hh) => hh.MenuCode === menu.MenuCode
                            );
                            return (
                              <Col
                                xl={6}
                                lg={8}
                                md={8}
                                sm={24}
                                xs={24}
                                key={menu.MenuCode}
                              >
                                <div
                                  className="self-order-card"
                                  style={{
                                    display: "flex",
                                    margin: "5px 10px",
                                    padding: "5px 5px",
                                    borderBottom: "1px solid #0003",
                                  }}
                                >
                                  <div style={{ marginRight: 5 }}>
                                    <img
                                      style={{ marginTop: 0 }}
                                      src={menu.DietType === "V" ? nonveg : veg}
                                      height="10"
                                      width="10"
                                    />
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      flex: 1,
                                    }}
                                  >
                                    <div>
                                      <div
                                        style={{
                                          fontSize: 14,
                                          fontWeight: "600",
                                          color: "#000",
                                        }}
                                      >
                                        {menu.MenuName}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 400,
                                        }}
                                      >
                                        {vars.length <= 0
                                          ? `${
                                              props.configs.find(
                                                (cc) =>
                                                  cc.ConfigCode === "CURRENCY"
                                              ).Value1
                                            } ${parseInt(menu.Rate)}`
                                          : vars.map((varrrr, index) => {
                                              return `${varrrr.VarDesc}${
                                                index != vars.length - 1
                                                  ? ", "
                                                  : ""
                                              }`;
                                            })}
                                      </div>
                                    </div>
                                    <AddQuantityComponent
                                      addOn={addOns}
                                      vars={vars}
                                      data={menu}
                                      onClickMinus={() => {
                                        if (
                                          !_.includes(
                                            ["PRINTED", "PAID"],
                                            "BLANK"
                                          )
                                        ) {
                                          onMenuItemClick(
                                            menu,
                                            null,
                                            [],
                                            "DEC"
                                          );
                                        }
                                        // setShowCart(true);
                                      }}
                                      onClickPlus={() => {
                                        if (
                                          !_.includes(
                                            ["PRINTED", "PAID"],
                                            "BLANK"
                                          )
                                        ) {
                                          if (
                                            vars.length > 0 ||
                                            addOns.length > 0
                                          ) {
                                            handleModal();
                                            setStoredMenuData({
                                              ...storedMenuData,
                                              menu: menu,
                                              var: vars,
                                              addOn: addOns,
                                            });
                                          } else {
                                            onMenuItemClick(
                                              menu,
                                              null,
                                              [],
                                              "INC"
                                            );
                                          }
                                        }
                                        // setShowCart(true);
                                      }}
                                    />
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                    </Row>
                  </div>
                );
              })}
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: "100",
                color: "#8b9194",
                lineHeight: "9",
                // background:'#f1f1f1'
                // background:'#fff'
              }}
            >
              {
                props.configs.find((cc) => cc.ConfigCode === "BRAND_NAME")
                  .Value1
              }
            </div>
            <Modal
              visible={showModal}
              title={storedMenuData.menu.MenuName}
              onOk={handleModal}
              onCancel={handleModal}
              footer={false}
              bodyStyle={{ padding: "10px 10px" }}
              destroyOnClose={true}
              style={{ width: "911px" }}
              className={`menu-var-addOn`}
            >
              {storedMenuData.var.length > 0 && (
                <>
                  <div style={{ fontWeight: "600", fontSize: 15 }}>
                    Variation
                  </div>
                  <Row gutter={[8, 8]}>
                    {storedMenuData.var
                      .sort((a, b) => (a.Rate > b.Rate ? 1 : -1))
                      .map((ii) => {
                        return (
                          <Col
                            xs={12}
                            sm={8}
                            md={6}
                            lg={6}
                            xl={6}
                            onClick={() => {
                              setStoredMenuData({
                                ...storedMenuData,
                                selectedVar: ii,
                              });
                            }}
                            key={ii.VarCode}
                          >
                            <div
                              style={{
                                fontWeight: "bold",
                              }}
                              className={`variation ${
                                storedMenuData.selectedVar.VarCode ===
                                ii.VarCode
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <div>{ii.VarDesc}</div>
                              <div style={{ fontSize: 11 }}>
                                {
                                  props.configs.find(
                                    (cc) => cc.ConfigCode === "CURRENCY"
                                  ).Value1
                                }{" "}
                                {parseInt(ii.Rate)}
                              </div>
                            </div>
                          </Col>
                        );
                      })}
                  </Row>
                </>
              )}
              {storedMenuData.addOn.map((stAddon) => {
                let tempData = menuAddOnDtl.filter(
                  (dtl) => dtl.AddOnCode === stAddon.AddonCode
                );
                return (
                  tempData.length > 0 && (
                    <Fragment key={stAddon.AddonCode}>
                      <div style={{ fontWeight: "640", fontSize: 15 }}>
                        {tempData[0].AddOnName}
                      </div>
                      <Row gutter={[8, 8]}>
                        {tempData.map((addOn) => {
                          return (
                            <Col
                              xs={12}
                              sm={8}
                              md={6}
                              lg={6}
                              xl={6}
                              key={addOn.Id}
                              onClick={() => {
                                let tempAddOn = storedMenuData.selectedAddOn;
                                if (
                                  tempAddOn.filter((aa) => aa.Id === addOn.Id)
                                    .length <= 0
                                ) {
                                  tempAddOn.push({
                                    ...addOn,
                                    Rate: parseInt(addOn.Rate),
                                  });
                                } else {
                                  tempAddOn = tempAddOn.filter(
                                    (aa) => aa.Id !== addOn.Id
                                  );
                                }
                                // let tt = _.countBy(tempAddOn, (c) => c);

                                setStoredMenuData({
                                  ...storedMenuData,
                                  selectedAddOn: tempAddOn,
                                });
                              }}
                            >
                              <div
                                style={{}}
                                className={`addons ${
                                  storedMenuData.selectedAddOn.filter(
                                    (aa) => aa.Id === addOn.Id
                                  ).length > 0
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div>{addOn.ItemName}</div>
                                <div
                                  style={{ fontSize: 11, fontWeight: "bold" }}
                                >
                                  {
                                    props.configs.find(
                                      (cc) => cc.ConfigCode === "CURRENCY"
                                    ).Value1
                                  }{" "}
                                  {parseInt(addOn.Rate)}
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </Fragment>
                  )
                );
              })}
              {/* <Divider style={{ margin: "5px 0px" }} /> */}
              <Row>
                {/* {console.log(selectedMenu, storedMenuData)} */}
                {selectedMenu &&
                  selectedMenu
                    .filter(
                      (ff) => ff.MenuCode === storedMenuData.menu.MenuCode
                    )
                    .sort((a, b) => (a.key > b.key ? 1 : -1))
                    .map((menu) => {
                      let vars = [];
                      vars = menuVariationRates.filter(
                        (xx) =>
                          xx.BranchCode === menu.BranchCode &&
                          xx.DeptCode === menu.DeptCode &&
                          xx.SecCode === menu.SecCode &&
                          xx.MenuCode === menu.MenuCode
                      );
                      let addOns = menuAddOn.filter(
                        (hh) => hh.MenuCode === menu.MenuCode
                      );
                      return (
                        <Col
                          xl={6}
                          lg={8}
                          md={8}
                          sm={24}
                          xs={24}
                          key={menu.key}
                        >
                          <div
                            className="self-order-card"
                            style={{
                              display: "flex",
                              margin: "5px 10px",
                              padding: "5px 5px",
                              borderBottom: "1px solid #0003",
                            }}
                          >
                            <div style={{ marginRight: 5 }}>
                              <img
                                style={{ marginTop: 0 }}
                                src={menu.DietType === "V" ? nonveg : veg}
                                height="10"
                                width="10"
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                flex: 1,
                              }}
                            >
                              <div>
                                <div style={{ fontSize: 17, color: "#000" }}>
                                  {menu.MenuName}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 400 }}>
                                  {menu.var === -1
                                    ? `${
                                        props.configs.find(
                                          (cc) => cc.ConfigCode === "CURRENCY"
                                        ).Value1
                                      } ${parseInt(menu.Rate)}`
                                    : menu.var.VarDesc}{" "}
                                  {menu.addOn.length > 0 ? "- " : ""}
                                  {menu.addOn.length > 0 &&
                                    menu.addOn.map((addOn, index) => {
                                      return `${addOn.ItemName}${
                                        index != menu.addOn.length - 1
                                          ? ", "
                                          : ""
                                      }`;
                                    })}
                                </div>
                              </div>
                              <AddQuantityComponent
                                data={menu}
                                addOn={[]}
                                vars={[]}
                                onClickMinus={() => {
                                  if (
                                    !_.includes(["PRINTED", "PAID"], "BLANK")
                                  ) {
                                    let data = selectedMenu.find(
                                      (fi) =>
                                        fi.MenuCode === menu.MenuCode &&
                                        fi.key === menu.key
                                    );

                                    if (data.Qty > 0) {
                                      data.Qty -= 1;

                                      // console.log(data);
                                      setSelectedMenu([
                                        ...selectedMenu.filter(
                                          (fi) =>
                                            fi.MenuCode !== menu.MenuCode ||
                                            fi.key !== menu.key
                                        ),
                                        data,
                                      ]);
                                    } else {
                                      setSelectedMenu([
                                        ...selectedMenu.filter(
                                          (fi) =>
                                            fi.MenuCode !== menu.MenuCode ||
                                            fi.key !== menu.key
                                        ),
                                      ]);
                                    }
                                  }
                                }}
                                onClickPlus={() => {
                                  if (
                                    !_.includes(["PRINTED", "PAID"], "BLANK")
                                  ) {
                                    let data = selectedMenu.find(
                                      (fi) =>
                                        fi.MenuCode === menu.MenuCode &&
                                        fi.key === menu.key
                                    );

                                    data.Qty += 1;
                                    setSelectedMenu([
                                      ...selectedMenu.filter(
                                        (fi) =>
                                          fi.MenuCode !== menu.MenuCode ||
                                          fi.key !== menu.key
                                      ),
                                      data,
                                    ]);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      );
                    })}
              </Row>
              <Divider style={{ margin: "5px 0px" }} />
              <div style={{ textAlign: "right" }}>
                <Button
                  onClick={() => {
                    handleModal();
                  }}
                  style={{ marginRight: 7 }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    if (
                      storedMenuData.menu.hasVariation === "Y" &&
                      storedMenuData.selectedVar !== -1
                    ) {
                      let tempData = [...selectedMenu];
                      setSelectedMenu([
                        ...tempData,
                        {
                          ...storedMenuData.menu,
                          addOn: storedMenuData.selectedAddOn,
                          var: storedMenuData.selectedVar,
                          Qty: 1,
                          key:
                            selectedMenu.filter(
                              (ff) =>
                                ff.MenuCode === storedMenuData.menu.MenuCode
                            ).length + 1,
                        },
                      ]);

                      handleModal();
                    } else {
                      if (
                        selectedMenu.filter(
                          (ff) => ff.MenuCode === storedMenuData.menu.MenuCode
                        ).length >= 0
                      ) {
                        handleModal();
                      } else message.error("select an Variation");
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </Modal>
          </>
        )}
        {showCart !== "SUCCESS" && showCart === true && (
          <>
            <div>
              <CartComponent
                currency={
                  props.configs.find((cc) => cc.ConfigCode === "CURRENCY")
                    .Value1
                }
                pageData={props.pageData}
                onBackPress={(data) => {
                  setShowCart(false);
                  setSelectedMenu(data);
                  let tempData = [...currMenus];
                  data
                    .filter(
                      (aa) => aa.isDirty === true && aa.hasVariation === "N"
                    )
                    .map((ii) => {
                      let menuIndex = currMenus.findIndex(
                        (item) => item.MenuCode === ii.MenuCode
                      );
                      tempData[menuIndex].Qty = ii.Qty;
                    });
                  setCurrMenus(tempData);
                }}
                selectedMenu={selectedMenu.filter((sm) => sm.Qty > 0)}
                menuVariationRates={menuVariationRates}
                menuAddOn={menuAddOn}
                onOrderSuccess={() => {
                  setShowCart("SUCCESS");
                }}
                configs={props.configs}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: "100",
                color: "#8b9194",
                lineHeight: "9",
                background: "#fff",
              }}
            >
              {
                props.configs.find((cc) => cc.ConfigCode === "BRAND_NAME")
                  .Value1
              }
            </div>
          </>
        )}
      </div>
      {showCart && showCart === "SUCCESS" && (
        <Result
          status="success"
          title="Your Order Was Placed Successfully!"
          subTitle="Please wait till your order is being confirmed."
          extra={[
            <Button
              key="buy"
              onClick={() => {
                // initialFetch();
                // setShowCart(false);
                // setSelectedMenu([]);
                props.reloadPage();
              }}
            >
              Place Another Order
            </Button>,
          ]}
        />
      )}
    </>
  );
};

export default CustomerSelfOrder;
