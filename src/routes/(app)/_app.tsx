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
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { redirect } from "@tanstack/react-router";
import { useAuth } from "@auth/context";
import SearchDialog from "./_app/-components/SearchDialog";

export const Route = createFileRoute("/(app)/_app")({
  component: ProtectedLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          // Optional: redirect back after login
          redirect: location.href,
        },
      });
    }
  },
  // Optional: Show loading state while auth is being determined
  pendingComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  ),
});

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
];

export default function ProtectedLayout() {
  const { user } = useAuth();
  // Show loading state while auth is being determined

  return (
    <div className="flex h-screen gap-4 bg-card">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col overflow-hidden shadow-sm">
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold text-white"
          >
            <span>{user?.business.name}</span>
          </Link>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-auto py-4 px-2">
          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-3">
              Menu
            </p>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <SidebarLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                />
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-background rounded-xl overflow-hidden m-4">
        <header className="h-16 px-6 flex items-center justify-between">
          {/* Left: Search */}
          <SearchDialog />
          {/* Right: User Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Bell size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Settings size={18} />
            </Button>
            <div className="p-2 rounded-full bg-gray-100 overflow-hidden">
              <User size={18} className="text-muted-foreground" />
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

function SidebarLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 py-2 px-3 rounded-md transition-colors hover:bg-muted hover:text-white"
      activeProps={{ className: "bg-muted border text-white" }}
      inactiveProps={{ className: "text-muted-foreground" }}
    >
      <Icon className="text-muted-foreground size-4" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
