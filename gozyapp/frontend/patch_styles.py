import re

filepath = 'app/(chat)/chat.tsx'
with open(filepath, 'r') as f:
    content = f.read()

funcs = [
    r'function ChatsTab\(.*?\)\s*\{',
    r'function UpdatesTab\(.*?\)\s*\{',
    r'function CommunitiesTab\(.*?\)\s*\{',
    r'function CallsTab\(.*?\)\s*\{',
    r'function ConvRow\(.*?\)\s*\{',
    r'function SettingsModal\(.*?\)\s*\{',
    r'function NewListModal\(.*?\)\s*\{',
    r'function ScheduleCallModal\(.*?\)\s*\{',
    r'function KeypadModal\(.*?\)\s*\{'
]

for func in funcs:
    match = re.search(func, content)
    if match:
        def_str = match.group(0)
        # Check if styles is already defined right after
        idx = content.find(def_str) + len(def_str)
        next_chunk = content[idx:idx+100]
        if 'const styles = getStyles(isDark);' not in next_chunk:
            content = content.replace(def_str, def_str + "\n  const styles = getStyles(isDark);")

with open(filepath, 'w') as f:
    f.write(content)

print("Styles patched.")
