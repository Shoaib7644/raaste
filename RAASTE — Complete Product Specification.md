# RAASTE
### Indian Road Radio

**Tagline:**  
*Indian roads have a soundtrack.*

---

# 1. Product Vision

RAASTE is a minimal, atmospheric Internet radio experience built around Indian road nostalgia.

It is **not** Spotify.

It is **not** a playlist directory.

It is **not** a social network.

It is a collection of tiny digital places that feel like memories:

- a 90s Indian salon
- a highway dhaba at midnight
- a bus window during monsoon
- an old cassette player
- a truck on a night highway
- a railway journey
- a Sunday afternoon at home

The user does not come to RAASTE to browse hundreds of songs.

They come to **enter a mood**.

The initial MVP is:

# RAASTE / SALON 1998

with future environments:

```text
/salon
/dhaba
/bus
/monsoon
/cassette
/truck
/train
```

---

# 2. Core Product Principle

## The interface should disappear.

The user should immediately see:

```text
                  SALON 1998

             [ atmospheric image ]

                  ▶ PLAY

          "Your barber is waiting."

                  • • •
```

Then music.

Nothing else should compete with the environment.

---

# 3. MVP

## MVP experience

The homepage opens directly into:

### RAASTE
### SALON 1998

Visual:

A nostalgic Indian barber shop/saloon.

Think:

- old wall mirror
- wooden counter
- steel/wooden barber chair
- old posters
- combs
- shaving brush
- talcum powder
- faded paint
- fluorescent/tube lighting
- slightly dusty atmosphere
- perhaps an old radio/cassette player

Avoid:

- modern luxury salon
- neon cyberpunk
- excessive props
- generic stock-photo aesthetic
- overly cinematic AI imagery

The feeling should be:

> "I remember this place."

---

# 4. Homepage hierarchy

Only five meaningful elements:

1. RAASTE wordmark
2. Current place/mode
3. Atmospheric background
4. Tiny music player
5. Tiny mode switcher

Everything else is secondary.

---

# 5. Homepage copy

Primary:

> **RAASTE**

Secondary:

> **SALON 1998**

Atmospheric line:

> *Your barber is waiting.*

Alternative lines worth testing:

> *Waiting for your haircut since 1998.*

> *One haircut. Three songs. No hurry.*

> *The radio is already playing.*

> *Sit down. Your turn is coming.*

The best MVP choice:

# "Waiting for your haircut since 1998."

---

# 6. Mode navigation

Do NOT use a large navigation bar.

Use a tiny selector.

Example:

```text
SALON 1998  ˅
```

Clicking it reveals:

```text
RAASTE

SALON 1998
DHABA / 1:17 AM
BUS / WINDOW SEAT
MONSOON DRIVE
DAD'S CASSETTE
TRUCK / NIGHT HIGHWAY
```

This should feel more like selecting a radio station than navigating a website.

---

# 7. Important UX decision

The dropdown should NOT be visible as a conventional SaaS dropdown.

No:

```text
[ Select experience ▼ ]
```

Instead:

```text
SALON 1998   +
```

or:

```text
SALON 1998  ⌄
```

It should look almost like a label printed onto the scene.

---

# 8. Music interaction

Initial state:

```text
SALON 1998

Waiting for your haircut since 1998.

                ▶

```

After clicking:

```text
SALON 1998

Waiting for your haircut since 1998.

              ━━━━━
              ●

        Kumar Sanu
        [song title]

        ◀   ❚❚   ▶
```

Keep the controls extremely small.

---

# 9. Music source

Use curated YouTube playlists.

Example configuration:

