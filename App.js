import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Alert } from "react-native";
import PaymentScreen from "./src/screens/Payment";
import Map from "./src/screens/Map"; // Make sure the path is correct
import Register from "./src/screens/Register";

import { Provider } from "react-redux";
import { store } from "./src/redux/store";

import { GlobalContextProvider } from "./src/context/GlobalStateProvider";

import Login from "./src/screens/Login";
import HomeScreen from "./src/screens/HomeScreen";
import Subscription from "./src/screens/Subscription";
import JazzCash from "./src/screens/JazzCash";
import Phone from "./src/screens/Phone";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <GlobalContextProvider>
        <StripeProvider publishableKey="pk_test_51OvmpoEWhpY7ASOw4YwOtVI4czVFxUxKVmrbuJkkTY7xrgHWzwFzlYaG92GHB4uQsPBPlSA1oUkMvgunyVe8ZRio00fevIPiwK">
          <NavigationContainer options={{ headerShown: false }}>
            <Stack.Navigator initialRouteName="home">
              <Stack.Screen
                name="payment"
                component={PaymentScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
              <Stack.Screen name="register" component={Register} options={{ headerShown: false }} />
              <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="subscription" component={Subscription} options={{ headerShown: false }} />
              <Stack.Screen name="jazzCash" component={JazzCash} options={{ headerShown: false }} />
              <Stack.Screen name="phone" component={Phone} options={{ headerShown: false }} />

            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </StripeProvider>
      </GlobalContextProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
