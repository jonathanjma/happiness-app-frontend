import { User } from "./User";

export interface Happiness {
  id: number;
  value: number;
  comment: string;
  timestamp: string;
  author: User;
}

// type representing the fields used to update a happiness entry
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

// type of the infinite happiness query
export interface InfiniteHappinessPagination {
  pages: HappinessPagination[];
  // not really sure what this array is supposed to be and we don't really use it
  pageParams: any[];
}

/**
 * Type of Happiness for sending to the backend in a post request.
 */
export interface HappinessPost {
  value: number;
  comment: string;
  timestamp: string;
}
