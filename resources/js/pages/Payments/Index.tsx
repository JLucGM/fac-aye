import Heading from '@/components/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { PaymentResource, PaginatedData, type BreadcrumbItem } from '@/types';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDebounce } from '@/hooks/use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/dashboard',
  },
  {
    title: 'Lista de Pagos',
    href: '/payments',
  },
];

interface IndexProps {
    payments: PaginatedData<PaymentResource>;
    paymentMethods: { data: { id: number, name: string }[] };
    filters: {
        search?: string;
        method?: string;
        status?: string;
        type?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function Index({ payments, paymentMethods, filters }: IndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const debouncedSearch = useDebounce(search, 500);
  const [selectedMethod, setSelectedMethod] = useState(filters.method || 'all');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [startDate, setStartDate] = useState(filters.start_date || '');
  const [endDate, setEndDate] = useState(filters.end_date || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(filters.type || 'consulta');

  const refreshData = (currentSearch: string, currentTab: string) => {
    router.get(route('payments.index'), {
      search: currentSearch,
      method: selectedMethod,
      status: selectedStatus,
      type: currentTab,
      start_date: startDate,
      end_date: endDate,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };

  useEffect(() => {
    if (
      debouncedSearch !== (filters.search || '') ||
      selectedMethod !== (filters.method || 'all') ||
      selectedStatus !== (filters.status || 'all') ||
      startDate !== (filters.start_date || '') ||
      endDate !== (filters.end_date || '')
    ) {
      refreshData(debouncedSearch, activeTab);
    }
  }, [debouncedSearch, selectedMethod, selectedStatus, startDate, endDate]);

  const handleTabChange = (value: string) => {
      setActiveTab(value);
      refreshData(debouncedSearch, value);
  };

  const statusOptions = ['pendiente', 'pagado', 'cancelado'];

  return (
    <ContentLayout breadcrumbs={breadcrumbs}>
      <Head title="Lista de Pagos" />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Heading
          title="Lista de Pagos"
          description={`Gestión de pagos filtrados`}
        />

        <div className="flex flex-wrap gap-2 items-center">
          <Link className={buttonVariants({ variant: "outline" })}
            href={route('module-operation.accounts_receivable_index')}>
            Ver Cuentas por Pagar
          </Link>

          <Button asChild>
            <Link href={route('payments.create')}>
              Registrar Pago
            </Link>
          </Button>
        </div>
      </div>

      <Collapsible
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        className="w-full space-y-2 mt-4"
      >
        <div className="flex items-center justify-between space-x-4 px-4 bg-gray-100 p-3 rounded-md">
          <h4 className="text-sm font-semibold">
            Filtros de Pagos
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
          <div className="rounded-md border px-4 py-3 text-sm space-y-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-1">Método de pago</Label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full border rounded p-2 bg-white"
                >
                  <option value="all">Todos los métodos</option>
                  {paymentMethods?.data?.map(method => (
                    <option key={method.id} value={method.name}>{method.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">Estado</Label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border rounded p-2 bg-white"
                >
                  <option value="all">Todos los estados</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">Desde</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">Hasta</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || undefined}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMethod('all');
                  setSelectedStatus('all');
                  setStartDate('');
                  setEndDate('');
                  setSearch('');
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList>
          <TabsTrigger value="consulta">Pagos de Asistencias</TabsTrigger>
          <TabsTrigger value="suscripcion">Pagos de funcional</TabsTrigger>
        </TabsList>
        <TabsContent value="consulta">
          <DataTable
            columns={columns}
            data={payments.data}
            meta={payments.meta}
            onSearch={setSearch}
            initialSearch={search}
            searchPlaceholder="Buscar por paciente..."
          />
        </TabsContent>
        <TabsContent value="suscripcion">
          <DataTable
            columns={columns}
            data={payments.data}
            meta={payments.meta}
            onSearch={setSearch}
            initialSearch={search}
            searchPlaceholder="Buscar por paciente..."
          />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
