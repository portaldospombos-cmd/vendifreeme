export interface Product {
  id: number;
  title: string;
  price: number;
  location: string;
  description?: string;
  image: string;
  isPremium?: boolean;
  premium_plan?: 'free' | 'bronze' | 'silver' | 'gold';
  category: string;
  seller_id?: string;
  created_at?: string;
  sold?: boolean;
}

export interface Post {
  id: string; // usually UUID in supabase
  author: string;
  authorId?: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  isLiked?: boolean;
}
