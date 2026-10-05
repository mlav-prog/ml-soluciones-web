import { useEffect, useState, useRef, Children } from 'react';

function ServiceIcon({type}) { return <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type===0 ? <><rect x="3" y="5" width="26" height="22" rx="3"/><path d="M3 12h26M8 8.5h.1M12 8.5h.1M9 18h7M9 22h13"/></> : type===1 ? <><path d="M6 12h20l2 16H4l2-16Z"/><path d="M11 13V9a5 5 0 0 1 10 0v4"/></> : <><circle cx="14" cy="14" r="9"/><path d="m21 21 8 8M9 17l4-5 4 3 3-5"/></>}</svg>; }

function ServicesCarousel({ children, projects = false }) {
  const track = useRef(null);
  const paused = useRef(false);
  const resumeAt = useRef(0);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const cards = Children.toArray(children);
  const names = projects ? ['Dermaraíz', 'Tomento Capilar', 'López León'] : ['Páginas web', 'Tiendas online', 'Mejoras y SEO'];
  const trackId = projects ? 'project-cards' : 'service-cards';
  useEffect(() => {
    const el = track.current;
    const mobile = window.matchMedia('(max-width:650px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let settle;
    const position = index => el.children[index].offsetLeft - el.children[0].offsetLeft;
    const nearest = () => [...el.children].reduce((best, card, index) => Math.abs(position(index)-el.scrollLeft) < Math.abs(position(best)-el.scrollLeft) ? index : best, 0);
    const reset = () => {el.scrollTo({left:mobile.matches ? position(1) : 0,behavior:'instant'});setActive(0);};
    const finish = () => {
      if (!mobile.matches || paused.current) return;
      const index = nearest();
      if (index === 0 || index === 4) el.scrollTo({left:position(index === 0 ? 3 : 1),behavior:'instant'});
    };
    const scroll = () => {
      if (!mobile.matches) return;
      setActive((nearest()+2)%3);
      clearTimeout(settle); settle=setTimeout(finish,180);
    };
    const timer=setInterval(() => {
      const rect=el.getBoundingClientRect();
      if (!mobile.matches || reduced.matches || !playing || paused.current || Date.now()<resumeAt.current || document.hidden || rect.bottom<0 || rect.top>innerHeight) return;
      el.scrollTo({left:position(Math.min(nearest()+1,4)),behavior:'smooth'});
    },5000);
    if (el.scrollLeft === 0) reset(); mobile.addEventListener('change',reset); el.addEventListener('scroll',scroll,{passive:true});
    return () => {clearInterval(timer);clearTimeout(settle);mobile.removeEventListener('change',reset);el.removeEventListener('scroll',scroll);};
  },[playing]);
  const pause = () => {paused.current=true;};
  const resume = () => {paused.current=false;resumeAt.current=Date.now()+10000;};
  const go = index => {
    const el=track.current;resumeAt.current=Date.now()+10000;
    el.scrollTo({left:el.children[index+1].offsetLeft-el.children[0].offsetLeft,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return <><div ref={track} id={trackId} className={projects ? "projects projects-carousel" : "services"} onPointerDown={pause} onPointerUp={resume} onPointerCancel={resume} onMouseEnter={pause} onMouseLeave={resume} onFocusCapture={pause} onBlurCapture={resume}><div className="service-slide service-clone" aria-hidden="true" inert>{cards[2]}</div>{cards.map((card,index)=><div className="service-slide" key={index}>{card}</div>)}<div className="service-slide service-clone" aria-hidden="true" inert>{cards[0]}</div></div><div className="service-controls"><span>Deslizá para ver más</span><div role="group" aria-label={projects ? "Controles de trabajos" : "Controles de servicios"}>{names.map((name,index)=><button key={name} type="button" aria-label={name} aria-controls={trackId} aria-pressed={active===index} onClick={()=>go(index)}><span /></button>)}<button className="service-play" type="button" aria-label={playing?'Pausar carrusel':'Reanudar carrusel'} onClick={()=>setPlaying(!playing)}>{playing?'Ⅱ':'▶'}</button></div></div></>;
}

function ProcessCarousel({ children }) {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);
  const update = () => {
    const el = track.current;
    const left = el.getBoundingClientRect().left;
    const distances = [...el.children].map(card => Math.abs(card.getBoundingClientRect().left - left));
    setActive(distances.indexOf(Math.min(...distances)));
  };
  const go = index => {
    const el = track.current;
    const target = Math.max(0, Math.min(count - 1, index));
    el.scrollTo({left:el.scrollLeft + el.children[target].getBoundingClientRect().left - el.getBoundingClientRect().left, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  return <><ol ref={track} id="process-cards" className="process-timeline" onScroll={update}>{children}</ol><div className="process-controls"><span aria-live="polite" aria-atomic="true">Paso {active + 1} de {count}</span><div><button type="button" aria-label="Paso anterior" aria-controls="process-cards" disabled={active === 0} onClick={() => go(active - 1)}>←</button><button type="button" aria-label="Paso siguiente" aria-controls="process-cards" disabled={active === count - 1} onClick={() => go(active + 1)}>→</button></div></div></>;
}

function ContactForm() {
  return <form className="inquiry-form" action="https://formsubmit.co/mlsolucioneswebar@gmail.com" method="POST">
    <input type="hidden" name="_url" value={window.location.origin + window.location.pathname} />
    <input type="hidden" name="_subject" value="Nueva consulta desde ML Soluciones Web" />
    <input type="hidden" name="_template" value="table" />
    <div className="form-trap" aria-hidden="true"><label>Dejar vacío<input type="text" name="_honey" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-heading"><span>CONTAME TU IDEA</span><p>Empecemos por conocernos.</p></div>
    <div className="form-row"><label>Tu nombre<input name="name" autoComplete="name" required maxLength={100} placeholder="¿Cómo te llamás?" /></label><label><span className="field-title">Tu negocio <small>(opcional)</small></span><input name="business" autoComplete="organization" maxLength={120} placeholder="Nombre de tu marca" /></label></div>
    <label>Email<input name="email" type="email" autoComplete="email" required maxLength={160} placeholder="vos@ejemplo.com" /></label>
    <label>¿Qué necesitás?<select name="service" required defaultValue=""><option value="" disabled>Elegí una opción</option><option>Página web o landing page</option><option>Tienda online</option><option>Mejoras web y SEO</option><option>Necesito orientación</option></select></label>
    <label>Un poco sobre tu proyecto<textarea name="message" required minLength={10} maxLength={2000} rows={4} placeholder="Qué hacés, qué te gustaría lograr y si ya tenés una web..." /></label>
    <button className="button" type="submit">Enviar consulta por correo</button>
    <p className="form-note">Al enviar, continuarás en FormSubmit para completar la verificación antispam y confirmar el envío. Usaré tus datos para responder esta consulta.</p>
    <a className="form-alternative" href="https://wa.me/5493482679540" target="_blank" rel="noopener noreferrer">Prefiero consultar por WhatsApp</a>
  </form>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    const query = window.matchMedia('(min-width: 701px)');
    const resize = () => { if (query.matches) setOpen(false); };
    document.addEventListener('keydown', close); query.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', close); query.removeEventListener('change', resize); };
  }, []);
  return <header className="main-header"><a className="brand" href="#inicio" onClick={() => setOpen(false)} aria-label="ML Soluciones Web, inicio"><img src="assets/ml-icon.png" alt="" width="58" height="58" /><span>ML<span className="brand-sub">SOLUCIONES WEB</span></span></a><button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? 'Cerrar' : 'Menú'}<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{open ? <path d="m6 6 12 12M6 18 18 6"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}</svg></button><nav id="main-nav" className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal" onClick={event => {if(event.target.closest('a')) setOpen(false)}}><a href="#servicios">Servicios</a><a href="#trabajos">Trabajos</a><a href="#sobre-mi">Sobre mí</a><a href="#preguntas">Preguntas</a><a className="button small nav-contact" href="#contacto">Hablemos</a></nav></header>;
}

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const nodes = document.querySelectorAll('.section-heading, .services article, .project, .about > div, .process-stage, .contact-copy, .inquiry-form');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    nodes.forEach(node => { node.classList.add('reveal'); observer.observe(node); });
    return () => { observer.disconnect(); nodes.forEach(node => node.classList.remove('reveal')); };
  }, []);
  return (<>
<a className="skip" href="#contenido">Saltar al contenido</a>
<Header />
<main id="contenido"><section className="hero wrap" id="inicio"><div className="hero-copy"><p className="eyebrow">DISEÑO Y DESARROLLO WEB</p><h1>Tu negocio.<br />Su mejor versión<br /><span>en la web.</span></h1><p className="intro">Páginas web y tiendas online que muestran lo que hacés y hacen más fácil que tus clientes te encuentren y te contacten.</p><div className="actions"><a className="button" href="https://wa.me/5493482679540?text=Hola%20Mat%C3%ADas%2C%20quiero%20consultarte%20por%20una%20web." target="_blank" rel="noopener">Contame tu proyecto</a><a className="text-link" href="#trabajos">Ver mis trabajos</a></div><p className="hero-note">Atención directa con Matías Lavoy · Propuestas a medida</p></div><div className="hero-visual"><div className="hero-photo"><img src="assets/development.jpg" alt="Notebook con un proyecto de desarrollo web en pantalla" width="1200" height="799" fetchPriority="high" /><div className="photo-caption"><span>DE LA IDEA A LA PANTALLA</span><p>Una web que se sienta<br /><strong>tan tuya como tu negocio.</strong></p></div></div><div className="hero-detail"><span className="detail-symbol" aria-hidden="true">✳</span><div><strong>Hecha para tu negocio</strong><span>Diseño, desarrollo y atención personal.</span></div></div></div></section>
<div className="strip"><div className="wrap"><span>LANDING PAGES</span><span>SITIOS INSTITUCIONALES</span><span>TIENDAS ONLINE</span><span>MEJORAS Y SEO</span></div></div>
<section className="wrap section" id="servicios"><div className="section-heading"><div><p className="eyebrow">01 / QUÉ PUEDO HACER POR VOS</p><h2>¿Qué necesita<br />hoy tu negocio?</h2></div><p>Mostrar tus servicios, vender online o mejorar tu sitio actual. Encontramos la solución que tenga sentido para vos.</p></div><ServicesCarousel><article><div className="service-top"><span className="service-icon"><ServiceIcon type={0} /></span><span className="number">01</span></div><span className="service-purpose">PRESENTÁ TU NEGOCIO</span><h3>Landing pages<br />y páginas web</h3><p>Presentá tu negocio, tus servicios o una propuesta puntual con una página clara y adaptada a celulares.</p><ul><li>Diseño alineado con tu marca</li><li>Contacto directo por WhatsApp</li><li>Estructura y contenido organizados</li></ul></article><article><div className="service-top"><span className="service-icon"><ServiceIcon type={1} /></span><span className="number">02</span></div><span className="service-purpose">VENDÉ TUS PRODUCTOS</span><h3>Tiendas online<br />con Tiendanube</h3><p>Una tienda organizada para mostrar tus productos y acompañar a tus clientes desde la primera visita.</p><ul><li>Configuración y personalización</li><li>Organización de productos y categorías</li><li>Acompañamiento para empezar</li></ul></article><article><div className="service-top"><span className="service-icon"><ServiceIcon type={2} /></span><span className="number">03</span></div><span className="service-purpose">MEJORÁ LO QUE YA TENÉS</span><h3>Mejoras web<br />y SEO</h3><p>Si ya tenés una web, revisamos qué se puede mejorar para que sea más clara, útil y fácil de encontrar.</p><ul><li>Orden del contenido y la navegación</li><li>Revisión de títulos y descripciones</li><li>Mejoras según las necesidades del sitio</li></ul></article></ServicesCarousel></section>
<section className="work-section section" id="trabajos"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">02 / TRABAJOS</p><h2>Proyectos reales.<br />Identidades propias.</h2></div><p>Explorá los sitios publicados y conocé qué trabajé en cada proyecto.</p></div><ServicesCarousel projects>
<a className="project" href="https://dermaraiz.com.ar/" target="_blank" rel="noopener"><div className="project-cover derma"><span className="project-domain">dermaraiz.com.ar</span><img className="client-logo derma-logo" src="assets/dermaraiz.svg" alt="Logo de Dermaraíz" loading="lazy" width="220" height="160" /><span className="project-type">SITIO WEB</span></div><div className="project-preview"><img src="assets/work-dermaraiz.jpg" alt="Captura del sitio web publicado" width="1366" height="900" loading="lazy" /></div><div className="project-info"><h3>Dermaraíz</h3><p>Diseño y desarrollo del sitio web.</p><span className="text-link">Visitar sitio</span></div></a>
<a className="project" href="https://tomentocapilar.com.ar/" target="_blank" rel="noopener"><div className="project-cover tomento"><span className="project-domain">tomentocapilar.com.ar</span><img className="client-logo" src="assets/tomento.png" alt="Logo de Tomento Capilar" loading="lazy" width="280" height="198" /><span className="project-type">SITIO WEB</span></div><div className="project-preview"><img src="assets/work-tomento.jpg" alt="Captura del sitio web publicado" width="1366" height="900" loading="lazy" /></div><div className="project-info"><h3>Tomento Capilar</h3><p>Diseño y desarrollo del sitio web.</p><span className="text-link">Visitar sitio</span></div></a>
<a className="project" href="https://lopezleonindumentaria.com.ar/" target="_blank" rel="noopener"><div className="project-cover lopez"><span className="project-domain">lopezleonindumentaria.com.ar</span><img className="client-logo" src="assets/lopez-leon.webp" alt="Logo de López León" loading="lazy" width="360" height="90" /><span className="project-type">TIENDANUBE · MEJORAS EN CURSO</span></div><div className="project-preview"><img src="assets/work-lopez.jpg" alt="Captura del sitio web publicado" width="1366" height="900" loading="lazy" /></div><div className="project-info"><h3>López León</h3><p>Organización de la tienda y mejoras de SEO en curso.</p><span className="text-link">Visitar tienda</span></div></a>
</ServicesCarousel></div></section>
<section className="wrap section about" id="sobre-mi"><div><p className="eyebrow">03 / QUIÉN ESTÁ DETRÁS</p><h2>Hola, soy Matías.<br /><span>Hablemos de tu idea.</span></h2></div><div className="about-copy"><p>Soy Matías Lavoy. Creé ML Soluciones Web para ayudar a negocios y profesionales a mostrar lo que hacen con una web clara, cuidada y fácil de usar.</p><p>Me involucro en cada etapa: escucho tu idea, te propongo un camino y me encargo del diseño y el desarrollo. Revisamos los avances juntos, con explicaciones simples y acuerdos claros desde el principio.</p><a className="text-link" href="#contacto">Contame qué querés construir</a></div></section>
<section className="wrap section process" id="proceso"><div className="section-heading"><div><p className="eyebrow">04 / CÓMO TRABAJAMOS</p><h2>Tu idea, con un<br /><span className="process-accent">camino claro.</span></h2></div><p>Te acompaño desde la primera charla hasta la publicación. En cada etapa sabés qué sigue.</p></div><ProcessCarousel><li><article className="process-stage"><div className="stage-marker" aria-hidden="true">01</div><div className="stage-body"><h3>Me contás tu idea</h3><p>Conversamos sobre tu negocio, tus clientes y lo que querés lograr. Si ya tenés una web, la revisamos.</p><div className="stage-result"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>Un punto de partida claro.</div></div></article></li><li><article className="process-stage"><div className="stage-marker" aria-hidden="true">02</div><div className="stage-body"><h3>Definimos la propuesta</h3><p>Recibís un presupuesto con las secciones, las funciones y los plazos. Acordamos el alcance antes de empezar.</p><div className="stage-result"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>Sabés qué incluye tu proyecto.</div></div></article></li><li><article className="process-stage"><div className="stage-marker" aria-hidden="true">03</div><div className="stage-body"><h3>Le damos forma</h3><p>Diseño y desarrollo tu web. Te comparto los avances para que podamos revisar el contenido y ajustar los detalles.</p><div className="stage-result"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>Ves cómo avanza tu página.</div></div></article></li><li><article className="process-stage"><div className="stage-marker" aria-hidden="true">04</div><div className="stage-body"><h3>La ponemos online</h3><p>Revisamos que todo funcione en celulares y computadoras. Con tu aprobación, publicamos y te explico cómo seguir.</p><div className="stage-result"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>Tu web lista para compartir.</div></div></article></li></ProcessCarousel><div className="process-bottom"><p>No necesitás saber de tecnología para empezar.</p><a className="text-link" href="#contacto">Hablemos de tu idea <span aria-hidden="true">↗</span></a></div></section>
<section className="wrap section faq" id="preguntas"><div><p className="eyebrow">05 / ANTES DE EMPEZAR</p><h2>Resolvamos<br />tus dudas.</h2><p>Lo importante queda claro antes de comenzar.</p></div><div className="faq-list">
<details><summary>¿Qué incluye una página web?</summary><p>El alcance se define según tu proyecto: secciones, diseño, desarrollo y formas de contacto. Antes de empezar vas a tener una propuesta con lo que incluye y lo que se cotiza aparte.</p></details>
<details><summary>¿Qué necesito tener para arrancar?</summary><p>Una idea de lo que querés comunicar y de tus clientes. Si ya tenés logo, textos o fotos, los usamos como punto de partida. Si te falta material, vemos juntos qué hace falta preparar.</p></details>
<details><summary>¿Cuánto tarda y cuánto cuesta?</summary><p>Depende del tipo de sitio, sus funciones y el contenido disponible. Después de conocer tu idea, acordamos un presupuesto y un plazo antes de comenzar.</p></details>
<details><summary>¿Incluye dominio, alojamiento y mantenimiento?</summary><p>Se acuerdan en cada presupuesto. La propuesta detalla qué servicios incluye, cuáles se contratan aparte y qué costos de renovación o mantenimiento corresponden.</p></details>
<details><summary>¿Podés trabajar sobre mi sitio actual?</summary><p>Sí. Primero reviso cómo está construido y qué querés mejorar. A partir de eso definimos si conviene hacer ajustes sobre la web existente o plantear un nuevo desarrollo.</p></details>
</div></section>
<section className="contact wrap" id="contacto"><div className="contact-copy"><p className="eyebrow">06 / HABLEMOS DE TU PROYECTO</p><h2>Tu próxima web<br />empieza con<br /><span>una buena charla.</span></h2><p>No hace falta que tengas todo resuelto. Contame tu idea y vemos juntos cómo llevarla a la web.</p><div className="contact-method"><span>¿PREFERÍS ESCRIBIRME DIRECTAMENTE?</span><a href="https://wa.me/5493482679540" target="_blank" rel="noopener noreferrer"><svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.47 0 .11 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.25-1.64a11.94 11.94 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95a11.87 11.87 0 0 0-3.49-8.41ZM12.06 21.82a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.48 4.46-9.93 9.94-9.93a9.85 9.85 0 0 1 7.03 2.91 9.85 9.85 0 0 1 2.9 7.03c0 5.48-4.46 9.94-9.99 9.86Zm5.45-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg><span>+54 9 3482 679540</span></a><a href="mailto:mlsolucioneswebar@gmail.com"><svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><span>mlsolucioneswebar@gmail.com</span></a></div><p className="personal-note">Vas a hablar conmigo, Matías. Sin intermediarios.</p></div><ContactForm /></section></main>
<footer className="site-footer"><div className="wrap footer-grid"><div className="footer-brand"><a className="brand" href="#inicio"><img src="assets/ml-icon.png" alt="" width="64" height="64" /><span>ML<span className="brand-sub">SOLUCIONES WEB</span></span></a><p>Diseño y desarrollo web.<br />Tu negocio, con una presencia propia.</p></div><div><h3>Explorá</h3><nav aria-label="Navegación del pie"><a href="#servicios">Servicios</a><a href="#trabajos">Trabajos</a><a href="#sobre-mi">Sobre mí</a><a href="#proceso">Cómo trabajamos</a><a href="#preguntas">Preguntas frecuentes</a></nav></div><div><h3>Hagamos algo juntos</h3><a href="mailto:mlsolucioneswebar@gmail.com" className="footer-contact-link"><svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><span>mlsolucioneswebar@gmail.com</span></a><a href="https://wa.me/5493482679540" target="_blank" rel="noopener noreferrer" className="footer-contact-link"><svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.47 0 .11 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.25-1.64a11.94 11.94 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95a11.87 11.87 0 0 0-3.49-8.41ZM12.06 21.82a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.48 4.46-9.93 9.94-9.93a9.85 9.85 0 0 1 7.03 2.91 9.85 9.85 0 0 1 2.9 7.03c0 5.48-4.46 9.94-9.99 9.86Zm5.45-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg><span>WhatsApp · +54 9 3482 679540</span></a><a className="text-link" href="#contacto">Contame tu proyecto</a></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} ML Soluciones Web · Matías Lavoy</span><a href="#inicio">Volver al inicio</a></div></footer>
</>); }
