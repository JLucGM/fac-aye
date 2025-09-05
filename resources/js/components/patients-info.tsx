import { Patient } from "@/types";

export default function PatientInfo({ patient }: { patient: Patient }) {
    const calculateAge = (birthdate: string | undefined): number | string => {
    if (!birthdate) return 'Fecha no disponible';
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

  if (!patient) {
    return <p className="text-muted-foreground text-sm">No hay paciente disponible.</p>;
  }

  return (
    <header>
      <h3 className="mb-0.5 text-base font-medium">Información del paciente</h3>
      <div>
        <p>Nombre: {patient.name} {patient.lastname}</p>
        <p>C.I: {patient.identification}</p>
        <p>Teléfono: {patient.phone}</p>
        <p>Email: {patient.email}</p>
        <p className='capitalize'>Fecha de Nacimiento: {new Date(patient.birthdate).toLocaleDateString()}</p>
        <p>Edad: {calculateAge(patient.birthdate)}</p>
        <p>Dirección: {patient.address || 'No disponible'}</p>
      </div>
    </header>
  );
}
