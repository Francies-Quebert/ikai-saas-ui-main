import React, { Fragment, useEffect, useState } from "react";
// import ServiceTypeMasterCard from "./ServiceTypeMaster/ServiceTypeMasterCard";
import ServiceTypeMasterCard from "./ServiceTypeMaster/ServiceTypeMasterCardNew";
import CustomDataTable from "../../common/CustomDataTable";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { hasRight } from "../../../shared/utility";
import { fetchServiceTypesMater } from "../../../store/actions/servicetype";
const ServiceTypeMaster = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.AppMain.serviceTypes);
  const currTran = useSelector((state) => state.currentTran);
  const [myData, setMyData] = useState([]);

  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(setFormCaption(9));
    dispatch(fetchServiceTypesMater());
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      dispatch(fetchServiceTypesMater());
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {
    if (data && data.length > 0) {
      let tmp = [];
      data.map((ii) =>
        tmp.push({
          ServiceType: ii.serviceTypeCode,
          ServiceTypeTitle: ii.serviceTypeTitle,
          Image: (
            <img height="30px" width="30px" src={ii.serviceTypeImageURI} />
          ),
        })
      );
      setMyData(tmp);
    }
  }, [data]);

  useEffect(() => {}, [myData]);

  return (
    <Fragment>
      {/* <Breadcrumb parent="Dashboard" title="Service Type Master" /> */}
      {editedData && (
        <ServiceTypeMasterCard
          onBackPress={() => setEditedData()}
          // onResetPress={() => setEditedData({ entryMode: "A" })}
          formData={editedData.formData}
        />
      )}
      {!editedData && data && (
        <CustomDataTable
          addDisabled={hasRight(currTran.moduleRights, "ADD")}
          disableEdit={hasRight(currTran.moduleRights, "EDIT")}
          columnProperties={columnProperties}
          myData={data}
          onAddClick={() => {
            setEditedData({ entryMode: "A" });
          }}
          onEditPress={(values) => {
            // seteditedKeyPair({ ServiceTypeCode: "TO" });
            setEditedData({ entryMode: "E", formData: values });

          }}
          pageDefaultSize={15}
        />
      )}
    </Fragment>
  );
};

export const columnProperties = [
  {
    name: "serviceTypeCode",
    visible: true,
    title: "Service Type",
    filterable: true,
    //   minWidth:2,
    width: 200,
  },
  {
    name: "serviceTypeTitle",
    visible: true,
    title: "Service Type Title",
    filterable: true,
    // width:300
  },
  {
    name: "serviceTypeDesc",
    visible: false,
    title: "",
    filterable: true,
    //   width:500
  },
  {
    name: "serviceTypeDescDetail",
    visible: false,
    title: "",
    filterable: true,
  },
  {
    name: "serviceTypeImageURI",
    visible: false,
    title: "Image Url",
    filterable: false,
    isImageUrl: true,
  },
  {
    name: "serviceTypeImage",
    visible: true,
    title: "Image",
    filterable: false,
    isImageUrl: true,
    //   width:500
    width: 100,
  },
  {
    name: "IsActive",
    visible: false,
    title: "",
    filterable: false,
    isImageUrl: true,
  },
  {
    name: "IsActiveComponent",
    visible: true,
    title: "Status",
    filterable: false,
    isImageUrl: true,
  },
  {
    name: "orderby",
    visible: true,
    title: "Order By",
    filterable: false,
    isImageUrl: true,
  },
  {
    name: "pathType",
    visible: false,
    title: "Order By",
    filterable: false,
    isImageUrl: false,
  },
];
export default ServiceTypeMaster;
