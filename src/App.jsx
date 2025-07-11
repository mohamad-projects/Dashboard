import React, { useState } from 'react';
import { RouterProvider } from "react-router-dom";
import { createRoutes } from "./router";
import useAuth from './hooks/useAuth';
import './index.css'
const App = () => {
  
  const AuthData = useAuth();
  const router = createRoutes(AuthData.user);
  const [darkMode, setDarkMode] = useState(0)

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;