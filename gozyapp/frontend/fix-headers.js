const fs = require('fs');
const path = require('path');

const files = [
  'hotel-amenities.tsx',
  'hotel-detail.tsx',
  'hotel-map.tsx',
  'hotel-payment.tsx',
  'hotel-results.tsx',
  'hotel-review-booking.tsx',
  'hotel-review.tsx',
  'hotel-rules.tsx',
  'hotel-select-room.tsx'
];

files.forEach(file => {
  const filePath = path.join('/Users/sandeepnaik/Desktop/GOZY_MOBILE/gozymobileOS/gozyapp/frontend/app/(hotels)', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Safe Area to View
  content = content.replace(/<SafeAreaView style=\{styles\.safeArea\}>/g, '<View style={styles.safeArea}>');
  content = content.replace(/<\/SafeAreaView>/g, '</View>');

  // 2. Add useSafeAreaInsets import if missing
  if (!content.includes('react-native-safe-area-context')) {
    content = content.replace(/(import .* from 'expo-router';\n?)/, "$1import { useSafeAreaInsets } from 'react-native-safe-area-context';\n");
  }

  // 3. Add const insets = useSafeAreaInsets(); inside the component
  // Find the component declaration
  const componentRegex = /export default function [A-Za-z0-9_]+\(\) \{/;
  if (content.match(componentRegex)) {
    if (!content.includes('const insets = useSafeAreaInsets();')) {
      content = content.replace(componentRegex, "$&\n  const insets = useSafeAreaInsets();");
    }
  }

  // 4. Replace <View style={styles.header}>
  content = content.replace(/<View style=\{styles\.header\}>/g, "<View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>");

  // 5. Remove paddingTop from header styles
  // We'll use a regex to find header: { ... paddingTop: XYZ, ... }
  content = content.replace(/(header:\s*\{[^}]*)paddingTop:\s*\d+,?\s*/g, "$1");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', file);
});
