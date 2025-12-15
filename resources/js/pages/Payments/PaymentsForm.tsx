import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from 'react-select';
import { Consultation, CreatePaymentFormData, Patient, PaymentMethod, Subscription } from "@/types";
import { useEffect, useState } from 'react';
import ConsultationsTable from "./ConsultationsTable";
import SubscriptionsTable from "./SubscriptionsTable";

type PaymentsFormProps = {
  data: CreatePaymentFormData;
  patients: Patient[];
  paymentMethods: PaymentMethod[];
  consultations: Consultation[]; 
  initialSelectedConsultationIds?: number[];
  setData: (key: string, value: any) => void;
  errors: {
    patient_id?: string;
    consultation_ids?: string;
    subscription_ids?: string;
    payment_method_id?: string;
    amount?: string;
    status?: string;
    reference?: string;
    notes?: string;
  };
};

export default function PaymentsForm({ data, patients = [], paymentMethods, consultations = [], initialSelectedConsultationIds = [], setData, errors }: PaymentsFormProps) {

  // --- 1. Inicialización de Estados ---
  
  const initialPaymentType = (data.consultation_ids?.length || 0) > 0 
    ? 'consulta' 
    : ((data.subscription_ids?.length || 0) > 0 ? 'suscripcion' : 'consulta');

  const [pendingItems, setPendingItems] = useState<(Consultation | Subscription)[]>([]);
  const [paymentType, setPaymentType] = useState<'consulta' | 'suscripcion'>(initialPaymentType);

  // --- 2. Opciones de Select ---

  const patientOptions = Array.isArray(patients) ? patients.map(patient => ({
    value: Number(patient.id),
    label: `${patient.name} ${patient.lastname} ( C.I: ${patient.identification} )`
  })) : [];

  const paymentMethodOptions = paymentMethods.map(method => ({
    value: method.id,
    label: method.name
  }));

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'parcial', label: 'Parcial' },
    { value: 'pagado', label: 'Pagado' },
    { value: 'incobrable', label: 'Incobrable' },
    { value: 'reembolsado', label: 'Reembolsado' },
  ];

  // --- 3. Handlers de Eventos ---

  const handleItemSelection = (itemId: number) => {
    let newSelection;
    let dataKey: 'consultation_ids' | 'subscription_ids';

    if (paymentType === 'consulta') {
      newSelection = [...(data.consultation_ids || [])];
      dataKey = 'consultation_ids';
      setData('subscription_ids', []);
    } else {
      newSelection = [...(data.subscription_ids || [])];
      dataKey = 'subscription_ids';
      setData('consultation_ids', []);
    }

    if (newSelection.includes(itemId)) {
      newSelection = newSelection.filter(id => id !== itemId);
    } else {
      newSelection.push(itemId);
    }

    setData(dataKey, newSelection);

    // Recalcular el monto total
    const selectedItems = pendingItems.filter(item => newSelection.includes(item.id));
    const totalAmount = selectedItems.reduce((total, item) => {
      let amount = 0;

      if (paymentType === 'consulta') {
        const amountNum = typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount));
        const amountPaidNum = typeof item.amount_paid === 'number' ? item.amount_paid : parseFloat(String(item.amount_paid || 0));
        amount = (amountNum - (amountPaidNum || 0)) || 0;
      } else {
        const subscription = item as Subscription;
        if (subscription.subscription && subscription.subscription.price !== undefined) {
          amount = typeof subscription.subscription.price === 'number'
            ? subscription.subscription.price
            : parseFloat(String(subscription.subscription.price));
        }
      }

      return total + (isNaN(amount) ? 0 : amount);
    }, 0);

    setData('amount', totalAmount);
  };

  const handlePatientChange = (selectedOption: { value: number; label: string } | null) => {
    const patientId = selectedOption ? selectedOption.value : null;
    setData('patient_id', patientId);
    setData('consultation_ids', []);
    setData('subscription_ids', []);
    setData('amount', 0);
  };

  // --- 4. useEffects para Lógica Dinámica ---

  useEffect(() => {
    setData('payment_type', paymentType);
  }, [paymentType]);

  // Manejar el cambio de paciente o tipo de pago para filtrar items
  useEffect(() => {
    const currentPatientId = data.patient_id;

    // A. Asegurarse de que los IDs seleccionados son NÚMEROS para la comparación
    const selectedConsultationIds = new Set<number>(
        (data.consultation_ids || []).map(id => Number(id))
    );
    const selectedSubscriptionIds = new Set<number>(
        (data.subscription_ids || []).map(id => Number(id))
    );

    if (currentPatientId) {
      const patient = patients.find(p => p.id === currentPatientId);
      let filteredItems: (Consultation | Subscription)[] = [];

      if (paymentType === 'consulta') {
        
        // B. Lógica de inclusión: Muestra consultas pendientes O las consultas seleccionadas para este pago
        const filteredConsultations = consultations
            .filter(c => c.patient_id === currentPatientId)
            .filter(c => {
                // Si ya está seleccionada para este pago, se incluye
                const isSelectedForThisPayment = selectedConsultationIds.has(c.id);
                
                // Si su estado es "pagado" pero NO es la seleccionada, se excluye
                const isPending = c.payment_status !== "pagado"; 

                return isPending || isSelectedForThisPayment;
            });

        filteredItems = filteredConsultations;
        
      } else if (paymentType === 'suscripcion') {
        
        const subscriptions = patient?.subscriptions || [];
        
        // Incluir suscripciones que están pendientes o que ya están seleccionadas en este pago.
        const filteredSubscriptions = subscriptions.filter(
          s => s.payment_status !== "pagado" || selectedSubscriptionIds.has(s.id)
        );
        filteredItems = filteredSubscriptions;
      }
      
      setPendingItems(filteredItems);

    } else {
      setPendingItems([]);
    }
  }, [
    data.patient_id, 
    consultations, 
    paymentType, 
    patients,
    data.consultation_ids, 
    data.subscription_ids
  ]);

  // --- 5. Renderizado ---

  const selectedPatientOption = patientOptions.find(option => option.value === Number(data.patient_id)) || null;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="status" className="mb-2 block font-semibold text-gray-700">Estado del pago</Label>
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
      </div>

      <div>
        <Label htmlFor="reference">Referencia (opcional)</Label>
        <Input
          id="reference"
          type="text"
          name="reference"
          value={data.reference}
          className="mt-1 block w-full"
          onChange={e => setData('reference', e.target.value)}
        />
        <Label htmlFor="reference" className='text-gray-500 text-sm'>Coloque número de referencia del pago.</Label>
        <InputError message={errors.reference} className="mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {patientOptions.length > 0 && (
          <div>
            <Label htmlFor="patient_id" className="mb-2 block font-semibold text-gray-700">Paciente</Label>
            <Select
              id="patient_id"
              options={patientOptions}
              value={selectedPatientOption}
              onChange={handlePatientChange}
              isSearchable
              placeholder="Selecciona un paciente..."
              className="rounded-md"
            />
            <InputError message={errors.patient_id} />
          </div>
        )}
        <div>
          <Label htmlFor="payment_type" className="mb-2 block font-semibold text-gray-700">Tipo de Pago</Label>
          <Select
            id="payment_type"
            options={[
              { value: 'consulta', label: 'Consulta' },
              { value: 'suscripcion', label: 'Funcional' },
            ]}
            value={{ value: paymentType, label: paymentType === 'consulta' ? 'Consulta' : 'Funcional' }}
            onChange={(selectedOption) => {
              setPaymentType(selectedOption?.value as 'consulta' | 'suscripcion');
              setData('consultation_ids', []);
              setData('subscription_ids', []);
              setData('amount', 0);
            }}
            isSearchable
            placeholder="Selecciona un tipo de pago..."
            className="rounded-md"
          />
        </div>

      </div>


      {paymentType === 'consulta' && (
        <div className="mb-4">
          <Label className="mb-2 block font-semibold text-gray-700">
            Consultas pendientes a pagar
          </Label>
          {pendingItems.length > 0 ? (
            <ConsultationsTable
              pendingConsultations={pendingItems as Consultation[]}
              data={data}
              toggleConsultationSelection={handleItemSelection}
              initialSelectedConsultationIds={initialSelectedConsultationIds}
            />
          ) : (
            <div className="text-gray-500 text-sm mt-2">
              No hay consultas pendientes de pago para este paciente.
            </div>
          )}
          <InputError message={errors.consultation_ids} />
        </div>
      )}

      {paymentType === 'suscripcion' && (
        <div className="mb-4">
          <Label className="mb-2 block font-semibold text-gray-700">
            Funcionales pendientes a pagar
          </Label>
          {pendingItems.length > 0 ? (
            <SubscriptionsTable
              pendingSubscriptions={pendingItems as Subscription[]}
              data={data}
              toggleSubscriptionSelection={handleItemSelection}
            />
          ) : (
            <div className="text-gray-500 text-sm mt-2">
              No hay Funcionales pendientes de pago para este paciente.
            </div>
          )}
          <InputError message={errors.subscription_ids} />
        </div>
      )}

      <div className="text-sm text-gray-600 mt-1">
        Deuda total seleccionada: ${pendingItems
          .filter(item => {
            if (paymentType === 'consulta') {
              return data.consultation_ids.includes(item.id);
            } else {
              return data.subscription_ids.includes(item.id);
            }
          })
          .reduce((sum, item) => {
            if (paymentType === 'consulta') {
              const amountNum = typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount));
              const amountPaidNum = typeof item.amount_paid === 'number' ? item.amount_paid : parseFloat(String(item.amount_paid || 0));
              return sum + ((amountNum - (amountPaidNum || 0)) || 0);
            } else {
              return sum + ((item as Subscription).subscription?.price ?? 0);
            }
          }, 0).toFixed(2)}
      </div>

      <div>
        <Label htmlFor="amount">Monto a pagar</Label>
        <Input
          id="amount"
          type="number"
          name="amount"
          value={data.amount}
          min={0}
          step="0.01"
          className="mt-1 block w-full"
          onChange={e => {
            const val = e.target.value;
            const numericVal = val === '' ? 0 : parseFloat(val);
            if (!isNaN(numericVal) && numericVal >= 0) {
              setData('amount', numericVal);
            }
          }}
        />
        <InputError message={errors.amount} className="mt-2" />
      </div>

      <div>
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Input
          id="notes"
          type="text"
          name="notes"
          value={data.notes}
          className="mt-1 block w-full"
          onChange={e => setData('notes', e.target.value)}
        />
        <Label htmlFor="notes" className='text-gray-500 text-sm'>Notas sobre el pago.</Label>
        <InputError message={errors.notes} className="mt-2" />
      </div>
    </div>
  );
}