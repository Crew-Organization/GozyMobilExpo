import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { CabPolicyGroup } from '@/src/types';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export function CabPolicySheet({
  groups,
  activeGroupId,
  onChangeGroup,
  onClose,
}: {
  groups: CabPolicyGroup[];
  activeGroupId: string;
  onChangeGroup: (groupId: string) => void;
  onClose: () => void;
}) {
  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? groups[0];

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.tabRow}>
              {groups.map((group) => {
                const active = activeGroup.id === group.id;
                return (
                  <Pressable
                    key={group.id}
                    onPress={() => onChangeGroup(group.id)}
                    style={styles.tabButton}>
                    <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
                      {group.title}
                    </Text>
                    {active ? <View style={styles.tabUnderline} /> : null}
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons color="#9CA3AF" name="close-circle" size={42} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {activeGroup.items.map((item) => (
              <View key={item.heading} style={styles.section}>
                <Text style={styles.sectionHeading}>{item.heading}</Text>
                <Text style={styles.sectionBody}>{item.body}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'center',
  },
  sheet: {
    maxHeight: '74%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 92,
    position: 'relative',
  },
  tabText: {
    color: '#4B5563',
    fontSize: 22,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '900',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#17A6F7',
  },
  closeButton: {
    paddingHorizontal: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  sectionHeading: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  sectionBody: {
    color: '#4B5563',
    fontSize: 18,
    lineHeight: 29,
  },
});
