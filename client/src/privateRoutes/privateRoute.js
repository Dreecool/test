import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Axios from "axios";

Axios.defaults.withCredentials = true;

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    Axios.get("https://test-wine-five-20.vercel.app/LoggedIn")
      .then((response) => {
        console.log(response);

        if (response.data.Message === "Authorized") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
