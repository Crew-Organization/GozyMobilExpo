import { useState } from 'react';
import { router } from 'expo-router';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTrainSearchStore, type SavedPassenger } from '@/src/store/train-search-store';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal'
];

const COUNTRIES = [
  'Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa',
  'Andorra', 'Angola', 'Anguilla', 'India'
];

export default function TrainBookingScreen() {
  const { bookingSelection, setReviewBookingDraft, savedPassengers, addSavedPassenger, removeSavedPassenger } = useTrainSearchStore();
  
  const [irctcUsername, setIrctcUsername] = useState('nikshitha');
  const [travellers, setTravellers] = useState<SavedPassenger[]>(savedPassengers);
  const [showDetails, setShowDetails] = useState(false);
  const [refundOption, setRefundOption] = useState<'zero' | 'pay' | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [email, setEmail] = useState('nikshithavadthyavath@gmail.com');
  const [phone, setPhone] = useState('9347556415');
  const [gstEnabled, setGstEnabled] = useState(false);
  const [selectedState, setSelectedState] = useState('Telangana');
  
  // Modals state
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [tempUsernameInput, setTempUsernameInput] = useState('nikshitha');
  
  const [isTravellerModalVisible, setIsTravellerModalVisible] = useState(false);
  const [tName, setTName] = useState('');
  const [tAge, setTAge] = useState('');
  const [tGender, setTGender] = useState('Male');
  const [tBerth, setTBerth] = useState('No berth preference');
  const [tNationality, setTNationality] = useState('India');
  
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  
  const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);

  if (!bookingSelection) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No train selected.</Text>
          <Pressable onPress={() => router.back()} style={styles.backHomeButton}>
            <Text style={styles.backHomeText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { train, slot } = bookingSelection;

  const passengerCount = travellers.length || 1;
  const baseFare = slot.price * passengerCount;
  const finalCancellationFee = refundOption === 'zero' ? 320 * passengerCount : 0;
  const totalFare = baseFare + finalCancellationFee;

  const handleSaveTraveller = () => {
    if (!tName.trim() || !tAge.trim()) return;
    const newPassenger: SavedPassenger = {
      id: Math.random().toString(36).substring(2, 9),
      name: tName.trim(),
      age: tAge.trim(),
      gender: tGender,
      berth: tBerth,
    };
    addSavedPassenger(newPassenger);
    setTravellers([...travellers, newPassenger]);
    setTName(''); setTAge(''); setTGender('Male'); setTBerth('No berth preference'); setTNationality('India');
    setIsTravellerModalVisible(false);
  };

  const handleProceedToPayment = () => {
    if (refundOption === null) {
      setIsRefundModalVisible(true);
      return;
    }
    
    // Setup Draft and go to Review
    setReviewBookingDraft({
      id: 'draft-123',
      irctcUsername,
      routeTitle: `${train.departureStation} to ${train.arrivalStation}`,
      journeyDate: bookingSelection.journeyDate,
      email,
      phone,
      train,
      slot,
      passengers: travellers,
      baseFare,
      tripGuaranteeFee: 0,
      freeCancellationFee: finalCancellationFee,
      cancellationFee: finalCancellationFee,
      discountAmt: 0,
      totalPrice: totalFare,
      refundOption,
      addFreeCancel3x: false,
      add3xRefund: false,
      selectedPaymentMethod: null,
    });
    router.push('/train-review');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons color="#0F172A" name="arrow-left" size={24} />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Traveller Details</Text>
          <Text style={styles.headerSubtitle}>Bangalore To Ahmedabad | 24 Apr, Friday</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Train Card */}
        <View style={styles.card}>
          <View style={styles.trainTitleRow}>
            <Text style={styles.trainName}>{train.name}</Text>
            <Text style={styles.trainNumber}>#{train.number}</Text>
          </View>
          <View style={styles.trainSubRow}>
            <Text style={styles.trainClass}>{slot.className} | <Text style={{ color: '#F59E0B' }}>{slot.quotaLabel}</Text></Text>
            <Pressable onPress={() => setShowDetails(!showDetails)} style={styles.detailsToggle}>
              <Text style={styles.detailsToggleText}>{showDetails ? 'Hide Details' : 'View Details'}</Text>
              <MaterialCommunityIcons name={showDetails ? "chevron-up" : "chevron-down"} size={16} color="#0084FF" />
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.boardingRow}>
            <Text style={styles.boardingLabel}>Boarding{'\n'}Station</Text>
            <View style={styles.boardingInfo}>
              <Text style={styles.boardingStationText}>{train.departureStation}</Text>
              <Text style={styles.boardingTimeText}>{train.departureTime}, 24 Apr</Text>
            </View>
            <Pressable><Text style={styles.changeLink}>Change</Text></Pressable>
          </View>
        </View>

        {/* IRCTC Username */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>IRCTC Username</Text>
            <Text style={styles.blueLink}>Why is this required?</Text>
          </View>
          <Pressable onPress={() => setIsUsernameModalVisible(true)} style={styles.irctcInputBox}>
            <Text style={styles.inputLabelSmall}>USERNAME</Text>
            <Text style={[styles.inputValueText, !irctcUsername && { color: '#94A3B8' }]}>
              {irctcUsername || 'Please enter IRCTC username.'}
            </Text>
          </Pressable>
          <Text style={styles.blueLinkAction}>CREATE NEW IRCTC ACCOUNT</Text>
          <Text style={styles.blueLinkAction}>FORGOT USERNAME</Text>
        </View>

        {/* Login Banner */}
        <View style={styles.loginBannerCard}>
          <View style={styles.loginBannerIcon}><MaterialCommunityIcons name="account-circle-outline" size={24} color="#F59E0B" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.loginBannerTitle}>Login Now</Text>
            <Text style={styles.loginBannerSub}>To use your saved guest list</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#0084FF" />
        </View>

        {/* Traveller Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Traveller Details</Text>
          {travellers.length === 0 ? (
            <View style={styles.noTravellerNotice}>
              <Text style={styles.noTravellerText}>You do not have any saved travellers.</Text>
            </View>
          ) : (
            <View style={styles.travellerList}>
              {travellers.map((t) => (
                <View key={t.id} style={[styles.travellerRow, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}]}>
                  <View>
                    <Text style={styles.travellerRowName}>{t.name}, {t.age}</Text>
                    <Text style={styles.travellerRowMeta}>{t.gender} | {t.berth}</Text>
                  </View>
                  <View style={{flexDirection: 'row', gap: 16}}>
                    <Pressable onPress={() => Alert.alert('Edit Passenger', 'Feature coming soon.')}>
                       <MaterialCommunityIcons name="pencil-outline" size={20} color="#0084FF" />
                    </Pressable>
                    <Pressable onPress={() => removeSavedPassenger(t.id)}>
                       <MaterialCommunityIcons name="delete-outline" size={20} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
          <Pressable onPress={() => setIsTravellerModalVisible(true)} style={styles.addTravellerBtn}>
            <MaterialCommunityIcons name="plus" size={16} color="#0084FF" />
            <Text style={styles.addTravellerText}>TRAVELLER DETAILS</Text>
          </Pressable>
        </View>

        {/* Cancellation Protection */}
        <View style={styles.card}>
          <View style={styles.cancelProtectHeader}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#0084FF" />
            <Text style={styles.cancelProtectTitle}>Get Full Fare Refund on{'\n'}Cancellation</Text>
          </View>
          <View style={styles.cancelOptionsContainer}>
            <Pressable onPress={() => setRefundOption('zero')} style={[styles.radioOption, refundOption === 'zero' && styles.radioOptionSelected]}>
              <MaterialCommunityIcons name={refundOption === 'zero' ? "radiobox-marked" : "radiobox-blank"} size={20} color={refundOption === 'zero' ? "#0084FF" : "#CBD5E1"} />
              <View style={styles.radioOptionTextWrap}>
                <Text style={styles.radioOptionTitle}>Zero charges when the ticket is cancelled</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setRefundOption('pay')} style={[styles.radioOption, refundOption === 'pay' && styles.radioOptionSelected]}>
              <MaterialCommunityIcons name={refundOption === 'pay' ? "radiobox-marked" : "radiobox-blank"} size={20} color={refundOption === 'pay' ? "#0084FF" : "#CBD5E1"} />
              <View style={styles.radioOptionTextWrap}>
                <Text style={styles.radioOptionTitle}>Pay fees on cancellation</Text>
              </View>
            </Pressable>
          </View>
          <Text style={styles.termsText}>Terms & Conditions</Text>
        </View>

        {/* Offers & Discounts */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Offers & Discounts</Text>
          <View style={styles.couponInputRow}>
            <TextInput
              style={styles.couponTextInput}
              placeholder="Enter a coupon code"
              placeholderTextColor="#94A3B8"
              value={couponInput}
              onChangeText={setCouponInput}
            />
            <Text style={styles.couponApplyText}>Apply</Text>
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <View style={styles.inputOutlineBox}>
            <Text style={styles.inputOutlineLabel}>Email ID</Text>
            <TextInput style={styles.inputOutlineField} value={email} onChangeText={setEmail} placeholder="Eg. abc@gmail.com" />
          </View>
          <View style={styles.inputOutlineBox}>
            <Text style={styles.inputOutlineLabel}>Phone Number</Text>
            <TextInput style={styles.inputOutlineField} value={phone} onChangeText={setPhone} placeholder="Eg. 9111111111" keyboardType="numeric" />
          </View>
        </View>

        {/* GST Details */}
        <View style={styles.card}>
          <Pressable onPress={() => setGstEnabled(!gstEnabled)} style={styles.checkboxRow}>
            <MaterialCommunityIcons name={gstEnabled ? "checkbox-marked" : "checkbox-blank-outline"} size={22} color={gstEnabled ? "#0084FF" : "#CBD5E1"} />
            <Text style={styles.checkboxLabelBold}>Enter Gst Details <Text style={{ color: '#94A3B8', fontWeight: '400' }}>(Optional)</Text></Text>
          </Pressable>
          {gstEnabled && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.inputOutlineLabel}>Your State <MaterialCommunityIcons name="information-outline" size={12} /></Text>
              <Text style={{ fontSize: 10, color: '#94A3B8', marginBottom: 8 }}>Required for GST purpose on your tax invoice</Text>
              <Pressable onPress={() => setIsStateModalVisible(true)} style={styles.dropdownBox}>
                <View>
                  <Text style={styles.dropdownLabel}>State</Text>
                  <Text style={styles.dropdownValue}>{selectedState}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#94A3B8" />
              </Pressable>
            </View>
          )}
          <View style={[styles.checkboxRow, { marginTop: 16 }]}>
            <MaterialCommunityIcons name="checkbox-marked" size={22} color="#EF4444" />
            <Text style={styles.checkboxLabel}>Confirm and save these details to your profile</Text>
          </View>
        </View>

        <View style={styles.legalNoticeContainer}>
          <Text style={styles.legalNoticeText}>
            By proceeding, I confirm that I agree to the <Text style={styles.blueLink}>Cancellation Policy</Text>, <Text style={styles.blueLink}>Booking Policy</Text>, <Text style={styles.blueLink}>Privacy Policy</Text>, <Text style={styles.blueLink}>User Agreement</Text>, and <Text style={styles.blueLink}>Terms of Service</Text>.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>₹{totalFare}</Text>
          <Text style={{ fontSize: 10, color: '#8E8E93' }}>FOR {travellers.length} PASSENGERS</Text>
        </View>
        <Pressable onPress={handleProceedToPayment} style={styles.continueBtn}>
          <Text style={styles.proceedButtonText}>CONTINUE</Text>
        </Pressable>
      </View>

      {/* MODALS */}

      {/* IRCTC Username Modal */}
      <Modal visible={isUsernameModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsUsernameModalVisible(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitleText}>IRCTC Username</Text>
              <Pressable onPress={() => setIsUsernameModalVisible(false)}>
                <MaterialCommunityIcons name="close-circle" size={24} color="#94A3B8" />
              </Pressable>
            </View>
            <View style={styles.modalInputOutlineBox}>
              <Text style={styles.modalInputOutlineLabel}>IRCTC USERNAME</Text>
              <TextInput style={styles.modalInputOutlineField} value={tempUsernameInput} onChangeText={setTempUsernameInput} />
            </View>
            <View style={styles.validationRow}><MaterialCommunityIcons name="check-circle" size={16} color="#10B981" /><Text style={styles.validationText}>Username '{tempUsernameInput}' exists in IRCTC.</Text></View>
            <View style={styles.validationRow}><MaterialCommunityIcons name="check-circle" size={16} color="#10B981" /><Text style={styles.validationText}>Password is valid.</Text></View>
            <View style={styles.validationRow}><MaterialCommunityIcons name="check-circle" size={16} color="#10B981" /><Text style={styles.validationText}>IRCTC profile is complete.</Text></View>
            <View style={styles.infoBoxY}>
              <Text style={styles.infoBoxYText}>IRCTC password will be required after Payment. Please ensure you enter correct username.</Text>
            </View>
            <Pressable onPress={() => { setIrctcUsername(tempUsernameInput); setIsUsernameModalVisible(false); }} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>DONE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Traveller Details Modal */}
      <Modal visible={isTravellerModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsTravellerModalVisible(false)} />
          <View style={[styles.modalSheet, { height: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Pressable onPress={() => setIsTravellerModalVisible(false)}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
              </Pressable>
              <Text style={[styles.modalTitleText, { marginLeft: 16 }]}>Traveller Details</Text>
            </View>
            <ScrollView>
              <View style={styles.inputOutlineBox}>
                <Text style={styles.inputOutlineLabel}>Name</Text>
                <TextInput style={styles.inputOutlineField} value={tName} onChangeText={setTName} placeholder="Enter Full Name" />
              </View>
              <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
                <View style={[styles.inputOutlineBox, { flex: 0.4 }]}>
                  <Text style={styles.inputOutlineLabel}>Age</Text>
                  <TextInput style={styles.inputOutlineField} value={tAge} onChangeText={setTAge} placeholder="Enter age" keyboardType="numeric" />
                </View>
                <View style={{ flex: 0.6 }}>
                  <Text style={styles.inputOutlineLabel}>Gender</Text>
                  <View style={styles.genderTabs}>
                    {['Male', 'Female', 'Others'].map(g => (
                      <Pressable key={g} onPress={() => setTGender(g)} style={[styles.genderTab, tGender === g && styles.genderTabActive]}>
                        <Text style={[styles.genderTabText, tGender === g && styles.genderTabTextActive]}>{g}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitleModal}>Berth preference</Text>
              <Text style={styles.subtextModal}>Selecting a berth preference does not guarantee allotment of preferred berth.</Text>
              <View style={styles.radioGrid}>
                {['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'No berth preference'].map(b => (
                  <Pressable key={b} onPress={() => setTBerth(b)} style={styles.gridRadio}>
                    <MaterialCommunityIcons name={tBerth === b ? "radiobox-marked" : "radiobox-blank"} size={20} color={tBerth === b ? "#0084FF" : "#CBD5E1"} />
                    <Text style={styles.gridRadioText}>{b}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.sectionTitleModal}>Nationality</Text>
              <Pressable onPress={() => setIsCountryModalVisible(true)} style={styles.dropdownBox}>
                <View>
                  <Text style={styles.dropdownLabel}>Nationality</Text>
                  <Text style={styles.dropdownValue}>{tNationality}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#94A3B8" />
              </Pressable>
            </ScrollView>
            <View style={styles.saveBtnWrap}>
              <Pressable onPress={handleSaveTraveller} style={[styles.doneBtn, !tName || !tAge ? { backgroundColor: '#94A3B8' } : {}]}>
                <Text style={styles.doneBtnText}>SAVE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Select State Modal */}
      <Modal visible={isStateModalVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.fullModal}>
          <View style={styles.fullModalHeader}>
            <Pressable onPress={() => setIsStateModalVisible(false)}><MaterialCommunityIcons name="close" size={24} color="#0F172A" /></Pressable>
            <Text style={styles.fullModalTitle}>Select the State</Text>
          </View>
          <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} placeholder="Enter state" value={stateSearchQuery} onChangeText={setStateSearchQuery} />
            <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
          </View>
          <ScrollView>
            {INDIAN_STATES.filter(s => s.toLowerCase().includes(stateSearchQuery.toLowerCase())).map(s => (
              <Pressable key={s} onPress={() => { setSelectedState(s); setIsStateModalVisible(false); }} style={styles.listItem}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#64748B" />
                <Text style={styles.listItemText}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Select Country Modal */}
      <Modal visible={isCountryModalVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.fullModal}>
          <View style={styles.fullModalHeader}>
            <Pressable onPress={() => setIsCountryModalVisible(false)}><MaterialCommunityIcons name="close" size={24} color="#0F172A" /></Pressable>
            <Text style={styles.fullModalTitle}>Select Country</Text>
          </View>
          <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} placeholder="Enter country" value={countrySearchQuery} onChangeText={setCountrySearchQuery} />
            <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
          </View>
          <ScrollView>
            {COUNTRIES.filter(c => c.toLowerCase().includes(countrySearchQuery.toLowerCase())).map(c => (
              <Pressable key={c} onPress={() => { setTNationality(c); setIsCountryModalVisible(false); }} style={styles.listItem}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#64748B" />
                <Text style={styles.listItemText}>{c}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Refund Options Nudge Modal */}
      <Modal visible={isRefundModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsRefundModalVisible(false)} />
          <View style={[styles.modalSheet, { padding: 0 }]}>
            <View style={styles.refundModalHeader}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#0084FF" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.refundModalTitle}>Get full refund on cancellation</Text>
                <Text style={styles.refundModalSub}>Guaranteed refund Trusted by 3 Lakh+ users</Text>
              </View>
            </View>
            <View style={styles.refundModalBanner}>
              <Text style={styles.refundModalBannerText}>Cancel your Train bookings for FREE with Free Cancellation</Text>
            </View>
            <View style={styles.refundModalBody}>
              <Text style={styles.refundApproxText}><MaterialCommunityIcons name="check-circle" size={16} color="#10B981" /> Approx Refund: ₹ 3885/person</Text>
              <Text style={styles.refundBullet}><MaterialCommunityIcons name="check" size={14} color="#10B981" /> Enjoy ZERO IRCTC penalty</Text>
              <Text style={styles.refundBullet}><MaterialCommunityIcons name="check" size={14} color="#10B981" /> Get FULL Ticket Fare Refund</Text>
              <Text style={styles.refundBullet}><MaterialCommunityIcons name="check" size={14} color="#10B981" /> Automatic waiver on your cancellation</Text>
              <Text style={styles.refundBullet}><MaterialCommunityIcons name="check" size={14} color="#10B981" /> Instant refund to your original pay mode</Text>
            </View>
            <View style={styles.refundModalFooter}>
              <Pressable onPress={() => { setRefundOption('zero'); setIsRefundModalVisible(false); handleProceedToPayment(); }} style={styles.buyRefundBtn}>
                <Text style={styles.buyRefundBtnText}>Buy Free Cancellation @ ₹320/person</Text>
              </Pressable>
              <Pressable onPress={() => { setRefundOption('pay'); setIsRefundModalVisible(false); handleProceedToPayment(); }} style={styles.skipRefundBtn}>
                <Text style={styles.skipRefundBtnText}>Skip Free Cancellation</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backButton: { marginRight: 12 },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  scrollContent: { paddingBottom: 100 },
  card: { backgroundColor: '#FFF', marginVertical: 4, padding: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E2E8F0' },
  
  trainTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  trainName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  trainNumber: { fontSize: 13, color: '#64748B' },
  trainSubRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  trainClass: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  detailsToggle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailsToggleText: { fontSize: 12, fontWeight: '600', color: '#0084FF' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  boardingRow: { flexDirection: 'row', alignItems: 'center' },
  boardingLabel: { fontSize: 12, fontWeight: '600', color: '#0F172A', width: 70 },
  boardingInfo: { flex: 1, paddingHorizontal: 12 },
  boardingStationText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  boardingTimeText: { fontSize: 12, color: '#64748B', marginTop: 4 },
  changeLink: { fontSize: 13, fontWeight: '600', color: '#0084FF' },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  blueLink: { fontSize: 12, fontWeight: '600', color: '#0084FF' },
  irctcInputBox: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 4, padding: 12, marginBottom: 12, backgroundColor: '#F8FAFC' },
  inputLabelSmall: { fontSize: 10, color: '#64748B', marginBottom: 4 },
  inputValueText: { fontSize: 13, color: '#0F172A' },
  blueLinkAction: { fontSize: 12, fontWeight: '700', color: '#0084FF', marginVertical: 6 },

  loginBannerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', margin: 16, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FEF3C7' },
  loginBannerIcon: { marginRight: 12 },
  loginBannerTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  loginBannerSub: { fontSize: 12, color: '#64748B' },

  noTravellerNotice: { backgroundColor: '#FFFBEB', padding: 12, borderRadius: 4, marginTop: 8, marginBottom: 16 },
  noTravellerText: { fontSize: 12, color: '#D97706' },
  travellerList: { gap: 12, marginTop: 8, marginBottom: 16 },
  travellerRow: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12 },
  travellerRowName: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  travellerRowMeta: { fontSize: 12, color: '#64748B', marginTop: 4 },
  addTravellerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addTravellerText: { fontSize: 13, fontWeight: '700', color: '#0084FF' },

  cancelProtectHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cancelProtectTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  cancelOptionsContainer: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden' },
  radioOption: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  radioOptionSelected: { backgroundColor: '#F8FAFC' },
  radioOptionTextWrap: { marginLeft: 12 },
  radioOptionTitle: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  termsText: { fontSize: 12, fontWeight: '600', color: '#0084FF', marginTop: 16 },

  couponInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, marginTop: 12 },
  couponTextInput: { flex: 1, paddingVertical: 12, fontSize: 13, color: '#0F172A' },
  couponApplyText: { fontSize: 13, fontWeight: '700', color: '#0084FF' },

  inputOutlineBox: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4, marginTop: 12 },
  inputOutlineLabel: { fontSize: 10, color: '#64748B' },
  inputOutlineField: { fontSize: 13, color: '#0F172A', padding: 0, margin: 0, marginTop: 4, height: 24 },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkboxLabelBold: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  checkboxLabel: { fontSize: 12, color: '#475569', flex: 1 },
  
  dropdownBox: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' },
  dropdownLabel: { fontSize: 10, color: '#64748B' },
  dropdownValue: { fontSize: 13, color: '#0F172A', marginTop: 2 },

  legalNoticeContainer: { padding: 16, marginBottom: 24 },
  legalNoticeText: { fontSize: 12, color: '#64748B', lineHeight: 18, textAlign: 'center' },

  warningBox: { backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'flex-start', margin: 16 },
  
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  continueBtn: { backgroundColor: '#0084FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  proceedButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  backHomeButton: { marginTop: 16, padding: 12, backgroundColor: '#0084FF', borderRadius: 8 },
  backHomeText: { color: '#FFF', fontWeight: '700' },

  // Modals Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  modalTitleText: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  modalInputOutlineBox: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4, marginBottom: 16 },
  modalInputOutlineLabel: { fontSize: 10, color: '#64748B' },
  modalInputOutlineField: { fontSize: 13, color: '#0F172A', padding: 0, margin: 0, marginTop: 4, height: 24 },
  validationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  validationText: { fontSize: 12, color: '#0F172A' },
  infoBoxY: { backgroundColor: '#FEF3C7', padding: 12, borderRadius: 4, marginTop: 16 },
  infoBoxYText: { fontSize: 12, color: '#D97706' },
  doneBtn: { backgroundColor: '#0084FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  doneBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },

  genderTabs: { flexDirection: 'row', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', marginTop: 4 },
  genderTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E2E8F0' },
  genderTabActive: { backgroundColor: '#EFF6FF' },
  genderTabText: { fontSize: 12, color: '#64748B' },
  genderTabTextActive: { color: '#0084FF', fontWeight: '600' },
  
  sectionTitleModal: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 24, marginBottom: 4 },
  subtextModal: { fontSize: 12, color: '#94A3B8', marginBottom: 16 },
  radioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridRadio: { width: '45%', flexDirection: 'row', alignItems: 'center', gap: 8 },
  gridRadioText: { fontSize: 13, color: '#0F172A' },
  saveBtnWrap: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 16 },

  fullModal: { flex: 1, backgroundColor: '#FFF' },
  fullModalHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  fullModalTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#0F172A' },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listItemText: { fontSize: 13, color: '#0F172A' },

  refundModalHeader: { flexDirection: 'row', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  refundModalTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  refundModalSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  refundModalBanner: { backgroundColor: '#E0F2FE', padding: 12 },
  refundModalBannerText: { fontSize: 12, fontWeight: '600', color: '#0284C7', textAlign: 'center' },
  refundModalBody: { padding: 24 },
  refundApproxText: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  refundBullet: { fontSize: 13, color: '#475569', marginBottom: 12 },
  refundModalFooter: { padding: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  buyRefundBtn: { backgroundColor: '#0084FF', padding: 16, borderRadius: 8, alignItems: 'center' },
  buyRefundBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  skipRefundBtn: { padding: 16, alignItems: 'center', marginTop: 8 },
  skipRefundBtnText: { color: '#0084FF', fontWeight: '600', fontSize: 13 },
});
