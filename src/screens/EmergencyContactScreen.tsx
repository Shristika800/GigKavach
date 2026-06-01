import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase";

import { COLORS } from "../constants/colors";

const RELATIONS = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Spouse",
  "Friend",
  "Other",
];

export default function EmergencyContactScreen({
  navigation,
  route,
}: any) {
const { userId, phone } = route.params;
  const [contactName, setContactName] =
    useState("");

  const [contactPhone, setContactPhone] =
    useState("");

  const [relation, setRelation] =
    useState("Father");

  const [contacts, setContacts] =
    useState<any[]>([]);

  const phoneRegex =
    /^[6-9]\d{9}$/;

  const addContact = () => {
    if (contacts.length >= 5) {
      Alert.alert(
        "Maximum 5 contacts allowed"
      );
      return;
    }

    if (!contactName.trim()) {
      Alert.alert(
        "Enter contact name"
      );
      return;
    }

    if (
      !phoneRegex.test(
        contactPhone
      )
    ) {
      Alert.alert(
        "Invalid Number",
        "Enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    setContacts([
      ...contacts,
      {
        name: contactName,
        relation,
        phone: contactPhone,
      },
    ]);

    setContactName("");
    setContactPhone("");
    setRelation("Father");
  };

  const saveContacts =
    async () => {
      if (
        contacts.length < 1
      ) {
        Alert.alert(
          "Add at least 1 emergency contact"
        );
        return;
      }

      const { error } =
        await supabase
          .from(
            "emergency_contacts"
          )
          .insert(
            contacts.map(
              contact => ({
                user_id:
                  userId,
                contact_name:
                  contact.name,
                relation:
                  contact.relation,
                phone:
                  contact.phone,
              })
            )
          );

      if (error) {
        Alert.alert(
          "Error",
          error.message
        );
        return;
      }

  navigation.replace(
  "Dashboard",
  {
    phone,
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
      <Text style={styles.title}>
        Emergency Contacts
      </Text>

      <Text style={styles.subtitle}>
        Add at least one emergency
        contact. Maximum 5.
      </Text>

      <Text style={styles.label}>
        Contact Name
      </Text>


      <TextInput
        style={styles.input}
        value={contactName}
        onChangeText={
          setContactName
        }
        placeholder="Enter Name"
        placeholderTextColor="#5B6B81"
      />

      <Text style={styles.label}>
        Relation
      </Text>

      <View style={styles.chips}>
        {RELATIONS.map(item => (
          <TouchableOpacity
            key={item}
            style={[
  styles.chip,
  relation === item && {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
]}
            onPress={() =>
              setRelation(item)
            }
          >
            <Text
              style={
                styles.chipText
              }
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>
        Mobile Number
      </Text>

      <TextInput
        style={styles.input}
        value={contactPhone}
        onChangeText={
          setContactPhone
        }
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="10 Digit Mobile Number"
        placeholderTextColor="#5B6B81"
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={addContact}
      >
        <Text
          style={
            styles.buttonText
          }
        >
          Add Contact
        </Text>
      </TouchableOpacity>

      {contacts.map(
        (contact, index) => (
          <View
            key={index}
            style={styles.contactCard}
          >
            <Text
              style={
                styles.contactName
              }
            >
              {contact.name}
            </Text>

            <Text
              style={
                styles.contactInfo
              }
            >
              {
                contact.relation
              }{" "}
              •{" "}
              {
                contact.phone
              }
            </Text>
          </View>
        )
      )}

      <TouchableOpacity
        style={styles.continueButton}
        onPress={
          saveContacts
        }
      >
        <Text
          style={
            styles.buttonText
          }
        >
          Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 40,
  },

  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 20,
  },

  input: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  chipText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 18,
    marginTop: 24,
    alignItems: "center",
  },

  continueButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 18,
    marginTop: 30,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },

  contactCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  contactName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  contactInfo: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});