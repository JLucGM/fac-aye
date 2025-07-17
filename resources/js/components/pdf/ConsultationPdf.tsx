import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Consultation, Patient } from '@/types';
import AppLogoIcon from '../app-logo-icon';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
    },
    heading: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 14,
        marginBottom: 8,
        marginTop: 15,
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
    header: {
    marginBottom: 20,
    borderBottom: '3px solid #000',
    paddingBottom: 10,
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

const ConsultationPDF = ({ consultations, patient, settings, }: { consultations: Consultation[], patient: Patient, settings: any[] }) => {
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
          {settings.map((setting) => (
            <React.Fragment key={setting.id}>
              <Text style={{ fontSize: 12 }}>Nombre: {setting.name}</Text>
              <Text style={{ fontSize: 12 }}>Dirección: {setting.direction}</Text>
              <Text style={{ fontSize: 12 }}>Teléfono: {setting.phone} - RIF: {setting.rif}</Text>
            </React.Fragment>
          ))}
        </View>

                <Text style={styles.heading}>Reporte de Consultas del Paciente</Text>

                {patient && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.subheading}>Información del Paciente:</Text>
                        <Text style={styles.text}>Nombre: {patient.name} {patient.lastname}</Text>
                        <Text style={styles.text}>Email: {patient.email}</Text>
                        <Text style={styles.text}>Identificación: {patient.identification}</Text>
                    </View>
                )}
                <Text style={styles.subheading}>Reporte de Consultas</Text>
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
                            <Text style={styles.tableCol}></Text>
                        </View>
                    ))}
                </View>
                {/* Pie de página con info de Setting */}
        <View style={styles.footer}>
          {settings.map((setting) => (
            <React.Fragment key={setting.id}>
              <Text>Dirección: {setting.direction} - Teléfono: {setting.phone} - RIF: {setting.rif}</Text>
            </React.Fragment>
          ))}
        </View>
            </Page>
        </Document>
    );
};

export default ConsultationPDF;
