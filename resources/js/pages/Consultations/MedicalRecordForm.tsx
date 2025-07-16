// resources/js/Components/MedicalRecordForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Ya no necesitamos importar User si no hay doctor_id

interface MedicalRecordFormData {
    patient_id: number;
    // doctor_id ya no es necesario
    consultation_id: number | null;
    title: string;
    anamnesis: string;
    pain_behavior: string;
    description: string;
    // record_date: string;
    type: string;
}

interface MedicalRecordFormProps {
    data: MedicalRecordFormData;
    setData: (key: keyof MedicalRecordFormData, value: any) => void;
    errors: Record<string, string>;
    // doctors ya no es necesario
}

export default function MedicalRecordForm({ data, setData, errors }: MedicalRecordFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="col-span-full text-lg font-semibold mb-2">Nuevo Registro Médico</h3>

            {/* Campos ocultos para patient_id y consultation_id */}
            <Input type="hidden" value={data.patient_id} />
            <Input type="hidden" value={data.consultation_id || ''} />

            <div className="col-span-full">
                <Label htmlFor="mr_title">Título</Label>
                <Input
                    id="mr_title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* <div>
                <Label htmlFor="mr_record_date">Fecha en que ocurrió el evento</Label>
                <Input
                    id="mr_record_date"
                    type="date"
                    value={data.record_date}
                    onChange={(e) => setData('record_date', e.target.value)}
                    className={errors.record_date ? 'border-red-500' : ''}
                />
                {errors.record_date && <p className="text-red-500 text-sm mt-1">{errors.record_date}</p>}
            </div> */}

            <div className="col-span-full">
                <Label htmlFor="mr_anamnesis">Anamnesis</Label>
                <Textarea
                    id="mr_anamnesis"
                    value={data.anamnesis}
                    onChange={(e) => setData('anamnesis', e.target.value)}
                    className={errors.anamnesis ? 'border-red-500' : ''}
                />
                {errors.anamnesis && <p className="text-red-500 text-sm mt-1">{errors.anamnesis}</p>}
            </div>
            <div className="col-span-full">
                <Label htmlFor="mr_pain_behavior">Comportamiento del dolor</Label>
                <Textarea
                    id="mr_pain_behavior"
                    value={data.pain_behavior}
                    onChange={(e) => setData('pain_behavior', e.target.value)}
                    className={errors.pain_behavior ? 'border-red-500' : ''}
                />
                {errors.pain_behavior && <p className="text-red-500 text-sm mt-1">{errors.pain_behavior}</p>}
            </div>
            <div className="col-span-full">
                <Label htmlFor="mr_description">Descripción</Label>
                <Textarea
                    id="mr_description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
                <Label htmlFor="mr_type">Tipo de Registro</Label>
                <Select
                    value={data.type}
                    onValueChange={(value) => setData('type', value)}
                >
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="consulta">Consulta</SelectItem>
                        <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                        <SelectItem value="tratamiento">Tratamiento</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                </Select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            {/* El campo doctor_id ha sido eliminado */}
        </div>
    );
}
