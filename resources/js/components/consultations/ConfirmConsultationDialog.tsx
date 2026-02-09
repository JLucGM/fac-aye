import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Consultation, Patient, Service, User } from '@/types';

interface ConfirmConsultationDialogProps {
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
        user_id: number;
        patient_id: number;
        consultation_type: string;
        payment_status: string;
        service_id: number[];
        amount: number;
        subscription_use: string;
        notes?: string;
    };
    patients: Patient[];
    users: User[];
    services: Service[];
}

export function ConfirmConsultationDialog({
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
    users,
    services,
}: ConfirmConsultationDialogProps) {
    
    // Función para obtener el nombre del paciente
    const getPatientName = () => {
        const patient = patients.find(p => p.id === data.patient_id);
        return patient ? `${patient.name} ${patient.lastname}` : 'Paciente no encontrado';
    };

    // Función para obtener el nombre del fisioterapeuta
    const getTherapistName = () => {
        const therapist = users.find(u => u.id === data.user_id);
        return therapist ? `${therapist.name} ${therapist.lastname}` : 'Fisioterapeuta no encontrado';
    };

    // Función para obtener los servicios con detalles
    const getServicesDetails = () => {
        if (data.subscription_use === 'yes') {
            return [{ name: 'Funcional', price: 0 }];
        }
        if (data.service_id.length === 0) {
            return [];
        }
        return data.service_id.map(serviceId => {
            const service = services.find(s => s.id === serviceId);
            return {
                name: service ? service.name : 'Servicio no encontrado',
                price: service ? service.price : 0
            };
        });
    };

    // Función para calcular el total
    const getTotalAmount = () => {
        if (data.subscription_use === 'yes') {
            return '0.00';
        }
        const total = data.service_id.reduce((total, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            return total + parseFloat(String(service?.price ?? '0'));
        }, 0);
        return total.toFixed(2);
    };

    // Función para traducir el tipo de consulta
    const getConsultationTypeLabel = () => {
        return data.consultation_type === 'consultorio' ? 'Consultorio' : 'Domiciliaria';
    };

    // Función para traducir el uso de funcional
    const getSubscriptionUseLabel = () => {
        return data.subscription_use === 'yes' ? 'Sí' : 'No';
    };

    const servicesDetails = getServicesDetails();

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
                            <h3 className="font-semibold text-sm text-gray-500">Fisioterapeuta</h3>
                            <p className="text-base">{getTherapistName()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Paciente</h3>
                            <p className="text-base">{getPatientName()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Tipo de Asistencia</h3>
                            <p className="text-base">{getConsultationTypeLabel()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Estado de Pago</h3>
                            <p className="text-base capitalize">{data.payment_status}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500">Uso de Funcional</h3>
                            <p className="text-base">{getSubscriptionUseLabel()}</p>
                        </div>
                        {/* Lista de servicios */}
                        <div className="col-span-2">
                            <h3 className="font-semibold text-sm text-gray-500 mb-2">Servicios</h3>
                            {servicesDetails.length > 0 ? (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <ul className="space-y-2">
                                        {servicesDetails.map((service, index) => (
                                            <li key={index} className="flex justify-between items-center py-1">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                    <span className="text-base">{service.name}</span>
                                                </div>
                                                {data.subscription_use !== 'yes' && service.price > 0 && (
                                                    <span className="font-medium text-gray-700">
                                                        ${service.price}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    {data.subscription_use !== 'yes' && servicesDetails.length > 1 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                            <span className="font-medium">Total:</span>
                                            <span className="font-bold text-lg">
                                                ${getTotalAmount()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-base text-gray-500 italic">No hay servicios seleccionados</p>
                            )}
                        </div>

                        {/* Mostrar el total general si es solo un servicio o suscripción */}
                        {(data.subscription_use === 'yes' || servicesDetails.length <= 1) && (
                            <div>
                                <h3 className="font-semibold text-sm text-gray-500">Monto Total</h3>
                                <p className="text-base font-bold">${type === 'create' ? getTotalAmount() : data.amount}</p>
                            </div>
                        )}
                        
                        
                        
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