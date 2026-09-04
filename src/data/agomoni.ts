export type DayId = "mahalaya" | "saptami" | "ashtami" | "navami" | "dashami"

export interface Song {
  id: string
  title: string
  artist: string
  credits: string
  url: string
  status: "READY" | "NEEDS REVIEW" | "DUPLICATE"
  coverImageId: string
}

export interface ThemeImage {
  id: string
  url: string
  usage: "Hero" | "Background" | "Secondary" | "Gallery" | "Music Artwork"
  needsReview: boolean
  fit?: "cover" | "contain"
}

export interface DayData {
  id: DayId
  seq: number
  bengali: string
  name: string
  theme: string
  atmosphere: string
  heroImageId: string
  secondaryImageId: string
  musicArtworkId: string
  heroUrl: string
  secondaryUrl: string
  artworkUrl: string
  slides: ThemeImage[]
  accent: string
  accentMuted: string
  bg: string
  overlayFrom: string
  overlayTo: string
  songs: Song[]
  imageCount: number
  songCount: number
}

// Approved local images from AGOMONI_Website_Assets.xlsx and the supplied asset pack.
export const imageUrls: Record<string, string> = {
  "mahalaya-02": "/assets/agomoni/agomoni-mahalaya-02-hero.jpg",
  "mahalaya-04": "/assets/agomoni/agomoni-mahalaya-04-section.jpg",
  "mahalaya-05": "/assets/agomoni/agomoni-mahalaya-05-gallery.jpg",
  "saptami-02": "/assets/agomoni/agomoni-saptami-02-hero.jpg",
  "saptami-03": "/assets/agomoni/agomoni-saptami-03-section.jpg",
  "saptami-05": "/assets/agomoni/agomoni-saptami-05-gallery.jpg",
  "ashtami-01": "/assets/agomoni/agomoni-ashtami-01-hero.jpg",
  "ashtami-02": "/assets/agomoni/agomoni-ashtami-02-section.jpg",
  "ashtami-04": "/assets/agomoni/agomoni-ashtami-04-gallery.jpg",
  "navami-05": "/assets/agomoni/agomoni-navami-05-hero.jpg",
  "navami-02": "/assets/agomoni/agomoni-navami-02-section.jpg",
  "navami-04": "/assets/agomoni/agomoni-navami-04-gallery.jpg",
  "dashami-05": "/assets/agomoni/agomoni-dashami-05-hero.jpg",
  "dashami-01": "/assets/agomoni/agomoni-dashami-01-section.jpg",
  "dashami-03": "/assets/agomoni/agomoni-dashami-03-gallery.jpg",
}

function themeImage(
  id: string,
  usage: ThemeImage["usage"],
  needsReview = false,
  fit: ThemeImage["fit"] = "cover",
): ThemeImage {
  return {
    id,
    usage,
    needsReview,
    fit,
    url: `/assets/agomoni-enhanced/agomoni-${id}-enhanced.png`,
  }
}

