import re
import sys

filepath = 'app/(reels)/reels.tsx'

try:
    with open(filepath, 'r') as f:
        content = f.read()
except FileNotFoundError:
    print("File not found")
    sys.exit(1)

# Import BottomTabs if not imported
if 'import { BottomTabs }' not in content:
    # Look for a place to insert the import
    import_idx = content.find("import { colors, radius, spacing, typography } from '@/src/theme/tokens';")
    if import_idx != -1:
        content = content[:import_idx] + "import { BottomTabs } from '@/src/components/bottom-tabs';\n" + content[import_idx:]
    else:
        # Fallback if first one is not found
        content = "import { BottomTabs } from '@/src/components/bottom-tabs';\n" + content

# Add <BottomTabs /> under {renderTabBar()}
if '<BottomTabs />' not in content:
    # We will replace `{renderTabBar()}` with `{renderTabBar()}\n          <BottomTabs />`
    content = content.replace('{renderTabBar()}\n        </View>', '{renderTabBar()}\n          <BottomTabs />\n        </View>')

# Fix the overlap by adding paddingBottom to tabBar styles
# Currently tabBar is defined in styles.tabBar, but also manipulated inline.
# Let's adjust inline styles for tabBar in renderTabBar()
old_inline = "isReels && { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, borderTopWidth: 0, backgroundColor: 'rgba(0,0,0,0.5)' }"
new_inline = "isReels && { position: 'absolute', bottom: 80, left: 0, right: 0, zIndex: 10, borderTopWidth: 0, backgroundColor: 'rgba(0,0,0,0.5)' }"
content = content.replace(old_inline, new_inline)

# And if it's NOT Reels, it might be in flow. The styles.tabBar has height. 
# We should also add paddingBottom: 80 to the tabBar in StyleSheet
# Or just inline `paddingBottom: activeTab === 'Reels' ? 0 : 80` 
# Let's add it to styles.tabBar:
styles_tabbar_pattern = re.compile(r"tabBar: \{\s*flexDirection: 'row',")
if styles_tabbar_pattern.search(content):
    content = styles_tabbar_pattern.sub("tabBar: { paddingBottom: 86, flexDirection: 'row',", content)

with open(filepath, 'w') as f:
    f.write(content)

print("Refactored reels.tsx")
