/* =========================================================
   리디아 디자인 — 공통 스크립트
   ---------------------------------------------------------
   [여기 한 곳만 고치면 됩니다]
   대표 이메일과 채널 주소를 입력하면, 모든 페이지의
   문의 버튼·푸터·문의 페이지에 자동으로 반영됩니다.
   비워 두면 해당 버튼은 화면에 나타나지 않습니다.
   ========================================================= */
const SITE = {
  email: 'donghywagirl@naver.com',
  blog: 'https://blog.naver.com/donghywagirl',   // 문의 블로그
  blog2: 'https://blog.naver.com/lydiadesign',   // 리디아 디자인 블로그
  kakao: '',      // 입력 필요: 카카오톡 채널 주소
  instagram: '',  // 입력 필요: 인스타그램 주소
  place: '',      // 입력 필요: 네이버 지도·플레이스 주소 (있는 분만)
  youtube: '',    // 입력 필요: 유튜브 주소
  mailSubject: '[리디아 디자인] 공간 기획 문의'
};

(function () {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  /* ---------- 상단 메뉴 ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    $$('.nav a').forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- 사진 자리: 파일이 없으면 빈 자리 틀 ---------- */
  const fileName = src => decodeURIComponent((src || '').split('/').pop().split('?')[0]);
  function watchImg(img, onOk, onFail) {
    const ok = () => onOk && onOk(img);
    const fail = () => onFail && onFail(img);
    if (img.complete) { (img.naturalWidth > 0 ? ok : fail)(); }
    else { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', fail, { once: true }); }
  }
  $$('img[data-ph]').forEach(img => {
    const box = img.closest('.media');
    if (box) box.setAttribute('data-label', '사진 자리 · ' + fileName(img.getAttribute('src')));
    watchImg(img, () => box && box.classList.remove('is-empty'), () => box && box.classList.add('is-empty'));
  });
  // 없어도 되는 이미지(로고·아이콘): 없으면 숨김
  $$('img[data-optional]').forEach(img => {
    watchImg(img, () => {
      const brand = img.closest('.brand');
      if (brand) brand.classList.add('has-logo');
    }, () => img.remove());
  });
  // 영상 자리: 영상이 있으면 재생, 없으면 사진 또는 빈 자리 틀
  $$('video[data-ph]').forEach(v => {
    const box = v.closest('.media');
    const ok = () => { v.classList.add('is-playing'); box && box.classList.add('has-video'); };
    if (v.readyState >= 2) ok(); else v.addEventListener('loadeddata', ok, { once: true });
    v.addEventListener('error', () => v.remove(), { once: true });
  });

  /* ---------- 첫 화면: hero.jpg / hero.mp4가 있으면 hero--media ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const himg = hero.querySelector('#hero-img');
    const hvid = hero.querySelector('#hero-video');
    const media = hero.querySelector('.hero-media');
    if (himg) watchImg(himg, () => hero.classList.add('hero--media'), () => { himg.style.visibility = 'hidden'; });
    if (hvid) {
      const ok = () => { hero.classList.add('hero--media'); media.classList.add('has-video'); };
      if (hvid.readyState >= 2) ok(); else hvid.addEventListener('loadeddata', ok, { once: true });
      hvid.addEventListener('error', () => hvid.remove(), { once: true });
      const src = hvid.querySelector('source');
      if (src) src.addEventListener('error', () => hvid.remove(), { once: true });
    }
  }

  /* ---------- 연락처·채널 적용 ---------- */
  const mailHref = SITE.email ? 'mailto:' + SITE.email + '?subject=' : '';
  $$('.js-mail').forEach(a => {
    if (!SITE.email) return; // 이메일이 없으면 문의 페이지로 연결된 상태 유지
    const subject = a.dataset.subject ? '[리디아 디자인] ' + a.dataset.subject + ' 문의' : SITE.mailSubject;
    a.href = mailHref + encodeURIComponent(subject);
    if (a.dataset.mailText) a.textContent = a.dataset.mailText;
  });
  $$('[data-if-email]').forEach(el => { el.hidden = !SITE.email; });
  $$('[data-if-no-email]').forEach(el => { el.hidden = !!SITE.email; });
  $$('[data-contact-email]').forEach(el => {
    el.textContent = SITE.email;
    if (el.tagName === 'A') el.href = 'mailto:' + SITE.email;
  });

  const ICONS = {
    kakao: '<path d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 6L6.5 20l3.6-2.2c.6.1 1.3.2 1.9.2 5 0 9-3.1 9-7s-4-7-9-7z"/>',
    blog: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
    place: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    youtube: '<rect x="3" y="5.5" width="18" height="13" rx="4"/><path d="M10.5 9.5v5l4-2.5z"/>'
  };
  ICONS.blog2 = ICONS.blog;
  const LABELS = { blog: '블로그 문의', blog2: '리디아 디자인 블로그', kakao: '카카오톡 채널', instagram: '인스타그램', place: '네이버 지도', youtube: '유튜브' };
  $$('[data-channels]').forEach(box => {
    let count = 0;
    Object.keys(LABELS).forEach(key => {
      if (!SITE[key]) return;
      count++;
      const a = document.createElement('a');
      a.className = 'channel';
      a.href = SITE[key]; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[key] + '</svg><span>' + LABELS[key] + '</span>';
      // images/icon-블로그 같은 아이콘 파일이 있으면 그것을 사용
      const probe = new Image();
      probe.onload = () => { const svg = a.querySelector('svg'); const i = document.createElement('img'); i.src = probe.src; i.alt = ''; svg.replaceWith(i); };
      probe.src = 'images/icon-' + (key === 'blog2' ? 'blog' : key) + '.png';
      box.appendChild(a);
    });
    const wrap = box.closest('[data-channels-wrap]');
    if (wrap) wrap.hidden = count === 0;
  });

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- 스크롤 등장 ---------- */
  $$('[data-stagger]').forEach(group => {
    Array.from(group.children).forEach((c, i) => {
      c.classList.add('reveal');
      c.style.transitionDelay = (i * 0.08) + 's';
    });
  });
  const revealEls = $$('.reveal, .reveal-img');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- 대형 이미지 띠: 천천히 다르게 움직임 ---------- */
  const para = $$('[data-parallax]');
  if (para.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      para.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 ~ 1
        el.style.transform = 'translate3d(0,' + (p * -40).toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  /* ---------- 작업물 사진: 있는 사진만 보여줌 ---------- */
  function probe(n) {
    return new Promise(res => {
      const i = new Image();
      i.onload = () => res(n); i.onerror = () => res(null);
      i.src = 'images/product-' + n + '.jpg';
    });
  }
  function figure(n, cls) {
    const f = document.createElement('figure');
    f.className = 'media media--zoom ' + (cls || '');
    f.style.margin = '0';
    f.innerHTML = '<img src="images/product-' + n + '.jpg" alt="리디아 디자인 작업물 사진 ' + n + '" loading="lazy" data-lightbox>';
    return f;
  }
  // 메뉴의 "작업물" 링크: 작업물 사진이 3장 이상일 때만 보임
  const navGallery = $$('.nav-gallery, .footer-gallery');
  if (navGallery.length) {
    Promise.all([1, 2, 3].map(probe)).then(r => {
      if (r.filter(Boolean).length >= 3) navGallery.forEach(a => { a.hidden = false; });
    });
  }
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  $$('[data-products]').forEach(box => {
    const [a, b] = box.dataset.products.split('-').map(Number);
    const type = box.dataset.type;
    Promise.all(range(a, b).map(probe)).then(list => {
      const found = list.filter(Boolean);
      const section = box.closest('[data-product-section]');
      if (!found.length) return;
      found.forEach((n, idx) => {
        if (type === 'highlight') {
          const item = document.createElement('div');
          item.className = 'hl-item reveal';
          const f = figure(n);
          item.appendChild(f);
          const num = document.createElement('p');
          num.className = 'hl-num'; num.setAttribute('aria-hidden', 'true');
          num.textContent = String(idx + 1).padStart(2, '0');
          item.appendChild(num);
          box.appendChild(item);
          requestAnimationFrame(() => item.classList.add('is-in'));
        } else {
          box.appendChild(figure(n));
        }
      });
      if (section) section.hidden = false;
      const empty = document.querySelector('[data-gallery-empty]');
      if (empty) empty.hidden = true;
      const group = document.querySelector('[data-products-group]');
      if (group) group.hidden = false;
    });
  });

  /* ---------- 확대 보기 (이전·다음) ---------- */
  let lb, lbImg, lbCount, list = [], cur = 0;
  function buildLb() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', '사진 크게 보기');
    const arrow = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
    lb.innerHTML = '<img alt=""><button class="lb-btn lb-close" aria-label="닫기">' + arrow('M6 6l12 12M18 6L6 18') + '</button>' +
      '<button class="lb-btn lb-prev" aria-label="이전 사진">' + arrow('M15 5l-7 7 7 7') + '</button>' +
      '<button class="lb-btn lb-next" aria-label="다음 사진">' + arrow('M9 5l7 7-7 7') + '</button><p class="lb-count"></p>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img'); lbCount = lb.querySelector('.lb-count');
    lb.querySelector('.lb-close').onclick = closeLb;
    lb.querySelector('.lb-prev').onclick = () => show(cur - 1);
    lb.querySelector('.lb-next').onclick = () => show(cur + 1);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }
  function show(i) {
    cur = (i + list.length) % list.length;
    lbImg.src = list[cur].src; lbImg.alt = list[cur].alt;
    lbCount.textContent = (cur + 1) + ' / ' + list.length;
  }
  function closeLb() { lb.classList.remove('is-open'); document.body.style.overflow = ''; }
  document.addEventListener('click', e => {
    const img = e.target.closest('[data-lightbox]') || (e.target.closest('.media') && e.target.closest('.media').querySelector('[data-lightbox]'));
    if (!img) return;
    if (!lb) buildLb();
    const scope = img.closest('[data-lb-scope]') || document;
    list = $$('[data-lightbox]', scope);
    lb.classList.add('is-open'); document.body.style.overflow = 'hidden';
    show(list.indexOf(img));
    lb.querySelector('.lb-close').focus();
  });
})();
