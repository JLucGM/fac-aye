import { ColumnDef } from "@tanstack/react-table";
import { Consultation, Service } from "@/types"; // Asegúrate de que la ruta sea correcta
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Edit, MoreHorizontal } from "lucide-react";

export const consultationColumns: ColumnDef<Consultation>[] = [
  {
    accessorKey: "scheduled_at",
    header: "Fecha Programada",
    cell: ({ row }) => {
      return new Date(row.original.scheduled_at).toLocaleString();
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "consultation_type",
    header: "Tipo de Consulta",
  },
  {
    accessorKey: "payment_status",
    header: "Estado de Pago",
  },
  {
    id: "services",
    header: "Servicios",
    cell: ({ row }) => {
      const servicesData = row.original.services;

      // Verifica si servicesData es un arreglo o una cadena
      const services = Array.isArray(servicesData)
        ? servicesData
        : JSON.parse(servicesData || '[]');

      return (
        <ul>
          {services.map((service: Service) => (  // Especifica el tipo Service aquí
            <li key={service.id}>
              {service.name} - ${service.price}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
  },
  {
    id: "subscriptionInfo",
    header: "Suscripción",
    cell: ({ row }) => {
      const subscriptions = row.original.subscription; // Accede a las suscripciones
      return subscriptions && subscriptions.length > 0
        ? `${subscriptions[0].id}` // Accede a la primera suscripción
        : 'Sin suscripción';
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
            {/* <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.show', [row.original.id])}>
                <Eye /> Mostrar
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('consultations.edit', [row.original.id])}>
                <Edit /> Editar
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.destroy', [row.original.id])} method="delete">
                <Trash /> Eliminar
              </Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
        // <Link className={buttonVariants({ variant: 'outline' }) + ' w-full'} href={route('consultations.edit', [row.original.id])} >
        //   Editar
        // </Link>
      )
    },
  },
];
