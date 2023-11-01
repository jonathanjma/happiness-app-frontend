import { Setting } from "./Setting";

export interface User {
  id: number;
  username: string;
  email: string;
  created: string;
  profilePicture: string;
  settings: Setting[];
}

export interface SimpleUser {
  id: number;
  username: string;
  profilePicture: string;
}
