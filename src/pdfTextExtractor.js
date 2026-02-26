const fs = require('node:fs');
const zlib = require('node:zlib');

function decodePdfString(str) {
  return str
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}

function extractParenthesisStrings(content) {
  const results = [];
  const regex = /\((?:\\.|[^\\)])*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const value = match[0].slice(1, -1);
    results.push(decodePdfString(value));
  }
  return results;
}

function extractStreams(buffer) {
  const pdf = buffer.toString('latin1');
  const streams = [];
  let idx = 0;
  while (true) {
    const streamPos = pdf.indexOf('stream', idx);
    if (streamPos === -1) break;
    const start = pdf.indexOf('\n', streamPos);
    if (start === -1) break;
    const end = pdf.indexOf('endstream', start);
    if (end === -1) break;

    const dictStart = Math.max(0, pdf.lastIndexOf('<<', streamPos));
    const dictEnd = pdf.indexOf('>>', dictStart);
    const dict = dictEnd !== -1 ? pdf.slice(dictStart, dictEnd + 2) : '';
    const raw = buffer.subarray(start + 1, end);
    const flate = /\/FlateDecode/.test(dict);

    streams.push({ raw, flate });
    idx = end + 'endstream'.length;
  }
  return streams;
}

function safeInflate(data) {
  try {
    return zlib.inflateSync(data).toString('latin1');
  } catch {
    return '';
  }
}

function extractPdfText(pdfPath) {
  const buffer = fs.readFileSync(pdfPath);
  const streams = extractStreams(buffer);
  const chunks = [];

  for (const stream of streams) {
    if (stream.flate) {
      const inflated = safeInflate(stream.raw);
      if (inflated) {
        chunks.push(...extractParenthesisStrings(inflated));
      }
    } else {
      const plain = stream.raw.toString('latin1');
      chunks.push(...extractParenthesisStrings(plain));
    }
  }

  if (chunks.length === 0) {
    const fallback = buffer.toString('latin1');
    chunks.push(...extractParenthesisStrings(fallback));
  }

  return chunks.join('\n');
}

module.exports = { extractPdfText };
