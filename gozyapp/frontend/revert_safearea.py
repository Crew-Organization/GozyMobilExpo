filepath = 'app/(chat)/chat.tsx'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>", "<SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>")

with open(filepath, 'w') as f:
    f.write(content)

print("Reverted SafeAreaView.")
