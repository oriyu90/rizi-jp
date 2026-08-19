const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const darkMode = matchMedia('(prefers-color-scheme: dark)');

function initIntro() {
  const intro = document.querySelector('.intro');
  if (!intro) return;
  const finish = () => {
    if (intro.dataset.finished) return;
    intro.dataset.finished = 'true';
    intro.classList.add('is-finished');
    document.body.classList.remove('intro-lock');
  };
  if (reduceMotion) { finish(); return; }
  document.body.classList.add('intro-lock');
  const logo = intro.querySelector('[data-intro-dark-logo]');
  if (logo) logo.src = ['ja','zh'].includes(window.SITE_LANG) ? 'logo-JP.jpg' : 'logo-EN.jpg';
  const ready = darkMode.matches && logo ? Promise.race([logo.decode().catch(()=>{}), new Promise(r=>setTimeout(r,600))]) : Promise.resolve();
  ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-running'))));
  intro.addEventListener('animationend', event => { if (event.target === intro && event.animationName === 'introDismiss') finish(); });
  setTimeout(finish, 2900);
}
initIntro();

document.querySelectorAll('.reveal').forEach(el => {
  if (reduceMotion) return el.classList.add('visible');
  new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.disconnect(); }
  }, {threshold:.12}).observe(el);
});

const labels = {
  ja:{open:'OPEN ↗',project:'PROJECT',visit:'公式サイトへ',related:'関連ページを開く'},
  en:{open:'OPEN ↗',project:'PROJECT',visit:'Visit website',related:'Open related page'},
  zh:{open:'打开 ↗',project:'项目',visit:'访问官方网站',related:'打开相关页面'},
  pt:{open:'ABRIR ↗',project:'PROJETO',visit:'Visitar site',related:'Abrir página relacionada'}
};
const label = key => labels[window.SITE_LANG || 'en'][key];
const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');

function renderProjects() {
  if (!grid || !window.SITE_CONTENT) return;
  grid.innerHTML = '';
  SITE_CONTENT.projects.forEach((project,index) => {
    const description = window.siteText(project.description);
    const card = document.createElement('button');
    card.className = `project-card project-${project.color}`;
    card.innerHTML = `<span class="project-count">${String(index+1).padStart(2,'0')}</span><span class="project-icon">${project.code}</span><span class="project-name">${project.name}</span><span class="project-desc">${description}</span><span class="platforms">${project.platforms.map(p=>`<i>${p}</i>`).join('')}</span><span class="project-open">${label('open')}</span>`;
    card.addEventListener('click',()=>{
      document.querySelector('#dialog-content').innerHTML = `<span class="dialog-icon project-${project.color}">${project.code}</span><p>${label('project')} / ${String(index+1).padStart(2,'0')}</p><h2>${project.name}</h2><p class="dialog-desc">${description}</p><div class="platforms">${project.platforms.map(p=>`<i>${p}</i>`).join('')}</div><a class="button button-lime" href="${project.url}" target="_blank" rel="noreferrer">${label('visit')} <span>↗</span></a>`;
      dialog.showModal();
    });
    grid.append(card);
  });
}
renderProjects();
if (dialog) {
  document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
}

const newsList = document.querySelector('#news-list');
let activeNewsFilter = 'ALL';
function renderNews(filter=activeNewsFilter) {
  if (!newsList || !window.SITE_CONTENT) return;
  activeNewsFilter = filter;
  const limit = Number(newsList.dataset.limit || Infinity);
  const items = SITE_CONTENT.news.filter(item=>filter==='ALL'||item.tag===filter).slice(0,limit);
  newsList.innerHTML='';
  items.forEach(item=>{
    const title=window.siteText(item.title), summary=window.siteText(item.summary);
    const article=document.createElement('article');
    article.innerHTML=`<time>${item.date}</time><span>${item.tag}</span><div><h3>${title}</h3>${summary?`<p>${summary}</p>`:''}</div>${item.url?`<a href="${item.url}" target="_blank" rel="noreferrer" aria-label="${title}: ${label('related')}">↗</a>`:'<i>—</i>'}`;
    newsList.append(article);
  });
  document.querySelector('.news-empty')?.toggleAttribute('hidden',items.length>0);
}
renderNews();
document.querySelectorAll('.news-filters button').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.news-filters button').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');renderNews(button.dataset.filter);
}));
window.addEventListener('site-language-change',()=>{renderProjects();renderNews()});
window.addEventListener('scroll',()=>document.querySelector('.site-header')?.classList.toggle('scrolled',scrollY>20),{passive:true});
