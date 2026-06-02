import React, {
  useRef,
  useState,
} from "react";

import { View,Text, StyleSheet, StatusBar, TouchableOpacity, TextInput,  KeyboardAvoidingView, Platform,Image} from "react-native";

import { COLORS }
from "../constants/colors";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../lib/supabase";

export default function OTPScreen({
  navigation,
  route,
}: any) {

  const {
    fromScreen,
    phone,
  } = route.params;

  const [otp, setOtp] =
    useState([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const inputs =
  useRef<TextInput[]>([]);

  const handleChange =
    (
      value: string,
      index: number
    ) => {

      const updatedOtp =
        [...otp];

      updatedOtp[index] =
        value;

      setOtp(updatedOtp);

      if (
        value &&
        index < 5
      ) {

        inputs.current[
          index + 1
        ]?.focus();
      }
    };

  const isComplete =
    otp.every(
      digit =>
        digit !== ""
    );

  const handleVerify =
  async() => {

    const enteredOtp =
      otp.join("");

    if (
      enteredOtp !== "245780"
    ) {

      alert("Invalid OTP");

      return;
    }

    if (
      fromScreen ===
      "Login"
    ) {

    await AsyncStorage.setItem(
  "userPhone",
  phone
);

navigation.replace(
  "Dashboard",
  {
    phone,
  }
);

    } else {

      navigation.replace(
        "Permission",
        {
          phone,
          fullName: route.params?.fullName,
        }
      );

     

    }
  };  

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

      {/* GLOW */}

      <View style={styles.topGlow} />

      {/* CONTENT */}

      <View style={styles.content}>

        {/* LOGO */}

        <View style={styles.logoWrapper}>

          <Image
            source={require(
              "../assets/gigkavach_logo.png"
            )}
            style={styles.logo}
            resizeMode="contain"
          />

        </View>

        {/* TITLE */}

        <Text style={styles.title}>
          Verify OTP
        </Text>

        <Text style={styles.subtitle}>
          Enter the 6 digit code
          sent to +91 {phone}
        </Text>

        {/* OTP BOXES */}

        <View style={styles.otpRow}>

          {otp.map(
            (
              digit,
              index
            ) => (

              <TextInput
                key={index}
                ref={(ref) => {
  if (ref) {
    inputs.current[index] = ref;
  }
}}
                onChangeText={(value) => {

  const cleaned =
    value.replace(
      /[^0-9]/g,
      ""
    );

  handleChange(
    cleaned,
    index
  );
}}
                keyboardType="number-pad"
                maxLength={1}
                style={styles.otpBox}
                placeholder="-"
                placeholderTextColor="#4B5C75"
              />
            )
          )}

        </View>

        {/* VERIFY BUTTON */}

        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!isComplete}
          style={[
            styles.button,

            !isComplete && {
              opacity: 0.45,
            },
          ]}
          onPress={
            handleVerify
          }
        >

          <Text style={styles.buttonText}>
            Verify OTP
          </Text>

        </TouchableOpacity>

        {/* RESEND */}

        <TouchableOpacity
          activeOpacity={0.8}
        >

          <Text style={styles.resend}>
            Resend OTP
          </Text>

        </TouchableOpacity>

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

    logoWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,

      borderWidth: 1,

      borderColor:
        "rgba(0,149,255,0.14)",

      justifyContent: "center",
      alignItems: "center",

      marginBottom: 34,

      backgroundColor:
        "rgba(7,18,38,0.35)",
    },

    logo: {
      width: 82,
      height: 82,
      borderRadius: 41,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: "800",
      marginBottom: 10,
    },

    subtitle: {
      color: "#7FA9D9",
      fontSize: 15,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 42,
    },

    otpRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 34,
},

    otpBox: {
      width: 52,
      height: 62,

      borderRadius: 18,

      backgroundColor:
        "rgba(15,23,42,0.95)",

      borderWidth: 1,

      borderColor:
        "rgba(148,163,184,0.08)",

      textAlign: "center",

      color: "#FFFFFF",

      fontSize: 24,

      fontWeight: "700",
    },

    button: {
      width: "100%",
      height: 64,

      borderRadius: 22,

      backgroundColor:
        COLORS.primary,

      justifyContent: "center",
      alignItems: "center",

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

    resend: {
      color: "#7FA9D9",
      fontSize: 14,
      fontWeight: "600",
      marginTop: 28,
    },
  });