import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from 'react-select';
import { Consultation, Patient, Payment, PaymentMethod } from "@/types";
import { useEffect, useState } from 'react';

type PaymentsFormProps = {
  data: Payment;
  patients: Patient[];
  paymentMethods: PaymentMethod[];
  consultations: Consultation[];
  setData: (key: string, value: any) => void;
  errors: {
    patient_id?: string;
    consultation_ids?: string;
    payment_method_id?: string;
    amount?: string;
    status?: string;
    reference?: string;
    notes?: string;
    paid_at?: string;
  };
};

export default function PaymentsForm({ data, patients, paymentMethods, consultations, setData, errors }: PaymentsFormProps) {
  const [pendingConsultations, setPendingConsultations] = useState<Consultation[]>([]);

  const patientOptions = patients.map(patient => ({
    value: patient.id,
    label: `${patient.name} ${patient.lastname} (C.I: ${patient.identification})`
  }));

  const paymentMethodOptions = paymentMethods.map(method => ({
    value: method.id,
    label: method.name
  }));

  const statusOptions = [
    { value: 'earring', label: 'pendiente' },
    { value: 'completed', label: 'completado' },
    { value: 'cancelled', label: 'cancelado' },
  ];

  const handlePatientChange = (selectedOption: { value: number; label: string } | null) => {
    setData('patient_id', selectedOption ? selectedOption.value : null);
    if (selectedOption) {
      const filtered = consultations.filter(
        c =>
          c.patient_id === selectedOption.value &&
          c.payment_status !== "paid"
      );
      setPendingConsultations(filtered);
      setData('consultation_ids', []);
      setData('amount', 0);
    } else {
      setPendingConsultations([]);
      setData('consultation_ids', []);
      setData('amount', 0);
    }
  };

  const toggleConsultationSelection = (consultationId: number) => {
    let newSelection = [...data.consultation_ids];
    if (newSelection.includes(consultationId)) {
      newSelection = newSelection.filter(id => id !== consultationId);
    } else {
      newSelection.push(consultationId);
    }
    setData('consultation_ids', newSelection);

    const selectedConsultations = pendingConsultations.filter(c => newSelection.includes(c.id));
    const totalAmount = selectedConsultations.reduce((total, c) => {
      const amt = c.amount !== undefined ? parseFloat(c.amount) : 0; // Asegúrate de que amount sea un número
      return total + (isNaN(amt) ? 0 : amt);
    }, 0);

    setData('amount', totalAmount);
  };

  useEffect(() => {
    if (data.patient_id) {
        const filtered = consultations.filter(
            c => c.patient_id === data.patient_id && c.payment_status !== "paid"
        );
        setPendingConsultations(filtered);
    }
}, [data.patient_id, consultations]);

  return (
    <>
      <div>
        <Label htmlFor="patient_id" className="mb-2 block font-semibold text-gray-700">Buscar Paciente</Label>
        <Select
          id="patient_id"
          options={patientOptions}
          value={patientOptions.find(option => option.value === data.patient_id) || null}
          onChange={handlePatientChange}
          isSearchable
          placeholder="Selecciona un paciente..."
          className="rounded-md"
        />
        <InputError message={errors.patient_id} />
      </div>

      <div className="mb-4">
        <Label className="mb-2 block font-semibold text-gray-700">
          Consultas pendientes a pagar
        </Label>
        {pendingConsultations.length === 0 && (
          <p className="text-gray-500">No hay consultas pendientes para este paciente.</p>
        )}
        {pendingConsultations.map(consultation => (
          <div key={consultation.id} className="flex items-center mb-1">
            <input
              id={`consultation-${consultation.id}`}
              type="checkbox"
              checked={data.consultation_ids.includes(consultation.id)}
              onChange={() => toggleConsultationSelection(consultation.id)}
              className="mr-2"
            />
            <label htmlFor={`consultation-${consultation.id}`} className="cursor-pointer">
              Consulta #{consultation.id} - Fecha: {new Date(consultation.scheduled_at).toLocaleDateString()} - Monto: ${parseFloat(consultation.amount).toFixed(2)}
            </label>
          </div>
        ))}
        <InputError message={errors.consultation_ids} />
      </div>

      <div>
        <Label htmlFor="payment_method_id">Método de Pago</Label>
        <Select
          id="payment_method_id"
          options={paymentMethodOptions}
          value={paymentMethodOptions.find(option => option.value === data.payment_method_id) || null}
          onChange={selectedOption => setData('payment_method_id', selectedOption ? selectedOption.value : null)}
          isSearchable
          placeholder="Selecciona un método de pago..."
          className="rounded-md mt-1 block w-full"
        />
        <InputError message={errors.payment_method_id} className="mt-2" />
      </div>

      <div>
        <Label htmlFor="amount">Monto a pagar</Label>
        <Input
          id="amount"
          type="text"
          name="amount"
          value={data.amount ? data.amount.toFixed(2) : '0.00'}
          className="mt-1 block w-full"
          readOnly
        />
        <InputError message={errors.amount} className="mt-2" />
      </div>

      <div>
        <Label htmlFor="status" className="mb-2 block font-semibold text-gray-700">Status</Label>
        <Select
          id="status"
          options={statusOptions}
          value={statusOptions.find(option => option.value === data.status) || null}
          onChange={(selectedOption) => setData('status', selectedOption?.value ?? '')}
          isSearchable
          placeholder="Select Status..."
          className="rounded-md"
        />
        <InputError message={errors.status} />
      </div>

      <div>
        <Label htmlFor="reference">Referencia</Label>
        <Input
          id="reference"
          type="text"
          name="reference"
          value={data.reference}
          className="mt-1 block w-full"
          onChange={e => setData('reference', e.target.value)}
        />
        <InputError message={errors.reference} className="mt-2" />
      </div>

      <div>
        <Label htmlFor="notes">Notas</Label>
        <Input
          id="notes"
          type="text"
          name="notes"
          value={data.notes}
          className="mt-1 block w-full"
          onChange={e => setData('notes', e.target.value)}
        />
        <InputError message={errors.notes} className="mt-2" />
      </div>
    </>
  );
}
