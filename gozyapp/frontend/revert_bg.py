import re

filepath = 'app/(chat)/chat.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# I will replace exactly what was replaced.
# But wait, how do I know which ones were originally `#fff` and which ones were `isDark ? '#121212' : '#fff'`?
# Fortunately, I know: `root`, `chatNav`, `header`, `ctxMenu` were `isDark ? '#121212' : '#fff'`.
# Let's replace those specifically:
content = content.replace("root: { flex: 1, backgroundColor: '#fff' }", "root: { flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }")
content = content.replace("chatNav: { flexDirection: 'row', backgroundColor: '#fff',", "chatNav: { flexDirection: 'row', backgroundColor: isDark ? '#121212' : '#fff',")
content = content.replace("backgroundColor: '#fff' },\n  searchBar", "backgroundColor: isDark ? '#121212' : '#fff' },\n  searchBar")
content = content.replace("ctxMenu: { backgroundColor: '#fff',", "ctxMenu: { backgroundColor: isDark ? '#121212' : '#fff',")

with open(filepath, 'w') as f:
    f.write(content)

filepath = 'app/(reels)/reels.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("rootDark: {\n    backgroundColor: '#fff',\n  }", "rootDark: {\n    backgroundColor: '#000',\n  }")
content = content.replace("const tabBackground = isReels ? '#000' : '#fff';", "const tabBackground = isReels ? '#000' : (isDark ? '#121212' : '#fff');")

with open(filepath, 'w') as f:
    f.write(content)

print("Reverted backgrounds.")
