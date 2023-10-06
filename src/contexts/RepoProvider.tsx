import { createContext, useContext } from "react";
import { HappinessRepository } from "../data/repositories/HappinessRepository";
import UserRepository from "../data/repositories/UserRepository";
import ApiClient from "../ApiClient";

// For TypeScript, update this everytime we add a repository
interface Repositories {
  userRepo: UserRepository;
  happinessRepo: HappinessRepository;
}

// Initializes all repos
const api = new ApiClient();
const repos = {
  userRepo: UserRepository(api),
  happinessRepo: new HappinessRepository(api),
};

// Provides context
const RepoContext = createContext<Repositories>(repos);

export default function RepoProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  return <RepoContext.Provider value={repos}>{children}</RepoContext.Provider>;
}

// Gives repos to children
export function useRepo(): Repositories {
  return useContext<Repositories>(RepoContext);
}
