document.getElementById('year').textContent = new Date().getFullYear();

function setupToggleList(listId, btnId, limit) {
  const list = document.getElementById(listId);
  let btn = document.getElementById(btnId);
  if (!list) return;
  const items = Array.from(list.children);
  if (!btn && items.length > limit) {
    btn = document.createElement('button');
    btn.id = btnId;
    btn.className = 'btn-lite';
    btn.textContent = 'Show more ▾';
    btn.setAttribute('aria-expanded', 'false');
    list.parentElement.appendChild(btn);
  }
  if (!btn) return;
  let collapsed = true;
  function apply() {
    items.forEach((li, i) => {
      const hide = collapsed && i >= limit;
      li.style.display = hide ? 'none' : '';
      // ensure reveal animation fires when item becomes visible
      if (!hide) li.classList.add('visible');
    });
    btn.textContent = collapsed ? 'Show more ▾' : 'Show less ▴';
    btn.setAttribute('aria-expanded', String(!collapsed));
  }
  apply();
  btn.addEventListener('click', () => { collapsed = !collapsed; apply(); });
}

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Nav active state: click + scroll-spy
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
const sections = Array.from(document.querySelectorAll('main section[id], aside section[id]'));
if (sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  sections.forEach(s => observer.observe(s));
}

// Confetti burst for awards/scholarships
(function(){
  const targets = document.querySelectorAll('.awards li, .scholar li');
  if(!targets.length) return;
  const rand = (min,max)=> Math.random()*(max-min)+min;
  const burst = (el, x, y, count=12)=>{
    const rect = el.getBoundingClientRect();
    const baseX = (x ?? rect.width/2);
    const baseY = (y ?? rect.height/2);
    for(let i=0;i<count;i++){
      const span = document.createElement('span');
      span.className = 'confetti '+(Math.random()<.5?'circle':'')+' '+(['c1','c2','c3'][Math.floor(Math.random()*3)]);
      span.style.left = baseX+'px';
      span.style.top  = baseY+'px';
      span.style.setProperty('--x','0px');
      span.style.setProperty('--y','0px');
      span.style.setProperty('--dx', (rand(-60,60))+'px');
      span.style.setProperty('--rise', (rand(70,130))+'px');
      span.style.setProperty('--rot', (rand(180,540))+'deg');
      const dur = 650 + Math.random()*500;
      span.style.animation = `congratsUp ${dur}ms ease-out forwards`;
      el.appendChild(span);
      setTimeout(()=> span.remove(), dur+80);
    }
  };
  targets.forEach(li=>{
    li.style.position = li.style.position || 'relative';
    let last = 0;
    li.addEventListener('mouseenter', (e)=>{
      const now = performance.now();
      if(now - last < 1200) return;
      last = now;
      const rect = li.getBoundingClientRect();
      burst(li, e.clientX - rect.left, e.clientY - rect.top, 12);
    });
  });
})();

// Modal helper
function openModal(titleText, bodyHTML) {
  const overlay = document.createElement('div');
  overlay.className = 'animal-modal-overlay';
  overlay.innerHTML = `
    <div class="animal-modal">
      <button class="animal-modal-close" aria-label="Close">&times;</button>
      <div class="animal-modal-title">${titleText}</div>
      <div class="animal-modal-body">${bodyHTML}</div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('.animal-modal-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
  });
}
