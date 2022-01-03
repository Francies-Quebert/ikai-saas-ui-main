import React, { useEffect, useState } from "react";
import {
  Card,
  Divider,
  Row,
  Col,
  Button,
  Modal,
  Table,
  Popconfirm,
  Typography,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getKOTDtlData } from "../../../../../services/kot-view";
import moment from "moment";
import AppLoader from "../../../../common/AppLoader";
import {
  CheckCircleOutlined,
  DeleteTwoTone,
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
  StopOutlined,
} from "@ant-design/icons";
import swal from "sweetalert";

const SelfOrderDtlComp = () => {
  return <div></div>;
};

export default SelfOrderDtlComp;
