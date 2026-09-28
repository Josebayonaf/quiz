const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const section = html.match(/<section class="reviews-section"[\s\S]*?<\/section>/)?.[0];
assert(section, 'Reviews section exists');
const cards = [...section.matchAll(/<article class="review-card"[\s\S]*?<\/article>/g)].map(m=>m[0]);
assert.equal(cards.length,3);
const people = [['ivan','1Q_4lVjyCBQPpJ1Ud6GBM3pDOlshMf8t8'], ['andres','1reeALQQQOf2s2jyk-2CPe0FzQOXrpdCz'], ['sara','1nYCGpGNZDl7MEoAmb_WHoVK1Q5cuUjLS']];
for (const [index,[key,id]] of people.entries()) {
 assert(cards[index].includes(`data-review-id="${key}"`));
 assert(cards[index].includes(`data-drive-id="${id}"`));
 assert(cards[index].includes('data-review-kind="video"'));
 assert(cards[index].includes('Abrir video aparte'));
}
assert(!/ilustrativ|ficticio|Sección en preparación|Espacio para futuro video/.test(section));
assert(!/<blockquote|aggregateRating|ratingValue|USD|COP|dólares|5K al mes/.test(section));
assert(section.includes('no garantiza resultados similares'));
assert(section.includes('data-start'));
assert(html.indexOf('id="sobre-jose"') < html.indexOf('id="experiencias"'));
assert(html.indexOf('id="experiencias"') < html.indexOf('<section class="section faq">'));
assert(html.includes('src="assets/testimonials.js" defer'));
new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
new Function(fs.readFileSync(path.join(root,'assets/testimonials.js'),'utf8'));
console.log('PASS: three supplied video links; correct name associations; fallback links; fictional review content removed; no invented currency or time period; original quiz syntax intact.');
