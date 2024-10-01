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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRegisterUserMutation } from "../redux/storeApi";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useGlobalState } from "../context/GlobalStateProvider";
import useLocation from "../customHooks/useLocation";

const Register = () => {
  const {currentLocation} = useLocation()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [registerUser, { isError, isLoading, error, isSuccess }] = useRegisterUserMutation();
  const navigation = useNavigation();

  const {state,updateState} = useGlobalState()
  const handleRegister = async () => {
    if (!name || !email || !userType || !password) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    const data ={
      name,
      email,
      userType: userType.toLowerCase(),
      password,
      number,
      lat: currentLocation?.latitude,
      long: currentLocation?.longitude,
    }
    console.log(data,'data')
    try {
      registerUser({data});
    } catch (error) {
      Alert.alert("Error", "Failed to register user");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      updateState(true)
      navigation.navigate("login");

    }
    if (isError) {
      console.log(error, "error");
    }
  }, [isSuccess, isError]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="user" size={20} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#A0A0A0"
                />
              </View>

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
                <FontAwesome5 name="phone" size={20} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={number}
                  onChangeText={setNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#A0A0A0"
                />
              </View>

              <View style={styles.pickerContainer}>
                <FontAwesome5 name="users" size={20} color="#007AFF" style={styles.inputIcon} />
                <Picker
                  selectedValue={userType}
                  style={styles.picker}
                  onValueChange={(itemValue) => setUserType(itemValue)}
                >
                  <Picker.Item label="Select User Type" value="" />
                  <Picker.Item label="Rider" value="Rider" />
                  <Picker.Item label="Passenger" value="User" />
                </Picker>
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
                style={[styles.button, styles.registerButton, isLoading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <FontAwesome5
                  name="user-plus"
                  size={20}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>{isLoading ? "Registering..." : "Register"}</Text>
              </TouchableOpacity>

              {isError && (
                <Text style={styles.errorText}>
                  <FontAwesome5 name="exclamation-circle" size={16} color="#FF3B30" /> Failed to
                  register user
                </Text>
              )}

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate("login")}
              >
                <Text style={styles.loginLinkText}>Already have an account? Log in</Text>
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
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    height: 50,
    color: "#333",
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
  registerButton: {
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
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Register;
