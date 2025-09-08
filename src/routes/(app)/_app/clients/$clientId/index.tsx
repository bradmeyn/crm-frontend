import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { getClientById } from "@clients/service";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/(app)/_app/clients/$clientId/")({
  component: ClientDetailPage,
  errorComponent: () => <div>Error loading client</div>,
  loader: async ({ params: { clientId } }) => {
    getClientById(clientId);
    return null;
  },
});

function ClientDetailPage({
  params: { clientId },
}: {
  params: { clientId: string };
}) {
  const {
    data: client,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId),
  });

  if (!client) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading client: {(error as Error).message}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-6">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0 lg:self-start">
              <div className="relative">
                <UserCircle className="h-24 w-24 text-slate-900" />
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 space-y-6">
              {/* Name and Title */}
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {client.first_name} {client.last_name}
                </h2>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Email Address
                    </span>
                  </div>
                  <p className="text-gray-900 pl-6">{client.email}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Phone Number
                    </span>
                  </div>
                  <p className="text-gray-900 pl-6">{client.phone}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Address
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Date of Birth
                    </span>
                  </div>
                  {/* <p className="text-gray-900 pl-6">
                    {new Date(client.dateOfBirth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p> */}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Join Date
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Client ID
                    </span>
                  </div>
                  <p className="text-gray-900 pl-6">#{client.id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
