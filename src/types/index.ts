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
  image?: string;
};

export type AdType = {
  id?: number;
  user_id?: number;
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