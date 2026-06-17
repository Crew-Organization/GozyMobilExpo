import re

filepath = 'app/(chat)/chat.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Import the store
if 'import { useThemeStore }' not in content:
    content = content.replace("import { router } from 'expo-router';", "import { router } from 'expo-router';\nimport { useThemeStore } from '@/src/store/theme-store';")

# In GozyChatHub:
# Replace:
#   const colorScheme = useColorScheme();
#   const isDark = colorScheme === 'dark';
# With:
#   const colorScheme = useColorScheme();
#   const { theme, toggleTheme } = useThemeStore();
#   const isDark = theme === 'system' ? colorScheme === 'dark' : theme === 'dark';

old_isDark = "  const colorScheme = useColorScheme();\n  const isDark = colorScheme === 'dark';"
new_isDark = "  const colorScheme = useColorScheme();\n  const { theme, toggleTheme } = useThemeStore();\n  const isDark = theme === 'system' ? colorScheme === 'dark' : theme === 'dark';"
content = content.replace(old_isDark, new_isDark)

# Add the button in Header (ChatsTab)
# Wait! In chat.tsx, the header is inside `ChatsTab`, `UpdatesTab`, `CommunitiesTab`, `CallsTab`.
# Actually, wait. Let's find the header in ChatsTab.
# It has <View style={styles.headerRight}> ... <Pressable style={styles.hIcon}><MaterialCommunityIcons name="dots-vertical" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
# Let's insert a theme toggle button there.
# We also need to pass toggleTheme down to the tabs or just use the store inside the tabs directly!
# But since we already pass `isDark` down, maybe it's easier to just use `toggleTheme` from store inside `ChatsTab`.

# Let's import useThemeStore at the top.
# And inside ChatsTab, get toggleTheme:
# const { toggleTheme } = useThemeStore();
chats_tab_match = re.search(r'function ChatsTab\(.*?\)\s*\{', content)
if chats_tab_match:
    chats_tab_def = chats_tab_match.group(0)
    content = content.replace(chats_tab_def, chats_tab_def + "\n  const { toggleTheme, theme } = useThemeStore();")

# Now insert the button in ChatsTab header:
header_right = """<Pressable style={styles.hIcon}><MaterialCommunityIcons name="dots-vertical" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>"""
theme_btn = """<Pressable style={styles.hIcon} onPress={toggleTheme}><Ionicons name={theme === 'dark' ? "moon" : (theme === 'light' ? "sunny" : "contrast")} size={24} color={isDark ? '#fff' : '#111'} /></Pressable>"""
content = content.replace(header_right, theme_btn + "\n            " + header_right)

with open(filepath, 'w') as f:
    f.write(content)

print("Patched chat.tsx")
