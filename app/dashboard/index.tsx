import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import colors from "@/styles/colors";
import { io } from "socket.io-client";
import { mapCustomStyle } from "@/styles/style";

const socket = io('http://172.168.168.25:4000');

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [users, setUsers] = useState<Record<string, { latitude: number; longitude: number }>>({});
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    async function startTrackingLocation() {
      if (locationPermission?.status !== 'granted') {
        const { status } = await requestLocationPermission();
        if (status !== 'granted') {
          return;
        }
      }

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (newLocation) => {
          setLocation(newLocation);
          socket.emit('update_location', {
            userId: socket.id,
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta:  0.00000001, // Smaller value for closer zoom
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
        {Object.entries(users).map(([userId, user]) => (
          user.latitude && user.longitude ? (
            <Marker key={userId}
              title={`User: ${userId}`}
              description={`Lat: ${user.latitude}, Lng: ${user.longitude}`}
              coordinate={{ latitude: user.latitude, longitude: user.longitude }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome6 name="person" size={35} color={colors["red-400"]} />
              </View>
            </Marker>
          ) : null
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