```javascript
const experiences = {
  salon: {
    title: "SALON 1998",
    playlistId: "YOUR_YOUTUBE_PLAYLIST_ID",
    tagline: "Waiting for your haircut since 1998.",
    background: "/images/salon-1998.webp"
  },

  dhaba: {
    title: "DHABA / 1:17 AM",
    playlistId: "YOUR_YOUTUBE_PLAYLIST_ID",
    tagline: "Chai first. Highway later.",
    background: "/images/dhaba-night.webp"
  },

  bus: {
    title: "BUS / WINDOW SEAT",
    playlistId: "YOUR_YOUTUBE_PLAYLIST_ID",
    tagline: "Don't get off yet.",
    background: "/images/bus-window.webp"
  },

  monsoon: {
    title: "MONSOON DRIVE",
    playlistId: "YOUR_YOUTUBE_PLAYLIST_ID",
    tagline: "Wipers. Rain. One more song.",
    background: "/images/monsoon.webp"
  },

  cassette: {
    title: "DAD'S CASSETTE",
    playlistId: "YOUR_YOUTUBE_PLAYLIST_ID",
    tagline: "Side A.",
    background: "/images/cassette.webp"
  },

  truck: {
    title: "TRUCK / NIGHT HIGHWAY",
    playlistId: "YOUR_YOUTUBE_PLAYLIST_ID",
    tagline: "For the long road home.",
    background: "/images/truck-night.webp"
  }
}
```

No database.

No API backend.

No CMS.

---

# 10. YouTube architecture

Use the official YouTube IFrame Player API.

YouTube supports loading playlists using:

```text
listType=playlist
list=PLAYLIST_ID
```

and the IFrame API allows JavaScript control over playback, pause, volume, current video, state changes and playlist behaviour.

Architecture:

```text
React application
       │
       ▼
Experience configuration
       │
       ├── Salon playlist
       ├── Dhaba playlist
       ├── Bus playlist
       ├── Monsoon playlist
       └── Cassette playlist
       │
       ▼
YouTube IFrame Player API
       │
       ▼
YouTube playlist
```

The application owns the experience.

YouTube supplies the music.

---

# 11. Important YouTube constraint

Do NOT attempt to:

- make the YouTube player invisible
- place an overlay over it
- put another custom UI over the player to hide it
- move it offscreen
- crop it in a way intended to obscure YouTube's player

YouTube's current documentation requires embedded players to have a minimum 200×200px viewport and prohibits overlays/frames that obscure the embedded player or its controls.

Therefore:

## Recommended MVP

Give the player a deliberate **small 200×200px footprint**.

Make it part of the composition.

For example:

```text
                         RAASTE

                     SALON 1998


              [ atmospheric image ]


                    ┌────────┐
                    │        │
                    │ YouTube│
                    │ player │
                    │        │
                    └────────┘

                  NOW PLAYING
                    • • •
```

Do not pretend YouTube isn't there.

Instead, make the player feel like an **old radio/cassette object within the scene**.

This also gives us a graceful fallback if YouTube changes its embed behaviour.

---

# 12. Player visual direction

The player should look like an old physical object:

### Salon

A tiny old radio sitting on the barber counter.

### Dhaba

A little transistor radio.

### Bus

A cheap cassette player near the driver's dashboard.

### Cassette

An actual cassette deck.

### Truck

A tiny dashboard radio.

The surrounding page can be atmospheric, while the actual YouTube player remains compliant and visible.

---

# 13. Landing page composition

Desktop:

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  RAASTE                                      ABOUT      │
│                                                         │
│                                                         │
│                                                         │
│                 SALON 1998                              │
│                                                         │
│          Waiting for your haircut                       │
│                 since 1998.                             │
│                                                         │
│                                                         │
│                    [IMAGE]                              │
│                                                         │
│                 ┌──────────┐                            │
│                 │  PLAYER  │                            │
│                 │          │                            │
│                 └──────────┘                            │
│                                                         │
│                    SALON 1998  ˅                        │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────┐
│ RAASTE               │
│                      │
│                      │
│     SALON 1998       │
│                      │
│ Waiting for your     │
│ haircut since 1998.  │
│                      │
│                      │
│      [ IMAGE ]       │
│                      │
│    ┌────────────┐    │
│    │   PLAYER   │    │
│    └────────────┘    │
│                      │
│    SALON 1998  ˅     │
│                      │
└──────────────────────┘
```

---

# 14. Visual design system

## Overall aesthetic

Keywords:

```text
Indian nostalgia
quiet
warm
analog
slightly imperfect
cinematic
faded
personal
roadside
1990s
human
```

Avoid:

```text
SaaS
glassmorphism
neon gradients
3D cards
Spotify clone
generic AI aesthetic
excessive animations
```

---

# 15. Colour system

Do not use a giant modern colour palette.

Use colours sampled from the scene.

Base:

```text
Faded cream
Dusty brown
Tobacco
Muted red
Old green
Sun-faded yellow
Charcoal
Off-white
```

For Salon:

```text
#D8C7A3  faded cream
#5A4635  dark wood
#8C3F32  faded red
#6B7250  dusty green
#191715  charcoal
#F0E6D0  paper
```

Do not make every element colourful.

The background does most of the work.

---

# 16. Typography

Primary display:

Use a distinctive editorial/Indian-retro display font.

Secondary:

A clean sans-serif.

Metadata:

Monospace.

Suggested combination:

```text
Display:
Bodoni / Cormorant / Fraunces-like serif

