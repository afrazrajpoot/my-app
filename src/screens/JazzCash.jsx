import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { navigate } = useNavigation();

  const handlePayment = async () => {
    if (!amount || !phoneNumber) {
      // Use a more visual alert or custom modal here
      return;
    }

    setIsLoading(true);
    try {
      const txnRefNo = `T${Date.now()}`;
      const response = await axios.post('https://api.ridebookingapp.aamirsaeed.com/jazzcash', {
        amount: parseFloat(amount),
        phoneNumber,
        txnRefNo,
      });

      console.log('Payment Response:', response.data);
      alert("Successful payment");
      navigate('home');
      // Handle success based on response
    } catch (error) {
      console.error('Payment Error:', error);
      // Handle error more gracefully
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Icon name="cash-multiple" size={40} color="#ED1C24" style={styles.icon} />
        <Text style={styles.title}>JazzCash Payment</Text>
        <View style={styles.inputContainer}>
          <Icon name="cash" size={20} color="#ED1C24" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter amount (PKR)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#ED1C24" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, (!amount || !phoneNumber) && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={isLoading || !amount || !phoneNumber}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon name="credit-card-check" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Pay with JazzCash</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    alignSelf: 'center',
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: '#f8a3a8',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;