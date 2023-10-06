import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { UseMutationResult, useMutation } from "react-query";
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
      queryFn: () => this.api.get("/user/self/"),
    });
  // TODO
  // deleteSelf: () => UseMutationResult<> = () => useMutation({mutationFn: (userId: string) => {
  //   return axios.post('/user', userId)
  // }})

  getToken: (username: string, password: string) => UseMutationResult<Token> = (
    username: string,
    password: string
  ) =>
    useMutation({
      mutationKey: [`login ${username}:`],
      mutationFn: () =>
        this.api.post(
          "/token/",
          {},
          {
            headers: {
              Authorization: "Basic " + btoa(`${username}:${password}`),
            },
          }
        ),
      // TODO fix
      onSuccess: (data: Token, variables, context) => {
        // I will fire first
        return data;
      },
    });
}
