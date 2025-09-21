import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import GardenPage from "./pages/GardenPage";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Header />
    </QueryClientProvider>
  );
}

render(<App />, document.getElementById("root"));
