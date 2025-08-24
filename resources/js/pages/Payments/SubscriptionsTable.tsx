import React from 'react';
import { CreatePaymentFormData, Subscription } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Asegúrate de que la ruta sea correcta

type SubscriptionsTableProps = {
    pendingSubscriptions: Subscription[];
    data: CreatePaymentFormData;
    toggleSubscriptionSelection: (id: number) => void;
};

export default function SubscriptionsTable({ pendingSubscriptions, data, toggleSubscriptionSelection }: SubscriptionsTableProps) {
    return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/12"></TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Período</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pendingSubscriptions.map(subscription => (
                        <TableRow key={subscription.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                                <input
                                    type="checkbox"
                                    checked={data.subscription_ids?.includes(subscription.id) || false}
                                    onChange={() => toggleSubscriptionSelection(subscription.id)}
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded-md transition duration-150 ease-in-out"
                                />
                            </TableCell>
                            <TableCell>
                                {subscription.id}
                                {subscription.subscription && subscription.subscription.name ? subscription.subscription.name : 'Nombre no disponible'}
                            </TableCell>
                            <TableCell>
                                {subscription.subscription && subscription.subscription.price !== undefined
                                    ? `$${subscription.subscription.price}`
                                    : 'Precio no disponible'}
                            </TableCell>
                            <TableCell>
                                {new Date(subscription.start_date).toLocaleDateString()} - {new Date(subscription.end_date).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
    );
}
