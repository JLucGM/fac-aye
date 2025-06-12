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
}

export interface Service {
    id: number;
    name: string;
    slug: string;
    price: number; // decimal e.g. 10.50
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface PaymentMethod {
    id: number;
    name: string;
    slug: string;
    description?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
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
    consultations?: Consultation[];
    // Optional: patient_id and consultation_id commented out in migration; add if needed
    // patient_id?: number;
    // consultation_id?: number;
}


export interface Consultation {
    id: number;
    user_id: number; // FK to User (doctor/professional)
    status: 'pendiente' | 'confirmed' | 'completed' | 'cancelled';
    scheduled_at: string; // ISO date string
    consultation_type: 'domiciliary' | 'office';
    amount: number;
    notes?: string;
    payment_status: 'pendiente' | 'paid' | 'refunded';
    patient_id: number; // FK to Patient
    created_at: string;
    updated_at: string;
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

// Job related interfaces can be created similarly as needed.


