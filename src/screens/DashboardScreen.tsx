import React, { useEffect, useState } from "react";
import {  View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Alert, TextInput, Modal, Image, Linking
} from "react-native";
import { supabase } from "../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function DashboardScreen({ route, navigation,}: any) {
const { phone } = route.params || {};



  const [user, setUser] = useState<any>(null);
  const [shiftActive, setShiftActive] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [incidentImage, setIncidentImage] = useState<any>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [overspeed, setOverspeed] = useState(false);

  // fetch user from supabase
  useEffect(() => { fetchUser(); }, []);

const fetchUser = async () => {

  let savedPhone = phone;

  if (!savedPhone) { savedPhone =  await AsyncStorage.getItem(
 "userPhone"
      );
  }

  if (!savedPhone) return;

  const { data, error } =await supabase.from("users").select("*").eq("phone", savedPhone).single();

  console.log("PHONE:", savedPhone);
  console.log("USER:", data);

  if (!error && data) {setUser(data);
console.log("PHONE:", phone);
  }
};

  // continuous GPS tracking
  useEffect(() => { let subscription: any;

    const startTracking = async () => {const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { Alert.alert("Permission Required", "Location access is needed for GigKavach tracking.");
        return;
      }

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (loc) => {
          // fix: use loc.coords not loc directly
          setLocation(loc.coords);

          const speed = (loc.coords.speed || 0) * 3.6;
          const roundedSpeed = Math.round(speed);
          setCurrentSpeed(roundedSpeed);

          console.log("LIVE SPEED:", roundedSpeed);
          console.log("LOCATION:", loc.coords);

        if (roundedSpeed > 50) {setOverspeed(true);} else {setOverspeed(false);}

         if (roundedSpeed < 5) { console.log("Low movement detected");}
        }
      );
    };


    startTracking();

    return () => {if (subscription) subscription.remove();};
  }, []);

  // get location when shift starts
  useEffect(() => {if (shiftActive) getLocation();}, [shiftActive]);

  const getLocation = async () => {
    try {const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location access is required.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    } catch {Alert.alert("Location Error", "Unable to fetch live location.");
    }
  };

  const toggleShift = () => {if (!shiftActive) {
      setShiftActive(true);
      setAlerts(prev => [{ type: "Shift Started", time: new Date().toLocaleString() }, ...prev]);
    } else {setShiftActive(false);
      setShowTracking(false);
      setAlerts(prev => [{ type: "Shift Ended", time: new Date().toLocaleString() }, ...prev]);
    }
  };

  const handleSOS = () => {setAlerts(prev => [{
      type: "SOS Triggered",
      time: new Date().toLocaleString(),
      latitude: location?.latitude,
      longitude: location?.longitude,
    }, ...prev]);
    Alert.alert("SOS Activated", "Emergency contacts and authorities will be alerted.");
  };


  const openCamera = async () => {const permission =
    await ImagePicker.requestCameraPermissionsAsync();

  if (permission.status !== "granted"
  ) {return;}
  

  const result =await ImagePicker.launchCameraAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

  if (!result.canceled) {setIncidentImage(result.assets[0]);
  }
};

