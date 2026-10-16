document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    reveals.forEach(item => observer.observe(item));
  } else {
    reveals.forEach(item => item.classList.add("visible"));
  }

  const progressBar = document.getElementById("progressBar");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressBar) progressBar.style.width = `${value}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });
  navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Ouvrir le menu");
  }));

  // Les marques hébergées à l'extérieur gardent un repère lisible si le CDN échoue.
  document.querySelectorAll(".tech-icon img").forEach((logo) => {
    const showFallback = () => {
      const label = logo.closest(".tech")?.dataset.tech || "?";
      const initials = { "Kali Linux": "KL", "Proxmox VE": "PX", "VirtualBox": "VB", "Wireshark": "WS", "MariaDB": "DB", "phpMyAdmin": "PM" };
      const fallback = document.createElement("span");
      fallback.className = "logo-fallback";
      fallback.textContent = initials[label] || label.slice(0, 2).toUpperCase();
      fallback.setAttribute("aria-hidden", "true");
      logo.replaceWith(fallback);
    };
    logo.addEventListener("error", showFallback, { once: true });
    if (logo.complete && logo.naturalWidth === 0) showFallback();
  });
});


// Interaction 3D légère : les cartes suivent discrètement le mouvement de la souris.
document.querySelectorAll('.tilt-card').forEach((card)=>{
  let frame=null;
  const reset=()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');card.classList.remove('is-tilting')};
  card.addEventListener('pointermove',(event)=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const rect=card.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    const maxX=card.classList.contains('visual-panel')?6:3.5;
    const maxY=card.classList.contains('visual-panel')?7:4.5;
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      card.style.setProperty('--rx',`${(-y*maxX).toFixed(2)}deg`);
      card.style.setProperty('--ry',`${(x*maxY).toFixed(2)}deg`);
      card.classList.add('is-tilting');
    });
  });
  card.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);reset()});
});


// Filtres de la section Compétences.
document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((btn) => {
      const active = btn === button;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.skill-group').forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !show);
    });
  });
});

// Halo discret sous la souris dans les cartes de compétences.
document.querySelectorAll('.skill-group').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});


// Contact sur GitHub Pages : compose un e-mail sans serveur ni service tiers.
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const subject = String(data.get('subject') || 'Contact depuis le portfolio');
  const message = String(data.get('message') || '').trim();
  if (!name || !email || !message) return;
  const body = `Bonjour Samy,\n\n${message}\n\n—\nDe : ${name}\nAdresse e-mail : ${email}\n(Message préparé depuis votre portfolio)`;
  const destination = 'samyb.pros@outlook.fr';
  const url = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
});
