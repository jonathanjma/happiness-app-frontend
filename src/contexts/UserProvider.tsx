import React, { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "./ApiProvider";
import { User } from "../data/models/User";
import { Constants } from "../constants";
import { Token } from "../data/models/Token";

export enum UserState {
  Loading,
  Error,
  Success,
}

interface ContextUser {
  user: User | undefined;
  state: UserState;
  createUser: (username: string, email: string, password: string) => void;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  deleteUser: () => void;
}

const UserContext = createContext<ContextUser>({
  user: undefined,
  state: UserState.Loading,
  createUser: (_: string, __: string) => {},
  loginUser: (_: string, __: string) => {},
  logoutUser: () => {},
  deleteUser: () => {},
});

/**
 * The UserProvider context provides functionality for getting the user
 * for all child components. The main point of the context is to allow child
 * components to access the state of the current user object, but this also
 * has functionality for the core user methods, such as logging in,
 * deleting the user, logging out, and registering a user.
 */

export default function UserProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [state, setState] = useState<UserState>(UserState.Loading);
  const [user, setUser] = useState<User | undefined>(undefined);
  const { api } = useApi();

  useEffect(() => {
    getUserFromToken();
  }, [api]);

  const getUserFromToken = () => {
    api
      .get<User>("/user/self/")
      .then((res) => {
        setState(UserState.Success);
        setUser(res.data);
      })
      .catch(() => setState(UserState.Error));
  };

  const createUser = (username: string, email: string, password: string) => {
    api
      .post<User>("/user/", {
        email: email,
        password: password,
        username: username,
      })
      .then((res) => {
        if (res.status == 201) {
          setUser(res.data);
        }
      });
  };

  const loginUser = (username: string, password: string) => {
    api
      .post<Token>(
        "/token/",
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        },
      )
      .then(async (res) => {
        if (res.status == 201) {
          localStorage.setItem(Constants.TOKEN, res.data.session_token);
          getUserFromToken();
        }
      })
      .catch(() => setState(UserState.Error));
  };

  const logoutUser = () => {
    api.delete<void>("/token/").then((res) => {
      if (res.status == 204) {
        setUser(undefined);
        localStorage.removeItem(Constants.TOKEN);
      }
    });
  };

  const deleteUser = () => {
    api.delete<void>("/user/").then((res) => {
      if (res.status == 204) {
        setUser(undefined);
        setState(UserState.Error);
        localStorage.removeItem(Constants.TOKEN);
      }
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        state,
        loginUser,
        logoutUser,
        createUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): ContextUser {
  return useContext<ContextUser>(UserContext);
}
