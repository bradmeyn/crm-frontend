import { createFileRoute } from "@tanstack/react-router";
import { Users, Gift, UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

export const Route = createFileRoute("/(app)/_app/dashboard/")({
  component: DashboardPage,
});

export default function DashboardPage() {
  const newClients = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      joinDate: "2024-02-20",
    },
    {
      name: "Michael Chen",
      email: "michael.chen@email.com",
      joinDate: "2024-02-19",
    },
    {
      name: "Emma Davis",
      email: "emma.davis@email.com",
      joinDate: "2024-02-18",
    },
    {
      name: "James Wilson",
      email: "james.wilson@email.com",
      joinDate: "2024-02-17",
    },
    {
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      joinDate: "2024-02-16",
    },
  ];

  const upcomingBirthdays = [
    {
      name: "David Kim",
      email: "david.kim@email.com",
      date: "February 25",
      age: "32",
    },
    {
      name: "Lisa Chen",
      email: "lisa.chen@email.com",
      date: "February 26",
      age: "28",
    },
    {
      name: "John Smith",
      email: "john.smith@email.com",
      date: "February 27",
      age: "45",
    },
    {
      name: "Ana Santos",
      email: "ana.santos@email.com",
      date: "February 28",
      age: "39",
    },
    {
      name: "Tom Wilson",
      email: "tom.wilson@email.com",
      date: "March 1",
      age: "35",
    },
  ];

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader className="flex items-center gap-4">
            <div className="flex items-center   rounded-full bg-primary/10 p-2 w-max text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>New Clients</CardTitle>
              <p className="text-sm text-gray-500">
                You added 25 new clients this month.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newClients.map((client, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-500">
                        {client.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(client.joinDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex items-center gap-4">
            <div className="flex items-center   rounded-full bg-primary/10 p-2 w-max text-primary">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Upcoming Birthdays
              </CardTitle>
              <p className="text-sm text-gray-500">
                Birthdays in the next 30 days
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBirthdays.map((person, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-gray-500">
                        {person.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{person.date}</div>
                    <div className="text-sm text-gray-500">
                      Turning {person.age}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
