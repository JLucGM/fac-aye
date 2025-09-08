import React from 'react';
import { CreatePaymentFormData, Subscription } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SubscriptionsTableProps = {
    pendingSubscriptions: Subscription[];
    data: CreatePaymentFormData;
    toggleSubscriptionSelection: (id: number) => void;
};

function formatCurrency(value: number) {
    return value.toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
}

export default function SubscriptionsTable({ pendingSubscriptions, data, toggleSubscriptionSelection }: SubscriptionsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1/12"></TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Monto Total</TableHead>
                    <TableHead>Monto Pagado</TableHead>
                    <TableHead>Saldo Pendiente</TableHead>
                    <TableHead>Período</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pendingSubscriptions.map(subscription => {
                    const price = subscription.subscription?.price ? parseFloat(String(subscription.subscription.price)) : 0;
                    const amountPaid = subscription.amount_paid ? parseFloat(String(subscription.amount_paid)) : 0;
                    const safePrice = isNaN(price) || price < 0 ? 0 : price;
                    const safeAmountPaid = isNaN(amountPaid) || amountPaid < 0 ? 0 : amountPaid;
                    const pendingAmount = safePrice - safeAmountPaid;

                    const isSelected = data.subscription_ids?.includes(subscription.id) || false;

                    return (
                        <TableRow key={subscription.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSubscriptionSelection(subscription.id)}
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded-md transition duration-150 ease-in-out"
                                />
                            </TableCell>
                            <TableCell>
                                {subscription.subscription?.name || 'Nombre no disponible'}
                            </TableCell>
                            <TableCell>{formatCurrency(safePrice)}</TableCell>
                            <TableCell>{formatCurrency(safeAmountPaid)}</TableCell>
                            <TableCell>{formatCurrency(pendingAmount)}</TableCell>
                            <TableCell>
                                {subscription.start_date && !isNaN(Date.parse(subscription.start_date))
                                    ? new Date(subscription.start_date).toLocaleDateString()
                                    : 'Fecha inicio no disponible'} - {subscription.end_date && !isNaN(Date.parse(subscription.end_date))
                                    ? new Date(subscription.end_date).toLocaleDateString()
                                    : 'Fecha fin no disponible'}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
