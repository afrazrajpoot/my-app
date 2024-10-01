import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import { useGlobalState } from "../context/GlobalStateProvider";
import { useToggleStatusMutation } from "../redux/storeApi";

const ToggleStatus = () => {
  const [isUser, setIsUser] = useState(true);
  const [id, setId] = useState(null);
  const toggleValue = useSharedValue(0);
  const { userInfo, setUserInfo ,updateState} = useGlobalState();
  const [toggleStatus, { isLoading }] = useToggleStatusMutation();

  const toggleWidth = 80;
  const thumbWidth = 36;

  const fetchUserDataFromStorage = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        const userType = parsedData?.data?.data?.status;
        const userId = parsedData.data?.data?._id;
        setIsUser(userType === "online");
        setId(userId);
        toggleValue.value = withSpring(userType === "online" ? 0 : 1);
      }
    } catch (err) {
      console.error("Error fetching user data from storage:", err);
    }
  };

  useEffect(() => {
    fetchUserDataFromStorage();
  }, []);

  const toggleButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(toggleValue.value * (toggleWidth - thumbWidth - 8)) }],
    backgroundColor: interpolateColor(
      toggleValue.value,
      [0, 1],
      ['#4CAF50', '#2196F3']
    ),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      toggleValue.value,
      [0, 1],
      ['rgba(76, 175, 80, 0.2)', 'rgba(33, 150, 243, 0.2)']
    ),
  }));

  const toggleType = async () => {
    updateState(true)
    if (isLoading || !id) return;

    try {
      const newUserType = isUser ? "offline" : "online";
      setIsUser(!isUser);
      toggleValue.value = withSpring(isUser ? 1 : 0);
      const data = {
        status: newUserType, id: id 
      }
      const response = await toggleStatus({ data}).unwrap();
    

      // Update AsyncStorage
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        parsedData.data.data.status = newUserType;
        await AsyncStorage.setItem("userData", JSON.stringify(parsedData));
      }

      // Update global state
      // setUserInfo({ ...userInfo, userType: newUserType });

    } catch (err) {
      // console.error("Error in toggling user/rider:", err);
      alert("PLease get the subscription")
      // Revert the toggle if there's an error
      setIsUser(isUser);
      toggleValue.value = withSpring(isUser ? 0 : 1);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.toggleButton, containerStyle]}>
        <TouchableOpacity onPress={toggleType} disabled={isLoading || !id}>
          <Animated.View style={[styles.toggleThumb, toggleButtonStyle]}>
            <Text style={styles.toggleText}>{isUser ? "Online" : "Offline"}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  toggleButton: {
    width: 80,
    height: 40,
    borderRadius: 20,
    padding: 4,
    justifyContent: "center",
    marginLeft:-150
  },
  toggleThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ToggleStatus;