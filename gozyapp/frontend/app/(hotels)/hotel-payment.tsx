import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, TextInput, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';

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

export default function HotelPaymentScreen() {
  const insets = useSafeAreaInsets();
  const { selectedHotel, selectedRoom } = useSuperAppStore();

  const [paymentMode, setPaymentMode] = useState<'MAIN' | 'UPI' | 'CARDS' | 'EMI' | 'NETBANK' | 'WALLET'>('MAIN');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [selectedUpi, setSelectedUpi] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  
  const totalPrice = (selectedRoom?.price || 0) + (selectedRoom?.taxes || 0) - 317 + 29;

  const handlePayment = () => {
    setShowPaymentModal(true);
    setPaymentStep(0);

    setTimeout(() => {
      setPaymentStep(1);
      setTimeout(() => {
        setPaymentStep(2);
        setTimeout(() => {
          setShowPaymentModal(false);
          router.push('/(hotels)/hotel-confirmation');
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
            <Pressable onPress={() => setPaymentMode('MAIN')} style={styles.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
            </Pressable>
            <View>
              <Text style={styles.headerTitle}>{titleMap[paymentMode]}</Text>
            </View>
          </View>
        </View>

        <View style={{backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E5EA'}}>
          <View>
             <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Total Due</Text>
             <Text style={{fontSize: 10, color: '#8E8E93'}}>{selectedHotel?.name || 'Hotel'} | 1 Night</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
             <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginRight: 4}}>{formatCurrency(totalPrice)}</Text>
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
                     <Text style={{fontSize: 10, color: '#16A34A', marginLeft: 6}}>Link for payment of {formatCurrency(totalPrice)} will be valid for 15 minutes</Text>
                   </View>
                </View>

                <Pressable style={styles.payBtn} onPress={handlePayment} disabled={isProcessing}>
                  {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payBtnText}>SHARE PAYMENT LINK</Text>}
                </Pressable>
             </View>
          )}

          {paymentMode === 'CARDS' && (
             <View style={{padding: 16}}>
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
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </Pressable>
          <View>
            <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '800'}}>TOTAL DUE</Text>
            <Text style={styles.headerTitle}>{formatCurrency(totalPrice)}</Text>
            <Text style={styles.headerSubtitle}>{selectedHotel?.name || 'Hotel'} | 1 Night</Text>
          </View>
        </View>
        <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800'}}>Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Login Banner */}
        <View style={{backgroundColor: '#F5FAFF', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons name="account-circle" size={24} color="#0084FF" />
            <Text style={{fontSize: 12, color: '#333', fontWeight: '800', marginLeft: 8}}>Additional discounts and saved payment options</Text>
          </View>
          <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '900'}}>Log in now</Text>
        </View>

        {/* Trip Secure Banner */}
        <View style={{backgroundColor: '#E5FDF4', padding: 12, flexDirection: 'row', alignItems: 'center', marginTop: 16, marginHorizontal: 16, borderRadius: 8}}>
          <MaterialCommunityIcons name="shield-check" size={24} color="#10B981" />
          <Text style={{fontSize: 10, color: '#10B981', marginLeft: 8, flex: 1, lineHeight: 14}}>
            We've added <Text style={{fontWeight: '800'}}>Trip Secure</Text> to your booking. Check T&C for full policy details.
          </Text>
        </View>

        {/* Summary Block */}
        <View style={styles.summaryCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name="office-building-marker" size={24} color="#0084FF" />
            <Text style={styles.summaryTitle}>{selectedHotel?.name || 'Hotel'} ({selectedHotel?.location || 'City'})</Text>
          </View>
          <Text style={styles.summarySub}>Room: {selectedRoom?.name || 'Standard'} | 1 Night</Text>
          <Text style={styles.summaryTraveller}>1 Traveller(s)</Text>
        </View>

        {/* Gift Cards */}
        <View style={styles.card}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="gift-outline" size={24} color="#E11D48" />
              <View style={{marginLeft: 12}}>
                <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>Gift Cards</Text>
                <Text style={{fontSize: 10, color: '#8E8E93'}}>Have a Gozy Gift Card?</Text>
              </View>
            </View>
            <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800'}}>Apply</Text>
          </View>
        </View>

        <Text style={{fontSize: 13, fontWeight: '900', color: '#333', marginLeft: 16, marginBottom: 12}}>Payment Options</Text>

        <View style={styles.paymentMethods}>
          {/* UPI */}
          <Pressable style={styles.paymentRow} onPress={() => setPaymentMode('UPI')}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#0084FF" />
            <Text style={styles.paymentText}>UPI</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#8E8E93" />
          </Pressable>

          <View style={styles.divider} />

          {/* Credit/Debit Cards */}
          <Pressable style={styles.paymentRow} onPress={() => setPaymentMode('CARDS')}>
            <MaterialCommunityIcons name="credit-card-outline" size={24} color="#8E8E93" />
            <Text style={styles.paymentText}>Credit & Debit Cards</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#8E8E93" />
          </Pressable>

          <View style={styles.divider} />

          {/* EMI */}
          <Pressable style={styles.paymentRow} onPress={() => setPaymentMode('EMI')}>
            <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#8E8E93" />
            <Text style={styles.paymentText}>EMI</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#8E8E93" />
          </Pressable>

          <View style={styles.divider} />

          {/* Net Banking */}
          <Pressable style={styles.paymentRow} onPress={() => setPaymentMode('NETBANK')}>
            <MaterialCommunityIcons name="bank-outline" size={24} color="#8E8E93" />
            <Text style={styles.paymentText}>Net Banking</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#8E8E93" />
          </Pressable>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { padding: 4, marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#333' },
  headerSubtitle: { fontSize: 10, color: '#8E8E93' },

  content: { flex: 1 },

  summaryCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#333', marginLeft: 12 },
  summarySub: { fontSize: 13, color: '#666', marginTop: 4 },
  summaryTraveller: { fontSize: 13, color: '#666', marginTop: 2, fontWeight: '600' },

  card: { backgroundColor: '#FFF', marginHorizontal: 16, marginVertical: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  
  paymentMethods: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 24 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  paymentText: { flex: 1, marginLeft: 12, fontSize: 13, fontWeight: '800', color: '#333' },
  
  divider: { height: 1, backgroundColor: '#E5E5EA' },

  upiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  inputContainer: { borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16, backgroundColor: '#FFF' },
  inputLabel: { fontSize: 10, color: '#0084FF', fontWeight: '700', marginBottom: 4 },
  inputField: { fontSize: 13, color: '#333', padding: 0 },
  payBtn: { backgroundColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  payBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  bankList: { backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA' },
  bankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
});
