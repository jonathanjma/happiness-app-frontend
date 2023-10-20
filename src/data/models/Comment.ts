import { User } from "./User";

export interface Comment {
  id: number;
  happiness_id: number;
  author: User;
  text: string;
  timestamp: string;
}
