import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthToken } from "../axios-client";

export const PusherContext = createContext(null);

export const PusherProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state?.authReducer?.authData || {});
    const token = data?.token;

    useEffect(() => {
        if (token) {
            setAuthToken(token);
        }
    }, [token]);

    return (
        <PusherContext.Provider value={{}}>
            {children}
        </PusherContext.Provider>
    );
};
