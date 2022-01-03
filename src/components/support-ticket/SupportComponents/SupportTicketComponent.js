import React, { Fragment, useEffect, useState } from "react";
import { CheckCircle, Circle } from "react-feather";
import { columnProperties } from "../../dashboard/OrdersDashboard/OrdersDashboardOrders";
import {Divider} from 'antd'
import renderHTML from "react-render-html";

import { Button } from "antd";

const SupportTicketComponent = (props) => {
  const [isSelect, setIsSelect] = useState();

  const SelectComponent = isSelect ? CheckCircle : Circle;
  return (
    <div className="card col-md-12 m-0">
      <div className="blog-box blog-list row">
        <div
          className="ribbon ribbon-right ribbon-right ribbon-success"
          style={{ backgroundColor: props.statusBackColor }}
        >
          <label style={{ color: props.statusForeColor }}>
            {props.statusDesc}
          </label>
        </div>
        <div className="col-sm-1 p-l-15">
          <SelectComponent
            onClick={() => {
              setIsSelect(!isSelect);
            }}
          />
        </div>
        <div className="col-sm-11">
          <div className="blog-details">
            <div className="blog-date digits">
              <span>#{props.ticketNo}</span> &nbsp;&nbsp; {props.helpType}
              &nbsp;
            </div>
            <h6>{props.helpTitle}</h6>

            {isSelect && (
              <div>
                <ul className="blog-social">
                  <li>{props.name}</li>
                  <li
                    style={{ borderRight: "1px solid #777", paddingRight: 15 }}
                  >
                    {props.mobile}
                  </li>
                  <li>{props.crt_dttm}</li>
                  {props.orderNo === null ? null : (
                    <li>Order No:{props.orderNo}</li>
                  )}
                </ul>
                <hr />
                <div>{props.helpDesc}</div>
                {props.customHelpText === null ? null : (
                  <div>
                    <strong>Customer Query:</strong>&nbsp;&nbsp;
                    <i>{renderHTML(props.customHelpText)}</i>
                  </div>
                )}
                <hr />
                <div className="card-body btn-showcase p-0 p-b-15">
                  <Button
                    // className="btn btn-square btn-outline-primary btn-sm"
                    type="primary"
                    onClick={props.onViewDetailClicked}
                    disabled={props.editDisabled}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketComponent;
