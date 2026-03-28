path = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\時空的裂縫.njk"
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the backslash issue
text = text.replace(r"onerror=" + '"' + r"this.src=\'https://placehold.co/600x450/fff4e6/ff9f43?text=NO+IMAGE&amp;font=Oswald\'" + '"', 
                    'onerror="this.src=\'https://placehold.co/600x450/fff4e6/ff9f43?text=NO+IMAGE&amp;font=Oswald\'"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed backslash bug in onerror.")
