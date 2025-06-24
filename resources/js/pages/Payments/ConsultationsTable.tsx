import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Consultation, CreatePaymentFormData } from "@/types";

export default function ConsultationsTable({
  pendingConsultations,
  data,
  toggleConsultationSelection,
}: {
  pendingConsultations: Consultation[];
  data: CreatePaymentFormData;
  toggleConsultationSelection: (id: number) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Seleccionar</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingConsultations.map((consultation) => {
          const amountNumber = parseFloat(consultation.amount as unknown as string);
          const displayAmount = !isNaN(amountNumber) ? amountNumber.toFixed(2) : "0.00";
          const isChecked = data.consultation_ids.includes(consultation.id);

          return (
            <TableRow key={consultation.id} className="cursor-pointer">
              <TableCell className="w-12">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleConsultationSelection(consultation.id)}
                  className="cursor-pointer"
                />
              </TableCell>
              <TableCell>#{consultation.id}</TableCell>
              <TableCell>{new Date(consultation.scheduled_at).toLocaleDateString()}</TableCell>
              <TableCell>${displayAmount}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
