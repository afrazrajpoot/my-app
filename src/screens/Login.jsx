import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";
import { useLoginUserMutation, useGetUserLocationMutation } from "../redux/storeApi";
import { useGlobalState } from "../context/GlobalStateProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocation from "../customHooks/useLocation";
import { FontAwesome5 } from "@expo/vector-icons";
import useGetUserData from "../customHooks/useGetUserData";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { tokenInlocal, setUserInfo } = useGlobalState();
  const [loginUserApi, { isError, isLoading, isSuccess }] = useLoginUserMutation();
  const [getLocation] = useGetUserLocationMutation();
  const { currentLocation } = useLocation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      const res = await loginUserApi({ email, password });
      await tokenInlocal(res);
      setUserInfo(res.data?.data);
    } catch (error) {
      Alert.alert("Error", "Failed to login user");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          getLocation({
            id: parsedData?.data?.data._id,
            lat: currentLocation?.latitude,
            long: currentLocation?.longitude,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (isSuccess) {
      navigation.navigate("home");
      fetchUserData();
    }
  }, [isSuccess]);
  const userData = useGetUserData();
  useEffect(() => {
    const backAction = () => {
      if (!userData) {
        Alert.alert("Please login", "Please login to continue");
      }

      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>

            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="envelope" size={20} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholderTextColor="#A0A0A0"
                />
              </View>

              <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={20} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#A0A0A0"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, styles.loginButton, isLoading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <FontAwesome5
                  name="sign-in-alt"
                  size={20}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
              </TouchableOpacity>

              {isError && (
                <Text style={styles.errorText}>
                  <FontAwesome5 name="exclamation-circle" size={16} color="#FF3B30" /> Failed to
                  login
                </Text>
              )}

              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => navigation.navigate("register")}
              >
                <Text style={styles.registerLinkText}>Don't have an account? Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
    paddingBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#007AFF",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 10,
  },
  registerLink: {
    marginTop: 20,
  },
  registerLinkText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Login;
