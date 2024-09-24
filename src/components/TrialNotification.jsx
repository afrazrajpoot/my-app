import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TrialNotification = ({ daysLeft }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > width * 0.4) {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(pan.x, {
              toValue: gestureState.dx > 0 ? width : -width,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { translateX: pan.x },
          ],
        }
      ]}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={['#4A90E2', '#63B3ED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="timer-outline" size={28} color="white" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.daysText}>{daysLeft}</Text>
          <Text style={styles.text}>
            {daysLeft === 1 ? 'day' : 'days'} left in your trial
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  daysText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TrialNotification;