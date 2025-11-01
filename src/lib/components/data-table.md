# DataTable Component

A reusable, feature-rich data table component built with shadcn/ui components.

## Features

- 🔍 **Search**: Built-in search functionality with customizable search keys
- 📄 **Pagination**: Client-side pagination with configurable page sizes
- 🎨 **Customizable**: Flexible column definitions and row styling
- ⌨️ **Accessible**: Keyboard navigation and screen reader friendly
- 🖱️ **Interactive**: Row click handlers, mouse events, and prefetching support
- 📱 **Responsive**: Works well on different screen sizes

## Basic Usage

```tsx
import { DataTable, ColumnDef } from "@components/data-table";

// Define your data type
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Define columns
const columns: ColumnDef<Client>[] = [
  {
    id: "firstName",
    header: "First Name",
    accessorKey: "firstName",
  },
  {
    id: "lastName",
    header: "Last Name",
    accessorKey: "lastName",
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
];

// Use in component
function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <DataTable
      data={clients}
      columns={columns}
      searchPlaceholder="Search clients..."
      searchKeys={["firstName", "lastName", "email"]}
    />
  );
}
```

## Column Definition

### Basic Column

```tsx
{
  id: "firstName",           // Unique identifier
  header: "First Name",      // Column header text
  accessorKey: "firstName",  // Key to access data
}
```

### Custom Cell Rendering

```tsx
{
  id: "status",
  header: "Status",
  accessorKey: "status",
  cell: ({ getValue, row }) => {
    const status = getValue();
    const user = row.original;

    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status}
      </Badge>
    );
  },
}
```

### Custom Data Access

```tsx
{
  id: "fullName",
  header: "Full Name",
  accessorFn: (row) => \`\${row.firstName} \${row.lastName}\`,
}
```

### Actions Column

```tsx
{
  id: "actions",
  header: "",
  width: "100px",
  cell: ({ row }) => {
    const item = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
}
```

## Props

| Prop                | Type                                     | Default     | Description                                           |
| ------------------- | ---------------------------------------- | ----------- | ----------------------------------------------------- |
| `data`              | `T[]`                                    | -           | Array of data objects                                 |
| `columns`           | `ColumnDef<T>[]`                         | -           | Column definitions                                    |
| `searchPlaceholder` | `string`                                 | "Search..." | Placeholder text for search input                     |
| `searchKeys`        | `(keyof T)[]`                            | -           | Keys to search (if not provided, searches all fields) |
| `pageSize`          | `number`                                 | 10          | Number of rows per page                               |
| `onRowClick`        | `(row: T) => void`                       | -           | Handler for row clicks                                |
| `onRowKeyDown`      | `(row: T, event: KeyboardEvent) => void` | -           | Handler for row keyboard events                       |
| `onRowMouseEnter`   | `(row: T) => void`                       | -           | Handler for row mouse enter (useful for prefetching)  |
| `rowClassName`      | `string \| ((row: T) => string)`         | ""          | CSS class for rows                                    |
| `enablePagination`  | `boolean`                                | true        | Enable/disable pagination                             |
| `enableSearch`      | `boolean`                                | true        | Enable/disable search                                 |

## Advanced Examples

### With Row Interactions

```tsx
<DataTable
  data={clients}
  columns={clientColumns}
  onRowClick={(client) => navigate(\`/clients/\${client.id}\`)}
  onRowMouseEnter={(client) => {
    // Prefetch data for better UX
    queryClient.prefetchQuery(['client', client.id]);
  }}
  rowClassName="hover:bg-muted/50 cursor-pointer"
/>
```

### With Conditional Styling

```tsx
<DataTable
  data={users}
  columns={userColumns}
  rowClassName={(user) =>
    user.status === "inactive"
      ? "opacity-50"
      : user.role === "admin"
        ? "border-l-4 border-l-red-500"
        : ""
  }
/>
```

### Large Dataset (Disable Features)

```tsx
<DataTable
  data={largeDataset}
  columns={columns}
  pageSize={50}
  enableSearch={false} // Disable for performance
  enablePagination={true}
/>
```

## File Structure

When using this pattern, organize your files like this:

```
features/
  clients/
    components/
      client-columns.tsx    # Column definitions
      client-table.tsx      # Table component using DataTable
    types.ts
    service.tsx
```

This keeps your column definitions separate and reusable across different table implementations.
