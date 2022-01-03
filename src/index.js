import React, { Fragment, useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Loader from "./components/common/loader";
import {
  BrowserRouter,
  Route,
  Router,
  Switch,
  Redirect,
} from "react-router-dom";
import { ScrollContext } from "react-router-scroll-4";
import * as serviceWorker from "./serviceWorker";
import { useSelector } from "react-redux";
// ** Import custom components for redux**
import { Provider } from "react-redux";
import store from "./store/index";
import App from "./components/app";
import Interceptor from "./utils/interceptor";
import "../src/assets/css/index.css";
// import RateChangePage from "./components/Inventory/RateChange/RateChangePage";

// Import custom Components

const LoginPageLatest = lazy(() => import("./components/Login/LoginPage"));
const SignUpPageLatest = lazy(() => import("./components/SignUp/SignUpPage"));

//sidebarcomponnet

const SidebarComponent = lazy(() =>
  import("./components/common/sidebar/SidebarComponent")
);
// --------------------------------------------------------------
const DefaultDashboard = lazy(() =>
  import("./components/DashboardNew/Dashboard")
);

const Adjustment = lazy(() =>
  import("./components/Inventory/Adjustment/AdjustmentPage")
);
const AppLayoutPage = lazy(() =>
  import("./components/portal/backoffice/AppLayoutPage")
);
const AppRoutePage = lazy(() =>
  import("./components/portal/backoffice/AppRoutePage")
);

const RateChange = lazy(() =>
  import("./components/Inventory/RateChange/RateChangePage")
);

const AdjustmentNew = lazy(() =>
  import("./components/Inventory/AdjustmentNew/AdjustmentPage")
);

const InitialDefaultComponent = lazy(() =>
  import("./components/common/InitialDefaultComponent")
);

const RestaurantPOS = lazy(() =>
  import("./components/dashboard/Restaurant/Restaurant-POS")
);

const OrderBookingMain = lazy(() =>
  import("./components/dashboard/OrderBookigMainHome")
);
const OrdersDashboardScreen = lazy(() =>
  import("./components/dashboard/OrdersDashboard")
);
const ScheduleCalendar = lazy(() =>
  import("./components/dashboard/ScheduleCalendar")
);

//Portal Components

const UserAccessPage = lazy(() =>
  import("./components/portal/backoffice/UserAccessPage")
);
const EmployeeMasterPage = lazy(() =>
  import("./components/portal/backoffice/EmployeeMasterPage")
);
const UserLoginLogsMasterPage = lazy(() =>
  import("./components/portal/backoffice/UserLoginLogsMasterPage")
);
const SubCategoryMaster = lazy(() =>
  import("./components/portal/backoffice/SubCategoryMaster")
);
const ItemMaster = lazy(() =>
  import("./components/portal/backoffice/ItemMaster")
);

const ChangePassword = lazy(() =>
  import("./components/portal/change-password/ChangePassword")
);

//Administrator Component
const ServiceTypeMasterPage = lazy(() =>
  import("./components/portal/Administration/ServiceTypeMaster")
);
const ServiceMasterPage = lazy(() =>
  import("./components/portal/Administration/ServiceMaster")
);
const SlotMasterPage = lazy(() =>
  import("./components/portal/Administration/SlotMaster")
);
const OtherMasterPage = lazy(() =>
  import("./components/portal/Administration/OtherMaster/OtherMaster")
);
const PromoMasterPage = lazy(() =>
  import("./components/portal/Administration/PromoMasterPage")
);
const PackageMasterPage = lazy(() =>
  import("./components/portal/Administration/PackageMasterPage")
);
const LocationMasterPage = lazy(() =>
  import("./components/portal/Administration/LocationMasterPage")
);
const ConfigPage = lazy(() =>
  import("./components/portal/Administration/ConfigPage")
);

const ServiceSlotLocMapPage = lazy(() =>
  import("./components/portal/Administration/ServiceSlotLocMapPage")
);
const ServiceRateMapPage = lazy(() =>
  import("./components/portal/Administration/serviceratemappage")
);
const CountryMasterPage = lazy(() =>
  import("./components/portal/Administration/CountryMasterPage")
);
const StateMasterPage = lazy(() =>
  import("./components/portal/Administration/StateMasterPage")
);
const CityMasterPage = lazy(() =>
  import("./components/portal/Administration/CityMasterPage")
);
const CategoryMasterPage = lazy(() =>
  import("./components/portal/Administration/CategoryMasterPage")
);

const ManufacturerMasterPage = lazy(() =>
  import("./components/portal/Administration/ManufacturerMasterPage")
);
const BrandMaster = lazy(() =>
  import("./components/portal/Administration/BrandMasterPage")
);
const TaxMaster = lazy(() =>
  // import("./components/portal/Administration/TaxMaster") old page
  import("./components/portal/Administration/NewTaxMaster/TaxMasterNewPage")
);

const HsnsacMasterPage = lazy(() =>
  // import("./components/portal/Administration/hsnsacMasterPage")  old page
  import(
    "./components/portal/Administration/NewHsnSacMaster/HsnsacMasterPageNew"
  )
);

const UnitMaster = lazy(() =>
  import("./components/portal/Administration/UnitMasterPage")
);

const CompanyMasterPage = lazy(() =>
  import("./components/portal/Administration/CompMainPage")
);
const BranchMasterPage = lazy(() =>
  import("./components/portal/Administration/BranchMasterPage")
);
const DepartmentMasterPage = lazy(() =>
  import("./components/portal/Administration/DeptMasterPage")
);

const SupportTicket = lazy(() =>
  import("./components/support-ticket/supportTicket")
);

const TablesMasterPage = lazy(() =>
  // import("./components/portal/backoffice/TablesMasterPage") OLD PAGE

  import("./components/portal/backoffice/NewTableMaster/TableMasterNewPage")
);
const SystemSequenceConfigPage = lazy(() =>
  // import("./components/portal/Administration/SystemSequenceConfigPage")
  import(
    "./components/portal/Administration/NewSystemSequenceConfig/SystemSequenceConfigNewPage"
  )
);

const ClassMasterPage = lazy(() =>
  import("./components/portal/backoffice/ClassMasterPage")
);

const PayMentModePage = lazy(() =>
  import("./components/portal/backoffice/PayMentModePage")
);

const MenuCategoryMasterPage = lazy(() =>
  import("./components/portal/backoffice/MenuCategoryMasterPage")
);

//firebase Auth

// Francies page
const LoginPage = lazy(() =>
  import("./components/portal/backoffice/LoginPage")
);
const CompanyAuth = lazy(() =>
  import("./components/portal/backoffice/CompanyAuthPage")
);
const NotificationTranCenter = lazy(() =>
  import("./components/notification-center/notificationTranCenter")
);
const Notificationlogs = lazy(() =>
  import("./components/notification-center/notificationlogs")
);
const NotificationPromoTemplate = lazy(() =>
  import("./components/notification-center/notificationPromoTemplate")
);

//Help Component ----Atul----20200421-----//
const HelpCenterMasterPage = lazy(() =>
  import("./components/portal/HelpPanel/HelpCenterMasterPage")
);
const FAQCenterMasterPage = lazy(() =>
  import("./components/portal/HelpPanel/FAQCenterMasterPage")
);
const HelpGrpUsrMappPage = lazy(() =>
  import("./components/portal/HelpPanel/HelpGrpUsrMappPage")
);
const FaqGrpUsrMappPage = lazy(() =>
  import("./components/portal/HelpPanel/FaqGrpUsrMappPage")
);

const ItemAddInfoTmplPage = lazy(() =>
  // import("./components/portal/Administration/ItemAddInfoTmplPage")
  import("./components/portal/Administration/ItemAddInfoTemplateNew")
);

const UserMasterPageOld = lazy(() =>
  import("./components/portal/backoffice/UserMasterPageOld")
);

const HomeScreenAppLayoutPage = lazy(() =>
  import("./components/portal/backoffice/HomeScreenAppLayoutPage")
);

const SectionMasterPage = lazy(() =>
  // import("./components/portal/backoffice/SectionMasterPage")
  import("./components/portal/backoffice/SectionMasterNew/SectionMasterNewPage")
);

const MenuMaster = lazy(() =>
  import("./components/portal/backoffice/MenuMasterPage")
);

const MenuAddon = lazy(() =>
  import("./components/portal/backoffice/MenuAddonPage")
);
const MenuOtherMasterPage = lazy(() =>
  import("./components/portal/backoffice/MenuOtherMasterPage")
);

const MenuRateMapping = lazy(() =>
  import("./components/portal/backoffice/MenuRateMappPage")
);

const ReciepeMasterPage = lazy(() =>
  import("./components/portal/backoffice/ReciepeMasterPage")
);

//Hari on 20200613
const ServiceOrdersPage = lazy(() =>
  import("./components/OrderManagment/ServiceOrders")
);

const ServiceSchedulePage = lazy(() =>
  import("./components/OrderManagment/ServiceSchedules")
);

//Atul on 20200617

const CustomerAddressPage = lazy(() =>
  import("./components/portal/backoffice/CustomerAddressPage")
);

const ReportMasterPage = lazy(() =>
  import("./components/report/reportMasterPage")
);

const RecieptMasterPage = lazy(() =>
  import("./components/portal/backoffice/RecieptMastePage")
);

const RecieptRefundMasterPage = lazy(() =>
  import("./components/portal/backoffice/RecieptRefund")
);

const Promotions = lazy(() =>
  import("./components/portal/backoffice/Promotions")
);

const CustomerOutstanding = lazy(() =>
  import("./components/portal/backoffice/CustomerOutstanding")
);

const BillSettlement = lazy(() =>
  import("./components/portal/backoffice/BillSettlement")
);
const Delivery_PickUp_KOT = lazy(() =>
  import("./components/Restaurant/Delivery_PickUp_KOT")
);

const CounterSale = lazy(() => import("./components/Restaurant/CounterSale"));

const KOTView = lazy(() =>
  import("./components/dashboard/Restaurant/KOT-View")
);

const PaymentGateway = lazy(() =>
  import("./components/payment-gateway/paymentGateway")
);

const CustomerSelfOrder = lazy(() =>
  import("./components/customer-self-order/SelfOrderPage")
);

const SelfOrderView = lazy(() =>
  import("./components/Restaurant/SelfOrderView")
);

const EncrptCustomerSelfOrderForm = lazy(() =>
  import("./components/customer-self-order/EncrptCustomerSelfOrderForm")
);

const HotKeys = lazy(() => import("./components/HotKeys"));

const ConfigTableQR = lazy(() =>
  // import("./components/portal/backoffice/ConfigTableQRCode")
  import("./components/portal/backoffice/ConfigTableQRNew/ConfigTableQRNewPage")
);

const OpeningStock = lazy(() =>
  import("./components/portal/backoffice/OpeningStockPage")
);
const SupplierMaster = lazy(() =>
  import("./components/portal/backoffice/SupplierMaster")
);

const SalesPage = lazy(() => import("./components/sales/SalesPage"));

const Purchases = lazy(() => import("./components/purchases/PurchasesPage"));

const RecipeManager = lazy(() =>
  import("./components/portal/backoffice/RecipeManager")
);
const TransactionTypeConfig = lazy(() =>
  import("./components/portal/backoffice/TransactionTypeConfig")
);

const PaymentMaster = lazy(() =>
  import("./components/portal/RecieptAndPayments/ReceiptAndPaymentsPage")
);

const DayBookPage = lazy(() =>
  import("./components/portal/RecieptAndPayments/DayBookPage")
);

const CashBookPage = lazy(() =>
  import("./components/portal/RecieptAndPayments/CashBook")
);

const PartyOutstandingPage = lazy(() =>
  import("./components/portal/RecieptAndPayments/PartyOutstandingPage")
);

const StockSummaryPage = lazy(() =>
  import("./components/portal/backoffice/StockSummaryPage")
);

const PartySKURateMappinPage = lazy(() =>
  import(
    "./components/portal/backoffice/PartySKURateMapping/PartySKURateMappinPage"
  )
);

//hari on 20210114
const ReportsMainPage = lazy(() =>
  import("./components/portal/Reports/ReportsMain")
);

const StockOutPage = lazy(() =>
  import("./components/Inventory/StockOut/StockOutPage")
);

//Hari on 20210122
const SaleViewTran = lazy(() =>
  import("./components/Inventory/TranViewableComponents/SaleViewTran")
);

const PurchaseReturn = lazy(() =>
  import("./components/Inventory/PurchaseReturn/PurchaseReturnPage")
);

const NewPurchasePage = lazy(() =>
  import("./components/purchases/NewPurchase/NewPurchasePage")
);

const SaleReturn = lazy(() =>
  // import("./components/Inventory/SaleReturn/SaleReturn")
  import("./components/Inventory/SaleReturnNew/SaleReturnNew")
);

const AppLoan = lazy(() => import("./components/AddLoanAccount"));

const RoundOffConfigPage = lazy(
  () =>
    import(
      "./components/portal/backoffice/RoundOffConfig/Component/RoundOffConfig"
    )
  // import("./components/portal/backoffice/RoundOffConfig/RoundOffConfig")
);

const BankAndCashBook = lazy(() =>
  import("./components/BankAndCashBook/BankAndCashBook")
);

const TransferAndAjustments = lazy(() =>
  import("./components/BankAndCashBook/components/TransferAndAjustments")
);
const GenricInvoice = lazy(() =>
  import("./components/Inventory/GenricInvoice/GenricInvoice")
);

const ChequeBook = lazy(() => import("./components/ChequeBook/ChequeBook"));

const SaleReturnNew = lazy(() =>
  import("./components/Inventory/SaleReturnNew/SaleReturnNew")
);

const ItemVariationConfigPage = lazy(() =>
  import("./components/portal/backoffice/ItemVariationConfigPage")
);

const SalesOrderPage = lazy(() =>
  import("./components/SalesOrder/SalesOrderPage")
);
const ErrorPage = lazy(() => import("./components/Login/ErrorPage"));

function Root() {
  // const hist = createBrowserHistory();
  useEffect(() => {
    localStorage.setItem("layout_version", "light");
    localStorage.setItem("primary_color", "#cc7a08");
    localStorage.setItem("secondary_color", "#1ea6ec");
    localStorage.setItem("theme-color", "style");
  }, []);

  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter basename={"/"}>
          <Interceptor />
          {/* <Router history={hist}> */}
          <ScrollContext>
            <Suspense fallback={<Loader />}>
              <Switch>
                <Route
                  path={`${process.env.PUBLIC_URL}/LoginLatest`}
                  component={LoginPageLatest}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SignUpPageLatest`}
                  component={SignUpPageLatest}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/encrypt-decrypt-skyelint-cryptography-utility`}
                  component={EncrptCustomerSelfOrderForm}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/payment-gateway`}
                  component={PaymentGateway}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/customer-self-order`}
                  component={CustomerSelfOrder}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/login`}
                  component={LoginPage}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/Company`}
                  component={CompanyAuth}
                />

                <Route
                  path={`${process.env.PUBLIC_URL}/change-password`}
                  component={ChangePassword}
                />

                <Fragment>
                  <App>
                    {/* dashboard menu */}
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/`}
                      // component={() => {
                      //   return null;
                      // }}
                      component={InitialDefaultComponent}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/dashboard/default`}
                      component={DefaultDashboard}
                    />
                    {/* //demo sidebar */}
                    <Route
                      path={`${process.env.PUBLIC_URL}/SidebarComponent`}
                      component={SidebarComponent}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/dashboard/restorantPOS`}
                      component={RestaurantPOS}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/dashboard/OrderBookingMain`}
                      component={OrderBookingMain}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/dashboard/OrdersDashboard`}
                      component={OrdersDashboardScreen}
                    />
                    {/* Pricing */}
                    <Route
                      path={`${process.env.PUBLIC_URL}/support-ticket/supportTicket`}
                      component={SupportTicket}
                    />
                    {/*  Admin Panel */}
                    <Route
                      path={`${process.env.PUBLIC_URL}/admin-panel/userMaster`}
                      // component={UserMasterPage}
                      render={() => <UserMasterPageOld trnType="A" />}
                      // trnType = "A"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/admin-panel/customerMaster`}
                      // component={UserMasterPage}
                      render={() => <UserMasterPageOld trnType="U" />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/admin-panel/userGroupMaster`}
                      // component={UserMasterPage}
                      render={() => <UserMasterPageOld trnType="G" />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/admin-panel/accessRights`}
                      render={() => <UserAccessPage trnType="A" />}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/admin-panel/accessRoleRights`}
                      render={() => <UserAccessPage trnType="G" />}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/admin-panel/employeeMaster`}
                      component={EmployeeMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/admin-panel/userloginlogsMaster`}
                      component={UserLoginLogsMasterPage}
                    />
                    {/* Login Page */}
                    {/* Administrator Panel */}
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/serviceTypeMaster`}
                      component={ServiceTypeMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/serviceMaster`}
                      component={ServiceMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/slotMaster`}
                      component={SlotMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/otherMaster`}
                      // component={UserMasterPage}
                      render={() => <OtherMasterPage trnType="QLF" />}
                      // trnType = "A"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/employeecategoryMaster`}
                      // component={UserMasterPage}
                      render={() => <OtherMasterPage trnType="CAT" />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/expierenceMaster`}
                      // component={UserMasterPage}
                      render={() => <OtherMasterPage trnType="EXP" />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/gradeMaster`}
                      // component={UserMasterPage}
                      render={() => <OtherMasterPage trnType="GRD" />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/hstMaster`}
                      // component={UserMasterPage}
                      render={() => <OtherMasterPage trnType="HST" />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/designationMaster`}
                      // component={UserMasterPage}
                      render={() => <OtherMasterPage trnType="DSG" />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/stsMaster`}
                      // component={UserMasterPage}
                      render={() => (
                        <OtherMasterPage
                          trnType="STS"
                          customLabelSysOption1="Fore Colour"
                          customLabelSysOption2="Back Colour"
                          customLabelSysOption3=""
                          customLabelSysOption4=""
                        />
                      )}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/serviceslotlocmapMaster`}
                      component={ServiceSlotLocMapPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/promoMaster`}
                      component={PromoMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/packageMaster`}
                      component={PackageMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/serviceratemapMaster`}
                      component={ServiceRateMapPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/countryMaster`}
                      component={CountryMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/stateMaster`}
                      component={StateMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/cityMaster`}
                      component={CityMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/locationMaster`}
                      component={LocationMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/config`}
                      component={ConfigPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/help-panel/helpMaster`}
                      component={HelpCenterMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/help-panel/faqMaster`}
                      component={FAQCenterMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/help-panel/faqGroupMaster`}
                      render={() => <OtherMasterPage trnType="FAQ" />}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/help-panel/helpGroupMaster`}
                      render={() => <OtherMasterPage trnType="HLP" />}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/help-panel/helpGroupUserMapp`}
                      component={HelpGrpUsrMappPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/help-panel/faqGroupUserMapp`}
                      component={FaqGrpUsrMappPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/dashboard/ScheduleCalendar`}
                      component={ScheduleCalendar}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/notification-center/notificationTranCenter`}
                      component={NotificationTranCenter}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/notification-center/NotificationLogs`}
                      component={Notificationlogs}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/notification-center/NotificationPromo`}
                      component={NotificationPromoTemplate}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/subCategoryMaster`}
                      component={SubCategoryMaster}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/categoryMaster`}
                      component={CategoryMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/manufacturerMaster`}
                      component={ManufacturerMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/taxMaster`}
                      component={TaxMaster}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/brandMaster`}
                      component={BrandMaster}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/hsnsacMaster`}
                      component={HsnsacMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/itemMaster`}
                      component={ItemMaster}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/unitMaster`}
                      component={UnitMaster}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/companyMaster`}
                      component={CompanyMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/departmentMaster`}
                      component={DepartmentMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/branchMaster`}
                      component={BranchMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/itemAddInfoTemplate`}
                      component={ItemAddInfoTmplPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/homeScreenAppLayout`}
                      component={HomeScreenAppLayoutPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/tablesMaster`}
                      component={TablesMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/systemSequenceConfig`}
                      component={SystemSequenceConfigPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/sectionMaster`}
                      component={SectionMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/classMaster`}
                      component={ClassMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/paymentMode`}
                      component={PayMentModePage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/menuMaster`}
                      component={MenuMaster}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/menuCategoryMaster`}
                      component={MenuCategoryMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/menuAddon`}
                      component={MenuAddon}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/menuVariation`}
                      // component={UserMasterPage}
                      render={() => (
                        <MenuOtherMasterPage
                          trnType="VAR"
                          customLabelSysOption1=""
                          customLabelSysOption2=""
                          customLabelSysOption3=""
                          customLabelSysOption4=""
                          customLabelSysOption5=""
                        />
                      )}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/menuGroup`}
                      // component={UserMasterPage}
                      render={() => (
                        <MenuOtherMasterPage
                          trnType="MGRP"
                          customLabelSysOption1=""
                          customLabelSysOption2=""
                          customLabelSysOption3=""
                          customLabelSysOption4=""
                          customLabelSysOption5=""
                        />
                      )}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/specialNotes`}
                      // component={UserMasterPage}
                      render={() => (
                        <MenuOtherMasterPage
                          trnType="SPLNTS"
                          customLabelSysOption1=""
                          customLabelSysOption2=""
                          customLabelSysOption3=""
                          customLabelSysOption4=""
                          customLabelSysOption5=""
                        />
                      )}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/dietTypeMaster`}
                      // component={UserMasterPage}
                      render={() => (
                        <MenuOtherMasterPage
                          trnType="DEITTYP"
                          customLabelSysOption1=""
                          customLabelSysOption2=""
                          customLabelSysOption3=""
                          customLabelSysOption4=""
                          customLabelSysOption5=""
                        />
                      )}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/menuRateMapping`}
                      component={MenuRateMapping}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/reciepeMaster`}
                      component={ReciepeMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/OrderManagment/service-orders`}
                      component={ServiceOrdersPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/OrderManagment/service-schedules`}
                      component={ServiceSchedulePage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/admin-panel/customerAddresses`}
                      component={CustomerAddressPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/report/reportMasterPage`}
                      component={ReportMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/recieptMaster`}
                      component={RecieptMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/recieptRefund`}
                      component={RecieptRefundMasterPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/tableStatusMaster`}
                      // component={UserMasterPage}
                      render={() => (
                        <MenuOtherMasterPage
                          trnType="TSTS"
                          customLabelSysOption1="Status Color"
                          customLabelSysOption2="OrderBy"
                          customLabelSysOption3=""
                          customLabelSysOption4=""
                          customLabelSysOption5=""
                        />
                      )}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/promotions`}
                      component={Promotions}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/customerOutstanding`}
                      component={CustomerOutstanding}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/billSettlement`}
                      component={BillSettlement}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/dashboard/KotDeliveryPickUp`}
                      component={Delivery_PickUp_KOT}
                    />{" "}
                    <Route
                      path={`${process.env.PUBLIC_URL}/dashboard/kotView`}
                      component={KOTView}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/dashboard/CounterSale`}
                      component={CounterSale}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/kotStsMaster`}
                      // component={UserMasterPage}
                      render={() => (
                        <MenuOtherMasterPage
                          trnType="KOTSTS"
                          customLabelSysOption1="Fore Color"
                          customLabelSysOption2="Back Color"
                          customLabelSysOption3=""
                          customLabelSysOption4=""
                          customLabelSysOption5=""
                        />
                      )}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/schemeDiscount`}
                      // component={UserMasterPage}
                      render={() => <Promotions promoType="SCHEME" />}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/couponDiscount`}
                      // component={UserMasterPage}
                      render={() => <Promotions promoType="COUPON" />}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/dashboard/selfOrder`}
                      component={SelfOrderView}
                    />{" "}
                    <Route
                      path={`${process.env.PUBLIC_URL}/hotKeys`}
                      component={HotKeys}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/configTableQr`}
                      component={ConfigTableQR}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/openingStock`}
                      component={OpeningStock}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/supplierMaster`}
                      component={SupplierMaster}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/sales/sales`}
                      component={SalesPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/purchase/purchases`}
                      component={Purchases}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/recipeManager`}
                      component={RecipeManager}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/genericInvoice`}
                      component={GenricInvoice}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/expenseCategoryMaster`}
                      // component={UserMasterPage}
                      render={() => (
                        <OtherMasterPage
                          trnType="EXPS"
                          customLabelSysOption1="Expense Type"
                          // customLabelSysOption2="Back Colour"
                          // customLabelSysOption3=""
                          // customLabelSysOption4=""
                        />
                      )}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/incomeCategoryMaster`}
                      render={() => (
                        <OtherMasterPage
                          trnType="INC"
                          customLabelSysOption1="Income Type"
                          // customLabelSysOption2="Back Colour"
                          // customLabelSysOption3=""
                          // customLabelSysOption4=""
                        />
                      )}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/transactionTypeConfig`}
                      component={TransactionTypeConfig}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/payments`}
                      render={() => {
                        return <PaymentMaster TranType="PMT" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/receipt`}
                      render={() => {
                        return <PaymentMaster TranType="RCT" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/income`}
                      render={() => {
                        return <PaymentMaster TranType="INC" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/expenses`}
                      render={() => {
                        return <PaymentMaster TranType="EXPS" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/dayBook`}
                      render={() => {
                        return <DayBookPage TranType="DAY" />;
                      }}
                    />
                    {/* <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/cashBook`}
                      render={() => {
                        return <CashBookPage />;
                      }}
                    /> */}
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/cashBook`}
                      render={() => {
                        return <DayBookPage TranType="CASH" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/partyOutStanding`}
                      render={() => {
                        return <PartyOutstandingPage />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/adjustment`}
                      render={() => {
                        return <Adjustment TranType="ADJS" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/adjustmentNew`}
                      render={() => {
                        return <AdjustmentNew TranType="ADJS" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/reProcessing`}
                      render={() => {
                        return <Adjustment TranType="REPRO" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/rateAdjustment`}
                      render={() => {
                        return <Adjustment TranType="RAADJ" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/stockSummary`}
                      render={() => {
                        return <StockSummaryPage />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/item-rate-change`}
                      render={() => {
                        return <RateChange />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/backoffice/partySKURateMapping`}
                      render={() => {
                        return <PartySKURateMappinPage />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/reasonsMaster`}
                      render={() => <OtherMasterPage trnType="RSM" />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/reports-main`}
                      render={() => <ReportsMainPage />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/stockOut`}
                      render={() => <StockOutPage />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/saleViewTran`}
                      render={() => <SaleViewTran VoucherId={33} />}
                      // trnType = "U"
                    />
                    {/* ReportsMainPage */}
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/purchaseReturn`}
                      render={() => <PurchaseReturn />}
                      // trnType = "U"
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/purchaseNew`}
                      render={() => {
                        return <NewPurchasePage />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/inventory/salesReturn`}
                      render={() => {
                        return <SaleReturn />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/appLoan`}
                      component={AppLoan}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/roundOffConfig`}
                      component={RoundOffConfigPage}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/cash-and-bank/bank-accounts`}
                      component={() => {
                        return <BankAndCashBook TranType="BANK" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/cash-and-bank/cash-flow`}
                      render={() => {
                        return (
                          <BankAndCashBook TranType="CASH" IsCashFlow={true} />
                        );
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/book/cheque-book`}
                      render={() => {
                        return (
                          <ChequeBook TranType="CHEQUE" IsCashFlow={true} />
                        );
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/cash-and-bank/cheques`}
                      render={() => {
                        return (
                          <TransferAndAjustments
                            TranType={"CHQ"}

                            // TranId={}
                          />
                        );
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/sales/salesReturnNew`}
                      component={SaleReturnNew}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/generic-money-in`}
                      render={() => {
                        return <PaymentMaster TranType="GNRCIN" />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/receipts-payments/generic-money-out`}
                      render={() => {
                        return <PaymentMaster TranType="GNRCOUT" />;
                      }}
                    />{" "}
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-pane/itemVariationConfig`}
                      render={() => {
                        return <ItemVariationConfigPage />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/sales-order/salesOrder`}
                      render={() => {
                        return <SalesOrderPage />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/app-layout`}
                      render={() => {
                        return <AppLayoutPage />;
                      }}
                    />
                    <Route
                      path={`${process.env.PUBLIC_URL}/administrator-panel/app-route`}
                      render={() => {
                        return <AppRoutePage />;
                      }}
                    />
                  </App>
                </Fragment>
              </Switch>
            </Suspense>
          </ScrollContext>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

ReactDOM.render(<Root />, document.getElementById("root"));

serviceWorker.unregister();
