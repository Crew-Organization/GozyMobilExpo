import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/src/theme/tokens';

const eorsOffers = [
  { code: 'EORS200', desc: 'Get flat ₹200 off on first purchase above ₹999', terms: 'Applicable to new shoppers only' },
  { code: 'GOZYCB10', desc: 'Flat 10% cashback using Gozy Wallet Pay', terms: 'Max cashback up to ₹150' },
  { code: 'BOOKSTAYS', desc: 'Extra 12% off on select hotel stay vouchers', terms: 'Unlocked upon complete shopping checkout' },
];

export default function OffersScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Offers & Vouchers</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeading}>Exclusive EORS Deals</Text>
        
        {eorsOffers.map((offer, index) => (
          <View key={index} style={styles.offerCard}>
            <View style={styles.cardHeader}>
              <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{offer.code}</Text>
              </View>
              <Pressable style={styles.copyBtn}>
                <Text style={styles.copyBtnText}>APPLY</Text>
              </Pressable>
            </View>
            <Text style={styles.offerDesc}>{offer.desc}</Text>
            <Text style={styles.offerTerms}>* {offer.terms}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>Bank & Wallet Partnerships</Text>
        <View style={styles.bankCard}>
          <MaterialCommunityIcons name="credit-card-outline" size={24} color="#E53E3E" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bankTitle}>HDFC Bank Credit Cards</Text>
            <Text style={styles.bankDesc}>Flat 10% Instant Discount on min. purchase of ₹3,000</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  scrollContent: {
    padding: spacing.md,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  codeBadge: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#FF3F6C',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF5F7',
  },
  codeText: {
    color: '#FF3F6C',
    fontWeight: '900',
    fontSize: 12,
  },
  copyBtn: {
    backgroundColor: '#1F2937',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  copyBtnText: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '800',
  },
  offerDesc: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 16,
  },
  offerTerms: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 6,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: spacing.md,
  },
  bankTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  bankDesc: {
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 2,
  },
});
