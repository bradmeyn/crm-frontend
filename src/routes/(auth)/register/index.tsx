import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Building2, Mail } from "lucide-react";

// Form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

import { registerSchema, type RegisterCredentials } from "@auth/schemas";
import { useAuth } from "@auth/context";

import { cn } from "@utils/shadcn";
import LoadingSpinner from "@/lib/components/ui/loading-spinner";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const form = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",

    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      business_name: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(data: RegisterCredentials) {
    try {
      setErrorMessage(null);

      await register(data);

      // Navigate to dashboard after successful registration (auto-logged in)
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="py-6 px-8 border-b bg-background">
        <Link to="/" className="text-xl font-bold">
          Rolodex
        </Link>
      </header>

      <main className="container max-w-xl py-12">
        <Card>
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>
              Get started with your business management portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              className={
                                form.formState.errors.email
                                  ? cn(
                                      "pl-9 border-red-500",
                                      "focus-visible:ring-red-500",
                                      "focus-visible:border-red-500"
                                    )
                                  : "pl-9"
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="Your business name"
                              className="pl-9"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a secure password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading || form.formState.isSubmitting ? (
                    <LoadingSpinner text="Creating account..." />
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
