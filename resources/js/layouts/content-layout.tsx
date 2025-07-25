import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { type ReactNode } from 'react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { UserInfo } from '@/components/user-info';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

interface ContentLayoutProps {
    children?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export function ContentLayout({ children, breadcrumbs = [], ...props }: ContentLayoutProps) {

    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <div className="mx-5">
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">

                    <Link href="/dashboard">
                        <AppLogoIcon />
                    </Link>
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>
                            {/* <UserInfo user={auth.user} /> */}
                            {auth.user.name} {auth.user.lastname}
                            <ChevronDown className="ml-auto size-4" />
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem asChild>
                                <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                                    <Settings className="mr-2" />
                                    Settings
                                </Link>
                            </MenubarItem>

                            <MenubarSeparator />
                            <MenubarItem asChild>
                                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                                    <LogOut className="mr-2" />
                                    Log out
                                </Link>
                            </MenubarItem>

                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
            <div className="w-xl md:w-3xl lg:w-4xl mx-auto p-4">
                {children}
            </div>
        </div>
    );
}
