import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable } from "@components/data-table";
import AddClientDialog from "@clients/components/add-client-dialog";
import { clientColumns } from "@clients/components/client-columns";
import { getClients, getClientById } from "@/lib/features/clients/service";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { Client } from "@/lib/features/clients/types";

export const Route = createFileRoute("/(app)/_app/clients/")({
  component: ClientListPage,
  errorComponent: () => <div>Error loading clients</div>,
  loader: async ({ context: { queryClient } }) => {
    const initialParams = { page: 1, pageSize: 10, q: "" };
    await queryClient.fetchQuery({
      queryKey: ["clients", initialParams],
      queryFn: () => getClients(initialParams),
    });
    return null;
  },
});

function ClientListPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: clients } = useSuspenseQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: () => getClients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRowClick = (client: Client) => {
    navigate({ to: `/clients/${client.id}` });
  };

  const handleRowMouseEnter = (client: Client) => {
    queryClient.prefetchQuery({
      queryKey: ["client", client.id],
      queryFn: () => getClientById(client.id),
    });
  };

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Clients</h1>
        <AddClientDialog />
      </div>

      <DataTable
        data={clients || []}
        columns={clientColumns}
        searchPlaceholder="Search clients..."
        searchKeys={["firstName", "lastName", "email", "phone"]}
        pageSize={10}
        onRowClick={handleRowClick}
        onRowMouseEnter={handleRowMouseEnter}
        rowClassName="text-white cursor-pointer hover:bg-muted/50"
        enablePagination={true}
        enableSearch={true}
      />
    </main>
  );
}
