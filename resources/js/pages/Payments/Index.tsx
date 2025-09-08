import Heading from '@/components/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Payment, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';
import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

export default function Index({ payments }: { payments: Payment[] }) {
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('asistencias');

  // Obtener métodos de pago únicos
  const paymentMethods = [
    ...new Set(payments.map(p => p.payment_method?.name).filter(Boolean))
  ].sort();

  // Obtener estados únicos
  const statusOptions = [
    ...new Set(payments.map(p => p.status).filter(Boolean))
  ].sort();

  // Filtrar pagos
  const filteredPayments = payments.filter(payment => {
    const methodMatch =
      selectedMethod === 'all' ||
      payment.payment_method?.name === selectedMethod;

    const statusMatch =
      selectedStatus === 'all' ||
      payment.status === selectedStatus;

    // Filtrado de fechas
    let dateMatch = true;
    if (startDate || endDate) {
      const paymentDate = payment.created_at ? parseISO(payment.created_at) : null;
      const formattedDate = paymentDate ? format(paymentDate, 'yyyy-MM-dd') : null;

      if (formattedDate) {
        if (startDate && endDate) {
          dateMatch = formattedDate >= startDate && formattedDate <= endDate;
        } else if (startDate) {
          dateMatch = formattedDate >= startDate;
        } else if (endDate) {
          dateMatch = formattedDate <= endDate;
        }
      } else {
        dateMatch = false;
      }
    }

    return methodMatch && statusMatch && dateMatch;
  });

  // Filtrar pagos de asistencia y funcional
  const consultationPayments = filteredPayments.filter(payment => payment.consultations.length > 0);
  const subscriptionPayments = filteredPayments.filter(payment => payment.patient_subscriptions.length > 0);

  // Función para obtener el nombre del paciente desde cualquier tipo de pago
  const getPatientName = (payment: Payment) => {
    if (payment.consultations.length > 0) {
      return `${payment.consultations[0].patient.name} ${payment.consultations[0].patient.lastname}`;
    } else if (payment.patient_subscriptions.length > 0) {
      return `${payment.patient_subscriptions[0].patient.name} ${payment.patient_subscriptions[0].patient.lastname}`;
    }
    return 'Paciente no disponible';
  };

  // Preparar datos para la tabla con la información del paciente incluida
  const consultationTableData = consultationPayments.map(payment => ({
    ...payment,
    patientName: getPatientName(payment)
  }));

  const subscriptionTableData = subscriptionPayments.map(payment => ({
    ...payment,
    patientName: getPatientName(payment)
  }));

  return (
    <ContentLayout breadcrumbs={breadcrumbs}>
      <Head title="Lista de Pagos" />
      <div className="flex justify-between items-center">
        <Heading
          title="Lista de Pagos"
          description="Gestión de todos los pagos registrados"
        />

        <div className="flex gap-4 items-center">
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

      {/* Filtros colapsables */}
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
          <div className="rounded-md border px-4 py-3 text-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Método de pago */}
              <div>
                <Label className="block text-sm font-medium mb-1">Método de pago</Label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="all">Todos los métodos</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div>
                <Label className="block text-sm font-medium mb-1">Estado</Label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="all">Todos los estados</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fechas */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">Desde</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border rounded p-2"
                      max={endDate || undefined}
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">Hasta</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || undefined}
                      className="w-full border rounded p-2"
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
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Tabs para separar pagos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="asistencias">Pagos de Asistencias</TabsTrigger>
          <TabsTrigger value="funcional">Pagos de funcional</TabsTrigger>
        </TabsList>
        <TabsContent value="asistencias">
          <DataTable
            columns={columns}
            data={consultationTableData}
          />
        </TabsContent>
        <TabsContent value="funcional">
          <DataTable
            columns={columns}
            data={subscriptionTableData}
          />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
