# Estrazione campi da PDF buste paga

Programma Node.js per leggere uno o più file PDF di busta paga e creare un file Excel compatibile (`.xls`) con le colonne:

- Nome
- Cognome
- Codice Fiscale
- Matricola
- Totale Netto

## Requisiti

- Node.js 18+
- PDF **testuali** (non solo immagine scannerizzata)

> Nota: se il PDF è una scansione immagine pura, prima serve OCR (ad esempio con Tesseract), altrimenti il testo non è estraibile.

## Avvio rapido (interfaccia grafica)

Hai due opzioni:

1. Script eseguibile già pronto:

```bash
./bin/estrai-buste
```

2. Oppure via npm:

```bash
npm run gui
```

Si apre una GUI nel browser su `http://127.0.0.1:3210` dove inserire:

- percorso input (singolo PDF o cartella con PDF)
- percorso output `.xls`

## Uso da riga di comando (CLI)

Cartella input:

```bash
npm start -- ./input ./output/buste_paga.xls
```

Singolo file:

```bash
npm start -- ./input/busta1.pdf ./output/buste_paga.xls
```

## Output

Viene creato un file `output/buste_paga.xls` apribile direttamente con Excel.
