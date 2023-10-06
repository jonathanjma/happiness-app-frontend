import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useMutation, UseMutationResult } from "react-query";
import ApiClient from "../../ApiClient";
import { useRepo } from "../../contexts/RepoProvider";
import { Token } from "../models/Token";
import { User } from "../models/User";

export class UserRepository {
  api: ApiClient;
  constructor() {
    const { api } = useRepo();
    this.api = api;
  }

  getSelf: () => UseQueryResult<User> = () =>
    useQuery({
      queryKey: ["self"],
      queryFn: () => this.api.get("/user/self/").then((res) => res.data),
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
    });

  revokeToken: () => UseMutationResult = () =>
    useMutation({
      mutationKey: [`logout`],
      mutationFn: () => this.api.delete("/token/"),
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
    });
}
