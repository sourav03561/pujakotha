Upload `AGOMONI_Durga_Puja_Website_Assets.xlsx` and the unzipped `AGOMONI_Website_Assets` folder to Figma, then use this prompt:

Create a complete, high-fidelity, responsive Figma website design for:

# AGOMONI  
## The Journey of Maa Durga  
### আগমনী

This must be a cinematic, interactive Durga Puja experience—not a conventional festival landing page.

Use the supplied Excel workbook and image folders as the only content and asset source:

- `AGOMONI_Durga_Puja_Website_Assets.xlsx`
- `AGOMONI_Website_Assets/originals`
- `AGOMONI_Website_Assets/thumbnails`
- `AGOMONI_Website_Assets/website`

The Excel workbook is the source of truth. Do not invent photographs, song information, captions, credits, locations, weather, visitor counts, rituals, dates, or editorial copy.

## 1. Read the workbook before designing

Use the workbook sheets as follows:

- `README`: structure, naming rules, and asset guidance
- `WEBSITE_DATA`: day order, themes, atmosphere, hero-image mapping, secondary images, and music artwork
- `IMAGES`: image IDs, file paths, recommended usage, dimensions, and quality status
- `SONGS`: exact song titles, artists, credits, URLs, artwork IDs, and review status
- `MAHALAYA`, `SAPTAMI`, `ASHTAMI`, `NAVAMI`, `DASHAMI`: day-specific content and asset references
- `REVIEW`: missing information and assets that must not be treated as final
- `SOURCE_ARCHIVE`: audit reference only

Preserve the supplied Image IDs and Song IDs in the Figma layer names or design annotations so developers can map the design back to the workbook.

## 2. Creative direction

The experience should feel like:

“An immersive digital journey through the five stages of Durga Puja.”

Use the attached Deluxe Salon reference only for its:

- full-screen photographic composition
- layered interface
- floating glass components
- controlled visual density
- music-player treatment
- small information pills
- playful asymmetry
- premium interaction style

Do not copy its branding, typography, content, cards, or exact layout.

The finished design should combine:

- Bengali cultural authenticity
- cinematic editorial photography
- sophisticated digital interaction
- atmospheric storytelling
- contemporary luxury
- warm emotional depth

Avoid making it look like a temple poster, event flyer, generic Puja landing page, or gold-heavy wedding website.

## 3. Core experience

Design the website as one continuous interactive world containing five distinct day states:

1. Mahalaya — The Awakening
2. Saptami — The Arrival
3. Ashtami — The Power of Shakti
4. Navami — The Celebration
5. Dashami — The Farewell

Each state must change:

- full-screen background
- atmosphere and accent colours
- active day navigation
- contextual image cards
- music selection
- day number
- progress indicator
- supporting interface content

The persistent navigation and music player should make the five states feel like chapters of one experience—not five unrelated web pages.

## 4. Approved hero-image mapping

Use these exact hero assets from the workbook:

- Mahalaya: `mahalaya-02`
- Saptami: `saptami-02`
- Ashtami: `ashtami-01`
- Navami: `navami-05`
- Dashami: `dashami-05`

Use the corresponding `*-hero.jpg` files from the website asset folder.

Apply only design-level treatment:

- restrained dark overlay
- subtle vignette
- gentle grain
- warm tonal grading
- foreground/background depth
- slow parallax suggestion

Do not distort, stretch, repaint, replace, or cover the cultural subject.

## 5. Day-specific visual atmospheres

### Mahalaya — The Awakening

- midnight black
- deep indigo
- muted bronze
- first light before dawn
- quiet, sacred, mysterious

### Saptami — The Arrival

- forest green
- natural morning light
- soft ivory
- fresh, hopeful, processional

### Ashtami — The Power of Shakti

- deep vermilion
- restrained gold
- dramatic shadows
- powerful, devotional, intense

### Navami — The Celebration

- burnt orange
- firelight
- warm amber
- rhythmic, crowded, energetic

