import axios from "axios";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function getRoutes(origin: string, destination: string) {
  try {
    const url =
      "https://maps.googleapis.com/maps/api/directions/json";

    const response = await axios.get(url, {
      params: {
        origin,
        destination,
        alternatives: true,
        key: GOOGLE_API_KEY,
      },
    });

    return response.data.routes;
  } catch (error) {
    console.log(error);
    return [];
  }
}