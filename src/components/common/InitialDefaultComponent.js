import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
const InitialDefaultComponent = () => {
  const history = useHistory();
  const login_user = useSelector((state) => state.LoginReducer.userData);

  useEffect(() => {
    if (login_user) {
      if (
        // console.log(object)
        login_user &&
        !_.includes([null, undefined, "", "null"], login_user.defaultPath)
      ) {
        history.push(`${process.env.PUBLIC_URL}${login_user.defaultPath}`);
      } else {
        history.push(`${process.env.PUBLIC_URL}/dashboard/default`);
      }
    }
  }, [login_user]);
  return <div></div>;
};

export default InitialDefaultComponent;
