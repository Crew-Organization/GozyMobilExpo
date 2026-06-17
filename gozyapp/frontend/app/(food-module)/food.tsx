


import { useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Dimensions, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// --- CORE DESIGN SYSTEM DATASETS ---
const CATEGORIES = [
  { id: "all", label: "All", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80" },
  { id: "chicken", label: "Chicken", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=150&q=80" },
  { id: "pizza", label: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&q=80" },
  { id: "north", label: "North Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=150&q=80" },
];

const CUISINES_LIST = [
  { id: "c1", label: "Chicken", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=150&q=80" },
  { id: "c2", label: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&q=80" },
  { id: "c3", label: "North Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=150&q=80" },
  { id: "c4", label: "Burger", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=150&q=80" },
  { id: "c5", label: "Cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=150&q=80" },
  { id: "c6", label: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=150&q=80" },
  { id: "c7", label: "Momo", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=150&q=80" },
  { id: "c8", label: "Thali", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80" },
];

const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "dist_asc", label: "Distance: Low to High" },
  { id: "rating_desc", label: "Rating: High to Low" },
  { id: "time_asc", label: "Delivery Time: Low to High" },
  { id: "cost_asc", label: "Cost for one: Low to High" },
  { id: "cost_desc", label: "Cost for one: High to Low" },
];

const EXPLORE = [
  { id: "offers", label: "Offers", iconLib: "tag-outline", color: "#3B82F6" },
  { id: "play", label: "Play & win", iconLib: "controller-classic-outline", color: "#0284C7" },
  { id: "top10", label: "Top 10", iconLib: "medal-outline", color: "#EAB308" },
  { id: "train", label: "Food on train", iconLib: "train", color: "#64748B" },
];

const SPOTLIGHT = [
  { id: "s1", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", title: "Legend Sardar", offer: "₹40 OFF above ₹149", rating: "3.7", reviews: "7.4K+" },
  { id: "s2", image: "https://images.unsplash.com/photo-1544025162-8315db8669fa?auto=format&fit=crop&w=600&q=80", title: "Chaap Platform", offer: "₹60 OFF above ₹199", rating: "4.3", reviews: "3.9K+" },
];

const RESTAURANTS = [
  { id: "1", image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80", badgeLeft: "Biryani • ₹250 for one", hasGold: true, title: "A One Chicken Briyani", rating: "3.9", reviews: "300+", meta: "Near & Fast", metaGreen: true, offer: "Flat ₹40 OFF above ₹149", isVeg: false, cuisine: "Biryani, Chicken", distance: "1.2 km" },
  { id: "2", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80", badgeLeft: "North Indian • ₹250 for one", hasGold: true, title: "Chaap Platform", rating: "4.3", reviews: "3.9K+", meta: "50-55 mins  |  5.9 km", metaGreen: false, offer: "Flat ₹60 OFF above ₹199", isVeg: false, cuisine: "North Indian, Rolls", distance: "5.9 km" },
  { id: "3", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", badgeLeft: "", hasGold: true, title: "McDonald's", rating: "4.0", reviews: "6.8K+", meta: "55-60 mins  |  6.2 km", metaGreen: false, offer: "55% OFF on select items", isVeg: false, cuisine: "Burgers, Fast Food", distance: "6.2 km" },
  { id: "4", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80", badgeLeft: "Pizza • ₹100 for one", hasGold: true, title: "Domino's Pizza", rating: "4.0", reviews: "1K+", meta: "25-30 mins  |  1.3 km", metaGreen: true, offer: "50% OFF on select items", isVeg: false, cuisine: "Pizza, Pasta", distance: "1.3 km" },
  { id: "5", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", badgeLeft: "", hasGold: true, title: "Kingsway Food", rating: "3.8", reviews: "2.1K+", meta: "40-45 mins  |  7.6 km", metaGreen: false, offer: "Select items at ₹99", isVeg: true, cuisine: "Chinese, Indian", distance: "7.6 km" },
];

const CAMPAIGN_RESTAURANTS = [
  { id: "cr1", name: "McDonald's", rating: "4.0", time: "50-55 mins", dist: "6.2 km", item: "McAloo Tikki Meal", originalPrice: 267, promoPrice: 133.5, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80", cuisine: "Burgers, Fast Food" },
  { id: "cr2", name: "Domino's Pizza", rating: "4.2", time: "25-30 mins", dist: "1.3 km", item: "Tandoori Loaded Chicken Taco", originalPrice: 402, promoPrice: 201, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80", cuisine: "Pizza, Pasta" }
];

const FILTER_TABS = [
  { id: "Sort By", icon: "sort-variant" },
  { id: "Time", icon: "clock-outline" },
  { id: "Rating", icon: "star-outline" },
  { id: "Offers", icon: "brightness-percent" },
  { id: "Dish Price", icon: "currency-inr" },
  { id: "Trust Markers", icon: "shield-check-outline" },
];

const QUICK_FILTERS = ["Great offers", "Rating 4.0+", "Pure Veg", "Under ₹150"];

const MENU_ITEMS = [
  { id: "m1", name: "Kadai Paneer", price: 158, desc: "Spicy and aromatic, Kadhai Paneer features paneer cubes cooked with bell peppers and more", rating: "Highly reordered", isVeg: true, isSpicy: true, image: "https://images.unsplash.com/photo-1618449840665-9f9a52c9c2a6?auto=format&fit=crop&w=300&q=80", customisable: true },
  { id: "m2", name: "Paneer Fried Rice", price: 149, desc: "Paneer Fried Rice — a flavorful Indo-Chinese dish with stir-fried rice, veggies, and more", rating: "Highly reordered", isVeg: true, isSpicy: false, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80", customisable: true },
  { id: "m3", name: "Special Thali", price: 249, desc: "A complete meal with dal, sabzi, roti, rice and dessert", rating: "Highly reordered", isVeg: true, isSpicy: false, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80", customisable: false },
  { id: "m4", name: "Dal Makhani", price: 198, desc: "Creamy and indulgent, Dal Makhani is a slow-cooked blend of black lentils and more", rating: "Highly reordered", isVeg: true, isSpicy: false, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80", customisable: true },
  { id: "m5", name: "Mix Veg", price: 189, desc: "Colorful and wholesome, Mix Veg is a medley of seasonal vegetables cooked to perfection", rating: "Highly reordered", isVeg: true, isSpicy: false, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80", customisable: false },
  { id: "m6", name: "Dal Khichdi", price: 119, desc: "Comfort food at its best - soft rice and lentils cooked to perfection", rating: "Highly reordered", isVeg: true, isSpicy: false, image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=300&q=80", customisable: false },
];

const MENU_SECTIONS = ["Most ordered together", "Recommended for you", "Thali", "Meals", "Soups", "Starters", "Main Course", "Chaap", "Breads", "Rice", "Fried Rice and Noodles"];
const MENU_COUNTS = [5, 25, 3, 3, 4, 8, 16, 4, 8, 4, 11];

/* ─────────────────────────────────────────────
    RESTAURANT DETAIL SCREEN PANEL
───────────────────────────────────────────── */
function RestaurantScreen({ restaurant, onBack, onNavigateToCheckout }: { restaurant: any; onBack: () => void; onNavigateToCheckout: () => void }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showMenuList, setShowMenuList] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("Recommended for you");
  
  // ── MOCK API INPUT STATE FOR MENU SEARCH ──
  const [menuSearchQuery, setMenuSearchQuery] = useState("");

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const addItem = (id: string) => { setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 })); };
  const removeItem = (id: string) => { setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n; }); };

  // ── FILTERING HANDLER (MOCK API EVALUATION) ──
  const insets = useSafeAreaInsets();
  const filteredMenuItems = MENU_ITEMS.filter(item => 
    item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(menuSearchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { maxWidth: 430, alignSelf: 'center', width: '100%' }]}>
      <View style={[styles.detailHeader, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={onBack} style={styles.backBtnNative}>
          <MaterialCommunityIcons name="chevron-left" size={26} color="#334155" />
        </Pressable>
        <View style={styles.detailSearchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color="#EF4444" />
          <TextInput 
            style={{ flex: 1, fontSize: 13, color: '#1E293B', padding: 0 }}
            placeholder={`Search in ${restaurant.title}...`}
            placeholderTextColor="#94A3B8"
            value={menuSearchQuery}
            onChangeText={setMenuSearchQuery}
          />
          {menuSearchQuery.length > 0 && (
            <Pressable onPress={() => setMenuSearchQuery("")}>
              <MaterialCommunityIcons name="close-circle" size={16} color="#94A3B8" />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => setBookmarked(!bookmarked)} style={styles.headerIconButton}>
          <MaterialCommunityIcons name={bookmarked ? "bookmark" : "bookmark-outline"} size={22} color={bookmarked ? "#EF4444" : "#334155"} />
        </Pressable>
        <Pressable style={styles.headerIconButton}>
          <MaterialCommunityIcons name="menu" size={22} color="#334155" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
          <View style={styles.detailMetaContainerRow}>
            <Text style={styles.detailRestTitle}>{restaurant.title}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.ratingBadgeRow}>
                <MaterialCommunityIcons name="star" size={11} color="#fff" />
                <Text style={styles.ratingBadgeText}>{restaurant.rating}</Text>
              </View>
              <Text style={styles.reviewsSubtext}>By {restaurant.reviews}</Text>
            </View>
          </View>
          
          <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
          <View style={styles.etaInfoRow}>
            <MaterialCommunityIcons name={restaurant.metaGreen ? "lightning-bolt" : "clock-outline"} size={14} color={restaurant.metaGreen ? "#16A34A" : "#64748B"} />
            <Text style={[styles.etaInfoText, { color: restaurant.metaGreen ? "#16A34A" : "#64748B" }]}>{restaurant.meta}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.locationSnippetText} numberOfLines={1}>1 Iit delhi,sonepat campu...</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="#64748B" />
          </View>

          <View style={styles.promoVoucherBanner}>
            <View style={{ flex: 1, paddingRight: 6 }}>
              <Text style={styles.promoEyebrow}>SPECIAL OFFER FOR YOU 🎁</Text>
              <Text style={styles.promoBodyText}>Get FREE JioSaavn Pro for 30 days & enjoy ad-free music</Text>
              <Text style={styles.promoFooterText}>Claim voucher after order is placed</Text>
            </View>
            <View style={styles.promoVerifiedBadge}>
              <Text style={styles.promoVerifiedText}>ADDED ✓</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.detailPillsScrollRow}>
          <Pressable onPress={() => setShowFilterModal(true)} style={styles.detailFilterBadgeBtn}>
            <MaterialCommunityIcons name="tune-variant" size={14} color="#334155" />
            <Text style={styles.detailFilterBadgeBtnText}>Filters</Text>
          </Pressable>
          {["Highly reordered", "Spicy"].map(f => (
            <View key={f} style={styles.detailStaticFilterBadge}><Text style={styles.detailFilterBadgeBtnText}>{f}</Text></View>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text style={styles.sectionHeadingHeader}>Most ordered together</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {[{ price: 179, img: MENU_ITEMS[0].image }, { price: 159, img: MENU_ITEMS[1].image }].map((m, i) => (
              <View key={i} style={styles.bundleComboMiniCard}>
                <Image source={{ uri: m.img }} style={styles.bundleComboCardImg} />
                <View style={{ padding: 8 }}>
                  <Text style={styles.bundleComboPriceText}>₹{m.price}</Text>
                  <Pressable style={styles.bundleComboActionBtn}>
                    <Text style={styles.bundleComboActionBtnText}>See items</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View style={styles.sectionRowTitleWrap}>
            <Text style={styles.sectionHeadingHeader}>
              {menuSearchQuery ? `Search Results (${filteredMenuItems.length})` : "Recommended for you"}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#334155" />
          </View>

          {filteredMenuItems.length === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <MaterialCommunityIcons name="food-off" size={48} color="#94A3B8" />
              <Text style={{ marginTop: 12, color: '#64748B', fontWeight: '600' }}>No dishes found matching &quot;{menuSearchQuery}&quot;</Text>
            </View>
          ) : (
            filteredMenuItems.map(item => (
              <View key={item.id} style={styles.menuListItemRowBlock}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={styles.vegIndicatorRow}>
                    <View style={[styles.vegOuterBorder, { borderColor: item.isVeg ? "#16A34A" : "#EF4444" }]}>
                      <View style={[styles.vegInnerDot, { backgroundColor: item.isVeg ? "#16A34A" : "#EF4444" }]} />
                    </View>
                    {item.isSpicy && <Text style={{ fontSize: 13 }}>🌶️</Text>}
                  </View>
                  <Text style={styles.menuItemTitleNameText}>{item.name}</Text>
                  
                  <View style={styles.reorderProgressRow}>
                    <View style={styles.reorderBarOuter}>
                      <View style={styles.reorderBarInner} />
                    </View>
                    <Text style={styles.reorderLabelText}>{item.rating}</Text>
                  </View>

                  <Text style={styles.menuItemPriceVal}>₹{item.price}</Text>
                  <Text style={styles.menuItemDescriptionText}>{item.desc}</Text>

                  <View style={{ flexDirection: 'row', gap: 14 }}>
                    <Pressable style={styles.menuActionIconPill}><MaterialCommunityIcons name="bookmark-outline" size={19} color="#64748B" /></Pressable>
                    <Pressable style={styles.menuActionIconPill}><MaterialCommunityIcons name="share-variant-outline" size={18} color="#64748B" /></Pressable>
                  </View>
                </View>

                <View style={styles.menuItemGraphicColumn}>
                  <Image source={{ uri: item.image }} style={styles.menuItemGraphicAssetImg} />
                  <View style={{ marginTop: -14 }}>
                    {cart[item.id] ? (
                      <View style={styles.qtyAdjusterFrame}>
                        <Pressable onPress={() => removeItem(item.id)} style={styles.qtyControlBtn}><Text style={styles.qtyControlBtnText}>−</Text></Pressable>
                        <Text style={styles.qtyValueDisplayLabel}>{cart[item.id]}</Text>
                        <Pressable onPress={() => addItem(item.id)} style={styles.qtyControlBtn}><Text style={styles.qtyControlBtnText}>+</Text></Pressable>
                      </View>
                    ) : (
                      <Pressable onPress={() => addItem(item.id)} style={styles.nativeAddButtonPill}>
                        <Text style={styles.nativeAddButtonPillText}>ADD</Text>
                        <Text style={styles.nativeAddButtonPillPlusSign}>+</Text>
                      </Pressable>
                    )}
                  </View>
                  {item.customisable && <Text style={styles.customisableSubtextTag}>customisable</Text>}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Pressable onPress={() => setShowMenuList(true)} style={[styles.floatingMenuPillBtn, { bottom: totalItems > 0 ? 88 : 28 }]}>
        <MaterialCommunityIcons name="silverware-fork-knife" size={16} color="#fff" />
        <Text style={styles.floatingMenuPillBtnText}>Menu</Text>
      </Pressable>

      {totalItems > 0 && (
        <View style={styles.stickyCartStripBar}>
          <View>
            <Text style={styles.cartStripCountText}>{totalItems} item{totalItems > 1 ? "s" : ""} added</Text>
            <Text style={styles.cartStripSubtext}>Extra charges may apply</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={styles.cartStripPriceValText}>₹{totalPrice}</Text>
            <Pressable onPress={onNavigateToCheckout} style={styles.cartStripSubmitBtn}>
              <Text style={styles.cartStripSubmitBtnText}>View Cart</Text>
            </Pressable>
          </View>
        </View>
      )}

      {showMenuList && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowMenuList(false)} />
          <View style={styles.menuIndexBottomDrawSheet}>
            <View style={styles.drawSheetHeaderBorder}>
              <Text style={styles.drawSheetHeadingTitleText}>Menu</Text>
              <Pressable onPress={() => setShowMenuList(false)}>
                <MaterialCommunityIcons name="close" size={22} color="#64748B" />
              </Pressable>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {MENU_SECTIONS.map((sec, i) => {
                const isCurrentActive = sec === activeSection;
                return (
                  <Pressable key={sec} onPress={() => { setActiveSection(sec); setShowMenuList(false); }} style={[styles.indexDrawSheetRowButton, isCurrentActive && { backgroundColor: '#FFF8F8', borderLeftColor: '#EF4444' }]}>
                    <Text style={[styles.indexDrawSheetRowLabel, isCurrentActive && { fontWeight: '800', color: '#EF4444' }]}>{sec}</Text>
                    <Text style={styles.indexDrawSheetCountText}>{MENU_COUNTS[i]}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {showFilterModal && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowFilterModal(false)} />
          <View style={styles.miniFilterDrawSheet}>
            <View style={styles.miniFilterHeader}>
              <Text style={styles.miniFilterHeadingTitleText}>Filters and Sorting</Text>
              <Pressable onPress={() => setShowFilterModal(false)}><MaterialCommunityIcons name="close" size={22} color="#64748B" /></Pressable>
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.miniFilterSubSectionTitle}>Sort by</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {["Price - low to high", "Price - high to low"].map(opt => {
                  const isMatch = sortBy === opt;
                  return (
                    <Pressable key={opt} onPress={() => setSortBy(isMatch ? null : opt)} style={[styles.miniFilterGridToggleBtn, isMatch && { borderColor: '#EF4444', backgroundColor: '#FFF1F1' }]}>
                      <Text style={[styles.miniFilterGridToggleBtnText, isMatch && { color: '#EF4444' }]}>{opt}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.greenPureVegAlertBar}>
              <View style={styles.vegOuterBorderMini}><View style={styles.vegInnerDotMini} /></View>
              <Text style={styles.greenPureVegAlertBarText}>This restaurant is pure veg</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <Pressable onPress={() => { setSortBy(null); setShowFilterModal(false); }} style={styles.sheetActionBtnOutline}><Text style={styles.sheetActionBtnOutlineText}>Clear All</Text></Pressable>
              <Pressable onPress={() => setShowFilterModal(false)} style={styles.sheetActionBtnSolid}><Text style={styles.sheetActionBtnSolidText}>Apply (89)</Text></Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

/* ─────────────────────────────────────────────
    MAIN APP ROUTING HUB DASHBOARD 
───────────────────────────────────────────── */
export default function FoodDeliveryApp() {
  const [currentScreen, setCurrentScreen] = useState<"home" | "campaign" | "cuisines" | "checkout">("home");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [isVegMode, setIsVegMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("Sort By");
  const [activeNav, setActiveNav] = useState("delivery");
  const [sortSelected, setSortSelected] = useState("relevance");
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<{ [key: string]: boolean }>({});
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [spotlightDot, setSpotlightDot] = useState(0);
  const [activeScheduleDate, setActiveScheduleDate] = useState(0);
  const [activeTimeSlot, setActiveTimeSlot] = useState(0);
  
  const [activeRatingFilters, setActiveRatingFilters] = useState<string[]>([]);
  const [activePriceFilters, setActivePriceFilters] = useState<string[]>([]);
  const [activeOfferFilters, setActiveOfferFilters] = useState<string[]>([]);
  const [activeTrustFilters, setActiveTrustFilters] = useState<string[]>([]);
  const [activeCollectionFilters, setActiveCollectionFilters] = useState<string[]>([]);
  const [activeDeliveryTimeFilters, setActiveDeliveryTimeFilters] = useState<string[]>([]);
  const [isSortDropdownExpanded, setIsSortDropdownExpanded] = useState(true);

  // ── MOCK API INPUT STATE FOR RESTAURANT DASHBOARD SEARCH ──
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionLayouts = useRef<{ [key: string]: number }>({});

  if (selectedRestaurant) {
    return (
      <RestaurantScreen 
        restaurant={selectedRestaurant} 
        onBack={() => setSelectedRestaurant(null)} 
        onNavigateToCheckout={() => {
          setSelectedRestaurant(null);
          setCurrentScreen("checkout");
        }}
      />
    );
  }

  const toggleBookmark = (id: string) => { setBookmarks(b => ({ ...b, [id]: !b[id] })); };
  const toggleQuickFilter = (f: string) => setActiveQuickFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const toggleFilterKey = (item: string, stateArray: string[], setFunction: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFunction(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const scrollToSection = (tabId: string) => {
    setActiveFilterTab(tabId);
    const y = sectionLayouts.current[tabId];
    if (y !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y, animated: true });
    }
  };

  // ── FILTERING HANDLER (MOCK API EVALUATION) ──
  const filteredRestaurants = RESTAURANTS.filter(rest => 
    rest.title.toLowerCase().includes(dashboardSearchQuery.toLowerCase()) ||
    rest.cuisine.toLowerCase().includes(dashboardSearchQuery.toLowerCase())
  );

  // --- SCREEN LAYER 1: CAMPAIGN SCREEN (50% OFF ITEMS) ---
  if (currentScreen === "campaign") {
    return (
      <View style={styles.container}>
        <View style={styles.headerBlockWithBack}>
          <Pressable onPress={() => setCurrentScreen("home")} style={styles.backButtonCircle}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
          </Pressable>
          <Text style={styles.headerScreenTitleText}>Items at 50% OFF</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.heroBanner, { marginHorizontal: 0, borderRadius: 0 }]}>
            <Text style={styles.heroBannerTextLarge}>ITEMS AT</Text>
            <Text style={styles.heroBannerTextMassive}>50% OFF</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.detailPillsScrollRow}>
            {["Sort By", "Under ₹200", "₹200 - ₹400", "Pure Veg"].map((pill, i) => (
              <View key={i} style={styles.detailStaticFilterBadge}>
                <Text style={styles.detailFilterBadgeBtnText}>{pill}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            {CAMPAIGN_RESTAURANTS.map(rest => (
              <View key={rest.id} style={styles.campaignRestCard}>
                <View style={styles.campaignRestHeader}>
                  <View>
                    <Text style={styles.campaignRestName}>{rest.name}</Text>
                    <Text style={styles.campaignRestMetaText}>{rest.time} • {rest.dist}</Text>
                  </View>
                  <View style={styles.ratingBadgeRow}>
                    <Text style={styles.ratingBadgeText}>{rest.rating}</Text>
                    <MaterialCommunityIcons name="star" size={12} color="#FFF" />
                  </View>
                </View>

                <View style={styles.campaignProductBlock}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.campaignProductName}>{rest.item}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <Text style={styles.promoPriceText}>₹{rest.promoPrice}</Text>
                      <Text style={styles.originalPriceCrossText}>₹{rest.originalPrice}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Image source={{ uri: rest.image }} style={styles.campaignProductImg} />
                    <Pressable onPress={() => setCurrentScreen("checkout")} style={styles.campaignAddBtn}>
                      <Text style={styles.campaignAddBtnText}>ADD +</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // --- SCREEN LAYER 2: CUISINES & DISHES PICKER ---
  if (currentScreen === "cuisines") {
    return (
      <View style={styles.container}>
        <View style={styles.headerBlockWithBack}>
          <Pressable onPress={() => setCurrentScreen("home")} style={styles.backButtonCircle}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
          </Pressable>
          <Text style={styles.headerScreenTitleText}>Cuisines and dishes</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={styles.gridSectionHeading}>What are you looking for?</Text>
          <View style={styles.cuisineGridMatrix}>
            {CUISINES_LIST.map(item => (
              <Pressable key={item.id} onPress={() => setCurrentScreen("campaign")} style={styles.cuisineGridCellCard}>
                <Image source={{ uri: item.image }} style={styles.cuisineGridCellImg} />
                <Text style={styles.cuisineGridCellLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // --- SCREEN LAYER 3: CHECKOUT SYSTEM OVERLAY ---
  if (currentScreen === "checkout") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBlockWithBack}>
          <Pressable onPress={() => setCurrentScreen("home")} style={styles.backButtonCircle}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
          </Pressable>
          <View>
            <Text style={styles.headerScreenTitleText}>Roti and Boti</Text>
            <Text style={styles.headerScreenSubtitleText}>40-45 mins to Home</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          <View style={[styles.promoVoucherBanner, { margin: 16, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.promoEyebrow, { color: '#1E40AF' }]}>Save ₹45 with free delivery</Text>
              <Text style={[styles.promoBodyText, { color: '#2563EB' }]}>Renew Gold at ₹1 for 3 months</Text>
            </View>
            <Pressable style={styles.inlineApplyBtn}><Text style={styles.inlineApplyBtnText}>APPLY</Text></Pressable>
          </View>

          <View style={styles.checkoutBlockCard}>
            <Text style={styles.checkoutBlockHeading}>Items Box</Text>
            <View style={styles.checkoutItemRow}>
              <MaterialCommunityIcons name="square-circle" size={16} color="#16A34A" />
              <Text style={styles.checkoutItemName}>Tandoori Chicken (Half)</Text>
              <Text style={styles.checkoutItemQty}>1x</Text>
              <Text style={styles.checkoutItemPrice}>₹320</Text>
            </View>
          </View>

          <View style={styles.checkoutBlockCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.checkoutBlockHeading}>Delivery at Home</Text>
              <Pressable onPress={() => setShowAddressModal(true)}><Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '800' }}>Change</Text></Pressable>
            </View>
            <Text style={styles.addressBodyText}>IIT Delhi, Sonepat Campus, Plot No 48, Near Ashoka University, Khewra, India</Text>
          </View>

          <View style={styles.checkoutBlockCard}>
            <Text style={styles.checkoutBlockHeading}>Bill Summary</Text>
            <View style={styles.billBreakdownRow}><Text style={styles.billRowLabel}>Item Total</Text><Text style={styles.billRowValue}>₹320</Text></View>
            <View style={styles.billBreakdownRow}><Text style={styles.billRowLabel}>Delivery Charges</Text><Text style={[styles.billRowValue, { color: '#16A34A' }]}>FREE</Text></View>
            <View style={[styles.billBreakdownRow, { borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 8, paddingTop: 8 }]}><Text style={[styles.billRowLabel, { fontWeight: '900' }]}>Total Bill</Text><Text style={[styles.billRowValue, { fontWeight: '900' }]}>₹320</Text></View>
          </View>
        </ScrollView>

        <View style={styles.stickyCartStripBar}>
          <View>
            <Text style={styles.cartStripCountText}>₹320</Text>
            <Text style={styles.cartStripSubtext}>Using Google Pay UPI</Text>
          </View>
          <Pressable onPress={() => { router.push('/food-payment'); }} style={[styles.cartStripSubmitBtn, { backgroundColor: '#111' }]}>
            <Text style={[styles.cartStripSubmitBtnText, { color: '#FFF' }]}>Place Order</Text>
          </Pressable>
        </View>

        {showAddressModal && (
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setShowAddressModal(false)} />
            <View style={styles.menuIndexBottomDrawSheet}>
              <View style={styles.drawSheetHeaderBorder}>
                <Text style={styles.drawSheetHeadingTitleText}>Select an address</Text>
                <Pressable onPress={() => setShowAddressModal(false)}><MaterialCommunityIcons name="close" size={22} color="#64748B" /></Pressable>
              </View>
              
              <View style={{ padding: 16 }}>
                <Pressable style={styles.addAddressActionBtn}>
                  <MaterialCommunityIcons name="plus" size={20} color="#EF4444" />
                  <Text style={styles.addAddressActionBtnText}>Add Address</Text>
                </Pressable>
                
                <Pressable style={styles.blinkitSyncBtn}>
                  <MaterialCommunityIcons name="flash-outline" size={20} color="#EAB308" />
                  <Text style={styles.blinkitSyncBtnText}>Import addresses from Blinkit</Text>
                </Pressable>

                <Text style={styles.addressListLabel}>Saved Addresses</Text>
                <View style={styles.savedAddressCardCell}>
                  <MaterialCommunityIcons name="home-outline" size={22} color="#475569" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.savedAddressCardTitle}>Home</Text>
                    <Text style={styles.savedAddressCardDesc}>IIT Delhi, Sonepat Campus, Plot No 48, Khewra, India</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header Block Panel */}
        <View style={styles.headerBlock}>
          <View style={styles.headerRow}>
            <View style={styles.locationWrap}>
              <Pressable onPress={() => router.replace('/(explore)')} style={styles.backButtonCircle}>
                <MaterialCommunityIcons name="chevron-left" size={22} color="#1E293B" />
              </Pressable>
              <MaterialIcons name="location-on" size={22} color="#EF4444" />
              <View style={{ flex: 1 }}>
                <View style={styles.locationTitleRow}>
                  <Text style={styles.locationTitle}>Home</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#111" />
                </View>
                <Text style={styles.locationSubtitle} numberOfLines={1}>Iit delhi,sonepat campus,PLOT...</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <View style={styles.goldPill}>
                <Text style={styles.goldText}>GOLD</Text>
                <Text style={styles.goldPrice}>₹1</Text>
              </View>
              <View style={styles.iconCirclePink}>
                <MaterialCommunityIcons name="wallet-outline" size={20} color="#EF4444" />
              </View>
              <View style={styles.iconCircleBlue}>
                <Text style={styles.profileLetter}>V</Text>
              </View>
            </View>
          </View>

          {/* Search Dynamic Row input frame */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons name="magnify" size={24} color="#EF4444" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder='Search "Restaurant name or a dish..."'
                placeholderTextColor="#94A3B8"
                value={dashboardSearchQuery}
                onChangeText={setDashboardSearchQuery}
              />
              {dashboardSearchQuery.length > 0 && (
                <Pressable onPress={() => setDashboardSearchQuery("")} style={{ marginRight: 8 }}>
                  <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
                </Pressable>
              )}
              <View style={styles.micDivider} />
              <MaterialCommunityIcons name="microphone" size={22} color="#EF4444" />
            </View>
            <View style={styles.vegModeWrap}>
              <Text style={styles.vegModeText}>VEG{"\n"}MODE</Text>
              <Pressable style={[styles.toggleWrap, isVegMode && styles.toggleActive]} onPress={() => setIsVegMode(!isVegMode)}>
                <View style={[styles.toggleKnob, isVegMode && styles.toggleKnobActive]} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Brand Campaign Marketing Hero Banner Block frame representation */}
        <Pressable onPress={() => setCurrentScreen("campaign")} style={styles.heroBanner}>
          <View style={styles.heroBg}>
            <Text style={styles.heroBannerTextLarge}>ITEMS AT</Text>
            <Text style={styles.heroBannerTextMassive}>50% OFF</Text>
            <View style={styles.heroOrderBtn}>
              <Text style={styles.heroOrderBtnText}>Order now</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#FFF" />
            </View>
            <View style={styles.heroDots}>
              <View style={styles.dotActive} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </Pressable>

        {/* Quick Collections Categories Module */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            <Pressable onPress={() => setCurrentScreen("cuisines")} style={styles.mealsBlock}>
              <View style={styles.mealsCard}>
                <Text style={styles.mealsEyebrow}>MEALS UNDER</Text>
                <Text style={styles.mealsPrice}>₹250</Text>
                <Text style={styles.mealsExplore}>Explore {'>'}</Text>
              </View>
            </Pressable>

            {CATEGORIES.map(cat => (
              <Pressable key={cat.id} style={styles.categoryPill} onPress={() => setCurrentScreen("cuisines")}>
                <Image source={{ uri: cat.image }} style={styles.categoryImg} />
                <Text style={[styles.categoryLabel, activeCategory === cat.id && styles.categoryLabelActive]}>{cat.label}</Text>
                {activeCategory === cat.id && <View style={styles.categoryIndicator} />}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Horizontal Action Fast Trigger Custom Filter badged buttons rows array maps */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickFiltersScroll}>
          <Pressable style={styles.quickFilterBtn} onPress={() => setShowFilterModal(true)}>
            <MaterialCommunityIcons name="tune" size={16} color="#111" />
            <Text style={styles.quickFilterText}>Filters</Text>
            <MaterialCommunityIcons name="menu-down" size={16} color="#111" />
          </Pressable>
          {QUICK_FILTERS.map(f => {
            const isSelected = activeQuickFilters.includes(f);
            return (
              <Pressable key={f} onPress={() => toggleQuickFilter(f)} style={[styles.quickFilterBtn, isSelected && { borderColor: '#EF4444', backgroundColor: '#FFF1F1' }]}>
                <Text style={[styles.quickFilterText, isSelected && { color: '#EF4444' }]}>{f}</Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.quickFilterBtn} onPress={() => setShowScheduleModal(true)}>
            <Text style={styles.quickFilterText}>Schedule</Text>
            <MaterialCommunityIcons name="menu-down" size={16} color="#111" />
          </Pressable>
        </ScrollView>

        <View style={styles.etaFiltersRow}>
          <View style={styles.etaFilterItem}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#16A34A" />
            <Text style={styles.etaFilterTextGreen}>25-30 mins</Text>
          </View>
          <View style={styles.etaFilterItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
            <Text style={styles.etaFilterText}>50-55 mins</Text>
          </View>
          <View style={styles.etaFilterItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
            <Text style={styles.etaFilterText}>55-60 mins</Text>
          </View>
        </View>

        {/* Secondary Services Navigation Shortcuts Module grid layer list layout blocks */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>EXPLORE MORE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exploreMoreScroll}>
            {EXPLORE.map(item => (
              <Pressable key={item.id} style={styles.exploreCard}>
                <MaterialCommunityIcons name={item.iconLib as any} size={28} color={item.color} />
                <Text style={styles.exploreCardText}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Premium Spotlight Horizontal Carousel Framework components */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>IN THE SPOTLIGHT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.spotlightScroll}>
            {SPOTLIGHT.map((spot, idx) => (
              <Pressable key={spot.id} onPress={() => { setSelectedRestaurant(RESTAURANTS[idx]); setSpotlightDot(idx); }} style={styles.spotlightCard}>
                <Image source={{ uri: spot.image }} style={styles.spotlightImg} contentFit="cover" />
                <View style={styles.spotlightOverlay} />
                <Pressable onPress={() => toggleBookmark(spot.id)} style={styles.spotlightTopBadge}>
                  <MaterialCommunityIcons name={bookmarks[spot.id] ? "bookmark" : "bookmark-outline"} size={22} color={bookmarks[spot.id] ? "#EF4444" : "#FFF"} />
                </Pressable>
                <View style={styles.spotlightContent}>
                  <Text style={styles.spotlightOffer}>{spot.offer}</Text>
                  <View style={styles.spotlightRow}>
                    <Text style={styles.spotlightTitle}>{spot.title}</Text>
                    <View style={styles.spotlightRatingWrap}>
                      <View style={styles.spotlightRatingBadge}>
                        <MaterialCommunityIcons name="star" size={10} color="#FFF" />
                        <Text style={styles.spotlightRatingText}>{spot.rating}</Text>
                      </View>
                      <Text style={styles.spotlightReviewsText}>By {spot.reviews}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.spotlightDots}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.dotGrey, i === spotlightDot && styles.dotActivePink]} />
            ))}
          </View>
        </View>

        {/* Vertical Merchant Feed Architecture listing loop layer block */}
        <View style={styles.feedContainer}>
          <Text style={styles.feedTitle}>
            {dashboardSearchQuery ? `SEARCH RESULTS (${filteredRestaurants.length})` : "299 RESTAURANTS DELIVERING TO YOU"}
          </Text>
          <Text style={styles.feedSubtitle}>Featured</Text>

          {filteredRestaurants.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialCommunityIcons name="store-off" size={48} color="#94A3B8" />
              <Text style={{ marginTop: 12, color: '#64748B', fontWeight: '600', textAlign: 'center' }}>
                No restaurants matching &quot;{dashboardSearchQuery}&quot; found.
              </Text>
            </View>
          ) : (
            filteredRestaurants.map((rest, index) => (
              <View key={rest.id}>
                {index === 4 && (
                  <View style={styles.moreRestaurantsDivider}>
                    <Text style={styles.moreRestaurantsText}>More restaurants</Text>
                  </View>
                )}
                <Pressable onPress={() => setSelectedRestaurant(rest)} style={styles.largeRestCard}>
                  <View style={styles.largeRestImgWrap}>
                    <Image source={{ uri: rest.image }} style={styles.largeRestImg} contentFit="cover" />
                    <View style={styles.largeRestTopRow}>
                      {rest.badgeLeft ? (
                        <View style={styles.largeRestTopBadge}>
                          <Text style={styles.largeRestTopBadgeText}>{rest.badgeLeft}</Text>
                        </View>
                      ) : <View />}
                      <Pressable onPress={() => toggleBookmark(rest.id)} style={{ padding: 4 }}>
                        <MaterialCommunityIcons name={bookmarks[rest.id] ? "bookmark" : "bookmark-outline"} size={22} color={bookmarks[rest.id] ? "#EF4444" : "#FFF"} />
                      </Pressable>
                    </View>

                    <View style={styles.largeRestBottomRow}>
                      {rest.hasGold ? (
                        <View style={styles.goldBanner}>
                          <Text style={styles.goldBannerText}>Free delivery with Gold</Text>
                        </View>
                      ) : <View />}
                      <View style={styles.imgDots}>
                        <View style={styles.imgDotActive} />
                        <View style={styles.imgDot} />
                        <View style={styles.imgDot} />
                        <View style={styles.imgDot} />
                        <View style={styles.imgDot} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.largeRestContent}>
                    <View style={styles.largeRestTitleRow}>
                      <Text style={styles.largeRestTitle} numberOfLines={1}>{rest.title}</Text>
                      <View style={styles.largeRestRatingCol}>
                        <View style={styles.largeRestRatingBadge}>
                          <MaterialCommunityIcons name="star" size={12} color="#FFF" />
                          <Text style={styles.largeRestRatingText}>{rest.rating}</Text>
                        </View>
                        <Text style={styles.largeRestReviewsText}>By {rest.reviews}</Text>
                      </View>
                    </View>

                    <View style={styles.largeRestMetaRow}>
                      <MaterialCommunityIcons name={rest.metaGreen ? "lightning-bolt" : "clock-outline"} size={14} color={rest.metaGreen ? "#16A34A" : "#64748B"} />
                      <Text style={[styles.largeRestMetaText, rest.metaGreen && styles.largeRestMetaTextGreen]}>{rest.meta}</Text>
                    </View>

                    <View style={styles.largeRestOfferRow}>
                      <MaterialCommunityIcons name="brightness-percent" size={14} color="#3B82F6" />
                      <Text style={styles.largeRestOfferText}>{rest.offer}</Text>
                    </View>

                    {rest.isVeg && (
                      <View style={styles.pureVegPill}>
                        <MaterialCommunityIcons name="leaf" size={12} color="#16A34A" />
                        <Text style={styles.pureVegText}>Pure Veg restaurant</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* Floating Bottom Nav */}
      <View style={styles.floatingNav}>
        <Pressable onPress={() => setActiveNav("delivery")} style={styles.navItem}>
          <MaterialCommunityIcons name="moped" size={24} color={activeNav === "delivery" ? "#EF4444" : "#94A3B8"} />
          <Text style={[styles.navItemText, activeNav === "delivery" && styles.navItemActive]}>Delivery</Text>
        </Pressable>
        <Pressable onPress={() => setActiveNav("under250")} style={styles.navItem}>
          <MaterialCommunityIcons name="wallet-outline" size={24} color={activeNav === "under250" ? "#EF4444" : "#94A3B8"} />
          <Text style={[styles.navItemText, activeNav === "under250" && styles.navItemActive]}>Under ₹250</Text>
        </Pressable>
        <Pressable onPress={() => setActiveNav("dining")} style={styles.navItem}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={activeNav === "dining" ? "#EF4444" : "#94A3B8"} />
          <Text style={[styles.navItemText, activeNav === "dining" && styles.navItemActive]}>Dining</Text>
        </Pressable>
        <Pressable style={styles.navDistrictBtn}>
          <Text style={styles.navDistrictText}>Home ↗</Text>
        </Pressable>
      </View>

      {/* ================= FILTER MODAL OVERLAY ================= */}
      {showFilterModal && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowFilterModal(false)} />
          <Pressable style={styles.modalCloseFloat} onPress={() => setShowFilterModal(false)}>
            <MaterialCommunityIcons name="close" size={24} color="#FFF" />
          </Pressable>

          <View style={styles.filterSheet}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters and sorting</Text>
              <Pressable onPress={() => { setSortSelected("relevance"); setActiveDeliveryTimeFilters([]); setActiveRatingFilters([]); setActiveOfferFilters([]); setActivePriceFilters([]); setActiveTrustFilters([]); setActiveCollectionFilters([]); }}>
                <Text style={styles.clearAllText}>Clear all</Text>
              </Pressable>
            </View>

            <View style={styles.filterBody}>
              <ScrollView style={styles.filterSidebar} showsVerticalScrollIndicator={false}>
                {FILTER_TABS.map(tab => (
                  <Pressable
                    key={tab.id}
                    style={[styles.sidebarTab, activeFilterTab === tab.id && styles.sidebarTabActive]}
                    onPress={() => scrollToSection(tab.id)}
                  >
                    <MaterialCommunityIcons name={tab.icon as any} size={20} color={activeFilterTab === tab.id ? '#EF4444' : '#64748B'} />
                    <Text style={[styles.sidebarTabText, activeFilterTab === tab.id && styles.sidebarTabTextActive]}>{tab.id}</Text>
                    {activeFilterTab === tab.id && <View style={styles.sidebarTabIndicator} />}
                  </Pressable>
                ))}
              </ScrollView>

              <ScrollView ref={scrollViewRef} style={styles.filterContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Sort By */}
                <View style={styles.filterSection} onLayout={(e) => (sectionLayouts.current['Sort By'] = e.nativeEvent.layout.y)}>
                  <Pressable style={styles.collapsibleHeaderRow} onPress={() => setIsSortDropdownExpanded(!isSortDropdownExpanded)}>
                    <Text style={styles.contentSectionTitle}>Sort by</Text>
                    <View style={styles.headerRightTagSelectionPill}>
                      <Text style={styles.headerSelectionPillText}>
                        {SORT_OPTIONS.find(o => o.id === sortSelected)?.label.split(':')[0]}
                      </Text>
                      <MaterialCommunityIcons name={isSortDropdownExpanded ? "chevron-up" : "chevron-down"} size={16} color="#EF4444" />
                    </View>
                  </Pressable>

                  {isSortDropdownExpanded && SORT_OPTIONS.map(opt => (
                    <Pressable key={opt.id} onPress={() => setSortSelected(opt.id)} style={styles.radioRow}>
                      <Text style={[styles.radioLabel, sortSelected === opt.id && styles.radioLabelActive]}>{opt.label}</Text>
                      <MaterialCommunityIcons name={sortSelected === opt.id ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={sortSelected === opt.id ? '#EF4444' : '#CBD5E1'} />
                    </Pressable>
                  ))}
                </View>

                {/* Delivery Time */}
                <View style={styles.filterSection} onLayout={(e) => (sectionLayouts.current['Time'] = e.nativeEvent.layout.y)}>
                  <Text style={styles.contentSectionTitle}>Delivery Time</Text>
                  <View style={styles.pillContainer}>
                    {["Under 30 mins", "30 - 45 mins", "45 - 60 mins"].map(t => {
                      const isSelected = activeDeliveryTimeFilters.includes(t);
                      return (
                        <Pressable key={t} onPress={() => toggleFilterKey(t, activeDeliveryTimeFilters, setActiveDeliveryTimeFilters)} style={[styles.filterPillBlock, isSelected && styles.filterPillBlockActive]}>
                          <Text style={[styles.pillBlockText, isSelected && styles.pillBlockTextActive]}>{t}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Rating */}
                <View style={styles.filterSection} onLayout={(e) => (sectionLayouts.current['Rating'] = e.nativeEvent.layout.y)}>
                  <Text style={styles.contentSectionTitle}>Restaurant Rating</Text>
                  <View style={styles.ratingGridRow}>
                    {["Rated 3.5+", "Rated 4.0+", "Rated 4.5+"].map(r => {
                      const isSelected = activeRatingFilters.includes(r);
                      return (
                        <Pressable key={r} onPress={() => toggleFilterKey(r, activeRatingFilters, setActiveRatingFilters)} style={[styles.ratingFilterBox, isSelected && styles.ratingFilterBoxActive]}>
                          <Text style={[styles.ratingBoxText, isSelected && styles.ratingBoxTextActive]}>{r}</Text>
                          <MaterialCommunityIcons name="star" size={14} color={isSelected ? "#EF4444" : "#64748B"} style={{ marginLeft: 4 }} />
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Offers */}
                <View style={styles.filterSection} onLayout={(e) => (sectionLayouts.current['Offers'] = e.nativeEvent.layout.y)}>
                  <Text style={styles.contentSectionTitle}>Offers</Text>
                  <View style={styles.pillContainer}>
                    {["Buy 1 Get 1 and more", "Deals of the Day", "Flat ₹100 OFF", "Free Delivery"].map(o => {
                      const isSelected = activeOfferFilters.includes(o);
                      return (
                        <Pressable key={o} onPress={() => toggleFilterKey(o, activeOfferFilters, setActiveOfferFilters)} style={[styles.filterPillBlock, isSelected && styles.filterPillBlockActive]}>
                          <Text style={[styles.pillBlockText, isSelected && styles.pillBlockTextActive]}>{o}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Price */}
                <View style={styles.filterSection} onLayout={(e) => (sectionLayouts.current['Dish Price'] = e.nativeEvent.layout.y)}>
                  <Text style={styles.contentSectionTitle}>Dish Price</Text>
                  <View style={styles.ratingGridRow}>
                    {[["₹", "Under ₹150"], ["₹₹", "₹150 - ₹300"], ["₹₹₹", "Above ₹300"]].map(([sym, lbl]) => {
                      const isSelected = activePriceFilters.includes(sym);
                      return (
                        <Pressable key={sym} onPress={() => toggleFilterKey(sym, activePriceFilters, setActivePriceFilters)} style={[styles.priceFilterBox, isSelected && styles.priceFilterBoxActive]} >
                          <Text style={[styles.priceSymbol, isSelected && { color: '#EF4444' }]}>{sym}</Text>
                          <Text style={[styles.priceText, isSelected && { color: '#EF4444', fontWeight: '800' }]}>{lbl}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Trust Markers */}
                <View style={styles.filterSection} onLayout={(e) => (sectionLayouts.current['Trust Markers'] = e.nativeEvent.layout.y)}>
                  <Text style={styles.contentSectionTitle}>Trust Markers</Text>
                  <View style={styles.pillContainer}>
                    {["Pure Veg", "No Packaging charges", "Low plastic packaging", "Hygienic Kitchen"].map(t => {
                      const isSelected = activeTrustFilters.includes(t);
                      return (
                        <Pressable key={t} onPress={() => toggleFilterKey(t, activeTrustFilters, setActiveTrustFilters)} style={[styles.trustMarkerItem, isSelected && styles.trustMarkerItemActive]}>
                          <Text style={[styles.trustText, isSelected && styles.trustTextActive]}>{t}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={[styles.contentSectionTitle, { marginTop: 20 }]}>Collections</Text>
                  <View style={styles.pillContainer}>
                    {["Previously ordered", "Trending places"].map(c => {
                      const isSelected = activeCollectionFilters.includes(c);
                      return (
                        <Pressable key={c} onPress={() => toggleFilterKey(c, activeCollectionFilters, setActiveCollectionFilters)} style={[styles.filterPillBlock, isSelected && styles.filterPillBlockActive]}>
                          <Text style={[styles.pillBlockText, isSelected && styles.pillBlockTextActive]}>{c}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterFooter}>
              <Pressable style={styles.btnOutline} onPress={() => setShowFilterModal(false)}>
                <Text style={styles.btnOutlineText}>Close</Text>
              </Pressable>
              <Pressable style={[styles.btnSolid, { backgroundColor: '#EF4444' }]} onPress={() => setShowFilterModal(false)}>
                <Text style={[styles.btnSolidText, { color: '#FFF' }]}>Show results</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Schedule Overlay */}
      {showScheduleModal && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowScheduleModal(false)} />
          <Pressable style={styles.modalCloseFloat} onPress={() => setShowScheduleModal(false)}>
            <MaterialCommunityIcons name="close" size={24} color="#FFF" />
          </Pressable>
          <View style={styles.scheduleSheet}>
            <Text style={styles.scheduleTitle}>Select your delivery time</Text>
            <View style={styles.scheduleTabs}>
              {[["22 Apr", "Today"], ["23 Apr", "Tomorrow"], ["24 Apr", "Friday"]].map(([date, day], i) => (
                <Pressable key={date} onPress={() => setActiveScheduleDate(i)} style={activeScheduleDate === i ? styles.scheduleTabActive : styles.scheduleTab}>
                  <Text style={activeScheduleDate === i ? styles.scheduleTabDateActive : styles.scheduleTabDate}>{date}</Text>
                  <Text style={activeScheduleDate === i ? styles.scheduleTabSubActive : styles.scheduleTabSub}>{day}</Text>
                  {activeScheduleDate === i && <View style={styles.scheduleTabUnderline} />}
                </Pressable>
              ))}
            </View>
            <View style={styles.scheduleContent}>
              {["2 - 2:30 PM", "2:30 - 3 PM", "3 - 3:30 PM"].map((slot, i) => (
                <Pressable key={slot} onPress={() => setActiveTimeSlot(i)} style={activeTimeSlot === i ? styles.timeSlotActive : styles.timeSlot}>
                  <Text style={activeTimeSlot === i ? styles.timeSlotTextActive : styles.timeSlotText}>{slot}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.scheduleFooter}>
              <Pressable style={styles.btnConfirm} onPress={() => setShowScheduleModal(false)}><Text style={styles.btnConfirmText}>Confirm</Text></Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 100 },
  
  headerBlock: { backgroundColor: '#F8F9FA', paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  locationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  locationSubtitle: { fontSize: 12, color: '#64748B', maxWidth: '80%' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  goldPill: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignItems: 'center' },
  goldText: { fontSize: 8, fontWeight: '900', color: '#B45309' },
  goldPrice: { fontSize: 10, fontWeight: '800', color: '#B45309' },
  iconCirclePink: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center' },
  iconCircleBlue: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' },
  profileLetter: { color: '#0284C7', fontWeight: '900', fontSize: 16 },
  
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#111', fontWeight: '500' },
  micDivider: { width: 1, height: 20, backgroundColor: '#E2E8F0', marginHorizontal: 8 },
  vegModeWrap: { alignItems: 'center' },
  vegModeText: { fontSize: 8, fontWeight: '900', color: '#111', textAlign: 'center', marginBottom: 4 },
  toggleWrap: { width: 36, height: 20, borderRadius: 10, backgroundColor: '#CBD5E1', padding: 2 },
  toggleActive: { backgroundColor: '#16A34A' },
  toggleKnob: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFF' },
  toggleKnobActive: { transform: [{ translateX: 16 }] },

  heroBanner: { backgroundColor: '#EF4444', paddingVertical: 32, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginHorizontal: 16, borderRadius: 16, marginTop: 10 },
  heroBg: { alignItems: 'center' },
  heroBannerTextLarge: { color: '#FEF08A', fontSize: 32, fontWeight: '900', fontStyle: 'italic' },
  heroBannerTextMassive: { color: '#FFFFFF', fontSize: 48, fontWeight: '900', fontStyle: 'italic', marginTop: -8 },
  heroOrderBtn: { backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 4, marginTop: 12 },
  heroOrderBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  heroDots: { flexDirection: 'row', gap: 6, marginTop: 16 },
  dotActive: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },

  categoriesSection: { paddingTop: 16, paddingBottom: 8 },
  categoriesScroll: { paddingHorizontal: 16, gap: 16, alignItems: 'center' },
  mealsBlock: { paddingRight: 8 },
  mealsCard: { backgroundColor: '#0284C7', paddingHorizontal: 8, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  mealsEyebrow: { color: '#FFF', fontSize: 8, fontWeight: '800' },
  mealsPrice: { color: '#FFF', fontSize: 18, fontWeight: '900', marginVertical: 4 },
  mealsExplore: { color: '#FFF', fontSize: 10, fontWeight: '600' },
  categoryPill: { alignItems: 'center', gap: 8, position: 'relative', paddingBottom: 8 },
  categoryImg: { width: 64, height: 64, borderRadius: 32 },
  categoryLabel: { fontSize: 12, color: '#334155', fontWeight: '500' },
  categoryLabelActive: { color: '#EF4444', fontWeight: '800' },
  categoryIndicator: { position: 'absolute', bottom: 0, width: 30, height: 3, backgroundColor: '#EF4444', borderRadius: 2 },

  quickFiltersScroll: { paddingHorizontal: 16, gap: 12, marginVertical: 16 },
  quickFilterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  quickFilterText: { fontSize: 12, fontWeight: '700', color: '#334155' },

  etaFiltersRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 16, marginBottom: 24 },
  etaFilterItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  etaFilterTextGreen: { color: '#16A34A', fontSize: 12, fontWeight: '800' },
  etaFilterText: { color: '#64748B', fontSize: 12, fontWeight: '600' },

  sectionContainer: { marginBottom: 32 },
  sectionHeaderTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, marginHorizontal: 16, marginBottom: 16 },
  exploreMoreScroll: { paddingHorizontal: 16, gap: 16 },
  exploreCard: { width: 90, height: 90, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', gap: 8 },
  exploreCardText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },

  spotlightScroll: { paddingHorizontal: 16, gap: 16 },
  spotlightCard: { width: screenWidth * 0.8, height: 200, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  spotlightImg: { width: '100%', height: '100%' },
  spotlightOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  spotlightTopBadge: { position: 'absolute', top: 16, right: 16 },
  spotlightContent: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  spotlightOffer: { color: '#FFF', fontSize: 18, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  spotlightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  spotlightTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  spotlightRatingWrap: { alignItems: 'flex-end', gap: 2 },
  spotlightRatingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16A34A', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, gap: 4 },
  spotlightRatingText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  spotlightReviewsText: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '600' },
  spotlightDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 },
  dotActivePink: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  dotGrey: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CBD5E1' },

  feedContainer: { paddingHorizontal: 16, paddingTop: 16 },
  feedTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, marginBottom: 4 },
  feedSubtitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', marginBottom: 16 },
  moreRestaurantsDivider: { paddingVertical: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 24 },
  moreRestaurantsText: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  
  largeRestCard: { marginBottom: 32 },
  largeRestImgWrap: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', position: 'relative', marginBottom: 12 },
  largeRestImg: { width: '100%', height: '100%' },
  largeRestTopRow: { position: 'absolute', top: 12, left: 0, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  largeRestTopBadge: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  largeRestTopBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  largeRestBottomRow: { position: 'absolute', bottom: 12, left: 0, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  goldBanner: { backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  goldBannerText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  imgDots: { flexDirection: 'row', gap: 4 },
  imgDotActive: { width: 12, height: 4, borderRadius: 2, backgroundColor: '#FFF' },
  imgDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.45)' },

  largeRestContent: { paddingHorizontal: 4 },
  largeRestTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  largeRestTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', flex: 1, paddingRight: 16 },
  largeRestRatingCol: { alignItems: 'flex-end' },
  largeRestRatingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16A34A', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, gap: 4, marginBottom: 2 },
  largeRestRatingText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  largeRestReviewsText: { color: '#64748B', fontSize: 10, fontWeight: '600' },
  
  largeRestMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  largeRestMetaText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  largeRestMetaTextGreen: { color: '#16A34A', fontWeight: '800' },
  largeRestOfferRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  largeRestOfferText: { fontSize: 13, color: '#3B82F6', fontWeight: '800' },
  pureVegPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginTop: 4 },
  pureVegText: { fontSize: 12, color: '#16A34A', fontWeight: '700' },

  floatingNav: { position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12, borderRadius: 32, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15, shadowOffset: { width: 0, height: 5 }, elevation: 10 },
  navItem: { alignItems: 'center', gap: 4 },
  navItemText: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  navItemActive: { color: '#EF4444' },
  navDistrictBtn: { backgroundColor: '#7C3AED', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  navDistrictText: { color: '#FFF', fontSize: 13, fontWeight: '900', fontStyle: 'italic' },

  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalCloseFloat: { alignSelf: 'center', marginBottom: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(30,41,59,0.9)', alignItems: 'center', justifyContent: 'center' },
  filterSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: screenHeight * 0.75, display: 'flex' },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  clearAllText: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  
  filterSidebar: { width: 110, backgroundColor: '#F8FAFC', borderRightWidth: 1, borderRightColor: '#F1F5F9' },
  sidebarTab: { paddingVertical: 16, alignItems: 'center', gap: 6, position: 'relative' },
  sidebarTabActive: { backgroundColor: '#FFF' },
  sidebarTabText: { fontSize: 10, color: '#64748B', fontWeight: '600', textAlign: 'center' },
  sidebarTabTextActive: { color: '#0F172A', fontWeight: '800' },
  sidebarTabIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#EF4444' },
  
  filterContent: { flex: 1, backgroundColor: '#FFF' }, 
  filterBody: { flex: 1, flexDirection: 'row' },
  
  filterSection: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  collapsibleHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 },
  headerRightTagSelectionPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF1F1', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  headerSelectionPillText: { fontSize: 10.5, fontWeight: '800', color: '#EF4444' },
  radioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  radioLabel: { fontSize: 13, color: '#334155', fontWeight: '500' },
  radioLabelActive: { color: '#0F172A', fontWeight: '800' },
  filterBoxCenter: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', padding: 16, alignItems: 'center', justifyContent: 'center', gap: 8, width: 120, marginLeft: 16, marginTop: 4 },
  
  gridRow2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingLeft: 16, marginTop: 4 },
  gridRow3: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 16, marginTop: 4 },
  ratingGridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 16, marginTop: 4 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 16, marginTop: 4 },
  markerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingLeft: 16, marginTop: 4 },
  
  ratingFilterBox: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', flexDirection: 'row' },
  ratingFilterBoxActive: { borderColor: '#EF4444', backgroundColor: '#FFF1F1' },
  ratingBoxText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  ratingBoxTextActive: { color: '#EF4444', fontWeight: '800' },
  filterBoxCenterRating: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', padding: 12, alignItems: 'center', flexDirection: 'row', gap: 6 },
  priceFilterBox: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, alignItems: 'center', width: '30%', minWidth: 72 },
  priceFilterBoxActive: { borderColor: '#EF4444', backgroundColor: '#FFF1F1' },
  filterBoxPriceWrap: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', paddingVertical: 12, paddingHorizontal: 4, alignItems: 'center', flex: 1 },
  filterBoxIconTextGreen: { color: '#16A34A', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  filterBoxTextSub: { fontSize: 12, color: '#334155', fontWeight: '600' },
  priceSymbol: { fontSize: 13, fontWeight: '900', color: '#16A34A', marginBottom: 2, alignSelf: 'flex-start' },
  priceText: { fontSize: 10, color: '#475569', fontWeight: '700', alignSelf: 'flex-start' },
  colWrap: { gap: 12, alignItems: 'flex-start', paddingHorizontal: 16 },
  filterPillBlock: { borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF' },
  filterPillBlockActive: { borderColor: '#EF4444', backgroundColor: '#FFF1F1' },
  pillBlockText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  pillBlockTextActive: { color: '#EF4444', fontWeight: '800' },
  filterPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', backgroundColor: '#FFF' },
  filterPillText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  contentSectionTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 12, marginTop: 14, paddingHorizontal: 16 },
  trustMarkerItem: { borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', minWidth: 100 },
  trustMarkerItemActive: { borderColor: '#EF4444', backgroundColor: '#FFF1F1' },
  trustText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  trustTextActive: { color: '#EF4444', fontWeight: '800' },
  markerCardHorizontal: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', backgroundColor: '#FFF', alignItems: 'center', gap: 8, flexDirection: 'row' },
  markerLabelHorizontal: { fontSize: 12, color: '#334155', fontWeight: '600', lineHeight: 16, flex: 1 },
  filterFooter: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12, backgroundColor: '#FFF' },
  btnOutline: { flex: 1, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#fff', alignItems: 'center' },
  btnOutlineText: { color: '#475569', fontSize: 13, fontWeight: '800' },
  btnSolid: { flex: 2, paddingVertical: 16, borderRadius: 12, backgroundColor: '#E2E8F0', alignItems: 'center' },
  btnSolidText: { color: '#94A3B8', fontSize: 13, fontWeight: '800' },

  scheduleSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  scheduleTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 24, textAlign: 'center' },
  scheduleTabs: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 24 },
  scheduleTab: { flex: 1, alignItems: 'center', paddingBottom: 16 },
  scheduleTabActive: { flex: 1, alignItems: 'center', paddingBottom: 16, position: 'relative' },
  scheduleTabDate: { fontSize: 16, fontWeight: '800', color: '#94A3B8' },
  scheduleTabDateActive: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  scheduleTabSub: { fontSize: 12, fontWeight: '600', color: '#CBD5E1', marginTop: 4 },
  scheduleTabSubActive: { fontSize: 12, fontWeight: '600', color: '#64748B', marginTop: 4 },
  scheduleTabUnderline: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, backgroundColor: '#EF4444', borderRadius: 2 },
  scheduleContent: { gap: 12, marginBottom: 32 },
  timeSlot: { backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  timeSlotActive: { backgroundColor: '#F8FAFC', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  timeSlotText: { fontSize: 16, fontWeight: '700', color: '#CBD5E1' },
  timeSlotTextActive: { fontSize: 16, fontWeight: '800', color: '#334155' },
  scheduleFooter: { marginTop: 8 },
  btnConfirm: { backgroundColor: '#EF4444', paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  btnConfirmText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // --- NATIVE SPECIFIC SUB-SCREEN ARCHITECTURES ---
  headerBlockWithBack: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12 },
  backButtonCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  headerScreenTitleText: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  headerScreenSubtitleText: { fontSize: 12, color: '#64748B' },
  campaignRestCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', padding: 14 },
  campaignRestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  campaignRestName: { fontSize: 13, fontWeight: '900', color: '#1E293B' },
  campaignRestMetaText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  campaignProductBlock: { flexDirection: 'row', marginTop: 12, gap: 12 },
  campaignProductName: { fontSize: 13, fontWeight: '700', color: '#334155' },
  promoPriceText: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  originalPriceCrossText: { fontSize: 12, color: '#94A3B8', textDecorationLine: 'line-through' },
  campaignProductImg: { width: 80, height: 80, borderRadius: 8 },
  campaignAddBtn: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 12, marginTop: -10 },
  campaignAddBtnText: { color: '#EF4444', fontSize: 10.5, fontWeight: '900' },
  gridSectionHeading: { fontSize: 13, fontWeight: '800', color: '#64748B', marginBottom: 16 },
  cuisineGridMatrix: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  cuisineGridCellCard: { width: '22%', alignItems: 'center', marginBottom: 16 },
  cuisineGridCellImg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F8FAFC' },
  cuisineGridCellLabel: { fontSize: 10.5, fontWeight: '600', color: '#475569', marginTop: 6, textAlign: 'center' },
  inlineApplyBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#3B82F6' },
  inlineApplyBtnText: { color: '#3B82F6', fontSize: 10.5, fontWeight: '900' },
  checkoutBlockCard: { backgroundColor: '#FFF', padding: 16, borderBottomWidth: 8, borderBottomColor: '#F8FAFC' },
  checkoutBlockHeading: { fontSize: 13, fontWeight: '900', color: '#1E293B', marginBottom: 12 },
  checkoutItemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkoutItemName: { fontSize: 13, color: '#334155', flex: 1 },
  checkoutItemQty: { fontSize: 13, color: '#64748B', marginRight: 12 },
  checkoutItemPrice: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  changeAddressLinkText: { color: '#EF4444', fontSize: 13, fontWeight: '800' },
  addressBodyText: { fontSize: 13, color: '#475569', lineHeight: 18 },
  billBreakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  billRowLabel: { fontSize: 13, color: '#475569' },
  billRowValue: { fontSize: 13, color: '#1E293B' },
  addAddressActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  addAddressActionBtnText: { color: '#EF4444', fontSize: 13, fontWeight: '800' },
  blinkitSyncBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#FEFCE8', paddingHorizontal: 12, borderRadius: 8, marginTop: 12 },
  blinkitSyncBtnText: { color: '#854D0E', fontSize: 13, fontWeight: '700' },
  addressListLabel: { fontSize: 12, fontWeight: '800', color: '#94A3B8', marginTop: 16, marginBottom: 8 },
  savedAddressCardCell: { flexDirection: 'row', paddingVertical: 12 },
  savedAddressCardTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  savedAddressCardDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },

  // --- SPECIFIC RESTAURANT UI STYLES ---
  detailHeader: { backgroundColor: "#fff", padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtnNative: { padding: 4 },
  detailSearchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: "#F8F9FA", borderRadius: 10, padding: 8, gap: 8 },
  detailSearchText: { fontSize: 13, color: "#94A3B8" },
  headerIconButton: { padding: 6 },
  detailMetaContainerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  detailRestTitle: { fontSize: 21, fontWeight: '900', color: '#0F172A', flex: 1, paddingRight: 12 },
  ratingBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#16A34A', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  ratingBadgeText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  reviewsSubtext: { fontSize: 10, color: '#64748B', marginTop: 2, textAlign: 'right' },
  cuisineText: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  etaInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  etaInfoText: { fontSize: 12, fontWeight: '700' },
  dotSeparator: { color: '#CBD5E1', marginHorizontal: 4 },
  locationSnippetText: { fontSize: 12, color: '#64748B', maxWidth: '50%' },
  promoVoucherBanner: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FED7AA', borderRadius: 10, padding: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  promoEyebrow: { fontSize: 10.5, color: '#92400E', fontWeight: '700' },
  promoBodyText: { fontSize: 12, color: '#B45309', marginTop: 2, lineHeight: 16 },
  promoFooterText: { fontSize: 10.5, color: '#16A34A', fontWeight: '700', marginTop: 2 },
  promoVerifiedBadge: { backgroundColor: '#16A34A', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  promoVerifiedText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  detailPillsScrollRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 12, marginVertical: 4 },
  detailFilterBadgeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#fff' },
  detailFilterBadgeBtnText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  detailStaticFilterBadge: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#fff' },
  sectionHeadingHeader: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  bundleComboMiniCard: { width: 130, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden', backgroundColor: '#FFF' },
  bundleComboCardImg: { width: '100%', height: 78 },
  bundleComboPriceText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  bundleComboActionBtn: { width: '100%', marginTop: 6, borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 8, paddingVertical: 5, backgroundColor: '#fff', alignItems: 'center' },
  bundleComboActionBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '800' },
  sectionRowTitleWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  menuListItemRowBlock: { flexDirection: 'row', paddingBottom: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', borderStyle: 'dashed' },
  vegIndicatorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  vegOuterBorder: { width: 14, height: 14, borderRadius: 2, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  vegInnerDot: { width: 6, height: 6, borderRadius: 3 },
  menuItemTitleNameText: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  reorderProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  reorderBarOuter: { height: 3, width: 48, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
  reorderBarInner: { height: '100%', width: '75%', backgroundColor: '#16A34A', borderRadius: 2 },
  reorderLabelText: { fontSize: 10.5, color: '#64748B' },
  menuItemPriceVal: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 5 },
  menuItemDescriptionText: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 10 },
  menuActionIconPill: { padding: 4 },
  menuItemGraphicColumn: { alignItems: 'center' },
  menuItemGraphicAssetImg: { width: 108, height: 108, borderRadius: 12 },
  qtyAdjusterFrame: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 8, overflow: 'hidden' },
  qtyControlBtn: { paddingVertical: 5, paddingHorizontal: 10 },
  qtyControlBtnText: { color: '#EF4444', fontSize: 18, fontWeight: '900' },
  qtyValueDisplayLabel: { paddingVertical: 5, paddingHorizontal: 2, fontSize: 13, fontWeight: '800', color: '#EF4444', minWidth: 18, textAlign: 'center' },
  nativeAddButtonPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16 },
  nativeAddButtonPillText: { color: '#EF4444', fontSize: 13, fontWeight: '800' },
  nativeAddButtonPillPlusSign: { fontSize: 13, fontWeight: '900', color: '#EF4444' },
  customisableSubtextTag: { fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 6 },
  floatingMenuPillBtn: { position: 'absolute', left: '50%', transform: [{ translateX: -45 }], backgroundColor: '#1E293B', borderRadius: 24, paddingVertical: 11, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 45 },
  floatingMenuPillBtnText: { color: '#111827', fontSize: 13, fontWeight: '700' },
  stickyCartStripBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#EF4444', paddingVertical: 13, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 },
  cartStripCountText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  cartStripSubtext: { color: 'rgba(255,255,255,0.75)', fontSize: 10.5 },
  cartStripPriceValText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  cartStripSubmitBtn: { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 14 },
  cartStripSubmitBtnText: { color: '#EF4444', fontSize: 13, fontWeight: '800' },
  menuIndexBottomDrawSheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '60%', width: '100%' },
  drawSheetHeaderBorder: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  drawSheetHeadingTitleText: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  indexDrawSheetRowButton: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', borderLeftWidth: 3, borderLeftColor: 'transparent' },
  indexDrawSheetRowLabel: { fontSize: 13, fontWeight: '500', color: '#334155' },
  indexDrawSheetCountText: { fontSize: 12, color: '#94A3B8' },
  miniFilterDrawSheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 22, width: '100%' },
  miniFilterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  miniFilterHeadingTitleText: { fontSize: 16, fontWeight: '800' },
  miniFilterSubSectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  miniFilterGridToggleBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#fff', alignItems: 'center' },
  miniFilterGridToggleBtnText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  greenPureVegAlertBar: { backgroundColor: '#F0FDF4', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  vegOuterBorderMini: { width: 10, height: 10, borderRadius: 2, borderWidth: 1.5, borderColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  vegInnerDotMini: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#16A34A' },
  greenPureVegAlertBarText: { fontSize: 13, color: '#16A34A', fontWeight: '700' },
  sheetActionBtnOutline: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#fff', alignItems: 'center' },
  sheetActionBtnOutlineText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  sheetActionBtnSolid: { flex: 2, padding: 14, borderRadius: 12, backgroundColor: '#E2E8F0', alignItems: 'center' },
  sheetActionBtnSolidText: { fontSize: 13, fontWeight: '700', color: '#94A3B8' }
});
