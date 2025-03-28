import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { EvilIcons, FontAwesome6 } from "@expo/vector-icons";
import colors from "@/styles/colors";
import { mapCustomStyle } from "@/styles/style";

export default function index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    async function startTrackingLocation() {
      if (locationPermission?.status !== 'granted') {
        const { status } = await requestLocationPermission();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      }

      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
      } catch (error) {
        setErrorMsg('Failed to track location');
      }
    }

    startTrackingLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationPermission, requestLocationPermission]);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location?.coords.latitude || 1,
          longitude: location?.coords.longitude || 2,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsMyLocationButton={true}
        showsIndoors={false}
        showsBuildings={false}
        showsTraffic={false}
        customMapStyle={mapCustomStyle}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="This is your current location"
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome6 name="person" size={35} color={colors["red-400"]} />
            </View>
          </Marker>
        )}
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
