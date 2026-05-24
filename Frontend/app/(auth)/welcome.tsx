import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, radius } from '@/src/theme/tokens';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type ModuleType = 'travel' | 'shopping' | 'food' | 'movies' | 'content';

interface ModuleDetail {
  id: ModuleType;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  eyebrow: string;
  title: string;
  description: string;
  challenge: string;
  output: string;
  image: string;
  heroTitle: string;
}

const modules: ModuleDetail[] = [
  {
    id: 'travel',
    label: 'Travel',
    icon: 'airplane',
    color: '#0284C7',
    eyebrow: 'TRAVEL BOOKING FLOW',
    title: 'All new\nGozy App',
    description: 'Gozy handles your flights, stays, and dynamic itineraries with AI assistance.',
    challenge: 'Current travel planning requires toggling between dozens of apps for flights, hotels, and itineraries.',
    output: 'A unified AI travel assistant that books end-to-end trips in a single, beautiful interface.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a615061c443?auto=format&fit=crop&w=400&q=80',
    heroTitle: 'Bali Getaway',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: 'shopping-outline',
    color: '#0D9488',
    eyebrow: 'CURATED SHOPPING FLOW',
    title: 'All new\nGozy App',
    description: 'Discover trending lifestyle items with a secure checkout built into your daily feed.',
    challenge: 'Re-look the on-demand shopping experience with a creative approach to reducing steps and quick checkouts.',
    output: 'User friendly interface for a better user experience made in bright colours. Quick easy to use.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
    heroTitle: 'Autumn Collection',
  },
  {
    id: 'food',
    label: 'Food',
    icon: 'silverware-fork-knife',
    color: '#E11D48',
    eyebrow: 'FOOD DELIVERY FLOW',
    title: 'All new\nGozy App',
    description: 'Order your favorite local dining spots with seamless live tracking and chef chat.',
    challenge: 'Re-look the on-demand food delivery experience with a creative approach to reducing steps and quick checkouts.',
    output: 'User friendly interface for a better user experience made in bright colours. Quick easy to use.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    heroTitle: 'Truffle Pizza',
  },
  {
    id: 'movies',
    label: 'Movies',
    icon: 'movie-open-outline',
    color: '#F43F5E',
    eyebrow: 'MOVIE BOOKING FLOW',
    title: 'All new\nGozy App',
    description: 'A pioneer in online ticketing, Gozy is your ultimate entertainment platform.',
    challenge: 'Re-look the On-demand booking experience with creative approach of reducing steps and quick checkouts.',
    output: 'User friendly interface for a better user experience made in bright colours. Quick easy to use.',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80',
    heroTitle: 'Disney Aladdin',
  },
  {
    id: 'content',
    label: 'Content',
    icon: 'play-circle-outline',
    color: '#7C3AED',
    eyebrow: 'SOCIAL CONTENT FLOW',
    title: 'All new\nGozy App',
    description: 'Watch trending creator videos, chat with friends, and share lists instantly.',
    challenge: 'Re-look the content consumption experience with a creative approach to reducing steps and quick checkouts.',
    output: 'User friendly interface for a better user experience made in bright colours. Quick easy to use.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80',
    heroTitle: 'Trending Reels',
  },
];

