import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';

const { width } = Dimensions.get('window');

// SharedHeader
export function SharedHeader({ cartCount, title = 'Shopping' }: { cartCount: number, title?: string }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

// SharedTabBar
const TABS = ['FOR YOU', 'BEAUTY', 'WOMEN', 'MEN', 'KIDS', 'HOME', 'LUXE'];
export function SharedTabBar({ activeTab }: { activeTab: string }) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {TABS.map(tab => (
          <Pressable 
            key={tab} 
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => {
              if (tab === 'FOR YOU') router.push('/(shopping-module)/shopping');
              else if (tab === 'BEAUTY') router.push('/(shopping-module)/beauty');
              else if (tab === 'WOMEN') router.push('/(shopping-module)/women');
              else if (tab === 'MEN') router.push('/(shopping-module)/men');
              else if (tab === 'KIDS') router.push('/(shopping-module)/kids');
              else if (tab === 'HOME') router.push('/(shopping-module)/home-living');
              else if (tab === 'LUXE') router.push('/(shopping-module)/luxe');
            }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// BannerCarousel
type Banner = { id: string; image: string; title: string; subtitle: string; deal: string; productId: string; };
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
      {banners.map(banner => (
        <Pressable key={banner.id} style={styles.bannerContainer}>
          <Image source={{ uri: banner.image }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            <View style={styles.bannerDeal}>
              <Text style={styles.bannerDealText}>{banner.deal}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// BrandCard
type BrandCardProps = { name: string; offer: string; logo: string; image: string; productId: string; };
export function BrandCard({ name, offer, logo, image, productId }: BrandCardProps) {
  return (
    <Pressable style={styles.brandCard}>
      <Image source={{ uri: image }} style={styles.brandImage} />
      <View style={styles.brandOverlay}>
        <Image source={{ uri: logo }} style={styles.brandLogo} />
        <View style={styles.brandTextContainer}>
          <Text style={styles.brandName}>{name}</Text>
          <Text style={styles.brandOffer}>{offer}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // SharedHeader
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  iconBtn: { padding: 4 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    marginHorizontal: spacing.sm,
  },
  searchPlaceholder: { color: colors.textMuted, marginLeft: 4, fontSize: typography.caption },
  badge: {
    position: 'absolute', top: 0, right: 0, backgroundColor: '#FF3F6C',
    borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center'
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  // SharedTabBar
  tabBar: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.line },
  tabItem: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: '#FF3F6C' },
  tabText: { fontSize: typography.caption, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: '#FF3F6C', fontWeight: '800' },

  // BannerCarousel
  bannerContainer: { width, height: 200 },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { position: 'absolute', bottom: 20, left: 20 },
  bannerTitle: { color: '#FFF', fontSize: typography.section, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 },
  bannerSubtitle: { color: '#FFF', fontSize: typography.bodySmall, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 },
  bannerDeal: { backgroundColor: '#FF3F6C', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 8, alignSelf: 'flex-start' },
  bannerDealText: { color: '#FFF', fontSize: typography.tiny, fontWeight: 'bold' },

  // BrandCard
  brandCard: { width: 150, height: 200, borderRadius: radius.md, overflow: 'hidden', marginRight: spacing.md },
  brandImage: { width: '100%', height: '100%' },
  brandOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.4)' },
  brandLogo: { width: 30, height: 30, borderRadius: 15, marginBottom: 4 },
  brandTextContainer: { gap: 2 },
  brandName: { color: '#FFF', fontSize: typography.caption, fontWeight: 'bold' },
  brandOffer: { color: '#FFF', fontSize: typography.tiny },
});
