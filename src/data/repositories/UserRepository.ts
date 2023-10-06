import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import ApiClient from "../../ApiClient";
import { Token } from "../models/Token";
import { User } from "../models/User";

export default function UserRepository(api: ApiClient) {
  const getSelf: () => UseQueryResult<User> = () =>
    useQuery({
      queryKey: ["self"],
      queryFn: () => api.get("/user/self/"),
    });

  const getToken: (
    username: string,
    password: string
  ) => UseMutationResult<Token> = (username: string, password: string) =>
    useMutation({
      mutationKey: [`login ${username}:`],
      mutationFn: () =>
        api
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

  const revokeToken: () => UseMutationResult = () =>
    useMutation({
      mutationKey: [`logout`],
      mutationFn: () => api.delete("/token/"),
      onSuccess: () => {
        localStorage.removeItem(Constants.TOKEN);
      },
    });

  const createUser: (
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
        api
          .post("/user/", {
            username: username,
            password: password,
            email: email,
          })
          .then((res) => res.data),
    });

  const deleteSelf: () => UseMutationResult = () =>
    useMutation({
      mutationKey: [`delete user`],
      mutationFn: () => api.delete("/user/"),
      onSuccess: () => {
        localStorage.removeItem(Constants.TOKEN);
      },
    });

  return { getSelf, getToken, createUser, revokeToken, deleteSelf };
}
