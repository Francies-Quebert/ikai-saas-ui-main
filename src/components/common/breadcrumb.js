import React, { Fragment, useState } from "react";
import { Home } from "react-feather";
import { Link } from "react-router-dom";
import Bookmark from "./bookmark";
// import { useSelector, useDispatch } from "react-redux";

const Breadcrumb = props => {

  // const [breadcrumb, setBreadcrumb] = useState(props);

  return (
    <Fragment>
      <div className="container-fluid">
        <div
          className="page-header p-t-5 p-b-5"
        >
          <div className="row">
            <div className="col">
              <div className="page-header-left">
                <h4>{props.title}</h4>
                <ol className="breadcrumb pull-right">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard/default">
                      <Home />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">{props.parent}</li>
                  <li className="breadcrumb-item active">{props.title}</li>
                </ol>
              </div>
            </div>
            {/* <!-- Bookmark Start--> */}
            {/* <Bookmark /> */}
            {/* <!-- Bookmark Ends--> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Breadcrumb;
