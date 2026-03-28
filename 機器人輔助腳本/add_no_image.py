import re

path = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\時空的裂縫.njk"
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace img tags to add onerror attribute if not present
text = re.sub(
    r'(<img src="/images/組隊副本/時空的裂縫/\w+\.png"[^>]*)>',
    r'\1 onerror="this.src=\'https://placehold.co/600x450/fff4e6/ff9f43?text=NO+IMAGE&amp;font=Oswald\'">', 
    text
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Added NO IMAGE fallback successfully.")
