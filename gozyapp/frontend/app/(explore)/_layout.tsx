import { Tabs, router } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/src/theme/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: colors.canvas,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderRadius: 32,
        },
        tabBarLabelStyle: {
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="home-outline" size={24} />,
        }}
      />
      <Tabs.Screen
        name="reels"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/(reels)/reels');
          },
        }}
        options={{
          title: 'Reels',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="play-circle-outline" size={24} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="compass-outline" size={24} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/(chat)/chat');
          },
        }}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="chat-outline" size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="account-circle-outline" size={24} />,
        }}
      />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="sections" options={{ href: null }} />
      <Tabs.Screen name="wallet" options={{ href: null }} />
    </Tabs>
  );
}
