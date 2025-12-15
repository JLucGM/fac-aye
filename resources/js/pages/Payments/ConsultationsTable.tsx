import React from 'react';
import { Consultation, CreatePaymentFormData } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@headlessui/react';

type ConsultationsTableProps = {
  pendingConsultations: Consultation[];
  data: CreatePaymentFormData;
  initialSelectedConsultationIds: number[];
  toggleConsultationSelection: (id: number) => void;
};

export default function ConsultationsTable({ pendingConsultations, data, toggleConsultationSelection, initialSelectedConsultationIds }: ConsultationsTableProps) {
  const lockedIds = new Set(initialSelectedConsultationIds);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/12"></TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Monto Total</TableHead>
          <TableHead>Monto Pagado</TableHead>
          <TableHead>Saldo Pendiente</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingConsultations.map(consultation => {
          const amount = typeof consultation.amount === 'number' ? consultation.amount : parseFloat(String(consultation.amount));
          const amountPaid = typeof consultation.amount_paid === 'number' ? consultation.amount_paid : parseFloat(String(consultation.amount_paid || '0'));
          const pendingAmount = amount - amountPaid;
          const isLocked = lockedIds.has(consultation.id);
          return (
            <TableRow key={consultation.id} className="hover:bg-gray-50 transition-colors">
              <TableCell>
                <Input
                  type="checkbox"
                  checked={data.consultation_ids?.includes(consultation.id) || false}
                  // El evento de cambio solo se ejecuta si NO está bloqueado
                  onChange={() => {
                    if (!isLocked) {
                      toggleConsultationSelection(consultation.id);
                    }
                  }}
                  // --- ATRIBUTO DISABLED APLICADO AQUÍ ---
                  disabled={isLocked}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded-md transition duration-150 ease-in-out"
                />
                {/* Opcional: Mostrar un ícono si está bloqueado para mejor UX */}
                {isLocked && <span className="ml-2 text-red-500" title="Consulta bloqueada por ser parte de este pago"></span>}
              </TableCell>
              <TableCell>{consultation.services ? JSON.parse(consultation.services).map((s: any) => s.name).join(', ') : `Asistencia #${consultation.id}`}</TableCell>
              <TableCell>{amount.toFixed(2)}</TableCell>
              <TableCell>{amountPaid.toFixed(2)}</TableCell>
              <TableCell>{pendingAmount.toFixed(2)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
