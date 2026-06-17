import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, TextInput, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';

const { width, height } = Dimensions.get('window');

const TABS = ['Key Landmarks', 'Food & Shopping', 'Transport'];

export default function HotelMapScreen() {
  const insets = useSafeAreaInsets();
  const { selectedHotel } = useSuperAppStore();
  const [activeTab, setActiveTab] = useState('Key Landmarks');

  if (!selectedHotel) return null;

  return (
    <View style={styles.safeArea}>
      
      {/* Mock Map Background */}
      <View style={StyleSheet.absoluteFillObject}>
        {/* We use a static map image for demonstration to keep it lightweight without react-native-maps */}
        <Image source={{uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80'}} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        <View style={[StyleSheet.absoluteFillObject, {backgroundColor: 'rgba(255,255,255,0.7)'}]} />
        
        {/* Map Pin */}
        <View style={{position: 'absolute', top: '30%', left: '40%', alignItems: 'center'}}>
          <View style={{backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, marginBottom: 8}}>
            <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '900', color: '#0084FF'}} numberOfLines={1}>{selectedHotel.name}</Text>
            <Text style={{fontSize: 8, color: '#8E8E93'}}>{selectedHotel.location}</Text>
          </View>
          <MaterialCommunityIcons name="map-marker" size={32} color="#0084FF" />
        </View>

        {/* Other Pins */}
        <View style={{position: 'absolute', top: '20%', left: '60%', alignItems: 'center'}}>
          <MaterialCommunityIcons name="map-marker-outline" size={24} color="#E11D48" />
        </View>
        <View style={{position: 'absolute', top: '45%', left: '30%', alignItems: 'center'}}>
          <MaterialCommunityIcons name="map-marker-outline" size={24} color="#D97706" />
        </View>
      </View>

      {/* Header Buttons */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </Pressable>
        <Pressable style={styles.nearbyPill}>
          <MaterialCommunityIcons name="checkbox-blank-outline" size={16} color="#0084FF" />
          <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800', marginLeft: 8}}>Nearby Hotels</Text>
        </Pressable>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.handle} />
        
        <View style={styles.searchInput}>
          <TextInput placeholder="Search property distance from..." style={{flex: 1, fontSize: 12}} />
          <MaterialCommunityIcons name="magnify" size={20} color="#0084FF" />
        </View>

        <View style={styles.tabsContainer}>
          {TABS.map(tab => (
            <Pressable key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.activeTabLine} />}
            </Pressable>
          ))}
        </View>

        <ScrollView style={{flex: 1}}>
          <View style={{padding: 16}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
              <Text style={{fontSize: 10, fontWeight: '800', color: '#8E8E93', letterSpacing: 1, textTransform: 'uppercase'}}>Nearby Landmarks</Text>
            </View>

            {[
              {name: 'Alliance Business Hub - Phoenix', distance: '4.5 km'},
              {name: 'University of Hyderabad', distance: '2.1 km'},
              {name: 'Gachibowli Stadium', distance: '3.2 km'}
            ].map((landmark, idx) => (
              <View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA'}}>
                <Text style={{fontSize: 13, color: '#333'}}>{landmark.name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 12, color: '#8E8E93'}}>{landmark.distance}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color="#8E8E93" style={{marginLeft: 4}} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  nearbyPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },

  bottomPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.45, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  handle: { width: 40, height: 4, backgroundColor: '#E5E5EA', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  
  searchInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, marginHorizontal: 16, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16 },
  
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', paddingHorizontal: 16 },
  tabBtn: { paddingVertical: 12, marginRight: 24, position: 'relative' },
  tabBtnActive: {},
  tabText: { fontSize: 12, fontWeight: '800', color: '#8E8E93' },
  tabTextActive: { color: '#333' },
  activeTabLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: '#333', borderTopLeftRadius: 3, borderTopRightRadius: 3 },
});
