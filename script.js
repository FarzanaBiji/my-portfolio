/* =====================================================
   FARZANA BIJI — script.js
   ===================================================== */

'use strict';

// ═══════════════════════════════════════════════════
//  LOADER
// ═══════════════════════════════════════════════════
const loader     = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderText = document.getElementById('loaderText');

const loadSteps = ['Initializing...','Loading assets...','Almost there...','Welcome!'];
let loadPct = 0;
const loadInterval = setInterval(() => {
  loadPct += Math.random() * 18 + 8;
  if(loadPct >= 100){ loadPct = 100; clearInterval(loadInterval); }
  loaderFill.style.width = loadPct + '%';
  loaderText.textContent = loadSteps[Math.min(Math.floor(loadPct/30), loadSteps.length-1)];
  if(loadPct >= 100){
    setTimeout(()=>{ loader.classList.add('hidden'); initAll(); }, 500);
  }
}, 120);

// ═══════════════════════════════════════════════════
//  PARTICLE CANVAS BACKGROUND
// ═══════════════════════════════════════════════════
function initCanvas(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COLORS = ['rgba(124,111,255,', 'rgba(34,211,238,', 'rgba(244,114,182,'];

  function resize(){
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor(){this.reset(true)}
    reset(rand=false){
      this.x  = Math.random()*W;
      this.y  = rand ? Math.random()*H : H + 10;
      this.r  = Math.random()*1.5 + 0.3;
      this.vy = -(Math.random()*0.4 + 0.1);
      this.vx = (Math.random()-0.5)*0.15;
      this.a  = Math.random()*0.6 + 0.1;
      this.c  = COLORS[Math.floor(Math.random()*COLORS.length)];
    }
    update(){
      this.x += this.vx; this.y += this.vy;
      if(this.y < -5) this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.c + this.a + ')';
      ctx.fill();
    }
  }

  resize();
  for(let i=0;i<120;i++) particles.push(new Particle());

  // draw connecting lines
  function drawLines(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.strokeStyle=`rgba(124,111,255,${0.08*(1-dist/120)})`;
          ctx.lineWidth=0.5;
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  let animId;
  function loop(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{p.update();p.draw()});
    drawLines();
    animId = requestAnimationFrame(loop);
  }
  loop();
  window.addEventListener('resize',()=>{resize();});
}

// ═══════════════════════════════════════════════════
//  CUSTOM CURSOR
// ═══════════════════════════════════════════════════
function initCursor(){
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if(!dot || !ring) return;

  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e=>{
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
  });

  // smooth ring follow
  function followRing(){
    rx += (mx-rx)*0.1; ry += (my-ry)*0.1;
    ring.style.left = rx+'px'; ring.style.top  = ry+'px';
    requestAnimationFrame(followRing);
  }
  followRing();

  // hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a,button,.tilt-card,.proj-card,.skill-category');
  hoverEls.forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave',()=>{dot.style.opacity='0';ring.style.opacity='0'});
  document.addEventListener('mouseenter',()=>{dot.style.opacity='1';ring.style.opacity='1'});
}

// ═══════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════
function initNav(){
  const nav      = document.getElementById('nav');
  const progress = document.getElementById('navProgress');
  const toggle   = document.getElementById('navToggle');
  const menu     = document.getElementById('navMenu');

  window.addEventListener('scroll',()=>{
    const scrolled = window.scrollY;
    nav.classList.toggle('scrolled', scrolled > 60);

    // progress bar
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (scrolled/docH*100) + '%';

    // back-to-top
    document.getElementById('backTop').classList.toggle('visible', scrolled > 400);

    // active nav
    updateActiveNav();
  });

  // hamburger
  toggle.addEventListener('click',()=>{
    menu.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    if(menu.classList.contains('open')){
      spans[0].style.transform='rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity='0';
      spans[2].style.transform='rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s=>{s.style.transform='';s.style.opacity=''});
    }
  });

  menu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      menu.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity=''});
    });
  });
}

function updateActiveNav(){
  const sections = document.querySelectorAll('section[id]');
  let cur='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-130) cur=s.id});
  document.querySelectorAll('.nav-item').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href')==='#'+cur);
  });
}

// ═══════════════════════════════════════════════════
//  TYPING EFFECT
// ═══════════════════════════════════════════════════
function initTyping(){
  const el = document.getElementById('heroTyped');
  if(!el) return;
  const words = ['Full-Stack Developer','React Specialist','Python Developer','UI/UX Enthusiast','Open-Source Lover','Problem Solver'];
  let wi=0, ci=0, del=false;
  function tick(){
    const word = words[wi];
    el.textContent = del ? word.slice(0,ci-1) : word.slice(0,ci+1);
    del ? ci-- : ci++;
    if(!del && ci===word.length){ del=true; setTimeout(tick,1800); return; }
    if(del && ci===0){ del=false; wi=(wi+1)%words.length; }
    setTimeout(tick, del?55:90);
  }
  tick();
}

