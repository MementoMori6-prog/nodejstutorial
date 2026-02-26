const test = require('node:test');
const assert = require('node:assert/strict');
const { parsePayslipText } = require('../src/payslipParser');

test('estrae i campi richiesti da una busta paga', () => {
  const text = `
    Cognome TEST1 Nome TEST2
    Matricola 5008
    Cod Fisc RSSMRA80A01H501U
    Totale Netto: 1452,20
  `;

  const result = parsePayslipText(text);

  assert.equal(result.nome, 'TEST2');
  assert.equal(result.cognome, 'TEST1');
  assert.equal(result.codiceFiscale, 'RSSMRA80A01H501U');
  assert.equal(result.matricola, '5008');
  assert.equal(result.totaleNetto, '1452,20');
});
