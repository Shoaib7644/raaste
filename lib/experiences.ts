export type Experience = {
  slug: string
  title: string
  hindiTitle: string
  tagline: string
  microcopy: string
  stationMark: string
  playlistId: string
  backgroundImage: string
}

export const DHABA_PLAYLIST_ID = "PLMVzUKeXX5x4"
export const DADS_CASSETTE_SIDE_A_PLAYLIST_ID = "PLKu83gRDrWo0"
export const DADS_CASSETTE_SIDE_B_PLAYLIST_ID = "PLA8E_xfmVp9U"

export const dadsCassetteSides = [
  {
    id: "side-a",
    side: "SIDE A",
    label: "DAD'S FAVOURITES",
    playlistId: DADS_CASSETTE_SIDE_A_PLAYLIST_ID,
  },
  {
    id: "side-b",
    side: "SIDE B",
    label: "TAPE GETS INTERESTING",
    playlistId: DADS_CASSETTE_SIDE_B_PLAYLIST_ID,
  },
] as const

export const experiences: Experience[] = [
  {
    slug: "salon",
    title: "SALON 1998",
    hindiTitle: "बिल्लू बार्बर",
    tagline: "बाल कटेंगे, गाने नहीं।",
    microcopy: "अभी बज रहा है",
    stationMark: "हजामत / रेडियो",
    playlistId: "PLCg86JMapum0",
    backgroundImage: "/images/salon-1998-v3.webp",
  },
  {
    slug: "dhaba",
    title: "DHABA 12:47 AM",
    hindiTitle: "ढाबा",
    tagline: "पहले चाय, फिर बाय।",
    microcopy: "चाय के साथ बज रहा है",
    stationMark: "रात / चाय",
    playlistId: DHABA_PLAYLIST_ID,
    backgroundImage: "/images/dhaba-1247.webp",
  },
  {
    slug: "dads-cassette",
    title: "DAD'S CASSETTE",
    hindiTitle: "पापा की टेप",
    tagline: "कुछ गाने विरासत में मिलते हैं।",
    microcopy: "पापा की टेप बज रही है",
    stationMark: "घर / टेप",
    playlistId: DADS_CASSETTE_SIDE_A_PLAYLIST_ID,
    backgroundImage: "/images/dads-cassette.webp",
  },
  {
    slug: "bus",
    title: "BUS / WINDOW SEAT",
    hindiTitle: "खिड़की वाली सीट",
    tagline: "Don't get off yet.",
    microcopy: "अगला स्टॉप — यादें",
    stationMark: "टिकट / सीट",
    playlistId: "REPLACE_WITH_PLAYLIST_ID",
    backgroundImage: "/images/bus.webp",
  },
  {
    slug: "monsoon",
    title: "MONSOON DRIVE",
    hindiTitle: "बारिश का सफ़र",
    tagline: "Wipers. Rain. One more song.",
    microcopy: "बारिश में बज रहा है",
    stationMark: "बारिश / सड़क",
    playlistId: "REPLACE_WITH_PLAYLIST_ID",
    backgroundImage: "/images/monsoon.webp",
  },
  {
    slug: "truck",
    title: "TRUCK / NIGHT HIGHWAY",
    hindiTitle: "रात का सफ़र",
    tagline: "For the long road home.",
    microcopy: "सफ़र जारी है",
    stationMark: "हाईवे / रात",
    playlistId: "REPLACE_WITH_PLAYLIST_ID",
    backgroundImage: "/images/truck.webp",
  },
]