### Dashami — The Farewell

- sunset amber
- dusty rose
- muted red
- smoke and soft light
- emotional, reflective, bittersweet

Create reusable colour tokens for each day while maintaining one consistent AGOMONI design system.

## 6. Desktop hero composition

Design the primary desktop experience at 1440 × 900.

The first viewport must contain all of the following without becoming chaotic:

- edge-to-edge hero photography
- floating glass navigation
- integrated Bengali and English title
- active-day information
- vertical five-day progress control
- contextual image cards
- compact factual indicators
- floating music player
- primary journey action

Do not place the hero photograph inside a card.

The photography must remain the dominant layer, with UI arranged around its focal subject.

## 7. Floating navigation

Create a compact, rounded glass navigation bar near the top.

Left:

আগমনী  
AGOMONI

Centre:

MAHALAYA  
SAPTAMI  
ASHTAMI  
NAVAMI  
DASHAMI

Right:

ABOUT  
THE JOURNEY  
SOUND toggle

Visual treatment:

- translucent charcoal or deep-brown surface
- background blur
- warm off-white text
- thin low-contrast border
- restrained gold active state
- soft shadow
- rounded corners

The navigation must feel lightweight and should not resemble a large corporate header.

## 8. Main title system

The Bengali title must be expressive but not enormous.

Use:

আগমনী

Below it:

THE JOURNEY OF MAA DURGA

Add the current chapter:

01 — MAHALAYA  
THE AWAKENING

The title should interact with the image composition instead of covering the entire photograph.

Use an elegant Bengali display typeface such as Noto Serif Bengali or another authentic Bengali serif. Pair it with a modern English sans serif such as Inter, Manrope, or a similar typeface.

## 9. Source-backed floating indicators

Do not invent live statistics.

Use compact indicators based only on the workbook:

- 05 PUJA CHAPTERS
- 25 VISUAL ASSETS
- 18 MUSIC LINKS
- DAY 01 / 05
- THE AWAKENING
- IMAGE: mahalaya-02

These can appear as small glass pills, corner labels, metadata blocks, or rotating interface indicators.

## 10. Vertical day control

Place a floating vertical day navigator on the right side:

01 — Mahalaya  
02 — Saptami  
03 — Ashtami  
04 — Navami  
05 — Dashami

The active day should be clearly highlighted through:

- brighter type
- accent-colour dot
- progress line
- subtle glow
- enlarged active marker

Selecting a day should update the complete visual state.

## 11. Music player

Design a premium floating music player near the bottom centre.

It must use the real data from the `SONGS` sheet:

- Song ID
- title
- artist
- credits
- day
- cover-image ID
- status

Include:

- artwork thumbnail
- song title
- artist or credit
- previous
- play/pause
- next
- progress line
- timestamp area
- volume
- playlist expansion control

Use the workbook’s day-specific music artwork:

- Mahalaya: `mahalaya-05`
- Saptami: `saptami-05`
- Ashtami: `ashtami-04`
- Navami: `navami-04`
- Dashami: `dashami-03`

Some artwork sources are marked `NEEDS REVIEW`. Use them as temporary supplied assets and visibly annotate them in the Figma file as awaiting replacement. Do not invent cleaner replacements.

Do not treat `navami-song-02` as a separate track because it is marked as a duplicate.

Rows marked `NEEDS REVIEW` may appear in the design as disabled or pending items, but they must not be presented as verified final content.

## 12. Floating image cards

Use the secondary, gallery, background, and music-artwork mappings from the `IMAGES` sheet.

Create a controlled arrangement of two or three floating image cards around the hero.

Possible treatments:

- partially overlapping photograph cards
- small gallery-preview stack
- active-day visual strip
- expandable image panel
- floating film-frame thumbnail

Do not use more than three secondary images simultaneously in the first viewport.

Use the original or website-ready versions for large cards. Use 160 × 90 thumbnails only for small previews.

