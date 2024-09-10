import React, { useState } from "react";
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
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { fetchPaymentSheetParams } from "../api/createPayment";
import { FontAwesome5 } from "@expo/vector-icons";

export default function PaymentScreen({ navigation }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [currency, setCurrency] = useState("RS");
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const initializePaymentSheet = async () => {
    const params = await fetchPaymentSheetParams(currency, amount);
    if (!params) {
      setProcessing(false);
      return;
    }
    const { paymentIntent, ephemeralKey, customer } = params;
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,
      merchantDisplayName: "Merchant Name",
    });
    if (error) {
      Alert.alert("Payment initialization failed", error.message);
      setProcessing(false);
    } else {
      setProcessing(false);
      handlePresentPaymentSheet();
    }
  };

  const handlePresentPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert("Payment failed", error.message);
    } else {
      Alert.alert("Success", "Your payment was successful!");
    }
    setProcessing(false);
  };

  const handlePayPress = async () => {
    if (!amount || !currency) {
      Alert.alert("Missing amount or currency");
      return;
    }
    const minAmount = 50;
    if (parseFloat(amount) * 100 < minAmount) {
      Alert.alert("Amount too small", "The minimum amount is €0.50.");
      return;
    }
    setProcessing(true);
    await initializePaymentSheet();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Payment</Text>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="rupee-sign" size={20} color="#007AFF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Currency (e.g., rupees)"
                value={currency}
                onChangeText={setCurrency}
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5
                name="money-bill-wave"
                size={20}
                color="#007AFF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.payButton]}
              onPress={handlePayPress}
              disabled={processing}
            >
              <FontAwesome5
                name="credit-card"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>{processing ? "Processing..." : "Pay Now"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => {}}>
          <FontAwesome5 name="credit-card" size={24} color="#007AFF" />
          <Text style={styles.tabButtonText}>Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("Map")}>
          <FontAwesome5 name="map-marked-alt" size={24} color="#34C759" />
          <Text style={styles.tabButtonText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("register")}>
          <FontAwesome5 name="user-plus" size={24} color="#FF9500" />
          <Text style={styles.tabButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 60,
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
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  payButton: {
    backgroundColor: "#007AFF",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 10,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  tabButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: "#333",
  },
});
