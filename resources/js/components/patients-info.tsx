import { Patient } from "@/types";
import { Button } from "./ui/button";
import { Link } from "@inertiajs/react";

export default function PatientInfo({ patients }: { patients: Patient[] }) {
    return (
        <header>
            <h3 className="mb-0.5 text-base font-medium">Información del paciente</h3>
            {patients.length === 0 ? (
                <p className="text-muted-foreground text-sm">No hay pacientes disponibles.</p>
            ) : (
                <div>
                    <p>Nombre: {patients[0].name} {patients[0].lastname}</p>
                    <p>C.I: {patients[0].identification}</p>
                    <p>Teléfono: {patients[0].phone}</p>
                    <p>Email: {patients[0].email}</p>
                    <p className='capitalize'>Fecha de Nacimiento: {new Date(patients[0].birthdate).toLocaleDateString()}</p>
                </div>
            )
            }
        </header >
    );
}
