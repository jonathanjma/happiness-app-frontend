import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import { useApi } from "../../contexts/ApiProvider";
import { Token } from "../models/Token";
import { User } from "../models/User";
import { Constants } from "../../constants/constants";
import { useState } from "react";
import UserRepository from "./UserRepository";

export default function UserRepositoryImpl(): UserRepository {
  const { api } = useApi();
  const getSelf: () => UseQueryResult<User> = () =>
    useQuery({
      queryKey: ["self"],
      queryFn: () => api.get("/user/self/"),
      retry: 0
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
};