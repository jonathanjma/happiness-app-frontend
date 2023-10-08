import {
  UseMutationResult,
  UseQueryResult
} from "react-query";
import { Token } from "../models/Token";
import { User } from "../models/User";

export default interface UserRepository {
  getSelf: () => UseQueryResult<User>;
  getToken: (username: string, password: string) => UseMutationResult<Token>;
  revokeToken: () => UseMutationResult;
  createUser: (email: string, username: string, password: string) => UseMutationResult<User>;
  deleteSelf: () => UseMutationResult;
}
