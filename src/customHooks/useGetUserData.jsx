import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

const useGetUserData = () => {
  const [data, setData] = useState(null);
  const navigation = useNavigation();

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        setData(parsedData);
      } else {
        navigation.navigate("login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  let phone = data?.data?.data?.phoneNumber
const checkPhone = async()=>{
 
  await  getUserData();
  // if(!phone) {
  //   navigation.navigate('phone')
  // }
  return phone;
}

  useEffect(() => {
  
    checkPhone();
  }, []); // Runs once on mount to fetch user data
  
// if()
// useEffect(()=>{
//   let phone = data?.data?.data?.phoneNumber
//   if(!phone) {
//     navigation.navigate('phone')
//   }
// },[])
  return data;
};

export default useGetUserData;
