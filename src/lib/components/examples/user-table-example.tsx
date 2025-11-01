// Example: How to use DataTable for other entities

import { DataTable, ColumnDef } from "@components/data-table";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";

// Example: User entity
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive";
  createdAt: string;
}

// Define columns for users
const userColumns: ColumnDef<User>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    enableSorting: true,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "role",
    header: "Role",
    accessorKey: "role",
    cell: ({ getValue }) => {
      const role = getValue() as string;
      const variants: Record<string, "default" | "secondary" | "destructive"> =
        {
          admin: "destructive",
          moderator: "secondary",
          user: "default",
        };
      return <Badge variant={variants[role] || "default"}>{role}</Badge>;
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ getValue }) => {
      const date = new Date(getValue());
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "",
    width: "100px",
    cell: ({ row }) => (
      <Button variant="outline" size="sm">
        Edit
      </Button>
    ),
  },
];

// Usage in component
function UserTable({ users }: { users: User[] }) {
  const handleRowClick = (user: User) => {
    console.log("Clicked user:", user);
    // Navigate to user detail page
  };

  return (
    <DataTable
      data={users}
      columns={userColumns}
      searchPlaceholder="Search users..."
      searchKeys={["name", "email"]} // Only search these fields
      pageSize={15}
      onRowClick={handleRowClick}
      rowClassName={(user) => (user.status === "inactive" ? "opacity-50" : "")}
    />
  );
}

export { UserTable, userColumns };
