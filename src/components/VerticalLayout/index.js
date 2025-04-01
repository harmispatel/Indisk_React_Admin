import React, { useEffect } from "react";
import withRouter from "../../components/Common/withRouter";
import {
  changeLayout,
  changeSidebarTheme,
  changeTopbarTheme,
} from "../../store/actions";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import { useSelector, useDispatch } from "react-redux";

const Layout = (props) => {
  const dispatch = useDispatch();

  const { topbarTheme, leftSideBarTheme } = useSelector((state) => ({
    topbarTheme: state.Layout.topbarTheme,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
  }));

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(changeLayout("vertical"));
  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  return (
    <>
      <div id="layout-wrapper">
        <Header />
        <Sidebar theme={leftSideBarTheme} isMobile={isMobile} />
        <div className="main-content">{props.children}</div>
        <Footer />
      </div>
    </>
  );
};

Layout.propTypes = {};

export default withRouter(Layout);
