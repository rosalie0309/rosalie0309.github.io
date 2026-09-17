// Portfolio — interactions (aucune dépendance)
(() => {
  const root = document.documentElement;

  // ----- Thème clair / sombre (mémorisé dans le navigateur) -----
  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ----- Menu mobile -----
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // ----- Bordure de la nav au scroll -----
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Onglets compétences -----
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    panels.forEach(p => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
  }));

  // ----- Apparition des blocs au scroll + lien actif dans la nav -----
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    const navLinks = [...links.querySelectorAll('a')];
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // ----- Formulaire de contact (FormSubmit, envoi sans recharger la page) -----
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.className = 'form__status';
    status.textContent = 'Envoi en cours…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.classList.add('ok');
      status.textContent = 'Merci ! Votre message a bien été envoyé.';
    } catch (err) {
      status.classList.add('err');
      status.innerHTML = 'Envoi impossible pour le moment. Écrivez-moi directement à <a href="mailto:rosaliecorinetomeyum@gmail.com">rosaliecorinetomeyum@gmail.com</a>.';
    } finally {
      btn.disabled = false;
    }
  });

  // ----- Année du footer -----
  document.getElementById('year').textContent = new Date().getFullYear();
})();
