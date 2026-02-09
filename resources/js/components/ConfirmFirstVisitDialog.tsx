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
    
    // Función para obtener el nombre del fisioterapeuta
    const getTherapistName = () => {
        const therapist = users.find(u => u.id === consultationData.user_id);
        return therapist ? `${therapist.name} ${therapist.lastname}` : 'No seleccionado';
    };

    // Función para obtener el nombre del médico
    const getDoctorName = () => {
        if (!patientData.doctor_id) return 'No seleccionado';
        const doctor = doctors.find(d => d.id === patientData.doctor_id);
        return doctor ? `${doctor.name} ${doctor.lastname}` : 'No encontrado';
    };

    // Función para obtener el nombre de la funcional
    const getSubscriptionName = () => {
        if (!patientData.subscription_id) return 'No seleccionada';
        const subscription = subscriptions.find(s => s.id === patientData.subscription_id);
        return subscription ? subscription.name : 'No encontrada';
    };

    // Función para obtener los detalles de los servicios con precio formateado
    const getServiceDetails = () => {
        if (consultationData.subscription_use === 'yes') {
            return [{ name: 'Funcional', price: 0, rawPrice: 0 }];
        }
        
        if (consultationData.service_id.length === 0) {
            return [];
        }
        
        return consultationData.service_id.map(serviceId => {
            const service = services.find(s => s.id === serviceId);
            const price = service?.price || 0;
            // Convertir precio a número si es string
            const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
            
            return {
                name: service ? service.name : 'Servicio no encontrado',
                price: numericPrice,
                rawPrice: price
            };
        });
    };

    // Función para formatear el precio
    const formatPrice = (price: number | string): string => {
        if (typeof price === 'string') {
            // Intentar convertir string a número
            const num = parseFloat(price);
            return isNaN(num) ? '0.00' : num.toFixed(2);
        }
        return price.toFixed(2);
    };

    // Calcular el monto total
    const calculateTotalAmount = () => {
        if (consultationData.subscription_use === 'yes') {
            return 0;
        }
        
        const serviceDetails = getServiceDetails();
        return serviceDetails.reduce((total, service) => {
            return total + service.price;
        }, 0);
    };

    // Formatear fecha de nacimiento
    const formatBirthdate = (date: string) => {
        if (!date) return 'No especificada';
        return new Date(date).toLocaleDateString('es-CA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const serviceDetails = getServiceDetails();
    const totalAmount = calculateTotalAmount();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    {/* Sección de Información del Paciente */}
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
                                <p className="text-base">{getSubscriptionName()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Información de la Consulta */}
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
                                <h4 className="font-semibold text-sm text-gray-500">Estado de Pago</h4>
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
                                            <span className="font-medium">Total:</span>
                                            <span className="font-bold text-lg">
                                                ${formatPrice(totalAmount)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Monto Total */}
                            {/* <div className="col-span-2">
                                <h4 className="font-semibold text-sm text-gray-500">Monto Total de la Consulta</h4>
                                <div className={`p-3 rounded-lg border ${totalAmount > 0 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                                    <p className={`text-2xl font-bold text-center ${totalAmount > 0 ? 'text-blue-700' : 'text-green-700'}`}>
                                        ${totalAmount > 0 ? formatPrice(totalAmount) : '0.00 (Funcional)'}
                                    </p>
                                </div>
                            </div> */}

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

                    {/* Resumen */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Resumen</h4>
                        <p className="text-sm text-gray-600">
                            Se creará un nuevo paciente con los datos proporcionados y se registrará su primera consulta 
                            {consultationData.subscription_use === 'yes' ? ' utilizando su funcional asignada.' : '.'}
                            {patientData.subscription_id && consultationData.subscription_use !== 'yes' && 
                             ' El paciente tendrá una funcional asignada para futuras consultas.'}
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