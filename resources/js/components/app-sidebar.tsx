import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    // {
    //     title: 'Modulo operativo',
    //     href: '/module-operation',
    //     icon: LayoutGrid,
    // },
    {
        title: 'Servicios',
        href: '/services',
        icon: LayoutGrid,
    },
    {
        title: 'Consultas',
        href: '/consultations',
        icon: LayoutGrid,
    },
    {
        title: 'Pacientes',
        href: '/patients',
        icon: LayoutGrid,
    },
    {
        title: 'Pagos',
        href: '/payments',
        icon: LayoutGrid,
    },
    {
        title: 'Métodos de Pagos',
        href: '/payment-methods',
        icon: LayoutGrid,
    },
    {
        title: 'Usuarios',
        href: '/user',
        icon: LayoutGrid,
    },
    // {
    //     title: 'Roles',
    //     href: '/roles',
    //     icon: LayoutGrid,
    // },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
