import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem, PatientBalanceTransaction } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronsDown, ChevronsUp, PenBox } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inicio', href: '/dashboard' },
  { title: 'Listado de Pacientes', href: '/patients' },
  { title: 'Ver', href: '#' },
];

// Define columnas para patient_balance_transactions
const balanceTransactionColumns = [
  {
    header: 'Fecha',
    accessorKey: 'created_at',
    cell: (info: any) => format(parseISO(info.getValue()), 'yyyy-MM-dd HH:mm'),
  },
  {
    header: 'Tipo',
    accessorKey: 'type',
  },
  {
    header: 'Monto',
    accessorKey: 'amount',
    cell: (info: any) => `$${parseFloat(info.getValue()).toFixed(2)}`,
  },
  {
    header: 'Descripción',
    accessorKey: 'description',
    cell: (info: any) => (
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {info.getValue()}
      </div>
    ),
  },
];


export default function ShowBalanceTransactions({ patient }: { patient: Patient }) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const transactions: PatientBalanceTransaction[] = patient.patient_balance_transactions || [];

  // Filtrar por rango de fecha
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (!startDate && !endDate) return true;

      const txDate = parseISO(tx.created_at);
      const formattedTxDate = format(txDate, 'yyyy-MM-dd');

      if (startDate && endDate) {
        return formattedTxDate >= startDate && formattedTxDate <= endDate;
      } else if (startDate) {
        return formattedTxDate >= startDate;
      } else if (endDate) {
        return formattedTxDate <= endDate;
      }
      return true;
    });
  }, [transactions, startDate, endDate]);

  return (
    <ContentLayout breadcrumbs={breadcrumbs}>
      <Head title="Transacciones de Balance" />
      <Heading title={`${patient.name} ${patient.lastname}`} description="Transacciones de balance del paciente">
        <Button asChild>
          <Link className="btn btn-primary" href={route('patients.edit', [patient])}>
            <PenBox />
            Actualizar paciente
          </Link>
        </Button>
      </Heading>

      <div className="mt-4 space-y-4">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="w-full space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4 bg-gray-100 p-3 rounded-md">
            <h4 className="text-sm font-semibold">Filtros de Transacciones</h4>
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

          <CollapsibleContent>
            <div className="flex flex-wrap gap-4 items-center px-4 py-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="startDate">Desde:</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="endDate">Hasta:</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>

              <Button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                variant={'outline'}
              >
                Limpiar filtros
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <DataTable columns={balanceTransactionColumns} data={filteredTransactions} />
      </div>
    </ContentLayout>
  );
}
