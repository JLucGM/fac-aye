import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown; // Consider removing this if you don't need arbitrary properties
}

export interface User {
    id: number;
    name: string;
    lastname?: string;
    slug: string;
    identification: string;
    email: string;
    email_verified_at?: string;  // ISO date string or null
    password: string;
    phone?: string;
    active: boolean;
    remember_token?: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    // Relationships
    consultations?: Consultation[]; // A User can have many Consultations
}

export interface Patient {
    id: number;
    name: string;
    lastname?: string;
    slug: string;
    email: string;
    address?: string;
    identification: string;
    phone?: string;
    birthdate?: string; // ISO date string or null
    balance?: string; // ISO date string or null
    credit?: string; // ISO date string or null
    created_at: string;
    updated_at: string;
    doctor_id?: number | null; // FK to Doctor, can be null if not associated
    // subscription_id?: number | null; // FK to Subscription, can be null if not associated
    subscriptions?: PatientSubscription[]; // Asegúrate de que esta propiedad esté definida
    doctor?: Doctor; // A Patient can belong to one Doctor (based on Patient model's belongsTo)
    consultations?: Consultation[]; // A Patient can have many Consultations
    subscription?: PatientSubscription; // A Patient can have one Subscription (based on Patient model's
    medical_records?: MedicalRecord[];
    patient_balance_transactions?: PatientBalanceTransaction[];
}

export interface PatientBalanceTransaction {
  id: number;
  amount: string; // monto como string con decimales, ej. "-40.00"
  type: string; // tipo de transacción, ej. "pago_consulta", "suscripcion", etc.
  description: string; // descripción detallada
  patient_id: number;
  consultation_id: number | null; // puede ser null si no aplica
  patient_subscription_id: number | null; // puede ser null si no aplica
  payment_id: number | null; // puede ser null si no aplica
  created_at: string; // fecha ISO string
  updated_at: string; // fecha ISO string
}



export interface Doctor {
    id: number;
    name: string;
    lastname: string;
    slug: string;
    email: string;
    phone?: string;
    identification?: string;
    specialty?: string;
}

export interface Service {
    id: number;
    name: string;
    slug: string;
    price: number; // decimal e.g. 10.50
    description?: string;
    created_at: string;
    updated_at: string;
    // Relationships
    consultations?: Consultation[]; // A Service can be part of many Consultations (many-to-many)
}

export interface PaymentMethod {
    id: number;
    name: string;
    slug: string;
    description?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    // Relationships
    payments?: Payment[]; // A PaymentMethod can have many Payments
}

export interface Payment {
    id: number;
    patient_id: number | null; // FK to Patient, can be null if not associated
    consultation_ids: number[]; // Array of Consultation IDs (many-to-many relationship)
    amount: number; // decimal amount
    status: 'pendiente' | 'pagado' | 'incobrable' | 'reembolsado';
    reference: string; // transaction id or reference
    notes: string;
    // paid_at: string; // ISO date string or null
    payment_method_id: number; // FK to PaymentMethod
    created_at: string;
    updated_at: string;
    // Relationships
    consultations?: Consultation[]; // A Payment can be associated with many Consultations (many-to-many)
    payment_method?: PaymentMethod; // A Payment belongs to one PaymentMethod
    patient?: Patient; // A Payment belongs to one Patient (based on Payment model's belongsTo)
}

export interface Subscription {
    id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    type: string;
    status: 'active' | 'inactive',
    consultations_allowed: number;
    created_at: string;
    updated_at: string;
}

export interface PatientSubscription {
    id: number;
    patient_id: number;
    subscription_id: number;
    start_date: string; // ISO date string
    end_date: string; // ISO date string
    consultations_used: number;
    consultations_remaining: number;
    payment_status: "pendiente" | 'pagado' | 'incobrable' | 'reembolsado';
    status: string;
    subscription: Subscription; // Asegúrate de que esta relación esté definida
}


export interface Consultation {
    id: number;
    user_id: number; // FK to User (doctor/professional)
    status: 'programado' | 'confirmado' | 'completado' | 'cancelado'; // Allow empty string for form initial state
    scheduled_at: string; // ISO date string
    consultation_type: 'domiciliaria' | 'consultorio';
    amount: number;
    amount_paid: number;
    notes?: string;
    payment_status: "pendiente" | 'pagado' | 'incobrable' | 'reembolsado';
    patient_id: number; // FK to Patient
    patient_subscription_id: number;
    services?: array; // A Consultation can have many Services (many-to-many)
    created_at: string;
    updated_at: string;
    // Relationships
    patient?: Patient; // A Consultation belongs to one Patient
    user?: User; // A Consultation belongs to one User
    services?: Service[]; // A Consultation can have many Services (many-to-many)
    payments?: Payment[]; // A Consultation can have many Payments (many-to-many)
    subscription?: Subscription;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
}

// types.ts
export type Invoice = {
    id: number;
    invoice_number: string;
    patient_id: number;
    patient?: Patient; // Opcional, si precargas el paciente
    invoice_date: string; // YYYY-MM-DD
    due_date: string; // YYYY-MM-DD
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    notes: string;
    created_at: string;
    updated_at: string;
    // Si precargas los ítems de la factura
    items?: InvoiceItem[]; // Asegúrate de que esta propiedad esté definida como opcional
    payment_method?: PaymentMethod;
};

