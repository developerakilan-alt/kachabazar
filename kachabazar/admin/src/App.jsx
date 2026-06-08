import React, { lazy } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "@/components/AccessibleNavigationAnnouncer";
import PrivateRoute from "@/components/login/PrivateRoute";
import DynamicTheme from "@/components/theme/DynamicTheme";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import UpdateNotification from "@/components/common/UpdateNotification";
const Layout = lazy(() => import("@/layout/Layout"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ForgetPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const App = () => {
  return (
    <>
      <ToastContainer style={{ zIndex: 99999 }} />
      <DynamicTheme />
      <UpdateNotification />
      <ErrorBoundary>
        <Router>
          <AccessibleNavigationAnnouncer />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ErrorBoundary>
    </>
  );
};

export default App;
