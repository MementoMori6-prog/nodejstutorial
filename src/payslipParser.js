const FIELD_PATTERNS = {
  cognome: [
    /\bCognome\s*[:\-]?\s*([A-ZÀ-Ü0-9'\s]+?)(?=\s+Nome\b|\n|$)/i,
  ],
  nome: [
    /\bNome\s*[:\-]?\s*([A-ZÀ-Ü0-9'\s]+?)(?=\s+Data\s*nascita\b|\s+Cod\s*Fisc\b|\n|$)/i,
  ],
  codiceFiscale: [
    /Cod\s*Fisc(?:ale)?\s*[:\-]?\s*([A-Z0-9]{4,16})/i,
  ],
  matricola: [
    /Matricola\s*[:\-]?\s*([A-Z0-9\/-]{1,20})/i,
  ],
  totaleNetto: [
    /Totale\s*Netto\s*[:\-]?\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})/i,
    /Totale\s*Netto\s*[:\-]?\s*([0-9]+(?:[\.,][0-9]{2})?)/i,
  ],
};

function normalizeSpaces(text) {
  return text
    .replace(/\r/g, '\n')
    .replace(/[\t\f]+/g, ' ')
    .replace(/\u0000/g, '')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
}

function cleanValue(value) {
  return value.replace(/\s{2,}/g, ' ').trim();
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return cleanValue(match[1]);
    }
  }
  return '';
}

function parsePayslipText(inputText) {
  const text = normalizeSpaces(inputText);

  return {
    nome: firstMatch(text, FIELD_PATTERNS.nome),
    cognome: firstMatch(text, FIELD_PATTERNS.cognome),
    codiceFiscale: firstMatch(text, FIELD_PATTERNS.codiceFiscale),
    matricola: firstMatch(text, FIELD_PATTERNS.matricola),
    totaleNetto: firstMatch(text, FIELD_PATTERNS.totaleNetto),
  };
}

module.exports = {
  parsePayslipText,
  normalizeSpaces,
};
