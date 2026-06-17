import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, ScrollView, Dimensions, TextInput, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';

const { width } = Dimensions.get('window');

// Header
export function Header({ title, onBack, onSearchPress, onWishlistPress, onBagPress, cartCount }: any) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.iconBtn}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRight}>
        <Pressable onPress={onSearchPress} style={styles.iconBtn}>
          <MaterialCommunityIcons name="magnify" size={24} color={colors.text} />
        </Pressable>
        <Pressable onPress={onWishlistPress} style={styles.iconBtn}>
          <MaterialCommunityIcons name="heart-outline" size={24} color={colors.text} />
        </Pressable>
        <Pressable onPress={onBagPress} style={styles.iconBtn}>
          <MaterialCommunityIcons name="shopping-outline" size={24} color={colors.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// GenderTabs
export function GenderTabs({ activeTab, onTabChange, onGridPress }: any) {
  const tabs = ['ALL', 'MEN', 'WOMEN', 'KIDS'];
  return (
    <View style={styles.genderTabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genderTabs}>
        {tabs.map(tab => (
          <Pressable 
            key={tab} 
            style={[styles.genderTabItem, activeTab === tab && styles.genderTabActive]}
            onPress={() => onTabChange(tab)}
          >
            <Text style={[styles.genderTabText, activeTab === tab && styles.genderTabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// CategorySidebar
export function CategorySidebar({ items, selectedId, onSelect }: any) {
  return (
    <View style={styles.sidebar}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map((item: any) => (
          <Pressable 
            key={item.id} 
            style={[styles.sidebarItem, selectedId === item.id && styles.sidebarItemActive]}
            onPress={() => onSelect(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.sidebarImage} />
            <Text style={[styles.sidebarLabel, selectedId === item.id && styles.sidebarLabelActive]} numberOfLines={2}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// CategorySection
export function CategorySection({ title, items, onItemPress, type }: any) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.gridContainer}>
        {items.map((item: any, index: number) => (
          <Pressable key={index} style={styles.gridItem} onPress={() => onItemPress(item)}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.gridImage} />
            ) : (
              <View style={[styles.gridIconContainer, { backgroundColor: item.color || '#E5E7EB' }]}>
                <MaterialCommunityIcons name={item.icon || 'star'} size={24} color="#FFF" />
              </View>
            )}
            <Text style={styles.gridLabel} numberOfLines={2}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// SearchModal
export function SearchModal({ visible, onClose, onSearch }: any) {
  const [query, setQuery] = React.useState('');
  
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.iconBtn}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
            </Pressable>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search products..."
              value={query}
              onChangeText={setQuery}
              autoFocus
              onSubmitEditing={() => {
                onSearch(query);
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.sm, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.line
  },
  headerTitle: { fontSize: typography.body, fontWeight: '800', color: colors.text, flex: 1, marginLeft: spacing.sm },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: spacing.xs, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FF3F6C', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  genderTabsContainer: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.line },
  genderTabs: { paddingHorizontal: spacing.sm },
  genderTabItem: { paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  genderTabActive: { borderBottomColor: '#FF3F6C' },
  genderTabText: { fontSize: typography.caption, fontWeight: '600', color: colors.textMuted },
  genderTabTextActive: { color: '#FF3F6C', fontWeight: '800' },

  sidebar: { width: 100, backgroundColor: '#F9FAFB', borderRightWidth: 1, borderRightColor: colors.line },
  sidebarItem: { padding: spacing.md, alignItems: 'center', borderLeftWidth: 3, borderLeftColor: 'transparent' },
  sidebarItemActive: { backgroundColor: '#FFF', borderLeftColor: '#FF3F6C' },
  sidebarImage: { width: 50, height: 50, borderRadius: 25, marginBottom: spacing.xs },
  sidebarLabel: { fontSize: 10, textAlign: 'center', color: colors.textMuted },
  sidebarLabelActive: { color: colors.text, fontWeight: 'bold' },

  sectionContainer: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: typography.bodySmall, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '28%', alignItems: 'center', marginBottom: spacing.sm },
  gridImage: { width: 60, height: 60, borderRadius: 30, marginBottom: spacing.xs },
  gridIconContainer: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  gridLabel: { fontSize: 10, textAlign: 'center', color: colors.text },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#FFF', flex: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  searchInput: { flex: 1, height: 40, backgroundColor: '#F3F4F6', borderRadius: radius.md, paddingHorizontal: spacing.md, marginLeft: spacing.sm },
});