## 13. Interaction model

Prototype the following interactions:

- switch between all five days
- click a navigation day
- use previous/next chapter controls
- change the music track
- expand and collapse the player
- open a secondary photograph
- close the photograph overlay
- move through gallery images
- toggle sound
- switch from desktop navigation to mobile navigation

Suggested transitions:

- background crossfade: 600–900 ms
- typography fade and vertical shift
- floating cards reposition gently
- active progress marker glides to the next day
- colour atmosphere changes gradually
- player artwork crossfades
- subtle depth movement on hover

Motion should feel cinematic and restrained. Avoid excessive bouncing, spinning, or flashy effects.

Include a reduced-motion design state.

## 14. Supporting scroll experience

Below the immersive hero, continue the journey through five cinematic chapters.

Each chapter should include:

- full-width day photograph
- day number
- day name
- supplied theme
- secondary-image composition
- song reference
- a restrained editorial-content placeholder when copy is missing

When the workbook contains no approved text, use an explicit design annotation such as:

“Editorial copy required — see REVIEW sheet”

Do not generate fictional cultural explanations.

The scroll experience should feel like a visual story rather than:

Navbar → Hero → Three Cards → Footer

## 15. Mobile design

Create a high-fidelity mobile version at 390 × 844.

Do not simply stack the desktop interface.

On mobile:

- keep the photograph full screen
- use a compact AGOMONI header
- make day navigation swipeable
- retain a visible chapter indicator
- keep the music player docked near the bottom
- show only one contextual image card at a time
- collapse secondary controls into a glass action button
- preserve image focal points
- keep Bengali typography readable
- maintain sufficient contrast over photography

Create prototype interactions for horizontal day swiping and music-player expansion.

## 16. Component system

Create reusable Figma components and variants for:

- global navigation
- day-navigation item
- five day states
- information pill
- image card
- gallery thumbnail
- music player collapsed
- music player expanded
- play/pause states
- track row
- primary button
- secondary icon button
- sound toggle
- progress indicator
- review/pending badge
- desktop and mobile navigation

Use Auto Layout, variables, consistent naming, reusable spacing tokens, text styles, colour styles, and component properties.

## 17. Figma file structure

Organize the file into these pages:

1. `00 — Cover`
2. `01 — Foundations`
3. `02 — Components`
4. `03 — Desktop Experience`
5. `04 — Mobile Experience`
6. `05 — Prototype Flow`
7. `06 — Content & Asset Mapping`
8. `07 — Review Notes`

On the Content & Asset Mapping page, show:

- Day
- Image ID
- Song ID
- Recommended usage
- Figma frame or component using the asset
- Workbook status
- Replacement requirement

## 18. Accessibility and usability

Ensure:

- readable text contrast over every photograph
- visible keyboard-focus states
- touch targets of at least 44 × 44 px
- music controls with clear labels
- important controls do not rely only on colour
- Bengali and English type remain legible
- reduced-motion support
- no critical text is placed over a visually busy focal subject
- mobile controls remain reachable with one hand

## 19. Important restrictions

Do not:

- use generic stock Durga Puja photographs
- invent cultural facts or rituals
- invent song titles, artists, or credits
- invent visitor numbers, weather, locations, or dates
- replace supplied assets without marking the replacement
- publish assets marked with licensing concerns as final
- stretch portrait photographs into landscape
- make the Bengali title occupy half the screen
- cover the photography with oversized opaque cards
- overuse gold
- create a generic festival template
- copy the Deluxe Salon design literally
- ignore the workbook’s `REVIEW` sheet

## Final design objective

The final result should feel like:

“A premium interactive digital world built around the emotional journey of Maa Durga—from awakening to farewell.”

It should be visually rich from the first second through:

Photography + Bengali identity + layered glass UI + music + five-day navigation + floating visual cards + cinematic motion.

The photography should remain the hero, the interface should remain usable, and every piece of factual content must remain traceable to the supplied Excel workbook.