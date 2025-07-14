import { ColumnDef } from "@tanstack/react-table";
import { Consultation, Service } from "@/types"; // Asegúrate de que la ruta sea correcta
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

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
        <Link className={buttonVariants({ variant: 'outline' }) + ' w-full'} href={route('consultations.edit', [row.original.id])} >
          Editar
        </Link>
      )
    },
  },
];
