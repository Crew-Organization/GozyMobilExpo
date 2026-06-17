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
          <Stack.Screen name="(chat)" />
          <Stack.Screen name="(reels)" />
          <Stack.Screen name="(bus-module)" />
          <Stack.Screen name="(travel)" />
          <Stack.Screen name="(movies)" />
          <Stack.Screen name="(shopping)" />
          <Stack.Screen name="(shopping-module)" />
          <Stack.Screen name="(food-module)" />
          <Stack.Screen name="(hotels)" />
          <Stack.Screen name="cart" />
          <Stack.Screen name="wallet" />
          <Stack.Screen name="wishlist" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </AppProvider>
  );
}
