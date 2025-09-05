import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import { Consultation, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronsDown, ChevronsUp, ChevronsUpDown, Filter } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/dashboard',
  },
  {
    title: 'Listado de asistencias',
    href: '/consultations',
  },
];

export default function Index({ consultations }: { consultations: Consultation[] }) {
  const [paymentStatus, setPaymentStatus] = useState<string>('all');
  const [consultationType, setConsultationType] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
console.log(consultations);
  const filteredConsultations = consultations.filter(consultation => {
    const paymentMatch = paymentStatus === 'all' || consultation.payment_status === paymentStatus;
    const typeMatch = consultationType === 'all' || consultation.consultation_type === consultationType;

    // Filtrado de fechas
    let dateMatch = true;
    if (startDate || endDate) {
      const consultationDate = parseISO(consultation.scheduled_at);
      const formattedConsultationDate = format(consultationDate, 'yyyy-MM-dd');

      if (startDate && endDate) {
        dateMatch = formattedConsultationDate >= startDate && formattedConsultationDate <= endDate;
      } else if (startDate) {
        dateMatch = formattedConsultationDate >= startDate;
      } else if (endDate) {
        dateMatch = formattedConsultationDate <= endDate;
      }
    }

    return paymentMatch && typeMatch && dateMatch;
  });

  return (
    // <AppLayout breadcrumbs={breadcrumbs}>

      <ContentLayout breadcrumbs={breadcrumbs}>
      <Head title="Listado de Asistencias" />
        <Heading
          title="Asistencias"
          description="Gestión de asistencias médicas"
        >
          <Button asChild>
            <Link href={route('consultations.create')}>
              Crear asistencia
            </Link>
          </Button>
        </Heading>

        {/* Filtros colapsables */}
        <Collapsible
          open={isFiltersOpen}
          onOpenChange={setIsFiltersOpen}
          className="w-full space-y-2 mt-4"
        >
          <div className="flex items-center justify-between space-x-4 px-4 bg-gray-100 p-3 rounded-md">
            <h4 className="text-sm font-semibold">
              Filtros de asistencias
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isFiltersOpen ? (
                  <>
                    Ocultar filtros
                    <ChevronsUp className="h-4 w-4 mr-2" />
                  </>
                ) : (
                  <>
                    Mostrar filtros
                    <ChevronsDown className="h-4 w-4 mr-2" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-1">Estado de pago</Label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="all">Todos</option>
                    <option value="paid">Pagadas</option>
                    <option value="pending">Pendientes</option>
                  </select>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Tipo de consulta</Label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="all">Todos</option>
                    <option value="domiciliary">Domicilio</option>
                    <option value="office">Oficina</option>
                  </select>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Desde</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Hasta</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPaymentStatus('all');
                    setConsultationType('all');
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredConsultations}
          />
        </div>
      </ContentLayout>
    // </AppLayout>
  );
}
