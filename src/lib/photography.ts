export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  location?: string;
  date?: string;
  camera?: string;
}

export interface PhotoCategory {
  slug: string;
  name: string;
  country: string;
  description: string;
  coverImage: string;
  photos: Photo[];
}

export const photoCategories: PhotoCategory[] = [
  {
    slug: "new-york-city",
    name: "New York City",
    country: "United States",
    description: "Capturing the energy, architecture, and everyday moments in the city that never sleeps.",
    coverImage: "/images/photography/new-york-city/manhattan-bridge-1.jpg",
    photos: [
      {
        id: "ny-1",
        src: "/images/photography/new-york-city/manhattan-bridge-1.jpg",
        alt: "View from Manhattan Bridge with boken",
        width: 1638,
        height: 2048,
        location: "Manhattan Bridge",
      },
      {
        id: "ny-2",
        src: "/images/photography/new-york-city/city-1.jpg",
        alt: "View of New York City at Night",
        width: 1638,
        height: 2048,
        location: "Rooftop Observatory",
      },
      {
        id: "ny-3",
        src: "/images/photography/new-york-city/time-square-1.jpg",
        alt: "Time square",
        width: 1638,
        height: 2048,
        location: "Time Square",
      },
      {
        id: "ny-4",
        src: "/images/photography/new-york-city/grand-central-station-1.jpg",
        alt: "Grand Central Station",
        width: 1638,
        height: 2048,
        location: "Grand Central Station",
      },
      {
        id: "ny-5",
        src: "/images/photography/new-york-city/subway-1.jpg",
        alt: "Subway Station",
        width: 1638,
        height: 2048,
        location: "Manhattan",
      },
      {
        id: "ny-6",
        src: "/images/photography/new-york-city/manhattan-bridge-2.jpg",
        alt: "View from Manhattan Bridge with boken",
        width: 1638,
        height: 2048,
        location: "Manhattan Bridge",
      },
      {
        id: "ny-7",
        src: "/images/photography/new-york-city/top-of-the-rock-1.jpg",
        alt: "View from Top of the Rock",
        width: 1638,
        height: 2048,
        location: "Manhattan",
      },
      {
        id: "ny-8",
        src: "/images/photography/new-york-city/subway-2.jpg",
        alt: "Subway Station",
        width: 1638,
        height: 2048,
        location: "Manhattan",
      },
      {
        id: "ny-9",
        src: "/images/photography/new-york-city/manhattan-bridge-3.jpg",
        alt: "View from Manhattan Bridge",
        width: 1638,
        height: 2048,
        location: "Manhattan Bridge",
      },
      {
        id: "ny-10",
        src: "/images/photography/new-york-city/grand-central-station-2.jpg",
        alt: "Grand Central Station",
        width: 1638,
        height: 2048,
        location: "Grand Central Station",
      },
      {
        id: "ny-11",
        src: "/images/photography/new-york-city/central-park-1.jpg",
        alt: "Central Park",
        width: 1638,
        height: 2048,
        location: "Central Park",
      },
      {
        id: "ny-12",
        src: "/images/photography/new-york-city/east-river-1.jpg",
        alt: "View of the East River in Manhattan",
        width: 1638,
        height: 2048,
        location: "East River",
      },
      {
        id: "ny-13",
        src: "/images/photography/new-york-city/subway-3.jpg",
        alt: "Subway Station",
        width: 1638,
        height: 2048,
        location: "Manhattan",
      },
      {
        id: "ny-14",
        src: "/images/photography/new-york-city/city-2.jpg",
        alt: "View of the Street from Tudor City Bridge",
        width: 1638,
        height: 2048,
        location: "Tudor City",
      },
      {
        id: "ny-15",
        src: "/images/photography/new-york-city/city-3.jpg",
        alt: "View from a Rooftop Observatory in New York City",
        width: 1638,
        height: 2048,
        location: "Manhattan",
      },
      {
        id: "ny-16",
        src: "/images/photography/new-york-city/city-4.jpg",
        alt: "Staple Street Sky Bridge",
        width: 1638,
        height: 2048,
        location: "Staple Street Sky Bridge",
      },
      {
        id: "ny-17",
        src: "/images/photography/new-york-city/top-of-the-rock-2.jpg",
        alt: "View from Top of the Rock",
        width: 1638,
        height: 2048,
        location: "Manhattan",
      },
    ],
  },
  {
    slug: "jordan",
    name: "Jordan",
    country: "Jordan",
    description: "Rose-red cliffs carved into ancient cities, endless desert horizons, and the quiet warmth of Bedouin life.",
    coverImage: "/images/photography/jordan/petra-1.jpg",
    photos: [
      {
        id: "jdn-1",
        src: "/images/photography/jordan/wadi-rum-7.jpg",
        alt: "Wadi Rum",
        width: 1638,
        height: 2048,
        location: "Wadi Rum",
      },
      {
        id: "jdn-2",
        src: "/images/photography/jordan/wadi-rum-1.jpg",
        alt: "Wadi Rum",
        width: 1638,
        height: 2048,
        location: "Wadi Rum",
      },
      {
        id: "jdn-3",
        src: "/images/photography/jordan/petra-1.jpg",
        alt: "Petra",
        width: 1638,
        height: 2048,
        location: "Petra",
      },
      {
        id: "jdn-4",
        src: "/images/photography/jordan/dead-sea-1.jpg",
        alt: "Dead Sea",
        width: 1638,
        height: 2048,
        location: "Dead Sea",
      },
      {
        id: "jdn-5",
        src: "/images/photography/jordan/amman-1.jpg",
        alt: "Amman",
        width: 1638,
        height: 2048,
        location: "Amman",
      },
      {
        id: "jdn-6",
        src: "/images/photography/jordan/wadi-rum-2.jpg",
        alt: "Wadi Rum",
        width: 1638,
        height: 2048,
        location: "Wadi Rum",
      },
      {
        id: "jdn-7",
        src: "/images/photography/jordan/petra-2.jpg",
        alt: "Petra",
        width: 1638,
        height: 2048,
        location: "Petra",
      },
      {
        id: "jdn-8",
        src: "/images/photography/jordan/wadi-rum-5.jpg",
        alt: "Wadi Rum",
        width: 1638,
        height: 2048,
        location: "Wadi Rum",
      },
      {
        id: "jdn-9",
        src: "/images/photography/jordan/dead-sea-3.jpg",
        alt: "Dead Sea",
        width: 1638,
        height: 2048,
        location: "Dead Sea",
      },
      {
        id: "jdn-10",
        src: "/images/photography/jordan/ancient-city-1.jpg",
        alt: "Jerash",
        width: 1638,
        height: 2048,
        location: "Jerash",
      },
      {
        id: "jdn-11",
        src: "/images/photography/jordan/wadi-rum-3.jpg",
        alt: "Wadi Rum",
        width: 1638,
        height: 2048,
        location: "Wadi Rum",
      },
      {
        id: "jdn-12",
        src: "/images/photography/jordan/petra-3.jpg",
        alt: "Petra",
        width: 1638,
        height: 2048,
        location: "Petra",
      },
      {
        id: "jdn-13",
        src: "/images/photography/jordan/dead-sea-2.jpg",
        alt: "Dead Sea",
        width: 1638,
        height: 2048,
        location: "Dead Sea",
      },
      {
        id: "jdn-14",
        src: "/images/photography/jordan/wadi-rum-4.jpg",
        alt: "Wadi Rum",
        width: 1638,
        height: 2048,
        location: "Wadi Rum",
      },
      {
        id: "jdn-15",
        src: "/images/photography/jordan/petra-4.jpg",
        alt: "Petra",
        width: 1638,
        height: 2048,
        location: "Petra",
      },
      {
        id: "jdn-16",
        src: "/images/photography/jordan/dead-sea-3.jpg",
        alt: "Dead Sea",
        width: 1638,
        height: 2048,
        location: "Dead Sea",
      },
      {
        id: "jdn-17",
        src: "/images/photography/jordan/wadi-rum-6.jpg",
        alt: "Wadi Rum",
        width: 1638,
        height: 2048,
        location: "Wadi Rum",
      },
    ],
  },
  {
    slug: "colombia",
    name: "Colombia",
    country: "Colombia",
    description:
      "Towering wax palms in misty valleys, vibrant cities pulsing with music and art, and lush landscapes stretching from Caribbean coasts to Andean peaks.",
    coverImage: "/images/photography/colombia/cocora-1.jpg",
    photos: [
      {
        id: "cl-1",
        src: "/images/photography/colombia/cocora-1.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
      {
        id: "cl-2",
        src: "/images/photography/colombia/cocora-2.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
      {
        id: "cl-3",
        src: "/images/photography/colombia/cocora-3.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
      {
        id: "cl-4",
        src: "/images/photography/colombia/cocora-4.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
      {
        id: "cl-5",
        src: "/images/photography/colombia/cocora-5.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
      {
        id: "cl-6",
        src: "/images/photography/colombia/cocora-6.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
      {
        id: "cl-7",
        src: "/images/photography/colombia/cocora-7.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
      {
        id: "cl-8",
        src: "/images/photography/colombia/cocora-8.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
      {
        id: "cl-9",
        src: "/images/photography/colombia/cocora-9.jpg",
        alt: "Cocora Palm Trees in the Clouds",
        width: 1638,
        height: 2048,
        location: "Cocora Valley",
      },
    ],
  },
  {
    slug: "guatemala",
    name: "Guatemala",
    country: "Guatemala",
    description:
      "Smoldering volcanoes rising above colonial streets and the quiet rhythm of life along the Pacific coast.",
    coverImage: "/images/photography/guatemala/volcan-de-fuego-1.jpg",
    photos: [
      {
        id: "gt-1",
        src: "/images/photography/guatemala/volcan-de-fuego-1.jpg",
        alt: "A lone figure silhouetted on the ridge of Acatenango as Volcán de Fuego erupts",
        width: 1638,
        height: 2048,
        location: "Volcán de Acatenango",
      },
      {
        id: "gt-2",
        src: "/images/photography/guatemala/beach-1.jpg",
        alt: "Two silhouettes standing in the surf at sunset on the Pacific coast",
        width: 1638,
        height: 2048,
        location: "Pacific Coast",
      },
    ],
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    country: "Argentina & Chile",
    description: "Immense glaciers, dramatic peaks, and wide-open landscapes that feel untouched and impossibly vast.",
    coverImage: "/images/photography/patagonia/glacier-1.jpg",
    photos: [
      {
        id: "pg-1",
        src: "/images/photography/patagonia/glacier-1.jpg",
        alt: "Perito Moreno Glacier",
        width: 1638,
        height: 2048,
        location: "Perito Moreno Glacier",
      },
      {
        id: "pg-2",
        src: "/images/photography/patagonia/river-1.jpg",
        alt: "A River Rushing Through Torred del Paine in Chile",
        width: 1638,
        height: 2048,
        location: "Torres del Paine",
      },
      {
        id: "pg-3",
        src: "/images/photography/patagonia/penguin-1.jpg",
        alt: "Penguins in Martillo Island, Ushuaia, Argentina",
        width: 1638,
        height: 2048,
        location: "Ushuaia",
      },
      {
        id: "pg-4",
        src: "/images/photography/patagonia/huemul-1.jpg",
        alt: "Hikers Walking in the Huemul Circuit to a Glacier",
        width: 1638,
        height: 2048,
        location: "Huemul Circuit",
      },
      {
        id: "pg-5",
        src: "/images/photography/patagonia/penguin-2.jpg",
        alt: "Penguins in Martillo Island, Ushuaia, Argentina",
        width: 1638,
        height: 2048,
        location: "Ushuaia",
      },
    ],
  },
];

export function getAllCategories(): PhotoCategory[] {
  return photoCategories;
}

export function getCategoryBySlug(slug: string): PhotoCategory | undefined {
  return photoCategories.find((category) => category.slug === slug);
}

export function getAllPhotos(): Photo[] {
  return photoCategories.flatMap((category) => category.photos);
}

// Fisher-Yates shuffle
export function getShuffledPhotos(): Photo[] {
  const allPhotos = getAllPhotos();
  for (let i = allPhotos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPhotos[i], allPhotos[j]] = [allPhotos[j], allPhotos[i]];
  }
  return allPhotos;
}
