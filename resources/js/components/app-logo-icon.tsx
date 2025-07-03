import { usePage } from '@inertiajs/react';
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const { logo } = usePage().props;
            const logoUrl = typeof logo === 'string' ? logo : '/path/to/default-logo.png'; // URL de un logo por defecto

    return (
        <img src={logoUrl} alt="FisioArebolledo" className="h-20 w-auto" />
    );
}
