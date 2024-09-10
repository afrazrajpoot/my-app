import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import useGetUserData from "../customHooks/useGetUserData";

const Toggle = () => {
  const [isOn, setIsOn] = useState(false);
  const toggleValue = useSharedValue(isOn ? 1 : 0);

  // Define the width of the toggle button
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

  const handleToggle = () => {
    setIsOn(!isOn);
    toggleValue.value = withSpring(isOn ? 0 : 1);
  };
  const data = useGetUserData();

  useEffect(() => {
    console.log(data, "user Data");
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={handleToggle}>
        <Animated.View style={[styles.toggleThumb, toggleButtonStyle]}>
          <Text style={styles.toggleText}>{isOn ? "User" : "Rider"}</Text>
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
    justifyContent: "center", // Center the thumb vertically
  },
  toggleThumb: {
    width: 28,
    height: 28,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
  },
  toggleText: {
    fontSize: 12, // Adjust font size as needed
    color: "#333", // Text color
  },
});

export default Toggle;
