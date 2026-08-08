import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, {Marker,PROVIDER_GOOGLE,Region,} from "react-native-maps";
import * as Location from "expo-location";

type Props = {
  destination?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
};

export default function RoadMap({ destination }: Props) {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region | null>(null);

  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") return;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setUserLocation(location);

    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    setRegion(newRegion);
  }

  useEffect(() => {
    if (!mapRef.current || !userLocation || !destination) return;

    mapRef.current.fitToCoordinates(
      [
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        {
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
      ],
      {
        edgePadding: {
          top: 80,
          left: 60,
          right: 60,
          bottom: 80,
        },
        animated: true,
      }
    );
  }, [destination, userLocation]);

  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton
      showsCompass
      showsTraffic
    >
      {destination && (
        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title={destination.name ?? "Destination"}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },
});