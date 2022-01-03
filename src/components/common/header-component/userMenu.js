import React, { Fragment, useState } from "react";
import man from "../../../assets/images/dashboard/user.png";
import { User, Mail, Lock, Settings, LogOut, Key } from "react-feather";
import { Link } from "react-router-dom";
// import ChangePassword  from "../../../../src/components/changepassword";
import { logout } from "../../../store/actions/login";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import ChangesPassword from "./ChangesPassword";
const UserMenu = (props) => {
  const loginInfo = useSelector((state) => state.LoginReducer);
  const employee = useSelector((state) =>
    state.employeeMaster.employeeMasters.filter(
      (ee) => "" + ee.Id === loginInfo.userData.empId
    )
  );
  const [passwordModal, setPasswordModal] = useState(false);
  const ShowPasswordModal = () => {
    setPasswordModal(!passwordModal);
  };
  const dispatch = useDispatch();
  return (
    <Fragment>
      <li className="onhover-dropdown">
        <div className="media align-items-center">
          <img
            className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded"
            src={employee.length > 0 ? employee[0].ProfilePicture : man}
            alt="header-user"
          />
          {/* <div className="dotted-animation">
            <span className="animate-circle"></span>
            <span className="main-circle"></span>
          </div> */}
        </div>
        <ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
          <li onClick={() => {}}>
            <a href="#EditProfile">
              <User />
              Edit Profile
            </a>
          </li>
          <li>
            <a
              href="#javascript"
              onClick={() => {
                setPasswordModal(!passwordModal);
              }}
            >
              <Lock />
              Change Password
            </a>
          </li>
          <li
            onClick={() => {
              // localStorage.removeItem("accessToken");
              dispatch(logout());
            }}
          >
            <a href="/login">
              <LogOut />
              Log out
            </a>
          </li>
        </ul>
      </li>
      <Modal
        isOpen={passwordModal}
        toggle={ShowPasswordModal}
        size="lg"
        centered={true}
      >
        <ModalHeader>Change Password</ModalHeader>
        <ChangesPassword
          onBackPress={() => {
            ShowPasswordModal();
          }}
        />
        {/* <ModalFooter></ModalFooter> */}
      </Modal>
    </Fragment>
  );
};

export default UserMenu;
