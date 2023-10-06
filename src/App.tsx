import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HappinessRepositoryImpl } from "./data/repositories/HappinessRepositoryImpl";
import Entries from "./pages/Entries";

function App() {
  const happinessRepository = new HappinessRepositoryImpl();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-full">
        <Entries happinessRepository={happinessRepository} />
        <p className="text-white">Hello world!</p>
      </div>
    </QueryClientProvider>
  );
}

export default App;
