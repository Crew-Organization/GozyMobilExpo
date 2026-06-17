import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, TextInput, ActivityIndicator, Modal, Image as RNImage, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { formatCurrency } from '@/src/lib/travel-data';
import { colors } from '@/src/theme/tokens';

const popularBanks = [
  { id: 'axis', name: 'Axis Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Axis_Bank_logo.svg/512px-Axis_Bank_logo.svg.png' },
  { id: 'hdfc', name: 'HDFC Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/512px-HDFC_Bank_Logo.svg.png' },
  { id: 'icici', name: 'ICICI Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/512px-ICICI_Bank_Logo.svg.png' },
  { id: 'sbi', name: 'State Bank of India', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/512px-SBI-logo.svg.png' },
];

const allBanks = [
  { id: 'airtel', name: 'Airtel Payments Bank' },
  { id: 'au', name: 'AU Small Finance Bank' },
  { id: 'axis2', name: 'Axis Bank' },
  { id: 'bandhan', name: 'Bandhan Bank' },
  { id: 'bob', name: 'Bank Of Baroda Corporate' },
];

const upiApps = [
  { id: 'gpay', name: 'GPay', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-google-pay-2036034-1713217.png' },
  { id: 'phonepe', name: 'PhonePe', logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-logo-icon.png' },
  { id: 'paytm', name: 'Paytm', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-paytm-226448.png' },
  { id: 'amazon', name: 'Amazon Pay', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-amazon-pay-226446.png' },
];

export default function TravelPaymentScreen() {
  const { selectedTravelOffer, travelSearch } = useSuperAppStore();
  const [expandedSection, setExpandedSection] = useState<string>('UPI');
  const [donate, setDonate] = useState(true);
  const insets = useSafeAreaInsets();
  
  // Form states
  const [selectedUpi, setSelectedUpi] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMode, setPaymentMode] = useState<'MAIN' | 'UPI' | 'CARDS' | 'EMI' | 'NETBANK' | 'WALLET'>('MAIN');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);

  useEffect(() => {
    if (!selectedTravelOffer) {
      router.replace('/travel-results');
    }
  }, [selectedTravelOffer]);

  if (!selectedTravelOffer) return null;

  const displayPrice = 7066;

  const handlePayment = () => {
    setShowPaymentModal(true);
    setPaymentStep(0);

    // Step 0: Redirecting to secure gateway
    setTimeout(() => {
      setPaymentStep(1); // Bank processing
      
      // Step 1: Processing the transaction
      setTimeout(() => {
        setPaymentStep(2); // Success!
        
        // Step 2: Navigate to confirmation
        setTimeout(() => {
          setShowPaymentModal(false);
          router.push('/travel-confirmation');
        }, 1500);

      }, 3000);

    }, 2000);
  };

  if (paymentMode !== 'MAIN') {
    const titleMap = {
      'UPI': 'UPI',
      'CARDS': 'Cards',
      'EMI': 'EMI',
      'NETBANK': 'Net banking',
      'WALLET': 'E Wallets and Gift Cards'
    };

    return (
      <View style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => setPaymentMode('MAIN')} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
            </Pressable>
            <View>
              <Text style={styles.headerTitle}>{titleMap[paymentMode]}</Text>
            </View>
          </View>
        </View>

        <View style={{backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E5EA'}}>
          <View>
             <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Total Due</Text>
             <Text style={{fontSize: 10, color: '#8E8E93'}}>{travelSearch.originCity} - {travelSearch.destinationCity}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
             <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginRight: 4}}>{formatCurrency(displayPrice)}</Text>
             <MaterialCommunityIcons name="chevron-down" size={16} color="#0084FF" />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {paymentMode === 'UPI' && (
             <View style={{padding: 16}}>
                <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 4}}>Select UPI App</Text>
                <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 16}}>Your list of installed payment applications</Text>
                
                <View style={{backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden'}}>
                  {upiApps.map((app, idx) => (
                    <Pressable key={app.id} onPress={() => setSelectedUpi(app.id)} style={[styles.upiRow, idx !== upiApps.length - 1 && {borderBottomWidth: 1, borderBottomColor: '#F2F4F7'}]}>
                       <View style={{flexDirection: 'row', alignItems: 'center'}}>
                         <Image source={{uri: app.logo}} style={{width: 24, height: 24, borderRadius: 12}} contentFit="contain" />
                         <Text style={{fontSize: 13, fontWeight: '700', color: '#333', marginLeft: 12}}>{app.name}</Text>
                       </View>
                       <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" />
                    </Pressable>
                  ))}
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 16}}>
                  <View style={{flex: 1, height: 1, backgroundColor: '#E5E5EA'}} />
                  <Text style={{color: '#8E8E93', fontSize: 12, marginHorizontal: 8}}>OR</Text>
                  <View style={{flex: 1, height: 1, backgroundColor: '#E5E5EA'}} />
                </View>

                <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 4}}>Share Payment Link <View style={{backgroundColor: '#FFEDD5', paddingHorizontal: 4, borderRadius: 4}}><Text style={{color: '#D97706', fontSize: 8, fontWeight: '800'}}>NEW</Text></View></Text>
                <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 12}}>Pay on any UPI App as per new guidelines. You can still request money by sharing the payment link.</Text>
                
                <View style={{backgroundColor: '#F0FDF4', padding: 12, borderRadius: 8, marginBottom: 16}}>
                   <View style={{flexDirection: 'row', marginBottom: 8}}>
                     <MaterialCommunityIcons name="check-circle" size={14} color="#16A34A" />
                     <Text style={{fontSize: 10, color: '#16A34A', marginLeft: 6}}>Link for payment of {formatCurrency(displayPrice)} will be valid for 15 minutes</Text>
                   </View>
                   <View style={{flexDirection: 'row'}}>
                     <MaterialCommunityIcons name="check-circle" size={14} color="#16A34A" />
                     <Text style={{fontSize: 10, color: '#16A34A', marginLeft: 6}}>Send to anyone, you will also receive link on SMS incase you benefits.</Text>
                   </View>
                </View>

                <Pressable style={styles.payBtn} onPress={handlePayment} disabled={isProcessing}>
                  {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payBtnText}>SHARE PAYMENT LINK</Text>}
                </Pressable>
             </View>
          )}

          {paymentMode === 'CARDS' && (
             <View style={{padding: 16}}>
                <View style={{backgroundColor: '#FFF2E6', padding: 12, borderRadius: 8, flexDirection: 'row', marginBottom: 20}}>
                   <MaterialCommunityIcons name="information" size={16} color="#D97706" />
                   <Text style={{fontSize: 10, color: '#D97706', marginLeft: 8, flex: 1}}>Please ensure your card is enabled for online transactions. <Text onPress={() => Alert.alert('Information', 'Demo link clicked')} style={{color: '#0084FF', fontWeight: '800'}}>Know more</Text></Text>
                </View>

                <View style={{backgroundColor: '#E0F2FE', padding: 16, borderRadius: 12}}>
                  <View style={[styles.inputContainer, {backgroundColor: '#FFF', borderColor: '#E5E5EA', marginBottom: 12}]}>
                    <Text style={[styles.inputLabel, {color: '#8E8E93'}]}>ENTER CARD NUMBER</Text>
                    <TextInput value={cardNumber} onChangeText={setCardNumber} placeholder="" keyboardType="number-pad" style={styles.inputField} />
                  </View>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <View style={[styles.inputContainer, {flex: 1, backgroundColor: '#FFF', borderColor: '#E5E5EA'}]}>
                      <Text style={[styles.inputLabel, {color: '#8E8E93'}]}>MM/YY</Text>
                      <TextInput value={cardExpiry} onChangeText={setCardExpiry} placeholder="" style={styles.inputField} />
                    </View>
                    <View style={[styles.inputContainer, {flex: 1, backgroundColor: '#FFF', borderColor: '#E5E5EA'}]}>
                      <Text style={[styles.inputLabel, {color: '#8E8E93'}]}>CVV</Text>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput value={cardCvv} onChangeText={setCardCvv} placeholder="" secureTextEntry keyboardType="number-pad" style={[styles.inputField, {flex: 1}]} />
                        <MaterialCommunityIcons name="eye-off-outline" size={16} color="#8E8E93" />
                      </View>
                    </View>
                  </View>
                </View>

                <Pressable style={[styles.payBtn, {backgroundColor: '#E5E5EA', marginTop: 24}]} onPress={handlePayment} disabled={isProcessing}>
                  {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.payBtnText, {color: '#A1A1AA'}]}>PAY</Text>}
                </Pressable>
             </View>
          )}

          {paymentMode === 'EMI' && (
             <View style={{padding: 16}}>
                <View style={styles.searchInput}>
                  <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" />
                  <TextInput placeholder="Search here" style={{flex: 1, marginLeft: 8}} />
                </View>

                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', marginBottom: 16}}>
                   <View style={{paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: '#0084FF', flex: 1, alignItems: 'center'}}>
                     <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>CREDIT CARD</Text>
                   </View>
                   <View style={{paddingBottom: 8, flex: 1, alignItems: 'center'}}>
                     <Text style={{fontSize: 12, fontWeight: '800', color: '#8E8E93'}}>DEBIT CARD</Text>
                   </View>
                   <View style={{paddingBottom: 8, flex: 1, alignItems: 'center'}}>
                     <Text style={{fontSize: 12, fontWeight: '800', color: '#8E8E93'}}>CARDLESS EMI</Text>
                   </View>
                </View>

                <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 12}}>All Banks</Text>
                <View style={[styles.bankList, {backgroundColor: '#FFF'}]}>
                   {allBanks.map((bank, idx) => (
                     <Pressable key={bank.id} onPress={() => { setSelectedBank(bank.id); handlePayment(); }} style={[styles.bankRow, {borderBottomWidth: 1, borderBottomColor: '#F2F4F7'}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{width: 24, height: 24, borderRadius: 12, backgroundColor: '#E5E5EA', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 10, fontWeight: '800', color: '#8E8E93'}}>{bank.name.charAt(0)}</Text>
                          </View>
                          <Text style={{fontSize: 13, color: '#333', marginLeft: 12}}>{bank.name}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#8E8E93" />
                     </Pressable>
                   ))}
                </View>
             </View>
          )}

          {paymentMode === 'NETBANK' && (
             <View style={{padding: 16}}>
                <View style={styles.searchInput}>
                  <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" />
                  <TextInput placeholder="Search Bank Here" style={{flex: 1, marginLeft: 8}} />
                </View>

                <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 12}}>Popular Banks</Text>
                <View style={[styles.bankList, {backgroundColor: '#FFF'}]}>
                   {popularBanks.map((bank, idx) => (
                     <Pressable key={bank.id} onPress={() => { setSelectedBank(bank.id); handlePayment(); }} style={[styles.bankRow, {borderBottomWidth: 1, borderBottomColor: '#F2F4F7'}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image source={{uri: bank.logo}} style={{width: 24, height: 24, borderRadius: 4}} contentFit="contain" />
                          <Text style={{fontSize: 13, color: '#333', marginLeft: 12}}>{bank.name}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" />
                     </Pressable>
                   ))}
                </View>

                <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginTop: 24, marginBottom: 12}}>All Banks</Text>
                <View style={[styles.bankList, {backgroundColor: '#FFF'}]}>
                   {allBanks.map((bank, idx) => (
                     <Pressable key={bank.id} onPress={() => { setSelectedBank(bank.id); handlePayment(); }} style={[styles.bankRow, {borderBottomWidth: 1, borderBottomColor: '#F2F4F7'}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{width: 24, height: 24, borderRadius: 12, backgroundColor: '#E5E5EA', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 10, fontWeight: '800', color: '#8E8E93'}}>{bank.name.charAt(0)}</Text>
                          </View>
                          <Text style={{fontSize: 13, color: '#333', marginLeft: 12}}>{bank.name}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" />
                     </Pressable>
                   ))}
                </View>
             </View>
          )}

          {paymentMode === 'WALLET' && (
             <View style={{padding: 16}}>
                <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 12}}>Select an E-wallet</Text>
                <View style={{backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden', marginBottom: 24}}>
                  <Pressable style={styles.upiRow}>
                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
                       <MaterialCommunityIcons name="radiobox-marked" size={20} color="#0084FF" />
                       <Image source={{uri: 'https://cdn.iconscout.com/icon/free/png-256/free-amazon-pay-226446.png'}} style={{width: 24, height: 24, borderRadius: 12, marginLeft: 12}} contentFit="contain" />
                       <Text style={{fontSize: 13, fontWeight: '700', color: '#333', marginLeft: 12}}>Amazon Pay</Text>
                     </View>
                  </Pressable>
                </View>

                <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 12}}>Select a Gift Card</Text>
                <View style={{backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden', marginBottom: 24}}>
                  <Pressable style={styles.upiRow}>
                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
                       <MaterialCommunityIcons name="radiobox-blank" size={20} color="#8E8E93" />
                       <MaterialCommunityIcons name="gift-outline" size={24} color="#EAB308" style={{marginLeft: 12}} />
                       <Text style={{fontSize: 13, fontWeight: '700', color: '#333', marginLeft: 12}}>Gift Card</Text>
                     </View>
                  </Pressable>
                </View>

                <Pressable style={styles.payBtn} onPress={handlePayment} disabled={isProcessing}>
                  {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payBtnText}>PAY NOW</Text>}
                </Pressable>
             </View>
          )}
          
          <Modal visible={showPaymentModal} transparent animationType="fade">
            <View style={StyleSheet.absoluteFill}>
              <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20}}>
                 <View style={{backgroundColor: '#FFF', borderRadius: 16, width: '100%', overflow: 'hidden', padding: 24, alignItems: 'center'}}>
                   
                   {paymentStep === 0 && (
                     <View style={{alignItems: 'center'}}>
                       <MaterialCommunityIcons name="shield-lock-outline" size={48} color="#0084FF" style={{marginBottom: 16}} />
                       <Text style={{fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 8}}>Secure Checkout</Text>
                       <Text style={{fontSize: 13, color: '#8E8E93', textAlign: 'center', marginBottom: 24}}>Redirecting to your bank's secure payment gateway...</Text>
                       <ActivityIndicator size="large" color="#0084FF" />
                     </View>
                   )}
  
                   {paymentStep === 1 && (
                     <View style={{alignItems: 'center'}}>
                       <MaterialCommunityIcons name="bank-transfer" size={48} color="#D97706" style={{marginBottom: 16}} />
                       <Text style={{fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 8}}>Processing Payment</Text>
                       <Text style={{fontSize: 13, color: '#8E8E93', textAlign: 'center', marginBottom: 24}}>Please do not press back or refresh this page. We are awaiting confirmation from your bank.</Text>
                       <ActivityIndicator size="large" color="#D97706" />
                     </View>
                   )}
  
                   {paymentStep === 2 && (
                     <View style={{alignItems: 'center'}}>
                       <View style={{width: 64, height: 64, borderRadius: 32, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 16}}>
                         <MaterialCommunityIcons name="check" size={32} color="#16A34A" />
                       </View>
                       <Text style={{fontSize: 18, fontWeight: '800', color: '#16A34A', marginBottom: 8}}>Payment Successful!</Text>
                       <Text style={{fontSize: 13, color: '#8E8E93', textAlign: 'center'}}>Redirecting to your booking confirmation...</Text>
                     </View>
                   )}
  
                 </View>
              </View>
            </View>
          </Modal>

        </ScrollView>
      </View>
    );
  }


  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Total Due</Text>
            <Text style={styles.headerSubtitle}>{travelSearch.originCity} → {travelSearch.destinationCity}</Text>
          </View>
        </View>
        <Text style={styles.headerPrice}>{formatCurrency(displayPrice)}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Summary Block */}
        <View style={styles.summaryCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name="airplane" size={24} color="#0084FF" />
            <Text style={styles.summaryTitle}>{selectedTravelOffer.airline} Flight</Text>
          </View>
          <Text style={styles.summarySub}>Class: {selectedTravelOffer.cabin || 'Economy'} | Date: {new Date(travelSearch.departureDate).toDateString()}</Text>
          <Text style={styles.summaryTraveller}>{travelSearch.travellers} Traveller(s)</Text>
        </View>

        {/* Donation Block */}
        <View style={styles.donationCard}>
          <View style={styles.donationTop}>
            <View style={styles.donationIconBox}>
              <MaterialCommunityIcons name="hand-heart" size={24} color="#D97706" />
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.donationTitle}>Donate ₹10 to MMT Foundation</Text>
              <Text style={styles.donationSub}>& earn ₹100 myCash <Text onPress={() => Alert.alert('Information', 'Demo link clicked')} style={{color: '#0084FF'}}>T&C</Text></Text>
            </View>
            <Pressable onPress={() => setDonate(!donate)}>
              <MaterialCommunityIcons name={donate ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={donate ? "#0084FF" : "#8E8E93"} />
            </Pressable>
          </View>
          <View style={{marginTop: 12}}>
             <Text style={styles.donationText}>Contribute to the sustainable planting of 4 million trees by 2027!</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Payment Options</Text>

        <View style={{backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden'}}>
          {/* UPI */}
          <Pressable style={styles.paymentOptionListRow} onPress={() => setPaymentMode('UPI')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png'}} style={{width: 24, height: 12}} contentFit="contain" />
              <View style={{marginLeft: 16}}>
                <Text style={styles.paymentOptionListTitle}>UPI Options <MaterialCommunityIcons name="check-decagram" size={12} color="#00A699" /></Text>
                <Text style={styles.paymentOptionListSub}>Pay Directly From Your Bank Account</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0084FF" />
          </Pressable>

          {/* Cards */}
          <Pressable style={styles.paymentOptionListRow} onPress={() => setPaymentMode('CARDS')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color="#0084FF" />
              <View style={{marginLeft: 16}}>
                <Text style={styles.paymentOptionListTitle}>Credit & Debit Cards</Text>
                <Text style={styles.paymentOptionListSub}>Visa, MasterCard, Amex, RuPay and more</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0084FF" />
          </Pressable>

          {/* EMI */}
          <Pressable style={styles.paymentOptionListRow} onPress={() => setPaymentMode('EMI')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="bank-transfer" size={24} color="#0084FF" />
              <View style={{marginLeft: 16}}>
                <Text style={styles.paymentOptionListTitle}>EMI <View style={{backgroundColor: '#00A699', paddingHorizontal: 4, borderRadius: 4}}><Text style={{color: '#FFF', fontSize: 8, fontWeight: '800'}}>NO COST EMI</Text></View></Text>
                <Text style={styles.paymentOptionListSub}>Credit/Debit card & Cardless EMI available</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0084FF" />
          </Pressable>

          {/* Netbanking */}
          <Pressable style={styles.paymentOptionListRow} onPress={() => setPaymentMode('NETBANK')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="bank-outline" size={24} color="#0084FF" />
              <View style={{marginLeft: 16}}>
                <Text style={styles.paymentOptionListTitle}>Net Banking <View style={{backgroundColor: '#E0F2FE', paddingHorizontal: 4, borderRadius: 4}}><Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 8, fontWeight: '800'}}>Fingerprint / Face ID</Text></View></Text>
                <Text style={styles.paymentOptionListSub}>All major banks available</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0084FF" />
          </Pressable>

          {/* Wallets */}
          <Pressable style={styles.paymentOptionListRow} onPress={() => setPaymentMode('WALLET')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="wallet-outline" size={24} color="#0084FF" />
              <View style={{marginLeft: 16}}>
                <Text style={styles.paymentOptionListTitle}>Gift Cards & e-wallets</Text>
                <Text style={styles.paymentOptionListSub}>MMT Gift cards, Amazon Pay, Mobikwik</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0084FF" />
          </Pressable>
        </View>

        <View style={{marginTop: 24, paddingHorizontal: 16, paddingBottom: 40}}>
           <Text style={{fontSize: 10, color: '#8E8E93', lineHeight: 14}}>
             By proceeding to pay, you understand and agree with the <Text onPress={() => Alert.alert('Information', 'Demo link clicked')} style={{color: '#0084FF'}}>Terms of Service</Text>, <Text onPress={() => Alert.alert('Information', 'Demo link clicked')} style={{color: '#0084FF'}}>Privacy Policy</Text> and <Text onPress={() => Alert.alert('Information', 'Demo link clicked')} style={{color: '#0084FF'}}>User Agreement</Text> of MakeMyTrip.
           </Text>
        </View>

        {/* Spacer */}
        <View style={{height: 100}} />
      </ScrollView>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#0084FF" />
          <Text style={styles.processingText}>Processing your secure payment...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
  headerSubtitle: { fontSize: 10.5, color: '#8E8E93', marginTop: 2 },
  headerPrice: { fontSize: 18, fontWeight: '900', color: '#333' },

  content: { padding: 16 },
  
  donationCard: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#FEF08A' },
  donationTop: { flexDirection: 'row', alignItems: 'center' },
  donationIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  donationTitle: { fontSize: 13, fontWeight: '800', color: '#333' },
  donationSub: { fontSize: 10.5, color: '#8E8E93', marginTop: 2 },
  donationText: { fontSize: 10.5, color: '#D97706', lineHeight: 16 },

  sectionHeading: { fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 12 },

  accordionContainer: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  accordionTitle: { fontSize: 13, fontWeight: '800', color: '#333' },
  accordionSub: { fontSize: 10, color: '#8E8E93', marginTop: 2 },
  accordionContent: { padding: 16, backgroundColor: '#FFF' },

  paymentOptionListRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F2F4F7' },
  paymentOptionListTitle: { fontSize: 13, fontWeight: '800', color: '#333' },
  paymentOptionListSub: { fontSize: 10, color: '#8E8E93', marginTop: 4 },

  upiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  
  inputContainer: { borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16, backgroundColor: '#FFF' },
  inputLabel: { fontSize: 10, color: '#0084FF', fontWeight: '700', marginBottom: 4 },
  inputField: { fontSize: 13, color: '#333', padding: 0 },

  payBtn: { backgroundColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  payBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

  searchInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 20 },
  bankList: { backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA' },
  bankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },

  processingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  processingText: { fontSize: 16, fontWeight: '800', color: '#0084FF', marginTop: 16 },
});
