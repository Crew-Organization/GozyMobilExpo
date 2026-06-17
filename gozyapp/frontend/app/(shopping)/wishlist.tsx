import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { spacing } from '@/src/theme/tokens';

const brandColors = {
  myntraPink: '#FF3F6C',
  myntraNavy: '#282C3F',
  lightGray: '#F5F5F6',
  discountGreen: '#03A685',
  borderLight: '#EAEAEC',
};

export default function WishlistScreen() {
  const { wishlist, toggleWishlist, addProduct } = useSuperAppStore();

  const handleMoveToBag = (item: any) => {
    // Add item to shopping cart bag
    addProduct(item);
    // Remove item from wishlist
    toggleWishlist(item);
  };

  return (
    <ScreenShell scroll={true} contentContainerStyle={styles.shellContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={brandColors.myntraNavy} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <Text style={styles.headerCount}>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</Text>
        </View>
      </View>

      {wishlist.length > 0 ? (
        <View style={styles.gridSection}>
          <View style={styles.wishlistGrid}>
            {wishlist.map((item) => {
              const discountPercent = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
              return (
                <View key={item.id} style={styles.wishlistCard}>
                  {/* Image area with close overlay */}
                  <View style={styles.imageWrap}>
                    <Image source={{ uri: item.image }} contentFit="cover" style={styles.productImg} />
                    
                    {/* Delete from wishlist cross overlay */}
                    <Pressable
                      onPress={() => toggleWishlist(item)}
                      style={styles.closeOverlayBtn}
                    >
                      <MaterialCommunityIcons name="close" size={16} color="#9496A2" />
                    </Pressable>
                  </View>

                  {/* Info area */}
                  <View style={styles.infoWrap}>
                    <Text style={styles.brandText} numberOfLines={1}>{item.brand}</Text>
                    <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
                    
                    <View style={styles.priceRow}>
                      <Text style={styles.priceVal}>Rs. {item.price}</Text>
                      <Text style={styles.originalPriceVal}>Rs. {item.originalPrice}</Text>
                    </View>
                    <Text style={styles.discountText}>({discountPercent}% OFF)</Text>
                  </View>

                  {/* Move to bag button */}
                  <Pressable
                    onPress={() => handleMoveToBag(item)}
                    style={styles.moveToBagBtn}
                  >
                    <Text style={styles.moveToBagBtnText}>MOVE TO BAG</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <MaterialCommunityIcons name="heart-outline" size={48} color="#C4C5CD" />
          </View>
          <Text style={styles.emptyTitle}>YOUR WISHLIST IS EMPTY</Text>
          <Text style={styles.emptySubtitle}>
            Save items that you like in your wishlist. Review them here and buy them anytime you want.
          </Text>
          <Pressable
            onPress={() => router.push('/shopping')}
            style={styles.shopNowBtn}
          >
            <Text style={styles.shopNowBtnText}>SHOP NOW</Text>
          </Pressable>
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shellContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
    backgroundColor: '#FFFFFF',
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
  },
  headerCount: {
    fontSize: 10.5,
    color: '#7E8190',
  },
  gridSection: {
    padding: spacing.md,
  },
  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  wishlistCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 180,
    position: 'relative',
    backgroundColor: brandColors.lightGray,
  },
  productImg: {
    width: '100%',
    height: '100%',
  },
  closeOverlayBtn: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  infoWrap: {
    padding: spacing.sm,
    gap: 2,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraNavy,
    textTransform: 'uppercase',
  },
  nameText: {
    fontSize: 10.5,
    color: '#7E8190',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  priceVal: {
    fontSize: 10.5,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  originalPriceVal: {
    fontSize: 9,
    color: '#9496A2',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  discountText: {
    fontSize: 9,
    color: brandColors.myntraPink,
    fontWeight: '700',
    marginTop: 1,
  },
  moveToBagBtn: {
    borderTopWidth: 1,
    borderColor: brandColors.borderLight,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  moveToBagBtnText: {
    color: brandColors.myntraPink,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    marginTop: 80,
    gap: spacing.md,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: brandColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: brandColors.myntraNavy,
    letterSpacing: 0.8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#7E8190',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
  },
  shopNowBtn: {
    marginTop: spacing.sm,
    borderColor: brandColors.myntraPink,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  shopNowBtnText: {
    color: brandColors.myntraPink,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
