document.addEventListener('DOMContentLoaded',()=>{
 const galleries=[...document.querySelectorAll('.day-section .photo-gallery')];
 const columns=[...document.querySelectorAll('.day-column')];

 /* Fotografías de ejemplo: se usan si todavía no existen las copias locales del repositorio. */
 const fallbackImages={
  'plaza-del-popolo-1.jpg':'https://commons.wikimedia.org/wiki/Special:FilePath/Piazza_del_Popolo%2C_Roma%2C_Italy_%28Unsplash%29.jpg?width=1400',
  'plaza-del-popolo-2.jpg':'https://commons.wikimedia.org/wiki/Special:FilePath/Piazza_del_Popolo%2C_Roma%2C_Italy_%28Unsplash%29.jpg?width=1400',
  'terraza-del-pincio.jpg':'https://commons.wikimedia.org/wiki/Special:FilePath/Piazza_del_Popolo%2C_Roma%2C_Italy_%28Unsplash%29.jpg?width=1400',
  'basilica-santa-maria-del-popolo.jpg':'https://images.unsplash.com/photo-1739357565156-e90fbaf10269?auto=format&fit=crop&w=1400&q=82',
  'castillo-sant-angelo-1.jpg':'https://images.unsplash.com/photo-1557835814-7c4f6ee2265c?auto=format&fit=crop&w=1400&q=82',
  'ciudad-del-vaticano-1.jpg':'https://images.unsplash.com/photo-1724225978838-2f9da44ac1ce?auto=format&fit=crop&w=1400&q=82',
  'museos-vaticanos-1.jpg':'https://images.unsplash.com/photo-1586777550739-abeb68c7200b?auto=format&fit=crop&w=1400&q=82',
  'museos-vaticanos-2.jpg':'https://images.unsplash.com/photo-1586777550739-abeb68c7200b?auto=format&fit=crop&w=1400&q=82',
  'museos-vaticanos-3.jpg':'https://images.unsplash.com/photo-1586777550739-abeb68c7200b?auto=format&fit=crop&w=1400&q=82',
  'castillo-sant-angelo-2.jpg':'https://images.unsplash.com/photo-1655416098348-5b7dfddfc7dd?auto=format&fit=crop&w=1400&q=82',
  'coliseo-1.jpg':'https://commons.wikimedia.org/wiki/Special:FilePath/Rome_Coliseum_%28Unsplash%29.jpg?width=1400',
  'coliseo-2.jpg':'https://commons.wikimedia.org/wiki/Special:FilePath/Rome_colesium_%28Unsplash%29.jpg?width=1400',
  'arco-de-constantino.jpg':'https://commons.wikimedia.org/wiki/Special:FilePath/Rome_Coliseum_%28Unsplash%29.jpg?width=1400',
  'foro-romano-1.jpg':'https://images.unsplash.com/photo-1709354637314-d473b35e77eb?auto=format&fit=crop&w=1400&q=82',
  'foro-romano-2.jpg':'https://images.unsplash.com/photo-1734022619182-838f17d4bb55?auto=format&fit=crop&w=1400&q=82',
  'bocca-della-verita.jpg':'https://images.unsplash.com/photo-1709354637314-d473b35e77eb?auto=format&fit=crop&w=1400&q=82',
  'teatro-de-marcelo.jpg':'https://images.unsplash.com/photo-1709354637314-d473b35e77eb?auto=format&fit=crop&w=1400&q=82',
  'monumento-victorio-manuel-ii-1.jpg':'https://images.unsplash.com/photo-1709354637314-d473b35e77eb?auto=format&fit=crop&w=1400&q=82',
  'monumento-victorio-manuel-ii-2.jpg':'https://images.unsplash.com/photo-1709354637314-d473b35e77eb?auto=format&fit=crop&w=1400&q=82',
  'trastevere.jpg':'https://images.unsplash.com/photo-1709354637314-d473b35e77eb?auto=format&fit=crop&w=1400&q=82',
  'foro-traiano-1.jpg':'https://images.unsplash.com/photo-1709354637314-d473b35e77eb?auto=format&fit=crop&w=1400&q=82',
  'foro-traiano-2.jpg':'https://images.unsplash.com/photo-1734022619182-838f17d4bb55?auto=format&fit=crop&w=1400&q=82',
  'fontana-di-trevi.jpg':'https://images.unsplash.com/photo-1651212989581-dd548973b55e?auto=format&fit=crop&w=1400&q=82',
  'piazza-navona.jpg':'https://storage.googleapis.com/mytour-prod/blog/1657806986350_navona-jpg.jpeg',
  'vaticano.jpg':'https://images.unsplash.com/photo-1739357565156-e90fbaf10269?auto=format&fit=crop&w=1400&q=82',
  'plaza-de-espana-1.jpg':'https://images.unsplash.com/photo-1663143146856-683650ffee76?auto=format&fit=crop&w=1400&q=82',
  'fontana-di-trevi-2.jpg':'https://images.unsplash.com/photo-1651212989581-dd548973b55e?auto=format&fit=crop&w=1400&q=82',
  'plaza-de-espana-2.jpg':'https://images.unsplash.com/photo-1663143146856-683650ffee76?auto=format&fit=crop&w=1400&q=82',
  'vaticano-2.jpg':'https://images.unsplash.com/photo-1724225978838-2f9da44ac1ce?auto=format&fit=crop&w=1400&q=82',
  'panteon.jpg':'https://images.unsplash.com/photo-1693824113672-c288819f3724?auto=format&fit=crop&w=1400&q=82'
 };

 document.querySelectorAll('.photo-frame img').forEach(img=>{
  const file=(img.getAttribute('src')||'').split('/').pop();
  const fallback=fallbackImages[file];
  if(!fallback)return;
  img.addEventListener('error',()=>{
   if(img.dataset.fallbackApplied)return;
   img.dataset.fallbackApplied='1';
   img.src=fallback;
  },{once:true});
  if(img.complete && img.naturalWidth===0){
   img.dataset.fallbackApplied='1';
   img.src=fallback;
  }
 });

 /* Lugares: formato limpio, sin cajas ni líneas, con flecha circular */
 columns.forEach(col=>{
  col.querySelectorAll('li').forEach(li=>{
   if(li.querySelector('.itinerary-place-link')) return;
   const text=li.textContent.trim();
   if(!text)return;
   const link=document.createElement('a');
   link.className='itinerary-place-link';
   link.href='que-ver.html';
   link.innerHTML=`<span class="itinerary-place-arrow" aria-hidden="true">→</span><span>${text}</span>`;
   li.textContent='';
   li.appendChild(link);
  });
 });
 if(!galleries.length)return;

 const lb=document.createElement('div');
 lb.className='lightbox';
 lb.setAttribute('role','dialog');
 lb.setAttribute('aria-modal','true');
 lb.setAttribute('aria-label','Galería de fotografías');
 lb.innerHTML=`
  <button class="lightbox-close" aria-label="Cerrar galería">×</button>
  <button class="lightbox-prev" aria-label="Fotografía anterior">‹</button>
  <div class="lightbox-main"><img class="lightbox-image" alt=""></div>
  <button class="lightbox-next" aria-label="Fotografía siguiente">›</button>
  <div class="lightbox-thumbs" role="list"></div>
  <div class="lightbox-counter" aria-live="polite"></div>`;
 document.body.appendChild(lb);

 const image=lb.querySelector('.lightbox-image');
 const thumbs=lb.querySelector('.lightbox-thumbs');
 const counter=lb.querySelector('.lightbox-counter');
 let gallery=null,index=0;

 function open(g,i){
  gallery=g;index=i;
  const frames=[...g.querySelectorAll('.photo-frame')];
  const imgs=frames.map(f=>f.querySelector('img'));
  const img=imgs[i];
  image.src=img.currentSrc||img.src;
  image.alt=img.alt||'';
  counter.textContent=`${i+1} / ${imgs.length}`;
  thumbs.innerHTML='';
  frames.forEach((frame,n)=>{
   const src=frame.querySelector('img').currentSrc||frame.querySelector('img').src;
   const button=document.createElement('button');
   button.className='lightbox-thumb'+(n===i?' is-active':'');
   button.type='button';
   button.setAttribute('aria-label',`Ver fotografía ${n+1}`);
   button.innerHTML=`<img src="${src}" alt="">`;
   button.addEventListener('click',()=>show(n));
   thumbs.appendChild(button);
  });
  lb.classList.add('is-open');
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>thumbs.children[i]?.scrollIntoView({behavior:'auto',block:'nearest',inline:'center'}));
 }
 function show(i){
  if(!gallery)return;
  const imgs=[...gallery.querySelectorAll('img')];
  index=(i+imgs.length)%imgs.length;
  const img=imgs[index];
  image.src=img.currentSrc||img.src;
  image.alt=img.alt||'';
  counter.textContent=`${index+1} / ${imgs.length}`;
  [...thumbs.children].forEach((t,n)=>t.classList.toggle('is-active',n===index));
  thumbs.children[index]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
 }
 function move(n){show(index+n)}
 function close(){lb.classList.remove('is-open');document.body.style.overflow='';}

 galleries.forEach(g=>g.querySelectorAll('.photo-frame').forEach((frame,i)=>{
  frame.tabIndex=0;
  frame.setAttribute('role','button');
  frame.setAttribute('aria-label','Abrir fotografía');
  frame.addEventListener('click',()=>open(g,i));
  frame.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(g,i)}});
 }));
 lb.querySelector('.lightbox-close').onclick=close;
 lb.querySelector('.lightbox-prev').onclick=()=>move(-1);
 lb.querySelector('.lightbox-next').onclick=()=>move(1);
 lb.addEventListener('click',e=>{if(e.target===lb)close()});
 document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('is-open'))return;
  if(e.key==='Escape')close();
  if(e.key==='ArrowLeft')move(-1);
  if(e.key==='ArrowRight')move(1);
 });
});
