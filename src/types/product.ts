export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  description: string;
  category: 'necklace' | 'bracelet';
  ordersCount: number;
  imageStill: string;
  imageWorn: string;
  gallery?: string[];
  video?: string;
  stock: number;
  newArrival?: boolean;
  isSoldOut?: boolean;
  isArchived?: boolean;
  viewsCount?: number;
  averageRating?: number;
  reviews?: Review[];
}
