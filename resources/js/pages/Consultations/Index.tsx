import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import { Consultation, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';
import React, { useState, useEffect } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronsDown, ChevronsUp } from "lucide-react";
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

export default function Index({ consultations, filters }: { consultations: Consultation[], filters: any }) {
  const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || 'all');
  const [consultationType, setConsultationType] = useState(filters.consultation_type || 'all');
  const [startDate, setStartDate] = useState(filters.start_date || '');
  const [endDate, setEndDate] = useState(filters.end_date || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Función para refrescar datos desde Laravel cuando cambien los filtros
  const refreshData = () => {
    router.get(route('consultations.index'), {
      payment_status: paymentStatus,
      consultation_type: consultationType,
      start_date: startDate,
      end_date: endDate,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };

  // Escuchamos cambios en los filtros para refrescar
  useEffect(() => {
    if (
      paymentStatus !== (filters.payment_status || 'all') ||
      consultationType !== (filters.consultation_type || 'all') ||
      startDate !== (filters.start_date || '') ||
      endDate !== (filters.end_date || '')
    ) {
      refreshData();
    }
  }, [paymentStatus, consultationType, startDate, endDate]);

  return (
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

        {/* Filtros colapsables (ORIGINALES) */}
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
                    <option value="pagado">Pagadas</option>
                    <option value="pendiente">Pendientes</option>
                  </select>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Tipo de asistencia</Label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="all">Todos</option>
                    <option value="domiciliaria">Domiciliaria</option>
                    <option value="consultorio">Consultorio</option>
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
            data={consultations}
          />
        </div>
      </ContentLayout>
  );
}
