import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { fetchPaymentSheetParams } from "../api/createPayment";
import { useGlobalState } from "../context/GlobalStateProvider";
import { useSubscriptionMutation } from "../redux/storeApi";
import useGetUserData from "../customHooks/useGetUserData";
import { useNavigation } from "@react-navigation/native";

export default function PaymentScreen({ navigation }) {
  const {navigate} = useNavigation()
  const [getSubscription,{isLoading,isError}] = useSubscriptionMutation()
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [processing, setProcessing] = useState(false);
  const { selectedPlan } = useGlobalState();
  const user =useGetUserData()
  // console.log(user?.data?.data?._id,'my user ikl')
  const initializePaymentSheet = async () => {
    
    const params = await fetchPaymentSheetParams("USD", selectedPlan.price.slice(1));
    if (!params) {
      setProcessing(false);
      return;
    }
    const { paymentIntent, publishableKey } = params;
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "Your Merchant Name",
      style: 'alwaysDark',
      googlePay: true,
      applePay: true,
      merchantCountryCode: 'US',
    });
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      setProcessing(false);
    } else {
      setProcessing(false);
      handlePresentPaymentSheet();
    }
  };

  const handlePresentPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
        const data ={id:user?.data?.data?._id}
      getSubscription({data}).unwrap();

      Alert.alert('Success', 'Your payment was successful!');
      navigate('home')
    }
    setProcessing(false);
  };

  const handlePayPress = async () => {
    setProcessing(true);
    await initializePaymentSheet();
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Complete Your Purchase</Text>

            <LinearGradient
              colors={selectedPlan.color}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.planCard}
            >
              <FontAwesome5 name={selectedPlan.icon} size={40} color="#FFFFFF" style={styles.planIcon} />
              <Text style={styles.planTitle}>{selectedPlan.title}</Text>
              <Text style={styles.planPrice}>{selectedPlan.price}</Text>
              <View style={styles.featuresContainer}>
                {selectedPlan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <FontAwesome5 name="check-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

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
              <Text style={styles.buttonText}>{processing ? "Processing..." : `Pay ${selectedPlan.price}`}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tabButton} onPress={() => {}}>
            <FontAwesome5 name="credit-card" size={24} color="#FFFFFF" />
            <Text style={styles.tabButtonText}>Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("Map")}>
            <FontAwesome5 name="map-marked-alt" size={24} color="#FFFFFF" />
            <Text style={styles.tabButtonText}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("register")}>
            <FontAwesome5 name="user-plus" size={24} color="#FFFFFF" />
            <Text style={styles.tabButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#FFFFFF",
  },
  planCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  planIcon: {
    marginBottom: 10,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  featuresContainer: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF',
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
    backgroundColor: "rgba(255,255,255,0.1)",
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
    color: "#FFFFFF",
  },
});