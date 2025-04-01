import React from "react";
import withRouter from "../../components/Common/withRouter";

import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import logoLightPng from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";

const Sidebar = (props) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoLightSvg} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoLightPng} alt="" height="19" />
            </span>
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
