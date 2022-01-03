import React, { Fragment, useEffect, useState } from "react";
import ColumnProperties from "../../../models/columnProperties";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompMain } from "../../../store/actions/compmain";
import CustomDataTable from "../../common/CustomDataTable";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";
// import CompMainCard from "./CompMain/CompMainCard";
import CompMainCard from "./CompMain/CompMainCardNew";

const CompMainPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const compmain = useSelector((state) => state.compmain);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchCompMain());
    dispatch(setFormCaption(49));
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  useEffect(() => {}, [compmain.compMain]);

  let renderItem = null;
  if (compmain.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (compmain.error) {
    renderItem = <div>Error : compmain.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <CompMainCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            // showUserCredentials={true}
            onSavePress={(values) => {
              if (values) {
                dispatch(fetchCompMain());
              }
            }}
          />
        )}
        {!editedData && compmain.compMain && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={compmain.compMain}
            isInvisibleAdd={true}
            onEditPress={(values) => {
              setEditedData({ entryMode: "E", formData: values });
            }}
            pageDefaultSize={15}
          />
        )}
      </Fragment>
    );
  }
  return renderItem;
};
export const columnProperties = [
  new ColumnProperties("compCode", true, "Code", true, 140),
  new ColumnProperties("compShortName", true, "Short Name", true, 150),
  new ColumnProperties("compName", true, "Company Name", false, 200),
  new ColumnProperties("validity", false, "validity", true),
  new ColumnProperties("address1", false, "address1", true),
  new ColumnProperties("address2", false, "address2", true, 150),
  new ColumnProperties("address3", false, "address3", true, 150),
  new ColumnProperties("City", false, "City", true, 250),
  new ColumnProperties("Pin", false, "Pin", true),
  new ColumnProperties("Country", false, "Country", true),
  new ColumnProperties("GST", false, "GST", true),
  new ColumnProperties("PAN", false, "PAN", true),
  new ColumnProperties("ContantPerson", false, "ContantPerson", true, 150),
  new ColumnProperties("Directors", false, "Directors", true, 150),
  new ColumnProperties("tel", false, "Telephone ", true, 250),
  new ColumnProperties("tel2", false, "Alternate Number", true, 250),
  new ColumnProperties("mobile", true, "mobile", true, 180),
  new ColumnProperties("email", true, "email", true, 200),
  new ColumnProperties("website", true, "website", true, 250),
];

export default CompMainPage;
