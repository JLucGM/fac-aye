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
import { MoreHorizontal } from "lucide-react";
import { Link } from "@inertiajs/react";
// Asegúrate de que este tipo 'Payment' esté correctamente definido
import { Payment } from "@/types"; 
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// --- ⚙️ LÓGICA DE COLOR PARA EL BADGE ---

// 1. Mapeo de estados a clases de color de Tailwind CSS
const statusColors = {
  // Estado Pendiente (Amarillo)
  pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700/50 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600",
  // Estado Parcial (Azul claro/Cian)
  parcial: "bg-sky-100 text-sky-800 dark:bg-sky-700/50 dark:text-sky-100 border-sky-300 dark:border-sky-600",
  // Estado Pagado (Verde)
  pagado: "bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-100 border-green-300 dark:border-green-600",
  // Estado Incobrable (Rojo/Destructive)
  incobrable: "bg-red-100 text-red-800 dark:bg-red-700/50 dark:text-red-100 border-red-300 dark:border-red-600",
  // Estado Reembolsado (Púrpura/Violeta)
  reembolsado: "bg-purple-100 text-purple-800 dark:bg-purple-700/50 dark:text-purple-100 border-purple-300 dark:border-purple-600",
  // Color por defecto (Gris)
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border-gray-300 dark:border-gray-600",
};

// 2. Función de ayuda para obtener las clases de color
const getStatusColor = (status: string | null | undefined): string => {
  // Asegúrate de normalizar el estado a minúsculas para la búsqueda
  const lowerStatus = status?.toLowerCase();
  return statusColors[lowerStatus as keyof typeof statusColors] || statusColors.default;
};

// --- 💾 DEFINICIÓN DE COLUMNAS ---

export const columns: ColumnDef<Payment>[] = [
  // Columna 'created_at'
  {
    accessorKey: "created_at",
    header: "Creado",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleString();
    },
  },
  // Columna 'reference'
  {
    accessorKey: "reference",
    header: "Referencia",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.reference || "N/A"}
        </p>
      );
    },
  },
  // Columna 'payment_method_id'
  {
    accessorKey: "payment_method_id",
    header: "Método de pago",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.payment_method?.name}
        </p>
      );
    },
  },
  // Columna 'patientName'
  {
    accessorKey: "patientName", // Nueva columna para el nombre del paciente
    header: "Paciente",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.patientName || "Sin paciente"}
        </p>
      );
    },
  },
  // Columna 'amount'
  {
    accessorKey: "amount",
    header: "Monto",
  },
  // 🟢 Columna 'status' con color dinámico
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      
      // Obtiene las clases de color dinámicas
      const badgeColorClasses = getStatusColor(status); 
      
      // Clases base + Clases dinámicas de color
      // Usamos 'variant="outline"' para mantener la estructura base del Badge
      // y las clases dinámicas anulan el color.
      const combinedClasses = `capitalize text-sm font-medium ${badgeColorClasses}`;

      return (
        <Badge className={combinedClasses} variant="outline">
          {status || "Sin estado"}
        </Badge>
      );
    },
  },
  // Columna 'actions'
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
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payments.show', [row.original.id])}>
                Mostrar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payments.edit', [row.original.id])}>
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payments.destroy', [row.original.id])} method="delete">
                Eliminar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];