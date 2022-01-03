import React, { useEffect, useState } from "react";
import { Upload, Modal, Card, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
  UploadImageOwnWebServerMultiFile,
} from "../../../../shared/utility";
import { fetchMenuImages } from "../../../../services/menu-master";

const uploadButton = (
  <div>
    <PlusOutlined />
    <div className="ant-upload-text">Upload</div>
  </div>
);
let data = [];
export const sendFireBaseData = () => {
  return data;
};

let deletedData = [];
export const deletedFireBaseData = () => {
  return deletedData;
};

const MenuUploadImages = (props) => {
  const dispatch = useDispatch();
  const [mCode, setMCode] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState();
  const [count, setCount] = useState(0);
  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setFileList([]);
  }, [props.ResetClicked]);

  useEffect(() => {
    setMCode(props.MenuCode);
    fetchMenuImages(CompCode, props.MenuCode).then((res) => {
      let temp = [];
      res.map((ii) => {
        if (ii.SrNo > count) {
          setCount(ii.SrNo + 1);
        }
        temp.push({
          uid: ii.SrNo,
          name: ii.ImageName,
          status: "done",
          url: ii.URL,
          isDirty: false,
        });
      });
      setFileList(temp);
    });
  }, [props.MenuCode]);

  useEffect(() => {
    data = fileList;
    // console.log(fileList);
  }, [fileList]);
  return (
    <div>
      <Card>
        <div className="clearfix">
          <Upload
            disabled={mCode === null || mCode === "" ? true : false}
            action={(file) => {
              return new Promise(function (resolve, reject) {
                setCount(count + 1);
                if (DefaultUplodConfig.value1 === "FIREBASE") {
                  UploadImageFirebase(
                    `${CompCode}/${"MenuImages"}/${mCode}`,
                    file
                  ).then((res) => {
                    setFileList((oldArray) => [
                      ...oldArray,
                      {
                        uid: count,
                        // uid: res.fileName,
                        name: res.fileName,
                        status: "done",
                        url: res.url,
                        isDirty: true,
                      },
                    ]);
                  });
                } else {
                  UploadImageOwnWebServerMultiFile(
                    `${CompCode}/${"MenuImages"}/${mCode}`,
                    file
                  ).then((res) => {
                    setFileList((oldArray) => [
                      ...oldArray,
                      {
                        uid: count,
                        // uid: res.fileName,
                        name: res.fileName,
                        status: "done",
                        url: `${
                          FileUploadPath.value1
                        }/${CompCode}/${"MenuImages"}/${mCode}/${res.fileName}`,
                        isDirty: true,
                        pathType: "C",
                        customUrl: `${CompCode}/${"MenuImages"}/${mCode}/${
                          res.fileName
                        }`,
                      },
                    ]);
                  });
                }
              });
            }}
            listType="picture-card"
            fileList={fileList}
            multiple={true}
            onPreview={(img) => {
              //   console.log(img);
              setPreviewImage(img);
            }}
            onChange={(ee) => {
              setFileList(ee.fileList);
            }}
            onRemove={(val) => {
              deletedData = [...deletedData, val];
            }}
          >
            {uploadButton}
          </Upload>
          <Modal
            visible={previewImage ? true : false}
            // title={previewTitle}
            footer={null}
            onCancel={() => setPreviewImage()}
          >
            <img
              alt="example"
              style={{ width: "100%" }}
              src={previewImage ? previewImage.url : null}
            />
          </Modal>
        </div>
      </Card>
    </div>
  );
};

export default MenuUploadImages;
