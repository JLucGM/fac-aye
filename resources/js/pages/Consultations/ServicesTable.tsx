import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type ServiceTableItem = {
    id: number | string;
    name: string;
    price: number | string;
};

export default function ServicesTable({ services, className }: { services: ServiceTableItem[]; className?: string }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <Table className="min-w-full border-collapse border border-gray-200">
                <TableHeader>
                    <TableRow>
                        <TableHead  className="border border-gray-300 p-2">Nombre del Servicio</TableHead >
                        <TableHead  className="border border-gray-300 p-2">Precio</TableHead >
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.length > 0 ? (
                        services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="border border-gray-300 p-2">{service.name}</TableCell>
                                <TableCell className="border border-gray-300 p-2">${service.price}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell className="border border-gray-300 p-2" colSpan={2}>No hay servicios seleccionados</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
