import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsPath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
let fileContent = fs.readFileSync(translationsPath, 'utf-8');

// I know that the clean definitions end around line 160.
// Let's grab everything up to the line before `// Translations for 100+ languages` the second time.

let lines = fileContent.split('\n');
let newLines = [];
let foundSecondComments = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Translations for 100+ languages') && i > 10) {
    // This is the duplicate. We stop here.
    break;
  }
  newLines.push(lines[i]);
}

// Now we need to append the `SUPPORTED_LANGUAGES` and `getTranslation` from the end of the file.
let supportedLangIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export const SUPPORTED_LANGUAGES')) {
    supportedLangIndex = i;
    break;
  }
}

if (supportedLangIndex !== -1) {
  // Add an empty line
  newLines.push('');
  // Append everything from SUPPORTED_LANGUAGES to the end
  for (let i = supportedLangIndex - 1; i < lines.length; i++) {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync(translationsPath, newLines.join('\n'));
console.log('Fixed translations.ts');
