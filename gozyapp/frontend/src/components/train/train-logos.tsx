import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type LogoProps = {
  size?: number;
};

export function OffersTagIcon({ size = 20 }: LogoProps) {
  return (
    <View style={[styles.circle, { width: size + 8, height: size + 8, backgroundColor: '#FFEBEF' }]}>
      <MaterialCommunityIcons color="#FF5A5F" name="tag-outline" size={size} />
    </View>
  );
}

export function IrctcLogoMark({ size = 36 }: LogoProps) {
  return (
    <View style={[styles.row, { gap: 4 }]}>
      <View style={[styles.circle, { width: size, height: size, backgroundColor: '#002E6E' }]}>
        <MaterialCommunityIcons color="#FFA726" name="train" size={size * 0.6} />
      </View>
      <View style={styles.textColumn}>
        <Text style={[styles.logoText, { fontSize: size * 0.35, color: '#002E6E', fontWeight: '900' }]}>IRCTC</Text>
        <Text style={[styles.subLogoText, { fontSize: size * 0.16, color: '#FF9100' }]}>Authorised Partner</Text>
      </View>
    </View>
  );
}

export function AadhaarLogoMark({ size = 44 }: LogoProps) {
  return (
    <View style={[styles.circle, { width: size, height: size, backgroundColor: '#FFF5F0', borderStyle: 'dotted', borderWidth: 1, borderColor: '#FF6D00' }]}>
      <MaterialCommunityIcons color="#E65100" name="fingerprint" size={size * 0.65} />
    </View>
  );
}

export function CanaraLogoMark({ size = 28 }: LogoProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.box, { width: size, height: size, backgroundColor: '#0084FF', borderRadius: 4 }]}>
        <MaterialCommunityIcons color="#FFE082" name="bank" size={size * 0.6} />
      </View>
      <Text style={[styles.logoText, { fontSize: size * 0.45, color: '#FFFFFF', fontWeight: '900', marginLeft: 6 }]}>
        canara
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textColumn: {
    justifyContent: 'center',
  },
  logoText: {
    letterSpacing: -0.2,
    lineHeight: 14,
  },
  subLogoText: {
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
});
