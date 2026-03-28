import codecs

with codecs.open(r'd:\00\FJ\官方程式\game-info-site\src\_includes\layout.njk', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

with codecs.open(r'd:\00\FJ\官方程式\game-info-site\check_bottom.txt', 'w', encoding='utf-8') as out:
    for i in range(195, len(lines)):
        out.write(f"{i+1}: {lines[i]}")
