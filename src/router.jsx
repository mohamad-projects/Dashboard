import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Layout } from "./components";
import {
    Home,
    Login,
    Register,
    Error,
    RealEstate,
    Contact,
    // About,
    // AddHome,
    PropertyDetails,
    OfficeList,
    Dashboard,
    Complaints,
    LocationManagement,
    OfficeManagement,
    Profile,
    ServicesManagement,
    VerificationForm,
    VerificationsList,
    AdminLogin,
    RegisterPage

} from "./pages";

export const createRoutes = (user) => createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
                errorElement: <Error />
            },
            { 
                path: "/RealEstate", 
                element: user ? <RealEstate /> : <Navigate to="/" />,
                errorElement: <Error /> 
            },
            { 
                path: "/officemanagement", 
                element: <OfficeManagement /> ,
                errorElement: <Error /> 
            },  { 
                path: "/verificationlist", 
                element: <VerificationsList /> ,
                errorElement: <Error /> 
            },
             { 
                path: "/verifications",
                element: <VerificationForm /> ,
                errorElement: <Error />
            },
            { 
                path: "/complaints", 
                element: <Complaints /> ,
                errorElement: <Error /> 
            },
             { 
                path: "/servicesmanagement", 
                element: <ServicesManagement /> ,
                errorElement: <Error /> 
            },
              { 
                path: "/profile/:id", 
                element :<Profile /> ,
                errorElement: <Error /> 
            },
          
            { 
                path: "/dashboard", 
                element: <Dashboard /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/home", 
                element: <Home /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/locationmanagement", 
                element:<LocationManagement /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/officelist", 
                element:<OfficeList /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/contact", 
                element :<Contact /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/property/:id", 
                element: <PropertyDetails /> ,
                errorElement: <Error /> 
            },
        ],
    },
    {
        path: "/login",
        element: user ? <Navigate to="/" /> : <Login />,
        errorElement: <Error />,
    }, {
        path: "/alogin",
        element: user ? <Navigate to="/" /> : <AdminLogin />,
        errorElement: <Error />,
    },
    {
        path: "/register",
        element: user ? <Navigate to="/" /> : <Register />,
        errorElement: <Error />,
    }, {
        path: "/aregister",
        element:  <RegisterPage />,
        errorElement: <Error />,
    },
    {
        path: "*",
        element: <Error />,
    }
]);