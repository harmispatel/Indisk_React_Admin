import React from "react";
import { Navigate } from "react-router-dom";

// import PageNotFound from "../pages/Utility/pages-404";

import Login from "../pages/Authentication/Login";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import Dashboard from "../pages/Dashboard/index";

import AdminUser from "../pages/AdminUser";
import RestaurantOwner from "../pages/RestaurantOwner";
import Restaurant from "../pages/Restaurant";
import ResetPassword from "../pages/Authentication/ResetPassword";

const authProtectedRoutes = [
  { path: "/", component: <Dashboard /> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "/admin-user", component: <AdminUser /> },
  { path: "/restaurant", component: <Restaurant /> },
  { path: "/restaurant-owner", component: <RestaurantOwner /> },
];

const publicRoutes = [
  // { path: "*", component: <PageNotFound /> },

  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/reset-password/:token", component: <ResetPassword /> },
];

export { authProtectedRoutes, publicRoutes };
