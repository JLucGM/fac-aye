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
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Service {
    id: number
    slug?: string
    name: string
    status: string
    price: number
    description: string
}

export interface Consultation {
    id: number;
    slug?: string;
    user_id: number;
    patient_id: number;
    service_id: number;
    status: string;
    scheduled_at: string;
    completed_at: string;
    notes: string;
    payment_status: string;
    user?: User; // Agregar la propiedad user
    patient?: Patient;
    services?: Service[];
}
export interface Patient {
    id: number;
    slug?: string;
    name: string;
    lastname: string;
    identification: string;
    email: string;
    phone: string;
    address: string;
    birthdate: string;
    created_at: string;
    updated_at: string;
}


export interface PaymentMethod {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  active: boolean;
}

export interface Payment {
  id: number
  slug?: string
  name: string
  status: string
  email: string
  amount: number
}