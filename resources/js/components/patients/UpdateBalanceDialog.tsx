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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Patient } from '@/types';
import { useForm } from '@inertiajs/react';
import { DollarSign, Loader2 } from 'lucide-react';
import { useState } from 'react';
import InputError from '../input-error';

interface UpdateBalanceDialogProps {
  patient: Patient;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function UpdateBalanceDialog({
  patient,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: UpdateBalanceDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const { data, setData, post, processing, errors, reset } = useForm({
    balance: patient.balance || '0.00',
    credit: patient.credit || '0.00',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('patients.updateBalance', patient), {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <DollarSign className="h-4 w-4 mr-2" />
          Modificar Balance/Crédito
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modificar Balance y Crédito</DialogTitle>
            <DialogDescription>
              Actualiza el balance y crédito del paciente. Los cambios se registrarán en el historial de transacciones.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance
              </Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={data.balance}
                onChange={(e) => setData('balance', e.target.value)}
                className="col-span-3"
              />
              <InputError message={errors.balance} className="mt-2" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credit" className="text-right">
                Crédito
              </Label>
              <Input
                id="credit"
                type="number"
                step="0.01"
                value={data.credit}
                onChange={(e) => setData('credit', e.target.value)}
                className="col-span-3"
              />
              <InputError message={errors.credit} className="mt-2" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción *
              </Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="col-span-3"
                placeholder="Ingrese una descripción para este ajuste..."

              />
              <InputError message={errors.description} className="mt-2" />
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
            <Button type="submit" disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}