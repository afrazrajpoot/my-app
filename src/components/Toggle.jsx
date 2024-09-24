import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import useGetUserData from "../customHooks/useGetUserData";
import { useGlobalState } from "../context/GlobalStateProvider";

const Toggle = () => {
  const [isUser, setIsUser] = useState(true);
  const toggleValue = useSharedValue(0);
  const { userInfo, setUserInfo } = useGlobalState();
  const [id, setId] = useState(null);
  const toggleWidth = 60;
  const thumbWidth = 28;

  const toggleButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleValue.value * (toggleWidth - thumbWidth - 6) }],
  }));

  const data = useGetUserData();

  const fetchUserDataFromStorage = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        const userType = parsedData.data?.data?.userType;
        setIsUser(userType === "user");
        toggleValue.value = withSpring(userType === "user" ? 0 : 1);
      }
    } catch (err) {
      console.log("Error fetching user data from storage:", err);
    }
  };

  useEffect(() => {
    setId(data?.data?.data?._id);
    if (data) {
      fetchUserDataFromStorage();
    }
  }, [data]);

  const toggleType = async () => {
    try {
      const newUserType = isUser ? "rider" : "user";
    
      setIsUser(!isUser);
      toggleValue.value = withSpring(isUser ? 1 : 0);
      const data = {
        userType: newUserType,
          id:id
      }
      const res = await fetch(`http://192.168.1.106:9000/api/v1/toggleType/${id}`, {
        method: "PUT",
        // headers: { "Content-Type": "application/json" ,'user-id':id},
        body: JSON.stringify({data}),
      });

      if (!res.ok) {
        // If the API call fails, revert the toggle
        console.log("Error response from toggle");
        setIsUser(!isUser);  // Revert to the previous state
        toggleValue.value = withSpring(isUser ? 0 : 1);
        return;
      }

      // Update AsyncStorage
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        parsedData.data.data.userType = newUserType;
        await AsyncStorage.setItem("userData", JSON.stringify(parsedData));
      }

      // Update global state
      setUserInfo({ ...userInfo, userType: newUserType });

   
    } catch (err) {
      console.log("Error in toggling user/rider:", err);
      // Revert the toggle if there's an error
      setIsUser(!isUser);
      toggleValue.value = withSpring(isUser ? 0 : 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleType}>
        <Animated.View style={[styles.toggleThumb, toggleButtonStyle]}>
          <Text style={styles.toggleText}>{isUser ? "user" : "rider"}</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleButton: {
    width: 60,
    height: 34,
    backgroundColor: "#ccc",
    borderRadius: 17,
    padding: 3,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 28,
    height: 28,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 12,
    color: "#333",
  },
});

export default Toggle;
