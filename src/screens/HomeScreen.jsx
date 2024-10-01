import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown } from "react-native-reanimated";
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
  const { updateState } = useGlobalState();

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

  useEffect(() => {
    const phone = data?.data?.data?.phoneNumber;

    if (!phone) {
      // Redirect to phone screen after 2 seconds
      const timer = setTimeout(() => {
        navigation.navigate("phone");
      }, 2000);

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      {showNotification && <TrialNotification daysLeft={daysLeft} />}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(500)}>
          <View style={styles.profileSection}>
            <LinearGradient
              colors={["#4A90E2", "#63B3ED"]}
              style={styles.avatarPlaceholder}
            >
              <Ionicons name="person" size={30} color="#FFF" />
            </LinearGradient>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userInfo?.name || data?.data?.data?.name || "Guest"}</Text>
              <Text style={styles.userEmail}>{userInfo?.email || data?.data?.data?.email || "No Email"}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.toggleContainer}>
          <View style={styles.toggleWrapper}>
            <Toggle />
            <ToggleStatus />
          </View>
          <TouchableOpacity
            style={styles.jazzCashButton}
            onPress={() => {
              navigation.navigate("jazzCash");
              updateState(true);
            }}
          >
            <LinearGradient
              colors={["#ED1C24", "#B90000"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.jazzCashButtonGradient}
            >
              <Ionicons name="cash-outline" size={20} color="#FFF" />
              <Text style={styles.jazzCashButtonText}>JazzCash</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    padding: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleWrapper: {
    flex: 1,
  },
  jazzCashButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginLeft: 12,
    marginTop: -65,
  },
  jazzCashButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  jazzCashButtonText: {
    color: "#FFF",
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 12,
  },
  quickActions: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
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
    padding: 16,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFF",
    marginTop: 8,
    fontWeight: "bold",
  },
});

export default HomeScreen;
