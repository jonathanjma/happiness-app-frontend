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

/**
 * Type of Happiness for sending to the backend in a post request.
 */
export interface HappinessPost {
  value: number;
  comment: string;
  timestamp: string;
}
export interface HappinessPaginationResults {
  pages: HappinessPagination[];
  // below is not actually used, I just consume it with any
  pageParams: any;
}
