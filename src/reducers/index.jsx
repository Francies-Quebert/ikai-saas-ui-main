import { combineReducers } from 'redux'
import Customizer from './customizer.reducer'
import LoginReducer from '../store/reducers/login'
import AppMain from '../store/reducers/appMain'
import currentTran from '../store/reducers/currentTran'
import userMaster from '../store/reducers/usermaster'
import ordersPortal from '../store/reducers/ordersPortal'
import slotMaster from '../store/reducers/slotmaster'
import promoMaster from '../store/reducers/promomaster'
import supportTicket from '../store/reducers/supportTicket'
import employeeMaster from '../store/reducers/employeemaster'
import locationMaster from '../store/reducers/locationmaster'
import config from '../store/reducers/config'
import serviceMaster from '../store/reducers/servicemaster'
import currentOrder from '../store/reducers/currentOrder'
import otherMaster from '../store/reducers/othermaster'
import userloginlogs from '../store/reducers/userloginlogs'
import packageMaster from '../store/reducers/PackageMaster'
import serviceSlotLocMapMaster from '../store/reducers/ServiceSlotLocMapMaster'
import serviceratemap from '../store/reducers/serviceratemap'
import countryMaster from '../store/reducers/CountryMaster'
import stateMaster from '../store/reducers/StateMaster'
import cityMaster from '../store/reducers/CityMaster'
import orders from '../store/reducers/orders'
import userRights from '../store/reducers/userRights'
import helpmasterportal from '../store/reducers/helpmaster'
import notificationCenter from '../store/reducers/notificationCenter'
import subCategoryMaster from '../store/reducers/subCategoryMaster'
import manufacturermaster from '../store/reducers/manufacturermaster'
import categoryMaster from '../store/reducers/categoryMaster'
import taxMaster from '../store/reducers/taxMaster'
import brandMaster from '../store/reducers/brandmaster'
import hsnsacMaster from '../store/reducers/hsnsacMaster'
import unitMaster from '../store/reducers/unitmaster'
import deptMaster from '../store/reducers/deptmaster'
import branchMaster from '../store/reducers/branchmaster'
import compmain from '../store/reducers/compmain'
import ItemMaster from '../store/reducers/ItemMaster'
import tablesMaster from '../store/reducers/tablesmaster'
import sysSequenceConfig from '../store/reducers/sys-sequence-config'
import classMaster from "../store/reducers/ClassMaster"
import paymodeMaster from "../store/reducers/paymodemaster"
import MenuMaster from "../store/reducers/MenuMaster"
import menuCategoryMaster from "../store/reducers/menucategorymaster"

import promotion from "../store/reducers/promotions"


// import compmain from '../store/reducers/compmain'

import itemAddInfoTemplate from '../store/reducers/ItemAddInfoTemplate'

const reducers = combineReducers({
  Customizer,
  LoginReducer,
  AppMain,
  currentTran,
  userMaster,
  ordersPortal,
  promoMaster,
  employeeMaster,
  supportTicket,
  slotMaster,
  locationMaster,
  config,
  serviceMaster,
  userloginlogs,
  otherMaster,
  currentOrder,
  packageMaster,
  serviceSlotLocMapMaster,
  countryMaster,
  stateMaster,
  serviceratemap,
  cityMaster,
  orders,
  userRights,
  helpmasterportal,
  notificationCenter,
  subCategoryMaster,
  categoryMaster,
  manufacturermaster,
  taxMaster,
  brandMaster,
  hsnsacMaster,
  unitMaster,
  
  branchMaster,
  compmain,
  deptMaster,
  ItemMaster,

  itemAddInfoTemplate,
  tablesMaster,
  sysSequenceConfig,
  classMaster,
  paymodeMaster,
  MenuMaster,
  menuCategoryMaster,
  promotion
})

export default reducers
