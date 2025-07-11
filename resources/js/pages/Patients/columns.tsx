import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Patient } from "@/types";
import { Badge } from "@/components/ui/badge";

type SubscriptionStatus = 'active' | 'inactive' | 'none';

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "identification",
    header: "Cédula de identidad",
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.name} {row.original.lastname}
        </p>
      );
    },
  },
  // {
  //   accessorKey: "email",
  //   header: "Correo electrónico",
  // },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    id: "subscriptionStatus",
    header: "Estado de Suscripción",
    cell: ({ row }) => {
      const subscriptions = row.original.subscriptions || [];
      const status: SubscriptionStatus = subscriptions.length > 0 
        ? (subscriptions.some(sub => sub.status === 'active') ? 'active' : 'inactive') 
        : 'none';
      const variantMap: Record<SubscriptionStatus, "default" | "secondary" | "outline" | "destructive"> = {
        active: 'default',
        inactive: 'secondary',
        none: 'outline'
      };
      const textMap: Record<SubscriptionStatus, string> = {
        active: 'Activa',
        inactive: 'Inactiva',
        none: 'Sin suscripción'
      };
      return <Badge variant={variantMap[status]}>{textMap[status]}</Badge>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.show', [row.original.slug ?? row.original.id])}>
                <Eye /> Mostrar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.edit', [row.original.slug ?? row.original.id])}>
                <Edit /> Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.destroy', [row.original.slug ?? row.original.id])} method="delete">
                <Trash /> Eliminar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
