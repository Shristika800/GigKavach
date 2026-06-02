import React, {
  useEffect,
  useRef,
} from "react";

import {View, Text,  StyleSheet,  StatusBar,  Animated, Image,  Easing} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { COLORS }
from "../constants/colors";

import { supabase } from "../lib/supabase";

export default function SplashScreen({
  navigation,
}: any) {

  const scaleAnim =
    useRef(
      new Animated.Value(0.72)
    ).current;

  const opacityAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const translateAnim =
    useRef(
      new Animated.Value(30)
    ).current;


    
 useEffect(() => {

  Animated.parallel([

    Animated.timing(
      scaleAnim,
      {
        toValue: 1,
        duration: 1300,
        easing:
          Easing.out(
            Easing.exp
          ),
        useNativeDriver: true,
      }
    ),

    Animated.timing(
      opacityAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ),

    Animated.timing(
      translateAnim,
      {
        toValue: 0,
        duration: 1200,
        easing:
          Easing.out(
            Easing.exp
          ),
        useNativeDriver: true,
      }
    ),

  ]).start();

  const timer =
    setTimeout(
      async () => {

        const phone =
          await AsyncStorage.getItem(
            "userPhone"
          );

        if (phone) {

          navigation.replace(
            "Dashboard",
            { phone }
          );

        } else {

          navigation.replace(
            "Login"
          );
        }

      },
      5000
    );

  return () =>
    clearTimeout(timer);

}, []);

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#020617"
      />

      <View style={styles.topGlow} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [
              {
                scale: scaleAnim,
              },
              {
                translateY:
                  translateAnim,
              },
            ],
          },
        ]}
      >

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

        {/* APP NAME */}

        <Text style={styles.appName}>
GigKavach
</Text>

        {/* TAGLINE */}

        <Text style={styles.tagline}>
          YOUR PROTECTION IS
           </Text>
          <Text style={styles.taglineAccent}>
          OUR PRIORITY.
       </Text>

      </Animated.View>

      {/* FOOTER */}

      <Text style={styles.footer}>
        Initializing secure systems...
      </Text>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#020617",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },

    topGlow: {
      position: "absolute",
      top: -260,
      width: 650,
      height: 650,
      borderRadius: 325,
      backgroundColor:
        "#0B4D85",
      opacity: 0.18,
    },

    content: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 40,
    },

    outerRing: {
      width: 170,
      height: 170,
      borderRadius: 85,
      borderWidth: 1,
      borderColor:
        "rgba(0,149,255,0.12)",

      justifyContent: "center",
      alignItems: "center",

      marginBottom: 38,

    },

    innerRing: {
      width: 142,
      height: 142,
      borderRadius: 71,

      borderWidth: 1.5,

      borderColor:
        "rgba(0,149,255,0.35)",

      justifyContent: "center",
      alignItems: "center",

      backgroundColor:
        "rgba(7,18,38,0.45)",
    },

    logoImage: {
      width: 96,
      height: 96,
      borderRadius: 48,
    },

    appName: {
      fontSize: 52,
      fontWeight: "900",
      color: "#FFFFFF",

      letterSpacing: 9,

      marginBottom: 16,

      textShadowColor:
        "rgba(15,76,129,0.45)",

      textShadowOffset: {
        width: 0,
        height: 0,
      },

      textShadowRadius: 14,
    },

    tagline: {
      fontSize: 14,
      color: "#7FA9D9",

      letterSpacing: 5,

      textAlign: "center",

      lineHeight: 28,

      fontWeight: "500",
    },

    taglineAccent: { fontSize: 14,
      color: "#ff7818",

      letterSpacing: 5,

      textAlign: "center",

      lineHeight: 28,

      fontWeight: "500", 
    },
    
    footer: {
      position: "absolute",
      bottom: 52,

      color: "#49617D",

      fontSize: 11,

      letterSpacing: 2,
    },
  });