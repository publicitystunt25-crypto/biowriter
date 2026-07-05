import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 56,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 16,
  },
  body: {
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 56,
    right: 56,
    fontSize: 9,
    color: "#888888",
    textAlign: "center",
  },
});

export function BioDocument({ title, content }: { title: string; content: string }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{content}</Text>
        </View>
        <Text style={styles.footer}>Generated with Bio Writer for Artists</Text>
      </Page>
    </Document>
  );
}
