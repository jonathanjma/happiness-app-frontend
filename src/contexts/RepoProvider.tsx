import React, { createContext, useContext } from "react";
import { UserRepository } from "../data/repositories/UserRepository";
import { HappinessRepository } from "../data/repositories/HappinessRepository";
import { QueryClient, QueryClientProvider } from "react-query";
import ApiClient from "../ApiClient";

// For TypeScript, update this everytime we add a repository
interface Repositories {
  api: ApiClient;
  userRepo: UserRepository;
  happinessRepo: HappinessRepository;
}

// Initializes all repos
const repos = {
  api: new ApiClient(),
  userRepo: new UserRepository(),
  happinessRepo: new HappinessRepository(),
};

// Provides context
const RepoContext = createContext<Repositories>(repos);

export default function RepoProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const queryClient = new QueryClient();

  return (
    <RepoContext.Provider value={repos}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RepoContext.Provider>
  );
}

// Gives repos to children
export function useRepo(): Repositories {
  return useContext<Repositories>(RepoContext);
}
