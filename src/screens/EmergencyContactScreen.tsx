import React, {useState,} from "react";

import {View,Text,StyleSheet,ScrollView,TouchableOpacity,TextInput,Alert,StatusBar,KeyboardAvoidingView,Platform,} from "react-native";

import { supabase } from "../lib/supabase";

import { COLORS } from "../constants/colors";

type Contact = {
  contactName: string;
  relation: string;
  phone: string;
};

const emptyContact: Contact = {
  contactName: "",
  relation: "",
  phone: "",
};

export default function EmergencyContactScreen({
  navigation,
  route,
}: any) {

  const {
    userId,
  } = route.params || {};

  const [
    contacts,
    setContacts,
  ] = useState<Contact[]>([
    { ...emptyContact },
    { ...emptyContact },
  ]);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const updateContact = (
    index: number,
    field: keyof Contact,
    value: string,
  ) => {

    const updated = [...contacts];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setContacts(updated);
  };

  const addContact = () => {

    if (contacts.length >= 3) return;

    setContacts([
      ...contacts,
      { ...emptyContact },
    ]);
  };

  const removeContact = (index: number) => {

    // only the 3rd (optional) contact can be removed
    if (index < 2) return;

    setContacts(
      contacts.filter(
        (_, i) => i !== index
      )
    );
  };

  const isContactValid = (c: Contact) =>
    c.contactName.trim().length > 1
    &&
    c.relation.trim().length > 1
    &&
    /^[6-9]\d{9}$/.test(c.phone);

  // first 2 contacts are compulsory
  const requiredValid =
    isContactValid(contacts[0])
    &&
    isContactValid(contacts[1]);

  // if a 3rd contact was started, it must also be fully valid
  const optionalValid =
    contacts.length < 3
    ||
    isContactValid(contacts[2]);

  const isValid = requiredValid && optionalValid;

  const saveContacts =
    async () => {

      if (saving || !isValid) return;

      setSaving(true);

      try {

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const targetUserId =
          userId || user?.id;

        if (!targetUserId) {

          Alert.alert(
            "Session Error",
            "Please log in again."
          );

          setSaving(false);

          return;
        }

        // clear any existing contacts for this user first,
        // then insert the current set fresh

        const { error: deleteError } = await supabase
          .from("emergency_contacts")
          .delete()
          .eq("user_id", targetUserId);

        if (deleteError) {

          Alert.alert(
            "Error",
            deleteError.message
          );

          setSaving(false);

          return;
        }

       const rows = contacts.map(
  (c, index) => ({
    user_id: targetUserId,
    contact_order: index + 1,
    contact_name: c.contactName,
    relation: c.relation,
    phone: c.phone,
    is_primary: index === 0,
  })
);

        const { error: insertError } = await supabase
          .from("emergency_contacts")
          .insert(rows);

        if (insertError) {

          Alert.alert(
            "Error",
            insertError.message
          );

          setSaving(false);

          return;
        }

        setSaving(false);

        navigation.navigate(
          "Permissions",
          {
            userId: targetUserId,
          }
        );

      } catch {

        setSaving(false);

        Alert.alert(
          "Error",
          "Unable to save emergency contacts."
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 24,
          paddingTop: 60,
          paddingBottom: 140,
        }}
      >

        <Text style={styles.title}>
          Emergency Contacts
        </Text>

        <Text style={styles.subtitle}>
          Add at least 2 people we
          should notify in an emergency
        </Text>

        {contacts.map(
          (contact, index) => (

            <View
              key={index}
              style={styles.card}
            >

              <View style={styles.cardHeader}>

                <Text style={styles.cardTitle}>
                  {index === 0
                    ? "Primary Contact"
                    : index === 1
                    ? "Second Contact"
                    : "Third Contact (optional)"}
                </Text>

                {index >= 2 && (

                  <TouchableOpacity
                    onPress={() =>
                      removeContact(index)
                    }
                  >

                    <Text style={styles.removeText}>
                      Remove
                    </Text>

                  </TouchableOpacity>
                )}

              </View>

              <Text style={styles.label}>
                Contact Name
              </Text>

              <TextInput
                placeholder="Enter full name"
                placeholderTextColor="#64748B"
                value={contact.contactName}
                onChangeText={(v) =>
                  updateContact(index, "contactName", v)
                }
                style={styles.input}
              />

              <Text style={styles.label}>
                Relation
              </Text>

              <TextInput
                placeholder="e.g. Father, Spouse, Sibling"
                placeholderTextColor="#64748B"
                value={contact.relation}
                onChangeText={(v) =>
                  updateContact(index, "relation", v)
                }
                style={styles.input}
              />

              <Text style={styles.label}>
                Contact Phone Number
              </Text>

              <TextInput
                placeholder="10-digit mobile number"
                placeholderTextColor="#64748B"
                value={contact.phone}
                onChangeText={(v) =>
                  updateContact(
                    index,
                    "phone",
                    v.replace(/[^0-9]/g, "")
                  )
                }
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.input}
              />

            </View>
          )
        )}

        {contacts.length < 3 && (

          <TouchableOpacity
            style={styles.addButton}
            onPress={addContact}
          >

            <Text style={styles.addButtonText}>
              + Add another contact
            </Text>

          </TouchableOpacity>
        )}

      </ScrollView>

      <View style={styles.bottomBar}>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.button,
            (!isValid || saving) && {
              opacity: 0.5,
            },
          ]}
          disabled={!isValid || saving}
          onPress={saveContacts}
        >

          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Continue"}
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
      marginBottom: 26,
    },

    card: {
      backgroundColor: "#0F172A",
      borderRadius: 28,
      padding: 22,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.05)",
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },

    cardTitle: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },

    removeText: {
      color: "#F87171",
      fontSize: 13,
      fontWeight: "600",
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

    addButton: {
      height: 54,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "rgba(0,149,255,0.35)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },

    addButtonText: {
      color: "#7FA9D9",
      fontSize: 15,
      fontWeight: "700",
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