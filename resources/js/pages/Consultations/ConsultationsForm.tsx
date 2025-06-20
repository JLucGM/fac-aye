import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateConsultationFormData, Patient, Service, User } from "@/types";
import Select from 'react-select';
import { useEffect } from 'react';
import { DateTimePicker } from "@/components/DateTimePicker";

type ConsultationsFormProps = {
    data: CreateConsultationFormData;
    patients: Patient[];
    users: User[];
    services: Service[];
    setData: (key: string, value: any) => void;
    errors: {
        user_id?: string;
        patient_id?: string;
        service_id?: string;
        status?: string;
        scheduled_at?: string;
        notes?: string;
        payment_status?: string;
        consultation_type?: string;
        amount?: string;
    };
};

export default function ConsultationsForm({ data, patients = [], users, services, setData, errors }: ConsultationsFormProps) {
    // Convert numerical IDs to strings for react-select options.
    // This ensures consistency for react-select's internal handling of values.
    const userOptions = users.map(user => ({ value: String(user.id), label: user.name + ' ' + user.lastname + ' ( C.I:' + user.identification + ')' }));
    const patientOptions = Array.isArray(patients) ? patients.map(patient => ({
        value: String(patient.id),
        label: `${patient.name} ${patient.lastname} ( C.I: ${patient.identification} )`
    })) : [];
    const serviceOptions = services.map(service => ({ value: String(service.id), label: service.name + ' - $ ' + service.price }));

    const statusOptions = [
        { value: 'scheduled', label: 'Programado' },
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' },
    ];
    const paymentStatusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'paid', label: 'Pagado' },
        { value: 'refunded', label: 'Reembolsado' },
    ];

    const consultationTypeOptions = [
        { value: 'domiciliary', label: 'A Domiciliaria' },
        { value: 'office', label: 'Consultorio' },
    ];

    // Handles changes for the 'scheduled_at' datetime input
    const handleScheduledAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        const formattedDate = date.toISOString().slice(0, 19); // Format Y-m-d H:i:s
        setData('scheduled_at', formattedDate);
    };

    // Calculate the total amount based on selected services whenever service_id or services change
    useEffect(() => {
        const totalAmount = data.service_id.reduce((total, serviceId) => {
            // Find the service by its ID (serviceId is a number here, consistent with data.service_id)
            const service = services.find(s => s.id === serviceId);
            // Add the service price to the total, ensuring price is parsed as a float
            return total + (service ? parseFloat(String(service.price)) : 0); // Ensure service.price is treated as a string before parseFloat
        }, 0);
        setData('amount', totalAmount);
    }, [data.service_id, services, setData]);

    return (
        <>
            <div>
                <Label htmlFor="user_id" className="mb-2 block font-semibold text-gray-700">User ID</Label>
                <Select
                    id="user_id"
                    options={userOptions}
                    // Find the selected option by comparing against the string representation of data.user_id
                    value={userOptions.find(option => option.value === String(data.user_id)) || null}
                    onChange={(selectedOption) =>
                        // Convert the selected option's value (which is a string) back to a number.
                        // If no option is selected (selectedOption is null), set data.user_id to null.
                        setData('user_id', selectedOption ? Number(selectedOption.value) : null)
                    }
                    isSearchable
                    placeholder="Select User..."
                    className="rounded-md"
                />
                <InputError message={errors.user_id} />
            </div>

            {patientOptions.length > 0 && (
                <div>
                    <Label htmlFor="patient_id" className="mb-2 block font-semibold text-gray-700">Patient ID</Label>
                    <Select
                        id="patient_id"
                        options={patientOptions}
                        value={patientOptions.find(option => option.value === String(data.patient_id)) || null}
                        onChange={(selectedOption) =>
                            setData('patient_id', selectedOption ? Number(selectedOption.value) : null)
                        }
                        isSearchable
                        placeholder="Select Patient..."
                        className="rounded-md"
                    />
                    <InputError message={errors.patient_id} />
                </div>
            )}

            

            <div>
                <Label htmlFor="consultation_type" className="mb-2 block font-semibold text-gray-700">Tipo de Consulta</Label>
                <Select
                    id="consultation_type"
                    options={consultationTypeOptions}
                    value={consultationTypeOptions.find(option => option.value === data.consultation_type) || null}
                    onChange={(selectedOption) => setData('consultation_type', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Selecciona el tipo de consulta..."
                    className="rounded-md"
                />
                <InputError message={errors.consultation_type} />
            </div>

            <div>
                <Label htmlFor="scheduled_at" className="mb-2 block font-semibold text-gray-700">Fecha programada</Label>
                <DateTimePicker
                    value={data.scheduled_at}
                    onChange={(newValue) => setData('scheduled_at', newValue)}
                />
                <InputError message={errors.scheduled_at} />
            </div>


            <div>
                <Label htmlFor="status" className="mb-2 block font-semibold text-gray-700">Status</Label>
                <Select
                    id="status"
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === data.status) || null}
                    onChange={(selectedOption) => setData('status', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Select Status..."
                    className="rounded-md"
                />
                <InputError message={errors.status} />
            </div>

            <div>
                <Label htmlFor="payment_status" className="mb-2 block font-semibold text-gray-700">Payment Status</Label>
                <Select
                    id="payment_status"
                    options={paymentStatusOptions}
                    value={paymentStatusOptions.find(option => option.value === data.payment_status) || null}
                    onChange={(selectedOption) => setData('payment_status', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Select Payment Status..."
                    className="rounded-md"
                />
                <InputError message={errors.payment_status} />
            </div>

            <div>
                <Label htmlFor="notes" className="mb-2 block font-semibold text-gray-700">Notes</Label>
                <Input
                    id="notes"
                    type="text"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    className="rounded-md"
                />
                <InputError message={errors.notes} />
            </div>

            <div>
                <Label htmlFor="service_id" className="mb-2 block font-semibold text-gray-700">Servicios</Label>
                <Select
                    id="service_id"
                    options={serviceOptions}
                    isMulti // Enable multi-selection for services
                    // Filter selected options by converting data.service_id (array of numbers) to an array of strings for comparison
                    value={serviceOptions.filter(option => data.service_id.map(String).includes(option.value))}
                    onChange={(selectedOptions) =>
                        // Map the selected options' values (strings) back to numbers
                        setData('service_id', (selectedOptions || []).map(option => Number(option.value)))
                    }
                    isSearchable
                    placeholder="Select Services..."
                    className="rounded-md"
                />
                <InputError message={errors.service_id} />
            </div>

            <div>
                <Label className="mb-2 block font-semibold text-gray-700">Total Amount</Label>
                <Input
                    type="text"
                    value={`$ ${(typeof data.amount === 'number' ? data.amount.toFixed(2) : '0.00')}`}
                    readOnly
                    className="rounded-md bg-gray-200"
                />
            </div>
        </>
    );
}
