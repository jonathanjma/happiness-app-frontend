import { SimpleUser } from "./User";

export interface Group {
  id: number;
  name: string;
  users: SimpleUser[];
  invited_users: SimpleUser[];
}
