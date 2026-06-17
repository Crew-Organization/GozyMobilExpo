const fs = require('fs');
const code = fs.readFileSync('/Users/sandeepnaik/Desktop/GOZY_MOBILE/gozymobileOS/gozyapp/frontend/app/(travel)/(flights)/travel-review.tsx', 'utf8');

// Strip out { ... } blocks to avoid parsing {a < b} as JSX
let noBraces = code.replace(/\{[^}]+\}/g, '{}');

let tags = [];
let re = /<\/?([A-Z][a-zA-Z0-9]*)[^>]*>/g;
let match;
while ((match = re.exec(noBraces)) !== null) {
  let tagStr = match[0];
  let tagName = match[1];
  let isClosing = tagStr.startsWith('</');
  let isSelfClosing = tagStr.endsWith('/>');
  
  if (isSelfClosing) continue;
  
  if (isClosing) {
    if (tags.length > 0 && tags[tags.length - 1] === tagName) {
      tags.pop();
    } else {
      console.log(`Mismatch at line ${code.substring(0, match.index).split('\n').length}: Found </${tagName}> but expected </${tags[tags.length - 1]}>`);
      tags.pop(); // Try to recover
    }
  } else {
    tags.push(tagName);
  }
}
console.log('Remaining tags:', tags);
