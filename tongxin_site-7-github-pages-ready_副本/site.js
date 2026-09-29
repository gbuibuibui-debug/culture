(() => {
  const qs = (s, p=document) => p.querySelector(s);
  const qsa = (s, p=document) => [...p.querySelectorAll(s)];

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('is-visible'); reveal.unobserve(e.target); } });
  }, {threshold:.12});
  qsa('.reveal').forEach(el => reveal.observe(el));

  qsa('.ink-hover').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX-r.left)/r.width)*100}%`);
      el.style.setProperty('--my', `${((e.clientY-r.top)/r.height)*100}%`);
    });
  });

  const dialog = qs('#museumDialog');
  if(dialog){
    const title = qs('[data-dialog-title]', dialog);
    const meta = qs('[data-dialog-meta]', dialog);
    const body = qs('[data-dialog-body]', dialog);
    const close = () => dialog.classList.remove('open');
    qsa('[data-dialog]').forEach(el => el.addEventListener('click', () => {
      title.textContent = el.dataset.title || '';
      meta.textContent = el.dataset.meta || '';
      const tpl = el.dataset.dialogId ? document.getElementById(el.dataset.dialogId) : null;
      body.innerHTML = tpl ? tpl.innerHTML : (el.dataset.body || '');
      dialog.classList.add('open');
    }));
    qs('.dialog-close', dialog)?.addEventListener('click', close);
    dialog.addEventListener('click', e => { if(e.target === dialog) close(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
  }

  qsa('[data-scroll]').forEach(el => el.addEventListener('click', () => {
    const target = qs(el.dataset.scroll);
    target?.scrollIntoView({behavior:'smooth', block:'start'});
  }));

  qsa('.play-seal').forEach(btn => {
    const frame = btn.closest('.video-frame');
    const video = frame ? qs('video.real-video', frame) : null;
    const label = frame ? qs('.video-label', frame) : null;

    const reset = () => {
      frame?.classList.remove('playing');
      btn.textContent = '▶';
      if (label) label.textContent = frame?.dataset.label || 'AI 主题短片';
    };

    if (video) {
      video.addEventListener('ended', reset);
      video.addEventListener('pause', () => {
        if (video.currentTime < video.duration) {
          frame.classList.remove('playing');
          btn.textContent = '▶';
        }
      });
      video.addEventListener('click', () => btn.click());
    }

    btn.addEventListener('click', async () => {
      if (!frame) return;
      if (video) {
        if (video.paused) {
          try {
            await video.play();
            frame.classList.add('playing');
            btn.textContent = '暂停';
          } catch (err) {
            reset();
            if (label) label.textContent = '请再次点击播放';
          }
        } else {
          video.pause();
          reset();
        }
      } else {
        frame.classList.toggle('playing');
        btn.textContent = frame.classList.contains('playing') ? '暂停' : '▶';
      }
    });
  });

  qsa('.festival-node, .dance-node').forEach(node => node.addEventListener('click', () => {
    const id = node.dataset.target;
    if(id) qs(id)?.scrollIntoView({behavior:'smooth', block:'center'});
  }));
})();
