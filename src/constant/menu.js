import { Home, File, Headphones, HelpCircle ,FilePlus} from "react-feather";

export const MENUITEMS = [
  {
    title: "Dashboard",
    icon: Home,
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/dashboard/OrderBookingMain",
        title: "Order Booking - Portal",
        type: "link"
      },
      {
        path: "/dashboard/OrdersDashboard",
        title: "Orders Dashboard",
        type: "link"
      }
    ]
  },
  {
    title: "Admin Panel",
    icon: File,
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      { path: "/admin-panel/userMaster", title: "User Master", type: "link" },
      {
        path: "/admin-panel/customerMaster",
        title: "Customer Master",
        type: "link"
      },
      {
        path: "/admin-panel/userGroupMaster",
        title: "User Group Master",
        type: "link"
      },
      {
        path: "/admin-panel/employeeMaster",
        title: "Employee Master",
        type: "link"
      },
      {
        path: "/admin-panel/userloginLogsMaster",
        title: "User Login Logs Master",
        type: "link"
      }
    ]
  },
  {
    title: "Administrator Panel",
    icon: Headphones,
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/administrator-panel/serviceTypeMaster",
        title: "Service Type Master",
        type: "link"
      },

      {
        path: "/administrator-panel/serviceMaster",
        title: "Service  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/slotMaster",
        title: "Slot  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/otherMaster",
        title: "Qualification  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/categoryMaster",
        title: "Category Master",
        type: "link"
      },
      {
        path: "/administrator-panel/expierenceMaster",
        title: "Experience Master",
        type: "link"
      },
      {
        path: "/administrator-panel/gradeMaster",
        title: "Grade Master",
        type: "link"
      },
      {
        path: "/administrator-panel/hstMaster",
        title: "HelpOrderStatus Master",
        type: "link"
      },
      {
        path: "/administrator-panel/designationMaster",
        title: "Designation Master",
        type: "link"
      },
      {
        path: "/administrator-panel/stsMaster",
        title: "Order Status Master",
        type: "link"
      },
      {
        path: "/administrator-panel/serviceslotlocmapMaster",
        title: "ServiceSlotLoc Master",
        type: "link"
      },

      {
        path: "/administrator-panel/promoMaster",
        title: "Promo  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/packageMaster",
        title: "Package  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/countryMaster",
        title: "Country  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/stateMaster",
        title: "State  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/cityMaster",
        title: "City  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/locationMaster",
        title: "Location  Master",
        type: "link"
      },
      {
        path: "/administrator-panel/Config",
        title: "Config",
        type: "link"
      },
      {
        path: "/administrator-panel/serviceratemapMaster",
        title: "Service Rate Mapping",
        type: "link"
      },
      {
        path: "/administrator-panel/tablesMaster",
        title: "Tables Master",
        type: "link"
      },
      {
        path: "/administrator-panel/sytemSequenceConfig",
        title: "System Sequence Config",
        type: "link"
      },
      {
        path: "/administrator-panel/classMaster",
        title: "Class Master",
        type: "link"
      },
      {
        path: "/administrator-panel/paymentMode",
        title: "PaymentMode Master",
        type: "link"
      },
      {
        path: "/administrator-panel/menuCategoryMaster",
        title: "Menu Category Master",
        type: "link"
      }
    ]
  },
  {
    title: "Help Center Master",
    icon: FilePlus,
    type: "sub",
    badgeType: "primary",
    active: false,
    children: [
      {
        path: "/help-center-master/helpMaster",
        title: "Help Master",
        type: "link"
      },
      {
        path: "/help-center-master/faqMaster",
        title: "FAQ Master",
        type: "link"
      }
    ]
  },
  {
    title: "Support Ticket",
    icon: HelpCircle,
    path: "/support-ticket/supportTicket",
    title: "Support Ticket",
    type: "link",
    bookmark: true,
    active: false
  }
  
];
