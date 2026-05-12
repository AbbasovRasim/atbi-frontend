import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../services/api";

const PrivateRoute = () => {
  const isAuthenticated = auth.isAuthenticated();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
