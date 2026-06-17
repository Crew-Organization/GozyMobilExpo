import { useState, useRef } from "react";
import {
  StyleSheet, Text, View, ScrollView, Pressable, TextInput,
  Dimensions, Modal, FlatList, Animated, Linking
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { MaterialCommunityIcons, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS — Gozy theme + BookMyShow accent
═══════════════════════════════════════════════════════════ */
const palette = {
  accent: '#F84464',
  accentDark: '#D6304E',
  accentSoft: '#FFF1F5',
  blue: '#2F6CE5',
  navy: '#172B4D',
  navyLight: '#29446D',
  text: '#1F2937',
  textDark: '#111827',
  textMuted: '#6B7280',
  muted: '#9CA3AF',
  line: '#E5E7EB',
  lineSoft: '#F3F4F6',
  surface: '#FFFFFF',
  canvas: '#FFFFFF',
  softBg: '#F3F4F6',
  cardDark: '#1A1A2E',
  shadow: 'rgba(0,0,0,0.08)',
  success: '#10B981',
  successSoft: '#D1FAE5',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  danger: '#EF4444',
  gold: '#F5C518',
  platinum: '#8B5CF6',
  silver: '#94A3B8',
};

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id: 'movies', label: 'Movies', icon: 'movie-play', bg: '#EFF6FF', color: '#2563EB' },
  { id: 'events', label: 'Events', icon: 'microphone-variant', bg: '#FEF3C7', color: '#D97706' },
  { id: 'sports', label: 'Sports', icon: 'cricket', bg: '#FFF7ED', color: '#EA580C' },
  { id: 'plays', label: 'Plays', icon: 'drama-masks', bg: '#F5F3FF', color: '#7C3AED' },
  { id: 'comedy', label: 'Comedy\nShows', icon: 'emoticon-happy', bg: '#FDF2F8', color: '#DB2777' },
  { id: 'music', label: 'Music\nShows', icon: 'music-note', bg: '#ECFDF5', color: '#059669' },
  { id: 'activities', label: 'Activities', icon: 'gamepad-variant', bg: '#ECFEFF', color: '#0891B2' },
  { id: 'workshops', label: 'Workshops', icon: 'school', bg: '#FEF9C3', color: '#CA8A04' },
];