// ═══════════════════════════════════════════════════
//  COUNTER ANIMATION
// ═══════════════════════════════════════════════════
function initCounters(){
  const els = document.querySelectorAll('.hstat-num[data-count]');
  if(!els.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const target = +e.target.dataset.count;
      let cur=0, step=target/40;
      const t = setInterval(()=>{
        cur += step;
        if(cur>=target){cur=target;clearInterval(t);}
        e.target.textContent = Math.floor(cur);
      },40);
      obs.unobserve(e.target);
    });
  },{threshold:0.5});
  els.forEach(el=>obs.observe(el));
}

// ═══════════════════════════════════════════════════
//  SCROLL REVEAL (AOS)
// ═══════════════════════════════════════════════════
function initAOS(){
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const delay = +(e.target.dataset.aosDelay||0);
        setTimeout(()=>e.target.classList.add('aos-animate'), delay);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  els.forEach(el=>obs.observe(el));
}

// ═══════════════════════════════════════════════════
//  SKILL BARS
// ═══════════════════════════════════════════════════
function initSkillBars(){
  const fills = document.querySelectorAll('.sci-fill[data-w]');
  if(!fills.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        setTimeout(()=>{ e.target.style.width = e.target.dataset.w + '%'; }, 200);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.1});
  fills.forEach(f=>obs.observe(f));
}

// ═══════════════════════════════════════════════════
//  3D TILT EFFECT
// ═══════════════════════════════════════════════════
function initTilt(){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top  - rect.height/2;
      const tiltX = -(y/rect.height)*10;
      const tiltY =  (x/rect.width )*10;
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='perspective(900px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition='transform .5s cubic-bezier(.25,0,.25,1)';
    });
    card.addEventListener('mouseenter',()=>{ card.style.transition='transform .1s'; });
  });
}

// ═══════════════════════════════════════════════════
//  HERO CARD PARALLAX (mouse)
// ═══════════════════════════════════════════════════
function initHeroParallax(){
  const wrap = document.getElementById('heroCard');
  if(!wrap) return;
  document.addEventListener('mousemove', e=>{
    const x = (e.clientX/window.innerWidth  - 0.5)*14;
    const y = (e.clientY/window.innerHeight - 0.5)*14;
    wrap.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
}

// ═══════════════════════════════════════════════════
//  BACK TO TOP
// ═══════════════════════════════════════════════════
function initBackTop(){
  document.getElementById('backTop')?.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:'smooth'});
  });
}

// ═══════════════════════════════════════════════════
//  CONTACT FORM — Formspree AJAX
// ═══════════════════════════════════════════════════
function initForm(){
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('cformBtn');
  const success = document.getElementById('cformSuccess');
  const error   = document.getElementById('cformError');
  const cemail  = document.getElementById('cemail');
  const replyto = document.getElementById('replyto');

  if(!form) return;

  if(cemail && replyto){
    cemail.addEventListener('input',()=>{ replyto.value = cemail.value; });
  }

  form.addEventListener('submit', async e=>{
    e.preventDefault();
    success.classList.remove('show');
    error.classList.remove('show');

    btn.querySelector('.btn-text').style.display='none';
    btn.querySelector('.btn-loading').style.display='flex';
    btn.disabled=true;

    try{
      const res = await fetch(form.action,{
        method:'POST', body:new FormData(form),
        headers:{'Accept':'application/json'}
      });
      if(res.ok){
        success.classList.add('show');
        form.reset();
        success.scrollIntoView({behavior:'smooth',block:'nearest'});
      } else { error.classList.add('show'); }
    } catch(err){ error.classList.add('show'); }
    finally{
      btn.querySelector('.btn-text').style.display='flex';
      btn.querySelector('.btn-loading').style.display='none';
      btn.disabled=false;
    }
  });
}

// ═══════════════════════════════════════════════════
//  SMOOTH SCROLL for anchor links
// ═══════════════════════════════════════════════════
function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
    });
  });
}

// ═══════════════════════════════════════════════════
//  INIT ALL
// ═══════════════════════════════════════════════════
function initAll(){
  initCanvas();
  initCursor();
  initNav();
  initTyping();
  initCounters();
  initAOS();
  initSkillBars();
  initTilt();
  initHeroParallax();
  initBackTop();
  initForm();
  initSmoothScroll();
}
