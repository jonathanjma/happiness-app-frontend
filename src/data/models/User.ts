import { Setting } from "./Setting";

export interface User {
  id: number;
  username: string;
  email: string;
  created: string;
  profilePicture: string;
  settings: Setting[];
}
