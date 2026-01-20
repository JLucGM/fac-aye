import { Button } from '@/components/ui/button';
import { Consultation, Service } from '@/types';
import { router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface FixCourtesyButtonProps {
  consultation: Consultation;
  services: Service[]; // Prop services de la base de datos (ACTUALIZADO)
}

export default function FixCourtesyButton({ consultation, services }: FixCourtesyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 1. Extraer los servicios de la consulta (vienen parseados del backend)
  const consultationServices = Array.isArray(consultation.services) 
    ? consultation.services 
    : [];

  // 2. Obtener solo los IDs válidos de los servicios de la consulta
  const consultationServiceIds = consultationServices
    .map(service => service?.id)
    .filter((id): id is number => id !== null && id !== undefined);

  // 3. Buscar en la base de datos (prop services) si alguno de estos servicios tiene is_courtesy = true
  const courtesyServicesInDb = services.filter(service => 
    consultationServiceIds.includes(service.id) && 
    (service.is_courtesy === true || service.is_courtesy === 1)
  );

  // ¿Es candidata para corrección?
  const isCourtesyCandidate = () => {
    // 1. Debe tener servicios marcados como cortesía en la base de datos
    if (courtesyServicesInDb.length === 0) {
      return false;
    }

    // 2. Debe estar pendiente
    if (consultation.payment_status !== 'pendiente') {
      return false;
    }

    // 3. No debe tener suscripción (las consultas con suscripción ya son pagadas)
    if (consultation.patient_subscription_id !== null) {
      return false;
    }

    return true;
  };

  const handleFix = () => {
    const courtesyServiceNames = courtesyServicesInDb.map(service => service.name).join(', ');
    
    const message = `¿Estás seguro de corregir esta consulta de cortesía?

Detalles:
- Consulta #${consultation.id}
- Servicios de cortesía: ${courtesyServiceNames}
- Estado actual: ${consultation.payment_status}
- Monto: $${consultation.amount}

Se cambiará el estado a "pagado". ${
  consultation.amount > 0 
    ? 'Además, se ajustará el balance del paciente para eliminar la deuda.' 
    : ''
}

¿Continuar?`;

    if (!confirm(message)) {
      return;
    }

    setIsLoading(true);
    router.post(route('consultations.fixCourtesy', consultation.id), {}, {
      onFinish: () => setIsLoading(false),
      onSuccess: () => {
        // Recargar la página para ver cambios
        router.reload();
      },
    });
  };

  if (!isCourtesyCandidate()) {
    return null;
  }

  return (
    <div className="mb-6 p-4 border border-blue-300 bg-blue-50 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Corrección de Consulta de Cortesía Pendiente
          </h3>
          
          <p className="text-blue-700 text-sm mt-1">
            Esta consulta tiene {courtesyServicesInDb.length} servicio(s) marcado(s) como cortesía en la base de datos pero está pendiente de pago.
          </p>
          
          <div className="mt-3">
            <p className="text-sm font-medium text-blue-800 mb-2">Servicios de cortesía detectados:</p>
            <div className="flex flex-wrap gap-1">
              {courtesyServicesInDb.map((service, index) => (
                <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {service.name} - ${parseFloat(service.price || '0').toFixed(2)}
                </Badge>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded">
              <p className="text-xs text-blue-800">
                <strong>Acción recomendada:</strong> Las consultas con servicios de cortesía deben estar marcadas como pagadas. 
                Haz clic en "Corregir" para cambiar el estado de pago a "pagado" y ajustar el balance del paciente si es necesario.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Button
            onClick={handleFix}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Corregir Consulta de Cortesía
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}