const NOW_SHOWING = [
  { id: 'm1', title: 'Pushpa 2: The Rule', genre: 'Action/Drama', rating: '8.2', votes: '245K', lang: 'Telugu', cert: 'U/A', duration: '2h 56m', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80', releaseDate: 'Dec 5, 2024' },
  { id: 'm2', title: 'Mufasa: The Lion King', genre: 'Animation/Adventure', rating: '7.8', votes: '89K', lang: 'English', cert: 'U', duration: '1h 58m', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80', releaseDate: 'Dec 20, 2024' },
  { id: 'm3', title: 'Marco', genre: 'Action/Thriller', rating: '8.5', votes: '156K', lang: 'Malayalam', cert: 'A', duration: '2h 31m', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80', releaseDate: 'Dec 20, 2024' },
  { id: 'm4', title: 'Baby John', genre: 'Action/Comedy', rating: '5.9', votes: '67K', lang: 'Hindi', cert: 'U/A', duration: '2h 24m', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80', releaseDate: 'Dec 25, 2024' },
  { id: 'm5', title: 'Vidaamuyarchi', genre: 'Action/Drama', rating: '7.4', votes: '43K', lang: 'Tamil', cert: 'U/A', duration: '2h 18m', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80', releaseDate: 'Jan 10, 2025' },
  { id: 'm6', title: 'Daaku Maharaaj', genre: 'Action/Period', rating: '7.1', votes: '38K', lang: 'Telugu', cert: 'U/A', duration: '2h 42m', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80', releaseDate: 'Jan 12, 2025' },
  { id: 'm7', title: 'Emergency', genre: 'Biography/Drama', rating: '6.8', votes: '52K', lang: 'Hindi', cert: 'U/A', duration: '2h 28m', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80', releaseDate: 'Jan 17, 2025' },
  { id: 'm8', title: 'Fateh', genre: 'Action/Thriller', rating: '6.2', votes: '29K', lang: 'Hindi', cert: 'U/A', duration: '2h 12m', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80', releaseDate: 'Jan 10, 2025' },
];

const COMING_SOON = [
  { id: 'cs1', title: 'Sky Force', genre: 'Action/War', lang: 'Hindi', date: 'Jan 24', image: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&q=80' },
  { id: 'cs2', title: 'Deva', genre: 'Action/Thriller', lang: 'Hindi', date: 'Jan 31', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80' },
  { id: 'cs3', title: 'Chhaava', genre: 'Historical/Drama', lang: 'Hindi', date: 'Feb 14', image: 'https://images.unsplash.com/photo-1518676590747-1e3dcf5a05be?w=400&q=80' },
  { id: 'cs4', title: 'Sikandar', genre: 'Action/Drama', lang: 'Hindi', date: 'Mar 28', image: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=400&q=80' },
  { id: 'cs5', title: 'Thandel', genre: 'Drama/Romance', lang: 'Telugu', date: 'Feb 7', image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&q=80' },
];

const TRENDING_EVENTS = [
  { id: 'e1', title: 'Arijit Singh Live', category: 'Music', date: 'Feb 15, 2025', venue: 'JLN Stadium, Delhi', price: '₹1,499', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80' },
  { id: 'e2', title: 'IPL 2025 — MI vs CSK', category: 'Sports', date: 'Apr 5, 2025', venue: 'Wankhede Stadium, Mumbai', price: '₹800', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80' },
  { id: 'e3', title: 'Stand-Up Night with Zakir Khan', category: 'Comedy', date: 'Mar 1, 2025', venue: 'Siri Fort Auditorium, Delhi', price: '₹999', image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&q=80' },
  { id: 'e4', title: 'Sunburn Festival 2025', category: 'Music', date: 'Dec 28, 2025', venue: 'Vagator Beach, Goa', price: '₹3,500', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80' },
];

const CAST_DATA = [
  { id: 'c1', name: 'Allu Arjun', role: 'Lead', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
  { id: 'c2', name: 'Rashmika M.', role: 'Lead', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { id: 'c3', name: 'Fahadh Faasil', role: 'Antagonist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { id: 'c4', name: 'Sunil', role: 'Supporting', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
  { id: 'c5', name: 'Rao Ramesh', role: 'Supporting', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
  { id: 'c6', name: 'Anasuya', role: 'Supporting', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
];

const DATES = [
  { id: 'd1', day: 'Today', date: '26', month: 'May' },
  { id: 'd2', day: 'Tue', date: '27', month: 'May' },
  { id: 'd3', day: 'Wed', date: '28', month: 'May' },
  { id: 'd4', day: 'Thu', date: '29', month: 'May' },
  { id: 'd5', day: 'Fri', date: '30', month: 'May' },
  { id: 'd6', day: 'Sat', date: '31', month: 'May' },
  { id: 'd7', day: 'Sun', date: '01', month: 'Jun' },
];

const THEATERS = [
  {
    id: 't1', name: 'PVR: Select Citywalk', area: 'Saket, Delhi', amenities: ['M-Ticket', 'Food & Beverage', 'Parking'],
    shows: [
      { id: 's1', time: '09:30 AM', format: '2D', price: 250, status: 'available' },
      { id: 's2', time: '01:15 PM', format: '2D', price: 300, status: 'filling' },
      { id: 's3', time: '04:45 PM', format: 'IMAX 3D', price: 500, status: 'available' },
      { id: 's4', time: '09:00 PM', format: 'IMAX 3D', price: 550, status: 'almost_full' },
    ],
  },
  {
    id: 't2', name: 'INOX: Nehru Place', area: 'Nehru Place, Delhi', amenities: ['M-Ticket', 'Food & Beverage'],
    shows: [
      { id: 's5', time: '10:00 AM', format: '2D', price: 220, status: 'available' },
      { id: 's6', time: '02:30 PM', format: '2D', price: 280, status: 'available' },
      { id: 's7', time: '06:00 PM', format: '3D', price: 350, status: 'filling' },
      { id: 's8', time: '09:30 PM', format: '3D', price: 380, status: 'almost_full' },
    ],
  },
  {
    id: 't3', name: 'Cinepolis: DLF Mall', area: 'Vasant Kunj, Delhi', amenities: ['M-Ticket', 'Food & Beverage', 'Dolby Atmos'],
    shows: [
      { id: 's9', time: '11:00 AM', format: '2D', price: 200, status: 'available' },
      { id: 's10', time: '03:00 PM', format: '4DX', price: 600, status: 'filling' },
      { id: 's11', time: '07:15 PM', format: '2D', price: 300, status: 'available' },
    ],
  },
  {
    id: 't4', name: 'PVR: Ambience Mall', area: 'Gurugram', amenities: ['M-Ticket', 'Recliner', 'Dolby Atmos', 'Parking'],
    shows: [
      { id: 's12', time: '10:30 AM', format: '2D', price: 280, status: 'available' },
      { id: 's13', time: '01:45 PM', format: 'IMAX 3D', price: 520, status: 'filling' },
      { id: 's14', time: '05:00 PM', format: 'IMAX 3D', price: 550, status: 'available' },
      { id: 's15', time: '08:30 PM', format: '2D', price: 320, status: 'almost_full' },
      { id: 's16', time: '10:45 PM', format: '2D', price: 280, status: 'available' },
    ],
  },
  {
    id: 't5', name: 'Rajhans Cinemas', area: 'Noida Sector 18', amenities: ['M-Ticket', 'Parking'],
    shows: [
      { id: 's17', time: '09:00 AM', format: '2D', price: 150, status: 'available' },
      { id: 's18', time: '12:30 PM', format: '2D', price: 180, status: 'available' },
      { id: 's19', time: '04:00 PM', format: '2D', price: 200, status: 'filling' },
      { id: 's20', time: '07:30 PM', format: '2D', price: 220, status: 'almost_full' },
    ],
  },
];

// Seat layout: 0 = empty gap, 1 = available, 2 = booked, 3 = blocked
const SEAT_LAYOUT = {
  platinum: {
    label: 'PLATINUM',
    price: 550,
    rows: [
      { label: 'A', seats: [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0] },
      { label: 'B', seats: [0, 1, 1, 2, 1, 0, 0, 1, 2, 1, 1, 0] },
    ],
  },
  gold: {
    label: 'GOLD',
    price: 350,
    rows: [
      { label: 'C', seats: [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1] },
      { label: 'D', seats: [1, 1, 2, 1, 1, 0, 0, 1, 1, 2, 1, 1] },
      { label: 'E', seats: [1, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 1] },
      { label: 'F', seats: [1, 1, 1, 2, 1, 0, 0, 1, 2, 1, 1, 1] },
    ],
  },
  silver: {
    label: 'SILVER',
    price: 200,
    rows: [
      { label: 'G', seats: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
      { label: 'H', seats: [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1] },
      { label: 'I', seats: [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1] },
      { label: 'J', seats: [1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1] },
    ],
  },
};

const FILTER_LANGUAGES = ['Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam', 'Kannada', 'Bengali', 'Marathi'];
const FILTER_GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Animation', 'Sci-Fi'];
const FILTER_FORMATS = ['2D', '3D', 'IMAX', 'IMAX 3D', '4DX', 'Dolby Atmos'];

const POPULAR_CITIES = [
  { id: 'delhi', name: 'Delhi NCR', icon: 'castle' },
  { id: 'mumbai', name: 'Mumbai', icon: 'bridge' },
  { id: 'kolkata', name: 'Kolkata', icon: 'ship' },
  { id: 'bengaluru', name: 'Bengaluru', icon: 'office-building' },
  { id: 'hyderabad', name: 'Hyderabad', icon: 'church' },
  { id: 'chandigarh', name: 'Chandigarh', icon: 'tree' },
];

const ALL_CITIES = [
  'Agra', 'Ahmedabad', 'Aligarh', 'Amritsar', 'Bengaluru', 'Bhopal', 'Chandigarh',
  'Chennai', 'Coimbatore', 'Delhi NCR', 'Goa', 'Gurgaon', 'Guwahati', 'Hyderabad',
  'Indore', 'Jaipur', 'Kanpur', 'Kochi', 'Kolkata', 'Lucknow', 'Ludhiana',
  'Mangalore', 'Mumbai', 'Mysuru', 'Nagpur', 'Nashik', 'Noida', 'Patna',
  'Pune', 'Raipur', 'Ranchi', 'Surat', 'Trivandrum', 'Vadodara', 'Varanasi', 'Vizag',
];

/* ═══════════════════════════════════════════════════════════
   SCREEN: CITY/LOCATION SELECTOR
═══════════════════════════════════════════════════════════ */
function CitySelector({ onSelect, onBack }: { onSelect: (city: string) => void; onBack: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = ALL_CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        <View style={s.cityHeader}>
          <Pressable onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={palette.textDark} />
          </Pressable>
          <Text style={s.cityHeaderTitle}>Select City</Text>
        </View>

        <View style={s.citySearchBar}>
          <Ionicons name="search" size={18} color={palette.muted} />
          <TextInput
            placeholder="Search for your city"
            placeholderTextColor={palette.muted}
            value={search}
            onChangeText={setSearch}
            style={s.citySearchInput}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={palette.muted} />
            </Pressable>
          )}
        </View>

        {search.length === 0 && (
          <View style={s.popularSection}>
            <Text style={s.sectionLabel}>POPULAR CITIES</Text>
            <View style={s.popularGrid}>
              {POPULAR_CITIES.map(c => (
                <Pressable key={c.id} style={s.popularCard} onPress={() => onSelect(c.name)}>
                  <View style={s.popularIconWrap}>
                    <MaterialCommunityIcons name={c.icon as any} size={26} color={palette.text} />
                  </View>
                  <Text style={s.popularName}>{c.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <FlatList
          data={filtered}
          keyExtractor={i => i}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          ListHeaderComponent={<Text style={[s.sectionLabel, { marginTop: 12, marginBottom: 8 }]}>ALL CITIES</Text>}
          renderItem={({ item }) => (
            <Pressable onPress={() => onSelect(item)} style={s.cityItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={palette.muted} />
              <Text style={s.cityItemText}>{item}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: MOVIE DETAIL
═══════════════════════════════════════════════════════════ */
function MovieDetailScreen({ movie, onBack, onBook }: { movie: any; onBack: () => void; onBook: () => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Hero Poster */}
          <View style={s.detailHero}>
            <Image source={{ uri: movie.image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
            <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFillObject} />
            <View style={s.detailHeroNav}>
              <Pressable onPress={onBack} style={s.detailNavBtn}>
                <Ionicons name="arrow-back" size={22} color="#FFF" />
              </Pressable>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable style={s.detailNavBtn}>
                  <Ionicons name="share-social-outline" size={20} color="#FFF" />
                </Pressable>
              </View>
            </View>
            <View style={s.detailHeroInfo}>
              <View style={s.detailRatingRow}>
                <MaterialCommunityIcons name="star" size={16} color={palette.gold} />
                <Text style={s.detailRatingText}>{movie.rating}/10</Text>
                <Text style={s.detailVotesText}>{movie.votes} votes</Text>
              </View>
              <Pressable style={s.rateBtnOutline}>
                <Text style={s.rateBtnText}>Rate now</Text>
              </Pressable>
            </View>
          </View>

          {/* Movie Info */}
          <View style={s.detailInfoSection}>
            <Text style={s.detailTitle}>{movie.title}</Text>

            <View style={s.detailTagsRow}>
              <View style={s.detailTag}><Text style={s.detailTagText}>{movie.cert}</Text></View>
              <View style={s.detailTag}><Text style={s.detailTagText}>{movie.lang}</Text></View>
              <View style={s.detailTag}><Text style={s.detailTagText}>{movie.duration}</Text></View>
            </View>

            <View style={s.detailGenreRow}>
              {movie.genre.split('/').map((g: string, i: number) => (
                <View key={i} style={s.genrePill}>
                  <Text style={s.genrePillText}>{g.trim()}</Text>
                </View>
              ))}
            </View>

            <Text style={s.detailReleaseDate}>Released on {movie.releaseDate}</Text>
          </View>

          {/* About */}
          <View style={s.detailAbout}>
            <Text style={s.aboutHeading}>About the movie</Text>
            <Text style={s.aboutText}>
              Experience the cinematic magic of {movie.title}. This {movie.genre.toLowerCase()} film takes you on an
              unforgettable journey filled with breathtaking visuals, powerful performances, and a gripping storyline
              that keeps you on the edge of your seat from start to finish. Available in {movie.lang} across theaters nationwide.
            </Text>
          </View>

          {/* Cast & Crew */}
          <View style={s.castSection}>
            <Text style={s.aboutHeading}>Cast & Crew</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 16 }}>
              {CAST_DATA.map(c => (
                <View key={c.id} style={s.castCard}>
                  <Image source={{ uri: c.image }} style={s.castAvatar} contentFit="cover" />
                  <Text style={s.castName} numberOfLines={1}>{c.name}</Text>
                  <Text style={s.castRole}>{c.role}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Offers */}
          <View style={s.offersSection}>
            <Text style={s.aboutHeading}>Offers for you</Text>
            <View style={s.offerCard}>
              <View style={s.offerIconWrap}>
                <MaterialCommunityIcons name="brightness-percent" size={22} color={palette.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.offerTitle}>Flat ₹100 OFF on first booking</Text>
                <Text style={s.offerSub}>Use code: GOZY100 — Valid on all payment methods</Text>
              </View>
            </View>
            <View style={s.offerCard}>
              <View style={s.offerIconWrap}>
                <MaterialCommunityIcons name="credit-card-outline" size={22} color={palette.blue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.offerTitle}>Buy 1 Get 1 with HDFC Bank</Text>
                <Text style={s.offerSub}>Valid on Credit/Debit cards every Wednesday</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Book Button */}
        <View style={s.stickyBookBar}>
          <Pressable onPress={onBook} style={s.bookBtn}>
            <Text style={s.bookBtnText}>Book Tickets</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: THEATER/SHOWTIME SELECTION
═══════════════════════════════════════════════════════════ */
function TheaterScreen({ movie, onBack, onSelectShow }: { movie: any; onBack: () => void; onSelectShow: (theater: any, show: any) => void }) {
  const [selectedDate, setSelectedDate] = useState('d1');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);

  const filteredTheaters = THEATERS.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    if (status === 'available') return palette.success;
    if (status === 'filling') return palette.warning;
    return palette.danger;
  };

  const getStatusBorder = (status: string) => {
    if (status === 'available') return '#D1FAE5';
    if (status === 'filling') return '#FEF3C7';
    return '#FEE2E2';
  };

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        {/* Header */}
        <View style={s.theaterHeader}>
          <Pressable onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={palette.textDark} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={s.theaterHeaderTitle} numberOfLines={1}>{movie.title}</Text>
            <Text style={s.theaterHeaderSub}>{movie.genre} • {movie.cert} • {movie.lang}</Text>
          </View>
        </View>

        {/* Date Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dateRow}>
          {DATES.map(d => {
            const isActive = d.id === selectedDate;
            return (
              <Pressable key={d.id} style={[s.dateCard, isActive && s.dateCardActive]} onPress={() => setSelectedDate(d.id)}>
                <Text style={[s.dateDay, isActive && s.dateDayActive]}>{d.day}</Text>
                <Text style={[s.dateNum, isActive && s.dateNumActive]}>{d.date}</Text>
                <Text style={[s.dateMonth, isActive && s.dateMonthActive]}>{d.month}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          {['2D', '3D', 'IMAX', '4DX'].map(f => (
            <Pressable
              key={f}
              style={[s.filterPill, formatFilter === f && s.filterPillActive]}
              onPress={() => setFormatFilter(formatFilter === f ? null : f)}
            >
              <Text style={[s.filterPillText, formatFilter === f && s.filterPillTextActive]}>{f}</Text>
            </Pressable>
          ))}
          <View style={s.filterDivider} />
          {['₹0-200', '₹200-400', '₹400+'].map(p => (
            <Pressable
              key={p}
              style={[s.filterPill, priceFilter === p && s.filterPillActive]}
              onPress={() => setPriceFilter(priceFilter === p ? null : p)}
            >
              <Text style={[s.filterPillText, priceFilter === p && s.filterPillTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Search */}
        <View style={s.theaterSearchBar}>
          <Ionicons name="search" size={16} color={palette.muted} />
          <TextInput
            placeholder="Search theaters..."
            placeholderTextColor={palette.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={s.theaterSearchInput}
          />
        </View>

        {/* Theater List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {filteredTheaters.map(theater => (
            <View key={theater.id} style={s.theaterCard}>
              <View style={s.theaterNameRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.theaterName}>{theater.name}</Text>
                  <Text style={s.theaterArea}>{theater.area}</Text>
                </View>
                <Pressable>
                  <MaterialCommunityIcons name="information-outline" size={20} color={palette.muted} />
                </Pressable>
              </View>

              {/* Amenity icons */}
              <View style={s.amenityRow}>
                {theater.amenities.map((a, i) => (
                  <View key={i} style={s.amenityBadge}>
                    <MaterialCommunityIcons
                      name={a === 'M-Ticket' ? 'cellphone' : a === 'Parking' ? 'car' : a === 'Food & Beverage' ? 'food' : a === 'Recliner' ? 'seat-recline-extra' : 'surround-sound'}
                      size={12}
                      color={palette.success}
                    />
                    <Text style={s.amenityText}>{a}</Text>
                  </View>
                ))}
              </View>

              {/* Showtimes */}
              <View style={s.showsRow}>
                {theater.shows.map(show => (
                  <Pressable
                    key={show.id}
                    style={[s.showPill, { borderColor: getStatusBorder(show.status) }]}
                    onPress={() => onSelectShow(theater, show)}
                  >
                    <Text style={[s.showTime, { color: getStatusColor(show.status) }]}>{show.time}</Text>
                    <Text style={s.showFormat}>{show.format}</Text>
                    <Text style={s.showPrice}>₹{show.price}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Legend */}
        <View style={s.legendBar}>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: palette.success }]} /><Text style={s.legendText}>Available</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: palette.warning }]} /><Text style={s.legendText}>Filling Fast</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: palette.danger }]} /><Text style={s.legendText}>Almost Full</Text></View>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: SEAT SELECTION
═══════════════════════════════════════════════════════════ */
function SeatSelectionScreen({
  movie, theater, show, onBack, onProceed
}: {
  movie: any; theater: any; show: any; onBack: () => void;
  onProceed: (seats: string[], total: number) => void;
}) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatCount, setSeatCount] = useState(2);

  const toggleSeat = (seatId: string, price: number) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else if (selectedSeats.length < seatCount) {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const getTotal = () => {
    let total = 0;
    selectedSeats.forEach(sid => {
      const [_, row] = sid.split('-');
      const categories = Object.values(SEAT_LAYOUT);
      for (const cat of categories) {
        if (cat.rows.some(r => r.label === row)) {
          total += cat.price;
          break;
        }
      }
    });
    return total;
  };

  const renderSeatSection = (category: typeof SEAT_LAYOUT.platinum, catKey: string) => {
    const catColor = catKey === 'platinum' ? palette.platinum : catKey === 'gold' ? palette.gold : palette.silver;
    return (
      <View key={catKey} style={s.seatCategorySection}>
        <View style={s.seatCategoryHeader}>
          <Text style={[s.seatCategoryLabel, { color: catColor }]}>{category.label} — ₹{category.price}</Text>
        </View>
        {category.rows.map(row => (
          <View key={row.label} style={s.seatRow}>
            <Text style={s.seatRowLabel}>{row.label}</Text>
            <View style={s.seatRowSeats}>
              {row.seats.map((seat, idx) => {
                const seatId = `${catKey}-${row.label}-${idx}`;
                if (seat === 0) return <View key={idx} style={s.seatGap} />;
                if (seat === 2) return (
                  <View key={idx} style={[s.seatBox, s.seatBooked]}>
                    <MaterialCommunityIcons name="close" size={10} color="#FFF" />
                  </View>
                );
                const isSelected = selectedSeats.includes(seatId);
                return (
                  <Pressable
                    key={idx}
                    style={[s.seatBox, isSelected && s.seatSelected]}
                    onPress={() => toggleSeat(seatId, category.price)}
                  >
                    <Text style={[s.seatNum, isSelected && { color: '#FFF' }]}>{idx + 1}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={s.seatRowLabel}>{row.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        {/* Header */}
        <View style={s.theaterHeader}>
          <Pressable onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={palette.textDark} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={s.theaterHeaderTitle} numberOfLines={1}>{movie.title}</Text>
            <Text style={s.theaterHeaderSub}>{theater.name} | {show.time} • {show.format}</Text>
          </View>
        </View>

        {/* Seat count selector */}
        <View style={s.seatCountRow}>
          <Text style={s.seatCountLabel}>How many seats?</Text>
          <View style={s.seatCountPills}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <Pressable
                key={n}
                style={[s.seatCountPill, seatCount === n && s.seatCountPillActive]}
                onPress={() => { setSeatCount(n); setSelectedSeats(prev => prev.slice(0, n)); }}
              >
                <Text style={[s.seatCountNum, seatCount === n && s.seatCountNumActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Screen indicator */}
          <View style={s.screenIndicator}>
            <View style={s.screenCurve} />
            <Text style={s.screenText}>All eyes this way please!</Text>
          </View>

          {/* Seat Grid */}
          <View style={s.seatGrid}>
            {renderSeatSection(SEAT_LAYOUT.platinum, 'platinum')}
            {renderSeatSection(SEAT_LAYOUT.gold, 'gold')}
            {renderSeatSection(SEAT_LAYOUT.silver, 'silver')}
          </View>

          {/* Legend */}
          <View style={s.seatLegendRow}>
            <View style={s.seatLegendItem}>
              <View style={[s.seatLegendBox, { borderColor: palette.line }]} />
              <Text style={s.seatLegendText}>Available</Text>
            </View>
            <View style={s.seatLegendItem}>
              <View style={[s.seatLegendBox, { backgroundColor: palette.success }]} />
              <Text style={s.seatLegendText}>Selected</Text>
            </View>
            <View style={s.seatLegendItem}>
              <View style={[s.seatLegendBox, { backgroundColor: '#D1D5DB' }]} />
              <Text style={s.seatLegendText}>Sold</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        {selectedSeats.length > 0 && (
          <View style={s.seatBottomBar}>
            <View>
              <Text style={s.seatBottomSeats}>{selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} selected</Text>
              <Text style={s.seatBottomPrice}>₹{getTotal()}</Text>
            </View>
            <Pressable style={s.seatPayBtn} onPress={() => onProceed(selectedSeats, getTotal())}>
              <Text style={s.seatPayBtnText}>Pay ₹{getTotal()}</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: BOOKING SUMMARY
═══════════════════════════════════════════════════════════ */
function BookingSummaryScreen({
  movie, theater, show, seats, total, onBack, onProceed
}: {
  movie: any; theater: any; show: any; seats: string[]; total: number;
  onBack: () => void; onProceed: () => void;
}) {
  const [couponCode, setCouponCode] = useState('');
  const convenienceFee = Math.round(total * 0.12);
  const gst = Math.round(total * 0.18);
  const grandTotal = total + convenienceFee;

  const seatLabels = seats.map(sid => {
    const parts = sid.split('-');
    return `${parts[1]}${parseInt(parts[2]) + 1}`;
  }).join(', ');

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        <View style={s.theaterHeader}>
          <Pressable onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={palette.textDark} />
          </Pressable>
          <Text style={s.theaterHeaderTitle}>Booking Summary</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Movie info card */}
          <View style={s.summaryMovieCard}>
            <Image source={{ uri: movie.image }} style={s.summaryPoster} contentFit="cover" />
            <View style={s.summaryMovieInfo}>
              <Text style={s.summaryMovieTitle}>{movie.title}</Text>
              <Text style={s.summaryMeta}>{movie.cert} • {movie.lang} • {movie.duration}</Text>
              <View style={s.summaryDivider} />
              <Text style={s.summaryTheater}>{theater.name}</Text>
              <Text style={s.summaryShowtime}>{show.time} • {show.format} • {DATES.find(d => d.id === 'd1')?.day}, {DATES.find(d => d.id === 'd1')?.date} {DATES.find(d => d.id === 'd1')?.month}</Text>
              <Text style={s.summarySeats}>Seats: {seatLabels}</Text>
            </View>
          </View>

          {/* Coupon */}
          <View style={s.couponCard}>
            <MaterialCommunityIcons name="tag-outline" size={20} color={palette.accent} />
            <TextInput
              placeholder="Enter coupon code"
              placeholderTextColor={palette.muted}
              value={couponCode}
              onChangeText={setCouponCode}
              style={s.couponInput}
            />
            <Pressable style={s.couponApplyBtn}>
              <Text style={s.couponApplyText}>APPLY</Text>
            </Pressable>
          </View>

          {/* Offers */}
          <View style={s.summaryOfferBanner}>
            <MaterialCommunityIcons name="brightness-percent" size={18} color={palette.success} />
            <Text style={s.summaryOfferText}>Use GOZY100 to get ₹100 OFF on this booking</Text>
          </View>

          {/* Bill */}
          <View style={s.billCard}>
            <Text style={s.billHeading}>Price Breakdown</Text>
            <View style={s.billRow}>
              <Text style={s.billLabel}>Ticket Price ({seats.length} ticket{seats.length > 1 ? 's' : ''})</Text>
              <Text style={s.billValue}>₹{total}</Text>
            </View>
            <View style={s.billRow}>
              <Text style={s.billLabel}>Convenience Fee</Text>
              <Text style={s.billValue}>₹{convenienceFee}</Text>
            </View>
            <View style={s.billRow}>
              <Text style={s.billLabel}> ↳ Base Amount + GST (18%)</Text>
              <Text style={[s.billValue, { color: palette.muted }]}>Incl.</Text>
            </View>
            <View style={[s.billRow, s.billTotal]}>
              <Text style={s.billTotalLabel}>Total Amount</Text>
              <Text style={s.billTotalValue}>₹{grandTotal}</Text>
            </View>
          </View>

          {/* Terms */}
          <View style={s.termsNote}>
            <MaterialCommunityIcons name="information-outline" size={14} color={palette.muted} />
            <Text style={s.termsText}>
              By proceeding, I express my consent to complete this transaction. I agree to the{' '}
              <Text style={{ color: palette.accent, fontWeight: '600' }}>Terms & Conditions</Text>.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom bar */}
        <View style={s.seatBottomBar}>
          <View>
            <Text style={s.seatBottomSeats}>Total Amount</Text>
            <Text style={s.seatBottomPrice}>₹{grandTotal}</Text>
          </View>
          <Pressable style={s.seatPayBtn} onPress={onProceed}>
            <Text style={s.seatPayBtnText}>Proceed to Pay</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: CONTACT DETAILS
═══════════════════════════════════════════════════════════ */
function ContactDetailsScreen({
  movie, total, onBack, onConfirm
}: {
  movie: any; total: number; onBack: () => void; onConfirm: () => void;
}) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        <View style={s.theaterHeader}>
          <Pressable onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={palette.textDark} />
          </Pressable>
          <Text style={s.theaterHeaderTitle}>Contact Details</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
          <Text style={s.contactSubHeading}>Your booking details will be sent to these details</Text>

          <Text style={s.inputLabel}>Email Address</Text>
          <View style={s.inputBox}>
            <MaterialCommunityIcons name="email-outline" size={20} color={palette.muted} />
            <TextInput
              placeholder="example@email.com"
              placeholderTextColor={palette.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={s.inputField}
            />
          </View>

          <Text style={s.inputLabel}>Phone Number</Text>
          <View style={s.inputBox}>
            <Text style={s.phonePrefix}>+91</Text>
            <View style={s.phoneDivider} />
            <TextInput
              placeholder="Enter phone number"
              placeholderTextColor={palette.muted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              style={s.inputField}
            />
          </View>

          {/* Terms checkbox */}
          <Pressable style={s.termsCheckRow} onPress={() => setAgreedTerms(!agreedTerms)}>
            <View style={[s.checkbox, agreedTerms && s.checkboxActive]}>
              {agreedTerms && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
            </View>
            <Text style={s.termsCheckText}>
              I accept the <Text style={{ color: palette.accent, fontWeight: '600' }}>Terms & Conditions</Text> and{' '}
              <Text style={{ color: palette.accent, fontWeight: '600' }}>Privacy Policy</Text>
            </Text>
          </Pressable>

          {/* Movie recap */}
          <View style={s.contactMovieRecap}>
            <Image source={{ uri: movie.image }} style={s.recapPoster} contentFit="cover" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.recapTitle}>{movie.title}</Text>
              <Text style={s.recapMeta}>{movie.lang} • {movie.cert} • {movie.duration}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom */}
        <View style={s.seatBottomBar}>
          <View>
            <Text style={s.seatBottomSeats}>Amount Payable</Text>
            <Text style={s.seatBottomPrice}>₹{total}</Text>
          </View>
          <Pressable
            style={[s.seatPayBtn, (!email || !phone || !agreedTerms) && { opacity: 0.5 }]}
            disabled={!email || !phone || !agreedTerms}
            onPress={onConfirm}
          >
            <Text style={s.seatPayBtnText}>Confirm Booking</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: CONFIRM BOOKING (New — BookMyShow style)
═══════════════════════════════════════════════════════════ */
const PAYMENT_METHODS = [
  { id: 'upi', label: 'Pay by any UPI App', icon: 'cellphone-wireless' as const, sub: 'Google Pay, PhonePe, Paytm & more' },
  { id: 'card', label: 'Debit/Credit Card', icon: 'credit-card-outline' as const, sub: 'Visa, Mastercard, Rupay' },
  { id: 'wallet', label: 'Mobile Wallets', icon: 'wallet-outline' as const, sub: 'Paytm, Mobikwik, Amazon Pay' },
  { id: 'voucher', label: 'Gift Voucher', icon: 'gift-outline' as const, sub: 'Redeem your gift voucher' },
  { id: 'netbanking', label: 'Net Banking', icon: 'bank-outline' as const, sub: 'All Indian banks supported' },
  { id: 'paylater', label: 'Pay Later', icon: 'clock-outline' as const, sub: 'Simpl, LazyPay, ZestMoney' },
  { id: 'points', label: 'Redeem Points', icon: 'star-circle-outline' as const, sub: 'Use your reward points' },
];

const UPI_APPS = [
  { id: 'supermoney', label: 'SUPER MONEY UPI', icon: 'shield-check' as const, color: '#4F46E5' },
  { id: 'gpay', label: 'Google Pay', icon: 'google' as const, color: '#4285F4' },
  { id: 'phonepe', label: 'PhonePe', icon: 'cellphone' as const, color: '#5F259F' },
  { id: 'paytm', label: 'Paytm', icon: 'wallet' as const, color: '#00BAF2' },
  { id: 'cred', label: 'CRED UPI', icon: 'diamond-stone' as const, color: '#1A1A2E' },
];

function ConfirmBookingScreen({
  movie, theater, show, seats, total, onBack, onProceed, contactEmail, contactPhone
}: {
  movie: any; theater: any; show: any; seats: string[]; total: number;
  onBack: () => void; onProceed: () => void;
  contactEmail: string; contactPhone: string;
}) {
  const [applyOffersOpen, setApplyOffersOpen] = useState(false);
  const convenienceFee = Math.round(total * 0.12);
  const donationAmount = 0;
  const orderTotal = total + convenienceFee + donationAmount;

  const seatLabels = seats.map(sid => {
    const parts = sid.split('-');
    return `${parts[1]}${parseInt(parts[2]) + 1}`;
  }).join(', ');

  const dateInfo = DATES.find(d => d.id === 'd1');

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        <View style={s.theaterHeader}>
          <Pressable onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={palette.textDark} />
          </Pressable>
          <Text style={s.theaterHeaderTitle}>Confirm Booking</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Movie + Seat info card */}
          <View style={s.cbMovieCard}>
            <View style={s.cbMovieRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.cbMovieTitle}>{movie.title}</Text>
                <Text style={s.cbMovieMeta}>
                  {dateInfo?.day}, {dateInfo?.date} {dateInfo?.month}, 2026 | {show.time}
                </Text>
                <Text style={s.cbMovieLang}>{movie.lang} | {movie.cert}</Text>
                <Text style={s.cbTheater} numberOfLines={1}>
                  {show.format} | Audi: {theater.name}
                </Text>
                <Text style={s.cbSeats}>{seatLabels} ({seats.length} Ticket{seats.length > 1 ? 's' : ''})</Text>
              </View>
              <Pressable style={s.cbEditBadge}>
                <Ionicons name="pencil" size={12} color={palette.accent} />
                <Text style={s.cbEditText}>Box Office</Text>
              </Pressable>
            </View>
          </View>

          {/* Cancellation policy */}
          <View style={s.cbCancelBanner}>
            <MaterialCommunityIcons name="information-outline" size={14} color={palette.warning} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={s.cbCancelTitle}>Cancellation Unavailable</Text>
              <Text style={s.cbCancelSub}>This venue supports booking cancellation only upto 4 Hrs (s) prior to show time.</Text>
            </View>
          </View>

          {/* Price breakdown */}
          <View style={s.cbBillCard}>
            <View style={s.cbBillRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={s.cbBillLabel}>Ticket(s) price</Text>
                <MaterialCommunityIcons name="chevron-down" size={14} color={palette.muted} style={{ marginLeft: 4 }} />
              </View>
              <Text style={s.cbBillValue}>₹{total.toFixed(2)}</Text>
            </View>

            <View style={s.cbBillRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={s.cbBillLabel}>Convenience fees</Text>
                <MaterialCommunityIcons name="chevron-down" size={14} color={palette.muted} style={{ marginLeft: 4 }} />
              </View>
              <Text style={s.cbBillValue}>₹{convenienceFee.toFixed(2)}</Text>
            </View>

            <View style={s.cbBillRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={s.cbBillLabel}>Contribute to Underprivileged Maa chotu</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={s.cbBillDonation}>₹0.00</Text>
                <Text style={s.cbBillAddText}>  Add ₹1.00</Text>
              </View>
            </View>

            <View style={[s.cbBillRow, s.cbBillTotalRow]}>
              <Text style={s.cbBillTotalLabel}>Order total</Text>
              <Text style={s.cbBillTotalValue}>₹{orderTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Send booking details to */}
          <View style={s.cbContactCard}>
            <View style={s.cbContactHeader}>
              <Text style={s.cbContactTitle}>For Sending Booking Details</Text>
              <Pressable style={s.cbContactEditBtn}>
                <Ionicons name="pencil" size={12} color={palette.accent} />
                <Text style={s.cbContactEditText}>Edit</Text>
              </Pressable>
            </View>
            <Text style={s.cbContactInfo}>
              +91 {contactPhone || '9848012345'} | {contactEmail || 'user@gozy.com'}
            </Text>
            <Text style={s.cbContactAddress}>Andhra Pradesh, Kadapa (516001)</Text>
          </View>

          {/* Apply Offers */}
          <Pressable style={s.cbOfferRow} onPress={() => setApplyOffersOpen(!applyOffersOpen)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 16 }}>🎫</Text>
              <Text style={s.cbOfferText}>Apply Offers</Text>
            </View>
            <Ionicons name={applyOffersOpen ? 'chevron-up' : 'chevron-forward'} size={18} color={palette.textMuted} />
          </Pressable>

          {applyOffersOpen && (
            <View style={s.cbOfferExpanded}>
              <View style={s.summaryOfferBanner}>
                <MaterialCommunityIcons name="brightness-percent" size={18} color={palette.success} />
                <Text style={s.summaryOfferText}>Use GOZY100 to get ₹100 OFF on this booking</Text>
              </View>
            </View>
          )}

          {/* Consent */}
          <View style={s.cbConsentBox}>
            <Text style={s.cbConsentText}>
              By proceeding, I express my consent to complete this transaction.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom bar */}
        <View style={s.cbBottomBar}>
          <View>
            <Text style={s.cbBottomLabel}>Total</Text>
            <Text style={s.cbBottomAmount}>₹{orderTotal.toFixed(2)}</Text>
          </View>
          <Pressable style={s.cbContinueBtn} onPress={onProceed}>
            <Text style={s.cbContinueBtnText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: PAYMENT METHOD SELECTION
═══════════════════════════════════════════════════════════ */
function PaymentScreen({
  total, onBack, onSelectMethod
}: {
  total: number; onBack: () => void;
  onSelectMethod: (method: string) => void;
}) {
  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        <View style={s.theaterHeader}>
          <Pressable onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={palette.textDark} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={s.theaterHeaderTitle}>Payment</Text>
          </View>
        </View>

        {/* Amount payable header */}
        <View style={s.pmAmountBar}>
          <Text style={s.pmAmountLabel}>Amount Payable</Text>
          <Text style={s.pmAmountValue}>₹{total.toFixed(2)}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Payment methods list */}
          {PAYMENT_METHODS.map((method, index) => (
            <Pressable
              key={method.id}
              style={[s.pmMethodRow, index === 0 && { borderTopWidth: 0 }]}
              onPress={() => onSelectMethod(method.id)}
            >
              <View style={s.pmMethodIcon}>
                <MaterialCommunityIcons name={method.icon} size={22} color={palette.textDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.pmMethodLabel}>{method.label}</Text>
                {method.sub ? <Text style={s.pmMethodSub}>{method.sub}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </Pressable>
          ))}

          {/* Gozy branding */}
          <View style={s.pmBrandRow}>
            <Text style={s.pmBrandText}>gozy</Text>
            <View style={s.pmBrandIcon}>
              <MaterialCommunityIcons name="shield-check" size={24} color={palette.success} />
            </View>
          </View>

          {/* Note section */}
          <View style={s.pmNoteCard}>
            <Text style={s.pmNoteTitle}>Note:</Text>
            <Text style={s.pmNoteText}>
              1. Congratulations! Tickets once booked can't be exchanged, cancelled or refunded.
            </Text>
            <Text style={s.pmNoteText}>
              2. If booked via Debit/Credit Card, the card holder must present the proof of the ticket's purchase while collecting the ticket(s).
            </Text>
          </View>

          {/* As safe as it gets */}
          <View style={s.pmSafeBanner}>
            <Text style={s.pmSafeTitle}>As safe as it gets</Text>
            <View style={s.pmSafeLogos}>
              <View style={s.pmSafeLogo}><Text style={[s.pmSafeLogoText, { color: '#1A1F71' }]}>VISA</Text></View>
              <View style={s.pmSafeLogo}><Text style={[s.pmSafeLogoText, { color: '#EB001B' }]}>Rupay</Text></View>
              <View style={s.pmSafeLogo}><Text style={[s.pmSafeLogoText, { color: '#FF5F00' }]}>Master</Text></View>
              <View style={s.pmSafeLogo}><Text style={[s.pmSafeLogoText, { color: '#006FCF' }]}>Maestro</Text></View>
              <View style={s.pmSafeLogo}><Text style={[s.pmSafeLogoText, { color: '#003087' }]}>PayPal</Text></View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: UPI APP SELECTION
═══════════════════════════════════════════════════════════ */
function UPIAppScreen({
  total, onBack, onSelectApp
}: {
  total: number; onBack: () => void;
  onSelectApp: (appId: string) => void;
}) {
  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        <View style={s.theaterHeader}>
          <Pressable onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={palette.textDark} />
          </Pressable>
          <Text style={s.theaterHeaderTitle}>Pay by any UPI App</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {UPI_APPS.map((app) => (
            <Pressable
              key={app.id}
              style={s.upiAppRow}
              onPress={() => onSelectApp(app.id)}
            >
              <View style={[s.upiAppIcon, { backgroundColor: app.color + '15' }]}>
                <MaterialCommunityIcons name={app.icon} size={22} color={app.color} />
              </View>
              <Text style={s.upiAppLabel}>{app.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN: BOOKING CONFIRMATION
═══════════════════════════════════════════════════════════ */
function ConfirmationScreen({ movie, theater, show, seats, total, onDone }: {
  movie: any; theater: any; show: any; seats: string[]; total: number; onDone: () => void;
}) {
  const seatLabels = seats.map(sid => {
    const parts = sid.split('-');
    return `${parts[1]}${parseInt(parts[2]) + 1}`;
  }).join(', ');

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top', 'bottom']} style={s.safe}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={s.confirmIconCircle}>
              <MaterialCommunityIcons name="check" size={48} color="#FFF" />
            </View>
            <Text style={s.confirmTitle}>Booking Confirmed!</Text>
            <Text style={s.confirmSub}>Your tickets have been booked successfully</Text>
          </View>

          <View style={s.confirmCard}>
            <View style={s.confirmMovieRow}>
              <Image source={{ uri: movie.image }} style={s.confirmPoster} contentFit="cover" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.confirmMovieTitle}>{movie.title}</Text>
                <Text style={s.confirmMeta}>{movie.lang} • {movie.cert} • {movie.duration}</Text>
              </View>
            </View>
            <View style={s.confirmDivider} />
            <View style={s.confirmDetailRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color={palette.accent} />
              <Text style={s.confirmDetailText}>{theater.name}</Text>
            </View>
            <View style={s.confirmDetailRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={palette.accent} />
              <Text style={s.confirmDetailText}>{show.time} • {show.format}</Text>
            </View>
            <View style={s.confirmDetailRow}>
              <MaterialCommunityIcons name="seat" size={16} color={palette.accent} />
              <Text style={s.confirmDetailText}>Seats: {seatLabels}</Text>
            </View>
            <View style={s.confirmDivider} />
            <View style={s.confirmTotalRow}>
              <Text style={s.confirmTotalLabel}>Amount Paid</Text>
              <Text style={s.confirmTotalValue}>₹{total}</Text>
            </View>
          </View>

          <Pressable style={s.confirmDoneBtn} onPress={onDone}>
            <Text style={s.confirmDoneBtnText}>Back to Home</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP — SCREEN ROUTER
═══════════════════════════════════════════════════════════ */
export default function MoviesApp() {
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'city' | 'detail' | 'theater' | 'seats' | 'summary' | 'contact' | 'confirmBooking' | 'payment' | 'upiApps' | 'confirmation' | 'filters'
  >('home');
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedTheater, setSelectedTheater] = useState<any>(null);
  const [selectedShow, setSelectedShow] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Filter modal state
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  // City selector
  if (currentScreen === 'city') {
    return (
      <CitySelector
        onSelect={(city) => { setSelectedCity(city); setCurrentScreen('home'); }}
        onBack={() => setCurrentScreen('home')}
      />
    );
  }

  // Movie Detail
  if (currentScreen === 'detail' && selectedMovie) {
    return (
      <MovieDetailScreen
        movie={selectedMovie}
        onBack={() => setCurrentScreen('home')}
        onBook={() => setCurrentScreen('theater')}
      />
    );
  }

  // Theater selection
  if (currentScreen === 'theater' && selectedMovie) {
    return (
      <TheaterScreen
        movie={selectedMovie}
        onBack={() => setCurrentScreen('detail')}
        onSelectShow={(theater, show) => {
          setSelectedTheater(theater);
          setSelectedShow(show);
          setCurrentScreen('seats');
        }}
      />
    );
  }

  // Seat selection
  if (currentScreen === 'seats' && selectedMovie && selectedTheater && selectedShow) {
    return (
      <SeatSelectionScreen
        movie={selectedMovie}
        theater={selectedTheater}
        show={selectedShow}
        onBack={() => setCurrentScreen('theater')}
        onProceed={(seats, total) => {
          setSelectedSeats(seats);
          setTotalAmount(total);
          setCurrentScreen('summary');
        }}
      />
    );
  }

  // Booking summary
  if (currentScreen === 'summary' && selectedMovie) {
    const convenienceFee = Math.round(totalAmount * 0.12);
    return (
      <BookingSummaryScreen
        movie={selectedMovie}
        theater={selectedTheater}
        show={selectedShow}
        seats={selectedSeats}
        total={totalAmount}
        onBack={() => setCurrentScreen('seats')}
        onProceed={() => setCurrentScreen('contact')}
      />
    );
  }

  // Contact details
  if (currentScreen === 'contact' && selectedMovie) {
    const convenienceFee = Math.round(totalAmount * 0.12);
    return (
      <ContactDetailsScreen
        movie={selectedMovie}
        total={totalAmount + convenienceFee}
        onBack={() => setCurrentScreen('summary')}
        onConfirm={() => setCurrentScreen('confirmBooking')}
      />
    );
  }

  // Confirm Booking (new screen)
  if (currentScreen === 'confirmBooking' && selectedMovie) {
    const convenienceFee = Math.round(totalAmount * 0.12);
    return (
      <ConfirmBookingScreen
        movie={selectedMovie}
        theater={selectedTheater}
        show={selectedShow}
        seats={selectedSeats}
        total={totalAmount}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        onBack={() => setCurrentScreen('contact')}
        onProceed={() => setCurrentScreen('payment')}
      />
    );
  }

  // Payment method selection (new screen)
  if (currentScreen === 'payment' && selectedMovie) {
    const convenienceFee = Math.round(totalAmount * 0.12);
    return (
      <PaymentScreen
        total={totalAmount + convenienceFee}
        onBack={() => setCurrentScreen('confirmBooking')}
        onSelectMethod={(method) => {
          setSelectedPaymentMethod(method);
          if (method === 'upi') {
            setCurrentScreen('upiApps');
          } else {
            setCurrentScreen('confirmation');
          }
        }}
      />
    );
  }

  // UPI App selection (new screen)
  if (currentScreen === 'upiApps' && selectedMovie) {
    const convenienceFee = Math.round(totalAmount * 0.12);
    return (
      <UPIAppScreen
        total={totalAmount + convenienceFee}
        onBack={() => setCurrentScreen('payment')}
        onSelectApp={(appId) => {
          setCurrentScreen('confirmation');
        }}
      />
    );
  }

  // Confirmation
  if (currentScreen === 'confirmation' && selectedMovie) {
    const convenienceFee = Math.round(totalAmount * 0.12);
    return (
      <ConfirmationScreen
        movie={selectedMovie}
        theater={selectedTheater}
        show={selectedShow}
        seats={selectedSeats}
        total={totalAmount + convenienceFee}
        onDone={() => {
          setCurrentScreen('home');
          setSelectedMovie(null);
          setSelectedTheater(null);
          setSelectedShow(null);
          setSelectedSeats([]);
          setTotalAmount(0);
          setSelectedPaymentMethod('');
        }}
      />
    );
  }

  // ═══ HOME SCREEN ═══
  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safe}>
        {/* Header */}
        <View style={s.homeHeader}>
          <View style={s.homeHeaderLeft}>
            <Pressable onPress={() => router.back()} style={s.homeBackBtn}>
              <Ionicons name="arrow-back" size={24} color={palette.textDark} />
            </Pressable>
            <Pressable onPress={() => setCurrentScreen('city')} style={s.locationRow}>
              <MaterialCommunityIcons name="map-marker" size={18} color={palette.accent} />
              <View style={{ marginLeft: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={s.locationBold}>{selectedCity.split(',')[0]}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={16} color={palette.textDark} />
                </View>
              </View>
            </Pressable>
          </View>
          <View style={s.homeHeaderRight}>
            <Pressable style={s.headerIcon}>
              <Ionicons name="search" size={22} color={palette.textDark} />
            </Pressable>
            <Pressable style={s.headerIcon}>
              <Ionicons name="notifications-outline" size={22} color={palette.textDark} />
            </Pressable>
            <Pressable style={s.headerIcon}>
              <Ionicons name="person-circle-outline" size={26} color={palette.textDark} />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={s.homeSearchBar}>
          <Ionicons name="search" size={18} color={palette.muted} />
          <TextInput
            placeholder="Search for Movies, Events, Plays..."
            placeholderTextColor={palette.muted}
            editable={false}
            style={s.homeSearchInput}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.homeContent}>
          {/* ── Banner Carousel ── */}
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={s.bannerCarousel}>
            {/* Banner 1 */}
            <View style={s.bannerSlide}>
              <LinearGradient colors={['#0F172A', '#1E3A5F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.bannerGrad}>
                <View style={s.bannerLeft}>
                  <Text style={s.bannerEyebrow}>It's time to</Text>
                  <Text style={s.bannerHero}>PLAY</Text>
                  <Text style={s.bannerDesc}>In your District</Text>
                  <Text style={s.bannerOffer}>Get flat ₹100 OFF on your first 3 bookings</Text>
                  <Pressable style={s.bannerCTA}><Text style={s.bannerCTAText}>Explore now ›</Text></Pressable>
                </View>
                <View style={s.bannerRight}>
                  <MaterialCommunityIcons name="soccer" size={44} color="rgba(255,255,255,0.15)" />
                  <MaterialCommunityIcons name="basketball" size={36} color="rgba(249,115,22,0.3)" style={{ marginTop: 8, marginLeft: 14 }} />
                </View>
              </LinearGradient>
            </View>
            {/* Banner 2 */}
            <View style={s.bannerSlide}>
              <LinearGradient colors={['#7C3AED', '#DB2777']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.bannerGrad}>
                <View style={s.bannerLeft}>
                  <Text style={[s.bannerHero, { fontSize: 22 }]}>SUMMERTIME{'\n'}MADNESS</Text>
                  <Text style={s.bannerOffer}>Beat the heat at amusement parks</Text>
                  <Pressable style={[s.bannerCTA, { backgroundColor: '#FFF' }]}>
                    <Text style={[s.bannerCTAText, { color: '#7C3AED' }]}>Up to 50% OFF ›</Text>
                  </Pressable>
                </View>
                <View style={s.bannerRight}>
                  <FontAwesome6 name="umbrella-beach" size={48} color="rgba(255,255,255,0.2)" />
                </View>
              </LinearGradient>
            </View>
          </ScrollView>

          {/* ── Category Grid ── */}
          <View style={s.categoryGrid}>
            {CATEGORIES.map(cat => (
              <Pressable key={cat.id} style={s.catItem}>
                <View style={[s.catIconWrap, { backgroundColor: cat.bg }]}>
                  <MaterialCommunityIcons name={cat.icon as any} size={24} color={cat.color} />
                </View>
                <Text style={s.catLabel}>{cat.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* ── Now Showing ── */}
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>Now Showing</Text>
            <Pressable style={s.seeAllBtn} onPress={() => setShowFiltersModal(true)}>
              <MaterialCommunityIcons name="tune-variant" size={16} color={palette.accent} />
              <Text style={s.filterBtnText}>Filters</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.movieScroll}>
            {NOW_SHOWING.map(movie => (
              <Pressable key={movie.id} style={s.movieCard} onPress={() => { setSelectedMovie(movie); setCurrentScreen('detail'); }}>
                <View style={s.moviePosterWrap}>
                  <Image source={{ uri: movie.image }} style={s.moviePoster} contentFit="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={s.moviePosterGrad} />
                  <View style={s.movieRating}>
                    <MaterialCommunityIcons name="star" size={10} color={palette.gold} />
                    <Text style={s.movieRatingText}>{movie.rating}</Text>
                    <Text style={s.movieVotes}>{movie.votes}</Text>
                  </View>
                </View>
                <Text style={s.movieTitle} numberOfLines={2}>{movie.title}</Text>
                <Text style={s.movieGenre}>{movie.genre}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ── Coming Soon ── */}
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>Coming Soon</Text>
            <Pressable style={s.seeAllBtn}>
              <Text style={s.seeAllText}>See All</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={palette.accent} />
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.movieScroll}>
            {COMING_SOON.map(movie => (
              <View key={movie.id} style={s.movieCard}>
                <View style={s.moviePosterWrap}>
                  <Image source={{ uri: movie.image }} style={s.moviePoster} contentFit="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={s.moviePosterGrad} />
                  <View style={s.comingSoonBadge}>
                    <Text style={s.comingSoonDate}>{movie.date}</Text>
                  </View>
                </View>
                <Text style={s.movieTitle} numberOfLines={2}>{movie.title}</Text>
                <Text style={s.movieGenre}>{movie.genre} • {movie.lang}</Text>
              </View>
            ))}
          </ScrollView>

          {/* ── Trending Events ── */}
          <View style={s.spotlightDivider}>
            <View style={s.spotlightLine} />
            <Text style={s.spotlightText}>TRENDING EVENTS</Text>
            <View style={s.spotlightLine} />
          </View>

          {TRENDING_EVENTS.map(event => (
            <View key={event.id} style={s.eventCard}>
              <Image source={{ uri: event.image }} style={s.eventImage} contentFit="cover" />
              <View style={s.eventInfo}>
                <View style={s.eventCatBadge}>
                  <Text style={s.eventCatText}>{event.category}</Text>
                </View>
                <Text style={s.eventTitle}>{event.title}</Text>
                <View style={s.eventDetailRow}>
                  <MaterialCommunityIcons name="calendar-outline" size={13} color={palette.textMuted} />
                  <Text style={s.eventDetailText}>{event.date}</Text>
                </View>
                <View style={s.eventDetailRow}>
                  <MaterialCommunityIcons name="map-marker-outline" size={13} color={palette.textMuted} />
                  <Text style={s.eventDetailText}>{event.venue}</Text>
                </View>
                <Text style={s.eventPrice}>{event.price} onwards</Text>
              </View>
            </View>
          ))}

          {/* ── Explore Other Categories ── */}
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>Explore Other Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.exploreCatScroll}>
            {[
              { label: 'Comedy Shows', icon: 'emoticon-happy', gradient: ['#F84464', '#E11D48'] },
              { label: 'Music Shows', icon: 'music-note', gradient: ['#7C3AED', '#5B21B6'] },
              { label: 'Kids Zone', icon: 'human-child', gradient: ['#0891B2', '#0E7490'] },
              { label: 'Workshops', icon: 'school', gradient: ['#D97706', '#B45309'] },
            ].map((cat, i) => (
              <Pressable key={i} style={s.exploreCatCard}>
                <LinearGradient colors={cat.gradient as any} style={s.exploreCatGrad}>
                  <MaterialCommunityIcons name={cat.icon as any} size={32} color="#FFF" />
                  <Text style={s.exploreCatLabel}>{cat.label}</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>

          {/* ── Stream Online ── */}
          <View style={s.streamBanner}>
            <LinearGradient colors={['#0F172A', '#1E293B']} style={s.streamGrad}>
              <MaterialCommunityIcons name="play-circle" size={36} color={palette.accent} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.streamTitle}>Stream – Watch Online, Anytime</Text>
                <Text style={s.streamSub}>Rent or buy the latest movies from the comfort of your home</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={palette.muted} />
            </LinearGradient>
          </View>

        </ScrollView>

        {/* Profile Completion Banner */}
        {showProfileBanner && (
          <View style={s.profileBanner}>
            <View style={s.profileBannerLeft}>
              <View style={s.profileAvatar}>
                <Ionicons name="person" size={18} color={palette.muted} />
              </View>
              <View>
                <Text style={s.profileBannerTitle}>Complete your profile</Text>
                <Text style={s.profileBannerSub}>Add your email and other details</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pressable style={s.profileAddBtn}><Text style={s.profileAddBtnText}>Add</Text></Pressable>
              <Pressable onPress={() => setShowProfileBanner(false)}>
                <Ionicons name="close" size={18} color={palette.text} />
              </Pressable>
            </View>
          </View>
        )}

        {/* ── Filters Modal ── */}
        <Modal visible={showFiltersModal} animationType="slide" transparent onRequestClose={() => setShowFiltersModal(false)}>
          <View style={s.modalOverlay}>
            <Pressable style={s.modalBackdrop} onPress={() => setShowFiltersModal(false)} />
            <View style={s.filtersSheet}>
              <View style={s.filtersHeader}>
                <Pressable onPress={() => setShowFiltersModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color={palette.textDark} />
                </Pressable>
                <Text style={s.filtersTitle}>Filters</Text>
                <Pressable onPress={() => { setSelectedLangs([]); setSelectedGenres([]); setSelectedFormats([]); }}>
                  <Text style={s.filtersClearText}>Clear All</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                <Text style={s.filterSectionTitle}>Languages</Text>
                <View style={s.filterChipsRow}>
                  {FILTER_LANGUAGES.map(lang => {
                    const isActive = selectedLangs.includes(lang);
                    return (
                      <Pressable
                        key={lang}
                        style={[s.filterChip, isActive && s.filterChipActive]}
                        onPress={() => setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])}
                      >
                        <Text style={[s.filterChipText, isActive && s.filterChipTextActive]}>{lang}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={s.filterSectionTitle}>Genres</Text>
                <View style={s.filterChipsRow}>
                  {FILTER_GENRES.map(genre => {
                    const isActive = selectedGenres.includes(genre);
                    return (
                      <Pressable
                        key={genre}
                        style={[s.filterChip, isActive && s.filterChipActive]}
                        onPress={() => setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre])}
                      >
                        <Text style={[s.filterChipText, isActive && s.filterChipTextActive]}>{genre}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={s.filterSectionTitle}>Format</Text>
                <View style={s.filterChipsRow}>
                  {FILTER_FORMATS.map(fmt => {
                    const isActive = selectedFormats.includes(fmt);
                    return (
                      <Pressable
                        key={fmt}
                        style={[s.filterChip, isActive && s.filterChipActive]}
                        onPress={() => setSelectedFormats(prev => prev.includes(fmt) ? prev.filter(f => f !== fmt) : [...prev, fmt])}
                      >
                        <Text style={[s.filterChipText, isActive && s.filterChipTextActive]}>{fmt}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>

              <View style={s.filtersBottomBar}>
                <Pressable style={s.filtersApplyBtn} onPress={() => setShowFiltersModal(false)}>
                  <Text style={s.filtersApplyText}>Browse Events</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}


/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  safe: { flex: 1 },

  // ── Back button ──
  backBtn: { marginRight: 14, padding: 2 },

  // ── City Selector ──
  cityHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: palette.line },
  cityHeaderTitle: { fontSize: 18, fontWeight: '700', color: palette.textDark },
  citySearchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 14, backgroundColor: palette.softBg, borderRadius: 10, paddingHorizontal: 12, height: 44, gap: 8 },
  citySearchInput: { flex: 1, fontSize: 15, color: palette.textDark },
  popularSection: { paddingHorizontal: 16, marginTop: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: palette.textMuted, letterSpacing: 1, marginBottom: 14 },
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  popularCard: { width: '30%', alignItems: 'center', marginBottom: 12 },
  popularIconWrap: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: palette.line, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  popularName: { fontSize: 11, fontWeight: '500', color: palette.text, marginTop: 6, textAlign: 'center' },
  cityItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: palette.line },
  cityItemText: { fontSize: 14, color: palette.text },

  // ── Home Header ──
  homeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  homeHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  homeBackBtn: { marginRight: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationBold: { fontSize: 16, fontWeight: '700', color: palette.textDark },
  homeHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginLeft: 14, padding: 3 },

  homeSearchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: palette.softBg, borderRadius: 10, paddingHorizontal: 12, height: 40, gap: 8 },
  homeSearchInput: { flex: 1, fontSize: 14, color: palette.textDark },
  homeContent: { paddingBottom: 80 },

  // ── Banners ──
  bannerCarousel: { paddingHorizontal: 16, gap: 12, marginTop: 6 },
  bannerSlide: { width: screenWidth - 32, height: 155, borderRadius: 14, overflow: 'hidden' },
  bannerGrad: { flex: 1, flexDirection: 'row', padding: 18, alignItems: 'center' },
  bannerLeft: { flex: 1.2 },
  bannerRight: { flex: 0.8, alignItems: 'flex-end' },
  bannerEyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  bannerHero: { fontSize: 28, fontWeight: '900', color: '#38BDF8', letterSpacing: 2, lineHeight: 32 },
  bannerDesc: { fontSize: 12, fontWeight: '700', color: '#FFF', marginTop: -2 },
  bannerOffer: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 6 },
  bannerCTA: { backgroundColor: '#38BDF8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginTop: 8 },
  bannerCTAText: { color: '#0F172A', fontSize: 11, fontWeight: '700' },

  // ── Category Grid ──
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: palette.line },
  catItem: { width: '25%', alignItems: 'center', marginBottom: 14 },
  catIconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  catLabel: { fontSize: 10, fontWeight: '600', color: palette.text, marginTop: 6, textAlign: 'center', lineHeight: 13 },

  // ── Section Headers ──
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 22, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: palette.textDark, letterSpacing: -0.3 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAllText: { fontSize: 12, fontWeight: '700', color: palette.accent },
  filterBtnText: { fontSize: 12, fontWeight: '700', color: palette.accent, marginLeft: 4 },

  // ── Movie Cards ──
  movieScroll: { paddingHorizontal: 16, gap: 12 },
  movieCard: { width: 140 },
  moviePosterWrap: { width: 140, height: 200, borderRadius: 12, overflow: 'hidden', backgroundColor: palette.softBg },
  moviePoster: { width: '100%', height: '100%' },
  moviePosterGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },
  movieRating: { position: 'absolute', bottom: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 3 },
  movieRatingText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  movieVotes: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '500' },
  movieTitle: { fontSize: 13, fontWeight: '700', color: palette.textDark, marginTop: 8, lineHeight: 16 },
  movieGenre: { fontSize: 11, color: palette.textMuted, marginTop: 2 },
  comingSoonBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: palette.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  comingSoonDate: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  // ── Spotlight / Divider ──
  spotlightDivider: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 28, marginBottom: 18 },
  spotlightLine: { flex: 1, height: 1, backgroundColor: palette.line },
  spotlightText: { marginHorizontal: 14, fontSize: 13, fontWeight: '800', color: palette.textDark, letterSpacing: 1 },

  // ── Event Cards ──
  eventCard: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 14, borderRadius: 14, overflow: 'hidden', backgroundColor: '#FFF', borderWidth: 1, borderColor: palette.line, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  eventImage: { width: 110, height: 130 },
  eventInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  eventCatBadge: { backgroundColor: palette.accentSoft, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6 },
  eventCatText: { color: palette.accent, fontSize: 10, fontWeight: '700' },
  eventTitle: { fontSize: 14, fontWeight: '800', color: palette.textDark, marginBottom: 6 },
  eventDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  eventDetailText: { fontSize: 11, color: palette.textMuted },
  eventPrice: { fontSize: 13, fontWeight: '800', color: palette.accent, marginTop: 4 },

  // ── Explore Categories ──
  exploreCatScroll: { paddingHorizontal: 16, gap: 12 },
  exploreCatCard: { width: 120, height: 80, borderRadius: 14, overflow: 'hidden' },
  exploreCatGrad: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6 },
  exploreCatLabel: { color: '#FFF', fontSize: 11, fontWeight: '700', textAlign: 'center' },

  // ── Stream Banner ──
  streamBanner: { marginHorizontal: 16, marginTop: 24, borderRadius: 14, overflow: 'hidden' },
  streamGrad: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  streamTitle: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  streamSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },

  // ── Profile Banner ──
  profileBanner: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: palette.line, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 6 },
  profileBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profileAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: palette.softBg, justifyContent: 'center', alignItems: 'center' },
  profileBannerTitle: { fontSize: 13, fontWeight: '700', color: palette.textDark },
  profileBannerSub: { fontSize: 11, color: palette.textMuted },
  profileAddBtn: { backgroundColor: palette.accent, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  profileAddBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  // ── Filters Modal ──
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  filtersSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', paddingBottom: 0 },
  filtersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: palette.line },
  filtersTitle: { fontSize: 18, fontWeight: '800', color: palette.textDark },
  filtersClearText: { fontSize: 13, fontWeight: '700', color: palette.accent },
  filterSectionTitle: { fontSize: 14, fontWeight: '700', color: palette.textDark, paddingHorizontal: 16, marginTop: 18, marginBottom: 10 },
  filterChipsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: palette.line, backgroundColor: '#FFF' },
  filterChipActive: { borderColor: palette.accent, backgroundColor: palette.accentSoft },
  filterChipText: { fontSize: 13, fontWeight: '600', color: palette.text },
  filterChipTextActive: { color: palette.accent, fontWeight: '700' },
  filtersBottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: palette.line },
  filtersApplyBtn: { backgroundColor: palette.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  filtersApplyText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

  // ═══ MOVIE DETAIL ═══
  detailHero: { width: '100%', height: 380, justifyContent: 'flex-end' },
  detailHeroNav: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  detailNavBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  detailHeroInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
  detailRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailRatingText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  detailVotesText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '500', marginLeft: 4 },
  rateBtnOutline: { borderWidth: 1.5, borderColor: '#FFF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  rateBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  detailInfoSection: { paddingHorizontal: 16, paddingTop: 16 },
  detailTitle: { fontSize: 24, fontWeight: '900', color: palette.textDark, letterSpacing: -0.3 },
  detailTagsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  detailTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: palette.softBg },
  detailTagText: { fontSize: 12, fontWeight: '600', color: palette.text },
  detailGenreRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  genrePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: palette.line },
  genrePillText: { fontSize: 12, fontWeight: '600', color: palette.textMuted },
  detailReleaseDate: { fontSize: 12, color: palette.textMuted, marginTop: 10 },

  detailAbout: { paddingHorizontal: 16, marginTop: 24 },
  aboutHeading: { fontSize: 16, fontWeight: '800', color: palette.textDark, marginBottom: 10 },
  aboutText: { fontSize: 13, color: palette.textMuted, lineHeight: 20 },

  castSection: { paddingLeft: 16, marginTop: 24 },
  castCard: { alignItems: 'center', width: 76 },
  castAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: palette.softBg },
  castName: { fontSize: 11, fontWeight: '600', color: palette.text, marginTop: 6, textAlign: 'center' },
  castRole: { fontSize: 10, color: palette.textMuted, textAlign: 'center' },

  offersSection: { paddingHorizontal: 16, marginTop: 24 },
  offerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: palette.line, marginBottom: 10, backgroundColor: '#FFF' },
  offerIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.accentSoft, justifyContent: 'center', alignItems: 'center' },
  offerTitle: { fontSize: 13, fontWeight: '700', color: palette.textDark },
  offerSub: { fontSize: 11, color: palette.textMuted, marginTop: 2 },

  stickyBookBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: palette.line, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  bookBtn: { backgroundColor: palette.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },

  // ═══ THEATER SELECTION ═══
  theaterHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: palette.line },
  theaterHeaderTitle: { fontSize: 16, fontWeight: '800', color: palette.textDark },
  theaterHeaderSub: { fontSize: 11, color: palette.textMuted, marginTop: 1 },

  dateRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  dateCard: { width: 56, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: palette.line, backgroundColor: '#FFF' },
  dateCardActive: { borderColor: palette.accent, backgroundColor: palette.accentSoft },
  dateDay: { fontSize: 10, fontWeight: '600', color: palette.textMuted },
  dateDayActive: { color: palette.accent },
  dateNum: { fontSize: 18, fontWeight: '900', color: palette.textDark, marginVertical: 2 },
  dateNumActive: { color: palette.accent },
  dateMonth: { fontSize: 10, fontWeight: '600', color: palette.textMuted },
  dateMonthActive: { color: palette.accent },

  filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: palette.line, backgroundColor: '#FFF' },
  filterPillActive: { borderColor: palette.accent, backgroundColor: palette.accentSoft },
  filterPillText: { fontSize: 12, fontWeight: '600', color: palette.text },
  filterPillTextActive: { color: palette.accent, fontWeight: '700' },
  filterDivider: { width: 1, height: 24, backgroundColor: palette.line, marginHorizontal: 4 },

  theaterSearchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: palette.softBg, borderRadius: 8, paddingHorizontal: 10, height: 36, gap: 6 },
  theaterSearchInput: { flex: 1, fontSize: 13, color: palette.textDark },

  theaterCard: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: palette.line },
  theaterNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  theaterName: { fontSize: 14, fontWeight: '700', color: palette.textDark },
  theaterArea: { fontSize: 11, color: palette.textMuted, marginTop: 1 },
  amenityRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  amenityBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  amenityText: { fontSize: 10, color: palette.success, fontWeight: '500' },
  showsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  showPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: 'center', minWidth: 72 },
  showTime: { fontSize: 12, fontWeight: '700' },
  showFormat: { fontSize: 9, color: palette.textMuted, fontWeight: '500', marginTop: 1 },
  showPrice: { fontSize: 10, color: palette.textMuted, marginTop: 2 },

  legendBar: { flexDirection: 'row', justifyContent: 'center', gap: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: palette.line, backgroundColor: '#FFF' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: palette.textMuted, fontWeight: '500' },

  // ═══ SEAT SELECTION ═══
  seatCountRow: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: palette.line },
  seatCountLabel: { fontSize: 14, fontWeight: '700', color: palette.textDark, marginBottom: 10 },
  seatCountPills: { flexDirection: 'row', gap: 8 },
  seatCountPill: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: palette.line, justifyContent: 'center', alignItems: 'center' },
  seatCountPillActive: { borderColor: palette.accent, backgroundColor: palette.accent },
  seatCountNum: { fontSize: 13, fontWeight: '700', color: palette.text },
  seatCountNumActive: { color: '#FFF' },

  screenIndicator: { alignItems: 'center', marginTop: 24, marginBottom: 20 },
  screenCurve: { width: screenWidth * 0.65, height: 6, borderTopLeftRadius: 100, borderTopRightRadius: 100, backgroundColor: palette.softBg, borderWidth: 1, borderColor: palette.line, borderBottomWidth: 0 },
  screenText: { fontSize: 10, color: palette.muted, marginTop: 6, fontWeight: '500' },

  seatGrid: { paddingHorizontal: 8 },
  seatCategorySection: { marginBottom: 16 },
  seatCategoryHeader: { paddingHorizontal: 16, marginBottom: 8 },
  seatCategoryLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  seatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 4, paddingHorizontal: 4 },
  seatRowLabel: { width: 16, fontSize: 10, fontWeight: '700', color: palette.textMuted, textAlign: 'center' },
  seatRowSeats: { flexDirection: 'row', gap: 3, flex: 1, justifyContent: 'center' },
  seatGap: { width: 22, height: 22 },
  seatBox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: palette.line, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  seatBooked: { backgroundColor: '#D1D5DB', borderColor: '#D1D5DB' },
  seatSelected: { backgroundColor: palette.success, borderColor: palette.success },
  seatNum: { fontSize: 8, fontWeight: '600', color: palette.textMuted },

  seatLegendRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20 },
  seatLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  seatLegendBox: { width: 18, height: 18, borderRadius: 3, borderWidth: 1, borderColor: 'transparent' },
  seatLegendText: { fontSize: 11, color: palette.textMuted, fontWeight: '500' },

  seatBottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: palette.line, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  seatBottomSeats: { fontSize: 12, fontWeight: '600', color: palette.textMuted },
  seatBottomPrice: { fontSize: 18, fontWeight: '900', color: palette.textDark },
  seatPayBtn: { backgroundColor: palette.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  seatPayBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

  // ═══ BOOKING SUMMARY ═══
  summaryMovieCard: { flexDirection: 'row', margin: 16, padding: 14, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: palette.line, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  summaryPoster: { width: 80, height: 110, borderRadius: 10, backgroundColor: palette.softBg },
  summaryMovieInfo: { flex: 1, marginLeft: 14 },
  summaryMovieTitle: { fontSize: 16, fontWeight: '800', color: palette.textDark },
  summaryMeta: { fontSize: 12, color: palette.textMuted, marginTop: 3 },
  summaryDivider: { height: 1, backgroundColor: palette.line, marginVertical: 10 },
  summaryTheater: { fontSize: 13, fontWeight: '700', color: palette.textDark },
  summaryShowtime: { fontSize: 11, color: palette.textMuted, marginTop: 2 },
  summarySeats: { fontSize: 12, fontWeight: '700', color: palette.accent, marginTop: 4 },

  couponCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: palette.line, borderStyle: 'dashed', gap: 10 },
  couponInput: { flex: 1, fontSize: 13, color: palette.textDark },
  couponApplyBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, backgroundColor: palette.accentSoft },
  couponApplyText: { color: palette.accent, fontSize: 12, fontWeight: '800' },

  summaryOfferBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 16, padding: 12, borderRadius: 10, backgroundColor: palette.successSoft },
  summaryOfferText: { fontSize: 12, fontWeight: '600', color: palette.success, flex: 1 },

  billCard: { marginHorizontal: 16, padding: 16, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: palette.line },
  billHeading: { fontSize: 15, fontWeight: '800', color: palette.textDark, marginBottom: 14 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 13, color: palette.textMuted },
  billValue: { fontSize: 13, fontWeight: '600', color: palette.textDark },
  billTotal: { borderTopWidth: 1, borderTopColor: palette.line, marginTop: 6, paddingTop: 12 },
  billTotalLabel: { fontSize: 14, fontWeight: '900', color: palette.textDark },
  billTotalValue: { fontSize: 16, fontWeight: '900', color: palette.accent },

  termsNote: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 6 },
  termsText: { fontSize: 11, color: palette.textMuted, lineHeight: 16, flex: 1 },

  // ═══ CONTACT DETAILS ═══
  contactSubHeading: { fontSize: 13, color: palette.textMuted, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: palette.textDark, marginBottom: 8, marginTop: 16 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: palette.line, borderRadius: 10, paddingHorizontal: 14, height: 48, gap: 10, backgroundColor: '#FFF' },
  inputField: { flex: 1, fontSize: 14, color: palette.textDark },
  phonePrefix: { fontSize: 14, fontWeight: '700', color: palette.textDark },
  phoneDivider: { width: 1, height: 24, backgroundColor: palette.line },

  termsCheckRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 20, gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1.5, borderColor: palette.line, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: palette.accent, borderColor: palette.accent },
  termsCheckText: { fontSize: 12, color: palette.textMuted, lineHeight: 18, flex: 1 },

  contactMovieRecap: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: palette.softBg, marginTop: 24 },
  recapPoster: { width: 50, height: 70, borderRadius: 8, backgroundColor: palette.line },
  recapTitle: { fontSize: 14, fontWeight: '700', color: palette.textDark },
  recapMeta: { fontSize: 11, color: palette.textMuted, marginTop: 3 },

  // ═══ CONFIRMATION ═══
  confirmIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: palette.success, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: palette.success, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  confirmTitle: { fontSize: 24, fontWeight: '900', color: palette.textDark, marginBottom: 6 },
  confirmSub: { fontSize: 14, color: palette.textMuted, marginBottom: 28 },
  confirmCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: palette.line, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  confirmMovieRow: { flexDirection: 'row', alignItems: 'center' },
  confirmPoster: { width: 60, height: 85, borderRadius: 10, backgroundColor: palette.softBg },
  confirmMovieTitle: { fontSize: 16, fontWeight: '800', color: palette.textDark },
  confirmMeta: { fontSize: 12, color: palette.textMuted, marginTop: 3 },
  confirmDivider: { height: 1, backgroundColor: palette.line, marginVertical: 14 },
  confirmDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  confirmDetailText: { fontSize: 13, fontWeight: '600', color: palette.text },
  confirmTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  confirmTotalLabel: { fontSize: 14, fontWeight: '700', color: palette.textDark },
  confirmTotalValue: { fontSize: 20, fontWeight: '900', color: palette.success },
  confirmDoneBtn: { backgroundColor: palette.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 28 },
  confirmDoneBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

  // ═══ CONFIRM BOOKING (New) ═══
  cbMovieCard: { margin: 16, padding: 16, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: palette.line, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cbMovieRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cbMovieTitle: { fontSize: 18, fontWeight: '900', color: palette.textDark, marginBottom: 4 },
  cbMovieMeta: { fontSize: 12, color: palette.textMuted, marginBottom: 2 },
  cbMovieLang: { fontSize: 11, color: palette.textMuted, marginBottom: 2 },
  cbTheater: { fontSize: 11, color: palette.textMuted, marginBottom: 4 },
  cbSeats: { fontSize: 12, fontWeight: '700', color: palette.textDark },
  cbEditBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: palette.accentSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, height: 26 },
  cbEditText: { fontSize: 10, fontWeight: '700', color: palette.accent },

  cbCancelBanner: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 10, backgroundColor: palette.warningSoft, borderWidth: 1, borderColor: '#FDE68A' },
  cbCancelTitle: { fontSize: 12, fontWeight: '800', color: '#92400E', marginBottom: 2 },
  cbCancelSub: { fontSize: 11, color: '#92400E', lineHeight: 16 },

  cbBillCard: { marginHorizontal: 16, padding: 16, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: palette.line, marginBottom: 12 },
  cbBillRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cbBillLabel: { fontSize: 13, color: palette.text, fontWeight: '500' },
  cbBillValue: { fontSize: 13, fontWeight: '700', color: palette.textDark },
  cbBillDonation: { fontSize: 13, color: palette.textDark, fontWeight: '600' },
  cbBillAddText: { fontSize: 11, fontWeight: '700', color: palette.accent },
  cbBillTotalRow: { borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 12, marginBottom: 0 },
  cbBillTotalLabel: { fontSize: 14, fontWeight: '900', color: palette.textDark },
  cbBillTotalValue: { fontSize: 15, fontWeight: '900', color: palette.textDark },

  cbContactCard: { marginHorizontal: 16, padding: 14, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: palette.line, marginBottom: 12 },
  cbContactHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cbContactTitle: { fontSize: 13, fontWeight: '800', color: palette.textDark },
  cbContactEditBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cbContactEditText: { fontSize: 12, fontWeight: '700', color: palette.accent },
  cbContactInfo: { fontSize: 12, color: palette.textMuted, lineHeight: 18 },
  cbContactAddress: { fontSize: 11, color: palette.textMuted, marginTop: 2 },

  cbOfferRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, padding: 14, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: palette.line, marginBottom: 4 },
  cbOfferText: { fontSize: 14, fontWeight: '700', color: palette.textDark },
  cbOfferExpanded: { marginHorizontal: 16, marginBottom: 12 },

  cbConsentBox: { marginHorizontal: 16, marginTop: 12, padding: 14, borderRadius: 10, backgroundColor: palette.softBg },
  cbConsentText: { fontSize: 11, color: palette.textMuted, lineHeight: 16 },

  cbBottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: palette.line, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  cbBottomLabel: { fontSize: 12, fontWeight: '600', color: palette.textMuted },
  cbBottomAmount: { fontSize: 18, fontWeight: '900', color: palette.textDark },
  cbContinueBtn: { backgroundColor: palette.accent, paddingHorizontal: 40, paddingVertical: 13, borderRadius: 8, minWidth: 140, alignItems: 'center' },
  cbContinueBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

  // ═══ PAYMENT SCREEN (New) ═══
  pmAmountBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: palette.line, backgroundColor: '#FFF' },
  pmAmountLabel: { fontSize: 14, fontWeight: '600', color: palette.text },
  pmAmountValue: { fontSize: 17, fontWeight: '900', color: palette.textDark },

  pmMethodRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: palette.lineSoft, backgroundColor: '#FFF' },
  pmMethodIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: palette.softBg, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  pmMethodLabel: { fontSize: 14, fontWeight: '600', color: palette.textDark },
  pmMethodSub: { fontSize: 11, color: palette.textMuted, marginTop: 2 },

  pmBrandRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 24, gap: 10 },
  pmBrandText: { fontSize: 20, fontWeight: '900', color: palette.muted, fontStyle: 'italic', letterSpacing: 2 },
  pmBrandIcon: { },

  pmNoteCard: { marginHorizontal: 16, padding: 14, borderRadius: 12, backgroundColor: palette.softBg, marginBottom: 16 },
  pmNoteTitle: { fontSize: 13, fontWeight: '800', color: palette.textDark, marginBottom: 6 },
  pmNoteText: { fontSize: 11, color: palette.textMuted, lineHeight: 18, marginBottom: 4 },

  pmSafeBanner: { marginHorizontal: 16, marginBottom: 16 },
  pmSafeTitle: { fontSize: 12, fontWeight: '600', color: palette.textMuted, marginBottom: 10 },
  pmSafeLogos: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  pmSafeLogo: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#FFF', borderWidth: 1, borderColor: palette.line },
  pmSafeLogoText: { fontSize: 11, fontWeight: '800' },

  // ═══ UPI APP SCREEN (New) ═══
  upiAppRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: palette.lineSoft, backgroundColor: '#FFF' },
  upiAppIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  upiAppLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: palette.textDark },
});
