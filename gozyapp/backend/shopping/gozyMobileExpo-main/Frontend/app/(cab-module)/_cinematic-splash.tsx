import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CinematicSplash() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Single blue blurred orb — top right corner */}
      <View style={styles.orb} />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#4F46E5',   // Premium Indigo-600
    opacity: 0.12,
    // High shadow radius relative to size creates a very smooth, wide color blur
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 100,
    elevation: 0,
  },
});
