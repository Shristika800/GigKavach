import React, { useState,} from "react";

import {View,Text,StyleSheet, ScrollView,TouchableOpacity,TextInput, Alert, Image,} from "react-native";

import * as ImagePicker from "expo-image-picker";

import DateTimePicker from "@react-native-community/datetimepicker";

import { supabase } from "../lib/supabase";

import { COLORS } from "../constants/colors";

export default function WorkerDetailsScreen({
  navigation,
  route,
}: any) {



  const {
    email,
    fullName,
  } = route.params || {};



  const [
    dlNumber,
    setDlNumber,
  ] = useState("");

  const [
    aadhaar,
    setAadhaar,
  ] = useState("");

  const [
    workerType,
    setWorkerType,
  ] = useState("");

  const [
    vehicleType,
    setVehicleType,
  ] = useState("");

  const [
    dob,
    setDob,
  ] = useState("");



  

  const [
    dlImage,
    setDlImage,
  ] = useState<any>(null);

  const [
    aadhaarImage,
    setAadhaarImage,
  ] = useState<any>(null);

  const [
    saving,
    setSaving,
  ] = useState(false);

  /* Date Picker */

  const [
    showDatePicker,
    setShowDatePicker,
  ] = useState(false);

  const onDateChange =
    (_: any, selectedDate: any) => {

      setShowDatePicker(false);

      if (selectedDate) {

        const day =
          String(
            selectedDate.getDate()
          ).padStart(2, "0");

        const month =
          String(
            selectedDate.getMonth() + 1
          ).padStart(2, "0");

        const year =
          selectedDate.getFullYear();

        setDob(
          `${day}-${month}-${year}`
        );
      }
    };

  /* ------------------------------------------------ */
  /* DL IMAGE UPLOAD                                  */
  /* ------------------------------------------------ */

  const uploadDL =
    async () => {

      try {

        const result =
          await ImagePicker
            .launchImageLibraryAsync({

              mediaTypes:
                ImagePicker
                  .MediaTypeOptions
                  .Images,

              quality: 0.8,
            });

        if (!result.canceled) {

          setDlImage(
            result.assets[0]
          );
        }

      } catch {

        Alert.alert(
          "Upload Failed",
          "Unable to upload DL image."
        );
      }
    };

  /* ------------------------------------------------ */
  /* AADHAAR IMAGE UPLOAD                             */
  /* ------------------------------------------------ */

  const uploadAadhaar =
    async () => {

      try {

        const result =
          await ImagePicker
            .launchImageLibraryAsync({

              mediaTypes:
                ImagePicker
                  .MediaTypeOptions
                  .Images,

              quality: 0.8,
            });

        if (!result.canceled) {

          setAadhaarImage(
            result.assets[0]
          );
        }

      } catch {

        Alert.alert(
          "Upload Failed",
          "Unable to upload Aadhaar image."
        );
      }
    };

  /* ------------------------------------------------ */
  /* SAVE PROFILE                                     */
  /* ------------------------------------------------ */

  const saveWorker =
    async () => {

      if (
        !dlNumber
        ||
        !aadhaar
        ||
        !dob
      ) {

        Alert.alert(
          "Incomplete Details",
          "Please complete all required fields."
        );

        return;
      }

const dobRegex =
  /^\d{2}-\d{2}-\d{4}$/;

if (!dobRegex.test(dob)) {

  Alert.alert(
    "Invalid DOB",
    "Please select your date of birth."
  );

  return;
}

const [day, month, year] =
  dob.split("-").map(Number);

const today = new Date();

let age =
  today.getFullYear() - year;

const monthDiff =
  today.getMonth() - (month - 1);

if (
  monthDiff < 0 ||
  (monthDiff === 0 &&
    today.getDate() < day)
) {
  age--;
}

if (age < 18) {

  Alert.alert(
    "Invalid DOB",
    "User must be at least 18 years old."
  );

  return;
}

      if (saving) return;

      setSaving(true);

      try {

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {

          Alert.alert(
            "Session Error",
            "Please log in again."
          );

          setSaving(false);

          return;
        }

        /* backfill dob (and email/name if missing) on users row */

        const { error: userUpdateError } = await supabase
          .from("users")
          .update({
            dob,
            full_name: fullName || undefined,
            email: email || undefined,
          })
          .eq("uuid", user.id);

        if (userUpdateError) {

          Alert.alert(
            "Registration Failed",
            userUpdateError.message
          );

          setSaving(false);

          return;
        }

        /* insert/update workers row */

        const { error: workerError } = await supabase
          .from("workers")
          .upsert({
            user_id: user.id,
            dl_number: dlNumber,
            aadhaar,
            worker_type: workerType || null,
            vehicle_type: vehicleType || null,
          });

        if (workerError) {

          Alert.alert(
            "Registration Failed",
            workerError.message
          );

          setSaving(false);

          return;
        }

        setSaving(false);

        navigation.navigate(
          "EmergencyContact",
          {
            userId: user.id,
          }
        );

      } catch {

        setSaving(false);

        Alert.alert(
          "Error",
          "Unable to save profile."
        );
      }
    };

  return (

    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 140,
        }}
      >

        <View style={styles.content}>

          

          <Text style={styles.title}>
            Profile Setup
          </Text>

          <Text style={styles.subtitle}>
            Registered as {fullName}
          </Text>

          <Text style={styles.phone}>
            {email}
          </Text>

          

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>
              Identity Verification
            </Text>

            {/* DL NUMBER */}

            <Text style={styles.label}>
              Driving License Number
            </Text>

            <TextInput
              placeholder="Enter DL Number"
              placeholderTextColor="#64748B"
              value={dlNumber}
              onChangeText={setDlNumber}
              style={styles.input}
            />

            {/* DL IMAGE */}

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={uploadDL}
            >

              <Text style={styles.uploadButtonText}>
                {dlImage
                  ? "DL Uploaded"
                  : "Upload Driving License"}
              </Text>

            </TouchableOpacity>

            {dlImage && (

              <Image
                source={{
                  uri:
                    dlImage.uri,
                }}
                style={styles.preview}
              />
            )}

            {/* AADHAAR NUMBER */}

            <Text style={styles.label}>
              Aadhaar Number
            </Text>

            <TextInput
              placeholder="Enter Aadhaar Number"
              placeholderTextColor="#64748B"
              value={aadhaar}
              onChangeText={setAadhaar}
              keyboardType="number-pad"
              style={styles.input}
            />

            {/* AADHAAR IMAGE */}

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={uploadAadhaar}
            >

              <Text style={styles.uploadButtonText}>
                {aadhaarImage
                  ? "Aadhaar Uploaded"
                  : "Upload Aadhaar Card"}
              </Text>

            </TouchableOpacity>

            {aadhaarImage && (

              <Image
                source={{
                  uri:
                    aadhaarImage.uri,
                }}
                style={styles.preview}
              />
            )}

            {/* WORKER TYPE */}

            <Text style={styles.label}>
              Worker Type
            </Text>

            <TextInput
              placeholder="e.g. Delivery, Cab Driver"
              placeholderTextColor="#64748B"
              value={workerType}
              onChangeText={setWorkerType}
              style={styles.input}
            />

            {/* VEHICLE TYPE */}

            <Text style={styles.label}>
              Vehicle Type
            </Text>

            <TextInput
              placeholder="e.g. Bike, Car, Auto"
              placeholderTextColor="#64748B"
              value={vehicleType}
              onChangeText={setVehicleType}
              style={styles.input}
            />

            {/* DOB */}

            <Text style={styles.label}>
              Date of Birth
            </Text>

            <TouchableOpacity
              style={styles.dateInput}
              onPress={() =>
                setShowDatePicker(
                  true
                )
              }
            >

              <Text
                style={{
                  color: dob
                    ? "#FFFFFF"
                    : "#64748B",
                }}
              >

                {dob || "DD-MM-YYYY"}

              </Text>

            </TouchableOpacity>

            {showDatePicker && (

              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                maximumDate={
                  new Date()
                }
                onChange={onDateChange}
              />
            )}

          </View>

          

  
        </View>

      </ScrollView>

      {/* BOTTOM CTA */}

      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={[
            styles.button,
            saving && { opacity: 0.6 },
          ]}
          onPress={saveWorker}
          disabled={saving}
        >

          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Complete Setup"}
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#020617",
    },

    content: {
      padding: 16,
      paddingTop: 60,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 32,
      fontWeight: "800",
      marginBottom: 6,
    },

    subtitle: {
      color: "#7DD3FC",
      fontSize: 15,
      fontWeight: "600",
    },

    phone: {
      color: "#94A3B8",
      fontSize: 14,
      marginTop: 6,
      marginBottom: 14,
    },

    card: {
      backgroundColor: "#0F172A",
      borderRadius: 28,
      padding: 22,
      marginBottom: 22,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.05)",
    },

    sectionTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 22,
    },

    label: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 10,
      marginTop: 6,
    },

    input: {
      height: 58,
      borderRadius: 18,
      backgroundColor: "#020617",
      paddingHorizontal: 18,
      color: "#FFFFFF",
      marginBottom: 18,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.04)",
    },

    dateInput: {
      height: 58,
      borderRadius: 18,
      backgroundColor: "#020617",
      justifyContent: "center",
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.04)",
      marginBottom: 12,
    },

    uploadButton: {
      height: 54,
      borderRadius: 18,
      backgroundColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 18,
    },

    uploadButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    preview: {
      width: "100%",
      height: 180,
      borderRadius: 18,
      marginBottom: 18,
    },

    bottomBar: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: 24,
      backgroundColor: "#020617",
    },

    button: {
      height: 64,
      borderRadius: 22,
      backgroundColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "800",
    },
  });