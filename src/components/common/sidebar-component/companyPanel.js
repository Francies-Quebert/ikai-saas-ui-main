import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const CompanyPanel = props => {
  const [url, setUrl] = useState();
  const dispatch = useDispatch();
  const loginInfo = useSelector(state => state.LoginReducer.userData);
  
  return (
    <Fragment>
      <div className="sidebar-user text-center" style={{position:'absolute', bottom:0, width:'100%'}} >
        {/* <div>
         
          <div className="profile-edit">
            <Link to="#">
              <Edit />
            
            </Link>
          </div>
        </div> */}
        <h6 className="mt-3 f-14"> {`Skyelint Portal`}</h6>
        {/* <h6 className="mt-3 f-14"> {"(Sub COmpany Name)"}</h6> */}
        <p>{"(Sub Company Name)"}</p>
        <p>{"UI : 1.55.14"}</p>
        <p>{"API : 1.5.11"}</p>

      </div>
    </Fragment>
  );
};

export default CompanyPanel;
