import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Link } from "@inertiajs/react"
import { Payment } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export const columnsAccountsReceivable: ColumnDef<Payment>[] = [
  // {
  //     id: "select",
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     ),
      
  //   },
  {
    accessorKey: "patient.identification",
    header: "C.I",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {patient?.identification || "Sin identificación"}
        </p>
      );
    },
  },
  {
    accessorKey: "patient.name",
    header: "Paciente",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {patient?.name} {patient?.lastname}
        </p>
      );
    },
  },
  {
    accessorKey: "payment_status",
    header: "Estado de pago",
    cell: ({ row }) => {
      const paymentStatus = row.original.payment_status;

      // Mapear estados a variantes válidas
      let variant: "default" | "destructive" | "secondary" | "outline" = "default";

      if (paymentStatus === "pagado") variant = "default";       // o "secondary"
      else if (paymentStatus === "pendiente") variant = "outline";
      else if (paymentStatus === "reembolsado" || paymentStatus === "incobrable") variant = "destructive";

      return (
        <Badge variant={variant} className="capitalize">
          { paymentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuItem>
  //             <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payments.show', [row.original.id])}>
  //               Mostrar
  //             </Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>
  //             <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payments.destroy', [row.original.id])} method="delete">
  //               Eliminar
  //             </Link>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
