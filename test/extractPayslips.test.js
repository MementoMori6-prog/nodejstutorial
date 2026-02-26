const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { runExtraction } = require('../src/extractPayslips');

test('runExtraction crea file xls con i dati principali', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'payslip-'));
  const inputPdf = path.join(tmpDir, 'cedolino.pdf');
  const outputXls = path.join(tmpDir, 'report.xls');

  fs.writeFileSync(
    inputPdf,
    '%PDF-1.4\n(Cognome TEST1 Nome TEST2)\n(Matricola 5008)\n(Cod Fisc RSSMRA80A01H501U)\n(Totale Netto: 1452,20)\n',
    'latin1'
  );

  const result = runExtraction(inputPdf, outputXls);
  const content = fs.readFileSync(outputXls, 'utf8');

  assert.equal(result.processedFiles, 1);
  assert.match(content, /TEST2/);
  assert.match(content, /TEST1/);
  assert.match(content, /RSSMRA80A01H501U/);
  assert.match(content, /1452,20/);
});
