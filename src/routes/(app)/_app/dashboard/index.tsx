import { createFileRoute } from "@tanstack/react-router";
import { Users, Gift, UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

export const Route = createFileRoute("/(app)/_app/dashboard/")({
  component: DashboardPage,
});

export default function DashboardPage() {
  // Sample data - replace with your actual data
  const stats = {
    totalClients: 1234,
    newClients: 25,
  };

  const recentClients = [
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-green-600">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              New Clients
            </CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newClients}</div>
            <p className="text-xs text-green-600">+180.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between">
              {/* Placeholder for chart bars */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 bg-black rounded-t"
                  style={{
                    height: `${Math.random() * 100 + 50}px`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>Jan</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <p className="text-sm text-gray-500">
              You added 25 new clients this month.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Upcoming Birthdays
            </CardTitle>
            <p className="text-sm text-gray-500">
              Birthdays in the next 30 days
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBirthdays.map((person, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
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
