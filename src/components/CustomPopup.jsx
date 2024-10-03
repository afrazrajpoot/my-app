import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Callout } from 'react-native-maps';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
// import Svg, { Path } from 'react-native-svg';

// const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const CustomPopup = ({ name, phoneNumber, avatarSource }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Callout tooltip>
      <Animated.View style={[styles.calloutContainer, animatedStyle]}>
        <View style={styles.calloutContent}>
          <Image source={avatarSource} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </View>
        </View>
        {/* <AnimatedSvg height={20} width={20} viewBox="0 0 20 20" style={styles.triangle}>
          <Path d="M0 0 L10 20 L20 0 Z" fill="#FFFFFF" />
        </AnimatedSvg> */}
      </Animated.View>
    </Callout>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    maxWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  triangle: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
  },
});

export default CustomPopup;