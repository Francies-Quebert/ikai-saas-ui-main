import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
// import CityMasterCard from "./CityMaster/CityMasterCard";
// import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
// import ReactPDF from "@react-pdf/renderer";
import CityMasterCard from "./CityMaster/CityMasterCardNew";
import { fetchCityMasters } from "../../../store/actions/CityMaster";
import { fetchCountryMasters } from "../../../store/actions/CountryMaster";
import { fetchStateMasters } from "../../../store/actions/StateMaster";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";

const CityMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const cityMaster = useSelector((state) => state.cityMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchCityMasters());
    dispatch(fetchCountryMasters());
    dispatch(fetchStateMasters());
    dispatch(setFormCaption(24));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [cityMaster.cityMasters]);

  // const Mypdf = () => (
  //   <PDFViewer>
  //     <Document>
  //       <Page size="A4">
  //         <View>
  //           <Text>Section #1</Text>
  //         </View>
  //         <View>
  //           <Text>Section #2</Text>
  //         </View>
  //       </Page>
  //     </Document>
  //     ;
  //   </ PDFViewer>
  // );

  // const renderpdf = () => {
  //   console.log(__dirname)
  //   ReactPDF.render(mypdf, `d:/example.pdf`);
  // };

  let renderItem = null;
  if (cityMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (cityMaster.error) {
    renderItem = <div>Error : cityMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <CityMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            OnPrint={() => {
              // renderpdf();
            }}
          />
        )}

        {!editedData && cityMaster.cityMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={cityMaster.cityMasters}
            onAddClick={() => {
              setEditedData({ entryMode: "A" });
            }}
            onEditPress={(values) => {
              setEditedData({ entryMode: "E", formData: values });
            }}
            pageDefaultSize={15}
          />
        )}
        {/* <Mypdf /> */}
      </Fragment>
    );
  }

  return renderItem;
};

export const columnProperties = [
  new ColumnProperties("CityCode", true, "CityCode", true, 100),
  new ColumnProperties("CityName", true, "City Name", true),
  new ColumnProperties("CountryCode", true, "Country Code", false, 150),
  new ColumnProperties("StateCode", true, "State Code", false, 150),
  new ColumnProperties("lat", true, "lat", true, 100),
  new ColumnProperties("lng", true, "lng", false, 100),
  new ColumnProperties("IsDefault", false, "Default", false, 100),
  new ColumnProperties("IsActive", false, "Active Status", false, 100),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 120),
  new ColumnProperties("IsDefaultComponent", true, "Default", false, 100),
];
export default CityMasterPage;
