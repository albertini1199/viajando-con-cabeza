(function(){
  'use strict';

  const API='https://anwdwhrybknczptrmzci.supabase.co/functions/v1/reviews-api';
  const HEADERS={'x-vc-client':'web'};

  const TYPES={
    guide:{
      intro:title=>`¿Has visitado ${esc(title)}? Valora el destino y comparte tu experiencia.`,
      metrics:[
        ['sights','Qué ver y hacer','Variedad y calidad de planes'],
        ['food','Gastronomía','Comer bien y disfrutar'],
        ['transport','Transporte','Moverse fácil por el destino'],
        ['safety','Seguridad','Sensación de tranquilidad'],
        ['value','Calidad-precio','Lo que recibes por lo que pagas'],
        ['charm','Encanto','Ambiente, belleza y personalidad']
      ]
    },
    itinerary:{
      intro:()=>`¿Has seguido este itinerario? Valóralo y ayuda a otros viajeros a saber si les encaja.`,
      metrics:[
        ['organization','Organización','Orden y claridad del recorrido'],
        ['pace','Ritmo del viaje','Sin prisas ni tiempos imposibles'],
        ['route','Ruta','Lógica y aprovechamiento del recorrido'],
        ['tips','Consejos','Utilidad de los tips incluidos'],
        ['budget','Presupuesto','Realismo y control del gasto'],
        ['usefulness','Utilidad','Cuánto te ayudó a organizarte']
      ]
    }
  };

  const esc=(value='')=>String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const average=values=>{const nums=values.map(Number).filter(v=>Number.isFinite(v)&&v>=0&&v<=10);return nums.length?nums.reduce((a,b)=>a+b,0)/nums.length:null};
  const pct=value=>Number.isFinite(Number(value))?`${Math.max(0,Math.min(100,(Number(value)/10)*100))}%`:'0%';
  const fmtDate=value=>new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',year:'numeric'}).format(new Date(value));
  const descriptor=value=>{const v=Number(value);if(v===10)return 'Excepcional';if(v>=9)return 'Fantástico';if(v>=8)return 'Muy bien';if(v>=6)return 'Bien';if(v>=4)return 'Regular';if(v>=1)return 'Malo';return 'Muy malo'};

  function scoreControl(key,label,description){
    return `<div class="vc-score-field" data-score-field="${key}"><div class="vc-score-copy"><strong>${label}</strong><span>${description}</span></div><div class="vc-score-choices" role="radiogroup" aria-label="${label}">${Array.from({length:11},(_,i)=>`<button type="button" class="vc-score-choice" data-score="${i}" aria-label="${label}: ${i} sobre 10">${i}</button>`).join('')}</div><div class="vc-score-feedback" data-score-feedback>Selecciona una nota</div><input type="hidden" name="score_${key}"></div>`;
  }

  function markup(title,type){
    const config=TYPES[type];
    return `<div class="vc-reviews-shell">
      <div class="vc-reviews-head"><div><span class="vc-reviews-kicker">COMUNIDAD VIAJERA</span><h2>¿QUÉ OPINAN OTROS VIAJEROS?</h2><p>Valoraciones reales de la comunidad de Viajando con Cabeza.</p></div></div>
      <div class="vc-reviews-summary" data-summary><div class="vc-score-card"><div class="vc-score-empty">CARGANDO VALORACIONES…</div><small>Un momento.</small></div><div class="vc-rating-bars" data-bars></div><div class="vc-review-benefits"><div class="vc-review-benefit"><div class="vc-review-benefit-icon">✓</div><div><b>Opiniones reales</b><span>De viajeros como tú</span></div></div><div class="vc-review-benefit"><div class="vc-review-benefit-icon">♙</div><div><b>Ayuda a otros viajeros</b><span>Comparte tu experiencia</span></div></div><div class="vc-review-benefit"><div class="vc-review-benefit-icon">♡</div><div><b>Tu opinión cuenta</b><span>Nos ayuda a mejorar</span></div></div></div></div>
      <div class="vc-reviews-list" data-list></div>
      <form class="vc-review-form" data-form novalidate>
        <div class="vc-review-form-title"><span>✎</span><div><h3>Deja tu valoración</h3><p>${config.intro(title)}</p></div></div>
        <div class="vc-rating-explainer"><strong>Valora cada apartado del 0 al 10.</strong><span>0 = muy malo · 5 = regular · 10 = excepcional. La nota general se calcula automáticamente.</span></div>
        <div class="vc-score-fields">${config.metrics.map(m=>scoreControl(...m)).join('')}</div>
        <div class="vc-live-average" data-live-average><span>Tu nota media</span><strong>—</strong><small>/ 10</small><em>Completa los 6 apartados</em></div>
        <div class="vc-comment-area"><label>Tu comentario <b>*</b></label><textarea name="comment" maxlength="2000" minlength="10" required placeholder="Cuéntanos tu experiencia, lo que más te gustó, lo que mejorarías o algún consejo útil..."></textarea></div>
        <div class="vc-review-bottom"><div><label>Tu nombre o alias <b>*</b></label><input name="name" maxlength="80" required placeholder="Ej. Laura M."></div><div><label>Tipo de viaje</label><select name="trip_type"><option value="">Selecciona...</option><option value="Pareja">Pareja</option><option value="Familia">Familia</option><option value="Amigos">Amigos</option><option value="En solitario">En solitario</option><option value="Trabajo">Trabajo</option></select></div><label class="vc-review-consent"><input type="checkbox" name="consent" required> He leído y acepto la política de comentarios</label><input class="vc-review-honeypot" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="vc-review-submit" type="submit">ENVIAR VALORACIÓN</button></div>
        <div class="vc-review-note">ℹ Todas las valoraciones se revisan antes de publicarse para evitar spam y contenido inapropiado.</div><div class="vc-review-message" data-message role="status" aria-live="polite"></div>
      </form>
    </div>`;
  }

  function bindScores(form,type){
    const metrics=TYPES[type].metrics;
    const live=form.querySelector('[data-live-average]');
    const refresh=()=>{const vals=metrics.map(([key])=>form.elements[`score_${key}`].value).filter(v=>v!=='').map(Number);if(vals.length===metrics.length){const avg=average(vals);live.querySelector('strong').textContent=avg.toFixed(1);live.querySelector('em').textContent=descriptor(avg);live.classList.add('is-ready')}else{live.querySelector('strong').textContent='—';live.querySelector('em').textContent=`Faltan ${metrics.length-vals.length} apartado${metrics.length-vals.length===1?'':'s'}`;live.classList.remove('is-ready')}};
    form.querySelectorAll('[data-score-field]').forEach(field=>{const key=field.dataset.scoreField;const input=form.elements[`score_${key}`];field.querySelectorAll('[data-score]').forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.score;field.querySelectorAll('[data-score]').forEach(b=>b.classList.toggle('is-selected',b===btn));const feedback=field.querySelector('[data-score-feedback]');feedback.textContent=`${btn.dataset.score}/10 · ${descriptor(btn.dataset.score)}`;refresh()}))});
    refresh();
  }

  function renderSummary(root,reviews,title,type){
    const config=TYPES[type];
    const overall=average(reviews.map(r=>r.rating));
    const summary=root.querySelector('[data-summary]');
    const score=summary.querySelector('.vc-score-card');
    score.innerHTML=!reviews.length?`<div class="vc-score-empty">SIN VALORACIONES TODAVÍA</div><small>Sé la primera persona en valorar ${esc(title)}.</small>`:`<div class="vc-booking-score"><strong>${overall.toFixed(1)}</strong><span>/10</span></div><div class="vc-score-word">${descriptor(overall)}</div><small>${reviews.length} valoración${reviews.length===1?'':'es'} publicada${reviews.length===1?'':'s'}</small>`;
    summary.querySelector('[data-bars]').innerHTML=config.metrics.map(([key,label])=>{const avg=average(reviews.map(r=>r.scores&&r.scores[key]));return `<div class="vc-rating-row"><span>${label}</span><span class="vc-rating-bar"><i style="width:${pct(avg)}"></i></span><b>${avg==null?'—':avg.toFixed(1)}</b></div>`}).join('');
  }

  function renderList(root,reviews){
    const list=root.querySelector('[data-list]');
    if(!reviews.length){list.innerHTML='<div class="vc-reviews-empty"><strong>Aún no hay comentarios publicados</strong><span>Cuando aprobemos las primeras valoraciones aparecerán aquí.</span></div>';return}
    list.innerHTML=`<div class="vc-reviews-list-head"><h3>Comentarios recientes</h3><span>${reviews.length} publicados</span></div><div class="vc-review-cards">${reviews.map(r=>`<article class="vc-review-card"><div class="vc-review-card-top"><div><strong>${esc(r.name)}</strong><span>${esc(r.trip_type||'Viajero/a')} · ${fmtDate(r.created_at)}</span></div><div class="vc-card-score"><b>${Number(r.rating).toFixed(1)}</b><span>${descriptor(r.rating)}</span></div></div>${r.comment?`<p>${esc(r.comment)}</p>`:''}</article>`).join('')}</div>`;
  }

  async function load(root,pageId,pageType,title){
    try{const qs=new URLSearchParams({page_id:pageId,page_type:pageType});const res=await fetch(`${API}?${qs}`,{headers:HEADERS});if(!res.ok)throw new Error();const data=await res.json();const reviews=data.reviews||[];renderSummary(root,reviews,title,pageType);renderList(root,reviews)}catch(e){renderSummary(root,[],title,pageType);renderList(root,[]);const msg=root.querySelector('[data-message]');msg.textContent='No hemos podido cargar las valoraciones ahora mismo.';msg.classList.add('is-error')}
  }

  function bind(root,pageId,pageType){
    const form=root.querySelector('[data-form]');
    const metrics=TYPES[pageType].metrics;
    bindScores(form,pageType);
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const msg=form.querySelector('[data-message]');const btn=form.querySelector('.vc-review-submit');msg.textContent='';msg.className='vc-review-message';
      if(form.elements.website.value)return;
      const scores={};let missing=false;
      metrics.forEach(([key])=>{const v=form.elements[`score_${key}`].value;if(v==='')missing=true;else scores[key]=Number(v)});
      if(missing){msg.textContent='Valora los 6 apartados antes de enviar tu opinión.';msg.classList.add('is-error');return}
      if(!form.reportValidity())return;
      const last=Number(localStorage.getItem('vc_last_review')||0);if(Date.now()-last<60000){msg.textContent='Espera un minuto antes de enviar otra valoración.';msg.classList.add('is-error');return}
      const payload={page_id:pageId,page_type:pageType,name:form.elements.name.value.trim(),trip_type:form.elements.trip_type.value||null,scores,comment:form.elements.comment.value.trim(),website:form.elements.website.value};
      btn.disabled=true;btn.textContent='ENVIANDO…';
      try{const res=await fetch(API,{method:'POST',headers:{...HEADERS,'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!res.ok)throw new Error();localStorage.setItem('vc_last_review',String(Date.now()));form.reset();form.querySelectorAll('.vc-score-choice').forEach(b=>b.classList.remove('is-selected'));form.querySelectorAll('[data-score-feedback]').forEach(el=>el.textContent='Selecciona una nota');const live=form.querySelector('[data-live-average]');live.querySelector('strong').textContent='—';live.querySelector('em').textContent='Completa los 6 apartados';live.classList.remove('is-ready');msg.textContent='¡Gracias! Tu valoración se ha enviado correctamente y aparecerá cuando la revisemos.';msg.classList.add('is-success')}catch(e){msg.textContent='No hemos podido enviar tu valoración. Inténtalo de nuevo en unos minutos.';msg.classList.add('is-error')}finally{btn.disabled=false;btn.textContent='ENVIAR VALORACIÓN'}
    });
  }

  function init(root){const pageId=(root.dataset.reviewPage||'').trim();const pageType=(root.dataset.reviewType||'guide').trim();const title=(root.dataset.reviewTitle||pageId||'esta guía').trim();if(!pageId||!TYPES[pageType])return;root.innerHTML=markup(title,pageType);bind(root,pageId,pageType);load(root,pageId,pageType,title)}

  document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-review-page]').forEach(init));
})();
