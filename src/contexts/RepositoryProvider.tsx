import { createContext, useContext } from "react";

const Context = createContext();

export default function ApiProvider({ children }) {
  const api = new ApiClient();
  const queryClient = new QueryClient();

  return (
    <ApiContext.Provider value={api}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
