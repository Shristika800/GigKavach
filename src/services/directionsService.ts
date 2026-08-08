import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function getDirections(
  origin: string,
  destination: string
) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin,
          destination,
          alternatives: true,
          key: API_KEY,
        },
      }
    );

    return response.data.routes;
  } catch (error) {
    console.log("Directions Error:", error);
    return [];
  }
}