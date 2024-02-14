import { Setting } from "./Setting";
import { Group } from "./Group";

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

export interface UserGroups {
  groups: Group[];
}

export interface UserStats {
  entries: number;
  groups: number;
}
