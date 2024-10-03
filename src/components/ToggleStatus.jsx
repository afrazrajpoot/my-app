import React, { useEffect, useState, useCallback } from "react";
import { Text, StyleSheet, View, TouchableOpacity, AppState } from "react-native";
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
  const [isUser, setIsUser] = useState(false); // Default to offline (false)
  const [id, setId] = useState(null);
  const toggleValue = useSharedValue(1); // Default to 1 (offline position)
  const { updateState } = useGlobalState();
  const [toggleStatus, { isLoading }] = useToggleStatusMutation();
  const toggleWidth = 80;
  const thumbWidth = 36;

  // Fetch user data from AsyncStorage and set to offline by default
  const fetchUserDataFromStorage = useCallback(async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        const userId = parsedData.data?.data?._id;
        setId(userId);

        // Set user to offline by default
        await callToggleStatusAPI("offline", userId);
        
        // Update local state and animation
        setIsUser(false);
        toggleValue.value = withSpring(1);
        
        // Update AsyncStorage
        parsedData.data.data.status = "offline";
        await AsyncStorage.setItem("userData", JSON.stringify(parsedData));
      }
    } catch (err) {
      console.error("Error fetching user data from storage:", err);
    }
  }, [callToggleStatusAPI]);

  useEffect(() => {
    fetchUserDataFromStorage();
  }, [fetchUserDataFromStorage]);

  const callToggleStatusAPI = useCallback(async (status, userId) => {
    updateState(true);
    if (isLoading || !userId) return;

    try {
      const data = { status, id: userId };
      await toggleStatus({ data }).unwrap();

      // Update AsyncStorage
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        parsedData.data.data.status = status;
        await AsyncStorage.setItem("userData", JSON.stringify(parsedData));
      }
    } catch (err) {
      console.error("Error in toggling user/rider:", err);
    } finally {
      updateState(false);
    }
  }, [isLoading, toggleStatus, updateState]);

  // Monitor AppState to detect when the app goes into the background or is closed
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        console.log('app is off');
        if (id && isUser) {
          await callToggleStatusAPI("offline", id);
          setIsUser(false);
          toggleValue.value = withSpring(1);
        }
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [id, isUser, callToggleStatusAPI]);

  const toggleType = async () => {
    if (isLoading || !id) return;

    const newUserType = isUser ? "offline" : "online";
    setIsUser(!isUser);
    toggleValue.value = withSpring(isUser ? 1 : 0);

    await callToggleStatusAPI(newUserType, id);
  };

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
    marginLeft: -150,
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
