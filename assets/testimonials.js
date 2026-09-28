/* Public Drive videos load only after a deliberate click. No autoplay. */
(() => {
 'use strict';
 const section = document.getElementById('experiencias');
 if (!section) return;
 const allowedIds = new Set(['1Q_4lVjyCBQPpJ1Ud6GBM3pDOlshMf8t8', '1reeALQQQOf2s2jyk-2CPe0FzQOXrpdCz', '1nYCGpGNZDl7MEoAmb_WHoVK1Q5cuUjLS']);
 section.querySelectorAll('.review-launch').forEach(link => {
  link.addEventListener('click', event => {
   if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
   const driveId = link.dataset.driveId;
   const media = link.closest('.review-media');
   if (!allowedIds.has(driveId) || !media) return;
   event.preventDefault();
   const frame = document.createElement('iframe');
   frame.src = `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`;
   frame.title = `Video: testimonio de ${link.dataset.person || 'Jumpers'}`;
   frame.allow = 'fullscreen; encrypted-media; picture-in-picture';
   frame.allowFullscreen = true;
   frame.referrerPolicy = 'strict-origin-when-cross-origin';
   frame.tabIndex = 0;
   media.replaceChildren(frame);
   frame.focus();
  });
 });
})();
