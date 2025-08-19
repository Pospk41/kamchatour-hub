import * as ExpoLocation from 'expo-location';
import { Coordinates, LocationData } from '../contexts/LocationContext';

export const getCurrentLocation = async (): Promise<LocationData> => {
  const position = await ExpoLocation.getCurrentPositionAsync({
    accuracy: ExpoLocation.Accuracy.High,
  });

  return {
    coordinates: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy ?? undefined,
      altitude: position.coords.altitude ?? undefined,
      heading: position.coords.heading ?? undefined,
      speed: position.coords.speed ?? undefined,
    },
    timestamp: position.timestamp,
  };
};

export const reverseGeocode = async (coordinates: Coordinates): Promise<string | null> => {
  const results = await ExpoLocation.reverseGeocodeAsync({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  });

  if (!results.length) return null;
  const r = results[0];
  const parts = [r.street, r.district, r.city, r.region, r.country].filter(Boolean);
  return parts.join(', ');
};

export const requestPermissions = async (): Promise<boolean> => {
  const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
  return status === 'granted';
};

