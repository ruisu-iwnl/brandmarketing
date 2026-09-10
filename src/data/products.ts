import { Product } from "@/components/ProductCard";

export const productsData: Product[] = [
  {
    id: "aquamarine-silk",
    name: "Aquamarine Silk",
    price: 120,
    description: "Handwoven Blue stones.",
    category: "bracelet",
    ordersCount: 120,
    imageStill: "/images/products/stills/aquamarine-nobg.webp",
    imageWorn: "/images/products/worn/aquamarine.webp",
    stock: 8,
    reviews: Array.from({ length: 50 }).map((_, i) => ({
      id: `r-aqua-${i}`,
      author: ["Maria C.", "Sophia L.", "Emma R.", "Olivia W.", "Isabella K."][i % 5],
      rating: 5,
      date: `${i + 1} days ago`,
      content: [
        "Great work. I wear it everywhere.",
        "The detail is great. You can feel the worker's touch.",
        "A beautiful piece of art.",
        "Nice, simple, and exactly what I wanted.",
        "The stones are the best. I like it a lot!"
      ][i % 5]
    }))
  },
  {
    id: "obsidian-heart",
    name: "Obsidian Heart",
    price: 150,
    description: "Natural black glass.",
    category: "bracelet",
    ordersCount: 85,
    imageStill: "/images/products/stills/obsidian.webp",
    imageWorn: "/images/products/worn/obsidian.webp",
    stock: 5,
    reviews: [
      { id: "r3", author: "Elena R.", rating: 4, date: "3 days ago", content: "Beautiful weight and finish. A true statement piece." }
    ]
  },
  {
    id: "crystal-white",
    name: "Crystal White",
    price: 180,
    description: "Pure clear crystal.",
    category: "bracelet",
    ordersCount: 210,
    imageStill: "/images/products/stills/crystalwhite.webp",
    imageWorn: "/images/products/worn/crystalwhite.webp",
    stock: 12,
    reviews: [
      { id: "r4", author: "Isabella G.", rating: 5, date: "5 days ago", content: "Pure elegance. Goes with everything." }
    ]
  },
  {
    id: "amethyst-aura",
    name: "Amethyst Aura",
    price: 140,
    description: "Handwoven Royal Purple Amethyst",
    category: "bracelet",
    ordersCount: 45,
    imageStill: "/images/products/stills/amethyst.webp",
    imageWorn: "/images/products/worn/amethyst.webp",
    stock: 3,
    reviews: [
      { id: "r5", author: "Clara S.", rating: 5, date: "1 day ago", content: "The purple is so deep and royal. Love it!" }
    ]
  },
  {
    id: "pearl-harmony",
    name: "Pearl Harmony",
    price: 90,
    description: "Simple white pearls.",
    category: "bracelet",
    ordersCount: 95,
    imageStill: "/images/products/stills/placeholder.png",
    imageWorn: "/images/products/worn/placeholder.png",
    stock: 15,
    reviews: []
  },
  {
    id: "silver-shore",
    name: "Silver Shore",
    price: 110,
    description: "Strong silver chain.",
    category: "bracelet",
    ordersCount: 30,
    imageStill: "/images/products/stills/placeholder.png",
    imageWorn: "/images/products/worn/placeholder.png",
    stock: 7,
    reviews: []
  },
  {
    id: "sunset-citrine",
    name: "Sunset Citrine",
    price: 130,
    description: "Warm yellow stones.",
    category: "necklace",
    ordersCount: 55,
    imageStill: "/images/products/stills/placeholder.png",
    imageWorn: "/images/products/worn/placeholder.png",
    stock: 10,
    reviews: []
  },
  {
    id: "moonstone-dew",
    name: "Moonstone Dew",
    price: 145,
    description: "Soft white stones.",
    category: "necklace",
    ordersCount: 70,
    imageStill: "/images/products/stills/placeholder.png",
    imageWorn: "/images/products/worn/placeholder.png",
    stock: 4,
    reviews: []
  },
  {
    id: "coral-reef",
    name: "Coral Reef",
    price: 125,
    description: "Deep red pieces.",
    category: "necklace",
    ordersCount: 40,
    imageStill: "/images/products/stills/placeholder.png",
    imageWorn: "/images/products/worn/placeholder.png",
    stock: 8,
    reviews: []
  },
  {
    id: "golden-sands",
    name: "Golden Sands",
    price: 160,
    description: "Gold chain necklace.",
    category: "necklace",
    ordersCount: 110,
    imageStill: "/images/products/stills/placeholder.png",
    imageWorn: "/images/products/worn/placeholder.png",
    stock: 6,
    reviews: []
  },
  {
    id: "emerald-tide",
    name: "Emerald Tide",
    price: 175,
    description: "Deep green stones.",
    category: "necklace",
    ordersCount: 25,
    imageStill: "/images/products/stills/placeholder.png",
    imageWorn: "/images/products/worn/placeholder.png",
    stock: 3,
    reviews: []
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    price: 115,
    description: "Soft pink stones.",
    category: "necklace",
    ordersCount: 150,
    imageStill: "/images/products/stills/placeholder.png",
    imageWorn: "/images/products/worn/placeholder.png",
    stock: 12,
    reviews: []
  }
];
