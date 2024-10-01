import { View, TextInput, StyleSheet, Button, Text, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useGetUserData from '../customHooks/useGetUserData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAddPhoneMutation } from '../redux/storeApi';

const Phone = () => {
  const [number, setNumber] = useState('');
  const data = useGetUserData();
  const [addPhone, { isError, isLoading, data: asData }] = useAddPhoneMutation();
  const { navigate } = useNavigation();

  const submitPhone = async () => {
    const userId = data?.data?.data?._id;

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
      const payload = {
        id: userId,
        phoneNumber: number,
      };

      // Submit the phone number and unwrap the result
      const result = await addPhone(payload).unwrap();

      // Check if result is valid and store it in AsyncStorage
      console.log(result.data.phoneNumber,'result')
      if (result) {
        await AsyncStorage.setItem('phone', result?.data?.phoneNumber); // Store valid data
        Alert.alert("Success", "Phone number added successfully");
        setNumber(''); // Clear the input field after success
      } else {
        console.error("Result is undefined");
        Alert.alert("Error", "Failed to add phone number. Please try again.");
      }
    } catch (error) {
      console.error("Error adding phone:", error);
      Alert.alert("Error", "Failed to add phone number. Please try again.");
    }
  };

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
          disabled={isLoading} // Using redux loading state to disable the button
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
