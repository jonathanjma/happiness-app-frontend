import { Setting } from "./Setting";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created: Date;
  profilePicture: string;
  settings: Setting[];
}
