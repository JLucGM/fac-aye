import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Asegúrate de que este componente esté correctamente importado
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateTimePickerProps {
    value: string | undefined; // Cambia a string para que coincida con el formato ISO
    onChange: (value: string) => void; // Cambia a string para que coincida con el formato ISO
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
    const [time, setTime] = React.useState<string>(value ? value.slice(11, 16) : ""); // Extrae la hora y el minuto

    const handleDateChange = (selectedDate: Date) => {
        setDate(selectedDate);
        if (time) {
            onChange(`${selectedDate.toISOString().slice(0, 10)}T${time}`); // Combine date and time
        }
        setOpen(false);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = e.target.value;
        setTime(timeValue);
        if (date) {
            onChange(`${date.toISOString().slice(0, 10)}T${timeValue}`); // Combine date and time
        }
    };

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Label htmlFor="date-picker" className="px-1">Fecha</Label>
                
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" id="date-picker" className="w-32 justify-between font-normal">
                            {date ? date.toLocaleDateString() : "Seleccionar fecha"} <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            required // Asegúrate de que esta propiedad esté presente si es necesaria
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1">Hora</Label>
                <Input
                    type="time"
                    id="time-picker"
                    value={time}
                    onChange={handleTimeChange}
                    className="bg-background appearance-none"
                />
            </div>
        </div>
    );
}
