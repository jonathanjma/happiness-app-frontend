// import { createContext, useContext } from "react";
// import { HappinessRepository } from "../data/repositories/HappinessRepository";
// import UserRepository from "../data/repositories/UserRepository";
// import ApiClient from "../ApiClient";
// import UserRepositoryImpl from "../data/repositories/UserRepositoryImpl";

// // For TypeScript, update this everytime we add a repository
// interface Repositories {
//   userRepo: UserRepository;
//   happinessRepo: HappinessRepository;
// }

// // Initializes all repos
// const api = new ApiClient();


// // Provides context
// const RepoContext = createContext<Repositories>(repos);

// export default function RepoProvider({
//   children,
// }: {
//   children: React.ReactElement;
// }) {
//   const repos = {
//     userRepo: UserRepositoryImpl({ api }),
//     happinessRepo: new HappinessRepository(api),
//   };
//   return <RepoContext.Provider value={repos}>{children}</RepoContext.Provider>;
// }

// // Gives repos to children
// export function useRepo(): Repositories {
//   return useContext<Repositories>(RepoContext);
// }
