import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Toggle from "./Toggle";
import ToggleStatus from "./ToggleStatus";

const { width } = Dimensions.get('window');

const Sidebar = ({ isOpen, onClose, animation, navigation, handleLogout, userType }) => {
  const sidebarStyle = {
    transform: [
      {
        translateX: animation,
      },
    ],
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
    onClose();
  };

  return (
    <Animated.View style={[styles.sidebar, sidebarStyle]}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.toggleContainer}>
        <Toggle />
        <ToggleStatus />
      </View>
      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
          <Ionicons name="home-outline" size={24} color="#FFF" />
          <Text style={styles.menuItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('subscription')}>
          <Ionicons name="card-outline" size={24} color="#FFF" />
          <Text style={styles.menuItemText}>Subscription</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('jazzCash')}>
          <Ionicons name="cash-outline" size={24} color="#FFF" />
          <Text style={styles.menuItemText}>JazzCash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Map')}>
          <Ionicons name={userType === "user" ? "car-outline" : "people-outline"} size={24} color="#FFF" />
          <Text style={styles.menuItemText}>{userType === "user" ? "Search Taxi" : "Search Passenger"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('phone')}>
          <Ionicons name="call-outline" size={24} color="#FFF" />
          <Text style={styles.menuItemText}>Update Phone</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FFF" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: '#1E3A8A', // Changed to a deep blue color
    padding: 20,
    paddingTop: 40,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  toggleContainer: {
    marginBottom: 20,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItemText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 15,
  },
});

export default Sidebar;