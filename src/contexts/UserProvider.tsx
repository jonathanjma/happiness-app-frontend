import React, { createContext, useContext, useState } from "react";
import { useRepo } from "./RepoProvider";
import { Token } from "../data/models/Token";
import { User } from "../data/models/User";

interface ContextUser {
  user: User;
  login: (username: string, password: string) => void;
  logout: () => void;
  userFromToken: () => void;
  createUser: (email: string, username: string, password: string) => void;
  deleteUser: () => void;
}

const UserContext = createContext<ContextUser>({});

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
  const [user, setUser] = useState();
  const { userRepo } = useRepo();

  const login = async (username: string, password: string) => {
    await userRepo
      .getToken(username, password)
      .mutateAsync("")
      .then(async (res: Token) => {
        localStorage.setItem(Constants.TOKEN, res.sessionToken);
        await userFromToken();
      })
      .catch((err) => {
        setUser(UserState.error());
      });
  };

  const logout = async () => {
    await userRepo
      .revokeToken()
      .mutateAsync("")
      .then((res) => {
        localStorage.setItem(Constants.TOKEN, null);
        setUser(UserState.error());
      });
  };

  const userFromToken = () => {
    setUser(UserState.loading());
    if (localStorage.getItem(Constants.TOKEN) !== null) {
      userRepo
        .getSelf()

        .then((res: User) => {
          setUser(UserState.success(res));
          console.log("GetUserFromToken: User found");
        })
        .catch((err) => {
          setUser(UserState.error());
        });
    } else {
      setUser(UserState.error());
    }
  };

  const createUser = async (
    email: string,
    username: string,
    password: string
  ) => {
    await userRepo
      .createUser(email, username, password)
      .mutateAsync("")
      .then(async (res: User) => {
        await login(username, password);
      })
      .catch((err) => {
        setUser(UserState.error());
      });
  };

  const deleteUser = async () => {
    await userRepo
      .deleteSelf()
      .mutateAsync("")
      .then(() => {
        setUser(UserState.error());
        localStorage.setItem(Constants.TOKEN, null);
      });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        userFromToken,
        createUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext<ContextUser>(UserContext);
}
