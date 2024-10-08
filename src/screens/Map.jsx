import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import { useGlobalState } from "../context/GlobalStateProvider";
import MapView, { Marker, Circle, Polyline, Callout } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useGetAllUsersMutation } from "../redux/storeApi";
import polyline from "@mapbox/polyline";
import Slider from "@react-native-community/slider";
import { styles } from "../theme/mapStyling";
export default function Map() {
  const [userData, setUserData] = useState(null);
  const [radius, setRadius] = useState(10000);
  const { userInfo, setUserInfo, state } = useGlobalState();
  const [getUserByType, { isError, isLoading, data }] =
    useGetAllUsersMutation();
  const [region, setRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [distance, setDistance] = useState(null);
  const mapRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const updateRadius = (value) => {
    setRadius(value * 1000);
  };

  const fetchUserData = useCallback(async () => {
    try {
      const userData1 = await AsyncStorage.getItem("userData");
      if (userData1) {
        const parsedData = JSON.parse(userData1);
        setUserData(parsedData);
        const data = {
          userType: parsedData?.data?.data?.userType,
          id: parsedData?.data?.data?._id,
        };
        await getUserByType({ data });
      }
    } catch (error) {
      console.error("Error retrieving data: ", error.message);
    }
  }, [getUserByType]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCurrentLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error fetching location: ", error.message);
      }
    };
    fetchCurrentLocation();
  }, [state]);
  const fetchRoute = async (origin, destination) => {
    const originString = `${origin?.latitude},${origin?.longitude}`;
    const destinationString = `${destination?.latitude},${destination?.longitude}`;
    const apiKey =
      "AIzaSyA7cZCuVvMKML7cS7L-5uzyk5OrSEyqXW8" || process.env.API_KEY; // Replace with your API key

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.routes.length) {
        const points = polyline.decode(data.routes[0].overview_polyline.points);
        const routeCoords = points.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setRouteCoordinates(routeCoords);
        calculateDistance(origin, destination);
        fitMapToRoute(routeCoords);
      }
    } catch (error) {
      console.error("Error fetching route: ", error.message);
    }
  };

  const calculateDistance = (origin, destination) => {
    const distanceInKm = getDistanceFromLatLonInKm(
      origin?.latitude,
      origin?.longitude,
      destination?.latitude,
      destination?.longitude
    );
    setDistance(distanceInKm.toFixed(2)); // Round to 2 decimal places
  };
  console.log(distance)
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => deg * (Math.PI / 100);
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };


  const onMarkerPress = (marker) => {
    setSelectedMarker(marker);
    fetchRoute(currentLocation, {
      latitude: parseFloat(marker.lat),
      longitude: parseFloat(marker.long),
    });
    animateInfoCard();
  };

  const animateInfoCard = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const fitMapToRoute = (coordinates) => {
    if (mapRef.current && coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };
  const getMarkerImage = useCallback((userType) => {
    return userType === "rider"
      ? require("../../assets/car3.png")
      : require("../../assets/user2.png");
  }, []);


  
  const CustomCallout = ({ name, phoneNumber, avatarSource }) => (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
      width: 220,
      padding: 10,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
    {/* <Text>
    <Image 
        source={avatarSource} 
        style={{
          height: 80,
          width: 80,
          borderRadius: 40,
          marginBottom: 10,
          marginTop: -100
        }} 
      />
    </Text> */}
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      }}>
        {name}
      </Text>
      <Text style={{
        fontSize: 14,
        color: '#555',
      }}>
        Phone: {phoneNumber}
      </Text>
    </View>
  );
  

  
  const renderMarkers = useCallback(() => {
    const markers = [];
  
    if (currentLocation && userData?.data?.data) {
      markers.push(
        <Marker
          key="currentUser"
          coordinate={currentLocation}
          title={userData.data.data.phoneNumber || "Current User"}
        >
          <Image
            source={getMarkerImage(userData.data.data.userType, true)}
            style={styles.markerImage}
          />
          <Callout tooltip>
            <CustomCallout
              name={userData?.data?.data?.name || "User"}
              phoneNumber={userData.data.data.phoneNumber}
              avatarSource={require("../../assets/user2.png")}
            />
          </Callout>
        </Marker>
      );
    }
    // console.log(userData.data.data.name,'call')
    if (Array.isArray(data?.data)) {
      data.data.forEach((item, index) => {
        if (
          item &&
          item.lat &&
          item.long &&
          item.status === "online" &&
          item._id !== userData?.data?.data?._id
        ) {
          const latitude = parseFloat(item.lat);
          const longitude = parseFloat(item.long);
  
          if (!isNaN(latitude) && !isNaN(longitude)) {
            markers.push(
              <Marker
                key={item._id || `user_${index}`}
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                title={item.phoneNumber || `User ${index + 1}`}
                onPress={() => onMarkerPress(item)}
              >
                <View style={[styles.markerContainer, styles.blueMarker]}>
                  <Image
                    source={getMarkerImage(item.userType, false)}
                    style={styles.markerImage}
                  />
                </View>
                <Callout tooltip>
                  <CustomCallout
                    name={item.name || `User ${index + 1}`}
                    phoneNumber={item.phoneNumber}
                    avatarSource={require("../../assets/user2.png")}
                  />
                </Callout>
              </Marker>
            );
          }
        }
      });
    }
  
    return markers;
  }, [currentLocation, userData, data, getMarkerImage, onMarkerPress]);

  const onPlaceSelected = (details) => {
    const { lat, lng } = details.geometry.location;
    setDestination({ latitude: lat, longitude: lng });
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        fetchDetails={true}
        onPress={(data, details = null) => onPlaceSelected(details)}
        query={{
          key: "AIzaSyA7cZCuVvMKML7cS7L-5uzyk5OrSEyqXW8" || process.env.API_KEY,
          language: "en",
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.autocompleteInput,
        }}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        region={region}
        provider="google"
      >
        {currentLocation && (
          <Circle
            center={currentLocation}
            radius={radius}
            fillColor="rgba(30, 136, 229, 0.2)"
            strokeColor="rgba(30, 136, 229, 0.8)"
            strokeWidth={2}
          />
        )}

        {destination && (
          <Marker coordinate={destination} title="Destination">
            <Image
              source={require("../../assets/user2.png")}
              style={styles.markerImage}
            />
          </Marker>
        )}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#1E88E5"
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}

        {renderMarkers()}
      </MapView>
      <View style={styles.radiusControl}>
        <Text style={styles.radiusText}>
          Radius: {(radius / 1000).toFixed(1)} km
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          step={0.5}
          value={radius / 2000}
          onValueChange={updateRadius}
          minimumTrackTintColor="#1E88E5"
          maximumTrackTintColor="#BBDEFB"
          thumbTintColor="#1E88E5"
        />
      </View>
      {selectedMarker && (
        <Animated.View
          style={[
            styles.infoCard,
            {
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.infoTitle}>{selectedMarker.name || "User"}</Text>
          <Text style={styles.infoDistance}>Distance: {distance} km</Text>
        </Animated.View>
      )}
    </View>
  );
}

// 2UZbCWRszsBF8lF5
// afrazrajpoot46
