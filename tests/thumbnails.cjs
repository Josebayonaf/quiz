const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'assets/reviews.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const person of ['ivan', 'andres', 'sara']) {
 const binding = `.review-card[data-review-id="${person}"] .review-launch{--review-poster:url("testimonials/${person}.webp")}`;
 assert(css.includes(binding), `Missing poster binding for ${person}`);
 assert(html.includes(`data-review-id="${person}"`), `Missing video card for ${person}`);
 const image = fs.readFileSync(path.join(root, 'assets/testimonials', person + '.webp'));
 assert.equal(image.subarray(0, 4).toString(), 'RIFF');
 assert.equal(image.subarray(8, 12).toString(), 'WEBP');
 assert(image.length > 4000 && image.length < 200000, `Unexpected thumbnail size for ${person}`);
}
assert(!/url\(\s*["']?(?:https?:)?\/\//i.test(css), 'Posters must use same-origin URLs');
assert(css.includes('background-size:cover'));
assert(css.includes('top:auto;right:18px;bottom:20px;transform:none'));
console.log('PASS: three real local WebP posters, correct card mappings, optimized sizes, and unobstructed play controls.');
