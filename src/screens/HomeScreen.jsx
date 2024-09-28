import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import useGetUserData from "../customHooks/useGetUserData";
import Toggle from "../components/Toggle";
import ToggleStatus from "../components/ToggleStatus";
import { useGlobalState } from "../context/GlobalStateProvider";
import TrialNotification from "../components/TrialNotification";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const [showNotification, setShowNotification] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const { userInfo } = useGlobalState();
  const data = useGetUserData();
  const { state, updateState } = useGlobalState();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.navigate("login");
  };

  useEffect(() => {
    updateState(true);
    if (data?.data?.data?.endTrial) {
      const endTrialDate = new Date(data.data.data.endTrial);
      const currentDate = new Date();
      
      if (endTrialDate > currentDate) {
        const timeDiff = endTrialDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDaysLeft(daysDiff);
        setShowNotification(true);
      } else {
        setShowNotification(false);
      }
    }
  }, [data]);


  return (
    <SafeAreaView style={styles.container}>
    {
      showNotification ? <TrialNotification daysLeft={7} />:''
    }
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(500)}>
          <View style={styles.profileSection}>
            <LinearGradient
              colors={["#4A90E2", "#63B3ED"]}
              style={styles.avatarPlaceholder}
            >
              <Ionicons name="person" size={40} color="#FFF" />
            </LinearGradient>
            <View>
              <Text style={styles.userName}>{userInfo?.name || data?.data?.data?.name || "Guest"}</Text>
              <Text style={styles.userEmail}>{userInfo?.email || data?.data?.data?.email || "No Email"}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Toggle />
          <ToggleStatus />
        </Animated.View>

        <Animated.View style={styles.quickActions} entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                navigation.navigate("subscription");
                updateState(true);
              }}
            >
              <LinearGradient
                colors={["#4A90E2", "#63B3ED"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="card-outline" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>Subscription</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Map")}
            >
              <LinearGradient
                colors={["#4A90E2", "#63B3ED"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.actionButtonGradient}
              >
                <Ionicons name={userInfo?.userType === "user" ? "car-outline" : "people-outline"} size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>{userInfo?.userType === "user" ? "Search Taxi" : "Search Passenger"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View>
          <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                navigation.navigate("jazzCash");
                updateState(true);
              }}
            >
              <LinearGradient
                colors={["#4A90E2", "#63B3ED"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="card-outline" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>Jazz cash</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  quickActions: {
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 10,
    overflow: "hidden",
  },
  actionButtonGradient: {
    padding: 15,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFF",
    marginTop: 5,
    fontWeight: "bold",
  },
  menuOptions: {
    marginTop: 20,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuOptionGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default HomeScreen;