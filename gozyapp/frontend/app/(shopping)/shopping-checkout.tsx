import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { paymentMethods, savedAddresses } from '@/src/lib/commerce-data';
import { api } from '@/src/lib/api';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { spacing } from '@/src/theme/tokens';

const brandColors = {
  myntraPink: '#FF3F6C',
  myntraNavy: '#282C3F',
  lightGray: '#F5F5F6',
  discountGreen: '#03A685',
  borderLight: '#EAEAEC',
  softGreen: '#E6F7F4',
};

export default function ShoppingCheckoutScreen() {
  const { products, refreshApp } = useApp();
  const {
    clearCart,
    commercePaymentMethod,
    selectedAddressId,
    setCommercePaymentMethod,
    setSelectedAddress,
    setShoppingOrderConfirmation,
    shoppingCart,
    updateQuantity,
  } = useSuperAppStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const address = savedAddresses.find((item) => item.id === selectedAddressId) ?? savedAddresses[0];

  // Calculations
  const bagCalculations = useMemo(() => {
    let totalMrp = 0;
    let subtotal = 0;

    shoppingCart.forEach((item) => {
      // Find original price of product to calculate true MRP
      const origProduct = products.find((p) => p.id === item.sourceId);
      const originalPrice = origProduct ? origProduct.originalPrice : item.price * 1.5;
      totalMrp += originalPrice * item.quantity;
      subtotal += item.price * item.quantity;
    });

    const mrpDiscount = totalMrp - subtotal;
    
    // Apply coupon discount if active
    let promoDeduction = 0;
    if (appliedCoupon === 'MYNTRA200') {
      promoDeduction = Math.min(200, subtotal);
    } else if (appliedCoupon === 'FIRSTBUY') {
      promoDeduction = Math.round(subtotal * 0.15); // 15% discount
    }

    const deliveryFee = subtotal >= 999 ? 0 : 79;
    const finalAmount = subtotal - promoDeduction + deliveryFee;

    return {
      totalMrp,
      mrpDiscount,
      couponDeduction: promoDeduction,
      deliveryFee,
      finalAmount,
    };
  }, [shoppingCart, products, appliedCoupon]);

  if (!shoppingCart.length) {
    return <Redirect href="/shopping" />;
  }

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'MYNTRA200') {
      setAppliedCoupon('MYNTRA200');
      setCouponCode('');
      Alert.alert('Coupon Applied', 'You saved Rs. 200 on this order!');
    } else if (code === 'FIRSTBUY') {
      setAppliedCoupon('FIRSTBUY');
      setCouponCode('');
      Alert.alert('Coupon Applied', 'Extra 15% discount applied successfully!');
    } else {
      Alert.alert('Invalid Coupon', 'Please enter a valid coupon code (e.g. MYNTRA200 or FIRSTBUY).');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const placeOrder = async () => {
    const confirmation = await api.createShoppingOrder({
      items: shoppingCart,
      address,
      paymentMethod: commercePaymentMethod,
    });

    // Merge checkout totals into support messages or confirmation objects
    const updatedConfirmation = {
      ...confirmation,
      amountPaid: bagCalculations.finalAmount,
    };

    setShoppingOrderConfirmation(updatedConfirmation);
    clearCart('shopping');
    await refreshApp();
    router.replace('/shopping-tracking');
  };

  return (
    <ScreenShell scroll={true} contentContainerStyle={styles.shellContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={brandColors.myntraNavy} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>SHOPPING BAG</Text>
          <Text style={styles.headerSubtitle}>
            {shoppingCart.length} {shoppingCart.length === 1 ? 'Item' : 'Items'} • Rs. {bagCalculations.finalAmount.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Offers info */}
      <View style={styles.offersBanner}>
        <MaterialCommunityIcons name="tag-outline" size={16} color={brandColors.discountGreen} />
        <Text style={styles.offersBannerText}>
          {bagCalculations.totalMrp - bagCalculations.finalAmount > 0 
            ? `You are saving Rs. ${(bagCalculations.totalMrp - bagCalculations.finalAmount).toLocaleString('en-IN')} on this order!`
            : 'Apply coupon code MYNTRA200 or FIRSTBUY for extra discounts.'}
        </Text>
      </View>

      {/* Bag Items list */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Items ({shoppingCart.length})</Text>
        {shoppingCart.map((item) => {
          const origProduct = products.find((p) => p.id === item.sourceId);
          const originalPrice = origProduct ? origProduct.originalPrice : item.price * 1.5;
          const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);

          return (
            <View key={item.id} style={styles.bagItemRow}>
              <Image source={{ uri: item.image }} contentFit="cover" style={styles.itemImage} />
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemBrand}>{item.subtitle}</Text>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                
                {/* Size and Qty selectors */}
                <View style={styles.sizeQtyRow}>
                  <View style={styles.variantBadge}>
                    <Text style={styles.variantBadgeText}>Size: M</Text>
                  </View>
                  <View style={styles.quantityCounter}>
                    <Pressable
                      onPress={() => updateQuantity('shopping', item.id, item.quantity - 1)}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </Pressable>
                    <Text style={styles.qtyVal}>{item.quantity}</Text>
                    <Pressable
                      onPress={() => updateQuantity('shopping', item.id, item.quantity + 1)}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Price layout */}
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>Rs. {item.price}</Text>
                  <Text style={styles.itemOriginalPrice}>Rs. {originalPrice}</Text>
                  <Text style={styles.itemDiscountPercent}>{discountPercent}% OFF</Text>
                </View>
              </View>

              {/* Close/Remove from bag */}
              <Pressable
                onPress={() => updateQuantity('shopping', item.id, 0)}
                style={styles.removeItemBtn}
              >
                <MaterialCommunityIcons name="close" size={18} color="#9496A2" />
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Coupons Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Coupons</Text>
        {appliedCoupon ? (
          <View style={styles.appliedCouponRow}>
            <View style={styles.couponBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color={brandColors.discountGreen} />
              <Text style={styles.couponBadgeText}>{appliedCoupon} APPLIED</Text>
            </View>
            <Pressable onPress={removeCoupon} style={styles.removeCouponBtn}>
              <Text style={styles.removeCouponBtnText}>REMOVE</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.couponInputRow}>
            <TextInput
              placeholder="Enter coupon code (e.g. MYNTRA200)"
              placeholderTextColor="#9496A2"
              value={couponCode}
              onChangeText={setCouponCode}
              style={styles.couponInput}
              autoCapitalize="characters"
            />
            <Pressable onPress={applyCoupon} style={styles.couponApplyBtn}>
              <Text style={styles.couponApplyBtnText}>APPLY</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Delivery Address Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {savedAddresses.map((item) => {
          const active = item.id === address.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedAddress(item.id)}
              style={[styles.addressItem, active ? styles.addressItemActive : null]}
            >
              <View style={styles.addressHeader}>
                <MaterialCommunityIcons
                  name={active ? 'radiobox-marked' : 'radiobox-blank'}
                  size={20}
                  color={active ? brandColors.myntraPink : brandColors.myntraNavy}
                />
                <Text style={styles.addressLabel}>{item.label}</Text>
              </View>
              <Text style={styles.addressText}>
                {item.line1}, {item.line2}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Payment Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {paymentMethods.map((method) => {
          const active = method.id === commercePaymentMethod;
          return (
            <Pressable
              key={method.id}
              onPress={() => setCommercePaymentMethod(method.id)}
              style={[styles.paymentItem, active ? styles.paymentItemActive : null]}
            >
              <View style={styles.paymentHeader}>
                <MaterialCommunityIcons
                  name={active ? 'radiobox-marked' : 'radiobox-blank'}
                  size={20}
                  color={active ? brandColors.myntraPink : brandColors.myntraNavy}
                />
                <Text style={styles.paymentLabel}>{method.label}</Text>
              </View>
              <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Price breakdown summary */}
      <View style={[styles.sectionCard, styles.priceDetailsSection]}>
        <Text style={styles.priceDetailsTitle}>PRICE DETAILS ({shoppingCart.length} Items)</Text>
        
        <View style={styles.priceSummaryRow}>
          <Text style={styles.priceSummaryLabel}>Total MRP</Text>
          <Text style={styles.priceSummaryValue}>Rs. {bagCalculations.totalMrp.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.priceSummaryRow}>
          <Text style={styles.priceSummaryLabel}>Discount on MRP</Text>
          <Text style={[styles.priceSummaryValue, { color: brandColors.discountGreen }]}>
            - Rs. {bagCalculations.mrpDiscount.toLocaleString('en-IN')}
          </Text>
        </View>

        {appliedCoupon && (
          <View style={styles.priceSummaryRow}>
            <Text style={styles.priceSummaryLabel}>Coupon Discount</Text>
            <Text style={[styles.priceSummaryValue, { color: brandColors.discountGreen }]}>
              - Rs. {bagCalculations.couponDeduction.toLocaleString('en-IN')}
            </Text>
          </View>
        )}

        <View style={styles.priceSummaryRow}>
          <Text style={styles.priceSummaryLabel}>Convenience / Delivery Fee</Text>
          <Text style={styles.priceSummaryValue}>
            {bagCalculations.deliveryFee === 0 ? (
              <Text style={{ color: brandColors.discountGreen, fontWeight: '700' }}>FREE</Text>
            ) : (
              `Rs. ${bagCalculations.deliveryFee}`
            )}
          </Text>
        </View>

        <View style={styles.priceTotalRow}>
          <Text style={styles.priceTotalLabel}>Total Amount</Text>
          <Text style={styles.priceTotalValue}>Rs. {bagCalculations.finalAmount.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Place Order Sticky bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomBarPrice}>Rs. {bagCalculations.finalAmount.toLocaleString('en-IN')}</Text>
          <Text style={styles.bottomBarViewDetails}>View Price Details</Text>
        </View>
        <Pressable onPress={() => void placeOrder()} style={styles.placeOrderBtn}>
          <Text style={styles.placeOrderBtnText}>PLACE ORDER</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shellContainer: {
    backgroundColor: brandColors.lightGray,
    paddingBottom: 90, // Room for bottom sticky bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
  },
  backBtn: {
    padding: spacing.xs,
  },
  headerTitleWrap: {
    marginLeft: spacing.md,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: '#7E8190',
  },
  offersBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: brandColors.softGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: spacing.xs,
  },
  offersBannerText: {
    fontSize: 10.5,
    color: brandColors.discountGreen,
    fontWeight: '700',
    flex: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginTop: spacing.sm,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraNavy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
    paddingBottom: spacing.xs,
  },
  bagItemRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    position: 'relative',
    gap: spacing.md,
  },
  itemImage: {
    width: 80,
    height: 106,
    borderRadius: 4,
    backgroundColor: brandColors.lightGray,
  },
  itemDetails: {
    flex: 1,
    gap: 4,
    paddingRight: 20,
  },
  itemBrand: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  itemTitle: {
    fontSize: 12,
    color: '#535665',
    fontWeight: '500',
  },
  sizeQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  variantBadge: {
    backgroundColor: brandColors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  variantBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: brandColors.myntraNavy,
  },
  quantityCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: brandColors.lightGray,
    borderRadius: 4,
    height: 24,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: brandColors.myntraNavy,
  },
  qtyVal: {
    fontSize: 10.5,
    fontWeight: '700',
    color: brandColors.myntraNavy,
    paddingHorizontal: 8,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  itemOriginalPrice: {
    fontSize: 10,
    color: '#9496A2',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  itemDiscountPercent: {
    fontSize: 10,
    color: brandColors.myntraPink,
    fontWeight: '700',
  },
  removeItemBtn: {
    position: 'absolute',
    top: 4,
    right: 0,
    padding: 4,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  couponInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: brandColors.myntraNavy,
  },
  couponApplyBtn: {
    height: 42,
    borderWidth: 1,
    borderColor: brandColors.myntraPink,
    borderRadius: 4,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponApplyBtnText: {
    color: brandColors.myntraPink,
    fontSize: 13,
    fontWeight: '800',
  },
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: brandColors.softGreen,
    padding: spacing.md,
    borderRadius: 4,
  },
  couponBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  couponBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.discountGreen,
  },
  removeCouponBtn: {
    paddingVertical: 4,
  },
  removeCouponBtnText: {
    color: brandColors.myntraPink,
    fontSize: 12,
    fontWeight: '800',
  },
  addressItem: {
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    borderRadius: 6,
    padding: spacing.md,
    gap: 4,
    marginTop: spacing.xs,
  },
  addressItemActive: {
    borderColor: '#FFD1D8',
    backgroundColor: '#FFF0F2',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  addressText: {
    fontSize: 10.5,
    color: '#535665',
    lineHeight: 16,
    paddingLeft: 26,
  },
  paymentItem: {
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    borderRadius: 6,
    padding: spacing.md,
    gap: 2,
    marginTop: spacing.xs,
  },
  paymentItemActive: {
    borderColor: '#FFD1D8',
    backgroundColor: '#FFF0F2',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  paymentLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  paymentSubtitle: {
    fontSize: 10.5,
    color: '#7E8190',
    paddingLeft: 26,
  },
  priceDetailsSection: {
    gap: spacing.sm,
  },
  priceDetailsTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#7E8190',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
    paddingBottom: spacing.xs,
    marginBottom: 4,
  },
  priceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSummaryLabel: {
    fontSize: 13,
    color: '#535665',
    fontWeight: '500',
  },
  priceSummaryValue: {
    fontSize: 13,
    color: brandColors.myntraNavy,
    fontWeight: '700',
  },
  priceTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: brandColors.borderLight,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  priceTotalLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: brandColors.myntraNavy,
  },
  priceTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: brandColors.myntraNavy,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: brandColors.borderLight,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarLeft: {
    gap: 2,
  },
  bottomBarPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: brandColors.myntraNavy,
  },
  bottomBarViewDetails: {
    fontSize: 10.5,
    color: brandColors.myntraPink,
    fontWeight: '800',
  },
  placeOrderBtn: {
    backgroundColor: brandColors.myntraPink,
    paddingHorizontal: 36,
    height: 46,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
