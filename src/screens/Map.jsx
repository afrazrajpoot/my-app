import React, { useEffect, useState, useRef } from "react";

import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useGetAllUsersMutation } from "../redux/storeApi";
import polyline from "@mapbox/polyline";
import { MaterialIcons } from "@expo/vector-icons";

export default function Map() {
  const [userData, setUserData] = useState({});
  const [getUserByType, { isError, isLoading, data }] = useGetAllUsersMutation();
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
  // console.log(process.env.API_KEY, "api key");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData1 = await AsyncStorage.getItem("userData");
        if (userData1) {
          const parsedData = JSON.parse(userData1);
          setUserData(parsedData);
          await getUserByType({ userType: parsedData?.data?.data?.userType });
        }
      } catch (error) {
        console.error("Error retrieving data: ", error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          // console.log("Location permission denied");
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
  }, []);

  const fetchRoute = async (origin, destination) => {
    const originString = `${origin?.latitude},${origin?.longitude}`;
    const destinationString = `${destination?.latitude},${destination?.longitude}`;
    const apiKey = process.env.API_KEY; // Replace with your API key

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

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
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
          key: process.env.API_KEY,
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
            radius={10000}
            fillColor="rgba(0, 122, 255, 0.1)"
            strokeColor="rgba(0, 122, 255, 0.3)"
            strokeWidth={2}
          />
        )}

        {destination && (
          <Marker coordinate={destination} title="Destination">
            <MaterialIcons name="location-on" size={36} color="#4CAF50" />
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

        {data?.data
          ?.filter((item) => {
            const markerDistance = getDistanceFromLatLonInKm(
              currentLocation?.latitude,
              currentLocation?.longitude,
              parseFloat(item?.lat),
              parseFloat(item?.long)
            );
            return markerDistance <= 5;
          })
          .map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(item?.lat),
                longitude: parseFloat(item?.long),
              }}
              title={item?.name || `User ${index + 1}`}
              onPress={() => onMarkerPress(item)}
            >
              <MaterialIcons
                name="person-pin-circle"
                size={36}
                color={item?._id === userData?.data?.data?._id ? "#1E88E5" : "#FF5722"}
              />
            </Marker>
          ))}
      </MapView>

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
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoButtonText}>Contact</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  autocompleteContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  autocompleteInput: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoDistance: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  infoButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  infoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
