export interface Genre {
  id: string; // atau number
  name: string;
}

export interface Book {
  id: string;
  title: string;
  writer: string;
  publisher: string;
  description: string;
  publication_year: number;
  price: number;
  stock_quantity: number;
  genre: string; // API mengembalikan genre sebagai STRING, bukan objek
}

export interface NewBookData {
  title: string;
  writer: string;
  publisher: string;
  publication_year: number;
  price: number;
  stock_quantity: number;
  genre_id: string; // API mengirim genre_id
  description?: string;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    prev_page: number | null;
    next_page: number | null;
  };
};

export interface UpdateBookData {
  description?: string;
  price?: number;
  stock_quantity?: number;
}