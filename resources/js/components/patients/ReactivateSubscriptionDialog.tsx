import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PatientSubscription } from '@/types';
import { useForm } from '@inertiajs/react';
import { Play, Loader2, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';
import InputError from '../input-error';

interface ReactivateSubscriptionDialogProps {
  subscription: PatientSubscription;
  patientSlug: string;
}

export default function ReactivateSubscriptionDialog({
  subscription,
  patientSlug,
}: ReactivateSubscriptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    patient_subscription_id: subscription.id,
    reason: '',
  });

  const price = parseFloat(subscription.subscription?.price?.toString() || '0');
  const amountPaid = parseFloat(subscription.amount_paid?.toString() || '0');
  const wasReversed = subscription.status === 'cancelled';
  const debtToCreate = wasReversed ? Math.max(0, price - amountPaid) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('patients.reactivateSubscription', patientSlug), {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
          <Play className="h-3 w-3 mr-1" />
          Reactivar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Reactivar Funcional
            </DialogTitle>
            <DialogDescription>
              Esta acción reactivará la suscripción y la pondrá como activa nuevamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="bg-muted rounded-md p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suscripción:</span>
                <span className="font-medium">{subscription.subscription?.name} (#{subscription.id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado actual:</span>
                <span className="font-medium capitalize text-amber-600">{subscription.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consultas restantes:</span>
                <span className="font-medium">{subscription.consultations_remaining}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consultas usadas:</span>
                <span className="font-medium">{subscription.consultations_used}</span>
              </div>
            </div>

            {wasReversed ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm flex gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Esta suscripción fue cancelada previamente</p>
                  {debtToCreate > 0 ? (
                    <p>Se generará una <strong>nueva deuda de ${debtToCreate.toFixed(2)}</strong> por el saldo pendiente.</p>
                  ) : (
                    <>
                      <p>No se generará nueva deuda porque ya estaba completamente pagada.</p>
                      <p>El monto pagado de <strong>${amountPaid.toFixed(2)}</strong> se restará de su crédito.</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800 text-sm flex gap-2">
                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">La deuda original sigue vigente</p>
                  <p>No se generará una nueva deuda. La fecha de fin se extenderá según el tipo de plan.</p>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo de la reactivación *</Label>
              <Textarea
                id="reason"
                value={data.reason}
                onChange={(e) => setData('reason', e.target.value)}
                placeholder="Ej: Se reactiva porque el funcional anterior fue desactivado por error..."
                required
              />
              <InputError message={errors.reason} className="mt-1" />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={processing || !data.reason}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sí, reactivar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}