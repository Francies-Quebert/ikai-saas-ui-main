import React, { Fragment, useEffect, useState } from "react";
import { controllers } from "chart.js";
import { CheckCircle, Circle } from "react-feather";
import { Radio } from "antd";

const SelectableItemNew = (props) => {
  const SelectComponent = props.IsSelected ? CheckCircle : Circle;
  return (
    <Fragment>

      <ul
        style={{
          border: `1px solid ${props.IsSelected ? `#4466f2` : `#A9A9A9`}`,
          cursor: "pointer",
          marginBottom:8
        }}
        onClick={props.onSelect}
      >
        <li class="ant-list-item">
          <div class="ant-list-item-meta">
            <div class="ant-list-item-meta-avatar">
              <span style={{paddingLeft:12}} class="ant-avatar ant-avatar-circle ant-avatar-image">
                <Radio checked={props.IsSelected} />
              </span>
            </div>
            <div class="ant-list-item-meta-content">
              <h4 class="ant-list-item-meta-title">
                {/* <a href="https://ant.design"> */}
                {props.Title}
                {/* </a> */}
              </h4>
              <div class="ant-list-item-meta-description">
                {props.Description}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </Fragment>
  );
};
export default SelectableItemNew;
