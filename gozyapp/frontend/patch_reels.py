import re

filepath = 'app/(reels)/reels.tsx'

with open(filepath, 'r') as f:
    content = f.read()

if 'import { useThemeStore }' not in content:
    content = content.replace("import { router } from 'expo-router';", "import { router } from 'expo-router';\nimport { useThemeStore } from '@/src/store/theme-store';")

# In Reels:
#   const colorScheme = useColorScheme();
#   const isDark = colorScheme === 'dark';
old_isDark = "  const colorScheme = useColorScheme();\n  const isDark = colorScheme === 'dark';"
new_isDark = "  const colorScheme = useColorScheme();\n  const { theme, toggleTheme } = useThemeStore();\n  const isDark = theme === 'system' ? colorScheme === 'dark' : theme === 'dark';"

# Wait, Reels uses `isDark` inside `export default function Reels() {`
content = content.replace(old_isDark, new_isDark)

# We need to add a theme toggle button. Where?
# In renderFeed(), there is a header:
# <View style={[styles.header, { borderBottomColor: isDark ? '#262626' : '#e0e0e0' }]}> ... <Pressable><MaterialCommunityIcons name="magnify" ...
# Let's find the `magnify` icon and insert the theme button next to it.
header_right = """<MaterialCommunityIcons name="magnify" size={26} color={isDark ? '#fff' : '#000'} />\n                </Pressable>"""
theme_btn = """<Pressable onPress={toggleTheme} style={{ marginRight: 16 }}><Ionicons name={theme === 'dark' ? "moon" : (theme === 'light' ? "sunny" : "contrast")} size={24} color={isDark ? '#fff' : '#000'} /></Pressable>"""
content = content.replace(header_right, theme_btn + "\n                " + header_right)

with open(filepath, 'w') as f:
    f.write(content)

print("Patched reels.tsx")
