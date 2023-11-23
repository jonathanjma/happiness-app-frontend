import { Setting } from "./Setting";

export interface User {
  id: number;
  username: string;
  email: string;
  created: string;
  profile_picture: string;
  settings: Setting[];
}

export interface SimpleUser {
  id: number;
  username: string;
  profile_picture: string;
}
