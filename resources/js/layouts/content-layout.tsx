import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface ContentLayoutProps {
    children?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: ContentLayoutProps) => (
    <div className="w-xl md:w-3xl lg:w-4xl mx-auto p-4">
        {children}
    </div>
);
