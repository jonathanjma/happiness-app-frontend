export interface Journal {
  id: number;
  user_id: number;
  data: string;
  timestamp: string;
}

// type of the paginated journal data structure used for infinite scroll
export interface JournalPagination {
  data: Journal[];
  page: number;
}

export interface InfiniteJournalPagination {
  pages: JournalPagination[];
  // not really sure what this array is supposed to be and we don't really use it
  pageParams: any[];
}
