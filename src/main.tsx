import { AuthProvider, useAuth, type AuthContextType } from "@auth/context";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient();

export interface RouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
}

// Create router with initial context
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined! as AuthContextType, // Will be set in RouterProvider
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

function InnerApp() {
  const auth = useAuth();

  // Create the context object with current auth state
  const routerContext: RouterContext = {
    auth,
    queryClient,
  };

  return <RouterProvider router={router} context={routerContext} />;
}

function App() {
  const root = window.document.documentElement;

  root.classList.remove("light", "dark");

  root.classList.add("dark");
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
