import {
  ArrowLeftOutlined,
  FileDoneOutlined,
  LeftOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Input, InputNumber, Tooltip, Skeleton } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { Upload, Modal } from "antd";
import { variationDetailContext } from "./ItemMasterCardNew";
import _ from "lodash";
import { useSelector } from "react-redux";
import {
  UploadImageFirebase,
  UploadImageOwnWebServerMultiFile,
} from "../../../../shared/utility";
import { fetchItemImages } from "../../../../services/item-master";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const EditItemVariations = ({ record, dataSource, onCloseClick }) => {
  var {
    variationDataSource,
    setVariationDataSource,
    variantTypes,
    itemData,
    CompCode,
    uploadedImg,
    setUploadedImg,
    fetchImageUpload,
    setFetchImageUpload,
  } = useContext(variationDetailContext);

  const [variantProccessing, setVariantProccessing] = useState([]);
  const [formData, setFormData] = useState({
    option: [],
    pricing: {
      costPrice: null,
      salePrice: null,
      MRP: null,
    },
    currentVariant: null,
    nextVariant: 0,
    prevVariant: 0,
    isDirty: false,
    ItemData: null,
  });
  const [loading, setLoading] = useState(false);
  const DefaultUplodConfig = useSelector((state) => state.AppMain.appconfigs);
  const FileUploadPath = useSelector((state) => state.AppMain.appconfigs).find(
    (aa) => aa.configCode === "UPLOAD_PATH"
  );
  const handleCancel = () =>
    setFetchImageUpload((old) => {
      return { ...old, previewVisible: false };
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setFetchImageUpload((old) => {
      return {
        ...old,
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle:
          file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      };
    });
  };

  const handleChange = ({ fileList }) =>
    setFetchImageUpload({ ...fetchImageUpload, fileList });

  useEffect(() => {
    onLoadVariant({
      ...record,
      salePrice: record.price,
      costPrice: record.costPrice,
      MRP: record.MRP,
    });
    return () => {};
  }, []);

  const onLoadVariant = async (curRecord) => {
    setLoading(true);
    let tempVariantTypes = curRecord.variantType;
    let tempCurrRecord = curRecord;
    let pageRecordIdx = await getPagingValue(tempCurrRecord);
    if (pageRecordIdx) {
      let data = {
        ...formData,
        option: [...tempVariantTypes],
        pricing: {
          costPrice: curRecord.costPrice,
          salePrice: curRecord.price,
          MRP: curRecord.MRP,
        },
        ...pageRecordIdx,
        ItemData: curRecord,
      };
      setFormData(data);
      setVariantProccessing([...dataSource]);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const getPagingValue = (tempCurrRecord) => {
    return new Promise((resolve, reject) => {
      try {
        let tdata = dataSource.filter((aa) => aa.IsActive === true);
        if (tdata.length > 1) {
          const currentVariantIdx = tdata.findIndex(
            (aa) => aa.key === tempCurrRecord.key
          );

          // const currentVariantIdx
          const lastIdx = tdata.length - 1;
          let prevIdx = null;
          let nextIdx = null;
          if (currentVariantIdx === lastIdx) {
            prevIdx = lastIdx - 1;
            nextIdx = 0;
          } else if (currentVariantIdx === 0) {
            prevIdx = lastIdx;
            nextIdx = currentVariantIdx + 1;
          } else {
            prevIdx = currentVariantIdx - 1;
            nextIdx = currentVariantIdx + 1;
          }

          resolve({
            currentVariant: currentVariantIdx,
            nextVariant: nextIdx,
            prevVariant: prevIdx,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  const onTempSaveClick = () => {
    const tempDataSource = variationDataSource.filter(
      (aa) => aa.IsActive === true
    );

    const findData = tempDataSource[formData.currentVariant];
    if (findData) {
      findData.costPrice = formData ? formData.pricing.costPrice : null;
      findData.MRP = formData ? formData.pricing.MRP : null;
      findData.price = formData ? formData.pricing.salePrice : null;
    }
    setVariantProccessing([
      ...variationDataSource.filter((aa) => aa.IsActive === false),
      ...tempDataSource,
    ]);
    return { tdataSource: tempDataSource, data: findData };
  };

  const onSaveClick = async () => {
    let { tdataSource } = await onTempSaveClick();
    setVariationDataSource([...tdataSource]);
    setUploadedImg([...uploadedImg, ...fetchImageUpload.fileList]);
    onCloseClick();
  };

  const onFileUpload = (file) => {
    return new Promise(function (resolve, reject) {
      let tempDefaultUplodConfig = DefaultUplodConfig.find(
        (up) => up.configCode === "UPLOADS"
      );
      if (
        tempDefaultUplodConfig &&
        tempDefaultUplodConfig.value1 === "FIREBASE"
      ) {
        // UploadImageFirebase(
        //   `${CompCode}/${"ProductImages"}/${iCode}`,
        //   file
        // ).then((res) => {
        //   setFileList((oldArray) => [
        //     ...oldArray,
        //     {
        //       uid: count,
        //       // uid: res.fileName,
        //       name: res.fileName,
        //       status: "done",
        //       url: res.url,
        //       isDirty: true,
        //       pathType: "U",
        //     },
        //   ]);
        // });
      } else {
        UploadImageOwnWebServerMultiFile(
          `${CompCode}/${"ProductImages"}/${itemData.ItemCode}/${record.sku}`,
          file
        ).then((res) => {
          setFetchImageUpload((oldData) => {
            return {
              ...oldData,
              fileList: [
                ...oldData.fileList,
                {
                  ItemCode: record.sku,
                  uid: oldData.fileList.length + 1,
                  // uid: res.fileName,
                  name: res.fileName,
                  status: "done",
                  url: `${
                    FileUploadPath.value1
                  }/${CompCode}/${"ProductImages"}/${itemData.ItemCode}/${
                    record.sku
                  }/${res.fileName}`,
                  isDirty: true,
                  pathType: "C",
                  customUrl: `${CompCode}/${"ProductImages"}/${
                    itemData.ItemCode
                  }/${record.sku}/${res.fileName}`,
                  isDeleted: false,
                },
              ],
            };
          });
        });
      }
    });
  };

  const onFileRemove = (fileList) => {
    let tempImageFileList = fetchImageUpload.fileList;
    let filelistIdx = tempImageFileList.findIndex(
      (ff) => ff.ItemCode === fileList.ItemCode
    );
    tempImageFileList[filelistIdx].isDeleted = true;

    setFetchImageUpload({ ...fetchImageUpload, fileList: tempImageFileList });
  };
  return loading ? (
    <div className="p-6 pb-8 bg-gray-100" style={{ minHeight: 700 }}>
      <Skeleton active={true} paragraph={{ rows: 18 }} />
      <div className="card-custom-tw flex justify-end p-2 mt-2">
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            onSaveClick();
          }}
        >
          Save and CLose
        </Button>
      </div>
    </div>
  ) : (
    <MainEditComponent
      dataSource={dataSource.filter((aa) => aa.IsActive === true)}
      formData={formData}
      onLoadVariant={onLoadVariant}
      imageUpload={fetchImageUpload}
      handlePreview={handlePreview}
      handleChange={handleChange}
      handleCancel={handleCancel}
      setFormData={setFormData}
      onSaveClick={onSaveClick}
      onTempSaveClick={onTempSaveClick}
      onCloseClick={onCloseClick}
      onFileUpload={onFileUpload}
      onFileRemove={onFileRemove}
      itemData={itemData}
      record={formData.ItemData}
    />
  );
};
const MainEditComponent = ({
  dataSource,
  formData,
  onLoadVariant,
  imageUpload,
  handlePreview,
  handleChange,
  handleCancel,
  setFormData,
  onSaveClick,
  onTempSaveClick,
  onCloseClick,
  onFileUpload,
  onFileRemove,
  itemData,
  record,
}) => {
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="px-4 py-3 bg-gray-100">
      <div className="flex justify-between px-4">
        <div>
          <Tooltip title="Go Back" placement="rightTop">
            <Button icon={<ArrowLeftOutlined />} onClick={onCloseClick} />
          </Tooltip>
        </div>
        <div className="flex">
          <Button
            type="primary"
            className="mr-1"
            icon={<LeftOutlined />}
            onClick={() => {
              if (formData) {
                onLoadVariant(dataSource[formData.prevVariant]);
              }
            }}
          />
          <Button
            type="primary"
            icon={<RightOutlined />}
            onClick={() => {
              if (formData) {
                onLoadVariant(dataSource[formData.nextVariant]);
              }
            }}
          />
        </div>
      </div>
      <div className="p-4 pr-2 flex space-x-4">
        <div className="w-1/3 lg:w-1/4">
          {/* Product info */}
          <div className="p-4 flex card-custom-tw mb-4">
            <div className="border border-light-tw bg-white w-24 h-20 my-auto flex justify-center items-center">
              Image
            </div>
            <div className="py-2 pl-2 pr-0">
              <div className="font-semibold">{itemData.ItemName}</div>
              <div className="text-gray-600 text-sm">{itemData.ItemDesc}</div>
              <div
                className="underline text-blue-600 cursor-pointer"
                onClick={onCloseClick}
              >
                Back to product
              </div>
            </div>
          </div>
          {/* Variant Types*/}
          <div className="card-custom-tw mb-4">
            <div className="font-semibold border-b border-light-tw text-xl px-3 pt-2  pb-1 ">
              Variants
            </div>
            <div>
              {dataSource.map((aa) => {
                let data = aa.variants;
                let value = "";
                if (typeof data === "string") {
                  value = data;
                } else {
                  data.map((aa, i) => {
                    value += i !== 0 ? `/ ${aa} ` : `${aa} `;
                  });
                }
                const idx = dataSource.findIndex((bb) => bb.key === aa.key);
                return (
                  <div
                    className={`px-3 py-1  border-b border-light-tw cursor-pointer hover:bg-gray-100 ${
                      idx === formData.currentVariant
                        ? "text-primary-color font-semibold"
                        : ""
                    }`}
                    key={value}
                    onClick={async () => {
                      const { data } = await onTempSaveClick();

                      if (data) {
                        if (idx !== formData.currentVariant) {
                          onLoadVariant(aa);
                        }
                      }
                    }}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-2/3 lg:w-3/4">
          {/* upload Images */}
          <div className="card-custom-tw mb-4 p-4">
            <div className="font-semibold pb-1 border-b border-light-tw text-xl">
              Image Upload
            </div>
            <div className="p-2">
              <Upload
                // action="http://localhost:3010/"
                listType="picture-card"
                fileList={imageUpload.fileList.filter((aa) =>
                  record ? aa.ItemCode === record.sku : true
                )}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple={true}
                action={onFileUpload}
                onRemove={onFileRemove}
              >
                {imageUpload.fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal
                visible={imageUpload.previewVisible}
                title={imageUpload.previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={imageUpload.previewImage}
                />
              </Modal>
            </div>
          </div>
          <div className="card-custom-tw mb-4 p-4">
            <div className="font-semibold pb-1 border-b border-light-tw text-xl">
              Options
            </div>
            {/* <div className="grid grid-cols-4"> */}
            <div
            //  className="col-span-3"
            >
              <div className="grid grid-cols-2 p-2 gap-4">
                {formData &&
                  formData.option.map((aa, index) => {
                    return (
                      <div key={aa.type}>
                        <div className="text-primary-color">{aa.type}</div>
                        <div>
                          <Input
                            defaultValue={aa.tag}
                            onChange={(e) => {
                              const indx = formData.option.findIndex(
                                (bb) => bb.type === aa.type
                              );
                              let tempData = formData.option;
                              tempData[indx].tag = e.target.value;
                              setFormData({ ...formData, option: tempData });
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            {/* <div className="col-span-1">Add Images</div> */}
          </div>
          {/* </div> */}
          <div className="card-custom-tw mb-4 p-4">
            <div className="font-semibold pb-1 border-b border-light-tw text-xl">
              Pricing
            </div>
            <div className="grid grid-cols-2 p-2 gap-4">
              <div>
                <div className="text-primary-color ">Cost Price</div>
                <div>
                  <InputNumber
                    className="w-full"
                    stringMode="true"
                    defaultValue={formData.pricing.costPrice}
                    placeholder="Cost Price"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        pricing: {
                          ...formData.pricing,
                          costPrice: e,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="text-primary-color ">Sale Price</div>
                <div>
                  <InputNumber
                    className="w-full"
                    stringMode="true"
                    placeholder="Sale Price"
                    defaultValue={formData.pricing.salePrice}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        pricing: {
                          ...formData.pricing,
                          salePrice: e,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="text-primary-color ">MRP </div>
                <div>
                  <InputNumber
                    className="w-full"
                    stringMode="true"
                    defaultValue={formData.pricing.MRP}
                    placeholder="MRP"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        pricing: {
                          ...formData.pricing,
                          MRP: e,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Save  Button */}
          <div className="card-custom-tw flex justify-end p-2">
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={onSaveClick}
            >
              Save and CLose
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditItemVariations;
