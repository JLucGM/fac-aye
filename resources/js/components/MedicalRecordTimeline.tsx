import React, { useState } from 'react';
import { MedicalRecord } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Shield, Stethoscope, Info, ChevronDown, ChevronUp, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Componentes de iconos
const ConsultationIcon = () => <FileText className="shrink-0 size-4 mt-1" />;
const DiagnosisIcon = () => <Shield className="shrink-0 size-4 mt-1" />;
const TreatmentIcon = () => <Stethoscope className="shrink-0 size-4 mt-1" />;
const OtherIcon = () => <Info className="shrink-0 size-4 mt-1" />;

interface MedicalRecordTimelineProps {
  medicalRecords: MedicalRecord[];
  initialVisibleCount?: number;
  onEdit?: (record: MedicalRecord) => void;
}

export const MedicalRecordTimeline: React.FC<MedicalRecordTimelineProps> = ({
  medicalRecords,
  initialVisibleCount = 3,
  onEdit
}) => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<MedicalRecord>>({});

  // Manejar cambios en los campos editables
  const handleEditChange = (field: keyof MedicalRecord, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Agrupar registros por fecha
  const groupedRecords = medicalRecords.reduce((acc, record) => {
    const date = format(new Date(record.created_at), 'd MMM, yyyy', { locale: es });
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {} as Record<string, MedicalRecord[]>);

  const sortedEntries = Object.entries(groupedRecords).sort(([dateA], [dateB]) => 
    new Date(dateB).getTime() - new Date(dateA).getTime()
  );

  const visibleEntries = sortedEntries.slice(0, initialVisibleCount);
  const collapsibleEntries = sortedEntries.slice(initialVisibleCount);

  const openDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setEditData(record);
    setIsDetailDialogOpen(true);
    setIsEditMode(false);
  };

  const closeDetails = () => {
    setIsDetailDialogOpen(false);
    setIsEditMode(false);
  };

  if (!medicalRecords?.length) {
    return <p className="text-gray-600 py-4">No hay registros médicos disponibles.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Renderizar entradas visibles */}
      {visibleEntries.map(([date, records]) => (
        <div key={date}>
          <h3 className="text-xs font-medium uppercase text-gray-500 ps-2 my-2">
            {date}
          </h3>
          {records.map(record => (
            <RecordItem 
              key={record.id} 
              record={record} 
              onEdit={onEdit} 
              onView={openDetails} 
            />
          ))}
        </div>
      ))}

      {/* Entradas colapsables */}
      {collapsibleEntries.length > 0 && (
        <CollapsibleRecords 
          entries={collapsibleEntries} 
          onEdit={onEdit}
          onView={openDetails}
        />
      )}

      {/* Diálogo de detalles */}
      <Dialog open={isDetailDialogOpen} onOpenChange={closeDetails}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Editar Registro Médico' : 'Detalles del Registro'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Modifica los campos necesarios' : 'Información completa del registro'}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <DetailField 
                label="Título" 
                value={isEditMode ? editData.title : selectedRecord.title} 
                onChange={v => handleEditChange('title', v)}
                editable={isEditMode}
              />
              
              <DetailField 
                label="Tipo" 
                value={isEditMode ? editData.type : selectedRecord.type} 
                onChange={v => handleEditChange('type', v)}
                editable={isEditMode}
              />
              
              <DetailField 
                label="Fecha" 
                value={format(new Date(selectedRecord.created_at), 'PPp', { locale: es })} 
                readOnly
              />
              
             <DetailTextarea 
    label="Descripción" 
    value={isEditMode ? editData.description : selectedRecord.description ?? ''} // Proporcionar un valor por defecto
    onChange={v => handleEditChange('description', v)}
    editable={isEditMode}
/>

<DetailTextarea 
    label="Anamnesis" 
    value={isEditMode ? editData.anamnesis : selectedRecord.anamnesis ?? ''} // Proporcionar un valor por defecto
    onChange={v => handleEditChange('anamnesis', v)}
    editable={isEditMode}
/>

