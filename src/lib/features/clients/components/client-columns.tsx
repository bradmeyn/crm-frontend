import { ColumnDef } from "@components/data-table";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { MoreVertical } from "lucide-react";
import type { Client } from "@clients/types";

export const clientColumns: ColumnDef<Client>[] = [
  {
    id: "firstName",
    header: "First Name",
    accessorKey: "firstName",
    enableSorting: true,
  },
  {
    id: "lastName",
    header: "Last Name",
    accessorKey: "lastName",
    enableSorting: true,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    cell: ({ getValue }) => (
      <div className="truncate max-w-[200px]" title={getValue()}>
        {getValue()}
      </div>
    ),
  },
  {
    id: "phone",
    header: "Phone",
    accessorKey: "phone",
  },
  {
    id: "actions",
    header: "",
    width: "50px",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link to={`/clients/${client.id}`} className="w-full block">
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
