import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "@/context/AdminContext";

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;

  return adminInfo?.email ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
