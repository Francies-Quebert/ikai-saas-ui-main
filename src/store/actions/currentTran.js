export const TRAN_START = "TRAN_START";
export const TRAN_SUCCESS = "TRAN_SUCCESS";
export const TRAN_FAIL = "TRAN_FAIL";

export const TRAN_INITIALIZE = "TRAN_INITIALIZE";
export const SET_FORM_CAPTION = "SET_FORM_CAPTION";

export const reInitialize = () => {
  return async dispatch => {
    dispatch({ type: TRAN_INITIALIZE });
  };
};

// export const setFormCaption = (pParent, pFormName) => {
//   return async dispatch => {
//     dispatch({ type: SET_FORM_CAPTION, parent: pParent, formTitle: pFormName });
//   };
// };

export const setFormCaption = (pModuleId) => {
  return async (dispatch,getState) => {
    let modDetail;
    getState().AppMain.userMenu.map(modGroups => {
      // userRights =  modGroups.children.find((item) => item.Id === pModuleId)
      let rIndex = modGroups.children.findIndex((item) => item.Id === pModuleId)
      if (rIndex >= 0){
        modDetail = {...modGroups.children[rIndex], ModGroupName:modGroups.title}
        // console.log('module rights',modDetail)
        dispatch({ type: SET_FORM_CAPTION, modDetail });    
      }
    });  
    
  };
};
