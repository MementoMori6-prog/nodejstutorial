const fs = require('node:fs');
const path = require('node:path');
const { extractPdfText } = require('./pdfTextExtractor');
const { parsePayslipText } = require('./payslipParser');
const { writeExcelLikeFile } = require('./excelWriter');

function collectPdfFiles(inputPath) {
  const stat = fs.statSync(inputPath);
  if (stat.isFile()) {
    if (!inputPath.toLowerCase().endsWith('.pdf')) {
      throw new Error('Il file di input deve essere un PDF.');
    }
    return [inputPath];
  }

  return fs
    .readdirSync(inputPath)
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .map((file) => path.join(inputPath, file));
}

function runExtraction(inputArg, outputArg) {
  const pdfFiles = collectPdfFiles(inputArg);

  if (pdfFiles.length === 0) {
    throw new Error('Nessun PDF trovato nella cartella specificata.');
  }

  const rows = pdfFiles.map((pdfPath) => {
    const rawText = extractPdfText(pdfPath);
    return parsePayslipText(rawText);
  });

  fs.mkdirSync(path.dirname(outputArg), { recursive: true });
  writeExcelLikeFile(rows, outputArg);

  return {
    outputPath: outputArg,
    processedFiles: pdfFiles.length,
  };
}

function main() {
  const [, , inputArg = './input', outputArg = './output/buste_paga.xls'] = process.argv;
  const result = runExtraction(inputArg, outputArg);

  console.log(`Creato file: ${result.outputPath}`);
  console.log(`PDF elaborati: ${result.processedFiles}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Errore:', error.message);
    process.exit(1);
  }
}

module.exports = { collectPdfFiles, runExtraction };
