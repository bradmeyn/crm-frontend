import { Button } from "@components/ui/button";
import { Search, Users } from "lucide-react";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Mock client data
  const clients = [
    { id: 1, name: "Acme Corp" },
    { id: 2, name: "Globex Industries" },
    { id: 3, name: "Stark Enterprises" },
    { id: 4, name: "Wayne Enterprises" },
    { id: 5, name: "Umbrella Corporation" },
  ];

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground font-light sm:pr-12 md:w-90 shadow-xs"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search clients...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none  absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-gray-50 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search clients..." />
        <CommandList>
          <CommandEmpty>No clients found.</CommandEmpty>
          <CommandGroup heading="Clients">
            {clients.map((client) => (
              <CommandItem
                key={client.id}
                onSelect={() => {
                  // Handle client selection
                  setOpen(false);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>{client.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
