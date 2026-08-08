import React, { useState } from "react";
import { View,Text,StyleSheet, TouchableOpacity, ScrollView,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import RoadMap from "../components/RoadMap";

export default function RouteScreen({ route, navigation }: any) {
  const { destination } = route.params;

  const routes = [
    {
      id: 1,
      title: "Safest Route",
      score: 94,
      duration: "28 min",
      color: "#22C55E",
      recommended: true,
      description: "Avoids isolated roads and crime hotspots.",
    },
    {
      id: 2,
      title: "Balanced Route",
      score: 86,
      duration: "25 min",
      color: "#F59E0B",
      recommended: false,
      description: "Balanced between safety and travel time.",
    },
    {
      id: 3,
      title: "Fastest Route",
      score: 71,
      duration: "22 min",
      color: "#EF4444",
      recommended: false,
      description: "Shortest travel time with lower safety score.",
    },
  ];

  const [selectedRoute, setSelectedRoute] = useState(routes[0]);

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.title}>
        Choose Your Route
      </Text>

      <Text style={styles.subtitle}>
        Destination
      </Text>

      <Text style={styles.destination}>
        {destination}
      </Text>

      {/* ================= MAP ================= */}

      <View style={styles.mapContainer}>
<RoadMap
  destination={{
    latitude: 28.6315,
    longitude: 77.2167,
    name: destination,
  }}
/>      </View>

      {/* ============== ROUTES ================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {routes.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedRoute(item)}
            style={[
              styles.card,
              selectedRoute.id === item.id && {
                borderColor: item.color,
                borderWidth: 2,
              },
            ]}
          >
            <View style={styles.row}>
              <Text style={styles.routeTitle}>
                {item.title}
              </Text>

              {item.recommended && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    Recommended
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.score,
                { color: item.color },
              ]}
            >
              Safety Score: {item.score}
            </Text>

            <Text style={styles.time}>
              ETA • {item.duration}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>

          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ============== BUTTON ================= */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log(selectedRoute);
        }}
      >
        <Text style={styles.buttonText}>
          Start Safe Journey
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
    marginTop: 16,
    fontSize: 14,
  },

  destination: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  mapContainer: {
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  routeTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  badge: {
    backgroundColor: "#22C55E",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  score: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
  },

  time: {
    color: "#CBD5E1",
    marginTop: 10,
    fontSize: 15,
  },

  description: {
    color: "#94A3B8",
    marginTop: 12,
    lineHeight: 22,
  },

  button: {
    position: "absolute",
    bottom: 30,
    left: 24,
    right: 24,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },

});