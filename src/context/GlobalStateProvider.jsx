import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetUserLocationMutation } from "../redux/storeApi";

// Create the context
const GlobalContext = createContext(null);

// Define props type for GlobalContextProvider
const GlobalContextProvider = ({ children }) => {
  const [data, setData] = useState(false);
  const [login, setLogin] = useState(false);
  const [location, setLocation] = useState({});
  const [state, updateState] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [updateLocation,{isLoading,isError}] = useGetUserLocationMutation()
  // Function to save token in local storage
  const tokenInlocal = async (data) => {
    try {
      if (data) {
    
        await AsyncStorage.setItem("userData", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error setting user data in AsyncStorage", error);
    }
  };

  // Function to log in the user
  const loginUser = async (data) => {
    try {
      await tokenInlocal(data);
      setLogin(true);
      setData(data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Function to log out the user
  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem('phone')
      setLogin(false);
      setData(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          // console.log(JSON.parse(userData).data.data._id,'user data')
          const data ={id:JSON.parse(userData)?.data?.data?._id,long:JSON.parse(userData)?.data?.data?.long,lat:JSON.parse(userData)?.data?.data?.lat}
          updateLocation({data}).unwrap()
          setLogin(true);
          // setData(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking login status", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        data,
        setData,
        login,
        setLogin,
        loginUser,
        logoutUser,
        tokenInlocal,
        location,
        setLocation,
        state,
        updateState,
        setLocation,
        userInfo,
        setUserInfo,
        selectedPlan, setSelectedPlan
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to consume the context
const useGlobalState = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalContextProvider");
  }

  return context;
};

export { GlobalContextProvider, useGlobalState };
