import React from "react";
import withRouter from "../../components/Common/withRouter";

import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import logoLightSvg from "../../assets/images/Indisk_logo.png";

const Sidebar = (props) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-light mt-2">
            <img src={logoLightSvg} alt="" width={75} />
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Sidebar);
