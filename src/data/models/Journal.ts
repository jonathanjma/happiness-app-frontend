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

export interface JournalInfinitePagination {
  pages: JournalPagination[],
  pageParams: any[];  // not really sure what type this is honestly
}

export interface SimpleJournal {
  data: string;
  timestamp: string;
}