UI:
Inter / Geist / system sans

Metadata:
IBM Plex Mono / JetBrains Mono
```

Do not use more than three fonts.

---

# 17. Image treatment

The background should not look like an obvious AI-generated image.

Use:

- film grain
- slight blur
- faded blacks
- warm highlights
- subtle vignette
- 4:3 or cinematic crop
- slight dust
- imperfect exposure

Think:

> photograph discovered inside an old family album.

Not:

> luxury advertising campaign.

---

# 18. Animation

Animation should be almost imperceptible.

Use:

### Background

Very slow 20–30 second scale/position drift.

### Film grain

Subtle looping texture.

### Player

Tiny pulse while music plays.

### Mode change

Slow crossfade.

### Page load

Image fades in.

No:

- bouncing
- flying cards
- parallax overload
- particles
- flashy transitions

---

# 19. Sound design

MVP should initially contain only music.

Do not add environmental audio automatically.

Later:

Salon:

- scissors
- ceiling fan
- distant street

Dhaba:

- cups
- kettle
- distant truck horn

Bus:

- engine
- road noise

Monsoon:

- rain
- windshield wipers

But these should be optional and extremely subtle.

---

# 20. Mode system

The core abstraction is:

```typescript
type Experience = {
  slug: string
  title: string
  tagline: string
  playlistId: string
  backgroundImage: string
  accent: string
}
```

This makes adding a new RAASTE world trivial.

To add:

```text
/train
```

you should only need to add one object.

No backend changes.

---

# 21. Initial modes

## 01 — SALON 1998

Visual:

Old neighbourhood barber shop.

Music:

90s Hindi romantic / nostalgic songs.

Tagline:

> Waiting for your haircut since 1998.

---

## 02 — DHABA / 1:17 AM

Visual:

Indian highway dhaba.

Music:

Old Hindi songs + road favourites.

Tagline:

> Chai first. Highway later.

---

## 03 — BUS / WINDOW SEAT

Visual:

Rainy bus window.

Music:

90s romantic songs.

Tagline:

> Don't get off yet.

---

## 04 — MONSOON DRIVE

Visual:

Rain-covered windshield.

Music:

90s romantic / melancholy.

Tagline:

> Wipers. Rain. One more song.

---

## 05 — DAD'S CASSETTE

Visual:

Old cassette deck.

Music:

Kishore / Rafi / Mukesh / Lata / old Bollywood.

Tagline:

> Side A.

---

## 06 — TRUCK / NIGHT HIGHWAY

Visual:

Decorated truck at night.

Music:

Indian truck-driver / highway playlist.

Tagline:

> For the long road home.

---

# 22. The selector

When opened:

```text
RAASTE

01  SALON 1998
02  DHABA / 1:17 AM
03  BUS / WINDOW SEAT
04  MONSOON DRIVE
05  DAD'S CASSETTE
06  TRUCK / NIGHT HIGHWAY
```

No thumbnails.

No cards.

Just typography.

---

# 23. URL architecture

Use URL routes from day one:

```text
raaste.in/
raaste.in/salon
raaste.in/dhaba
raaste.in/bus
raaste.in/monsoon
raaste.in/cassette
raaste.in/truck
```

This gives each experience a shareable URL.

---

# 24. Social sharing

Every mode should have a unique title and metadata.

Example:

```text
RAASTE — SALON 1998
Waiting for your haircut since 1998.
```

Open Graph image:

A cinematic still from the environment.

Later:

```text
RAASTE — DHABA / 1:17 AM
Chai first. Highway later.
```

This makes every mode independently shareable.

---

# 25. SEO

Each experience should have:

```html
<title>
RAASTE — Salon 1998 | Indian Road Radio
</title>

