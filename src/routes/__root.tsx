import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type AuthContextType } from "@auth/context";
import { type QueryClient } from "@tanstack/react-query";

interface RouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});
