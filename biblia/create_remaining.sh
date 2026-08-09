#!/bin/bash
books=(
    "am:Amós:Amós:antigo"
    "ob:Obadias:Obadias:antigo"
    "jn:Jonas:Jonas:antigo"
    "mq:Miquéias:Miquéias:antigo"
    "na:Naum:Naum:antigo"
    "hc:Habacuque:Habacuque:antigo"
    "sf:Sofonias:Sofonias:antigo"
    "ag:Ageu:Ageu:antigo"
    "zc:Zacarias:Zacarias:antigo"
    "ml:Malaquias:Malaquias:antigo"
    "mt:Mateus:Mateus:novo"
    "mc:Marcos:Marcos:novo"
    "lc:Lucas:Lucas:novo"
    "jo:João:João:novo"
    "at:Atos:Atos:novo"
    "rm:Romanos:Romanos:novo"
    "1co:1 Coríntios:1Co:novo"
    "2co:2 Coríntios:2Co:novo"
    "gl:Gálatas:Gálatas:novo"
    "ef:Efésios:Efésios:novo"
    "fp:Filipenses:Filipenses:novo"
    "cl:Colossenses:Colossenses:novo"
    "1ts:1 Tessalonicenses:1Ts:novo"
    "2ts:2 Tessalonicenses:2Ts:novo"
    "1tm:1 Timóteo:1Tm:novo"
    "2tm:2 Timóteo:2Tm:novo"
    "tt:Tito:Tito:novo"
    "fm:Filemom:Filemom:novo"
    "hb:Hebreus:Hebreus:novo"
    "tg:Tiago:Tiago:novo"
    "1pe:1 Pedro:1Pe:novo"
    "2pe:2 Pedro:2Pe:novo"
    "1jo:1 João:1Jo:novo"
    "2jo:2 João:2Jo:novo"
    "3jo:3 João:3Jo:novo"
    "jd:Judas:Judas:novo"
    "ap:Apocalipse:Apocalipse:novo"
)

# Download bible once if not exists
if [ ! -f temp_bible.json ]; then
    curl -s https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_acf.json -o temp_bible.json
fi

for book in "${books[@]}"; do
    IFS=":" read -r abbrev name abr testament <<< "$book"
    
    filename=$(echo "$name" | tr '[:upper:]' '[:lower:]' | iconv -f utf-8 -t ascii//TRANSLIT | sed 's/[^a-z0-9]//g').json
    # Special handling for names
    if [ "$name" == "Cânticos" ]; then filename="canticos.json"; fi
    if [ "$name" == "João" ]; then filename="joao.json"; fi
    if [ "$name" == "1 Coríntios" ]; then filename="1corintios.json"; fi
    if [ "$name" == "2 Coríntios" ]; then filename="2corintios.json"; fi
    if [ "$name" == "Gálatas" ]; then filename="galatas.json"; fi
    if [ "$name" == "Efésios" ]; then filename="efesios.json"; fi
    if [ "$name" == "1 Tessalonicenses" ]; then filename="1tessalonicenses.json"; fi
    if [ "$name" == "2 Tessalonicenses" ]; then filename="2tessalonicenses.json"; fi
    if [ "$name" == "1 Timóteo" ]; then filename="1timoteo.json"; fi
    if [ "$name" == "2 Timóteo" ]; then filename="2timoteo.json"; fi
    if [ "$name" == "1 Pedro" ]; then filename="1pedro.json"; fi
    if [ "$name" == "2 Pedro" ]; then filename="2pedro.json"; fi
    if [ "$name" == "1 João" ]; then filename="1joao.json"; fi
    if [ "$name" == "2 João" ]; then filename="2joao.json"; fi
    if [ "$name" == "3 João" ]; then filename="3joao.json"; fi
    if [ "$name" == "Apocalipse" ]; then filename="apocalipse.json"; fi

    mkdir -p "data/$testament"
    
    node -e "const fs = require('fs'); const bible = JSON.parse(fs.readFileSync('temp_bible.json', 'utf8').replace(/^\uFEFF/, '')); const b = bible.find(b => b.abbrev === '$abbrev'); const out = { livro: '$name', abreviacao: '$abr', capitulos: b.chapters }; fs.writeFileSync('data/$testament/$filename', JSON.stringify(out, null, 2), 'utf8'); console.log('Created $filename');"
done
rm temp_bible.json
