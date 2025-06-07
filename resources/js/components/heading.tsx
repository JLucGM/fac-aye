export default function Heading({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
    return (
        <div className="mb-8 space-y-0.5 flex justify-between items-center">
            <div className="">
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>

           {children}
        </div>
    );
}
