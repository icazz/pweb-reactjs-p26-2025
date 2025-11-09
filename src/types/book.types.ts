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
  price: number;
  genre: Genre;
  book_image?: string | null;
  stockQuantity: number;
  publicationYear: number;
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

export interface UpdateBookData {
  description?: string;
  price?: number;
  stock_quantity?: number;
}