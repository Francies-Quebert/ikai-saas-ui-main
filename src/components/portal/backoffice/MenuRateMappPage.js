import React, { Fragment, useEffect, useState } from "react";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Avatar } from "antd";
import { toast } from "react-toastify";
import MenuRateMappCard from "./MenuRateMapping/MenuRateMappCard";
import { fetchDeptMaster } from "../../../store/actions/deptmaster";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import { fetchMenuCategoryMaster } from "../../../store/actions/menucategorymaster";
import { fetchMenuMaster } from "../../../store/actions/MenuMaster";

const MenuRateMappPage = () => {
  const dispatch = useDispatch();
  //useState
  const currTran = useSelector((state) => state.currentTran);

  useEffect(() => {
    if (currTran.isSuccess === true) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.isSuccess]);

  useEffect(() => {
    dispatch(setFormCaption(67));
    dispatch(fetchDeptMaster());
    dispatch(fetchBranchMaster());
    dispatch(fetchMenuCategoryMaster());
    dispatch(fetchMenuMaster());
  }, []);

  return (
    <div>
      <MenuRateMappCard />
    </div>
  );
};

export default MenuRateMappPage;