<meta
  name="description"
  content="A little corner of the Internet for 90s Indian salon nostalgia, old songs and memories."
/>
```

Do not keyword-stuff.

The brand is the experience.

---

# 26. Performance

Target:

- extremely fast initial HTML
- optimized WebP/AVIF images
- lazy-load secondary experiences
- no heavy animation library
- no unnecessary dependencies
- no backend
- no database
- no analytics initially
- system font fallback
- responsive from 320px upward

The first screen should feel instantaneous.

---

# 27. Technical stack

Recommended:

```text
Next.js
TypeScript
Tailwind CSS
YouTube IFrame Player API
CSS animations
Static assets
Vercel
```

Optional:

```text
lucide-react
```

Only if genuinely necessary.

Do not install a huge component library.

---

# 28. Project structure

```text
app/
  page.tsx
  salon/
    page.tsx
  dhaba/
    page.tsx
  bus/
    page.tsx
  monsoon/
    page.tsx
  cassette/
    page.tsx
  truck/
    page.tsx

components/
  RaasteExperience.tsx
  ExperienceSelector.tsx
  MusicPlayer.tsx
  Atmosphere.tsx
  Logo.tsx

lib/
  experiences.ts
  youtube.ts

public/
  images/
    salon.webp
    dhaba.webp
    bus.webp
    monsoon.webp
    cassette.webp
    truck.webp

  textures/
    grain.png
```

---

# 29. State

Only client-side state.

```text
currentExperience
isPlaying
currentSong
playerReady
volume
```

Persist only one thing optionally:

```text
lastExperience
```

using localStorage.

No database.

---

# 30. First-load behaviour

Page opens.

Background loads.

Text appears.

YouTube player initializes.

No autoplay.

Show:

> **▶ PLAY RADIO**

Reason: browsers can restrict autoplay, and YouTube's API explicitly documents autoplay restrictions/events.

When user clicks:

```text
play()
```

Then update UI:

```text
NOW PLAYING
Artist
Song
```

---

# 31. Mode switching

When user selects another experience:

1. Fade background.
2. Update title.
3. Update tagline.
4. Load new YouTube playlist.
5. Do not automatically play unless the user explicitly requested play.
6. Preserve the player's position/interaction where practical.
7. Update URL.
8. Update document metadata.

---

# 32. What NOT to build

Absolutely no:

```text
authentication
database
CMS
admin dashboard
user profiles
comments
likes
followers
recommendation engine
AI recommendations
search
payments
subscriptions
social feed
```

MVP is deliberately static.

---

# 33. Success metric

Don't optimize for:

> minutes spent browsing.

Optimize for:

### "Did the user press play?"

Then:

### "Did they switch to another RAASTE?"

Then:

### "Did they share it?"

The ideal session:

```text
Open
↓
See Salon
↓
Press Play
↓
Listen
↓
Switch to Dhaba
↓
Send link to friend
```

---

# 34. Product north star

## RAASTE should feel like a memory you found on the Internet.

Not a website you visited.

That distinction should guide every design decision.

---

# 35. Future roadmap

### Phase 1

Salon 1998.

### Phase 2

Dhaba.

Bus.

Monsoon.

Cassette.

Truck.

### Phase 3

Road-specific experiences:

```text
Delhi → Jaipur
Mumbai → Pune
Hyderabad → Vijayawada
Chennai → Bangalore
Delhi → Chandigarh
```

### Phase 4

Community memories:

```text
"What song reminds you of a bus journey?"

"What song did your father play?"

"Which song played at your first road trip?"
```

### Phase 5

Indian road archive:

```text
Truck art
Roadside quotes
Dhabas
Routes
Stories
Music
Memories
```

---

# 36. Brand principle

RAASTE should never become a giant content platform.

The magic is:

> **small experiences with enormous emotional density.**

A person should be able to open it in 5 seconds and understand it.

That is the product.