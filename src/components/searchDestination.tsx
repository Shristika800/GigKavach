import React from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesTextInput } from "react-native-google-places-textinput";

type Place = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

type Props = {
  onPlaceSelected: (place: Place) => void;
};

export default function SearchDestination({
  onPlaceSelected,
}: Props) {
  return (
    <View style={styles.container}>
      <GooglePlacesTextInput
        apiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        placeHolder="Search destination"
        onPlaceSelect={(place) => {
          const location = place.details?.location;

          if (!location) {
            return;
          }

          onPlaceSelected({
            name:
              place.details?.displayName?.text ||
              place.mainText ||
              "Selected destination",

            address:
              place.details?.formattedAddress ||
              place.description ||
              "",

            latitude: location.latitude,
            longitude: location.longitude,
          });
        }}
        style={{
          input: styles.input,
          suggestionsContainer: styles.suggestionsContainer,
          suggestionItem: styles.suggestionItem,
          suggestionText: styles.suggestionText,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 100,
  },

  input: {
    height: 60,
    backgroundColor: "#0F172A",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.08)",
    color: "#FFFFFF",
    fontSize: 16,
    paddingHorizontal: 18,
  },

  suggestionsContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    marginTop: 6,
    overflow: "hidden",
  },

  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.08)",
  },

  suggestionText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
});