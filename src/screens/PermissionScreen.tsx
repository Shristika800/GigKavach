import React, {
  useEffect,
  useState,
} from "react";

import {View,Text,StyleSheet, StatusBar,  TouchableOpacity, ScrollView, Alert} from "react-native";

import * as Location from "expo-location";

import * as ImagePicker from "expo-image-picker";

import * as Contacts from "expo-contacts";

import { supabase } from "../lib/supabase";

import { Audio } from "expo-av";

import { COLORS } from "../constants/colors";

export default function PermissionScreen({
  navigation,
  route,
}: any)
 {

  const [
    permissions,
    setPermissions,
  ] = useState({

    location: false,
    microphone: false,
    camera: false,
    media: false,
    contacts: false,
  });

  /* CHECK EXISTING PERMISSIONS */

  useEffect(() => {

    checkPermissions();

  }, []);

  const checkPermissions =
    async () => {

      const location =
        await Location
          .getForegroundPermissionsAsync();

      const camera =
        await ImagePicker
          .getCameraPermissionsAsync();

      const microphone =
        await Audio
          .getPermissionsAsync();

      const media =
        await ImagePicker
          .getMediaLibraryPermissionsAsync();

      const contacts =
        await Contacts
          .getPermissionsAsync();

      setPermissions({

        location:
          location.status
          === "granted",

        microphone:
          microphone.status
          === "granted",

        camera:
          camera.status
          === "granted",

        media:
          media.status
          === "granted",

        contacts:
          contacts.status
          === "granted",
      });
    };

  /* LOCATION */

  const requestLocation =
    async () => {

      const result =
        await Location
          .requestForegroundPermissionsAsync();

      if (
        result.status
        !== "granted"
      ) {

        Alert.alert(
          "Location Required",
          "Sentinel requires location access for passive worker safety monitoring."
        );
      }

      checkPermissions();
    };

  /* MICROPHONE */

  const requestMicrophone =
    async () => {

      await Audio
        .requestPermissionsAsync();

      checkPermissions();
    };

  /* CAMERA */

  const requestCamera =
    async () => {

      await ImagePicker
        .requestCameraPermissionsAsync();

      checkPermissions();
    };

  /* MEDIA */

  const requestMedia =
    async () => {

      await ImagePicker
        .requestMediaLibraryPermissionsAsync();

      checkPermissions();
    };

  /* CONTACTS */

  const requestContacts =
    async () => {

      await Contacts
        .requestPermissionsAsync();

      checkPermissions();
    };

  /* CONTINUE */

  const handleContinue =
  () => {

    if (
      !permissions.location
    ) {

      Alert.alert(
        "Location Required",
        "Please enable location access."
      );

      return;
    }

    if (
      !permissions.microphone
    ) {

      Alert.alert(
        "Microphone Required",
        "Please enable microphone access."
      );

      return;
    }

    if (
      !permissions.camera
    ) {

      Alert.alert(
        "Camera Required",
        "Please enable camera access."
      );

      return;
    }

    if (
      !permissions.contacts
    ) {

      Alert.alert(
        "Contacts Required",
        "Please enable contacts access."
      );

      return;
    }

    navigation.replace(
      "WorkerDetails",
      {
        phone: route.params?.phone,

        fullName: route.params?.fullName,
      }
    );
  };

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >

      <StatusBar
        barStyle="light-content"
        backgroundColor="#020617"
      />

      <View style={styles.topGlow} />

      <View style={styles.content}>

        {/* TITLE */}

        <Text style={styles.title}>
          Enable Protection
        </Text>

        <Text style={styles.subtitle}>
          Sentinel uses passive
          safety systems to help
          protect workers during
          active shifts
        </Text>

        {/* CARDS */}

        <PermissionCard
          title="Live Location"
          subtitle="Real-time route and anomaly monitoring"
          enabled={
            permissions.location
          }
          important
          onPress={
            requestLocation
          }
        />

        <PermissionCard
          title="Microphone"
          subtitle="Emergency voice triggers and alerts"
          enabled={
            permissions.microphone
          }
          onPress={
            requestMicrophone
          }
        />

        <PermissionCard
          title="Camera Access"
          subtitle="Incident capture and reporting"
          enabled={
            permissions.camera
          }
          onPress={
            requestCamera
          }
        />

        <PermissionCard
          title="Media Access"
          subtitle="Store and upload incident evidence"
          enabled={
            permissions.media
          }
          onPress={
            requestMedia
          }
        />

        <PermissionCard
          title="Contacts"
          subtitle="Emergency contact and SOS support"
          enabled={
            permissions.contacts
          }
          onPress={
            requestContacts
          }
        />

        {/* CONTINUE */}

        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.button,

            !permissions.location && {
              opacity: 0.45,
            },
          ]}
          onPress={
            handleContinue
          }
        >

          <Text style={styles.buttonText}>
            Continue
          </Text>

        </TouchableOpacity>

        {/* NOTE */}

        <Text style={styles.note}>
          Permissions can be updated
          anytime later from device
          settings.
        </Text>

      </View>

    </ScrollView>
  );
}

