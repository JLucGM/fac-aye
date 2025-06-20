// ClosuresPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { usePage } from '@inertiajs/react';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  }
});

export default function ClosuresPDF() {
    // Obtenemos datos directamente del servidor
    const { consultas } = usePage().props;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Reporte Diario - {new Date().toLocaleDateString()}</Text>
                {consultas?.map((consulta, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <Text>Consulta #{index + 1}</Text>
                        <Text>Fecha: {new Date(consulta.created_at).toLocaleString()}</Text>
                        {/* Agrega más campos según necesites */}
                    </View>
                ))}
            </Page>
        </Document>
    );
}
