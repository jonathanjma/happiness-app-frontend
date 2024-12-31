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

export interface HappinessWrapped {
  username: string;
  entries: number;
  top_pct: number;
  average_score: number;
  mode_score: { score: number; count: number };
  longest_streak: { start: string; end: string; days: number };
  min_score: { score: number; date: string };
  max_score: { score: number; date: string };
  largest_diff: { start: string; end: string; diff: string };
  month_highest: { month: number; avg_score: number };
  month_lowest: { month: number; avg_score: number };
  week_highest: { week_start: string; avg_score: number };
  week_lowest: { week_start: string; avg_score: number };
  top_words: string[];
}
