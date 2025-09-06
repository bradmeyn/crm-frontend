import {
  Outlet,
  createFileRoute,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "@components/ui/button";
import {
  LayoutDashboard,
  Users,
  Bell,
  ChevronRight,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { redirect } from "@tanstack/react-router";
import { useAuth } from "@auth/context";

import SearchDialog from "./_app/-components/SearchDialog";

export const Route = createFileRoute("/(app)/_app")({
  component: ProtectedLayout,
  loader: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen gap-4 bg-white">
      {/* Sidebar */}
      <aside className="w-72 flex flex-col overflow-hidden bg-slate-800 shadow-sm">
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold text-white"
          >
            <span>{user?.firstName}</span>
          </Link>
          <button className="rounded-md p-1 hover:bg-slate-700 text-white">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-auto py-4 px-3">
          {/* Categories */}
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-400 px-3 mb-3">MENU</p>
            <nav className="flex flex-col gap-1">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 py-2 px-3 rounded-md transition-colors hover:bg-slate-700"
                activeProps={{ className: "bg-slate-700 text-white" }}
                inactiveProps={{ className: "text-slate-300" }}
              >
                <LayoutDashboard size={18} className="text-slate-400" />
                <span className="text-sm">Dashboard</span>
              </Link>

              <Link
                to="/clients"
                className="flex items-center gap-3 py-2 px-3 rounded-md transition-colors hover:bg-slate-700"
                activeProps={{ className: "bg-slate-700 text-white" }}
                inactiveProps={{ className: "text-slate-300" }}
              >
                <Users size={18} className="text-slate-400" />
                <span className="text-sm">Clients</span>
              </Link>
            </nav>

            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden">
        <header className="h-16 px-6 flex items-center justify-between">
          {/* Left: Search */}
          <SearchDialog />
          {/* Right: User Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Settings size={18} />
            </Button>
            <div className="p-2 rounded-full bg-gray-100 overflow-hidden">
              <User size={18} className="text-gray-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login page after successful logout
      router.navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to login even if logout API call fails
      // since tokens are cleared locally
      router.navigate({ to: "/login" });
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full flex items-center gap-3 py-2 px-3 rounded-md transition-colors hover:bg-slate-700 text-slate-300 hover:text-white justify-start"
      onClick={handleLogout}
    >
      <LogOut size={18} className="text-slate-400" />
      <span className="text-sm">Logout</span>
    </Button>
  );
}
