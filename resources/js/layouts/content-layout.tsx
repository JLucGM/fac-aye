import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface ContentLayoutProps {
    children?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: ContentLayoutProps) => (
    <div className="w-xl md:w-2xl lg:w-3xl mx-auto p-4">
        {children}
    </div>
);
