import { Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { MediaCard } from '@/src/components/media-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { CarouselSection } from '@/src/components/carousel-section';
import { SkeletonCard } from '@/src/components/skeleton-card';
import { useApp } from '@/src/context/app-context';
import { homeHeroBanners } from '@/src/lib/commerce-data';
import { formatCurrency } from '@/src/lib/travel-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography, gradients } from '@/src/theme/tokens';

const { width: screenWidth } = Dimensions.get('window');

const quickLinks = [
  { label: 'Travel', icon: 'airplane', route: '/travel', color: colors.sky },
  { label: 'Food', icon: 'silverware-fork-knife', route: '/food', color: colors.coral },
  { label: 'Shop', icon: 'shopping-outline', route: '/shopping', color: colors.aqua },
  { label: 'Movies', icon: 'movie-open-outline', route: '/entertainment', color: colors.amber },
];

export default function HomeScreen() {
  const {
    events,
    isHydrating,
    notifications,
    products,
    recommendations,
    restaurants,
    session,
    travel,
    walletBalance,
  } = useApp();
  const { foodCart, shoppingCart } = useSuperAppStore();

  if (isHydrating) {
    return (
      <ScreenShell>
        <View style={styles.topGap} />
        <SkeletonCard height={200} />
        <SkeletonCard height={120} />
        <SkeletonCard height={180} />
        <SkeletonCard height={180} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scroll={true} contentContainerStyle={styles.shellContent}>
      {/* 1. Dashboard Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Today with Gozy AI</Text>
          <Text style={styles.greetingTitle}>Hello, {session?.user.name || 'Gozy user'}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/notifications')} style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.text} />
            {notifications.filter((notification) => !notification.read).length > 0 ? (
              <View style={styles.notifDot} />
            ) : null}
          </Pressable>
          <Pressable onPress={() => router.push('/assistant')} style={styles.aiButton}>
            <LinearGradient colors={gradients.aqua} style={styles.aiButtonGradient}>
              <MaterialCommunityIcons name="robot-outline" size={20} color={colors.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* 2. Hero Banner Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.heroCarousel}
        snapToInterval={screenWidth}
        decelerationRate="fast"
      >
        {homeHeroBanners.map((banner) => (
          <Pressable
            key={banner.id}
            onPress={() => router.push(banner.route as never)}
            style={styles.heroCard}
          >
            <Image contentFit="cover" source={{ uri: banner.image }} style={styles.heroImage} />
            <LinearGradient 
              colors={['transparent', 'rgba(12, 38, 82, 0.72)']} 
              style={styles.heroOverlay} 
            />
            <View style={styles.heroContent}>
              <View style={styles.badgeLine}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>{banner.eyebrow}</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>{banner.title}</Text>
              <Text style={styles.heroBody}>{banner.body}</Text>
              <View style={styles.heroFooter}>
                <View style={styles.heroCTA}>
                  <Text style={styles.heroCTAText}>{banner.cta}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={colors.text} />
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* 3. Quick Grid Access */}
      <View style={styles.quickGrid}>
        {quickLinks.map((link) => (
          <Pressable
            key={link.label}
            onPress={() => router.push(link.route as never)}
            style={styles.quickItem}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: link.color + '15' }]}>
              <MaterialCommunityIcons name={link.icon as never} size={24} color={link.color} />
            </View>
            <Text style={styles.quickLabel}>{link.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* 4. Wallet Glance */}
      <Pressable onPress={() => router.push('/wallet')} style={styles.walletGlance}>
        <View style={styles.walletLeft}>
          <View style={styles.walletIcon}>
            <MaterialCommunityIcons name="wallet-outline" size={20} color={colors.white} />
          </View>
          <View>
            <Text style={styles.walletEyebrow}>Wallet Balance</Text>
            <Text style={styles.walletBalance}>{formatCurrency(walletBalance)}</Text>
          </View>
        </View>
        <View style={styles.walletRight}>
          <View style={styles.cartBadge}>
             <Text style={styles.cartBadgeText}>{foodCart.length + shoppingCart.length} in cart</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
        </View>
      </Pressable>

      {/* 5. AI Recommendations Block */}
      <View style={styles.aiBlock}>
        <LinearGradient 
          colors={['#F0F9FF', '#FFFFFF']} 
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          style={styles.aiGradient}
        >
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons name="robot-outline" size={20} color={colors.aqua} />
            <Text style={styles.aiTitle}>Gozy AI Insights</Text>
          </View>
          {recommendations.slice(0, 1).map((recommendation) => (
            <Text key={recommendation} style={styles.recommendationText}>
              {recommendation}
            </Text>
          ))}
          <Pressable onPress={() => router.push('/assistant')} style={styles.aiLink}>
            <Text style={styles.aiLinkText}>Ask for more ideas</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color={colors.aqua} />
          </Pressable>
        </LinearGradient>
      </View>

      {/* 6. Module Carousels - Travel */}
      <CarouselSection
        title="Explore Destinations"
        subtitle="Flight, stay, and trip ideas for your vibe"
        onPressAction={() => router.push('/travel')}
      >
        {travel.map((item) => (
          <MediaCard
            key={item.id}
            badge={item.type.toUpperCase()}
            image={item.image}
            meta={item.duration}
            onPress={() => router.push('/travel')}
            priceLabel={formatCurrency(item.price)}
            subtitle={item.subtitle}
            title={item.title}
          />
        ))}
      </CarouselSection>

      {/* 7. Module Carousels - Food */}
      <CarouselSection
        title="Near You"
        subtitle="Fast delivery and dine-out favorites"
        onPressAction={() => router.push('/food')}
      >
        {restaurants.map((restaurant) => (
          <MediaCard
            key={restaurant.id}
            badge={restaurant.offer}
            compact
            image={restaurant.image}
            meta={`${restaurant.rating.toFixed(1)} • ${restaurant.eta}`}
            onPress={() => router.push('/food')}
            priceLabel={restaurant.priceForTwo}
            subtitle={restaurant.cuisine}
            title={restaurant.name}
            width={212}
          />
        ))}
      </CarouselSection>

      {/* 8. Module Carousels - Shopping */}
      <CarouselSection
        title="Trending Drops"
        subtitle="Latest in fashion and electronics"
        onPressAction={() => router.push('/shopping')}
      >
        {products.map((product) => (
          <MediaCard
            key={product.id}
            badge={product.badge}
            compact
            image={product.image}
            meta={`${product.brand} • ${product.rating.toFixed(1)}`}
            onPress={() => {
              // Add selection logic or details route
              router.push('/shopping');
            }}
            priceLabel={formatCurrency(product.price)}
            subtitle={product.category}
            title={product.name}
            width={204}
          />
        ))}
      </CarouselSection>

      {/* 9. Module Carousels - Entertainment */}
      <CarouselSection
        title="Movies & Events"
        subtitle="Friday night plans and live sets"
        onPressAction={() => router.push('/entertainment')}
      >
        {events.map((event) => (
          <MediaCard
            key={event.id}
            badge={event.genre}
            compact
            image={event.image}
            meta={`${event.venue} • ${event.date}`}
            onPress={() => router.push('/entertainment')}
            priceLabel={formatCurrency(event.price)}
            subtitle={`${event.rating.toFixed(1)} rated`}
            title={event.title}
            width={228}
          />
        ))}
      </CarouselSection>

      <View style={styles.footerSpacer} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shellContent: {
    paddingHorizontal: 0, // Carousels handle their own horizontal padding
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
    backgroundColor: colors.canvas,
  },
  topGap: { height: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: -spacing.md,
  },
  eyebrow: {
    fontSize: typography.caption,
    fontWeight: '800',
    color: colors.aqua,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  greetingTitle: {
    fontSize: typography.title,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  aiButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  aiButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCarousel: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  heroCard: {
    width: screenWidth - spacing.lg * 2,
    height: 220,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.sky,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    padding: spacing.lg,
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  badgeLine: {
    flexDirection: 'row',
    marginBottom: spacing.xxs,
  },
  heroBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: typography.tiny,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  heroBody: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: typography.caption,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    gap: 4,
  },
  heroCTAText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickIconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: typography.caption,
    fontWeight: '800',
    color: colors.text,
  },
  walletGlance: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletEyebrow: {
    fontSize: typography.tiny,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  walletBalance: {
    fontSize: typography.section,
    fontWeight: '900',
    color: colors.text,
  },
  walletRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cartBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.aqua + '33',
  },
  cartBadgeText: {
    fontSize: typography.tiny,
    fontWeight: '800',
    color: colors.sky,
  },
  aiBlock: {
    paddingHorizontal: spacing.lg,
  },
  aiGradient: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.sm,
    shadowColor: colors.aqua,
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiTitle: {
    fontSize: typography.body,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },
  recommendationText: {
    fontSize: typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  aiLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xxs,
  },
  aiLinkText: {
    fontSize: typography.caption,
    fontWeight: '800',
    color: colors.aqua,
  },
  footerSpacer: {
    height: spacing.xl,
  },
});
