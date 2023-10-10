import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "./ApiProvider";
import { useQuery } from "react-query";
import { User } from "../data/models/User";
import { Constants } from "../constants/constants";

interface ContextUser {
  user: User | undefined;
  createUser: (username: string, email: string, password: string) => void;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  deleteUser: () => void;
}

const UserContext = createContext<ContextUser>({
  user: undefined,
  createUser: (_: string, __: string) => { },
  loginUser: (_: string, __: string) => { },
  logoutUser: () => { },
  deleteUser: () => { }
});

/**
 * The UserProvider context provides functionality for getting the user
 * for all child components. The main point of the context is to allow child
 * components to access the state of the current user object, but this also
 * has functionality for the core user methods, such as logging in,
 * deleting the user, logging out, and registering a user.
 */

export default function UserProvider({ children }: { children: React.ReactElement; }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { api } = useApi();

  const getUserFromToken = async () => {
    const res = await api.get("/user/self/");
    setUser(res.data);
  };

  useEffect(() => {
    getUserFromToken();
  }, [api]);

  const createUser = (username: string, email: string, password: string) => {
    api.post("/user/", {
      email: email,
      password: password,
      username: username
    }).then((res) => {
      if (res.status == 201) {
        setUser(res.data);
      }
    });
  };


  const loginUser = (username: string, password: string) => {
    console.log("login called");
    api.post("/token/", {}, {
      headers: {
        Authorization: "Basic " + btoa(`${username}:${password}`),
      }
    }).then(async (res) => {
      if (res.status == 201) {
        localStorage.setItem(Constants.TOKEN, res.data["session_token"]);
        setUser(res.data);
        await getUserFromToken();
      }
    });
  };

  const logoutUser = () => {
    api.delete("/token/").then((res) => {
      if (res.status == 204) {
        setUser(undefined);
        localStorage.removeItem(Constants.TOKEN);
      }
    });
  };

  const deleteUser = () => {
    api.delete("/user/").then((res) => {
      if (res.status == 204) {
        setUser(undefined);
        localStorage.removeItem(Constants.TOKEN);
      }
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        createUser,
        deleteUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser(): ContextUser {
  return useContext<ContextUser>(UserContext);
}
