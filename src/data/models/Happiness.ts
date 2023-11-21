import { User } from "./User";

export interface Happiness {
  id: number;
  value: number;
  comment: string;
  timestamp: string;
  author: User;
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
