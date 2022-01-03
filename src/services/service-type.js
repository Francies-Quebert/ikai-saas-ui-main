import axios from "../axios";
import { Avatar } from "antd";
export function getServiceTypeyMaster(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios.get(`appmain/getServiceTypes/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let subCategoryMaster = [];
        for (const key in resData) {
          subCategoryMaster.push({
            ...resData[key],
            serviceTypeImage:
              serviceTypeImageURI && serviceTypeImageURI ? (
                <Avatar
                  shape="square"
                  src={
                    pathType === "U"
                      ? serviceTypeImageURI
                      : `/${serviceTypeImageURI}`
                  }
                />
              ) : (
                <Avatar shape="square" icon={<UserOutlined />} />
              ),
            IsActiveComponent: (
              <i
                className={`fa fa-circle font-${
                  IsActive ? "success" : "danger"
                } f-12`}
              />
            ),
          });
        }
        // console.log("getUserRightMapp fetched data", pUserId, userRight);
        resolve(subCategoryMaster);
      });
    } catch (e) {
      reject(e);
    }
  });
}
