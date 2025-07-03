import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
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
import { columnsAccountsReceivable } from './columnsAccount';

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

export default function AccountsReceivable({ payments }: { payments: Payment[] }) {

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

      <DataTable
        columns={columnsAccountsReceivable}
        data={payments}
      />

    </ContentLayout>
  );
}
