import React, {
  useState,
} from "react";

import { View, Text, StyleSheet, StatusBar,  TextInput,  TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert} from "react-native";

import { COLORS }
from "../constants/colors";


import { supabase }
from "../lib/supabase";

export default function RegisterScreen({
  navigation,
}: any) {

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const isIndianNumber =
    /^[6-9]\d{9}$/
      .test(phone);

  const isValid =
    name.trim().length > 2
    &&
    isIndianNumber;

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <StatusBar
        barStyle="light-content"
        backgroundColor="#020617"
      />

      {/* TOP GLOW */}

      <View style={styles.topGlow} />

      {/* CONTENT */}

      <View style={styles.content}>

        {/* LOGO */}

        <View style={styles.outerRing}>

          <View style={styles.innerRing}>

            <Image
              source={require(
                "../assets/gigkavach_logo.png"
              )}
              style={styles.logoImage}
              resizeMode="contain"
            />

          </View>

        </View>

        {/* TITLE */}

        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Join GigKavach and
          activate worker safety
        </Text>

        {/* FULL NAME */}

        <View style={styles.inputWrapper}>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            placeholderTextColor="#5B6B81"
            style={styles.input}
          />

        </View>

        {/* PHONE */}

        <View style={styles.inputWrapper}>

          <Text style={styles.countryCode}>
            +91
          </Text>

          <TextInput
            value={phone}
            onChangeText={(text) => {

              const cleaned =
                text.replace(
                  /[^0-9]/g,
                  ""
                );

              setPhone(cleaned);
            }}
            placeholder="Mobile Number"
            placeholderTextColor="#5B6B81"
            keyboardType="phone-pad"
            maxLength={10}
            style={styles.input}
          />

        </View>

        {/* BUTTON */}

      <TouchableOpacity
  activeOpacity={0.9}
  style={[
    styles.button,
    !isValid && {
      opacity: 0.5,
    },
  ]}
  disabled={!isValid}
  onPress={async () => {

    const {
      data,
    } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (data) {

      Alert.alert(
        "Already Registered",
        "Please login instead."
      );

      return;
    }

    navigation.navigate(
      "OTP",
      {
        fromScreen:
          "Register",

        phone,

        fullName:
          name,
      }
    );
  }}
>

          <Text style={styles.buttonText}>
            Create Account
          </Text>

        </TouchableOpacity>

        {/* LOGIN */}

        <View style={styles.bottomRow}>

          <Text style={styles.bottomText}>
            Already registered?
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.goBack()
            }
          >

            <Text style={styles.link}>
              Login
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#020617",
      justifyContent: "center",
      paddingHorizontal: 28,
      overflow: "hidden",
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
      alignItems: "center",
    },

    outerRing: {
      width: 150,
      height: 150,
      borderRadius: 75,

      borderWidth: 1,

      borderColor:
        "rgba(0,149,255,0.12)",

      justifyContent: "center",
      alignItems: "center",

      marginBottom: 34,

    },

    innerRing: {
      width: 126,
      height: 126,
      borderRadius: 63,

      borderWidth: 1.5,

      borderColor:
        "rgba(0,149,255,0.35)",

      justifyContent: "center",
      alignItems: "center",

      backgroundColor:
        "rgba(7,18,38,0.45)",
    },

    logoImage: {
      width: 92,
      height: 92,
      borderRadius: 46,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 36,
      fontWeight: "800",

      marginBottom: 10,

      letterSpacing: 0.5,
    },

    subtitle: {
      color: "#7FA9D9",
      fontSize: 15,

      textAlign: "center",

      marginBottom: 42,

      lineHeight: 24,
    },

    inputWrapper: {
      width: "100%",
      height: 66,

      borderRadius: 22,

      backgroundColor:
        "rgba(15,23,42,0.95)",

      borderWidth: 1,

      borderColor:
        "rgba(148,163,184,0.08)",

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 18,

      marginBottom: 20,
    },

    countryCode: {
      color: "#7FA9D9",
      fontSize: 16,
      fontWeight: "700",
      marginRight: 14,
    },

    input: {
      flex: 1,

      color: "#FFFFFF",

      fontSize: 16,

      fontWeight: "500",
    },

    button: {
      width: "100%",
      height: 64,

      borderRadius: 22,

      backgroundColor:
        COLORS.primary,

      justifyContent: "center",
      alignItems: "center",

      marginTop: 8,

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

    bottomRow: {
      flexDirection: "row",
      marginTop: 30,
      gap: 6,
    },

    bottomText: {
      color: "#6B7C93",
      fontSize: 14,
    },

    link: {
      color: "#7FA9D9",
      fontSize: 14,
      fontWeight: "700",
    },
  });