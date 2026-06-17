import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import type { GovtBusOperator } from '@/src/lib/govt-bus-operators';

type GovtBusCardProps = {
  bus: GovtBusOperator;
};

export function GovtBusCard({ bus }: GovtBusCardProps) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/govt-bus/[operatorId]',
          params: { operatorId: bus.id },
        })
      }
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <LinearGradient
        colors={bus.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.badge}>
          <MaterialCommunityIcons name="shield-check" size={11} color="#FFFFFF" />
          <Text style={styles.badgeText}>Govt.</Text>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <View style={styles.logoShell}>
          <Image source={bus.logo} style={styles.logo} contentFit="contain" />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {bus.name}
        </Text>
        <Text style={styles.state} numberOfLines={2}>
          {bus.state}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 118,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6ECF2',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  header: {
    height: 34,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 6,
  },
  logoShell: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logo: {
    width: 58,
    height: 58,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: '#191919',
    textAlign: 'center',
  },
  state: {
    minHeight: 24,
    fontSize: 10,
    fontWeight: '600',
    color: '#7B8592',
    textAlign: 'center',
    lineHeight: 12,
  },
});
