const HEADER_OFFSET = 72;

export function scrollToSection(hash: string) {
  if (!import.meta.client) return;
  const raw = hash.replace(/^#/, '');
  const id = raw === 'countdown' ? 'about' : raw === 'why' ? 'apps' : raw;
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  history.replaceState(null, '', `#${id}`);
}

export function onNavClick(hash: string, e: MouseEvent) {
  e.preventDefault();
  scrollToSection(hash);
}
