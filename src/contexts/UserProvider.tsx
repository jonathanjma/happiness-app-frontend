// import React, { createContext, useContext, useEffect, useState } from "react";
// import { UseMutationResult, UseQueryResult, useQuery } from "react-query";
// import { Token } from "../data/models/Token";
// import { User } from "../data/models/User";
// import { useRepo } from "./RepoProvider";

// interface ContextUser {
//   user: UseQueryResult<User> | UseMutationResult<User>;
//   login: (username: string, password: string) => void;
//   logout: () => void;
//   createUser: (email: string, username: string, password: string) => void;
//   deleteUser: () => void;
// }

// const UserContext = createContext<ContextUser>({
//   user: useQuery(["defaultState"], () => {
//     return { error: "An error occurred" };
//   }),
//   login: (_, __) => {},
//   logout: () => {},
//   createUser: (_, __, ___) => {},
//   deleteUser: () => {},
// });

// /**
//  * The UserProvider context provides functionality for getting the user
//  * for all child components. The main point of the context is to allow child
//  * components to access the state of the current user object, but this also
//  * has functionality for the core user methods, such as logging in,
//  * deleting the user, logging out, and registering a user.
//  */

// export default function UserProvider({
//   children,
// }: {
//   children: React.ReactElement;
// }) {
//   const { userRepo } = useRepo();
//   const [user, setUser] = useState<
//     UseQueryResult<User> | UseMutationResult<User>
//   >(userRepo.getSelf());
//   let [tokenResult, setTokenResult] = useState<UseMutationResult<Token>>();

//   // update user object once login token response returns
//   useEffect(() => {
//     if (tokenResult && tokenResult.isSuccess) {
//       setUser(userRepo.getSelf());
//     }
//   }, [tokenResult]);

//   const login = (username: string, password: string) => {
//     setTokenResult(userRepo.getToken(username, password));
//   };

//   const logout = async () => {
//     userRepo.revokeToken();
//     setUser(
//       // TODO abstract to util file if it works
//       useQuery(["error"], () => {
//         // You can hard code an error by returning an object with an 'error' property
//         return { error: "An error occurred" };
//       })
//     );
//   };

//   const createUser = async (
//     email: string,
//     username: string,
//     password: string
//   ) => {
//     setUser(userRepo.createUser(email, username, password));
//   };

//   const deleteUser = async () => {
//     userRepo.deleteSelf();
//     setUser(
//       // TODO abstract to util file if it works
//       useQuery(["error"], () => {
//         // You can hard code an error by returning an object with an 'error' property
//         return { error: "An error occurred" };
//       })
//     );
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         createUser,
//         deleteUser,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   return useContext<ContextUser>(UserContext);
// }
