const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', '(chat)', 'chat.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add useColorScheme import
content = content.replace(/import \{ useState, useCallback, useRef \} from 'react';/, "import { useState, useCallback, useRef } from 'react';\nimport { useColorScheme } from 'react-native';");

// Make components accept isDark
content = content.replace(/function ChatsTab\(\{ (.*?) \}: \{ (.*?) \}\) \{/g, "function ChatsTab({ $1, isDark }: { $2; isDark: boolean }) {");
content = content.replace(/function UpdatesTab\(\) \{/g, "function UpdatesTab({ isDark }: { isDark: boolean }) {");
content = content.replace(/function CommunitiesTab\(\) \{/g, "function CommunitiesTab({ isDark }: { isDark: boolean }) {");
content = content.replace(/function CallsTab\(\{ (.*?) \}: \{ (.*?) \}\) \{/g, "function CallsTab({ $1, isDark }: { $2; isDark: boolean }) {");
content = content.replace(/function ConvRow\(\{ (.*?) \}: \{ (.*?) \}\) \{/g, "function ConvRow({ $1, isDark }: { $2; isDark: boolean }) {");
content = content.replace(/function SettingsModal\(\{ (.*?) \}: \{ (.*?) \}\) \{/g, "function SettingsModal({ $1, isDark }: { $2; isDark: boolean }) {");
content = content.replace(/function NewListModal\(\{ (.*?) \}: \{ (.*?) \}\) \{/g, "function NewListModal({ $1, isDark }: { $2; isDark: boolean }) {");
content = content.replace(/function ScheduleCallModal\(\{ (.*?) \}: \{ (.*?) \}\) \{/g, "function ScheduleCallModal({ $1, isDark }: { $2; isDark: boolean }) {");
content = content.replace(/function KeypadModal\(\{ (.*?) \}: \{ (.*?) \}\) \{/g, "function KeypadModal({ $1, isDark }: { $2; isDark: boolean }) {");

// Pass isDark down
content = content.replace(/<ChatsTab\n/g, "<ChatsTab isDark={isDark}\n");
content = content.replace(/<UpdatesTab \/>/g, "<UpdatesTab isDark={isDark} />");
content = content.replace(/<CommunitiesTab \/>/g, "<CommunitiesTab isDark={isDark} />");
content = content.replace(/<CallsTab\n/g, "<CallsTab isDark={isDark}\n");
content = content.replace(/<ConvRow conv=\{item\}/g, "<ConvRow isDark={isDark} conv={item}");
content = content.replace(/<SettingsModal visible=\{showSettings\}/g, "<SettingsModal isDark={isDark} visible={showSettings}");
content = content.replace(/<NewListModal visible=\{showNewList\}/g, "<NewListModal isDark={isDark} visible={showNewList}");
content = content.replace(/<ScheduleCallModal visible=\{showScheduleCall\}/g, "<ScheduleCallModal isDark={isDark} visible={showScheduleCall}");
content = content.replace(/<KeypadModal visible=\{showKeypad\}/g, "<KeypadModal isDark={isDark} visible={showKeypad}");

// GozyChatHub isDark
content = content.replace(/export default function GozyChatHub\(\) \{/, "export default function GozyChatHub() {\n  const colorScheme = useColorScheme();\n  const isDark = colorScheme === 'dark';");

// Add styles = getStyles(isDark) to all functional components
const components = ['GozyChatHub', 'ChatsTab', 'UpdatesTab', 'CommunitiesTab', 'CallsTab', 'ConvRow', 'SettingsModal', 'NewListModal', 'ScheduleCallModal', 'KeypadModal'];
components.forEach(comp => {
  const regex = new RegExp(`(function ${comp}\\([^{]*\\)\\s*\\{\\n)`);
  content = content.replace(regex, `$1  const styles = getStyles(isDark);\n`);
});

// For GozyChatHub, `isDark` is calculated inside, so styles should be after isDark
content = content.replace(/const isDark = colorScheme === 'dark';\n/, "const isDark = colorScheme === 'dark';\n  const styles = getStyles(isDark);\n");
// And remove the generic injected one for GozyChatHub
content = content.replace(/function GozyChatHub\(\) \{\n  const styles = getStyles\(isDark\);\n/, "function GozyChatHub() {\n");

// Replace const styles = StyleSheet.create with const getStyles = (isDark: boolean) => StyleSheet.create
content = content.replace(/const styles = StyleSheet\.create\(\{/, "const getStyles = (isDark: boolean) => StyleSheet.create({");

// In the getStyles block, replace hardcoded colors
let stylesIndex = content.indexOf('const getStyles = (isDark: boolean) => StyleSheet.create({');
if (stylesIndex !== -1) {
  let stylesStr = content.substring(stylesIndex);
  
  // Padding for chatNav
  stylesStr = stylesStr.replace(/chatNav: \{ flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E0E0E0', paddingVertical: 6 \},/, "chatNav: { flexDirection: 'row', backgroundColor: isDark ? '#121212' : '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: isDark ? '#333' : '#E0E0E0', paddingVertical: 6, paddingBottom: 86 },");
  
  // Fab bottom
  stylesStr = stylesStr.replace(/bottom: 16/g, "bottom: 96");
  stylesStr = stylesStr.replace(/bottom: 24/g, "bottom: 104");
  
  // Theme replacements in styles
  stylesStr = stylesStr.replace(/backgroundColor: '#fff'/g, "backgroundColor: isDark ? '#121212' : '#fff'");
  stylesStr = stylesStr.replace(/backgroundColor: '#F2F4F7'/g, "backgroundColor: isDark ? '#1e1e1e' : '#F2F4F7'");
  stylesStr = stylesStr.replace(/backgroundColor: '#E8F5E9'/g, "backgroundColor: isDark ? '#0A2E1F' : '#E8F5E9'");
  stylesStr = stylesStr.replace(/backgroundColor: '#f5f5f5'/g, "backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5'");
  
  stylesStr = stylesStr.replace(/color: '#111'/g, "color: isDark ? '#fff' : '#111'");
  stylesStr = stylesStr.replace(/color: '#333'/g, "color: isDark ? '#eee' : '#333'");
  stylesStr = stylesStr.replace(/color: '#555'/g, "color: isDark ? '#ccc' : '#555'");
  stylesStr = stylesStr.replace(/color: '#777'/g, "color: isDark ? '#bbb' : '#777'");
  stylesStr = stylesStr.replace(/color: '#888'/g, "color: isDark ? '#aaa' : '#888'");
  stylesStr = stylesStr.replace(/color: '#999'/g, "color: isDark ? '#999' : '#999'");

  stylesStr = stylesStr.replace(/borderColor: '#E0E0E0'/g, "borderColor: isDark ? '#333' : '#E0E0E0'");
  stylesStr = stylesStr.replace(/borderColor: '#F0F0F0'/g, "borderColor: isDark ? '#222' : '#F0F0F0'");
  stylesStr = stylesStr.replace(/borderColor: '#fff'/g, "borderColor: isDark ? '#121212' : '#fff'");

  content = content.substring(0, stylesIndex) + stylesStr;
}

// Inline dark colors
content = content.replace(/color="#111"/g, "color={isDark ? '#fff' : '#111'}");
content = content.replace(/color="#555"/g, "color={isDark ? '#ccc' : '#555'}");
content = content.replace(/color="#777"/g, "color={isDark ? '#bbb' : '#777'}");
content = content.replace(/color="#888"/g, "color={isDark ? '#aaa' : '#888'}");
content = content.replace(/backgroundColor: '#fff'/g, "backgroundColor: isDark ? '#121212' : '#fff'");
content = content.replace(/backgroundColor: 'rgba\(0,0,0,0.1\)'/g, "backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'");

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('chat.tsx refactored for isDark and spacing.');
