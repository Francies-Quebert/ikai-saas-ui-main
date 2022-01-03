import axios from "../axios";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Interceptor = props => {
  const login = useSelector(state => state.LoginReducer);
  // Add a request interceptor

  // for development
  const token = localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : login.token;

  useEffect(() => {
    // console.log("on login", window.location.href);

    axios.interceptors.request.use(
      function(config) {
        // Do something before request is
        // console.log('received token:',token)
        if (token) {
          config.headers.Authorization =
            "Bearer " + token ;
        }
        // console.log(config.headers);
        return config;
      },
      function(error) {
        // Do something with request error
        // props.history.push('signin')
        // console.log(">>>>>R", error);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function(config) {
        // Do something before request is sent

        return config;
      },
      function(error) {
        if (error.message.toUpperCase() === "NETWORK ERROR" || (error.response && error.response.status === 401)) {
          // alert("Unable to connect.");
        } else {
          // console.log('inside interceptor',error.message)
          // alert(error.message.toUpperCase());
        }
        // console.log('inside interceptor',error);
        // Do something with request error
        if (error.respons&&error.response.status && error.response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userData");
          window.location.href = "/loginLatest";
        }
       
        return Promise.reject(error);
      }
    );
  }, [{ isLoading: login.isLoading }]);
  return <React.Fragment />;
};

export { Interceptor as default };
