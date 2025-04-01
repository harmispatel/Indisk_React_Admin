import React from "react";
import { Navigate } from "react-router-dom";

// import PageNotFound from "../pages/Utility/pages-404";

import Login from "../pages/Authentication/Login";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import Dashboard from "../pages/Dashboard/index";

const authProtectedRoutes = [
  { path: "/", component: <Dashboard /> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  // { path: "*", component: <PageNotFound /> },

  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
];

export { authProtectedRoutes, publicRoutes };
