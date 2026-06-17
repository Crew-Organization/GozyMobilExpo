filepath = 'app/(chat)/chat.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Replace searchBar background
content = content.replace("searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1e1e1e' : '#F2F4F7', borderRadius: 24, marginHorizontal: 12, marginVertical: 4, paddingHorizontal: 14, paddingVertical: 9, gap: 8 },", 
                          "searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, marginHorizontal: 12, marginVertical: 4, paddingHorizontal: 14, paddingVertical: 9, gap: 8 },")

with open(filepath, 'w') as f:
    f.write(content)

print("Updated searchBar style")
