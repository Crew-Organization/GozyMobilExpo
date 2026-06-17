import { View, Pressable, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.tab}
        onPress={() => router.push('/')}
      >
        <MaterialCommunityIcons
          name="home-outline"
          size={24}
          color={'#111'}
        />
        <Text style={[styles.label, { color: '#111' }]}>
          Home
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
