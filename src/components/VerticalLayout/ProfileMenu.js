import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

import { Link, useNavigate } from "react-router-dom";
import withRouter from "../Common/withRouter";

import user1 from "../../assets/images/users/avatar-2.jpg";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const authUserString = localStorage.getItem("authUser");
  const authUserObject = JSON.parse(authUserString);

  const [username, setUserName] = useState(authUserObject?.email);

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      setUserName(authUserObject?.email);
    }
  }, [authUserObject]);

  const logOut = useCallback(() => {
    localStorage.removeItem("authUser");
    navigate("/login");
  }, [navigate]);

  return (
    <>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to="/profile" className="dropdown-item">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            <span>Profile</span>
          </Link>

          <div className="dropdown-divider" />
          <button className="dropdown-item" onClick={logOut}>
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>Logout</span>
          </button>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default withRouter(ProfileMenu);
