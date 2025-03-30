import React, { useEffect, useState, useMemo } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import colors from "@/styles/colors";
import { io } from "socket.io-client";
import { mapCustomStyle } from "@/styles/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from "axios";

const socket = io('http://172.168.168.25:4000');

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [users, setUsers] = useState<Record<string, { latitude: number; longitude: number }>>({});
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    async function startTrackingLocation() {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) return;

      if (locationPermission?.status !== 'granted') {
        const { status } = await requestLocationPermission();
        if (status !== 'granted') return;
      }

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (newLocation) => {
          setLocation(newLocation);
          socket.emit('update_location', {
            userEmail,
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
    }

    startTrackingLocation();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, [locationPermission]);

  useEffect(() => {
    socket.on('location_update', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off('location_update');
    };
  }, []);

  const plantTree = async () => {
    if (!location) return;
    const { latitude, longitude } = location.coords;

    try {
      const userMail = await AsyncStorage.getItem("userEmail"); // Await the Promise

      if (!userMail) {
        Alert.alert("Error", "User email not found.");
        return;
      }

      await axios.post("http://172.168.168.25:4000/api/user/set-plant", {
        emailId: userMail,
        latitude,
        longitude,
      });

      Alert.alert("Success", "Tree planted successfully!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to plant tree. Please try again.");
    }
  };

  const fetchPlantedTrees = async () => {
    try {
      const userMail = await AsyncStorage.getItem("userEmail");
      if (!userMail) return;

      const response = await axios.get("http://172.168.168.25:4000/api/user/get-plant", {
        params: { emailId: userMail },
      });

      setTrees(response.data); // Store trees in state

      // Check if no trees are planted and show an alert
      if (response.data.length === 0) {
        Alert.alert(
          "Reminder",
          "You haven't planted any trees yet. Start planting today!",
          [
            {
              text: "Plant Now",
              onPress: () => plantTree(),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error fetching trees:", error);
      Alert.alert("Error", "Failed to load planted trees.");
    }
  };

  useEffect(() => {
    fetchPlantedTrees();
  }, [trees]);

  const cleanLitter = () => {
    if (!location) return;
  }

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 60, right: 16, zIndex: 1, gap: 15 }}>
        <TouchableOpacity onPress={() => plantTree()}>
          <FontAwesome6 name="tree" size={35} color={colors["green-400"]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => cleanLitter()}>
          <FontAwesome5 name="broom" size={24} color={colors["zinc-500"]} />
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        region={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta: 0.00000001, // Smaller value for closer zoom
          longitudeDelta: 0.00000001, // Smaller value for closer zoom
        }}
        showsMyLocationButton={true}
        showsUserLocation={true}
        showsCompass={true}
        showsIndoors={false}
        showsBuildings={false}
        showsTraffic={false}
        customMapStyle={mapCustomStyle}
      >
        
        {/* Show Users */}
        {Object.entries(users).map(([userId, user]) => (
          user.latitude && user.longitude ? (
            <Marker key={userId}
              title={`User: ${userId}`}
              description={`Lat: ${user.latitude}, Lng: ${user.longitude}`}
              coordinate={{ latitude: user.latitude, longitude: user.longitude }}
            >
              <FontAwesome6 name="person" size={40} color={colors["red-400"]} />
            </Marker>
          ) : null
        ))}

        {/* Show Planted Trees */}
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            title={`Planted by ${tree.emailId}`}
            description={`Planted at: ${new Date(tree.plantedAt).toLocaleString()}`}
            coordinate={{ latitude: tree.latitude, longitude: tree.longitude }}
          >
            <FontAwesome6 name="tree" size={35} color={colors["green-400"]} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
