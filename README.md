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

## Modalità locale consigliata (senza server web)

Questa modalità gira tutta in locale da terminale:

```bash
./bin/estrai-buste-locale
```

Oppure:

```bash
npm run local
```

Ti chiede interattivamente:

- percorso input (file PDF singolo o cartella)
- percorso output `.xls`

## Modalità GUI web locale (opzionale)

Se preferisci una pagina grafica nel browser, resta comunque in locale (`127.0.0.1`):

```bash
./bin/estrai-buste
# oppure npm run gui
```

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
