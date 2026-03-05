import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Consultation, Patient } from '@/types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    paddingBottom: 60, // Espacio para el footer fijo
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottom: '2px solid #000',
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerLeft: {
    width: '30%',
  },
  headerCenter: {
    width: '40%',
    textAlign: 'center',
  },
  headerRight: {
    width: '50%',
    textAlign: 'right',
    fontSize: 10,
  },
  logo: {
    maxWidth: 150,
    maxHeight: 60,
    objectFit: 'contain',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  patientInfo: {
    marginBottom: 20,
    fontSize: 10,
    border: '1px solid #ccc',
    padding: 10,
  },
  patientInfoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  patientInfoLabel: {
    width: '20%',
    fontWeight: 'bold',
  },
  patientInfoValue: {
    width: '80%',
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
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: '#f2f2f2',
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    textAlign: 'center',
    fontSize: 9,
  },
  signatureImage: {
    width: 60,
    height: 'auto',
    maxHeight: 20,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    borderTop: '1px solid #000',
    paddingTop: 5,
    color: '#555',
  },
});

const ConsultationPDF = ({
  consultations,
  patient,
  settings,
  logoUrl,
  signatureUrl,
}: {
  consultations: Consultation[];
  patient: Patient;
  settings: any;
  logoUrl: string | null;
  signatureUrl: string | null;
}) => {
  const generationDate = new Date().toLocaleDateString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Cabecera con logo, título y fecha */}
        <View style={styles.header}>
          {/* <View style={styles.headerLeft}>
            {logoUrl && (
              <Image src={logoUrl} style={styles.logo} />
            )}
          </View> */}
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Reporte de Asistencias del Paciente</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Fecha: {generationDate}</Text>
          </View>
        </View>

        {/* Información del paciente */}
        <View style={styles.patientInfo}>
          <Text style={styles.sectionTitle}>Información del Paciente</Text>
          <View style={styles.patientInfoRow}>
            <Text style={styles.patientInfoLabel}>C.I:</Text>
            <Text style={styles.patientInfoValue}>{patient.identification}</Text>
          </View>
          <View style={styles.patientInfoRow}>
            <Text style={styles.patientInfoLabel}>Nombre:</Text>
            <Text style={styles.patientInfoValue}>{patient.name} {patient.lastname}</Text>
          </View>
          <View style={styles.patientInfoRow}>
            <Text style={styles.patientInfoLabel}>Email:</Text>
            <Text style={styles.patientInfoValue}>{patient.email}</Text>
          </View>
          <View style={styles.patientInfoRow}>
            <Text style={styles.patientInfoLabel}>Teléfono:</Text>
            <Text style={styles.patientInfoValue}>{patient.phone}</Text>
          </View>
          <View style={styles.patientInfoRow}>
            <Text style={styles.patientInfoLabel}>Dirección:</Text>
            <Text style={styles.patientInfoValue}>{patient.address}</Text>
          </View>
        </View>

        {/* Tabla de asistencias */}
        <View style={styles.table}>
          {/* Cabecera de la tabla */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>C.I</Text>
            <Text style={styles.tableColHeader}>Nombre</Text>
            <Text style={styles.tableColHeader}>Apellido</Text>
            <Text style={styles.tableColHeader}>Fecha</Text>
            <Text style={styles.tableColHeader}>Estado de Pago</Text>
            <Text style={styles.tableColHeader}>Firma</Text>
          </View>

          {/* Filas de consultas */}
          {consultations.map((consulta) => (
            <View key={consulta.id} style={styles.tableRow}>
              <Text style={styles.tableCol}>{patient.identification}</Text>
              <Text style={styles.tableCol}>{patient.name}</Text>
              <Text style={styles.tableCol}>{patient.lastname}</Text>
              <Text style={styles.tableCol}>
                {new Date(consulta.created_at).toLocaleString('es-VE')}
              </Text>
              <Text style={styles.tableCol}>{consulta.payment_status}</Text>
              <View style={styles.tableCol}>
                {signatureUrl && (
                  <Image src={signatureUrl} style={styles.signatureImage} />
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Pie de página fijo (aparece en todas las páginas) */}
        <View style={styles.footer} fixed>
          {settings && (
            <Text>
              Dirección: {settings.direction} | Teléfono: {settings.phone} | R.I.F: {settings.rif}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default ConsultationPDF;