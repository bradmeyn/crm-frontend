import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Button } from "@components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import type { Client } from "@clients/types";
import { getClientById } from "@clients/service";

export default function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <div className="border rounded-lg text-muted-foreground">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <ClientRow key={c.id} client={c} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ClientRow({ client }: { client: Client }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["client", client.id],
      queryFn: () => getClientById(client.id),
    });
  };

  const navigate = useNavigate();

  const go = () => navigate({ to: `/clients/${client.id}` });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  };

  return (
    <TableRow
      className="text-white cursor-pointer"
      tabIndex={0}
      onClick={go}
      onKeyDown={onKeyDown}
      onMouseEnter={prefetch}
    >
      <TableCell className="text-white">{client.firstName}</TableCell>
      <TableCell>{client.lastName}</TableCell>
      <TableCell className="truncate">{client.email}</TableCell>
      <TableCell>{client.phone}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical />
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
      </TableCell>
    </TableRow>
  );
}
