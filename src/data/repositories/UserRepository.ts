import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import ApiClient from "../../ApiClient";
import { Token } from "../models/Token";
import { User } from "../models/User";
import { QueryClient } from "@tanstack/react-query";

export class UserRepository {
  api: ApiClient;
  queryClient: QueryClient;
  constructor(api: ApiClient, queryClient: QueryClient) {
    this.api = api;
    this.queryClient = queryClient;
  }

  getSelf: () => UseQueryResult<User> = () =>
    useQuery({
      queryKey: ["self"],
      queryFn: () => this.api.get("/user/self/"),
    });

  getToken: (username: string, password: string) => UseMutationResult<Token> = (
    username: string,
    password: string
  ) =>
    useMutation({
      mutationKey: [`login ${username}:`],
      mutationFn: () =>
        this.api
          .post(
            "/token/",
            {},
            {
              headers: {
                Authorization: "Basic " + btoa(`${username}:${password}`),
              },
            }
          )
          .then((res) => res.data),
      onSuccess: (token: Token) => {
        localStorage.setItem(Constants.TOKEN, token.sessionToken);
      },
    });

  revokeToken: () => UseMutationResult = () =>
    useMutation({
      mutationKey: [`logout`],
      mutationFn: () => this.api.delete("/token/"),
      onSuccess: () => {
        localStorage.removeItem(Constants.TOKEN);
      },
    });

  createUser: (
    email: string,
    username: string,
    password: string
  ) => UseMutationResult<User> = (
    email: string,
    username: string,
    password: string
  ) =>
    useMutation({
      mutationKey: [`create user ${username}:`],
      mutationFn: () =>
        this.api
          .post("/user/", {
            username: username,
            password: password,
            email: email,
          })
          .then((res) => res.data),
    });

  deleteSelf: () => UseMutationResult = () =>
    useMutation({
      mutationKey: [`delete user`],
      mutationFn: () => this.api.delete("/user/"),
      onSuccess: () => {
        localStorage.removeItem(Constants.TOKEN);
      },
    });
}
