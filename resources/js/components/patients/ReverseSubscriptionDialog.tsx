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
import { RotateCcw, Loader2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import InputError from '../input-error';

interface ReverseSubscriptionDialogProps {
  subscription: PatientSubscription;
  patientSlug: string;
}

export default function ReverseSubscriptionDialog({
  subscription,
  patientSlug,
}: ReverseSubscriptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    patient_subscription_id: subscription.id,
    reason: '',
  });

  const price = parseFloat(subscription.subscription?.price?.toString() || '0');
  const amountPaid = parseFloat(subscription.amount_paid?.toString() || '0');
  const creditReturn = amountPaid > 0 ? amountPaid : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('patients.cancelSubscription', patientSlug), {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <RotateCcw className="h-3 w-3 mr-1" />
          Reversar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Reversar Suscripción
            </DialogTitle>
            <DialogDescription>
              Esta acción cancelará la suscripción y revertirá la deuda asociada.
              El balance del paciente se recalculará automáticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="bg-muted rounded-md p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suscripción:</span>
                <span className="font-medium">{subscription.subscription?.name} (#{subscription.id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio del plan:</span>
                <span className="font-medium">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto pagado:</span>
                <span className="font-medium">${amountPaid.toFixed(2)}</span>
              </div>
              {creditReturn > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>Crédito a devolver:</span>
                  <span>+${creditReturn.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Deuda a reversar:</span>
                <span>+${price.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Consultas restantes:</span>
                <span>{subscription.consultations_remaining}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo de la reversión *</Label>
              <Textarea
                id="reason"
                value={data.reason}
                onChange={(e) => setData('reason', e.target.value)}
                placeholder="Ej: Suscripción creada por error, se debió usar la suscripción anterior..."
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
            <Button type="submit" variant="destructive" disabled={processing || !data.reason}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Reversión
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}