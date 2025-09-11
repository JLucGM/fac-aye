import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Consultation, Patient } from '@/types';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
    },
    header: {
        marginBottom: 20,
        borderBottom: '3px solid #000',
        paddingBottom: 10,
        textAlign: 'center',
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    table: {
        Display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '16.66%', // 1/6 del ancho total
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    tableCol: {
        width: '16.66%', // 1/6 del ancho total
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        textAlign: 'center',
        fontSize: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 10,
        borderTop: '1px solid #000',
        paddingTop: 5,
    },
});

const ConsultationPDF = ({ consultations, patient, settings, logoUrl, signatureUrl }: { consultations: Consultation[], patient: Patient, settings: any, logoUrl: string | null, signatureUrl: string | null }) => {
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    {logoUrl && (
                        <Image
                            src={logoUrl} // Usa el componente Image para mostrar el logo
                            style={{ width: 100, height: 'auto', marginBottom: 10 }} // Ajusta el tamaño según sea necesario
                        />
                    )}
                    
                    <Text style={{ fontSize: 12 }}>Nombre: {settings.name}</Text>
                    <Text style={{ fontSize: 12 }}>Dirección: {settings.direction}</Text>
                    <Text style={{ fontSize: 12 }}>Teléfono: {settings.phone} - RIF: {settings.rif}</Text>
                </View>

                <Text style={{ fontSize: 18, marginBottom: 10 }}>Reporte de Consultas del Paciente</Text>

                {patient && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14 }}>Información del Paciente:</Text>
                        <Text style={styles.text}>C.I: {patient.identification}</Text>
                        <Text style={styles.text}>Nombre y apellido: {patient.name} {patient.lastname}</Text>
                        <Text style={styles.text}>Email: {patient.email}</Text>
                        <Text style={styles.text}>Teléfono: {patient.phone}</Text>
                        <Text style={styles.text}>Dirección: {patient.address}</Text>
                    </View>
                )}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>C.I</Text>
                        <Text style={styles.tableColHeader}>Nombre</Text>
                        <Text style={styles.tableColHeader}>Apellido</Text>
                        <Text style={styles.tableColHeader}>Fecha Programada</Text>
                        <Text style={styles.tableColHeader}>Estado de Pago</Text>
                        <Text style={styles.tableColHeader}>Firma</Text>
                    </View>
                    {consultations.map((consulta) => (
                        <View key={consulta.id} style={styles.tableRow}>
                            <Text style={styles.tableCol}>{patient.identification}</Text>
                            <Text style={styles.tableCol}>{patient.name}</Text>
                            <Text style={styles.tableCol}>{patient.lastname}</Text>
                            <Text style={styles.tableCol}>{new Date(consulta.scheduled_at).toLocaleString()}</Text>
                            <Text style={styles.tableCol}>{consulta.payment_status}</Text>
                            {signatureUrl && (
                        <Image
                            src={signatureUrl} // Usa el componente Image para mostrar la firma
                            style={{ width: '80px', height: 'auto', marginBottom: 10 }} // Ajusta el tamaño según sea necesario
                        />
                    )}
                        </View>
                    ))}
                </View>
                {/* Pie de página con info de Setting */}
                <View style={styles.footer}>
                    <Text>Dirección: {settings.direction} - Teléfono: {settings.phone} - RIF: {settings.rif}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ConsultationPDF;
