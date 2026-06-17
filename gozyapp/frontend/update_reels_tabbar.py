import re

filepath = 'app/(reels)/reels.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Remove <BottomTabs />
content = re.sub(r'<BottomTabs />', '', content)

# Update renderTabBar
old_render_tab_bar = r"""      <View style=\[
        styles\.tabBar,
        \{ backgroundColor: tabBackground, borderTopColor: borderCol \},
        isReels && \{ position: 'absolute', bottom: 80, left: 0, right: 0, zIndex: 10, borderTopWidth: 0, backgroundColor: 'rgba\(0,0,0,0\.5\)' \}
      \]>"""

new_render_tab_bar = """      <View style={[
        styles.tabBar,
        { backgroundColor: tabBackground },
        isReels && { backgroundColor: 'rgba(0,0,0,0.5)' }
      ]}>"""

content = content.replace(old_render_tab_bar, new_render_tab_bar)

# Update tabBar styles
old_tab_bar_style = r"""  tabBar: \{ paddingBottom: 86, flexDirection: 'row',
    borderTopWidth: 1,
    height: Platform\.OS === 'ios' \? 84 : 68,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform\.OS === 'ios' \? 22 : 10,
  \},"""

new_tab_bar_style = """  tabBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },"""

content = re.sub(old_tab_bar_style, new_tab_bar_style, content)

with open(filepath, 'w') as f:
    f.write(content)
