import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { PatientSubscription, Payment, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columnsAccountsReceivable } from './columnsAccount';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React, { useState } from 'react';
import { columnsAccountsReceivableSubscription } from './columnsAccountSubscription';

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

export default function AccountsReceivable({ payments, subscriptions }: { payments: Payment[], subscriptions: PatientSubscription[] }) {
  console.log(subscriptions);
  const [activeTab, setActiveTab] = useState('consultas');

  // Preparar datos para tabla de suscripciones: agregar nombre completo del paciente
  const subscriptionTableData = subscriptions.map(sub => ({
    ...sub,
    patientName: `${sub.patient?.name} ${sub.patient?.lastname}`,
    subscriptionName: sub.subscription?.name || '',
  }));

  // Preparar datos para tabla de pagos (consultas): agregar nombre completo del paciente
  const paymentTableData = payments.map(payment => ({
  ...payment,
  patientName: payment.consultations?.length > 0
    ? `${payment.consultations?.[0].patient?.name} ${payment.consultations?.[0].patient?.lastname}`
    : 'Paciente no disponible',
}));


  return (
    <ContentLayout breadcrumbs={breadcrumbs}>
      <Head title="Cuentas por cobrar" />
      <div className="flex justify-between items-center">
        <Heading
          title="Cuentas por cobrar"
          description="Gestión de todas las cuentas por cobrar"
        />

        <Button asChild>
          <Link href={route('payments.create')}>
            Registrar Pago
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="consultas">Consultas sin pagar</TabsTrigger>
          <TabsTrigger value="suscripciones">Suscripciones sin pagar</TabsTrigger>
        </TabsList>

        <TabsContent value="consultas">
          <DataTable
            columns={columnsAccountsReceivable}
            data={paymentTableData}
          />
        </TabsContent>

        <TabsContent value="suscripciones">
          <DataTable
            columns={columnsAccountsReceivableSubscription}
            data={subscriptionTableData}
          />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
