import * as React from "react";
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

export const Route = createFileRoute("/(app)/_app/clients/$clientId/")({
  component: ClientDetailPage,
  loader: () => {
    // Simulate a data fetching delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 1000);
    });
  },
});

// Mock client data
const mockClient = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  phone: "+1 234 567 8900",
  address: "123 Main St, Austin, TX 78701",
  dateOfBirth: "1985-05-15",
  joinDate: "2020-03-10",
  occupation: "Software Engineer",
};

function ClientDetailPage() {
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
                  {mockClient.firstName} {mockClient.lastName}
                </h2>
                <p className="text-base text-gray-600 mt-1">
                  {mockClient.occupation}
                </p>
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
                  <p className="text-gray-900 pl-6">{mockClient.email}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Phone Number
                    </span>
                  </div>
                  <p className="text-gray-900 pl-6">{mockClient.phone}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Address
                    </span>
                  </div>
                  <p className="text-gray-900 pl-6">{mockClient.address}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Date of Birth
                    </span>
                  </div>
                  <p className="text-gray-900 pl-6">
                    {new Date(mockClient.dateOfBirth).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Join Date
                    </span>
                  </div>
                  <p className="text-gray-900 pl-6">
                    {new Date(mockClient.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Client ID
                    </span>
                  </div>
                  <p className="text-gray-900 pl-6">#{mockClient.id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
