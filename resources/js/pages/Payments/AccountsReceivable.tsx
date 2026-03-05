import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { PatientSubscription, Payment, type BreadcrumbItem, Patient } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columnsAccountsReceivable } from './columnsAccount';
import { columnsAccountsReceivableSubscription } from './columnsAccountSubscription';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import React, { useMemo } from 'react';
import { ColumnDef } from "@tanstack/react-table";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/dashboard',
  },
  {
    title: 'Lista de Pagos',
    href: '/payments',
  },
  {
    title: 'Cuentas por cobrar',
    href: '/payments/accounts-receivable',
  },
];

// Tipo para la deuda consolidada por paciente
type PatientDebt = {
  patient: Patient;
  totalDebt: number;
  payments: Payment[];
  subscriptions: PatientSubscription[];
};

// Función auxiliar para extraer el paciente de un pago (puede venir en payment.patient o en payment.consultations[0].patient)
const getPatientFromPayment = (payment: Payment): Patient | undefined => {
  if (payment.patient) return payment.patient;
  if (payment.consultations && payment.consultations.length > 0) {
    return payment.consultations[0].patient;
  }
  return undefined;
};

// Componente de diálogo que muestra los detalles de las deudas de un paciente usando Tabs
function PatientDebtDialog({ 
  patient, 
  payments, 
  subscriptions, 
  children 
}: { 
  patient: Patient; 
  payments: Payment[]; 
  subscriptions: PatientSubscription[]; 
  children: React.ReactNode;
}) {
  // Calcular total para mostrarlo en el título
  const totalInDialog = useMemo(() => {
    const paymentsTotal = payments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
    const subsTotal = subscriptions.reduce((acc, s) => acc + parseFloat(s.subscription?.price || '0'), 0);
    return paymentsTotal + subsTotal;
  }, [payments, subscriptions]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Deudas de {patient.name} {patient.lastname} - Total: {totalInDialog.toFixed(2)}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="consultas" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="consultas">Consultas pendientes</TabsTrigger>
            <TabsTrigger value="suscripciones">Suscripciones pendientes</TabsTrigger>
          </TabsList>

          <TabsContent value="consultas" className="mt-4">
            {payments.length > 0 ? (
              <DataTable columns={columnsAccountsReceivable} data={payments} />
            ) : (
              <p className="text-sm text-gray-500">No tiene consultas pendientes.</p>
            )}
          </TabsContent>

          <TabsContent value="suscripciones" className="mt-4">
            {subscriptions.length > 0 ? (
              <DataTable columns={columnsAccountsReceivableSubscription} data={subscriptions} />
            ) : (
              <p className="text-sm text-gray-500">No tiene suscripciones pendientes.</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Columnas para la tabla consolidada
const consolidatedColumns: ColumnDef<PatientDebt>[] = [
  {
    accessorKey: "patient.identification",
    header: "C.I",
    cell: ({ row }) => (
      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
        {row.original.patient.identification}
      </p>
    ),
  },
  {
    accessorKey: "patient.name",
    header: "Paciente",
    cell: ({ row }) => {
      const { patient, payments, subscriptions } = row.original;
      return (
        <PatientDebtDialog 
          patient={patient} 
          payments={payments} 
          subscriptions={subscriptions}
        >
          <Button variant="link" className="p-0 h-auto font-medium text-gray-900 dark:text-gray-50">
            {patient.name} {patient.lastname}
          </Button>
        </PatientDebtDialog>
      );
    },
  },
  {
    id: "totalDebt",
    header: "Deuda total",
    accessorFn: (row) => row.totalDebt,
    cell: ({ row }) => {
      const amount = row.original.totalDebt;
      const formatted = new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return <span className="font-semibold">{formatted}</span>;
    },
  },
  {
    id: "breakdown",
    header: "Total por tipo",
    cell: ({ row }) => {
      const { payments, subscriptions } = row.original;
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {payments.length > 0 && <Badge variant="outline" className="mr-1">{payments.length} consulta(s)</Badge>}
          {subscriptions.length > 0 && <Badge variant="outline">{subscriptions.length} suscripción(es)</Badge>}
        </div>
      );
    },
  },
];

export default function AccountsReceivable({ payments, subscriptions }: { payments: Payment[], subscriptions: PatientSubscription[] }) {
  // Calcular deuda total por paciente (solo pendientes)
  const patientDebts = useMemo(() => {
    const debtMap = new Map<number, PatientDebt>();

    // Procesar pagos de consultas pendientes
    payments.forEach(payment => {
      if (payment.payment_status !== 'pendiente') return;
      
      const patient = getPatientFromPayment(payment);
      if (!patient) return; // No se pudo determinar el paciente, omitir

      const patientId = patient.id;
      const current = debtMap.get(patientId) || { 
        patient, 
        totalDebt: 0, 
        payments: [], 
        subscriptions: [] 
      };
      
      current.totalDebt += parseFloat(payment.amount);
      current.payments.push(payment);
      debtMap.set(patientId, current);
    });

    // Procesar suscripciones pendientes
    subscriptions.forEach(sub => {
      if (sub.payment_status !== 'pendiente' || !sub.patient) return;

      const patient = sub.patient;
      const patientId = patient.id;
      const current = debtMap.get(patientId) || { 
        patient, 
        totalDebt: 0, 
        payments: [], 
        subscriptions: [] 
      };
      
      current.totalDebt += parseFloat(sub.subscription?.price || '0');
      current.subscriptions.push(sub);
      debtMap.set(patientId, current);
    });

    return Array.from(debtMap.values());
  }, [payments, subscriptions]);

  return (
    <ContentLayout breadcrumbs={breadcrumbs}>
      <Head title="Cuentas por cobrar" />
      <div className="flex justify-between items-center">
        <Heading
          title="Cuentas por cobrar consolidadas"
          description="Deuda total por paciente (consultas + suscripciones)"
        />
        <Button asChild>
          <Link href={route('payments.create')}>
            Registrar Pago
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <DataTable
          columns={consolidatedColumns}
          data={patientDebts}
        />
      </div>
    </ContentLayout>
  );
}