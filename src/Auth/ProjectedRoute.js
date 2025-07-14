// src/Auth/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
    
const ProjectedRoute = ({ children }) => {
  const userData = localStorage.getItem('userData');

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProjectedRoute;
