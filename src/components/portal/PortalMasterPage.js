import React, { Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import PromoMasterCard from './Administration/PortalMaster/PortalMasterCard';
import CustomDataTable from "../../common/CustomDataTable";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import ColumnProperties from "../../../models/columnProperties";


const PortalMaster = () => {

    const dispatch = useDispatch();
    const currTran = useSelector(state => state.currentTran);
    const portalMaster = useSelector(state => state.portalMaster);
    const [editedData, setEditedData] = useState();

    useEffect(() => {
        dispatch(fetchPortalMasters());
        dispatch(setFormCaption("Adminstrator", "Portal Master"));
      }, []);
    
      useEffect(() => {

      }, [portalMaster.portalMasters]);

    return (
        <Fragment>
            {editedData && (
          <PromoMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
        )}
        
        {!editedData && portalMaster.portalMasters && (
          <CustomDataTable
            columnProperties={columnProperties}
            myData={portalMaster.portalMasters}
            onAddClick={() => {
              setEditedData({ entryMode: "A" });
            }}
            onEditPress={values => {

              setEditedData({ entryMode: "E", formData: values });
            }}
            pageDefaultSize={15}
          />
        )}
        </Fragment>
    );
};
 
export const columnProperties = [
    new ColumnProperties("Id", false, "Id", true, 350),
    new ColumnProperties("PromoTitle", true, "PromoTitle", true, 250),
    new ColumnProperties("PromoImageUri", true, "PromoImageUri", true, 80),
    new ColumnProperties("SysOption1", false, "SysOption1", true, 350),
    new ColumnProperties("SysOption2", true, "SysOption2", true, 150),
    new ColumnProperties("SysOption3", true, "SysOption3", true, 80),
    new ColumnProperties("SysOption4", true, "SysOption4", true, 250),
    new ColumnProperties("SysOption5", true, "SysOption5", true, 100),
    new ColumnProperties("IsActive", false, "IsActive", true, 350),
  ];
export default PortalMaster;