import React from "react";
import { Menu, Button } from "antd";
const MenuDropDown = (props) => {
  return (
    <Menu.Item {...props} className="p-0 m-0" key={props.key}>
      <Button
        // disabled={record.SoldStatus !== "SOLD"}
        className="border-0 px-2 w-full m-0 text-left hover:bg-gray-200"
        style={{ padding: 0, marginLeft: 5 }}
        onClick={() => {
          props.onMenuClick();
          // props.onDownloadPdf(record);
        }}
        disabled={props.disabled ? props.disabled : false}
      >
        {/* <Tooltip placement="topLeft" title="Download Invoice"> */}
        {props.title} {props.Icon}
        {/* </Tooltip> */}
      </Button>
    </Menu.Item>
  );
};

export default MenuDropDown;

//   <MenuDropDown onMenuClick={()=>{}} title="" Icon={} disabled={}/>