<DetailTextarea 
    label="Comportamiento del Dolor" 
    value={isEditMode ? editData.pain_behavior : selectedRecord.pain_behavior ?? ''} // Proporcionar un valor por defecto
    onChange={v => handleEditChange('pain_behavior', v)}
    editable={isEditMode}
/>

            </div>
          )}

          <DialogFooter>
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    if (onEdit && selectedRecord) {
                      onEdit({ ...selectedRecord, ...editData });
                      closeDetails();
                    }
                  }}
                >
                  Guardar Cambios
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button onClick={closeDetails}>
                  Cerrar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente auxiliar para mostrar un registro
const RecordItem: React.FC<{ 
  record: MedicalRecord; 
  onEdit?: (r: MedicalRecord) => void;
  onView: (r: MedicalRecord) => void;
}> = ({ record, onEdit, onView }) => (
  <div className="flex gap-x-3">
    <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:bg-gray-200">
      <div className="relative z-10 size-7 flex justify-center items-center">
        <div className="size-2 rounded-full bg-gray-400" />
      </div>
    </div>
    
    <div className="grow pt-0.5 pb-8">
      <h3 className="flex gap-x-1.5 font-semibold text-gray-800">
        {record.type === 'consulta' && <ConsultationIcon />}
        {record.type === 'diagnostico' && <DiagnosisIcon />}
        {record.type === 'tratamiento' && <TreatmentIcon />}
        {record.type === 'otro' && <OtherIcon />}
        {record.title}
      </h3>
      
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
        {record.description || record.anamnesis || 'Sin descripción disponible'}
      </p>
      
      <div className="mt-2 flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-blue-600 hover:text-blue-800" 
          onClick={() => onView(record)}
        >
          <Eye className="mr-1 size-4" /> Ver
        </Button>
        
        {onEdit && (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-green-600 hover:text-green-800" 
            onClick={() => onEdit(record)}
          >
            <Pencil className="mr-1 size-4" /> Editar
          </Button>
        )}
      </div>
    </div>
  </div>
);

// Componente para registros colapsables
const CollapsibleRecords: React.FC<{ 
  entries: [string, MedicalRecord[]][];
  onEdit?: (r: MedicalRecord) => void;
  onView: (r: MedicalRecord) => void;
}> = ({ entries, onEdit, onView }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      {!isCollapsed && entries.map(([date, records]) => (
        <div key={date}>
          <h3 className="text-xs font-medium uppercase text-gray-500 ps-2 my-2">
            {date}
          </h3>
          {records.map(record => (
            <RecordItem 
              key={record.id} 
              record={record} 
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </div>
      ))}

      <div className="ps-2 -ms-px">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-blue-600 hover:underline"
        >
          {isCollapsed ? (
            <ChevronDown className="mr-1 size-4" />
          ) : (
            <ChevronUp className="mr-1 size-4" />
          )}
          {isCollapsed ? 'Mostrar más' : 'Mostrar menos'}
        </Button>
      </div>
    </>
  );
};

// Componente para campos editables
const DetailField: React.FC<{
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  readOnly?: boolean;
}> = ({ label, value = '', onChange, editable = false, readOnly = false }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label className="text-right">{label}:</Label>
    {editable && !readOnly ? (
      <Input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="col-span-3"
      />
    ) : (
      <Input
        value={value}
        readOnly
        className="col-span-3 bg-gray-100"
      />
    )}
  </div>
);

// Componente para áreas de texto editables
const DetailTextarea: React.FC<{
  label: string;
  value?: string | null; // Permitir null
  onChange?: (value: string) => void;
  editable?: boolean;
}> = ({ label, value = '', onChange, editable = false }) => {
  // Proporcionar un valor por defecto si value es null
  const displayValue = value ?? '';

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right pt-2">{label}:</Label>
      {editable ? (
        <Textarea
          value={displayValue}
          onChange={e => onChange?.(e.target.value)}
          className="col-span-3 min-h-20"
        />
      ) : (
        <div className="col-span-3 bg-gray-100 p-2 rounded min-h-20">
          {displayValue || 'No especificado'}
        </div>
      )}
    </div>
  );
};

