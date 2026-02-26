const readline = require('node:readline');
const path = require('node:path');
const { runExtraction } = require('./extractPayslips');

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function printSuccess(result) {
  console.log('\n✅ Elaborazione completata.');
  console.log(`PDF elaborati: ${result.processedFiles}`);
  console.log(`File creato: ${path.resolve(result.outputPath)}`);
}

async function startLocalApp() {
  const [, , inputArg, outputArg] = process.argv;

  if (inputArg) {
    const result = runExtraction(inputArg, outputArg || './output/buste_paga.xls');
    printSuccess(result);
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log('=== Estrazione buste paga (modalità locale) ===');
    const inputPath = await askQuestion(rl, 'Percorso input (PDF o cartella): ');
    const outputPathRaw = await askQuestion(rl, 'Percorso output (.xls) [./output/buste_paga.xls]: ');
    const outputPath = outputPathRaw || './output/buste_paga.xls';

    const result = runExtraction(inputPath, outputPath);
    printSuccess(result);
  } catch (error) {
    console.error(`\n❌ Errore: ${error.message}`);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  startLocalApp();
}

module.exports = {
  askQuestion,
  startLocalApp,
};
