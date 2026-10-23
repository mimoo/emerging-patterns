const base = document.body.dataset.base;
const dialog = document.querySelector('.search-dialog');
const input = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
const count = document.querySelector('#search-count');
let searchIndex;
let searchRequest;
function renderResults() {
  if (!searchIndex) return;
  const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = searchIndex.filter(p => terms.every(term => `${p.title} ${p.description} ${p.text}`.toLowerCase().includes(term)));
  results.replaceChildren();
  count.textContent = terms.length ? `${matches.length} ${matches.length === 1 ? 'pattern' : 'patterns'} found` : 'Explore all six patterns';
  for (const p of matches) {
    const a = document.createElement('a');
    a.href = `${base}patterns/${p.slug}/`;
    const title = document.createElement('strong');
    title.textContent = p.title;
    const description = document.createElement('span');
    description.textContent = p.description;
    a.append(title, description);
    results.append(a);
  }
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-search';
    empty.textContent = 'No patterns found. Try a broader term, such as “context” or “verification”.';
    results.append(empty);
  }
}
async function openSearch() {
  if (!dialog.open) dialog.showModal();
  input.focus();
  if (searchIndex) return renderResults();
  count.textContent = 'Loading the field guide…';
  try {
    searchRequest ||= fetch(`${base}assets/search-index.json`).then(r => { if (!r.ok) throw new Error('Search unavailable'); return r.json(); });
    searchIndex = await searchRequest;
    renderResults();
  } catch {
    searchRequest = null;
    count.textContent = 'Search could not load. Close and reopen to retry, or use the chapter navigation.';
  }
}
document.querySelector('.search-trigger').addEventListener('click', openSearch);
document.querySelector('#close-search').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog && e.clientX >= 0) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
input.addEventListener('input', renderResults);
input.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); results.querySelector('a')?.focus(); } if (e.key === 'Enter') results.querySelector('a')?.click(); });
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') closeMenu();
});
const menu = document.querySelector('#menu-toggle');
const scrim = document.querySelector('.menu-scrim');
function closeMenu() { document.body.classList.remove('menu-open'); menu.setAttribute('aria-expanded','false'); scrim.hidden = true; }
menu.addEventListener('click', () => { const opened = document.body.classList.toggle('menu-open'); menu.setAttribute('aria-expanded', String(opened)); scrim.hidden = !opened; });
scrim.addEventListener('click', closeMenu);
document.querySelectorAll('.copy-code').forEach(button => button.addEventListener('click', async () => {
  const text = button.closest('.code-block').querySelector('code').textContent;
  try { await navigator.clipboard.writeText(text); button.textContent = 'Copied!'; }
  catch { button.textContent = 'Select to copy'; const range = document.createRange(); range.selectNodeContents(button.closest('.code-block').querySelector('code')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
  setTimeout(() => button.textContent = 'Copy', 2000);
}));
const sections = document.querySelectorAll('.prose > section');
if (sections.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => { for (const entry of entries) { if (!entry.isIntersecting) continue; document.querySelectorAll('.toc a').forEach(a => { const active = a.hash === `#${entry.target.id}`; a.classList.toggle('current', active); if (active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); }); } }, {rootMargin:'-10% 0px -65% 0px'});
  sections.forEach(section => observer.observe(section));
}
