import { ArrowLeft, MoveLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@inertiajs/react";

export default function Heading({ title, description, href, children }: { title: string; description?: string; href?: string; children?: React.ReactNode }) {
    return (
        <div className="mb-6 space-y-0.5 flex justify-between items-center">
            <div className="flex justify-start">
                {href && (
                    <Button variant="link" className="px-0 " asChild>
                        <Link href={route(href)}>
                            <MoveLeft className="" />
                        </Link>
                    </Button>
                )}
                <div className="">
                    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                    {description && <p className="text-muted-foreground text-sm">{description}</p>}
                </div>
            </div>

           {children}
        </div>
    );
}
