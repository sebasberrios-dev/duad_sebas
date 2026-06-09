import jsPDF from "jspdf";
import { CatalogExercise } from "../features/catalog-exercise/types/catalog-exercise.types";
import { User } from "../types/interfaces";
import { generateCatalogReport } from "./catalog-report";
import { formatDate } from "./utilities";

export function downloadPdfReport(
  catalog: CatalogExercise[],
  users: User[],
): void {
  const doc = new jsPDF();
  const report = generateCatalogReport(catalog);
  let y = 20;

  doc.setFontSize(16);
  doc.text("FitTracker — Reporte del sistema", 14, y);
  y += 8;
  doc.setFontSize(9);
  doc.text(`Generado: ${formatDate(new Date())}`, 14, y);
  y += 14;

  doc.setFontSize(13);
  doc.text("Catálogo de ejercicios", 14, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(
    `Total: ${report.totals.total}  |  Locales: ${report.totals.local}  |  API: ${report.totals.api}`,
    14,
    y,
  );
  y += 10;

  for (const group of report.byCategory) {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.text(`${group.category} (${group.count})`, 14, y);
    y += 6;
    for (const ex of group.exercises) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(9);
      doc.text(`   • ${ex.exerciseName}  [${ex.source}]`, 14, y);
      y += 5;
    }
    y += 4;
  }

  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  y += 6;
  doc.setFontSize(13);
  doc.text("Perfiles de usuario", 14, y);
  y += 8;

  for (const user of users) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(10);
    doc.text(
      `• ${user.name}  |  ${user.level}  |  ${user.bodyWeight} kg  |  ${user.membership.plan}`,
      14,
      y,
    );
    y += 6;
  }

  doc.save("fittracker-reporte.pdf");
}
