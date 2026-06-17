import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HotelRulesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Property Rules & Information</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Must read</Text>
          <View style={styles.ruleRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ruleText}>Primary Guest should be at least 18 years of age.</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ruleText}>Groups with only male guests are allowed at the property.</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ruleText}>Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Guest Profile</Text>
          <View style={styles.ruleRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ruleText}>Unmarried couples allowed.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cancellation Policy</Text>
          <Text style={styles.ruleText}>Free cancellation until 24 hours before check-in. Any cancellation received within 24 hours prior to arrival will incur the first 1 night charge.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Property Policy</Text>
          <Text style={styles.ruleText}>According to government regulations, a valid Photo ID has to be carried by every person above the age of 18 staying at the hotel.</Text>
        </View>
        
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  backBtn: { padding: 4, marginRight: 16 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#333' },

  content: { flex: 1, paddingVertical: 16 },
  card: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 12 },
  ruleRow: { flexDirection: 'row', marginBottom: 8 },
  bullet: { fontSize: 13, color: '#333', marginRight: 8 },
  ruleText: { fontSize: 12, color: '#333', flex: 1, lineHeight: 18 },
});
