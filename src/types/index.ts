export type ErrorType = {
  error?: string;
};

export type LoginType = {
  token?: string,
};

export type UFType = {
  id?: string;
  name?: string;
};

export type CategoryType = {
  id?: number;
  description?: string;
  slug?: string;
  image?: string;
};

export type AdType = {
  id?: number;
  user_id?: number;
  categoria_id?: number;
  categoria_description?: string;
  categoria_slug?: string;
  user_name?: string;
  email?: string;
  uf?: string;
  title?: string;
  image?: string;
  images?: string[];
  price?: number;
  priceNegotiable?: number | boolean;
  date_created?: string;
  views?: number;
  description?: string;
  similares?: AdType[];
};