import React, { useState } from "react";
import {View,Text,StyleSheet,TextInput,TouchableOpacity,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export default function DestinationScreen({ navigation }: any) {
  const [destination, setDestination] = useState("");

  const recentPlaces = [
    { icon: "home", name: "Home" },
    { icon: "business", name: "Amazon Warehouse" },
    { icon: "train", name: "Anand Vihar Metro" },
    { icon: "airplane", name: "IGI Airport" },
  ];

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Where are you going?</Text>

      <Text style={styles.subtitle}>
        Find the safest route to your destination.
      </Text>

      <Text style={styles.sectionTitle}>Current Location</Text>

      <View style={styles.locationCard}>
        <Ionicons
          name="location"
          size={20}
          color={COLORS.primary}
        />

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.locationName}>
            Dilshad Garden
          </Text>

          <Text style={styles.locationAddress}>
            Delhi
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Destination</Text>

      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#94A3B8"
        />

        <TextInput
          placeholder="Search destination..."
          placeholderTextColor="#94A3B8"
          value={destination}
          onChangeText={setDestination}
          style={styles.input}
        />
      </View>

      <Text style={styles.sectionTitle}>Recent Places</Text>

      {recentPlaces.map((place) => (
        <TouchableOpacity
          key={place.name}
          style={styles.placeCard}
          onPress={() => setDestination(place.name)}
        >
          <Ionicons
            name={place.icon as any}
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.placeText}>
            {place.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        disabled={!destination}
        style={[
          styles.button,
          !destination && styles.buttonDisabled,
        ]}
        onPress={() =>
          navigation.navigate("RouteScreen", {
            destination,
          })
        }
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 24,
  },

  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",
    marginTop: 8,
    marginBottom: 28,
    fontSize: 15,
  },

  sectionTitle: {
    color: "#7FA9D9",
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 20,
  },

  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 20,
  },

  locationName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  locationAddress: {
    color: "#94A3B8",
    marginTop: 4,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
  },

  input: {
    flex: 1,
    color: "#FFF",
    marginLeft: 12,
    fontSize: 16,
  },

  placeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  placeText: {
    color: "#FFF",
    marginLeft: 16,
    fontSize: 16,
  },

  button: {
    marginTop: "auto",
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 17,
  },
});