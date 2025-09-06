import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function Header() {
  return (
    <header className="bg-white shadow-xs dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center font-semibold">
            <Link href="/">CRM</Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <a href="/" className="shrink-0">
            Cool Logo
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Supercharge Your Customer Relationships
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The all-in-one CRM solution that helps you manage customers, close
              deals, and grow your business faster.
            </p>
            <div className="flex gap-4 justify-center">
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
