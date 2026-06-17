import re

filepath = 'app/(chat)/chat.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# For root: { flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }
content = content.replace("backgroundColor: isDark ? '#121212' : '#fff'", "backgroundColor: '#fff'")

with open(filepath, 'w') as f:
    f.write(content)

filepath = 'app/(reels)/reels.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# For reels.tsx
# rootDark: { backgroundColor: '#000' }
content = content.replace("rootDark: {\n    backgroundColor: '#000',\n  }", "rootDark: {\n    backgroundColor: '#fff',\n  }")

# tabBackground inside renderFeed/renderInbox etc.
# const tabBackground = isReels ? '#000' : (isDark ? '#121212' : '#fff');
content = content.replace("const tabBackground = isReels ? '#000' : (isDark ? '#121212' : '#fff');", "const tabBackground = isReels ? '#000' : '#fff';")

with open(filepath, 'w') as f:
    f.write(content)

print("Backgrounds forced to white.")