export const days: DayData[] = [
  {
    id: "mahalaya",
    seq: 1,
    bengali: "মহালয়া",
    name: "Mahalaya",
    theme: "The Awakening",
    atmosphere: "Dark / midnight / dawn",
    heroImageId: "mahalaya-02",
    secondaryImageId: "mahalaya-04",
    musicArtworkId: "mahalaya-05",
    heroUrl: imageUrls["mahalaya-02"],
    secondaryUrl: imageUrls["mahalaya-04"],
    artworkUrl: imageUrls["mahalaya-05"],
    slides: [
      themeImage("mahalaya-02", "Hero"),
      themeImage("mahalaya-01", "Background"),
      themeImage("mahalaya-04", "Secondary", true),
      themeImage("mahalaya-03", "Gallery", true, "contain"),
      themeImage("mahalaya-05", "Music Artwork", true),
    ],
    accent: "#C8A96E",
    accentMuted: "rgba(200,169,110,0.15)",
    bg: "#0A0B14",
    overlayFrom: "rgba(8,9,20,0.72)",
    overlayTo: "rgba(20,15,40,0.45)",
    imageCount: 5,
    songCount: 5,
    songs: [
      {
        id: "mahalaya-song-01",
        title: "Mahalaya — Original Chandi Path",
        artist: "Birendra Krishna Bhadra",
        credits: "Full Chandipath",
        url: "https://youtu.be/YQFNRoi7rEc?si=kvyQ8PhSDyFaBBEE",
        status: "READY",
        coverImageId: "mahalaya-05",
      },
      {
        id: "mahalaya-song-02",
        title: "Ya Chandi",
        artist: "Chorus",
        credits: "Pankaj Kumar Mullick; Bani Kumar",
        url: "https://youtu.be/8FytVk54-dw?si=VoUVzdTZwOQgKqiY",
        status: "READY",
        coverImageId: "mahalaya-05",
      },
      {
        id: "mahalaya-song-03",
        title: "Jago Durga Dashapraharanadharinee",
        artist: "Dwijen Mukherjee",
        credits: "MISSING",
        url: "https://youtu.be/IfSJy3_Lkuo?si=_C9Rs-vOLSfpD_ep",
        status: "READY",
        coverImageId: "mahalaya-05",
      },
      {
        id: "mahalaya-song-04",
        title: "Ogo Amar Agamani Alo",
        artist: "Sipra Bose",
        credits: "MISSING",
        url: "https://youtu.be/2RZZzJdzGPM?si=5do12NLeM6MRIR6z",
        status: "READY",
        coverImageId: "mahalaya-05",
      },
      {
        id: "mahalaya-song-05",
        title: "Aham Rudrebhirvasubhischara",
        artist: "Chorus",
        credits: "Mahishasura Mardini",
        url: "https://youtu.be/GJccKU4_5wg?si=HtmCLjPFnApFhSor",
        status: "READY",
        coverImageId: "mahalaya-05",
      },
    ],
  },
  {
    id: "saptami",
    seq: 2,
    bengali: "সপ্তমী",
    name: "Saptami",
    theme: "The Arrival",
    atmosphere: "Fresh / green / morning",
    heroImageId: "saptami-02",
    secondaryImageId: "saptami-03",
    musicArtworkId: "saptami-05",
    heroUrl: imageUrls["saptami-02"],
    secondaryUrl: imageUrls["saptami-03"],
    artworkUrl: imageUrls["saptami-05"],
    slides: [
      themeImage("saptami-02", "Hero"),
      themeImage("saptami-01", "Background"),
      themeImage("saptami-03", "Secondary"),
      themeImage("saptami-04", "Gallery", true),
      themeImage("saptami-05", "Music Artwork"),
    ],
    accent: "#6BAE7A",
    accentMuted: "rgba(107,174,122,0.15)",
    bg: "#0C1410",
    overlayFrom: "rgba(10,18,12,0.68)",
    overlayTo: "rgba(15,30,18,0.40)",
    imageCount: 5,
    songCount: 4,
    songs: [
      {
        id: "saptami-song-01",
        title: "Amar Saptamir Bikel",
        artist: "Kanchan + June",
        credits: "MISSING",
        url: "https://youtu.be/_aApO1jN8YA?si=RGEY89PEwCgDLIMu",
        status: "READY",
        coverImageId: "saptami-05",
      },
      {
        id: "saptami-song-02",
        title: "Elo Je Maa",
        artist: "Abhijeet; Shreya Ghoshal",
        credits: "Jeet Gannguli; SVF; Dev; Challenge 2",
        url: "https://youtu.be/2U416kTo0as?si=nRr4uy6gmyCOjdE3",
        status: "READY",
        coverImageId: "saptami-05",
      },
      {
        id: "saptami-song-03",
        title: "Dhak Baja Kashor Baja",
        artist: "Shreya Ghoshal",
        credits: "Jeet Gannguli",
        url: "https://www.youtube.com/watch?v=id5_3dKvEBg",
        status: "READY",
        coverImageId: "saptami-05",
      },
      {
        id: "saptami-song-04",
        title: "Ailo Uma Barite",
        artist: "Monami Ghosh",
        credits: "MISSING",
        url: "https://www.youtube.com/watch?v=4zyCkmAS1Oo",
        status: "READY",
        coverImageId: "saptami-05",
      },
    ],
  },
  {
    id: "ashtami",
    seq: 3,
    bengali: "অষ্টমী",
    name: "Ashtami",
    theme: "The Power of Shakti",
    atmosphere: "Deep red / gold / powerful",
    heroImageId: "ashtami-01",
    secondaryImageId: "ashtami-02",
    musicArtworkId: "ashtami-04",
    heroUrl: imageUrls["ashtami-01"],
    secondaryUrl: imageUrls["ashtami-02"],
    artworkUrl: imageUrls["ashtami-04"],
    slides: [
      themeImage("ashtami-01", "Hero"),
      themeImage("ashtami-03", "Background"),
      themeImage("ashtami-02", "Secondary"),
      themeImage("ashtami-05", "Gallery"),
      themeImage("ashtami-04", "Music Artwork", true),
    ],
    accent: "#C0392B",
    accentMuted: "rgba(192,57,43,0.18)",
    bg: "#120608",
    overlayFrom: "rgba(18,4,6,0.74)",
    overlayTo: "rgba(35,8,8,0.42)",
    imageCount: 5,
    songCount: 4,
    songs: [
      {
        id: "ashtami-song-01",
        title: "MISSING",
        artist: "MISSING",
        credits: "MISSING",
        url: "https://youtu.be/yD0dpeS1eak?si=oaEycVJr5T8nJ1lN",
        status: "NEEDS REVIEW",
        coverImageId: "ashtami-04",
      },
      {
        id: "ashtami-song-02",
        title: "Aye Re Chhute Aye",
        artist: "Antara Chowdhury",
        credits: "Salil Chowdhury; Children Song",
        url: "https://www.youtube.com/watch?v=zMm6J1QvmUE",
        status: "READY",
        coverImageId: "ashtami-04",
      },
      {
        id: "ashtami-song-03",
        title: "Dugga Elo",
        artist: "Monali Thakur",
        credits: "Guddu; Indranil Das",
        url: "https://www.youtube.com/watch?v=xlElO06nQy8",
        status: "READY",
        coverImageId: "ashtami-04",
      },
      {
        id: "ashtami-song-04",
        title: "Gori Radha Ne Kalo Kaan — Wrong Side Raju",
        artist: "Kirtidan Gadhvi",
        credits: "Pratik Gandhi; Kimberley Louisa McBeath",
        url: "https://youtu.be/ccqg6e2rfLU?si=LF8SidVzU0iR1Mbf",
        status: "NEEDS REVIEW",
        coverImageId: "ashtami-04",
      },
    ],
  },
  {
    id: "navami",
    seq: 4,
    bengali: "নবমী",
    name: "Navami",
    theme: "The Celebration",
    atmosphere: "Warm orange / fire / celebration",
    heroImageId: "navami-05",
    secondaryImageId: "navami-02",
    musicArtworkId: "navami-04",
    heroUrl: imageUrls["navami-05"],
    secondaryUrl: imageUrls["navami-02"],
    artworkUrl: imageUrls["navami-04"],
    slides: [
      themeImage("navami-05", "Hero"),
      themeImage("navami-02", "Secondary"),
      themeImage("navami-01", "Gallery"),
      themeImage("navami-03", "Gallery", true),
      themeImage("navami-04", "Music Artwork", true),
    ],
    accent: "#D4622A",
    accentMuted: "rgba(212,98,42,0.16)",
    bg: "#120A04",
    overlayFrom: "rgba(18,8,2,0.70)",
    overlayTo: "rgba(35,15,5,0.40)",
    imageCount: 5,
    songCount: 4,
    songs: [
      {
        id: "navami-song-01",
        title: "Dhaker Taley — Poran Jai Jolia Re",
        artist: "Abhijeet",
        credits: "Dev; Subhashree; Parinita; Sudipto; Jeet Gannguli; SVF",
        url: "https://youtu.be/hbXuXt7gkFY?si=3RFCkc2hSDYAN6xX",
        status: "READY",
        coverImageId: "navami-04",
      },
      {
        id: "navami-song-02",
        title: "Dhaker Taley — Poran Jai Jolia Re",
        artist: "Abhijeet",
        credits: "Dev; Subhashree; Parinita; Sudipto; Jeet Gannguli; SVF",
        url: "https://youtu.be/hbXuXt7gkFY?si=-IwjPhcrJ7HU2P7p",
        status: "DUPLICATE",
        coverImageId: "navami-04",
      },
      {
        id: "navami-song-03",
        title: "MISSING",
        artist: "MISSING",
        credits: "MISSING",
        url: "https://youtu.be/4z1_OJ9j1P0?si=t45DRVrPK2NadWjZ",
        status: "NEEDS REVIEW",
        coverImageId: "navami-04",
      },
      {
        id: "navami-song-04",
        title: "Aigiri Nandini — Hip Hop Version",
        artist: "Brodha V",
        credits: "Live in Bangalore",
        url: "https://youtu.be/v-icNVDbVLk?si=8XlMjykF3fxO_W5x",
        status: "READY",
        coverImageId: "navami-04",
      },
    ],
  },
  {
    id: "dashami",
    seq: 5,
    bengali: "দশমী",
    name: "Dashami",
    theme: "The Farewell",
    atmosphere: "Sunset / amber / emotional",
    heroImageId: "dashami-05",
    secondaryImageId: "dashami-01",
    musicArtworkId: "dashami-03",
    heroUrl: imageUrls["dashami-05"],
    secondaryUrl: imageUrls["dashami-01"],
    artworkUrl: imageUrls["dashami-03"],
    slides: [
      themeImage("dashami-05", "Hero"),
      themeImage("dashami-04", "Background", true),
      themeImage("dashami-01", "Secondary"),
      themeImage("dashami-02", "Gallery", true),
      themeImage("dashami-03", "Music Artwork"),
    ],
    accent: "#C4873A",
    accentMuted: "rgba(196,135,58,0.16)",
    bg: "#110C06",
    overlayFrom: "rgba(18,10,4,0.72)",
    overlayTo: "rgba(40,20,10,0.40)",
    imageCount: 5,
    songCount: 1,
    songs: [
      {
        id: "dashami-song-01",
        title: "Dekho Aloy Alo Akash",
        artist: "Arjit Singh",
        credits: "MISSING",
        url: "https://youtu.be/zO6tRt0bVnE?si=89EmaTZ9w183BYy9",
        status: "NEEDS REVIEW",
        coverImageId: "dashami-03",
      },
    ],
  },
]
