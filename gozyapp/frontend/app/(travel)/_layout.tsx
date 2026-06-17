import { Stack } from 'expo-router';

export default function TravelLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="travel" />
      <Stack.Screen name="travel-results" />
      <Stack.Screen name="travel-review" />
      <Stack.Screen name="travel-payment" />
      <Stack.Screen name="travel-confirmation" />
    </Stack>
  );
}
