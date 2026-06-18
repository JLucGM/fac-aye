import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useForm } from '@inertiajs/react';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    routeName: string;
    routeParams?: any;
    title?: string;
    children?: React.ReactNode;
    onSuccess?: () => void;
}

export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    routeName,
    routeParams,
    title = '¿Confirmar eliminación?',
    children,
    onSuccess,
}: ConfirmDeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route(routeName, routeParams), {
            onSuccess: () => {
                onOpenChange(false);
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={handleDelete}
            title={title}
            description={children}
            confirmButtonText={processing ? 'Eliminando...' : 'Eliminar'}
            confirmVariant="destructive"
            processing={processing}
            icon="warning"
        />
    );
}