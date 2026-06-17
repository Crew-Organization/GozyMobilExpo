import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useApp } from '@/src/context/app-context';
import { savedAddresses } from '@/src/lib/commerce-data';
import { api } from '@/src/lib/api';
import { useSuperAppStore } from '@/src/store/super-app-store';
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

export default function FoodCheckoutScreen() {
  const { refreshApp } = useApp();
  const {
    clearCart,
    commercePaymentMethod,
    foodCart,
    selectedAddressId,
    selectedRestaurantId,
    setCommercePaymentMethod,
    setFoodOrderConfirmation,
    setSelectedAddress,
  } = useSuperAppStore();
  const { restaurants } = useApp();

  const [expandedSection, setExpandedSection] = useState<string>('UPI');
  const [donate, setDonate] = useState(true);
  
  const [selectedUpi, setSelectedUpi] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);

  const restaurant = restaurants.find((item) => item.id === selectedRestaurantId) ?? restaurants[0];
  const address = savedAddresses.find((item) => item.id === selectedAddressId) ?? savedAddresses[0];
  
  const cartToUse = foodCart.length > 0 ? foodCart : [
    { id: 'dummy-1', name: 'A One Chicken Briyani', price: 281, quantity: 1 }
  ];

  const subtotal = useMemo(
    () => cartToUse.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartToUse],
  );
  const deliveryFee = 39;
  const total = subtotal + deliveryFee;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const placeOrder = async () => {
    setIsProcessing(true);
    const confirmation = await api.createFoodOrder(
      {
        restaurantId: restaurant.id,
        items: cartToUse as any,
        address,
        paymentMethod: commercePaymentMethod,
        instructions: 'Leave at the door',
      },
      restaurant,
    );

    setFoodOrderConfirmation(confirmation);
    clearCart('food');
    await refreshApp();
    
    setShowPaymentModal(true);
    setPaymentStep(0);

    setTimeout(() => {
      setPaymentStep(1);
      setTimeout(() => {
        setPaymentStep(2);
        setTimeout(() => {
          setShowPaymentModal(false);
          setIsProcessing(false);
          router.replace('/food-confirmation');
        }, 1500);
      }, 3000);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Total Due</Text>
            <Text style={styles.headerSubtitle}>{restaurant.name} • {cartToUse.length} items</Text>
          </View>
        </View>
        <Text style={styles.headerPrice}>{formatCurrency(total)}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Delivery Address Section */}
        <Text style={styles.sectionHeading}>Delivery Address</Text>
        <View style={styles.addressCard}>
          {savedAddresses.map((item) => {
            const active = item.id === address.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedAddress(item.id)}
                style={[styles.addressRow, active ? styles.addressRowActive : null]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressTitle}>{item.label}</Text>
                  <Text style={styles.addressMeta}>{item.line1}, {item.line2}</Text>
                </View>
                <MaterialCommunityIcons name={active ? "check-circle" : "circle-outline"} size={20} color={active ? "#0084FF" : "#8E8E93"} />
              </Pressable>
            );
          })}
        </View>

        {/* Donation Block */}
        <View style={styles.donationCard}>
          <View style={styles.donationTop}>
            <View style={styles.donationIconBox}>
              <MaterialCommunityIcons name="hand-heart" size={24} color="#D97706" />
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.donationTitle}>Donate ₹10 to MMT Foundation</Text>
              <Text style={styles.donationSub}>& earn ₹100 myCash <Text style={{color: '#0084FF'}}>T&C</Text></Text>
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

        {/* UPI Accordion */}
        <View style={styles.accordionContainer}>
           <Pressable style={styles.accordionHeader} onPress={() => setExpandedSection(expandedSection === 'UPI' ? '' : 'UPI')}>
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png'}} style={{width: 32, height: 16}} contentFit="contain" />
               <View style={{marginLeft: 12}}>
                 <Text style={styles.accordionTitle}>UPI Option</Text>
                 <Text style={styles.accordionSub}>Pay Directly From Your Bank Account</Text>
               </View>
             </View>
             <MaterialCommunityIcons name={expandedSection === 'UPI' ? "chevron-up" : "chevron-down"} size={24} color="#8E8E93" />
           </Pressable>

           {expandedSection === 'UPI' && (
             <View style={styles.accordionContent}>
                <Text style={{fontSize: 12, fontWeight: '700', color: '#8E8E93', marginBottom: 12}}>Select UPI App</Text>
                {upiApps.map(app => (
                  <Pressable key={app.id} onPress={() => setSelectedUpi(app.id)} style={styles.upiRow}>
                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
                       <Image source={{uri: app.logo}} style={{width: 24, height: 24, borderRadius: 12}} contentFit="contain" />
                       <Text style={{fontSize: 13, fontWeight: '700', color: '#333', marginLeft: 12}}>{app.name}</Text>
                     </View>
                     <MaterialCommunityIcons name={selectedUpi === app.id ? "radiobox-marked" : "radiobox-blank"} size={20} color={selectedUpi === app.id ? "#0084FF" : "#8E8E93"} />
                  </Pressable>
                ))}

                <View style={{backgroundColor: '#F5FAFF', padding: 12, borderRadius: 8, marginTop: 12}}>
                  <Text style={{fontSize: 10, color: '#0084FF', fontWeight: '600'}}>Amazon Pay UPI credit cards are live. Link your RuPay credit card via UPI right now to avail extra benefits.</Text>
                </View>

                <Pressable style={styles.payBtn} onPress={placeOrder} disabled={isProcessing}>
                  {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payBtnText}>PAY {formatCurrency(total)}</Text>}
                </Pressable>
             </View>
           )}
        </View>

        {/* Credit / Debit Cards Accordion */}
        <View style={styles.accordionContainer}>
           <Pressable style={styles.accordionHeader} onPress={() => setExpandedSection(expandedSection === 'CARDS' ? '' : 'CARDS')}>
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <MaterialCommunityIcons name="credit-card-outline" size={24} color="#333" />
               <View style={{marginLeft: 12}}>
                 <Text style={styles.accordionTitle}>Credit/Debit/ATM Cards</Text>
                 <Text style={styles.accordionSub}>Visa, MasterCard, Amex, RuPay and more</Text>
               </View>
             </View>
             <MaterialCommunityIcons name={expandedSection === 'CARDS' ? "chevron-up" : "chevron-down"} size={24} color="#8E8E93" />
           </Pressable>

           {expandedSection === 'CARDS' && (
             <View style={styles.accordionContent}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Enter Card Number</Text>
                  <TextInput value={cardNumber} onChangeText={setCardNumber} placeholder="XXXX XXXX XXXX XXXX" keyboardType="number-pad" style={styles.inputField} />
                </View>
                <View style={{flexDirection: 'row', gap: 12, marginBottom: 20}}>
                  <View style={[styles.inputContainer, {flex: 1}]}>
                    <Text style={styles.inputLabel}>MM/YY</Text>
                    <TextInput value={cardExpiry} onChangeText={setCardExpiry} placeholder="MM/YY" style={styles.inputField} />
                  </View>
                  <View style={[styles.inputContainer, {flex: 1}]}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput value={cardCvv} onChangeText={setCardCvv} placeholder="XXX" secureTextEntry keyboardType="number-pad" style={[styles.inputField, {flex: 1}]} />
                      <MaterialCommunityIcons name="credit-card-scan-outline" size={20} color="#8E8E93" />
                    </View>
                  </View>
                </View>

                <Pressable style={styles.payBtn} onPress={placeOrder} disabled={isProcessing}>
                  {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payBtnText}>PAY {formatCurrency(total)}</Text>}
                </Pressable>
             </View>
           )}
        </View>

        {/* Net Banking Accordion */}
        <View style={styles.accordionContainer}>
           <Pressable style={styles.accordionHeader} onPress={() => setExpandedSection(expandedSection === 'NETBANK' ? '' : 'NETBANK')}>
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <MaterialCommunityIcons name="bank-outline" size={24} color="#333" />
               <View style={{marginLeft: 12}}>
                 <Text style={styles.accordionTitle}>Net Banking</Text>
                 <Text style={styles.accordionSub}>All major banks available</Text>
               </View>
             </View>
             <MaterialCommunityIcons name={expandedSection === 'NETBANK' ? "chevron-up" : "chevron-down"} size={24} color="#8E8E93" />
           </Pressable>

           {expandedSection === 'NETBANK' && (
             <View style={styles.accordionContent}>
                <View style={styles.searchInput}>
                  <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" />
                  <TextInput placeholder="Search Bank Here" style={{flex: 1, marginLeft: 8}} />
                </View>

                <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 12}}>Popular Banks</Text>
                <View style={styles.bankList}>
                   {popularBanks.map(bank => (
                     <Pressable key={bank.id} onPress={() => { setSelectedBank(bank.id); placeOrder(); }} style={styles.bankRow}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image source={{uri: bank.logo}} style={{width: 24, height: 24, borderRadius: 4}} contentFit="contain" />
                          <Text style={{fontSize: 13, color: '#333', marginLeft: 12}}>{bank.name}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#8E8E93" />
                     </Pressable>
                   ))}
                </View>

                <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginTop: 24, marginBottom: 12}}>All Banks</Text>
                <View style={styles.bankList}>
                   {allBanks.map(bank => (
                     <Pressable key={bank.id} onPress={() => { setSelectedBank(bank.id); placeOrder(); }} style={styles.bankRow}>
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
        </View>

        {/* Wallets Accordion */}
        <View style={styles.accordionContainer}>
           <Pressable style={styles.accordionHeader} onPress={() => setExpandedSection(expandedSection === 'WALLET' ? '' : 'WALLET')}>
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <MaterialCommunityIcons name="wallet-outline" size={24} color="#333" />
               <View style={{marginLeft: 12}}>
                 <Text style={styles.accordionTitle}>Mobile Wallets and Gift Cards</Text>
                 <Text style={styles.accordionSub}>Amazon Pay, Mobikwik, PayZapp</Text>
               </View>
             </View>
             <MaterialCommunityIcons name={expandedSection === 'WALLET' ? "chevron-up" : "chevron-down"} size={24} color="#8E8E93" />
           </Pressable>
        </View>

        {/* Spacer */}
        <View style={{height: 100}} />
      </ScrollView>

      {/* Processing Overlay */}
      {isProcessing && !showPaymentModal && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#0084FF" />
          <Text style={styles.processingText}>Processing your secure payment...</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
  headerSubtitle: { fontSize: 10.5, color: '#8E8E93', marginTop: 2 },
  headerPrice: { fontSize: 18, fontWeight: '900', color: '#333' },

  content: { padding: 16 },

  addressCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E5E5EA' },
  addressRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  addressRowActive: { backgroundColor: '#F0F9FF', borderRadius: 8, paddingHorizontal: 8, marginHorizontal: -8 },
  addressTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  addressMeta: { fontSize: 12, color: '#64748B', marginTop: 4 },
  
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
  accordionSub: { fontSize: 10.5, color: '#8E8E93', marginTop: 4 },
  accordionContent: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA', backgroundColor: '#FAFAFA' },

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
