import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import { fetchConfig, fetchValidateSelfOrder } from "../../services/self-order";
import CustomerSelfOrder from "./customerSelfOrder";
import Loader from "../common/loader";
import Cryptr from "cryptr";
import { Button, Result } from "antd";

const SelfOrderPage = () => {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  function customQuery(url) {
    return new URLSearchParams(`?${url}`);
  }
  //   url needed
  // http://localhost:3023/customer-self-order?compCode=1&tableName=T14&branchCode=ANDHERI&deptCode=DINEIN&secCode=BAR&tableNo=B-T14&additionalInfo=some random stuff
  let query = useQuery();
  const [configs, setConfigs] = useState([]);
  const [PageState, setPageState] = useState("LOAD");
  const [pageData, setPageData] = useState(-1);
  const cryptr = new Cryptr("Skyelint@2020");
  // const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    initialLoad()
      .then((res) => {
        setConfigs(res[0]);
        setPageData({
          CompCode: res[1].CompCode,
          TableName: res[1].TableName,
          BranchCode: res[1].BranchCode,
          DeptCode: res[1].DeptCode,
          SecCode: res[1].SecCode,
          TableNo: res[1].TableNo,
          additionalInfo: res[1].additionalInfo,
        });
        setPageState("LOADED");
      })
      .catch((err) => {
        console.error("in error", err);
        setPageState("ERROR");
      });
  }, []);

  const initialLoad = () => {
    return new Promise(function (resolve, reject) {
      setPageState("LOAD");
      setTimeout(() => {
        try {
          let CompCode = query.get("compCode");
          fetchConfig(CompCode).then(async (config) => {
            let TableName = query.get("tableName");
            let BranchCode = query.get("branchCode");
            let DeptCode = query.get("deptCode");
            let SecCode = query.get("secCode");
            let TableNo = query.get("tableNo");
            let additionalInfo = query.get("additionalInfo");
            let tempData = {
              CompCode,
              TableName,
              BranchCode,
              DeptCode,
              SecCode,
              TableNo,
              additionalInfo,
            };
            fetchValidateSelfOrder(CompCode, tempData).then((res) => {
              if (
                res[0].length <= 0 ||
                res[1].length <= 0 ||
                res[2].length <= 0 ||
                res[3].length <= 0
              ) {
                console.error("invalid Link");
                reject("invalid Link");
              } else {
                resolve([
                  config,
                  {
                    CompCode,
                    TableName,
                    BranchCode,
                    DeptCode,
                    SecCode,
                    TableNo,
                    additionalInfo,
                  },
                ]);
              }
            });
          });
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
  };

  return (
    <>
      {PageState === "LOAD" || configs.length <= 0 || pageData === -1 ? (
        <Loader />
      ) : (
        configs.length > 0 && (
          <CustomerSelfOrder
            configs={configs}
            pageData={pageData}
            onErrorFound={() => {
              setPageState("ERROR");
            }}
            reloadPage={() => {
              initialLoad().then((res) => {
                // setConfigs(res);
                // setPageData({
                //   CompCode: res[1].CompCode,
                //   TableName: res[1].TableName,
                //   BranchCode: res[1].BranchCode,
                //   DeptCode: res[1].DeptCode,
                //   SecCode: res[1].SecCode,
                //   TableNo: res[1].TableNo,
                //   additionalInfo: res[1].additionalInfo,
                // });
                // console.log(res, "LOADED");
                setPageState("LOADED");
              });
            }}
          />
        )
      )}
      {PageState === "ERROR" && (
        <div>
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            // extra={<Button type="primary"></Button>}
          />
        </div>
      )}
    </>
  );
};

export default SelfOrderPage;
