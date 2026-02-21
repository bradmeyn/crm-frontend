import { ColumnDef } from "@components/data-table";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import type { FileNote } from "@clients/file-notes/types";
import EditNoteMenuItem from "./edit-note-menu-item";
import ViewNoteMenuItem from "./view-note-menu-item";

export const noteColumns: ColumnDef<FileNote>[] = [
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
    enableSorting: true,
  },
  {
    id: "noteType",
    header: "Type",
    accessorKey: "noteType",
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
        {getValue()}
      </span>
    ),
  },
  {
    id: "body",
    header: "Body",
    accessorKey: "body",
    cell: ({ getValue }) => (
      <div className="truncate max-w-[300px]" title={getValue()}>
        {getValue()}
      </div>
    ),
  },
  {
    id: "isPrivate",
    header: "Visibility",
    accessorKey: "isPrivate",
    cell: ({ getValue }) => (getValue() ? "Private" : "Shared"),
  },
  {
    id: "createdAt",
    header: "Created",
    accessorKey: "createdAt",
    enableSorting: true,
    cell: ({ getValue }) => {
      const date = new Date(getValue());
      return date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    id: "updatedAt",
    header: "Updated",
    accessorKey: "updatedAt",
    enableSorting: true,
    cell: ({ getValue }) => {
      const date = new Date(getValue());
      return date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "",
    width: "50px",
    cell: ({ row }) => {
      const note = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ViewNoteMenuItem note={note} />
            <EditNoteMenuItem note={note} />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
