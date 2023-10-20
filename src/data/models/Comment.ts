import { SimpleUser } from "./User";

export interface Comment {
  id: number;
  happinessId: number;
  author: SimpleUser;
  text: string;
  timestamp: string;
}
