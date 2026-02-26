const fs = require('node:fs');

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createSpreadsheetXml(rows) {
  const headers = ['Nome', 'Cognome', 'Codice Fiscale', 'Matricola', 'Totale Netto'];
  const allRows = [headers, ...rows.map((r) => [r.nome, r.cognome, r.codiceFiscale, r.matricola, r.totaleNetto])];

  const xmlRows = allRows
    .map((row) => {
      const cells = row
        .map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`)
        .join('');
      return `<Row>${cells}</Row>`;
    })
    .join('');

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="BustePaga">
  <Table>${xmlRows}</Table>
 </Worksheet>
</Workbook>`;
}

function writeExcelLikeFile(rows, outputPath) {
  const xml = createSpreadsheetXml(rows);
  fs.writeFileSync(outputPath, xml, 'utf8');
}

module.exports = { writeExcelLikeFile };
