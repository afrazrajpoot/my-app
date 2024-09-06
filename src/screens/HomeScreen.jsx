import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGetUserData from "../customHooks/useGetUserData";

const HomeScreen = () => {
  const navigation = useNavigation();

  const MenuOption = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#4A90E2" />
      <Text style={styles.menuOptionText}>{title}</Text>
    </TouchableOpacity>
  );

  const data = useGetUserData();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.navigate("login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#FFF" />
            </View>
            <View>
              <Text style={styles.userName}>{data?.data?.data?.name || "Guest"}</Text>
              <Text style={styles.userEmail}>{data?.data?.data?.email || "No Email"}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("payment")}
            >
              <Ionicons name="card-outline" size={24} color="#FFF" />
              <Text style={styles.actionButtonText}>Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("payment")}
            >
              <Ionicons name="car-outline" size={24} color="#FFF" />
              <Text style={styles.actionButtonText}>Book Car</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuOptions}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <MenuOption
            icon="person-outline"
            title="Profile"
            onPress={() => console.log("Profile pressed")}
          />
          <MenuOption
            icon="calendar-outline"
            title="My Bookings"
            onPress={() => console.log("My Bookings pressed")}
          />
          <MenuOption
            icon="star-outline"
            title="Favorites"
            onPress={() => console.log("Favorites pressed")}
          />
          <MenuOption
            icon="settings-outline"
            title="Settings"
            onPress={() => console.log("Settings pressed")}
          />
          <MenuOption
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => console.log("Help pressed")}
          />
        </View>
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
    backgroundColor: "#4A90E2",
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
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flex: 0.48,
  },
  actionButtonText: {
    color: "#FFF",
    marginTop: 5,
    fontWeight: "bold",
  },
  menuOptions: {},
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  menuOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
});

export default HomeScreen;
