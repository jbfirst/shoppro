import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const formatMontant = (n) => Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' F'

export function exportVentesPDF(ventes) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.setTextColor(37, 99, 235)
  doc.text('ShopPro', 14, 18)

  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text('Rapport des ventes', 14, 26)

  doc.setFontSize(9)
  doc.setTextColor(150)
  doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR')}`, 14, 33)

  doc.setDrawColor(229, 231, 235)
  doc.line(14, 37, 196, 37)

  autoTable(doc, {
    startY: 42,
    head: [['Date', 'Client', 'Total', 'Statut']],
    body: ventes.map(v => [
      new Date(v.created_at).toLocaleDateString('fr-FR'),
      v.clients?.nom || '-',
      formatMontant(v.total),
      v.statut
    ]),
    headStyles: { fillColor: [37, 99, 235], fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { cellPadding: 4 },
  })

  const total = ventes.reduce((acc, v) => acc + Number(v.total), 0)
  const finalY = doc.lastAutoTable.finalY + 8
  doc.setFontSize(10)
  doc.setTextColor(37, 99, 235)
  doc.setFont(undefined, 'bold')
  doc.text(`Total general : ${formatMontant(total)}`, 14, finalY)

  doc.save(`ventes_${new Date().toISOString().slice(0, 10)}.pdf`)
}