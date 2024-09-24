import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeIn, FadeOut, interpolate, useAnimatedStyle, useSharedValue, withSpring, useAnimatedScrollHandler, useAnimatedRef } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { useGlobalState } from '../context/GlobalStateProvider';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Subscription = () => {
    const {navigate} = useNavigation()
  // const [selectedPlan, setSelectedPlan] = useState({});
  const animationProgress = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef();
const {selectedPlan, setSelectedPlan} = useGlobalState()
  const plans = [
    { id: 'basic', title: 'Basic Plan', price: '$5.99', color: ['#4facfe', '#00f2fe'], icon: 'star', features: ['10GB Storage', 'Basic Support', '1 User'] },
    { id: 'premium', title: 'Premium Plan', price: '$9.99', color: ['#6a11cb', '#2575fc'], icon: 'star-half', features: ['50GB Storage', 'Priority Support', '5 Users'] },
    { id: 'pro', title: 'Pro Plan', price: '$14.99', color: ['#ff0844', '#ffb199'], icon: 'stars', features: ['100GB Storage', '24/7 Support', 'Unlimited Users'] },
  ];

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const headerHeight = interpolate(scrollY.value, [0, 100], [200, 100], 'clamp');
    return {
      height: headerHeight,
      opacity: interpolate(scrollY.value, [0, 100], [1, 0.8], 'clamp'),
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const handlePayment = (plan)=>{
    setSelectedPlan(plan)
    navigate('payment')
  }
  useEffect(() => {
    animationProgress.value = withSpring(1, { damping: 12 });
  }, []);

  const renderPlan = (plan, index) => (
    <Animated.View
      key={plan.id}
      entering={FadeIn.delay(300 * index).duration(1000)}
      style={[styles.planCard, selectedPlan === plan.id && styles.selectedPlan]}
    >
      <LinearGradient colors={plan.color} style={styles.planGradient}>
        <Icon name={plan.icon} size={40} color="#fff" />
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={styles.planPrice}>{plan.price}/month</Text>
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, idx) => (
            <Text key={idx} style={styles.featureText}>✓ {feature}</Text>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.subscribeButton, selectedPlan === plan.id && styles.selectedButton]}
          onPress={()=>handlePayment(plan)}
        >
          <Text style={[styles.buttonText, selectedPlan === plan.id && styles.selectedButtonText]}>
            {selectedPlan === plan.id ? 'Selected' : 'Payment'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.headerGradient}>
          <Image source={{ uri: 'https://your-logo-url.com/logo.png' }} style={styles.logo} />
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>Unlock premium features and enhance your experience</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.planContainer}>
          {plans.map(renderPlan)}
        </View>
      </Animated.ScrollView>

      {/* {selectedPlan && (
        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)} style={styles.confirmationContainer}>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm Subscription</Text>
          </TouchableOpacity>
        </Animated.View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  planContainer: {
    flex: 1,
  },
  planCard: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedPlan: {
    transform: [{ scale: 1.05 }],
  },
  planGradient: {
    padding: 20,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 24,
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 10,
  },
  featuresContainer: {
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 5,
  },
  subscribeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 15,
  },
  selectedButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedButtonText: {
    color: '#333',
  },
  confirmationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Subscription;