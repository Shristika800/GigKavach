import React, {useState, useEffect,} from "react";

import {Alert, View, Text,  StyleSheet,StatusBar, TextInput,TouchableOpacity, KeyboardAvoidingView, Platform,Image} from "react-native";

import { COLORS } from "../constants/colors";

import { supabase } from "../lib/supabase";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation,}: any) {


 useEffect(() => {async function testConnection() {
    console.log(
      "URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);

    const { data, error } = await supabase.auth.getSession();

    console.log("Session:", data);
    console.log("Error:", error);
  }

  testConnection();
}, []);

const [email, setEmail] = useState("");

const isValidEmail =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={ Platform.OS === "ios" ? "padding": undefined}
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
              source={require( "../assets/gigkavach_logo.png")}
              style={styles.logoImage}  resizeMode="contain"
            />

          </View>

        </View>

        {/* TITLE */}

        <Text style={styles.title}> Welcome to GigKavach </Text>

        <Text style={styles.subtitle}> Secure access for GigKavach workers</Text>

        {/* PHONE INPUT */}

        <View style={styles.inputWrapper}>

        <TextInput
       value={email}
       onChangeText={setEmail}
       placeholder="Enter your email"
       placeholderTextColor="#5B6B81"
       keyboardType="email-address"
       autoCapitalize="none"
       autoCorrect={false}
       style={styles.input}
        />

        </View>

        {/* BUTTON */}

        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!isValidEmail}
          style={[
            styles.button,

            !isValidEmail && {
              opacity: 0.45,
            },
          ]}
         onPress={async () => {

try { const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {shouldCreateUser: true,
    emailRedirectTo: undefined,
  },
});

  if (error) { Alert.alert("Error", error.message);
    return;
  }

  Alert.alert(
    "Check your email",
    "We've sent you a verification code."
  );

  navigation.navigate("OTP", { email,
  });
} catch (err) {  Alert.alert("Error", "Something went wrong.");
}
}}
        >

          <Text style={styles.buttonText}>  Continue </Text>

        </TouchableOpacity>

        {/* REGISTER */}

        <View style={styles.bottomRow}>

          <Text style={styles.bottomText}> New to GigKavach?  </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                "Register"
              )
            }
          >

            <Text style={styles.link}> Register </Text>

          </TouchableOpacity>

        </View>

      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

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
      fontSize: 24,
      fontWeight: "800",
marginLeft: 35,
      marginBottom: 10,

      letterSpacing: 0.5,
    },

    subtitle: {
      color: "#7FA9D9",
      fontSize: 10,

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

      marginBottom: 24,
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