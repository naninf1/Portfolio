// ===== PRELOADER =====
let pct = 0;
const fill = document.getElementById('loadFill');
const pctEl = document.getElementById('loadPct');
const loadTimer = setInterval(() => {
  pct += Math.random() * 18;
  if (pct >= 100) { pct = 100; clearInterval(loadTimer);
    setTimeout(() => document.getElementById('preloader').classList.add('done'), 350);
  }
  fill.style.width = pct + '%';
  pctEl.textContent = Math.floor(pct) + '%';
}, 140);

// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cDot'), ring = document.getElementById('cRing');
let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;
addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx-4}px,${my-4}px)`;
});
(function ringLoop(){
  rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
  ring.style.transform = `translate(${rx-19}px,${ry-19}px)`;
  requestAnimationFrame(ringLoop);
})();
document.querySelectorAll('a,button,.tilt,.proj,.skill-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='58px';ring.style.height='58px'});
  el.addEventListener('mouseleave',()=>{ring.style.width='38px';ring.style.height='38px'});
});

// ===== THREE.JS CRAZY 3D BG =====
try {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
  camera.position.z = 9;

  // particles
  const pGeo = new THREE.BufferGeometry();
  const COUNT = 1300;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const c1 = new THREE.Color(0x00e5ff), c2 = new THREE.Color(0xa855f7), c3 = new THREE.Color(0xff3df0);
  for (let i = 0; i < COUNT; i++) {
    pos[i*3] = (Math.random()-0.5)*30;
    pos[i*3+1] = (Math.random()-0.5)*18;
    pos[i*3+2] = (Math.random()-0.5)*14;
    const c = Math.random() < .45 ? c1 : Math.random() < .7 ? c2 : c3;
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.9 });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // wireframe shapes
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.7, 0.45, 140, 18),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.28 })
  );
  knot.position.set(5.4, 0.6, -2);
  scene.add(knot);

  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 1),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.35 })
  );
  ico.position.set(-5.6, -1.4, -1);
  scene.add(ico);

  const ring3d = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.02, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0xff3df0, transparent: true, opacity: 0.5 })
  );
  ring3d.position.set(5.4, 0.6, -2);
  ring3d.rotation.x = 1.1;
  scene.add(ring3d);

  let tx = 0, ty = 0;
  addEventListener('mousemove', e => {
    tx = (e.clientX / innerWidth - 0.5);
    ty = (e.clientY / innerHeight - 0.5);
  });
  addEventListener('scroll', () => {
    const s = scrollY / (document.body.scrollHeight - innerHeight);
    points.rotation.y = s * 2.2;
    knot.rotation.x = s * 3;
  }, { passive: true });

  const clock = new THREE.Clock();
  (function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    points.rotation.y = t * 0.04;
    points.rotation.x = Math.sin(t * 0.1) * 0.15 + ty * 0.4;
    knot.rotation.y = t * 0.25; knot.rotation.z = t * 0.12;
    knot.position.y = 0.6 + Math.sin(t * 0.8) * 0.4;
    ico.rotation.x = t * 0.3; ico.rotation.y = t * 0.4;
    ring3d.rotation.z = t * 0.3;
    camera.position.x += (tx * 1.6 - camera.position.x) * 0.04;
    camera.position.y += (-ty * 1.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
  addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
} catch(e) { console.warn('WebGL off', e); }

// ===== TYPING =====
const words = ['Spring Boot APIs.', 'Microservices.', 'Kafka Pipelines.', 'AWS Deployments.', 'Android Development'];
let wi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed');
(function type(){
  const w = words[wi];
  typedEl.textContent = w.slice(0, ci);
  if (!del) { ci++; if (ci > w.length) { del = true; setTimeout(type, 1300); return; } }
  else { ci--; if (ci === 0) { del = false; wi = (wi+1) % words.length; } }
  setTimeout(type, del ? 35 : 65);
})();

// ===== NAV / SCROLL =====
const navLinks = document.getElementById('navLinks');
document.getElementById('menuBtn').onclick = () => navLinks.classList.toggle('open');
navLinks.querySelectorAll('a').forEach(a => a.onclick = () => navLinks.classList.remove('open'));
addEventListener('scroll', () => {
  const h = document.documentElement;
  document.getElementById('scrollProgress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  document.getElementById('toTop').classList.toggle('show', scrollY > 600);
}, { passive: true });
document.getElementById('toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

// ===== GSAP REVEALS + COUNTERS =====
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
} else {
  document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
const counters = document.querySelectorAll('[data-count]');
const cObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, target = +el.dataset.count;
  let v = 0; const step = Math.max(1, Math.floor(target / 60));
  const t = setInterval(() => { v += step; if (v >= target) { v = target; clearInterval(t); } el.textContent = v + '+'; }, 30);
  cObs.unobserve(el);
}), { threshold: 0.6 });
counters.forEach(c => cObs.observe(c));

// ===== 3D TILT =====
function tilt(id, max = 12) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(8px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = 'rotateY(0) rotateX(0)');
}
tilt('heroTilt', 10); tilt('aboutTilt', 12);
document.querySelectorAll('.proj.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5, y = (e.clientY - r.top)/r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});
// skill glow follows mouse
document.querySelectorAll('.skill-card').forEach(c => c.addEventListener('mousemove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

// magnetic buttons
document.querySelectorAll('.magnetic').forEach(b => {
  b.addEventListener('mousemove', e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width/2)*0.2}px,${(e.clientY - r.top - r.height/2)*0.2}px)`;
  });
  b.addEventListener('mouseleave', () => b.style.transform = '');
});

// ===== PROJECT FILTERS =====
document.querySelectorAll('.fbtn').forEach(btn => btn.onclick = () => {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.f;
  document.querySelectorAll('#projGrid .proj').forEach(p => {
    const show = f === 'all' || p.dataset.tags.includes(f);
    p.style.display = show ? '' : 'none';
    if (show && window.gsap) gsap.fromTo(p, { opacity: 0, y: 20, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .45 });
  });
});

// ===== FAKE ACTIONS =====
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}
function runFake(e) {
  e.stopPropagation();
  toast('✅ Build successful — Portfolio.java executed in 42ms!');
}
function downloadResume() { toast('📄 Dummy resume — replace link with your real PDF in index.html'); }
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const n = document.getElementById('cfName').value.trim();
  toast(`🚀 Thanks ${n || 'there'}! Dummy form — connect it to Formspree/Web3Forms to receive mails.`);
  e.target.reset();
});