const openGallery = async () => {const result =
    await ImagePicker.launchImageLibraryAsync({mediaTypes:
        ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

  if (!result.canceled) {setIncidentImage(result.assets[0]);
  }
};

const logout = async () => {await AsyncStorage.removeItem(
    "userPhone"
  );

  navigation.reset({index: 0,
    routes: [
      {
        name: "Login",
      },
    ],
  });

};

const uploadIncidentImage =
() => {Alert.alert(
      "Upload Evidence",

      "Choose an option",

      [
        {
          text:
            "Take Photo",

          onPress:
            openCamera,
        },

        {
          text:
            "Choose From Gallery",

          onPress:
            openGallery,
        },

        {
          text: "Cancel",

          style: "cancel",
        },
      ]
    );
  };

  const submitIncident = () => {if (!incidentType || !severity || !description) {
      Alert.alert("Incomplete Report", "Please complete all fields.");
      return;
    }
    setAlerts(prev => [{
      type: "Incident Reported",
      incidentType,
      severity,
      description,
      evidence: incidentImage ? "Attached" : "Not Attached",
      time: new Date().toLocaleString(),
    }, ...prev]);
    setShowIncidentModal(false);
    setIncidentType("");
    setSeverity("");
    setDescription("");
    setIncidentImage(null);
    Alert.alert("Incident Submitted", "Incident has been securely logged.");
  };

  const callPrimaryContact = () => {Alert.alert(
    "Coming Soon",
    "Primary contact calling will be added next."
  );
};

const viewContacts = () => {navigation.navigate(
    "EmergencyContact"
  );
};



const openEmergencyContacts = () => {Alert.alert(
    "Emergency Contacts",
    "Choose an option",
    [
      {
        text: "Call Primary Contact",
        onPress: callPrimaryContact,
      },
      {
        text: "View All Contacts",
        onPress: viewContacts,
      },
      {
        text: "Manage Contacts",
        onPress: () =>
          navigation.navigate(
            "EmergencyContact"
          ),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]
  );

};

  const openSafeRoutes = () => {Linking.openURL("https://www.google.com/maps");
  };

  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <View style={styles.topGlow} />

      <View style={styles.content}>
        {overspeed && (
  <View style={styles.warningBanner}>
    <Text style={styles.warningText}>
      ⚠ Overspeed Detected • Please Slow Down
    </Text>
  </View>
)}

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>{user?.full_name || "Gig Worker"}</Text>
            <Text style={styles.workerId}>{user?.phone || "+91 XXXXX XXXXX"}</Text>
            <Text style={{ color: "#fff" }}> speed: {currentSpeed} km/h</Text>
          </View>
         <View>

  <TouchableOpacity
    onPress={logout}
    style={{
      backgroundColor: "#0F172A",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: "center",
    }}
  >
    <Text style={{
        color: "#FFFFFF",
        fontWeight: "700",
      }}
    >
      Logout
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
  style={styles.notification}
  onPress={() =>
    setShowNotifications(
      !showNotifications
    )
  }
>
  <Ionicons
    name="notifications"
    size={22}
    color="#FFFFFF"
  />

  <View
    style={styles.notificationDot}
  />
</TouchableOpacity>

            {showNotifications && (
  <View style={styles.notificationDropdown}>

    <TouchableOpacity
      onPress={() =>
        setShowNotifications(false)
      }
      style={{
        position: "absolute",
        top: 10,
        right: 12,
        zIndex: 1000,
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: "700",
        }}
      >
        ×
      </Text>
    </TouchableOpacity>

    <Text style={styles.notificationTitle}>
      GigKavach Alerts
    </Text>
           <View style={styles.alertItem}>
  <Text style={styles.alertStatus}>
    🟢 Shift Monitoring Ready
  </Text>

  <Text style={styles.alertSub}>
    Start a shift to enable tracking
  </Text>
</View>

<View style={styles.alertItem}>
  <Text style={styles.alertStatus}>
    🟢 Emergency Contacts Ready
  </Text>

  <Text style={styles.alertSub}>
    Safety contacts configured
  </Text>
</View>

<View style={styles.alertItem}>
  <Text style={styles.alertStatus}>
    🟢 Speed Detection Active
  </Text>

  <Text style={styles.alertSub}>
    Monitoring worker movement
  </Text>
</View>

<View style={{
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,184,0.08)",
  }}
>
  <Text style={{
      color: "#8B93A7",
      fontSize: 13,
      textAlign: "center",
    }}
  >
    No active safety alerts
  </Text>
</View>
              </View>
            )}
          </View>
        </View>

        {/* STATUS */}
        <View style={styles.statusBar}>
          <View style={[styles.statusPill, shiftActive && { backgroundColor: "rgba(34,197,94,0.15)" }]}>
            <View style={[styles.statusDot, shiftActive && { backgroundColor: "#22C55E" }]} />
            <Text style={[styles.statusText, shiftActive && { color: "#22C55E" }]}>
              {shiftActive ? "Protected" : "Inactive"}
            </Text>
          </View>
        </View>

        {/* SHIFT BUTTON */}
        <TouchableOpacity activeOpacity={0.9} style={styles.shiftButton} onPress={toggleShift}>
          <Text style={styles.shiftText}>{shiftActive ? "■ End Shift" : "▶ Start Shift"}</Text>
        </TouchableOpacity>

        {/* SOS BUTTON */}
        <TouchableOpacity activeOpacity={0.9} style={styles.sosButton} onPress={handleSOS}>
          <Text style={styles.sosText}>SOS Emergency</Text>
        </TouchableOpacity>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>

        <View style={styles.grid}>

          {/* TRACK ME */}
         <View style={styles.mapCard}>

  <Text style={styles.mapTitle}>
    Live Worker Location
  </Text>

  {location ? (

    <MapView
      style={styles.map}
      showsUserLocation
      followsUserLocation
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >

      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
      />

    </MapView>

  ) : (

    <Text style={styles.cardSubtitle}>
      Waiting for GPS...
    </Text>

  )}

</View>

          {/* SAFE ROUTES */}
          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={openSafeRoutes}>
            <Ionicons name="map" size={26} color="#22C55E" />
            <Text style={styles.cardTitle}>Safe Routes</Text>
            <Text style={styles.cardSubtitle}>Open navigation map</Text>
          </TouchableOpacity>

          {/* INCIDENT */}
          <TouchableOpacity style={styles.card} onPress={() => setShowIncidentModal(true)}>
            <MaterialIcons name="report" size={26} color="#F59E0B" />
            <Text style={styles.cardTitle}>Report Incident</Text>
            <Text style={styles.cardSubtitle}>Log safety events</Text>
          </TouchableOpacity>

        {/* EMERGENCY CONTACTS */}
<TouchableOpacity
  style={styles.card}
  onPress={openEmergencyContacts}
>
  <FontAwesome5
    name="user-shield"
    size={22}
    color="#C084FC"
  />

  <Text style={styles.cardTitle}>
    Emergency Contacts
  </Text>

  <Text style={styles.cardSubtitle}>
    Safety contacts
  </Text>
</TouchableOpacity>

        </View>

  

        {/* RECENT ACTIVITY */}
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        </View>

        <View style={styles.activityContainer}>
          {alerts.length === 0 ? (
            <Text style={styles.emptyText}>No recent activity</Text>
          ) : (
            alerts.map((item, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityTitle}>{item.type}</Text>
                  {"incidentType" in item && (
                    <>
                      <Text style={styles.activitySub}>{item.incidentType}</Text>
                      <Text style={styles.activitySub}>{item.severity}</Text>
                    </>
                  )}
                  <Text style={styles.activitySub}>{item.time}</Text>
                </View>
              </View>
            ))
          )}
        </View>

      </View>

      {/* INCIDENT MODAL */}
      <Modal visible={showIncidentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Report Incident</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowIncidentModal(false)}>
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Incident Type</Text>
              <View style={styles.chips}>
                {["Accident", "Theft", "Road Rage", "Fight", "Medical Emergency", "Other"].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, incidentType === item && { backgroundColor: COLORS.primary }]}
                    onPress={() => setIncidentType(item)}
                  >
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>


              <Text style={styles.label}>Severity</Text>
              <View style={styles.chips}>
                {["Low Risk", "Elevated Risk", "High Threat", "Critical Emergency"].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, severity === item && { backgroundColor: "#991B1B" }]}
                    onPress={() => setSeverity(item)}
                  >
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Describe Incident</Text>
              <TextInput
                placeholder="Describe what happened..."
                placeholderTextColor="#5B6B81"
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
                style={styles.descriptionInput}
              />

              <Text style={styles.label}>Upload Evidence</Text>
              <Text style={styles.helper}>Optional but recommended</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={uploadIncidentImage}>
                <Text style={styles.uploadText}>
                  {incidentImage ? "Evidence Attached" : "Upload Image"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={submitIncident}>
                <Text style={styles.submitText}>Submit Incident</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 24,
  },
  topGlow: {
    position: "absolute",
    top: -280,
    width: 700,
    height: 700,
    borderRadius: 350,
    backgroundColor: "#0B4D85",
    opacity: 0.16,
    alignSelf: "center",
  },
  content: {
    paddingTop: 56,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  greeting: {
    color: "#7FA9D9",
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 4,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },
  workerId: {
    color: "#6B7280",
    fontSize: 15,
    marginTop: 6,
  },
  notification: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(15,23,42,0.95)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.08)",
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    position: "absolute",
    top: 14,
    right: 14,
  },
 notificationDropdown: {
  position: "absolute",
  top: 100,
  right: 0,
  width: 220,
  backgroundColor: "#0F172A",
  borderRadius: 18,
  padding: 18,
  paddingTop: 35,
  zIndex: 999,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.08)",
},
  notificationTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  notificationText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 6,
  },
  notificationSub: {
    color: "#7FA9D9",
    fontSize: 13,
  },
  statusBar: {
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(15,23,42,0.95)",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginBottom: 26,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(148,163,184,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6B7280",
    marginRight: 8,
  },
  statusText: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "700",
  },
  shiftButton: {
    height: 68,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "rgba(2,6,23,0.75)",
  },
  shiftText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },
  sosButton: {
    height: 68,
    borderRadius: 22,
    backgroundColor: "#7F1D1D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  sosText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  sectionTitle: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    width: "48%",
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.06)",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 6,
  },
  cardSubtitle: {
    color: "#7FA9D9",
    fontSize: 14,
    lineHeight: 20,
  },
  trackingContainer: {
    marginTop: 14,
  },
  trackingText: {
    color: "#7FA9D9",
    fontSize: 13,
    marginBottom: 6,
  },
  trackingActive: {
    color: "#22C55E",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activityContainer: {
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 22,
  },
  activityIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(15,23,42,0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  activityTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  activityTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  activitySub: {
    color: "#7FA9D9",
    fontSize: 13,
    marginBottom: 2,
  },
  emptyText: {
    color: "#7FA9D9",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: "88%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(148,163,184,0.08)",
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: -2,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 4,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.95)",
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  descriptionInput: {
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 18,
    padding: 16,
    color: "#FFFFFF",
    minHeight: 88,
    maxHeight: 110,
    textAlignVertical: "top",
    marginBottom: 18,
  },
  helper: {
    color: "#7FA9D9",
    fontSize: 13,
    marginBottom: 12,
  },
  uploadBox: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(148,163,184,0.16)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  submitButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

alertItem: {
  backgroundColor: "rgba(15,76,129,0.15)",
  borderRadius: 14,
  padding: 12,
  marginBottom: 10,
},

alertStatus: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "700",
},

alertSub: {
  color: "#8B93A7",
  fontSize: 12,
  marginTop: 4,
},

notificationHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
},

warningBanner: {
  backgroundColor: "#DC2626",
  paddingVertical: 12,
  paddingHorizontal: 20,
  alignItems: "center",
},

warningText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "700",
},

mapCard: {
  backgroundColor: "rgba(15,23,42,0.95)",
  borderRadius: 24,
  overflow: "hidden",
  marginBottom: 24,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.06)",
},

mapTitle: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "700",
  padding: 18,
},

map: {
  width: "100%",
  height: 300,
},

});

