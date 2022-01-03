import React, { useEffect, useState } from "react";
import { Upload, Modal, Card, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
  UploadImageOwnWebServerMultiFile,
} from "../../../../shared/utility";
import { fetchItemImages } from "../../../../services/item-master";
import Item from "antd/lib/list/Item";

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

const ItemUploadImages = (props) => {
  const dispatch = useDispatch();
  const [iCode, setICode] = useState(null);
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
    // console.log("object")
    setFileList([]);
  }, [props.ResetClicked]);

  useEffect(() => {
    setICode(props.ItemCode);
    fetchItemImages(CompCode, props.ItemCode).then((res) => {
      let temp = [];

      res.map((ii) => {
        if (ii.SrNo > count) {
          setCount(ii.SrNo + 1);
        }
        temp.push({
          uid: ii.SrNo,
          name: ii.ImageName,
          status: "done",
          url:
            ii.pathType === "C" ? `${FileUploadPath.value1}/${ii.URL}` : ii.URL,
          isDirty: false,
          pathType: ii.pathType,
        });
      });
      setFileList(temp);
      // console.log(temp, "fetcgh");
    });
  }, [props.ItemCode]);

  useEffect(() => {
    data = fileList;
  }, [fileList]);

  return (
    <div>
      <Card style={{ borderBottom: 0 }}>
        <div className="clearfix">
          <Upload
            disabled={iCode === null || iCode === "" ? true : false}
            action={(file) => {
              return new Promise(function (resolve, reject) {
                setCount(count + 1);
                if (DefaultUplodConfig.value1 === "FIREBASE") {
                  UploadImageFirebase(
                    `${CompCode}/${"ProductImages"}/${iCode}`,
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
                        pathType: "U",
                      },
                    ]);
                  });
                } else {
                  UploadImageOwnWebServerMultiFile(
                    `${CompCode}/${"ProductImages"}/${iCode}`,
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
                        }/${CompCode}/${"ProductImages"}/${iCode}/${
                          res.fileName
                        }`,
                        isDirty: true,
                        pathType: "C",
                        customUrl: `${CompCode}/${"ProductImages"}/${iCode}/${
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
            onRemove={(val) => (deletedData = [...deletedData, val])}
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

export default ItemUploadImages;
