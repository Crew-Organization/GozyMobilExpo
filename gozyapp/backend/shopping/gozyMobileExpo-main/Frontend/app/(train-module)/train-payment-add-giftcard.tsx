import { useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainPaymentAddGiftCardScreen() {
  const [showLink, setShowLink] = useState(false);
  const [showEpay, setShowEpay] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons color="#6B7280" name="arrow-left" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Add Gift Card</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add using gift card number</Text>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons color="#A3A3A3" name="card-text-outline" size={22} />
              <TextInput placeholder="ENTER 16-DIGIT GC NUMBER" placeholderTextColor="#4B5563" style={styles.input} />
            </View>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons color="#A3A3A3" name="lock-outline" size={22} />
              <TextInput placeholder="ENTER 6 DIGIT GC PIN" placeholderTextColor="#4B5563" style={styles.input} />
            </View>

            <Pressable onPress={() => setShowLink((current) => !current)} style={styles.accordionRow}>
              <View>
                <Text style={styles.accordionTitle}>Or add using link</Text>
                <Text style={styles.accordionCaption}>Copy paste or enter the link here</Text>
              </View>
              <MaterialCommunityIcons color="#1697F6" name={showLink ? 'chevron-up' : 'chevron-down'} size={22} />
            </Pressable>
            {showLink ? (
              <View style={styles.inputBox}>
                <MaterialCommunityIcons color="#A3A3A3" name="link-variant" size={22} />
                <TextInput placeholder="ENTER GIFT CARD LINK" placeholderTextColor="#4B5563" style={styles.input} />
              </View>
            ) : null}

            <Pressable onPress={() => setShowEpay((current) => !current)} style={[styles.accordionRow, styles.accordionRowLast]}>
              <Text style={styles.accordionTitle}>Add MMT e-Pay gift card</Text>
              <MaterialCommunityIcons color="#1697F6" name={showEpay ? 'chevron-up' : 'chevron-down'} size={22} />
            </Pressable>
            {showEpay ? (
              <View style={styles.inputBox}>
                <MaterialCommunityIcons color="#A3A3A3" name="gift-outline" size={22} />
                <TextInput placeholder="ENTER MMT e-PAY CODE" placeholderTextColor="#4B5563" style={styles.input} />
              </View>
            ) : null}
          </View>

          <Text style={styles.footnote}>
            Once added, you will only be able to use this gift card with a single account and use your linked cards directly on the payments page.
          </Text>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable style={styles.disabledButton}>
            <Text style={styles.disabledText}>ADD TO MY ACCOUNT</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 64,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 19,
    fontWeight: '500',
    color: '#374151',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  inputBox: {
    height: 58,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  accordionRow: {
    minHeight: 74,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  accordionRowLast: {
    borderBottomWidth: 0,
  },
  accordionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  accordionCaption: {
    marginTop: 3,
    fontSize: 12,
    color: '#111827',
  },
  footnote: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },
  disabledButton: {
    height: 54,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