export type InvoiceItem = {
    id: number;
    invoice_id: number;
    service_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
};


export interface ConsultationService {
    id: number;
    consultation_id: number;
    service_id: number;
    created_at: string;
    updated_at: string;
}

export interface ConsultationPayment {
    consultation_id: number;
    payment_id: number;
    created_at: string;
    updated_at: string;
}

/**
 * Optional: Additional interfaces if you want to model system tables as well
 */

// Cache interface example
export interface Cache {
    key: string;
    value: string;
    expiration: number;
}

export interface CacheLock {
    key: string;
    owner: string;
    expiration: number;
}

// Session interface example
export interface Session {
    id: string;
    user_id?: number;
    ip_address?: string;
    user_agent?: string;
    payload: string;
    last_activity: number;
}

export interface CreateConsultationFormData {
    user_id: number;
    patient_id?: number;
    service_id: number[]; // Array of service IDs for the many-to-many relationship
    status: 'programado' | 'confirmado' | 'completado' | 'cancelado'; // Allow empty string for form initial state
    // scheduled_at: string;
    completed_at?: string; // Optional as it might not be provided on creation
    notes: string;
    payment_status: 'pendiente' | 'pagado' | 'incobrable' | 'reembolsado'; // Allow empty string for form initial state
    amount: number;
    consultation_type: 'domiciliaria' | 'consultorio' | ''; // Allow empty string for form initial state
    [key: string]: any; // Add this index signature
}

export interface CreatePatientFormData {
    name: string;
    lastname: string;
    email: string;
    phone: string;
    birthdate: string;
    identification: string;
    address: string;
    // doctor_id: string;

    [key: string]: any; // Allows for dynamic access if setData uses string keys
}

export interface CreateDoctorFormData {
    name: string;
    lastname: string;
    email: string;
    phone?: string;
    identification?: string;
    specialty?: string; // Assuming this is a string, adjust if it's an object or array

    [key: string]: any; // Allows for dynamic access if setData uses string keys
}


export interface CreatePaymentFormData {
    patient_id: number | null;
    consultation_ids: number[]; // Assuming this will store an array of consultation IDs
    payment_method_id: number | null;
    amount: number;
    status: 'pendiente' | 'pagado' | 'incobrable' | 'reembolsado'; // Correcting status values, including 'reembolsado'
    reference: string;
    notes: string;
    // paid_at: string;
    [key: string]: any;
}
export type InvoiceItemFormData = {
    id: number | null; // Cambiar a number | null
    service_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
};

export type CreateInvoiceFormData = {
    invoice_number: string; // Generado automáticamente en el backend
    patient_id: number | null;
    invoice_date: string; // YYYY-MM-DD
payment_method_id: number | null;
    notes: string;
    items: InvoiceItemFormData[]; // Array de ítems de la factura
};

export interface CreatePaymentMethodFormData {
    name: string;
    description: string;
    active: boolean;
    [key: string]: any; // For use with setData and dynamic key access
}

export interface CreateRoleFormData {
    name: string;
    permissions: string[];
    [key: string]: any; // For use with setData and dynamic key access
}

export interface CreateUserFormData {
    name: string;
    lastname: string;
    email: string;
    active: boolean; // Asegúrate de que sea booleano
    identification: string; // Asegúrate de que sea string
    phone?: string;
    password: string;
    permissions?: string[];
    [key: string]: any;
}

export interface ServiceFormData {
    name: string; // El nombre del servicio
    description: string; // La descripción del servicio. Aunque en el backend pueda ser opcional,
    // en el formulario lo manejamos como un string (posiblemente vacío).
    price: number; // El precio del servicio
    [key: string]: any; // Una firma de índice que permite que la interfaz sea más flexible,
    // útil cuando se trabaja con funciones como `setData` que pueden acceder
    // a las propiedades mediante claves de cadena.
}

export interface SuscriptionFormData {
    name: string; // El nombre de la suscripción
    description: string; // La descripción de la suscripción. Aunque en el backend pueda ser opcional,
    // en el formulario lo manejamos como un string (posiblemente vacío).
    price: number; // El precio de la suscripción
    type: 'semanal' | 'mensual' | 'anual'; // El tipo de suscripción
    consultations_allowed: number; // El número de consultas permitidas
    [key: string]: any; // Una firma de índice que permite que la interfaz sea más flexible,
    // útil cuando se trabaja con funciones como `setData` que pueden acceder
    // a las propiedades mediante claves de cadena.
}

// types.ts (ejemplo)
export interface MedicalRecord {
    id: number;
    patient_id: number;
    consultation_id: number | null; // Permitir null
    title: string;
    description: string | null;
    // record_date: string; // Si lo usas en el frontend
    type: 'consulta' | 'diagnostico' | 'tratamiento' | 'otro';
    created_at: string;
    updated_at: string;
    anamnesis?: string | null; // Puede ser opcional y/o nulo
    pain_behavior?: string | null; // Puede ser opcional y/o nulo
}