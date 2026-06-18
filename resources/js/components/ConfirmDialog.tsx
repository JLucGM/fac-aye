import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string | ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmVariant?: 'default' | 'destructive';
    processing?: boolean;
    icon?: 'warning' | 'info' | 'none';
    children?: ReactNode;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
    confirmVariant = 'default',
    processing = false,
    icon = 'none',
    children,
}: ConfirmDialogProps) {
    const IconComponent = icon === 'warning' ? AlertTriangle : icon === 'info' ? Info : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {IconComponent && (
                            <IconComponent className={`h-5 w-5 ${confirmVariant === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
                        )}
                        {title}
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="text-sm text-muted-foreground">{description}</div>
                    </DialogDescription>
                </DialogHeader>

                {children && <div className="py-2">{children}</div>}

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
                        variant={confirmVariant}
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