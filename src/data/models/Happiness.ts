export interface Happiness {
  id: number;
  user_id: number;
  value: number;
  comment: string;
  timestamp: string;
  // author: User;
}

export interface NewHappiness {
  value: number;
  comment: string;
  timestamp: string;
}

// type of the paginated happiness data structure used for infinite scroll
export interface HappinessPagination {
  data: Happiness[];
  page: number;
}