export default function WelcomeScreen() {
  const [activeModule, setActiveModule] = useState<ModuleType>('movies');
  const activeDetail = modules.find((m) => m.id === activeModule) || modules[3];

  const handleNext = () => {
    router.push('/(home)');
  };

  const renderMockScreen = () => {
    return (
      <Animated.View 
        key={activeDetail.id}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
        style={styles.mockScreenBody}
      >
        <View style={styles.moviesTopNav}>
          <View style={styles.moviesNavTabs}>
            <Text style={[styles.moviesNavTab, styles.moviesNavTabActive]}>{activeDetail.label}</Text>
            <Text style={styles.moviesNavTab}>Explore</Text>
            <Text style={styles.moviesNavTab}>Saved</Text>
          </View>
        </View>
        <View style={styles.moviesFiltersRow}>
          <View style={styles.moviesFilterPill}>
            <MaterialCommunityIcons name="filter-variant" size={8} color="#000" />
            <Text style={styles.moviesFilterText}>FILTER</Text>
          </View>
          <View style={styles.moviesFilterPill}>
            <MaterialCommunityIcons name="star" size={8} color="#000" />
            <Text style={styles.moviesFilterText}>TOP RATED</Text>
          </View>
        </View>
        <View style={styles.moviesHeroCard}>
          <Image
            source={{ uri: activeDetail.image }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <LinearGradient colors={['transparent', '#0F172A']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.moviesHeroContent}>
            <Text style={styles.moviesHeroTitle}>{activeDetail.heroTitle}</Text>
            <View style={styles.moviesHeroStats}>
              <MaterialCommunityIcons name="heart" size={8} color={activeDetail.color} />
              <Text style={styles.moviesHeroStatText}>98% Match</Text>
              <Text style={styles.moviesHeroStatSub}>Popular Now</Text>
            </View>
            <Text style={styles.moviesHeroMeta}>Personalized for you</Text>
            
            <View style={styles.moviesBookBtn}>
              <Text style={styles.moviesBookBtnText}>GO</Text>
            </View>
          </View>
        </View>
        
        {/* Mock Content Feed list items below */}
        <View style={styles.mockListCard}>
          <View style={styles.mockAvatar} />
          <View style={styles.mockListTextStack}>
            <View style={styles.mockListLine1} />
            <View style={styles.mockListLine2} />
          </View>
        </View>
        <View style={styles.mockListCard}>
          <View style={styles.mockAvatar} />
          <View style={styles.mockListTextStack}>
            <View style={styles.mockListLine1} />
            <View style={styles.mockListLine2} />
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Circle */}
      <View style={[styles.heroBgCircle, { backgroundColor: activeDetail.color }]} />
      
      {/* Top Half: Presentation */}
      <View style={styles.topHalf}>
        <View style={styles.heroLeftCol}>
          <Text style={[styles.eyebrow, { color: activeDetail.color }]}>{activeDetail.eyebrow}</Text>
          <Text style={styles.mainTitle}>{activeDetail.title}</Text>
          <Text style={styles.description} numberOfLines={4}>{activeDetail.description}</Text>
        </View>

        <View style={styles.heroRightCol}>
          <View style={styles.phoneMockupRotated}>
            <View style={styles.phoneNotch} />
            <View style={styles.phoneScreen}>
              <View style={styles.mockStatusBar}>
                <Text style={styles.statusBarTime}>9:41</Text>
                <View style={styles.statusBarIcons}>
                  <MaterialCommunityIcons name="signal" size={6} color="#FFFFFF" />
                  <MaterialCommunityIcons name="wifi" size={6} color="#FFFFFF" style={{ marginLeft: 2 }} />
                  <MaterialCommunityIcons name="battery" size={8} color="#FFFFFF" style={{ marginLeft: 2 }} />
                </View>
              </View>
              
              <View style={{ flex: 1, overflow: 'hidden' }}>
                {renderMockScreen()}
              </View>

              <View style={styles.moviesBottomBar}>
                <MaterialCommunityIcons name="home" size={14} color="#000" />
                <MaterialCommunityIcons name="magnify" size={14} color="#94A3B8" />
                <MaterialCommunityIcons name="ticket-confirmation-outline" size={14} color="#94A3B8" />
                <MaterialCommunityIcons name="account" size={14} color="#94A3B8" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Middle: Module Tabs Row */}
      <View style={styles.tabsRow}>
        {modules.map((item) => {
          const isActive = item.id === activeModule;
          return (
            <Pressable
              key={item.id}
              onPress={() => setActiveModule(item.id)}
              style={[
                styles.tabButton,
                isActive && { borderColor: activeDetail.color, backgroundColor: activeDetail.color + '15' },
              ]}
            >
              <MaterialCommunityIcons name={item.icon} size={14} color={isActive ? activeDetail.color : colors.textMuted} />
              <Text style={[styles.tabLabel, isActive && { color: activeDetail.color, fontWeight: '900' }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom Half: About Section */}
      <View style={styles.bottomHalf}>
        <View style={styles.watermarkContainer}>
          <Text style={styles.watermarkText}>redesign</Text>
        </View>

        <Text style={[styles.aboutEyebrow, { color: activeDetail.color }]}>ABOUT REDESIGN</Text>
        
        <View style={styles.aboutColumns}>
          <View style={styles.aboutCol}>
            <Text style={styles.aboutTitle}>Challenge</Text>
            <Text style={styles.aboutBody} numberOfLines={4}>{activeDetail.challenge}</Text>
          </View>
          <View style={styles.aboutCol}>
            <Text style={styles.aboutTitle}>Output</Text>
            <Text style={styles.aboutBody} numberOfLines={4}>{activeDetail.output}</Text>
          </View>
        </View>

        <Pressable onPress={handleNext} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Try the Future</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  heroBgCircle: {
    position: 'absolute',
    top: -100,
    right: -150,
    width: screenHeight * 0.7,
    height: screenHeight * 0.7,
    borderRadius: screenHeight * 0.35,
    zIndex: 0,
  },
  topHalf: {
    flex: 5, // Reduced from 5.5 to shift boundary up
    flexDirection: 'row',
    paddingTop: 35, // Reduced from 45 to shift content up
    paddingHorizontal: 20,
    zIndex: 1,
  },
  heroLeftCol: {
    flex: 1.1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 32,
    marginBottom: 6, // Reduced margin
  },
  description: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000', // Changed to black
    lineHeight: 16,
  },
  heroRightCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneMockupRotated: {
    width: 165,
    height: 345,
    backgroundColor: '#000',
    borderRadius: 24,
    padding: 5,
    transform: [{ rotate: '12deg' }, { translateX: 5 }],
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 5, height: 10 },
    elevation: 10,
  },
  phoneNotch: {
    position: 'absolute',
    top: 5,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 12,
    backgroundColor: '#000',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    overflow: 'hidden',
  },
  mockStatusBar: {
    height: 20,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
    zIndex: 2,
  },
  statusBarTime: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '600',
  },
  statusBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 5, // Reduced padding
    gap: 6,
    zIndex: 2,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tabLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  bottomHalf: {
    flex: 3, // Increased from 2.5 to push tabs up
    paddingHorizontal: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  watermarkContainer: {
    position: 'absolute',
    top: -35,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  watermarkText: {
    fontSize: 55,
    fontWeight: '900',
    color: '#F1F5F9',
    opacity: 0.8,
  },
  aboutEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  aboutColumns: {
    flexDirection: 'row',
    gap: 20,
  },
  aboutCol: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  aboutBody: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 16,
  },
  continueButton: {
    marginTop: 24, // Added more top spacing
    marginBottom: 24, // Added bottom spacing
    alignSelf: 'center',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  mockScreenBody: {
    flex: 1,
    backgroundColor: '#0F172A',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  moviesTopNav: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  moviesNavTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moviesNavTab: {
    color: '#94A3B8',
    fontSize: 7,
    fontWeight: '600',
  },
  moviesNavTabActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  moviesFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: 4,
  },
  moviesFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  moviesFilterText: {
    fontSize: 5,
    fontWeight: '700',
    color: '#FFF',
  },
  moviesHeroCard: {
    marginHorizontal: 8,
    marginTop: 6,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  moviesHeroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  moviesHeroTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  moviesHeroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  moviesHeroStatText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '700',
  },
  moviesHeroStatSub: {
    color: '#94A3B8',
    fontSize: 6,
  },
  moviesHeroMeta: {
    color: '#94A3B8',
    fontSize: 6,
    marginTop: 2,
  },
  moviesBookBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#F43F5E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  moviesBookBtnText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },
  mockListCard: {
    flexDirection: 'row',
    marginHorizontal: 8,
    marginTop: 6,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  mockAvatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  mockListTextStack: {
    flex: 1,
    gap: 4,
  },
  mockListLine1: {
    height: 6,
    width: '60%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  mockListLine2: {
    height: 5,
    width: '40%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
  },
  moviesBottomBar: {
    height: 28,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 2,
  },
});
