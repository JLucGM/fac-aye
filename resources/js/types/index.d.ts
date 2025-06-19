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
    // [key: string]: unknown; // Consider removing this if you don't need arbitrary properties
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
    identification: string;
    phone?: string;
    birthdate?: string; // ISO date string or null
    created_at: string;
    updated_at: string;
    // Relationships
    consultations?: Consultation[]; // A Patient can have many Consultations
    payments?: Payment[]; // A Patient can have many Payments (based on Patient model's hasMany)
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
    amount: number; // decimal amount
    status: 'pendiente' | 'completado' | 'fallido'; // payment status
    reference: string; // transaction id or reference
    notes: string;
    paid_at: string; // ISO date string or null
    payment_method_id: number; // FK to PaymentMethod
    created_at: string;
    updated_at: string;
    // Relationships
    consultations?: Consultation[]; // A Payment can be associated with many Consultations (many-to-many)
    payment_method?: PaymentMethod; // A Payment belongs to one PaymentMethod
    patient?: Patient; // A Payment belongs to one Patient (based on Payment model's belongsTo)
}


export interface Consultation {
    id: number;
    user_id: number; // FK to User (doctor/professional)
    status: 'pendiente' | 'confirmed' | 'completed' | 'cancelled';
    scheduled_at: string; // ISO date string
    consultation_type: 'domiciliary' | 'office';
    amount: number;
    notes?: string;
    payment_status: "pending" | 'paid' | 'refunded';
    patient_id: number; // FK to Patient
    created_at: string;
    updated_at: string;
    // Relationships
    patient?: Patient; // A Consultation belongs to one Patient
    user?: User; // A Consultation belongs to one User
    services?: Service[]; // A Consultation can have many Services (many-to-many)
    payments?: Payment[]; // A Consultation can have many Payments (many-to-many)
}

export interface Role {
    id: number;
    name: string;
    slug: string;
}


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
    status: 'pendiente' | 'confirmed' | 'completed' | 'cancelled' | ''; // Allow empty string for form initial state
    scheduled_at: string;
    completed_at?: string; // Optional as it might not be provided on creation
    notes: string;
    payment_status: 'pending' | 'paid' | 'refunded' | ''; // Allow empty string for form initial state
    amount: number;
    consultation_type: 'domiciliary' | 'office' | ''; // Allow empty string for form initial state
    [key: string]: any; // Add this index signature
}

export interface CreatePatientFormData {
    name: string;
    lastname: string;
    email: string;
    phone: string;
    birthdate: string;
    identification: string;

    [key: string]: any; // Allows for dynamic access if setData uses string keys
}

export interface CreatePaymentFormData {
    patient_id: number | null;
    consultation_ids: number[]; // Assuming this will store an array of consultation IDs
    payment_method_id: number | null;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'earring' | ''; // Correcting status values, including 'earring'
    reference: string;
    notes: string;
    paid_at: string;
    [key: string]: any;
}

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

export interface ServiceFormData {
    name: string; // El nombre del servicio
    description: string; // La descripción del servicio. Aunque en el backend pueda ser opcional,
    // en el formulario lo manejamos como un string (posiblemente vacío).
    price: number; // El precio del servicio
    [key: string]: any; // Una firma de índice que permite que la interfaz sea más flexible,
    // útil cuando se trabaja con funciones como `setData` que pueden acceder
    // a las propiedades mediante claves de cadena.
}