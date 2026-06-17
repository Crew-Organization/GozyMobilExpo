import { useMemo, useState, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import { api } from '@/src/lib/api';
import { Address as AppAddress, CommercePaymentMethod } from '@/src/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock data for special deals and summer ready items
const eorsSpecialDeals = [
  {
    id: 'szn-necklace',
    name: 'SZN Women Rhodium-Plated Necklace',
    brand: 'SZN',
    category: 'Fashion',
    subcategory: 'ethnic',
    price: 59,
    originalPrice: 449,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
    discount: 'SPECIAL PRICE',
  },
  {
    id: 'joy-wash',
    name: 'JOY Hydra Refresh Face Wash',
    brand: 'JOY',
    category: 'Beauty',
    subcategory: 'skincare',
    price: 161,
    originalPrice: 249,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=300&q=80',
    discount: '35% OFF',
  },
];

const summerReadyItems = [
  {
    id: 'joy-sunblock',
    name: 'JOY Hello Sun Sunblock Sunscreen',
    brand: 'JOY',
    category: 'Beauty',
    subcategory: 'skincare',
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80',
    discount: '25% OFF',
  },
  {
    id: 'vaseline-sun',
    name: 'Gluta-Hya SPF50 Serum Sunscreen',
    brand: 'Vaseline',
    category: 'Beauty',
    subcategory: 'skincare',
    price: 454,
    originalPrice: 699,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=300&q=80',
    discount: '35% OFF',
  },
];

export default function ShoppingCheckoutScreen() {
  const { refreshApp, products } = useApp();
  const {
    clearCart,
    commercePaymentMethod,
    shoppingCart,
    updateQuantity,
    addProduct,
    setShoppingOrderConfirmation,
  } = useSuperAppStore();

  // Three checkout steps: 'bag' | 'address' | 'payment'
  const [checkoutStep, setCheckoutStep] = useState<'bag' | 'address' | 'payment'>('bag');

  // Selected state for cart items (represented by product id list)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    shoppingCart.map((item) => item.id)
  );

  // Layout tabs active tag (only used on the 'bag' step)
  const [activeTab, setActiveTab] = useState<'items' | 'coupons' | 'price'>('items');

  // Donation state
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);

  // Coupon apply code states
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [showVoucherAlert, setShowVoucherAlert] = useState(true);

  // Address Bottom Sheet Location selector visible
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);

  // Payment expanded section identifier
  const [expandedPaymentSection, setExpandedPaymentSection] = useState<string | null>('upi');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>('phonepe');

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const mainScrollRef = useRef<ScrollView>(null);

  // Saved Mock Addresses
  const savedAddresses = [
    {
      name: 'V.Nikshitha',
      pincode: '131021',
      tag: 'HOME',
      line1: 'IIT DELHI, SONEPAT CAMPUS, PLOT NO 4B, near ashoka university',
      line2: 'Technopark, Khewra, Sonipat, Haryana',
      phone: '9347556415',
    },
    {
      name: 'V Nikshitha',
      pincode: '509324',
      tag: 'HOME',
      line1: '12-136/C/1/A/1, Kalwakurthy, Kalwakurthy',
      line2: 'TELANGANA',
      phone: '9347556415',
    },
  ];

  const address = savedAddresses[currentAddressIndex];

  // Dynamic values calculation
  const totalMRP = useMemo(() => {
    return shoppingCart.reduce((sum, item) => {
      const catalogItem = products.find((p) => p.id === item.sourceId) || { originalPrice: item.price };
      if (selectedItemIds.includes(item.id)) {
        return sum + catalogItem.originalPrice * item.quantity;
      }
      return sum;
    }, 0);
  }, [shoppingCart, selectedItemIds, products]);

  const discountOnMRP = useMemo(() => {
    return shoppingCart.reduce((sum, item) => {
      const catalogItem = products.find((p) => p.id === item.sourceId) || { originalPrice: item.price };
      if (selectedItemIds.includes(item.id)) {
        const diff = (catalogItem.originalPrice - item.price) * item.quantity;
        return sum + diff;
      }
      return sum;
    }, 0);
  }, [shoppingCart, selectedItemIds, products]);

  // Subtotal for selected items
  const subtotalSelected = useMemo(() => {
    return shoppingCart.reduce((sum, item) => {
      if (selectedItemIds.includes(item.id)) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
  }, [shoppingCart, selectedItemIds]);

  const platformFee = subtotalSelected > 0 ? 23 : 0;
  const couponDiscount = couponApplied ? 201 : 0;
  const donationAmount = selectedDonation || 0;
  const totalAmount = Math.max(0, subtotalSelected - couponDiscount + platformFee + donationAmount);

  if (!shoppingCart.length) {
    return <Redirect href="/shopping" />;
  }

  // Toggle item selection checkbox
  const toggleItemSelection = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedItemIds((prev) => [...prev, id]);
    }
  };

  // Select / Deselect All checkbox toggle
  const toggleSelectAll = () => {
    if (selectedItemIds.length === shoppingCart.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(shoppingCart.map((item) => item.id));
    }
  };

  // Anchor scroll trigger
  const scrollToAnchor = (anchor: 'items' | 'coupons' | 'price', offset: number) => {
    setActiveTab(anchor);
    mainScrollRef.current?.scrollTo({ y: offset, animated: true });
  };

  // Handle Header Back Action
  const handleBackPress = () => {
    if (checkoutStep === 'payment') {
      setCheckoutStep('address');
    } else if (checkoutStep === 'address') {
      setCheckoutStep('bag');
    } else {
      router.back();
    }
  };

  // Handle Step Continuation
  const handleStepContinue = () => {
    if (checkoutStep === 'bag') {
      if (selectedItemIds.length === 0) {
        alert('Please select at least one item to place order.');
        return;
      }
      setCheckoutStep('address');
    } else if (checkoutStep === 'address') {
      setCheckoutStep('payment');
    }
  };

  // Order Placement
  const placeOrder = async () => {
    const selectedItems = shoppingCart.filter((item) => selectedItemIds.includes(item.id));
    
    // Map the selected payment option string to CommercePaymentMethod type
    let paymentMethod: CommercePaymentMethod = 'upi';
    if (selectedPaymentOption === 'wallet' || selectedPaymentOption === 'paytm') {
      paymentMethod = 'wallet';
    } else if (selectedPaymentOption === 'card' || selectedPaymentOption === 'credit' || selectedPaymentOption === 'debit') {
      paymentMethod = 'card';
    }

    const confirmation = await api.createShoppingOrder({
      items: selectedItems,
      address: {
        id: `addr-${currentAddressIndex}`,
        label: address.tag,
        line1: address.line1,
        line2: `${address.line2}, Pincode: ${address.pincode}, Phone: ${address.phone}`,
      },
      paymentMethod,
    });
    setShoppingOrderConfirmation(confirmation);
    // Remove selected items from cart
    selectedItemIds.forEach((id) => {
      updateQuantity('shopping', id, 0);
    });
    await refreshApp();
    router.replace('/shopping-tracking');
  };

  const handleAddDealItem = (item: any) => {
    const productItem = {
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      subcategory: item.subcategory,
      price: item.price,
      originalPrice: item.originalPrice,
      rating: item.rating,
      image: item.image,
    };
    addProduct(productItem);
    // Automatically select the newly added item
    setTimeout(() => {
      setSelectedItemIds((prev) => [...prev, `product-${item.id}`]);
    }, 150);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedPaymentSection(expandedPaymentSection === sectionId ? null : sectionId);
  };

  // --- RENDERING STEP PROGRESS BAR ---
  const renderStepProgressBar = () => {
    return (
      <View style={styles.stepProgressBar}>
        {/* Bag */}
        <View style={styles.stepItem}>
          <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color="#10B981" />
          <Text style={[styles.stepText, styles.stepTextActive, { color: '#10B981' }]}>Bag</Text>
        </View>
        <View style={[styles.stepLine, checkoutStep !== 'bag' && styles.stepLineActive]} />
        
        {/* Address */}
        <View style={styles.stepItem}>
          {checkoutStep === 'payment' ? (
            <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color="#10B981" />
          ) : (
            <View style={[styles.stepCircle, checkoutStep === 'address' && styles.stepCircleActive]}>
              {checkoutStep === 'address' && <View style={styles.stepCircleDot} />}
            </View>
          )}
          <Text style={[styles.stepText, checkoutStep !== 'bag' && styles.stepTextActive, checkoutStep !== 'bag' && { color: '#10B981' }]}>Address</Text>
        </View>
        <View style={[styles.stepLine, checkoutStep === 'payment' && styles.stepLineActive]} />
        
        {/* Payment */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, checkoutStep === 'payment' && styles.stepCircleActive]}>
            {checkoutStep === 'payment' && <View style={styles.stepCircleDot} />}
          </View>
          <Text style={[styles.stepText, checkoutStep === 'payment' && styles.stepTextActive, checkoutStep === 'payment' && { color: '#10B981' }]}>Payment</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Step Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={handleBackPress} style={styles.headerBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </Pressable>

          {checkoutStep === 'bag' ? (
            <Pressable style={styles.addressContainer} onPress={() => setLocationSheetVisible(true)}>
              <View style={styles.addressLabelRow}>
                <Text style={styles.addressName}>{address.name} ({address.pincode})</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#1F2937" style={styles.dropdownIcon} />
              </View>
              <Text style={styles.addressMeta} numberOfLines={1}>
                {address.line1}, {address.line2}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.stepHeaderTitle}>
              {checkoutStep === 'address' ? 'ADDRESS' : 'PAYMENT'}
            </Text>
          )}

          <Pressable style={styles.headerBtn}>
            <MaterialCommunityIcons name="heart-outline" size={24} color="#1F2937" />
          </Pressable>
        </View>

        {/* Dynamic step headers: tabs on bag, progress line on checkout */}
        {checkoutStep === 'bag' ? (
          <View style={styles.tabRow}>
            <Pressable style={[styles.tabItem, activeTab === 'items' && styles.tabActive]} onPress={() => scrollToAnchor('items', 0)}>
              <Text style={[styles.tabLabel, activeTab === 'items' && styles.tabLabelActive]}>Items</Text>
            </Pressable>
            <Pressable style={[styles.tabItem, activeTab === 'coupons' && styles.tabActive]} onPress={() => scrollToAnchor('coupons', 560)}>
              <Text style={[styles.tabLabel, activeTab === 'coupons' && styles.tabLabelActive]}>Coupons & Bank Offers</Text>
            </Pressable>
            <Pressable style={[styles.tabItem, activeTab === 'price' && styles.tabActive]} onPress={() => scrollToAnchor('price', 980)}>
              <Text style={[styles.tabLabel, activeTab === 'price' && styles.tabLabelActive]}>Price Details</Text>
            </Pressable>
          </View>
        ) : (
          renderStepProgressBar()
        )}
      </SafeAreaView>

      <ScrollView ref={mainScrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* --- STEP 1: BAG --- */}
        {checkoutStep === 'bag' && (
          <View>
            {/* Special Deals Carousel (DEAL 1 / 2 / 3) */}
            <View style={styles.specialDealsBlock}>
              <View style={styles.eorsHeaderRow}>
                <View style={styles.eorsTag}>
                  <Text style={styles.eorsTagText}>END OF REASON SALE DEALS</Text>
                </View>
                <View style={styles.eorsSubTabs}>
                  <Pressable style={styles.eorsSubTabActive}><Text style={styles.eorsSubTabTextActive}>DEAL 1</Text></Pressable>
                  <Pressable style={styles.eorsSubTab}><Text style={styles.eorsSubTabText}>DEAL 2</Text></Pressable>
                  <Pressable style={styles.eorsSubTab}><Text style={styles.eorsSubTabText}>DEAL 3</Text></Pressable>
                </View>
              </View>
              <Text style={styles.dealsSubHeading}>Items unlocked! Get 1 item at special price ⓘ</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eorsDealsRow}>
                {eorsSpecialDeals.map((deal) => (
                  <View key={deal.id} style={styles.specialDealCard}>
                    <Image source={{ uri: deal.image }} style={styles.specialDealImage} />
                    <View style={styles.specialDealInfo}>
                      <Text style={styles.specialDealName} numberOfLines={1}>{deal.name}</Text>
                      <View style={styles.specialDealPriceRow}>
                        <Text style={styles.specialPrice}>₹{deal.price}</Text>
                        <Text style={styles.specialOriginalPrice}>₹{deal.originalPrice}</Text>
                        <View style={styles.specialBadge}>
                          <Text style={styles.specialBadgeText}>{deal.discount}</Text>
                        </View>
                      </View>
                      <Pressable style={styles.addDealBtn} onPress={() => handleAddDealItem(deal)}>
                        <Text style={styles.addDealBtnText}>Add</Text>
                      </Pressable>
                    </View>
                    <View style={styles.specialRatingBadge}>
                      <Text style={styles.specialRatingText}>{deal.rating} ★</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* You're saving alert banner */}
            <View style={styles.savingBanner}>
              <MaterialCommunityIcons name="percent-outline" size={18} color="#137333" style={styles.percentIcon} />
              <Text style={styles.savingText}>
                You're saving <Text style={{ fontWeight: '800' }}>₹{(discountOnMRP + couponDiscount).toLocaleString('en-IN')}</Text> on this order
              </Text>
            </View>

            {/* Collapsible Bag header */}
            <View style={styles.bagHeaderRow}>
              <Pressable style={styles.bagHeaderLeft} onPress={toggleSelectAll}>
                <MaterialCommunityIcons
                  name={selectedItemIds.length === shoppingCart.length ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                  size={20}
                  color={selectedItemIds.length === shoppingCart.length ? '#FF3F6C' : '#9CA3AF'}
                />
                <Text style={styles.bagHeaderCount}>
                  {selectedItemIds.length}/{shoppingCart.length} Items Selected
                </Text>
                <Text style={styles.bagHeaderPrice}> (₹{subtotalSelected.toLocaleString('en-IN')})</Text>
              </Pressable>
              <View style={styles.bagHeaderRight}>
                <Pressable style={styles.bagHeaderIcon}><MaterialCommunityIcons name="share-variant" size={20} color="#4B5563" /></Pressable>
                <Pressable style={styles.bagHeaderIcon} onPress={() => clearCart('shopping')}><MaterialCommunityIcons name="trash-can-outline" size={20} color="#4B5563" /></Pressable>
                <Pressable style={styles.bagHeaderIcon}><MaterialCommunityIcons name="heart-outline" size={20} color="#4B5563" /></Pressable>
              </View>
            </View>

            {/* List of bag items */}
            <View style={styles.cartItemsList}>
              {shoppingCart.map((item) => {
                const isChecked = selectedItemIds.includes(item.id);
                const catalogItem = products.find((p) => p.id === item.sourceId) || { originalPrice: item.price };
                const itemOff = Math.round(((catalogItem.originalPrice - item.price) / catalogItem.originalPrice) * 100);
                
                return (
                  <View key={item.id} style={styles.cartItemCard}>
                    <Pressable style={styles.checkboxTouch} onPress={() => toggleItemSelection(item.id)}>
                      <MaterialCommunityIcons
                        name={isChecked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                        size={22}
                        color={isChecked ? '#FF3F6C' : '#9CA3AF'}
                      />
                    </Pressable>

                    <Image source={{ uri: item.image }} style={styles.cartProductImage} />

                    <View style={styles.cartProductDetails}>
                      <Text style={styles.itemBrandName}>{item.subtitle || 'Fashion Studio'}</Text>
                      <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>

                      <View style={styles.selectorsRow}>
                        <View style={styles.selectPill}>
                          <Text style={styles.selectPillText}>Size: 36</Text>
                          <MaterialCommunityIcons name="chevron-down" size={12} color="#1F2937" />
                        </View>
                        <View style={styles.selectPill}>
                          <Text style={styles.selectPillText}>Qty: {item.quantity}</Text>
                          <MaterialCommunityIcons name="chevron-down" size={12} color="#1F2937" />
                        </View>

                        <Text style={styles.stockWarningText}>1 left</Text>
                      </View>

                      <View style={styles.itemPriceRow}>
                        <Text style={styles.itemPriceText}>₹{item.price.toLocaleString('en-IN')}</Text>
                        <Text style={styles.itemStrikeMRP}>₹{catalogItem.originalPrice.toLocaleString('en-IN')}</Text>
                        <Text style={styles.itemOffText}>{itemOff}% Off</Text>
                      </View>

                      <View style={styles.returnRow}>
                        <MaterialCommunityIcons name="keyboard-return" size={12} color="#4B5563" />
                        <Text style={styles.returnText}>7 days return available</Text>
                      </View>

                      <View style={styles.deliveryRow}>
                        <MaterialCommunityIcons name="truck-delivery-outline" size={14} color="#10B981" />
                        <Text style={styles.deliveryText}>Delivery by <Text style={{ fontWeight: '700' }}>18 Jun 2026</Text></Text>
                      </View>
                    </View>

                    <Pressable style={styles.removeBtn} onPress={() => updateQuantity('shopping', item.id, 0)}>
                      <MaterialCommunityIcons name="close" size={18} color="#4B5563" />
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {/* Gift Wrap Row */}
            <View style={styles.giftWrapCard}>
              <View style={styles.giftLeft}>
                <MaterialCommunityIcons name="gift-outline" size={20} color="#FF3F6C" style={{ marginRight: 8 }} />
                <Text style={styles.giftText} numberOfLines={2}>
                  Add gift wrap and a personalised{'\n'}message on a card for just ₹35.
                </Text>
              </View>
              <Pressable style={styles.addWrapBtn}><Text style={styles.addWrapBtnText}>Add</Text></Pressable>
            </View>

            {/* Donation & Support Row */}
            <View style={styles.donationCard}>
              <Text style={styles.donationTitle}>Donate & Support Transformative Social Work In India</Text>
              <Pressable style={styles.knowMoreLink}><Text style={styles.knowMoreText}>Know More</Text></Pressable>
              <View style={styles.donationChipsRow}>
                {[10, 20, 50, 80, 100].map((amt) => (
                  <Pressable
                    key={amt}
                    style={[styles.donationChip, selectedDonation === amt && styles.donationChipSelected]}
                    onPress={() => setSelectedDonation(selectedDonation === amt ? null : amt)}
                  >
                    <Text style={[styles.donationChipText, selectedDonation === amt && styles.donationChipTextSelected]}>₹{amt}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Coupons & Bank Offers Section */}
            <View style={styles.sectionDividerBlock}>
              <View style={styles.couponsHeader}>
                <Text style={styles.couponsTitle}>Coupons & Bank Offers</Text>
                <Pressable><Text style={styles.viewAllOffersText}>View All Offers</Text></Pressable>
              </View>

              {/* Yellow collapse promotion */}
              <View style={styles.discountCard}>
                <View style={styles.discountCardHeader}>
                  <MaterialCommunityIcons name="cash-multiple" size={20} color="#B45309" style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.discountHighlight}>Save upto ₹201</Text>
                    <Text style={styles.discountSubHighlight}>1 Coupon & Offer Available</Text>
                  </View>
                  <MaterialCommunityIcons name={showVoucherAlert ? 'chevron-up' : 'chevron-down'} size={20} color="#B45309" onPress={() => setShowVoucherAlert(!showVoucherAlert)} />
                </View>

                {showVoucherAlert && (
                  <View style={styles.discountCouponBody}>
                    <View style={styles.couponCodeRow}>
                      <View style={styles.couponLeft}>
                        <View style={styles.couponDottedBorder}>
                          <Text style={styles.couponCodeLabel}>MISSEDYOU</Text>
                        </View>
                        <Text style={styles.couponDiscountText}>Extra ₹201 OFF</Text>
                      </View>
                      <Pressable
                        style={[styles.couponApplyBtn, couponApplied && styles.couponAppliedBtn]}
                        onPress={() => setCouponApplied(!couponApplied)}
                      >
                        <Text style={[styles.couponApplyBtnText, couponApplied && styles.couponAppliedBtnText]}>
                          {couponApplied ? 'Applied!' : 'Apply'}
                        </Text>
                      </Pressable>
                    </View>
                    <Text style={styles.couponTnc}>10% off upto Rs. 200 on minimum purchase of Rs. 1999</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Get Summer Ready Slider */}
            <View style={styles.summerReadyBlock}>
              <Text style={styles.summerTitle}>Get Summer Ready</Text>
              <View style={styles.summerTabs}>
                <Pressable style={styles.summerTabActive}><Text style={styles.summerTabTextActive}>All</Text></Pressable>
                <Pressable style={styles.summerTab}><Text style={styles.summerTabText}>Body Sunscreen</Text></Pressable>
                <Pressable style={styles.summerTab}><Text style={styles.summerTabText}>Lip Balm</Text></Pressable>
                <Pressable style={styles.summerTab}><Text style={styles.summerTabText}>Necklace</Text></Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summerItemsRow}>
                {summerReadyItems.map((item) => (
                  <View key={item.id} style={styles.summerItemCard}>
                    <Image source={{ uri: item.image }} style={styles.summerItemImg} />
                    <View style={styles.summerItemInfo}>
                      <Text style={styles.summerItemBrand} numberOfLines={1}>{item.brand}</Text>
                      <Text style={styles.summerItemName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.summerItemPriceRow}>
                        <Text style={styles.summerPrice}>₹{item.price}</Text>
                        <Text style={styles.summerOriginalPrice}>₹{item.originalPrice}</Text>
                        <Text style={styles.summerDiscountText}>({item.discount})</Text>
                      </View>
                      <Pressable style={styles.summerItemAddBtn} onPress={() => handleAddDealItem(item)}>
                        <Text style={styles.summerItemAddText}>Add</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Add GST Details Section */}
            <View style={styles.gstCard}>
              <MaterialCommunityIcons name="card-bulleted-outline" size={22} color="#4B5563" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <View style={styles.gstLabelRow}>
                  <Text style={styles.gstLabel}>ADD GSTIN</Text>
                  <View style={styles.gstBadge}><Text style={styles.gstBadgeText}>NEW</Text></View>
                </View>
                <Text style={styles.gstSub}>Claim GST credit up to 28% on your order</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
            </View>
          </View>
        )}

        {/* --- STEP 2: ADDRESS --- */}
        {checkoutStep === 'address' && (
          <View style={styles.addressStepContainer}>
            <View style={styles.addressDetailsCard}>
              <View style={styles.addressCardTopLine}>
                <Text style={styles.addressCardNameBold}>{address.name}</Text>
                <View style={styles.savedCardTag}><Text style={styles.savedCardTagText}>{address.tag}</Text></View>
                <Pressable onPress={() => setLocationSheetVisible(true)} style={styles.changeAddressLink}>
                  <Text style={styles.changeAddressLinkText}>Change</Text>
                </Pressable>
              </View>
              <Text style={styles.addressCardLineFull}>
                {address.line1}, {address.line2}
              </Text>
              <Text style={styles.addressCardPhoneLabel}>Mobile: <Text style={{ fontWeight: '800' }}>{address.phone}</Text></Text>
            </View>

            {/* Delivery Estimates */}
            <View style={styles.estimatesBlock}>
              <Text style={styles.estimatesTitle}>DELIVERY ESTIMATES</Text>
              {shoppingCart.filter((item) => selectedItemIds.includes(item.id)).map((item) => (
                <View key={item.id} style={styles.estimateItemRow}>
                  <Image source={{ uri: item.image }} style={styles.estimateThumbImg} />
                  <Text style={styles.estimateDateText}>Estimated delivery by <Text style={{ fontWeight: '900' }}>18 Jun 2026</Text></Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* --- STEP 3: PAYMENT --- */}
        {checkoutStep === 'payment' && (
          <View style={styles.paymentStepContainer}>
            {/* Step header deals details */}
            <View style={styles.paymentOffersBanner}>
              <Text style={styles.paymentOffersTitle}>Coupons & Bank Offers</Text>
              <Pressable><Text style={styles.allOffersTextPink}>All offers {'>'}</Text></Pressable>
            </View>

            {/* Donation Block */}
            <View style={{ backgroundColor: '#FFFBEB', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#FEF08A' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="hand-heart" size={24} color="#D97706" />
                </View>
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>Donate ₹10 to MMT Foundation</Text>
                  <Text style={{ fontSize: 10.5, color: '#8E8E93', marginTop: 2 }}>& earn ₹100 myCash <Text style={{color: '#0084FF'}}>T&C</Text></Text>
                </View>
                <Pressable onPress={() => setSelectedDonation(selectedDonation ? null : 10)}>
                  <MaterialCommunityIcons name={selectedDonation ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={selectedDonation ? "#0084FF" : "#8E8E93"} />
                </Pressable>
              </View>
              <View style={{marginTop: 12}}>
                 <Text style={{ fontSize: 10.5, color: '#D97706', lineHeight: 16 }}>Contribute to the sustainable planting of 4 million trees by 2027!</Text>
              </View>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 12 }}>Payment Options</Text>

            {/* UPI Accordion */}
            <View style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden' }}>
               <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }} onPress={() => toggleSection('upi')}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                   <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png'}} style={{width: 32, height: 16}} resizeMode="contain" />
                   <View style={{marginLeft: 12}}>
                     <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>UPI Option</Text>
                     <Text style={{ fontSize: 10.5, color: '#8E8E93', marginTop: 4 }}>Pay Directly From Your Bank Account</Text>
                   </View>
                 </View>
                 <MaterialCommunityIcons name={expandedPaymentSection === 'upi' ? "chevron-up" : "chevron-down"} size={24} color="#8E8E93" />
               </Pressable>

               {expandedPaymentSection === 'upi' && (
                 <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA', backgroundColor: '#FAFAFA' }}>
                    <Text style={{fontSize: 12, fontWeight: '700', color: '#8E8E93', marginBottom: 12}}>Select UPI App</Text>
                    {[
                      { id: 'gpay', name: 'GPay', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-google-pay-2036034-1713217.png' },
                      { id: 'phonepe', name: 'PhonePe', logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-logo-icon.png' },
                      { id: 'paytm', name: 'Paytm', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-paytm-226448.png' },
                      { id: 'amazon', name: 'Amazon Pay', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-amazon-pay-226446.png' },
                    ].map(app => (
                      <Pressable key={app.id} onPress={() => setSelectedPaymentOption(app.id)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' }}>
                         <View style={{flexDirection: 'row', alignItems: 'center'}}>
                           <Image source={{uri: app.logo}} style={{width: 24, height: 24, borderRadius: 12}} resizeMode="contain" />
                           <Text style={{fontSize: 13, fontWeight: '700', color: '#333', marginLeft: 12}}>{app.name}</Text>
                         </View>
                         <MaterialCommunityIcons name={selectedPaymentOption === app.id ? "radiobox-marked" : "radiobox-blank"} size={20} color={selectedPaymentOption === app.id ? "#0084FF" : "#8E8E93"} />
                      </Pressable>
                    ))}

                    <View style={{backgroundColor: '#F5FAFF', padding: 12, borderRadius: 8, marginTop: 12}}>
                      <Text style={{fontSize: 10, color: '#0084FF', fontWeight: '600'}}>Amazon Pay UPI credit cards are live. Link your RuPay credit card via UPI right now to avail extra benefits.</Text>
                    </View>

                    <Pressable style={{ backgroundColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 12 }} onPress={placeOrder}>
                      <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '800' }}>PAY NOW VIA UPI</Text>
                    </Pressable>
                 </View>
               )}
            </View>

            {/* Credit / Debit Cards Accordion */}
            <View style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden' }}>
               <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }} onPress={() => toggleSection('card')}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                   <MaterialCommunityIcons name="credit-card-outline" size={24} color="#333" />
                   <View style={{marginLeft: 12}}>
                     <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>Credit/Debit/ATM Cards</Text>
                     <Text style={{ fontSize: 10.5, color: '#8E8E93', marginTop: 4 }}>Visa, MasterCard, Amex, RuPay and more</Text>
                   </View>
                 </View>
                 <MaterialCommunityIcons name={expandedPaymentSection === 'card' ? "chevron-up" : "chevron-down"} size={24} color="#8E8E93" />
               </Pressable>

               {expandedPaymentSection === 'card' && (
                 <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA', backgroundColor: '#FAFAFA' }}>
                    <View style={{ borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16, backgroundColor: '#FFF' }}>
                      <Text style={{ fontSize: 10, color: '#0084FF', fontWeight: '700', marginBottom: 4 }}>Enter Card Number</Text>
                      <TextInput value={cardNumber} onChangeText={setCardNumber} placeholder="XXXX XXXX XXXX XXXX" keyboardType="number-pad" style={{ fontSize: 13, color: '#333', padding: 0 }} />
                    </View>
                    <View style={{flexDirection: 'row', gap: 12, marginBottom: 20}}>
                      <View style={{ borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16, backgroundColor: '#FFF', flex: 1 }}>
                        <Text style={{ fontSize: 10, color: '#0084FF', fontWeight: '700', marginBottom: 4 }}>MM/YY</Text>
                        <TextInput value={cardExpiry} onChangeText={setCardExpiry} placeholder="MM/YY" style={{ fontSize: 13, color: '#333', padding: 0 }} />
                      </View>
                      <View style={{ borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16, backgroundColor: '#FFF', flex: 1 }}>
                        <Text style={{ fontSize: 10, color: '#0084FF', fontWeight: '700', marginBottom: 4 }}>CVV</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TextInput value={cardCvv} onChangeText={setCardCvv} placeholder="XXX" secureTextEntry keyboardType="number-pad" style={{ fontSize: 13, color: '#333', padding: 0, flex: 1 }} />
                          <MaterialCommunityIcons name="credit-card-scan-outline" size={20} color="#8E8E93" />
                        </View>
                      </View>
                    </View>

                    <Pressable style={{ backgroundColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 12 }} onPress={placeOrder}>
                      <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '800' }}>PAY NOW</Text>
                    </Pressable>
                 </View>
               )}
            </View>

            {/* Net Banking Accordion */}
            <View style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden' }}>
               <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }} onPress={() => toggleSection('netbank')}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                   <MaterialCommunityIcons name="bank-outline" size={24} color="#333" />
                   <View style={{marginLeft: 12}}>
                     <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>Net Banking</Text>
                     <Text style={{ fontSize: 10.5, color: '#8E8E93', marginTop: 4 }}>All major banks available</Text>
                   </View>
                 </View>
                 <MaterialCommunityIcons name={expandedPaymentSection === 'netbank' ? "chevron-up" : "chevron-down"} size={24} color="#8E8E93" />
               </Pressable>

               {expandedPaymentSection === 'netbank' && (
                 <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA', backgroundColor: '#FAFAFA' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 20 }}>
                      <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" />
                      <TextInput placeholder="Search Bank Here" style={{flex: 1, marginLeft: 8}} />
                    </View>

                    <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 12}}>Popular Banks</Text>
                    <View style={{ backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA' }}>
                       {[
                         { id: 'axis', name: 'Axis Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Axis_Bank_logo.svg/512px-Axis_Bank_logo.svg.png' },
                         { id: 'hdfc', name: 'HDFC Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/512px-HDFC_Bank_Logo.svg.png' },
                         { id: 'icici', name: 'ICICI Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/512px-ICICI_Bank_Logo.svg.png' },
                         { id: 'sbi', name: 'State Bank of India', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/512px-SBI-logo.svg.png' },
                       ].map(bank => (
                         <Pressable key={bank.id} onPress={placeOrder} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                              <Image source={{uri: bank.logo}} style={{width: 24, height: 24, borderRadius: 4}} resizeMode="contain" />
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
            <View style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden' }}>
               <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }} onPress={() => toggleSection('wallet')}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                   <MaterialCommunityIcons name="wallet-outline" size={24} color="#333" />
                   <View style={{marginLeft: 12}}>
                     <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>Mobile Wallets and Gift Cards</Text>
                     <Text style={{ fontSize: 10.5, color: '#8E8E93', marginTop: 4 }}>Amazon Pay, Mobikwik, PayZapp</Text>
                   </View>
                 </View>
                 <MaterialCommunityIcons name={expandedPaymentSection === 'wallet' ? "chevron-up" : "chevron-down"} size={24} color="#8E8E93" />
               </Pressable>
            </View>

            {/* Terms Disclaimer */}
            <Text style={styles.legalDisclaimer}>
              By placing the order, you agree to Myntra's <Text style={{ color: '#FF3F6C', fontWeight: '800' }}>Terms of Use</Text> and <Text style={{ color: '#FF3F6C', fontWeight: '800' }}>Privacy Policy</Text>
            </Text>
          </View>
        )}

        {/* --- COMMON PRICE DETAILS FOR SCROLLABLE SECTIONS IN CHECKOUT STEPS --- */}
        {checkoutStep !== 'payment' && (
          <View style={styles.priceBreakdownCard}>
            <Text style={styles.priceSectionTitle}>Price Details</Text>

            <View style={styles.priceDetailLine}>
              <Text style={styles.priceDetailLabel}>Total MRP</Text>
              <Text style={styles.priceDetailVal}>₹{totalMRP.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.priceDetailLine}>
              <Text style={styles.priceDetailLabel}>Discount on MRP</Text>
              <Text style={[styles.priceDetailVal, { color: '#137333' }]}>- ₹{discountOnMRP.toLocaleString('en-IN')}</Text>
            </View>

            {couponApplied && (
              <View style={styles.priceDetailLine}>
                <Text style={styles.priceDetailLabel}>Coupon Discount (MISSEDYOU)</Text>
                <Text style={[styles.priceDetailVal, { color: '#137333' }]}>- ₹201</Text>
              </View>
            )}

            <View style={styles.priceDetailLine}>
              <Text style={styles.priceDetailLabel}>
                Platform Fee <Text style={{ textDecorationLine: 'underline', color: '#FF3F6C' }}>Know More</Text>
              </Text>
              <Text style={styles.priceDetailVal}>₹{platformFee}</Text>
            </View>

            {selectedDonation && (
              <View style={styles.priceDetailLine}>
                <Text style={styles.priceDetailLabel}>Donation</Text>
                <Text style={styles.priceDetailVal}>₹{selectedDonation}</Text>
              </View>
            )}

            <View style={[styles.priceDetailLine, styles.totalLine]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            </View>

            {/* Savings Badge */}
            <View style={styles.priceSavingAlert}>
              <MaterialCommunityIcons name="percent" size={14} color="#137333" style={{ marginRight: 6 }} />
              <Text style={styles.priceSavingText}>
                You're saving <Text style={{ fontWeight: '800' }}>₹{(discountOnMRP + couponDiscount).toLocaleString('en-IN')}</Text> on this order
              </Text>
            </View>

            {/* Cashback Card Promo */}
            <View style={styles.cashbackPromo}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=80&q=80' }}
                style={styles.creditCardImg}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.cashbackTitle}>Get 7.5% cashback</Text>
                <Text style={styles.cashbackDesc}>Flipkart Axis Bank Credit Card</Text>
              </View>
              <Pressable style={styles.applyNowPromoBtn}><Text style={styles.applyNowPromoText}>Apply Now {'>'}</Text></Pressable>
            </View>

            {/* MMT style Trust icons */}
            <View style={styles.trustBadgesRow}>
              <View style={styles.trustBadgeItem}>
                <MaterialCommunityIcons name="shield-check-outline" size={24} color="#FF3F6C" />
                <Text style={styles.trustBadgeText}>Genuine Products</Text>
              </View>
              <Text style={styles.trustDivider}>•</Text>
              <View style={styles.trustBadgeItem}>
                <MaterialCommunityIcons name="truck-fast-outline" size={24} color="#FF3F6C" />
                <Text style={styles.trustBadgeText}>Contactless Delivery</Text>
              </View>
              <Text style={styles.trustDivider}>•</Text>
              <View style={styles.trustBadgeItem}>
                <MaterialCommunityIcons name="lock-outline" size={24} color="#FF3F6C" />
                <Text style={styles.trustBadgeText}>Secure Payments</Text>
              </View>
            </View>

            <Text style={styles.legalDisclaimer}>
              By placing the order, you agree to Myntra's <Text style={{ color: '#FF3F6C', fontWeight: '800' }}>Terms of Use</Text> and <Text style={{ color: '#FF3F6C', fontWeight: '800' }}>Privacy Policy</Text>
            </Text>
          </View>
        )}

        {/* Bottom spacer for sticky bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 13. Sticky bottom order confirmation bar */}
      {checkoutStep !== 'payment' && (
        <View style={styles.stickyFooter}>
          <View style={styles.footerSummaryStrip}>
            <Text style={styles.footerSummaryText}>
              {selectedItemIds.length} Items selected for order
            </Text>
          </View>

          {/* Dynamic primary CTA based on step */}
          {checkoutStep === 'bag' && (
            <Pressable onPress={handleStepContinue} style={styles.placeOrderBtn}>
              <Text style={styles.placeOrderBtnText}>Place Order</Text>
            </Pressable>
          )}
          {checkoutStep === 'address' && (
            <Pressable onPress={handleStepContinue} style={styles.placeOrderBtn}>
              <Text style={styles.placeOrderBtnText}>CONTINUE</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Sticky Price Details bottom drawer drawer on Payment Step */}
      {checkoutStep === 'payment' && (
        <View style={styles.paymentStickyDrawer}>
          <Text style={styles.paymentStickyTitle}>Price Details ({selectedItemIds.length} item)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.paymentStickyVal}>Total Amount: <Text style={{ fontWeight: '900', color: '#1F2937' }}>₹{totalAmount.toLocaleString('en-IN')}</Text></Text>
            <MaterialCommunityIcons name="chevron-up" size={20} color="#1F2937" style={{ marginLeft: 4 }} />
          </View>
        </View>
      )}

      {/* 14. Location Selector Bottom Sheet Modal */}
      <Modal
        visible={locationSheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLocationSheetVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setLocationSheetVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Location</Text>
              <Pressable onPress={() => setLocationSheetVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#1F2937" />
              </Pressable>
            </View>

            {/* Pincode check search */}
            <View style={styles.pincodeInputBox}>
              <TextInput placeholder="Enter Pincode" style={styles.pincodeInput} placeholderTextColor="#9CA3AF" />
              <Pressable style={styles.checkBtn}><Text style={styles.checkBtnText}>Check Pincode</Text></Pressable>
            </View>

            {/* GPS current location */}
            <Pressable style={styles.sheetRow}>
              <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#FF3F6C" style={{ marginRight: 10 }} />
              <Text style={styles.sheetRowLabel}>Use my current Location</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#FF3F6C" style={{ marginLeft: 'auto' }} />
            </Pressable>

            {/* Search Location */}
            <Pressable style={styles.sheetRow}>
              <MaterialCommunityIcons name="map-search-outline" size={20} color="#FF3F6C" style={{ marginRight: 10 }} />
              <Text style={styles.sheetRowLabel}>Search Location</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#FF3F6C" style={{ marginLeft: 'auto' }} />
            </Pressable>

            {/* OR line */}
            <View style={styles.orDividerRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or</Text>
              <View style={styles.orLine} />
            </View>

            {/* Address Selector list */}
            <View style={styles.sheetSavedHeader}>
              <Text style={styles.sheetSavedTitle}>Select Saved Address</Text>
              <Pressable><Text style={styles.addAddressLink}>Add New {'>'}</Text></Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 220 }}>
              {savedAddresses.map((addr, index) => (
                <Pressable
                  key={index}
                  style={[styles.savedAddressCard, currentAddressIndex === index && styles.savedAddressCardActive]}
                  onPress={() => {
                    setCurrentAddressIndex(index);
                    setLocationSheetVisible(false);
                  }}
                >
                  <View style={styles.savedCardTop}>
                    <Text style={styles.savedCardName}>{addr.name} , {addr.pincode}</Text>
                    <View style={styles.savedCardTag}><Text style={styles.savedCardTagText}>{addr.tag}</Text></View>
                    <MaterialCommunityIcons
                      name={currentAddressIndex === index ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                      size={20}
                      color={currentAddressIndex === index ? '#FF3F6C' : '#9CA3AF'}
                      style={{ marginLeft: 'auto' }}
                    />
                  </View>
                  <Text style={styles.savedCardLine} numberOfLines={2}>
                    {addr.line1}, {addr.line2}
                  </Text>
                  <Text style={styles.savedCardPhone}>Mob: {addr.phone}</Text>

                  <View style={styles.savedCardFooter}>
                    <Pressable style={styles.cardDeliveringBtn}><Text style={styles.cardDeliveringBtnText}>Delivering Here</Text></Pressable>
                    <Pressable style={styles.cardEditBtn}><Text style={styles.cardEditBtnText}>Edit</Text></Pressable>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Add New Address large button */}
            <Pressable style={styles.sheetAddBtn}>
              <MaterialCommunityIcons name="plus" size={20} color="#FF3F6C" style={{ marginRight: 6 }} />
              <Text style={styles.sheetAddBtnText}>Add New Address</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  headerBtn: {
    padding: 4,
  },
  addressContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  addressMeta: {
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 1,
  },
  tabRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF3F6C',
  },
  tabLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#FF3F6C',
    fontWeight: '900',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Step Progress Bar Styles
  stepProgressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepText: {
    fontSize: 10.5,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  stepTextActive: {
    color: '#1F2937',
  },
  stepCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    borderColor: '#10B981',
    backgroundColor: '#FFFFFF',
  },
  stepCircleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  stepLineActive: {
    backgroundColor: '#10B981',
  },
  stepHeaderTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // EORS Special deals carousel
  specialDealsBlock: {
    backgroundColor: '#FFFBEB',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
  },
  eorsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  eorsTag: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  eorsTagText: {
    color: '#B45309',
    fontSize: 8,
    fontWeight: '800',
  },
  eorsSubTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  eorsSubTabActive: {
    backgroundColor: '#FF3F6C',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eorsSubTabTextActive: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  eorsSubTab: {
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eorsSubTabText: {
    color: '#4B5563',
    fontSize: 9,
    fontWeight: '700',
  },
  dealsSubHeading: {
    paddingHorizontal: 16,
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 8,
  },
  eorsDealsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  specialDealCard: {
    width: 250,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 8,
    position: 'relative',
  },
  specialDealImage: {
    width: 70,
    height: 85,
    borderRadius: 6,
  },
  specialDealInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  specialDealName: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  specialDealPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  specialPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F2937',
  },
  specialOriginalPrice: {
    fontSize: 9,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  specialBadge: {
    backgroundColor: '#E6F4EA',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  specialBadgeText: {
    color: '#137333',
    fontSize: 7,
    fontWeight: '800',
  },
  addDealBtn: {
    borderColor: '#FF3F6C',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: 6,
  },
  addDealBtnText: {
    color: '#FF3F6C',
    fontSize: 10,
    fontWeight: '800',
  },
  specialRatingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  specialRatingText: {
    fontSize: 8,
    color: '#137333',
    fontWeight: '900',
  },

  // Savings Alert
  savingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  percentIcon: {
    marginRight: 8,
  },
  savingText: {
    color: '#137333',
    fontSize: 12,
    fontWeight: '600',
  },

  // Bag Header Row
  bagHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  bagHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bagHeaderCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    marginLeft: 8,
  },
  bagHeaderPrice: {
    fontSize: 12,
    color: '#6B7280',
  },
  bagHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bagHeaderIcon: {
    padding: 2,
  },

  // List of Cart Items
  cartItemsList: {
    backgroundColor: '#FFFFFF',
  },
  cartItemCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  checkboxTouch: {
    justifyContent: 'center',
    marginRight: 12,
  },
  cartProductImage: {
    width: 80,
    height: 105,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  cartProductDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemBrandName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  itemTitle: {
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 2,
  },
  selectorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  selectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
    backgroundColor: '#F9FAFB',
  },
  selectPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
  },
  stockWarningText: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 4,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  itemPriceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  itemStrikeMRP: {
    fontSize: 10,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  itemOffText: {
    color: '#FF3F6C',
    fontSize: 10,
    fontWeight: '800',
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  returnText: {
    fontSize: 9,
    color: '#4B5563',
    fontWeight: '600',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  deliveryText: {
    fontSize: 9,
    color: '#4B5563',
  },
  removeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 2,
  },

  // Gift wrap card
  giftWrapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  giftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  giftText: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '600',
    lineHeight: 15,
  },
  addWrapBtn: {
    borderWidth: 1,
    borderColor: '#FF3F6C',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addWrapBtnText: {
    color: '#FF3F6C',
    fontSize: 10.5,
    fontWeight: '800',
  },

  // Donation Row
  donationCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  donationTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F2937',
    lineHeight: 16,
  },
  knowMoreLink: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  knowMoreText: {
    fontSize: 10.5,
    color: '#FF3F6C',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  donationChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  donationChip: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  donationChipSelected: {
    borderColor: '#FF3F6C',
    backgroundColor: '#FFF0F3',
  },
  donationChipText: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
  },
  donationChipTextSelected: {
    color: '#FF3F6C',
  },

  // Coupons Section
  sectionDividerBlock: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  couponsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  couponsTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  viewAllOffersText: {
    fontSize: 10.5,
    color: '#FF3F6C',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  discountCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    overflow: 'hidden',
  },
  discountCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  discountHighlight: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  discountSubHighlight: {
    fontSize: 9,
    color: '#D97706',
    marginTop: 1,
  },
  discountCouponBody: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#FEF3C7',
    backgroundColor: '#FFFFFF',
  },
  couponCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponDottedBorder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B45309',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#FFFBEB',
  },
  couponCodeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309',
  },
  couponDiscountText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1F2937',
  },
  couponApplyBtn: {
    borderColor: '#FF3F6C',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  couponAppliedBtn: {
    backgroundColor: '#E6F4EA',
    borderColor: '#10B981',
  },
  couponAppliedBtnText: {
    color: '#10B981',
  },
  couponApplyBtnText: {
    color: '#FF3F6C',
    fontSize: 10.5,
    fontWeight: '800',
  },
  couponTnc: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 6,
  },

  // Summer Ready Slider
  summerReadyBlock: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
    paddingHorizontal: 16,
  },
  summerTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  summerTabActive: {
    borderColor: '#FF3F6C',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FFF0F3',
  },
  summerTabTextActive: {
    color: '#FF3F6C',
    fontSize: 10,
    fontWeight: '800',
  },
  summerTab: {
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  summerTabText: {
    color: '#4B5563',
    fontSize: 10,
    fontWeight: '700',
  },
  summerItemsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  summerItemCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  summerItemImg: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  summerItemInfo: {
    padding: 8,
  },
  summerItemBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1F2937',
  },
  summerItemName: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 1,
  },
  summerItemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  summerPrice: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1F2937',
  },
  summerOriginalPrice: {
    fontSize: 8,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  summerDiscountText: {
    color: '#FF3F6C',
    fontSize: 8,
    fontWeight: '800',
  },
  summerItemAddBtn: {
    borderColor: '#FF3F6C',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: 6,
  },
  summerItemAddText: {
    color: '#FF3F6C',
    fontSize: 10,
    fontWeight: '800',
  },

  // GST Card
  gstCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  gstLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gstLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  gstBadge: {
    backgroundColor: '#FF3F6C',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  gstBadgeText: {
    color: '#FFFFFF',
    fontSize: 6,
    fontWeight: '900',
  },
  gstSub: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },

  // Address Step Card Styles
  addressStepContainer: {
    paddingBottom: 20,
  },
  addressDetailsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  addressCardTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressCardNameBold: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  changeAddressLink: {
    marginLeft: 'auto',
  },
  changeAddressLinkText: {
    color: '#FF3F6C',
    fontSize: 12,
    fontWeight: '800',
  },
  addressCardLineFull: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 6,
    lineHeight: 16,
  },
  addressCardPhoneLabel: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 8,
  },
  estimatesBlock: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  estimatesTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#9CA3AF',
    marginBottom: 12,
  },
  estimateItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  estimateThumbImg: {
    width: 38,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  estimateDateText: {
    fontSize: 12,
    color: '#1F2937',
  },

  // Payment Step Styles
  paymentStepContainer: {
    paddingBottom: 20,
  },
  paymentOffersBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentOffersTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  allOffersTextPink: {
    color: '#FF3F6C',
    fontSize: 12,
    fontWeight: '800',
  },
  paymentSectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  paymentSectionTitleText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  recommendedCard: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
  },
  recommendedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    marginLeft: 10,
  },
  upiBrandLogoLarge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  payNowButtonLarge: {
    backgroundColor: '#FF3F6C',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  // Accordion card list
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  accordionHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  accordionHeaderBadge: {
    backgroundColor: '#E6F4EA',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  accordionBadgeText: {
    color: '#10B981',
    fontSize: 8,
    fontWeight: '900',
  },
  accordionContent: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  upiOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  upiOptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 10,
  },
  failureRateText: {
    fontSize: 9,
    color: '#EA580C',
    marginTop: 2,
    marginLeft: 10,
  },
  walletLinkText: {
    color: '#FF3F6C',
    fontSize: 10.5,
    fontWeight: '800',
  },
  emiWarningText: {
    fontSize: 9,
    color: '#D97706',
    marginTop: 2,
    marginLeft: 10,
  },

  // Credit Card Forms
  axisCashbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFbeb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 10,
    marginTop: 12,
  },
  axisCardPromoImg: {
    width: 28,
    height: 18,
    borderRadius: 2,
    marginRight: 10,
  },
  axisPromoTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1F2937',
  },
  axisPromoSub: {
    fontSize: 9,
    color: '#4B5563',
    marginTop: 1,
  },
  cardInfoDisclaimer: {
    fontSize: 10,
    color: '#4B5563',
    marginVertical: 12,
  },
  cardInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  cardInputRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  // Gift Card Pay Row
  giftCardPayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 14,
  },
  giftCardPayText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  giftCardPayBtnText: {
    color: '#FF3F6C',
    fontSize: 12,
    fontWeight: '900',
  },

  // Price Details Card
  priceBreakdownCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  priceSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceDetailLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  priceDetailLabel: {
    fontSize: 12,
    color: '#4B5563',
  },
  priceDetailVal: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '700',
  },
  totalLine: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  totalVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  priceSavingAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 12,
  },
  priceSavingText: {
    color: '#137333',
    fontSize: 10,
    fontWeight: '600',
  },
  cashbackPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    borderColor: '#FDBA74',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 14,
  },
  creditCardImg: {
    width: 32,
    height: 22,
    borderRadius: 3,
    marginRight: 8,
  },
  cashbackTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1F2937',
  },
  cashbackDesc: {
    fontSize: 9,
    color: '#4B5563',
  },
  applyNowPromoBtn: {
    paddingHorizontal: 6,
  },
  applyNowPromoText: {
    color: '#FF3F6C',
    fontSize: 10,
    fontWeight: '800',
  },
  trustBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  trustBadgeItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustBadgeText: {
    fontSize: 8,
    color: '#4B5563',
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  trustDivider: {
    color: '#D1D5DB',
    fontSize: 12,
    marginHorizontal: 4,
  },
  legalDisclaimer: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 13,
    marginTop: 16,
  },

  // Sticky Footer
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    zIndex: 100,
  },
  footerSummaryStrip: {
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    paddingVertical: 6,
  },
  footerSummaryText: {
    color: '#C2185B',
    fontSize: 10,
    fontWeight: '800',
  },
  placeOrderBtn: {
    backgroundColor: '#FF3F6C',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 4,
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Sticky Price Details Drawer on Payment
  paymentStickyDrawer: {
    position: 'absolute',
    bottom: 78,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
  },
  paymentStickyTitle: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
  },
  paymentStickyVal: {
    fontSize: 12,
    color: '#1F2937',
  },

  // Modal Location Bottom Sheet Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 24,
    maxHeight: SCREEN_HEIGHT * 0.82,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  pincodeInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  pincodeInput: {
    flex: 1,
    height: 38,
    fontSize: 13,
    color: '#1F2937',
    paddingVertical: 0,
  },
  checkBtn: {
    paddingHorizontal: 8,
  },
  checkBtnText: {
    color: '#FF3F6C',
    fontSize: 12,
    fontWeight: '800',
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetRowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF3F6C',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 10.5,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  sheetSavedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sheetSavedTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  addAddressLink: {
    color: '#FF3F6C',
    fontSize: 10.5,
    fontWeight: '800',
  },
  savedAddressCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  savedAddressCardActive: {
    borderColor: '#FF3F6C',
    backgroundColor: '#FFF0F3',
  },
  savedCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savedCardName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F2937',
  },
  savedCardTag: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  savedCardTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4B5563',
  },
  savedCardLine: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 14,
  },
  savedCardPhone: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 4,
  },
  savedCardFooter: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  cardDeliveringBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  cardDeliveringBtnText: {
    color: '#4B5563',
    fontSize: 10,
    fontWeight: '800',
  },
  cardEditBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  cardEditBtnText: {
    color: '#4B5563',
    fontSize: 10,
    fontWeight: '800',
  },
  sheetAddBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: '#F9FAFB',
  },
  sheetAddBtnText: {
    color: '#FF3F6C',
    fontSize: 12,
    fontWeight: '800',
  },
});
