# TSV Volleyball Neutraubling – Website Context

## Projektstruktur
```
tsv-website/
├── index.html              # Startseite mit Hero-Slider, News, Teams, Sponsoren, Camp
├── mannschaften.html       # Mannschaftsübersicht
├── damen-1.html bis -4.html # Damen Teams (Regionalliga, Bezirksliga, Bezirksklasse, Kreisklasse)
├── herren-1.html           # Herren (Bezirksliga)
├── freizeit-mixed-1.html   # Mixed I. (2. Liga-Mixed)
├── freizeit-mixed-2.html   # Mixed II. (Freizeitliga)
├── jugend.html             # Jugendübersicht
├── u13.html, u14.html, u16.html, u20.html  # Jugend-Unterseiten
├── training.html           # Trainingszeiten-Tabelle
├── turniere.html           # Turniertermine
├── anfahrt.html            # Anfahrt mit Google Maps
├── kontakt.html            # Kontakt
├── volleyball-shop.html    # Shop
├── sponsoren.html          # Sponsoren-Galerie
├── projekt-interreg.html   # INTERREG Projekt
├── sommer-camp.html        # Sommer-Camp
├── erfolgsleiter.html      # Erfolgsleiter der Jugend
├── geschichte.html         # Geschichte der Abteilung
├── erfolge.html            # Erfolge der Abteilung
├── impressum.html          # Impressum
├── datenschutz.html        # Datenschutzerklärung
├── css/
│   ├── style.css           # Hauptstyles (Header, Hero, Sections, Footer, Subpages)
│   └── team.css            # Team-Seiten-Styles
├── js/
│   └── main.js             # Navigation, Hero-Slider, Sponsoren-Slider
└── images/                 # (leer, Bilder von externer WP-Website)
```

## Design-System
- **Primärfarbe:** `#c30007` (Rot) – CSS-Variable `--primary`
- **Dunkel:** `#1a1a2e` – CSS-Variable `--dark`
- **Schriften:** Inter (Body), Oswald (Headings) via Google Fonts
- **Icons:** Font Awesome 6.5.0
- **Container:** max-width 1200px, padding 0 24px
- **Breakpoints:** 1024px (Tablet), 768px (Mobile), 480px (Small Mobile)

## Navigationsstruktur (identisch auf ALLEN Seiten)
```
Mannschaften ▼
  ├── Damen 1 | Damen 2 | Damen 3 | Damen 4
  ├── Herren 1
  └── Freizeit-Mixed I. | Freizeit-Mixed II.
Jugend ▼
  ├── U13 & jünger | U14 | U16 | U20/U18
Training | Turniere | Anfahrt | Kontakt | Shop
Mehr ▼
  ├── Unsere Sponsoren | Projekt INTERREG
  ├── Volleyball-Sommer-Camp | Erfolgsleiter der Jugend
  └── Geschichte der Abteilung | Erfolge der Abteilung
```

## Seiten-Typen & Templates

### 1. Startseite (`index.html`)
- `<body>` ohne spezielle Klasse
- Hero-Slider (3 Slides, automatisch wechselnd)
- Sections: News, Teams, Sponsoren, Camp, Spielplan, CTA

### 2. Team-Seiten (`damen-*.html`, `herren-*.html`, `freizeit-mixed-*.html`)
- `<body class="team-page">`
- Lädt `css/style.css` + `css/team.css`
- `team-hero` mit Badge (Liga), Title, Meta (Training, Ort)
- `team-content` mit Grid (main + sidebar)
- Sidebar: Trainerinfo, Trainingszeiten, Liga-Info
- VAPI-API für Spielplan/Tabelle (data-wettbewerb, data-typ, data-vapi-teams)
- Galerie-Sektion, CTA, Footer

### 3. Subpages (alle anderen)
- `<body class="subpage">`
- Lädt `css/style.css` + `css/team.css`
- `page-hero` mit Hintergrundbild + Overlay
- Content: `.subpage-content` (max-width 800px) oder spezielle Grids
- CTA-Sektion, Footer

## Wichtige CSS-Klassen
- `.page-hero` – 50vh, flex, zentrierter Content
- `.training-table` – Gestylte Tabelle mit striped rows
- `.contact-info-grid` – 2-spaltiges Grid für Kontaktkarten
- `.contact-card` – Karte mit Icon, Hover-Effekt
- `.map-container` – Google Maps iframe mit border-radius + shadow
- `.sponsors-grid` – Auto-fit Grid für Sponsorenlogos
- `.subpage-content` – Text-Content mit max-width

## Wichtige externe Ressourcen
- Bilder: `https://volleyball-neutraubling.de/wp-content/uploads/...`
- VAPI-API: `https://api.volleyball-bayern.de/jsi/volley.js.php?key=f66050e0-...`
- Google Maps: Embed-Iframes
- Sponsorenmappe: `https://volleyball-neutraubling.de/wp-content/uploads/2022/10/Sponsorenmappe-final-fast-.pdf`

## Konventionen für neue Seiten
1. Header + Footer 1:1 von bestehender Subpage kopieren
2. `active`-Klasse auf aktuellen Nav-Link setzen
3. `page-hero` mit passendem Hintergrundbild
4. Content in `.subpage-content` oder speziellem Container
5. CTA-Sektion vor Footer
6. `js/main.js` am Ende einbinden