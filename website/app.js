const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.reveal').forEach((el) => {
  if (reduceMotion) return el.classList.add('visible');
  new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.disconnect(); }
  }, { threshold: .12 }).observe(el);
});

const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');
if (grid && window.SITE_CONTENT) {
  SITE_CONTENT.projects.forEach((project, index) => {
    const card = document.createElement('button');
    card.className = `project-card project-${project.color}`;
    card.innerHTML = `<span class="project-count">${String(index + 1).padStart(2,'0')}</span><span class="project-icon">${project.code}</span><span class="project-name">${project.name}</span><span class="project-desc">${project.description}</span><span class="platforms">${project.platforms.map(p => `<i>${p}</i>`).join('')}</span><span class="project-open">OPEN ↗</span>`;
    card.addEventListener('click', () => {
      document.querySelector('#dialog-content').innerHTML = `<span class="dialog-icon project-${project.color}">${project.code}</span><p>PROJECT / ${String(index + 1).padStart(2,'0')}</p><h2>${project.name}</h2><p class="dialog-desc">${project.description}</p><div class="platforms">${project.platforms.map(p => `<i>${p}</i>`).join('')}</div><a class="button button-yellow" href="${project.url}" target="_blank" rel="noreferrer">公式サイトへ <span>↗</span></a>`;
      dialog.showModal();
    });
    grid.append(card);
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
}

const newsList = document.querySelector('#news-list');
const renderNews = (filter = 'ALL') => {
  if (!newsList || !window.SITE_CONTENT) return;
  const limit = Number(newsList.dataset.limit || Infinity);
  const items = SITE_CONTENT.news.filter(item => filter === 'ALL' || item.tag === filter).slice(0, limit);
  newsList.innerHTML = '';
  items.forEach(item => {
    const article = document.createElement('article');
    article.innerHTML = `<time>${item.date}</time><span>${item.tag}</span><div><h3>${item.title}</h3>${item.summary ? `<p>${item.summary}</p>` : ''}</div>${item.url ? `<a href="${item.url}" target="_blank" rel="noreferrer" aria-label="${item.title}の関連ページを開く">↗</a>` : '<i>—</i>'}`;
    newsList.append(article);
  });
  document.querySelector('.news-empty')?.toggleAttribute('hidden', items.length > 0);
};
renderNews();
document.querySelectorAll('.news-filters button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.news-filters button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  renderNews(button.dataset.filter);
}));

window.addEventListener('scroll', () => document.querySelector('.site-header')?.classList.toggle('scrolled', scrollY > 20), {passive:true});
