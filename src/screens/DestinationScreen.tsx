import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

type Destination = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export default function DestinationScreen({
  navigation,
}: any) {
  const [destination, setDestination] =
    useState<Destination | null>(null);

  const recentPlaces: Destination[] = [
    {
      name: "Home",
      address: "Your saved home location",
      latitude: 28.6692,
      longitude: 77.4538,
    },
    {
      name: "Amazon Warehouse",
      address: "Amazon delivery location",
      latitude: 28.6139,
      longitude: 77.2090,
    },
    {
      name: "Connaught Place",
      address: "Connaught Place, New Delhi",
      latitude: 28.6315,
      longitude: 77.2167,
    },
    {
      name: "Airport",
      address: "Indira Gandhi International Airport",
      latitude: 28.5562,
      longitude: 77.1000,
    },
  ];

  const handleContinue = () => {
    if (!destination) return;

    navigation.navigate("RouteScreen", {
      destination,
    });
  };

  const clearDestination = () => {
    setDestination(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* BACK BUTTON */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* TITLE */}

        <Text style={styles.title}>
          Where are you going?
        </Text>

        <Text style={styles.subtitle}>
          Enter your destination to find the safest route.
        </Text>

        {/* CURRENT LOCATION */}

        <Text style={styles.label}>
          Current Location
        </Text>

        <View style={styles.locationCard}>
          <Ionicons
            name="location"
            size={20}
            color={COLORS.primary}
          />

          <Text style={styles.locationText}>
            Using your current location
          </Text>
        </View>

        {/* DESTINATION */}

        <Text style={styles.label}>
          Destination
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="Search destination"
            placeholderTextColor="#64748B"
            value={destination?.name || ""}
            onChangeText={(text) => {
              setDestination({
                name: text,
                address: text,
                latitude: 0,
                longitude: 0,
              });
            }}
            autoCapitalize="words"
          />

          {destination && (
            <TouchableOpacity
              onPress={clearDestination}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* RECENT PLACES */}

        <Text style={styles.label}>
          Recent Places
        </Text>

        {recentPlaces.map((place) => (
          <TouchableOpacity
            key={place.name}
            style={styles.placeCard}
            onPress={() => setDestination(place)}
          >
            <View style={styles.placeIcon}>
              <Ionicons
                name="time-outline"
                size={19}
                color="#7FA9D9"
              />
            </View>

            <View style={styles.placeInfo}>
              <Text style={styles.placeText}>
                {place.name}
              </Text>

              <Text style={styles.placeAddress}>
                {place.address}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#475569"
            />
          </TouchableOpacity>
        ))}

        {/* CONTINUE */}

        <TouchableOpacity
          disabled={!destination}
          style={[
            styles.button,
            !destination &&
              styles.buttonDisabled,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            Continue
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: "#7FA9D9",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    color: "#7FA9D9",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 18,
  },

  locationCard: {
    minHeight: 60,
    backgroundColor: "#0F172A",
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor:
      "rgba(148,163,184,0.08)",
  },

  locationText: {
    color: "#FFFFFF",
    fontSize: 15,
  },

  inputContainer: {
    height: 60,
    borderRadius: 18,
    backgroundColor: "#0F172A",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      "rgba(148,163,184,0.08)",
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 12,
  },

  placeCard: {
    minHeight: 70,
    backgroundColor: "#0F172A",
    borderRadius: 18,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      "rgba(148,163,184,0.08)",
  },

  placeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor:
      "rgba(127,169,217,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  placeInfo: {
    flex: 1,
  },

  placeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  placeAddress: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },

  button: {
    height: 62,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});