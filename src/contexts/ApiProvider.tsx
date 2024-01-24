import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import ApiClient from "../ApiClient";

// For TypeScript, update this everytime we add a repository
interface ContextApi {
  api: ApiClient;
}

const repos = {
  api: new ApiClient(),
};

// Provides context
const ApiContext = createContext<ContextApi>(repos);

export default function ApiProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ApiContext.Provider value={repos}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApiContext.Provider>
  );
}

// Gives repos to children
export function useApi(): ContextApi {
  return useContext<ContextApi>(ApiContext);
}
