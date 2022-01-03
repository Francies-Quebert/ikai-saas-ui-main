import React, { useState, useEffect } from "react";
import { DesktopOutlined, MobileOutlined } from "@ant-design/icons";
import { Button } from "antd";
// import AppLayoutCard from "./AppLayout/AppLayoutCard";
import AppLayoutTableView from "./AppLayout/AppLayoutTableView";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch } from "react-redux";

const AppLayoutPage = () => {
  const dispatch = useDispatch();
  const [addCard, setAddCard] = useState();
  useEffect(() => {
    dispatch(setFormCaption(129));
  }, []);

  return (
    <>
      {!addCard && (
        <div className="flex">
          <div className="p-4">
            <Button
              className="w-60 h-60"
              icon={<MobileOutlined />}
              onClick={() => {
                setAddCard({ DeviceType: "M" });
              }}
            >
              Config Mobile Layout
            </Button>
          </div>
          <div className="p-4">
            <Button
              className="w-60 h-60"
              icon={<DesktopOutlined />}
              onClick={() => {
                setAddCard({ DeviceType: "W" });
              }}
            >
              Config Web Layout
            </Button>
          </div>
        </div>
      )}

      {addCard && (
        <AppLayoutTableView
          DeviceType={addCard.DeviceType}
          onBackpress={() => {
            setAddCard();
          }}
        />
      )}
    </>
  );
};

export default AppLayoutPage;
