const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
const section = html.match(/<section class="reviews-section"[\s\S]*?<\/section>/)?.[0];
assert(section, 'Review placeholder section must exist');
const cards = [...section.matchAll(/<article class="review-card"[\s\S]*?<\/article>/g)].map(m => m[0]);
assert.equal(cards.length, 5);
for (const [i, card] of cards.entries()) {
 const id = String(i + 1).padStart(2, '0');
 assert(card.includes(`data-review-id="${id}"`));
 assert(card.includes(`id="review-title-${id}"`));
 assert(card.includes('data-review-kind="illustrative"'));
 assert(card.includes('Ejemplo ilustrativo · No es un testimonio real'));
 assert(card.includes(`data-review-video="${id}" hidden`));
 assert(!/<(?:video|iframe|img|button)\b/i.test(card), 'No invented proof or inactive media controls');
}
assert(section.includes('no corresponden a clientes ni a resultados reales'));
assert(section.includes('data-start'));
assert(html.indexOf('id="sobre-jose"') < html.indexOf('id="experiencias"'));
assert(html.indexOf('id="experiencias"') < html.indexOf('<section class="section faq">'));
assert(html.includes('<link rel="stylesheet" href="assets/reviews.css">'));
assert(!/aggregateRating|ratingValue|"@type"\s*:\s*"Review"/.test(section));
new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
console.log('PASS: five explicitly fictional text cards; future video slots; correct section order; functional quiz CTA; no invented ratings; JS syntax unchanged.');
