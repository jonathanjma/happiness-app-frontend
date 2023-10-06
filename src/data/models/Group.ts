import { User } from "./User";

export interface Group {
  id: number;
  name: string;
  users: User[];
}
