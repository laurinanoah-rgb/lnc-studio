import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { InquiryRequest } from "@prisma/client";
import { formatDate, formatDateTime, formatTime } from "@/lib/format";

type EquipmentSnapshotEntry = { itemId: string; name: string; quantity: number; condition?: string | null };

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#111" },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666", marginBottom: 20 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: 700, marginBottom: 6 },
  row: { flexDirection: "row", marginBottom: 3 },
  label: { width: 140, color: "#555" },
  value: { flex: 1 },
  listItem: { marginBottom: 2 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 9, color: "#999" },
});

export function InquiryPdfDocument({ inquiry }: { inquiry: InquiryRequest }) {
  const equipment = Array.isArray(inquiry.equipmentRequest)
    ? (inquiry.equipmentRequest as unknown as EquipmentSnapshotEntry[])
    : [];
  const includedAccessories = Array.isArray(inquiry.includedAccessories)
    ? (inquiry.includedAccessories as unknown as string[])
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>PA-Boxen Anfrage – Details</Text>
        <Text style={styles.subtitle}>Eingegangen am {formatDateTime(inquiry.createdAt)}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontakt</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>
              {inquiry.firstName} {inquiry.lastName}
            </Text>
          </View>
          {inquiry.organization && (
            <View style={styles.row}>
              <Text style={styles.label}>Organisation</Text>
              <Text style={styles.value}>{inquiry.organization}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>E-Mail</Text>
            <Text style={styles.value}>{inquiry.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Telefon</Text>
            <Text style={styles.value}>{inquiry.phone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Termin & Ort</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Datum</Text>
            <Text style={styles.value}>{formatDate(inquiry.neededAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Uhrzeit</Text>
            <Text style={styles.value}>{formatTime(inquiry.neededAt)} Uhr</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dauer</Text>
            <Text style={styles.value}>{inquiry.days} Tag(e)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse</Text>
            <Text style={styles.value}>{inquiry.eventAddress}</Text>
          </View>
        </View>

        {inquiry.eventDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beschreibung</Text>
            <Text>{inquiry.eventDescription}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gewünschte Ausstattung</Text>
          {equipment.length === 0 && <Text>Keine zusätzliche Ausstattung ausgewählt.</Text>}
          {equipment.map((entry) => (
            <Text key={entry.itemId} style={styles.listItem}>
              • {entry.name} × {entry.quantity}
              {entry.condition ? ` (${entry.condition})` : ""}
            </Text>
          ))}
        </View>

        {includedAccessories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Immer inklusive Ausstattung</Text>
            {includedAccessories.map((name) => (
              <Text key={name} style={styles.listItem}>
                • {name}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zustimmungen & Status</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Haftung akzeptiert</Text>
            <Text style={styles.value}>{inquiry.liabilityAccepted ? "Ja" : "Nein"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Datenschutz akzeptiert</Text>
            <Text style={styles.value}>{inquiry.privacyAccepted ? "Ja" : "Nein"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{inquiry.status}</Text>
          </View>
        </View>

        <Text style={styles.footer}>LNC Community – PA-Boxen Anfrage-Dokumentation · Anfrage-ID: {inquiry.id}</Text>
      </Page>
    </Document>
  );
}
