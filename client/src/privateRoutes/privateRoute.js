import { useEffect, useRef, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Axios from 'axios';

 Axios.defaults.withCredentials = true

const PrivateRoutes = () => {

 

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const data = useRef()
  

  useEffect(() => {

    Axios.get("https://test-wine-five-20.vercel.app/LoggedIn").then((response) => {

    console.log(response)
      
    data.current = response.data.Message

    if(data.current === "Authorized") {

      setIsAuthenticated(true)

    } else {

      setIsAuthenticated(false)

    }
   
    })

  
  })

  


  
  return isAuthenticated ? <Outlet /> : <Navigate to='/' />;

};

export default PrivateRoutes
