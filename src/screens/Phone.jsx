import { View, TextInput, StyleSheet, Button, Text, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useGetUserData from '../customHooks/useGetUserData';
import axios from 'axios';
import { addPhone } from '../api/createPayment';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Phone = () => {
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const data = useGetUserData();

const {navigate} = useNavigation()
console.log(data,'my data isu')
  const submitPhone = async () => {
    // Check for the user ID before proceeding
    const userId = data?.data?.data?._id;
   
    // Validate phone number and user ID
    if (!number) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }
    if (!userId) {
      Alert.alert("Error", "User ID is not available");
      console.error("User ID is undefined");
      return;
    }

    try {
      setIsLoading(true); // Set loading to true before the API call
      const payload = {
        id: userId,
        phoneNumber: number
      };

      // Log the payload for debugging
      console.log("Submitting phone with payload:", payload);

     const res =  await addPhone(payload); // Call addPhone directly with the payload
     console.log(res.data,'response')
     await AsyncStorage.setItem('userData',JSON.stringify(res.data))
      Alert.alert("Success", "Phone number added successfully");
      navigate('home')
      setNumber(''); // Clear the input field after success
    } catch (error) {
      console.error("Error adding phone:", error);
      Alert.alert("Error", "Failed to add phone number. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false after the API call
    }
  };

  console.log(data?.data?.data?._id, number, 'number phone'); // Log for debugging

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Phone Number</Text>

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

      <View style={styles.buttonContainer}>
        <Button 
          title={'Add Phone'}
          onPress={submitPhone}
          disabled={isLoading} // Disable button while loading
          color="#007AFF"
        />
      </View>

      {isLoading && <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default Phone;
