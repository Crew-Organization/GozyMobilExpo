import re

filepath = 'app/(chat)/[conversationId].tsx'
with open(filepath, 'r') as f:
    content = f.read()

# We need to wrap the bubble and reactions in a View with flexDirection: column
# But messageRow has flexDirection: row.
# Let's see what is inside messageRow.
