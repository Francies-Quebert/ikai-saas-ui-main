import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSectionMaster } from "../../../services/section-master";
import { setFormCaption } from "../../../store/actions/currentTran";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import { toast } from "react-toastify";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { hasRight } from "../../../shared/utility";
// import SectionMasterCard from "./SectionMaster/SectionMasterCard";
import SectionMasterCard from "./SectionMaster/SectionMasterCardNew";

const SectionMaster = () => {
  const dispatch = useDispatch();
  const [secData, setSecData] = useState([]);
  const [editedData, setEditedData] = useState();
  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  let renderItem = null;
  useEffect(() => {
    dispatch(setFormCaption(56));
    dispatch(fetchBranchMaster());
    fetchSectionMaster(CompCode).then((res) => {
      setSecData(res);
      // console.log(res, "ads");
    });
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //     setSecData([]);
  //     fetchSectionMaster().then((res) => {
  //       setSecData(res);
  //     });
  //   }
  // }, [currTran.lastSavedData]);

  // useEffect(() => {
  //     if (currTran.isLoading === false) {

  //     }
  // }, [currTran.isLoading]);

  renderItem = (
    <Fragment>
      {editedData && (
        <SectionMasterCard
          onBackPress={() => setEditedData()}
          formData={editedData.formData}
          onSavePress={(val) => {
            if (val) {
              dispatch(fetchBranchMaster());
              fetchSectionMaster(CompCode).then((res) => {
                setSecData([]);
                setSecData(res);
              });
            }
          }}
        />
      )}

      {!editedData && (
        <div>
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={secData}
            onAddClick={() => {
              setEditedData({ entryMode: "A" });
            }}
            onEditPress={(values) => {
              setEditedData({ entryMode: "E", formData: values });
            }}
            pageDefaultSize={15}
          />
        </div>
      )}
    </Fragment>
  );

  return renderItem;
};
export const columnProperties = [
  new ColumnProperties("SecCode", true, "Code", true, 200),
  new ColumnProperties("BranchCode", true, "Branch Code", true, 200),
  new ColumnProperties("SecDesc", true, "Description", true),
  new ColumnProperties("ImageURL", false, "Image", true, 150),
  new ColumnProperties("pathType", false, "pathType", false, 0),
  new ColumnProperties("ImageURLComp", true, "Image", true, 150),
  new ColumnProperties("IsActive", false, "Status", true, 150),
  new ColumnProperties("IsActiveComp", false, "Status", true, 150),
];

export default SectionMaster;
