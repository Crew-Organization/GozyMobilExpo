import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProvider } from '@/src/context/app-context';
import { colors } from '@/src/theme/tokens';

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.canvas,
      border: colors.line,
      card: colors.surface,
      primary: colors.sky,
      text: colors.text,
    },
  };

  return (
    <AppProvider>
      <ThemeProvider value={theme}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="assistant" />
          <Stack.Screen name="bookings" />
          <Stack.Screen name="cart" />
          <Stack.Screen name="entertainment" />
          <Stack.Screen name="event-booking" />
          <Stack.Screen name="event-confirmation" />
          <Stack.Screen name="food" />
          <Stack.Screen name="food-checkout" />
          <Stack.Screen name="food-restaurant" />
          <Stack.Screen name="food-tracking" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="product-detail" />
          <Stack.Screen name="sections" />
          <Stack.Screen name="shopping" />
          <Stack.Screen name="shopping-checkout" />
          <Stack.Screen name="shopping-tracking" />
          <Stack.Screen name="travel" />
          <Stack.Screen name="travel-confirmation" />
          <Stack.Screen name="travel-payment" />
          <Stack.Screen name="travel-results" />
          <Stack.Screen name="travel-review" />
          <Stack.Screen name="wallet" />
          <Stack.Screen name="wishlist" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </AppProvider>
  );
}
