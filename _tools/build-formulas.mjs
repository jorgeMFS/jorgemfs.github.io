// Gera assets/js/formulaSvgs.js: os SVG das fórmulas decorativas, pré-renderizados com MathJax,
// para o browser não ter de descarregar o MathJax (2 MB).
//
// Uso (precisa de `npm i mathjax-full` numa pasta qualquer):
//   node build-formulas.mjs /caminho/para/o/repo
// Volta a correr sempre que mudares as fórmulas (`tex:` / `map:`) em en/index.html, pt/index.html ou _layouts/docs.html.
import fs from 'fs';
import path from 'path';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

const root = process.argv[2];
if (!root) { console.error('uso: node build-formulas.mjs <repo>'); process.exit(1); }

const files = ['en/index.html', 'pt/index.html', '_layouts/docs.html'];
const lit = s => new Function('return ' + s)();
const tex = new Set();
for (const f of files) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  for (const m of src.matchAll(/tex:\s*(\[[^\]]*\])/g)) lit(m[1]).forEach(t => tex.add(t));
  for (const m of src.matchAll(/map:\s*(\{[^}]*\})/g)) Object.values(lit(m[1])).forEach(t => tex.add(t));
}

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const doc = mathjax.document('', {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: 'none' })   // cada SVG fica autónomo
});

const out = {};
for (const t of [...tex].sort()) {
  const svg = adaptor.innerHTML(doc.convert(t, { display: false })).replace(/\s*data-mml-node="[^"]*"/g, '');
  if (!svg.startsWith('<svg')) throw new Error('falhou: ' + t);
  out[t] = svg;
}
const target = path.join(root, 'assets/js/formulaSvgs.js');
fs.writeFileSync(target, '// GERADO por _tools/build-formulas.mjs, não editar à mão.\nwindow.FORMULA_SVGS = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length + ' fórmulas,', fs.statSync(target).size + ' bytes');
