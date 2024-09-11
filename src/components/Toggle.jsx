import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import useGetUserData from "../customHooks/useGetUserData";
import { useGlobalState } from "../context/GlobalStateProvider";

const Toggle = () => {
  const [isOn, setIsOn] = useState(false);
  const toggleValue = useSharedValue(isOn ? 1 : 0);
  const {userInfo, setUserInfo} = useGlobalState();
  const [id, setId] = useState(null);
  const toggleWidth = 60; // Width of the toggle button
  const thumbWidth = 28; // Width of the toggle thumb

  const toggleButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: toggleValue.value * (toggleWidth - thumbWidth - 6), // Adjust for padding
        },
      ],
    };
  });

  const data = useGetUserData();

  // Fetch user type from AsyncStorage on component mount
  const fetchUserTypeFromStorage = async () => {
    try {
      const storedUserType = await AsyncStorage.getItem("userType");
      if (storedUserType) {
        setIsOn(storedUserType === "user");
        toggleValue.value = withSpring(storedUserType === "user" ? 0 : 1); // Set the initial toggle state
      }
    } catch (err) {
      console.log("Error fetching user type from storage:", err);
    }
  };
console.log('====================================');
console.log(userInfo?._id || data?.data?.data?._id);
console.log('====================================');
  useEffect(() => {
    setId( userInfo?._id || data?.data?.data?._id);
    fetchUserTypeFromStorage(); // Fetch the user type on mount
  }, [userInfo?.userType]);

  const togglType = async (id) => {
    try {
      const type = isOn ? "user" : "rider";
      const res = await fetch(`https://api.funrides.co.uk/api/v1/userType/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType: type, // Send the userType in the request body
        }),
      });
      setUserInfo({...userInfo, userType: type});

      const response = await res.json();
      console.log("Response from toggle:", response);

      // Store the updated user type in AsyncStorage
      await AsyncStorage.setItem("userType", type)
    } catch (err) {
      console.log("Error in toggling user/rider:", err);
    }
  };

  const handleToggle = async () => {
    setIsOn((prev) => !prev);
    toggleValue.value = withSpring(isOn ? 0 : 1);

    // Call the API when toggling
    if (id) {
      await togglType(id);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={handleToggle}>
        <Animated.View style={[styles.toggleThumb, toggleButtonStyle]}>
          <Text style={styles.toggleText}>{isOn ? "rider" : "user"}</Text>
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