/* CARD */

function PermissionCard({
  title,
  subtitle,
  enabled,
  important,
  onPress,
}: any) {

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={onPress}
    >

      <View style={styles.cardTop}>

        <View style={styles.textArea}>

          <Text style={styles.cardTitle}>
            {title}
          </Text>

          <Text style={styles.cardSubtitle}>
            {subtitle}
          </Text>

        </View>

      </View>

      <View
        style={[
          styles.status,

          !enabled && {
            backgroundColor:
              "rgba(15,76,129,0.18)",
          },

          enabled && {
            backgroundColor:
              "#123D2B",
          },
        ]}
      >

        <Text style={styles.statusText}>

          {enabled
            ? "Enabled"
            : important
              ? "Highly Recommended"
              : "Recommended"}

        </Text>

      </View>

    </TouchableOpacity>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#020617",
      paddingHorizontal: 28,
    },

    topGlow: {
      position: "absolute",
      top: -260,
      width: 650,
      height: 650,
      borderRadius: 325,
      backgroundColor: "#0B4D85",
      opacity: 0.16,
      alignSelf: "center",
    },

    content: {
      paddingTop: 72,
      alignItems: "center",
    },

    title: {
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: "800",
      marginBottom: 12,
    },

    subtitle: {
      color: "#7FA9D9",
      fontSize: 15,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 28,
    },

    card: {
      width: "100%",
      height: 118,

      backgroundColor:
        "rgba(15,23,42,0.95)",

      borderRadius: 24,

      padding: 22,

      marginBottom: 18,

      borderWidth: 1,

      borderColor:
        "rgba(148,163,184,0.08)",

      justifyContent:
        "space-between",
    },

    cardTop: {
      flexDirection: "row",
      alignItems: "flex-start",
    },

    textArea: {
      flex: 1,
    },

    cardTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 6,
    },

    cardSubtitle: {
      color: "#7FA9D9",
      fontSize: 14,
      lineHeight: 22,
    },

    status: {
      alignSelf: "flex-start",

      paddingHorizontal: 14,
      paddingVertical: 8,

      borderRadius: 14,
    },

    statusText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.4,
    },

    button: {
      width: "100%",
      height: 64,

      borderRadius: 22,

      backgroundColor:
        COLORS.primary,

      justifyContent: "center",
      alignItems: "center",

      marginTop: 10,

      shadowColor:
        COLORS.primary,

      shadowOpacity: 0.42,
      shadowRadius: 20,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 14,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.4,
    },

    note: {
      color: "#6B7C93",
      fontSize: 13,
      textAlign: "center",
      lineHeight: 22,
      marginTop: 22,
      paddingHorizontal: 12,
    },
  });