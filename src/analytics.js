const services = {'Página web o landing page':'web','Tienda online':'tiendanube','Mejoras web y SEO':'seo','Necesito orientación':'orientacion'};
const projects = {'dermaraiz.com.ar':'dermaraiz','tomentocapilar.com.ar':'tomento','lopezleonindumentaria.com.ar':'lopez_leon'};

// Custom events contain fixed labels only, never visitors' form values.
export function installAnalytics() {
  const send = (name, params = {}) => {
    try { window.gtag?.('event', name, {...params, transport_type:'beacon'}); } catch {}
  };
  const service = () => services[document.querySelector('[name="service"]')?.value] || 'sin_elegir';
  const placement = el => el.closest('.floating-whatsapp') ? 'flotante' : el.closest('footer') ? 'footer' : el.closest('header') ? 'header' : el.closest('section[id]')?.id || 'pagina';
  let started = false;
  const start = e => {
    if (!started && e.target.matches('.inquiry-form input:not([type="hidden"]),.inquiry-form select,.inquiry-form textarea') && !e.target.closest('.form-trap')) {
      started = true; send('inquiry_start', {service_id:service()});
    }
  };
  const click = e => {
    const el = e.target.closest('a,button');
    if (!el || el.closest('[inert]')) return;
    const params = {placement:placement(el)};
    if (el.matches('a')) {
      const url = new URL(el.href, window.location.href);
      if (url.hostname === 'wa.me') send('whatsapp_click', params);
      else if (url.protocol === 'mailto:') send('email_click', params);
      else if (projects[url.hostname]) send('project_click', {...params,project_id:projects[url.hostname]});
      else if (el.matches('.service-cta')) {
        const cards = [...document.querySelectorAll('#service-cards > .service-slide:not(.service-clone)')];
        send('service_interest', {...params,service_id:['web','tiendanube','seo'][cards.indexOf(el.closest('.service-slide'))] || 'sin_elegir'});
      } else if (url.origin === window.location.origin && url.hash) send('navigation_click', {...params,destination:url.hash.slice(1)});
    } else if (el.closest('.service-controls,.process-controls')) {
      send('carousel_interaction', {carousel_id:el.closest('.process-controls') ? 'proceso' : el.closest('#trabajos') ? 'trabajos' : 'servicios',control:el.getAttribute('aria-label') || 'control'});
    }
  };
  const change = e => {
    if (e.target.matches('.inquiry-form select[name="service"]')) send('service_select', {service_id:service()});
  };
  const errors = new Set();
  const invalid = e => {
    const field = e.target.name;
    if (e.target.closest('.inquiry-form') && ['name','email','service','message'].includes(field) && !errors.has(field)) {
      errors.add(field); send('inquiry_validation_error', {field_id:field});
    }
  };
  const submit = e => {
    // Delivery happens on FormSubmit; an attempt is not a confirmed lead.
    if (e.target.matches('.inquiry-form')) send('inquiry_submit_attempt', {service_id:service()});
  };
  const toggle = e => {
    if (e.target.matches('.faq-list details') && e.target.open) send('faq_open', {question_id:'faq_'+([...e.target.parentElement.children].indexOf(e.target)+1)});
  };
  const seen = new Set();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    if (document.hidden) return;
    for (const entry of entries) if (entry.isIntersecting && !seen.has(entry.target.id)) {
      seen.add(entry.target.id); send('section_view', {section_id:entry.target.id});
    }
  }, {rootMargin:'-20% 0px -20% 0px',threshold:0}) : null;
  document.querySelectorAll('main section[id]').forEach(el => observer?.observe(el));
  const depths = new Set();
  let frame = 0;
  const depth = () => {
    frame = 0;
    const height = document.documentElement.scrollHeight-window.innerHeight;
    if (document.hidden || height <= 0) return;
    const percent = Math.round(window.scrollY/height*100);
    for (const milestone of [25,50,75,100]) if (percent >= milestone && !depths.has(milestone)) {
      depths.add(milestone); send('scroll_depth', {percent_scrolled:milestone});
    }
  };
  const scroll = () => { if (!frame) frame = requestAnimationFrame(depth); };
  const listeners = [['click',click],['input',start],['change',start],['change',change],['invalid',invalid,true],['submit',submit],['toggle',toggle,true]];
  listeners.forEach(([name,fn,capture]) => document.addEventListener(name,fn,capture));
  window.addEventListener('scroll',scroll,{passive:true});
  return () => {
    observer?.disconnect(); cancelAnimationFrame(frame);
    listeners.forEach(([name,fn,capture]) => document.removeEventListener(name,fn,capture));
    window.removeEventListener('scroll',scroll);
  };
}
