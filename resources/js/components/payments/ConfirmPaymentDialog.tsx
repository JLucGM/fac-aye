import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Patient, PaymentMethod, Consultation, Subscription } from '@/types';

interface ConfirmPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmButtonText: string;
    cancelButtonText?: string;
    processing?: boolean;
    type: 'create' | 'update';
    data: {
        patient_id: number | null;
        consultation_ids: number[];
        subscription_ids: number[];
        payment_method_id: number | null;
        amount: number;
        status: string;
        reference: string;
        notes: string;
        payment_type: 'consulta' | 'suscripcion';
    };
    patients: Patient[];
    paymentMethods: PaymentMethod[];
    consultations: Consultation[];
    subscriptions: Subscription[];
    selectedItems: (Consultation | Subscription)[];
}

export function ConfirmPaymentDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmButtonText,
    cancelButtonText = 'Cancelar',
    processing = false,
    type,
    data,
    patients,
    paymentMethods,
    consultations,
    subscriptions,
    selectedItems,
}: ConfirmPaymentDialogProps) {
    
    // Función para obtener el nombre del paciente
    const getPatientName = () => {
        if (!data.patient_id) return 'No seleccionado';
        const patient = patients.find(p => p.id === data.patient_id);
        return patient ? `${patient.name} ${patient.lastname}` : 'Paciente no encontrado';
    };

    // Función para obtener el método de pago
    const getPaymentMethodName = () => {
        if (!data.payment_method_id) return 'No seleccionado';
        const method = paymentMethods.find(m => m.id === data.payment_method_id);
        return method ? method.name : 'Método no encontrado';
    };

    // Función para obtener el estado del pago
    const getPaymentStatusLabel = () => {
        const statusMap: Record<string, string> = {
            'pendiente': 'Pendiente',
            'parcial': 'Parcial',
            'pagado': 'Pagado',
            'incobrable': 'Incobrable',
            'reembolsado': 'Reembolsado',
        };
        return statusMap[data.status] || data.status;
    };

    // Función para obtener detalles de las consultas seleccionadas
    const getConsultationDetails = () => {
        if (data.payment_type !== 'consulta') return [];
        return consultations.filter(consultation => 
            data.consultation_ids.includes(consultation.id)
        );
    };

    // Función para obtener detalles de las suscripciones seleccionadas
    const getSubscriptionDetails = () => {
        if (data.payment_type !== 'suscripcion') return [];
        return subscriptions.filter(subscription => 
            data.subscription_ids.includes(subscription.id)
        );
    };

    const consultationDetails = getConsultationDetails();
    const subscriptionDetails = getSubscriptionDetails();

    // Calcular el monto total de las consultas seleccionadas
    const calculateConsultationsTotal = () => {
        return consultationDetails.reduce((total, consultation) => {
            const amountNum = typeof consultation.amount === 'number' 
                ? consultation.amount 
                : parseFloat(String(consultation.amount));
            const amountPaidNum = typeof consultation.amount_paid === 'number' 
                ? consultation.amount_paid 
                : parseFloat(String(consultation.amount_paid || 0));
            return total + (amountNum - amountPaidNum);
        }, 0);
    };

    // Calcular el monto total de las suscripciones seleccionadas
    const calculateSubscriptionsTotal = () => {
        return subscriptionDetails.reduce((total, subscription) => {
            return total + (subscription.subscription?.price ?? 0);
        }, 0);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Paciente</h3>
                            <p className="text-base font-medium">{getPatientName()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Tipo de Pago</h3>
                            <p className="text-base font-medium capitalize">
                                {data.payment_type === 'consulta' ? 'Consulta' : 'Funcional'}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Método de Pago</h3>
                            <p className="text-base">{getPaymentMethodName()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Estado</h3>
                            <p className="text-base capitalize">{getPaymentStatusLabel()}</p>
                        </div>
                        
                        {/* Referencia */}
                        {data.reference && (
                            <div>
                                <h3 className="font-semibold text-sm text-gray-500">Referencia</h3>
                                <p className="text-base">{data.reference}</p>
                            </div>
                        )}

                        {/* Lista de Consultas seleccionadas */}
                        {data.payment_type === 'consulta' && consultationDetails.length > 0 && (
                            <div className="col-span-2">
                                <h3 className="font-semibold text-sm text-gray-500 mb-2">Consultas a Pagar</h3>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <ul className="space-y-2">
                                        {consultationDetails.map((consultation) => (
                                            <li key={consultation.id} className="flex justify-between items-center py-1">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                    <div>
                                                        <span className="text-base font-medium">
                                                            Consulta #{consultation.id}
                                                        </span>
                                                        <div className="text-sm text-gray-500">
                                                            {consultation.consultation_type === 'consultorio' ? 'Consultorio' : 'Domiciliaria'} • 
                                                            Monto: ${typeof consultation.amount === 'number' ? consultation.amount : consultation.amount}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium text-gray-700">
                                                        ${(typeof consultation.amount === 'number' 
                                                            ? consultation.amount 
                                                            : parseFloat(String(consultation.amount)))}
                                                    </div>
                                                    {consultation.amount_paid > 0 && (
                                                        <div className="text-sm text-gray-500">
                                                            Pagado: ${consultation.amount_paid}
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    {consultationDetails.length > 1 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                            <span className="font-medium">Total a pagar:</span>
                                            <span className="font-bold text-lg">
                                                ${calculateConsultationsTotal()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Lista de Suscripciones seleccionadas */}
                        {data.payment_type === 'suscripcion' && subscriptionDetails.length > 0 && (
                            <div className="col-span-2">
                                <h3 className="font-semibold text-sm text-gray-500 mb-2">Funcionales a Pagar</h3>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <ul className="space-y-2">
                                        {subscriptionDetails.map((subscription) => (
                                            <li key={subscription.id} className="flex justify-between items-center py-1">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                                    <div>
                                                        <span className="text-base font-medium">
                                                            {subscription.subscription?.name || 'Funcional'} #{subscription.id}
                                                        </span>
                                                        <div className="text-sm text-gray-500">
                                                            Estado: {subscription.status} • 
                                                            Asistencias: {subscription.consultations_remaining}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="font-medium text-gray-700">
                                                    ${(subscription.subscription?.price ?? 0)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    {subscriptionDetails.length > 1 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                            <span className="font-medium">Total a pagar:</span>
                                            <span className="font-bold text-lg">
                                                ${calculateSubscriptionsTotal()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Sin items seleccionados */}
                        {(data.payment_type === 'consulta' && consultationDetails.length === 0) ||
                         (data.payment_type === 'suscripcion' && subscriptionDetails.length === 0) ? (
                            <div className="col-span-2">
                                <h3 className="font-semibold text-sm text-gray-500">Items a Pagar</h3>
                                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg border border-yellow-200">
                                    <p className="text-base">No hay {data.payment_type === 'consulta' ? 'consultas' : 'funcionales'} seleccionadas</p>
                                </div>
                            </div>
                        ) : null}

                        {/* Monto Total */}
                        <div className="col-span-2">
                            <h3 className="font-semibold text-sm text-gray-500">Monto Total del Pago</h3>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-2xl font-bold text-blue-700 text-center">
                                    ${data.amount}
                                </p>
                            </div>
                        </div>

                        {/* Notas */}
                        {data.notes && (
                            <div className="col-span-2">
                                <h3 className="font-semibold text-sm text-gray-500">Notas</h3>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="text-base">{data.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        type="button"
                        disabled={processing}
                    >
                        {cancelButtonText}
                    </Button>
                    <Button 
                        variant="default" 
                        onClick={onConfirm}
                        type="button"
                        disabled={processing}
                    >
                        {processing ? 'Procesando...' : confirmButtonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}