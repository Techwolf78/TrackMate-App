import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, allowedEmails = [], userEmail, children }) => {
  if (!isAuthenticated || (allowedEmails.length && !allowedEmails.includes(userEmail))) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
