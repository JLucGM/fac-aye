import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Doctor, Service, Subscription, User } from '@/types';

interface ConfirmFirstVisitDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmButtonText: string;
    cancelButtonText?: string;
    processing?: boolean;
    patientData: {
        name: string;
        lastname: string;
        email: string;
        phone: string;
        birthdate: string;
        identification: string;
        address: string;
        doctor_id: number | null;
        subscription_id: string | null;
    };
    consultationData: {
        user_id: number;
        service_id: number[];
        status: string;
        consultation_type: string;
        notes: string;
        payment_status: string;
        amount: number;
        subscription_use: string;
    };
    users: User[];
    services: Service[];
    doctors: Doctor[];
    subscriptions: Subscription[];
}

export function ConfirmFirstVisitDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmButtonText,
    cancelButtonText = 'Cancelar',
    processing = false,
    patientData,
    consultationData,
    users,
    services,
    doctors,
    subscriptions,
}: ConfirmFirstVisitDialogProps) {
    
    // Obtener el fisioterapeuta
    const getTherapistName = () => {
        const therapist = users.find(u => u.id === consultationData.user_id);
        return therapist ? `${therapist.name} ${therapist.lastname}` : 'No seleccionado';
    };

    // Obtener el médico tratante
    const getDoctorName = () => {
        if (!patientData.doctor_id) return 'No seleccionado';
        const doctor = doctors.find(d => d.id === patientData.doctor_id);
        return doctor ? `${doctor.name} ${doctor.lastname}` : 'No encontrado';
    };

    // Obtener la suscripción seleccionada y su precio
    const selectedSubscription = patientData.subscription_id
        ? subscriptions.find(s => s.id === patientData.subscription_id)
        : null;
    const subscriptionPrice = selectedSubscription?.price || 0;

    // Detalles de los servicios de la consulta
    const getServiceDetails = () => {
        if (consultationData.subscription_use === 'yes') {
            return [{ name: 'Funcional (usada en esta consulta)', price: 0 }];
        }
        
        if (consultationData.service_id.length === 0) {
            return [];
        }
        
        return consultationData.service_id.map(serviceId => {
            const service = services.find(s => s.id === serviceId);
            const price = service?.price || 0;
            const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
            
            return {
                name: service ? service.name : 'Servicio no encontrado',
                price: numericPrice,
            };
        });
    };

    // Formatear precio
    const formatPrice = (price: number | string): string => {
        if (typeof price === 'string') {
            const num = parseFloat(price);
            return isNaN(num) ? '0.00' : num.toFixed(2);
        }
        return price.toFixed(2);
    };

    // Calcular total de la consulta (solo servicios)
    const calculateConsultationTotal = () => {
        if (consultationData.subscription_use === 'yes') {
            return 0;
        }
        const serviceDetails = getServiceDetails();
        return serviceDetails.reduce((total, service) => total + service.price, 0);
    };

    // Formatear fecha
    const formatBirthdate = (date: string) => {
        if (!date) return 'No especificada';
        return new Date(date).toLocaleDateString('es-CA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const serviceDetails = getServiceDetails();
    const consultationTotal = calculateConsultationTotal();
    const totalDue = consultationTotal + subscriptionPrice; // Deuda total del paciente

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    {/* Información del Paciente */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Nuevo Paciente</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Nombre Completo</h4>
                                <p className="text-base font-medium">
                                    {patientData.name} {patientData.lastname}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Cédula de Identidad</h4>
                                <p className="text-base">{patientData.identification || 'No especificada'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Correo Electrónico</h4>
                                <p className="text-base">{patientData.email || 'No especificado'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Teléfono</h4>
                                <p className="text-base">{patientData.phone || 'No especificado'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Fecha de Nacimiento</h4>
                                <p className="text-base">{formatBirthdate(patientData.birthdate)}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Dirección</h4>
                                <p className="text-base">{patientData.address || 'No especificada'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Médico Tratante</h4>
                                <p className="text-base">{getDoctorName()}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Funcional Asignada</h4>
                                <p className="text-base">
                                    {selectedSubscription ? selectedSubscription.name : 'No seleccionada'}
                                </p>
                            </div>
                            {selectedSubscription && (
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500">Costo de Funcional</h4>
                                    <p className="text-base font-medium text-red-600">
                                        ${formatPrice(subscriptionPrice)} (pendiente)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información de la Consulta */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Información de la Primera Consulta</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Fisioterapeuta</h4>
                                <p className="text-base font-medium">{getTherapistName()}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Tipo de Consulta</h4>
                                <p className="text-base capitalize">
                                    {consultationData.consultation_type === 'consultorio' ? 'Consultorio' : 'Domiciliaria'}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Estado de Pago (consulta)</h4>
                                <p className="text-base capitalize">{consultationData.payment_status}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Uso de Funcional</h4>
                                <p className="text-base">
                                    {consultationData.subscription_use === 'yes' ? 'Sí' : 'No'}
                                </p>
                            </div>
                            
                            {/* Servicios */}
                            <div className="col-span-2">
                                <h4 className="font-semibold text-sm text-gray-500 mb-2">Servicios</h4>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    {serviceDetails.length === 0 ? (
                                        <p className="text-base text-gray-500 italic">No hay servicios seleccionados</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {serviceDetails.map((service, index) => (
                                                <li key={index} className="flex justify-between items-center py-1">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                                        <span className="text-base">{service.name}</span>
                                                    </div>
                                                    {consultationData.subscription_use !== 'yes' && service.price > 0 && (
                                                        <span className="font-medium text-gray-700">
                                                            ${formatPrice(service.price)}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {consultationData.subscription_use !== 'yes' && serviceDetails.length > 1 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                            <span className="font-medium">Total consulta:</span>
                                            <span className="font-bold text-lg">
                                                ${formatPrice(consultationTotal)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notas */}
                            {consultationData.notes && (
                                <div className="col-span-2">
                                    <h4 className="font-semibold text-sm text-gray-500">Notas de la Consulta</h4>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <p className="text-base">{consultationData.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resumen de cargos */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Resumen de cargos</h4>
                        <div className="space-y-2">
                            {consultationTotal > 0 && (
                                <div className="flex justify-between">
                                    <span>Total consulta:</span>
                                    <span className="font-medium">${formatPrice(consultationTotal)}</span>
                                </div>
                            )}
                            {selectedSubscription && subscriptionPrice > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Costo de funcional (pendiente):</span>
                                    <span className="font-medium">${formatPrice(subscriptionPrice)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span>Total a deber:</span>
                                <span>${formatPrice(totalDue)}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                            {selectedSubscription
                                ? 'La funcional asignada generará una deuda por su costo. La consulta '
                                : 'La consulta '}
                            {consultationData.subscription_use === 'yes'
                                ? 'está cubierta por la funcional (costo 0).'
                                : 'generará deuda por los servicios seleccionados.'}
                        </p>
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
                        {processing ? 'Creando...' : confirmButtonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}