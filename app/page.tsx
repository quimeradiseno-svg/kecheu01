'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight, Plus, Menu, X, Pause, Play, Check, Copy, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, useCarousel, type CarouselApi } from '@/components/ui/carousel';
import { cabins, contact, photos, type Photo } from './content';

const nav = [['historia','La historia'],['cabanas','Las cabañas'],['taller','El taller'],['lugar','Epuyén']];
const message = 'Hola, nos gustaría conocer Kecheu. ¿Podemos conversar sobre las cabañas y el taller de cerámica?';

function PhotoFrame({photo, className='', priority=false, caption=false}: {photo: Photo; className?:string; priority?:boolean; caption?:boolean}) {
  return <figure className={'photo-frame '+className} data-motion data-mouse>
    <img src={'/images/'+photo.name+'.webp'} srcSet={'/images/'+photo.name+'-small.webp 800w, /images/'+photo.name+'.webp 2000w'} sizes={priority?'100vw':'(max-width:760px) 100vw, 60vw'} alt={photo.alt} loading={priority?'eager':'lazy'} decoding="async" fetchPriority={priority?'high':'auto'} style={{objectPosition:photo.position}}/>
    {photo.generated&&<figcaption className="generated-label">Imagen generada · referencia temporal</figcaption>}
    {caption&&photo.caption&&<figcaption className="photo-caption">{photo.caption}</figcaption>}
  </figure>;
}

function GalleryControls({current,total}:{current:number;total:number}) {
  const {scrollPrev,scrollNext,canScrollPrev,canScrollNext}=useCarousel();
  return <div className="gallery-controls"><span className="eyebrow" aria-live="polite">{String(current+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span><span>Arrastrá para recorrer</span><div><Button className="round-button" variant="ghost" disabled={!canScrollPrev} onClick={scrollPrev} aria-label="Fotografía anterior"><ArrowLeft/></Button><Button className="round-button" variant="ghost" disabled={!canScrollNext} onClick={scrollNext} aria-label="Fotografía siguiente"><ArrowRight/></Button></div></div>;
}

function CabinGallery({cabin,onClose}:{cabin:typeof cabins[number];onClose:()=>void}) {
  const [api,setApi]=useState<CarouselApi>();
  const [current,setCurrent]=useState(0);
  useEffect(()=>{if(!api)return;const select=()=>setCurrent(api.selectedScrollSnap());select();api.on('select',select);return()=>{api.off('select',select);};},[api]);
  return <><DialogTitle className="gallery-title">{cabin.label}<span>{cabin.capacity}</span></DialogTitle><DialogDescription>{cabin.description}</DialogDescription>
    <Carousel setApi={setApi} opts={{loop:false}} className="cabin-carousel" aria-label={'Fotografías de '+cabin.label} tabIndex={0}>
      <CarouselContent>{cabin.images.map((photo)=><CarouselItem key={photo.name}><figure><img src={'/images/'+photo.name+'.webp'} alt={photo.alt} loading="lazy" draggable={false}/><figcaption>{photo.caption}</figcaption></figure></CarouselItem>)}</CarouselContent>
      <GalleryControls current={current} total={cabin.images.length}/>
    </Carousel><p className="gallery-equipment">Barro y madera · Cocina y baño completos · Totalmente equipada</p><a href="#contacto" className="text-link" onClick={onClose}>Consultar por esta cabaña <ArrowUpRight size={18}/></a></>;
}

function useNarrativeMotion(paused:boolean) {
  useEffect(()=>{
    const root=document.documentElement;
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    let remove=()=>{};
    const setup=()=>{
      remove();
      const reduced=paused||preference.matches;
      root.classList.toggle('motion-paused',reduced);
      const reveals=Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.1});
      reveals.forEach(el=>observer.observe(el));
      root.classList.add('motion-ready');
      let frame=0, pointerFrame=0,active:HTMLElement|null=null, targetX=0,targetY=0,x=0,y=0;
      const scenes=Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
      const images=Array.from(document.querySelectorAll<HTMLElement>('[data-motion]'));
      const update=()=>{
        frame=0;
        const h=window.innerHeight, max=document.documentElement.scrollHeight-h;
        root.style.setProperty('--page-progress',String(max>0?window.scrollY/max:0));
        if(reduced)return;
        scenes.forEach(el=>{const r=el.getBoundingClientRect(); const p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-h)));el.style.setProperty('--progress',String(p));});
        images.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>h)return;const p=(h/2-(r.top+r.height/2))/h;el.style.setProperty('--image-y',Math.max(-22,Math.min(22,p*30))+'px');});
      };
      const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
      const pointerTick=()=>{pointerFrame=0;if(!active)return;x+=(targetX-x)*.11;y+=(targetY-y)*.11;active.style.setProperty('--mouse-x',x+'px');active.style.setProperty('--mouse-y',y+'px');if(Math.abs(targetX-x)+Math.abs(targetY-y)>.03)pointerFrame=requestAnimationFrame(pointerTick);};
      const reset=()=>{if(active){active.style.setProperty('--mouse-x','0px');active.style.setProperty('--mouse-y','0px');}active=null;x=0;y=0;};
      const pointer=(e:PointerEvent)=>{
        if(reduced||e.pointerType!=='mouse')return;
        const el=(e.target as HTMLElement).closest<HTMLElement>('[data-mouse]');
        if(el!==active){reset();active=el;}
        if(!active)return;
        const r=active.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*16;targetY=((e.clientY-r.top)/r.height-.5)*12;
        if(!pointerFrame)pointerFrame=requestAnimationFrame(pointerTick);
      };
      window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);
      document.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',reset);
      update();
      remove=()=>{observer.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(pointerFrame);reset();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);document.removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',reset);};
    };
    setup();preference.addEventListener('change',setup);
    return()=>{remove();preference.removeEventListener('change',setup);root.classList.remove('motion-ready','motion-paused');};
  },[paused]);
}

export default function Home() {
  const [menuOpen,setMenuOpen]=useState(false);
  const [selectedCabin,setSelectedCabin]=useState<number|null>(null);
  const [contactOpen,setContactOpen]=useState(false);
  const [copied,setCopied]=useState(false);
  const [paused,setPaused]=useState(false);
  const [manifesto,setManifesto]=useState(0);
  const copyRef=useRef<HTMLTextAreaElement>(null);
  useNarrativeMotion(paused);
  const openContact=()=>{
    if(contact.whatsappNumber){window.open('https://wa.me/'+contact.whatsappNumber+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');}
    else setContactOpen(true);
  };
  const copyMessage=async()=>{try{await navigator.clipboard.writeText(message);setCopied(true);}catch{copyRef.current?.select();setCopied(false);}};
  const manifestoItems=[
    {line:'Un lugar para descansar.',tag:'Las cabañas',image:'cabin-small',href:'#cabanas'},
    {line:'Un valle para volar.',tag:'Epuyén',image:'lake',href:'#lugar'},
    {line:'El barro para habitar.',tag:'La casa',image:'house-inside',href:'#casa'},
    {line:'Arcilla para crear.',tag:'El taller',image:'workshop',href:'#taller'}
  ];
  return <main>
    <a className="skip-link" href="#historia">Saltar a la historia</a><div className="reading-progress" aria-hidden="true"/>
    <header className="site-header">
      <a className="wordmark" href="#llegar" aria-label="Kecheu, volver al inicio">kecheu<span>barro · madera · vida</span></a>
      <nav aria-label="Navegación principal">{nav.map(([id,label])=><a href={'#'+id} key={id}>{label}</a>)}</nav>
      <div className="header-actions"><a className="nav-contact" href="#contacto">¿Venís? <ArrowUpRight size={16}/></a><Button variant="ghost" className="menu-toggle" onClick={()=>setMenuOpen(true)} aria-label="Abrir menú"><Menu/></Button></div>
    </header>
    <section className="hero" id="llegar" data-scene>
      <PhotoFrame photo={photos.hero} priority className="hero-image-frame"/><div className="hero-shade"/>
      <div className="hero-top"><span>EPUYÉN, PATAGONIA ARGENTINA</span><span>UNA HISTORIA HECHA A MANO</span></div>
      <div className="hero-copy"><p className="eyebrow">TRES CABAÑAS. UNA FORMA DE VIVIR.</p><h1>Hecho para<br/><em>habitar.</em></h1></div>
      <div className="hero-bottom"><a href="#historia" className="scroll-cue"><span className="circle"><ArrowDown size={20}/></span>La historia empieza acá</a><p>Un lugar para descansar.<br/>Un valle para volar.</p><span className="hero-index">EPUYÉN · CHUBUT</span></div>
      <span className="hero-side">BARRO PARA HABITAR · ARCILLA PARA CREAR</span>
    </section>

    <section className="intro section-pad" id="historia">
      <div className="section-heading reveal"><p className="eyebrow">01 / EL COMIENZO</p><span className="small-note">No empezó con un plano de negocio.<br/>Empezó con las manos.</span></div>
      <div className="intro-grid"><div className="reveal"><h2>Antes de ser un lugar<br/>para quedarse,<br/><em>fue un sueño.</em></h2><p className="body-copy">Daniel es arquitecto. Laura, ceramista. Primero construyeron tres cabañas con sus propias manos. Barro, madera y tiempo.</p><p className="body-copy">Después construyeron su casa-taller y se mudaron acá con sus hijos. Lo que comenzó como un proyecto terminó convirtiéndose en una forma de vivir.</p><span className="handwritten">Y acá estamos.</span></div>
      <div className="origin-photos reveal"><PhotoFrame photo={{name:'construction',alt:'Archivo de Kecheu: manos trabajando en una pared de barro'}} className="origin-main"/><PhotoFrame photo={{name:'wall',alt:'Textura de barro modelado alrededor de los vidrios de colores'}} className="origin-detail"/><p className="photo-footnote">EL BARRO GUARDA LA HUELLA DE QUIEN LO TRABAJA.</p></div></div>
    </section>

    <section className="material-band" aria-label="Nuestros materiales"><span>Tierra.</span><span>Madera.</span><span>Tiempo.</span><span className="material-note">LO ESENCIAL<br/>YA ESTABA ACÁ.</span></section>

    <section className="cabins-section section-pad" id="cabanas">
      <div className="section-heading reveal"><p className="eyebrow">02 / UN LUGAR PARA DESCANSAR</p><span className="small-note">Tres cabañas de construcción natural.</span></div>
      <div className="cabins-intro reveal"><h2>Hay muchas formas<br/>de <em>quedarse.</em></h2><div><p>Dos cabañas para cuatro, una al lado de la otra, construidas en espejo. Desde afuera parecen una sola; adentro, cada una tiene su propio espacio.</p><p>Y una tercera, más pequeña, para dos.</p></div></div>
      <div className="cabin-cards">{cabins.map((c,i)=><article className={'cabin-card reveal cabin-card-'+i} key={c.number}>
        <Button variant="ghost" className="cabin-image-button" onClick={()=>setSelectedCabin(i)} aria-label={'Ver fotografías de '+c.label}><PhotoFrame photo={{name:c.cover,alt:c.images[0].alt}}/><span className="image-explore">Entrar <Plus size={17}/></span></Button>
        <div className="cabin-meta"><span>{c.label}</span><span>{c.capacity}</span></div><h3>{c.title}</h3><p>{c.description}</p><Button variant="link" className="text-link" onClick={()=>setSelectedCabin(i)}>Recorrer la cabaña <ArrowUpRight size={17}/></Button>
      </article>)}</div>
      <div className="cabins-bottom"><span>Completamente equipadas. Cocina y baño completos.</span><span>El descanso no necesita mucho más.</span></div>
    </section>

    <section id="casa" className="house-story dark" data-scene>
      <div className="house-sticky"><div className="house-copy"><p className="eyebrow">03 / EL BARRO PARA HABITAR</p><h2>Y después,<br/>se convirtió<br/>en <em>casa.</em></h2><p>Una casa puede ocupar un paisaje.<br/>O puede aprender a pertenecerle.</p><span className="house-context">LA CASA DE LA FAMILIA · NO ES UNA CABAÑA DE ALQUILER</span><div className="story-track" aria-hidden="true"><span/></div><span className="small-note">De la estructura a la vida.</span></div><div className="house-stage"><PhotoFrame photo={{name:'house-building',alt:'Archivo de la casa-taller: entramado de madera durante la construcción'}} className="house-before"/><PhotoFrame photo={{name:'house-inside',alt:'La casa familiar terminada, con pilar central, vigas de madera y ventanales'}} className="house-after"/><div className="house-stage-label"><span>LA OBRA</span><span>EL HOGAR</span></div></div></div>
    </section>
    <section className="family-section section-pad"><PhotoFrame photo={{name:'family',alt:'Retrato familiar compartido para la historia de Kecheu'}} className="family-photo reveal"/><div className="reveal"><p className="eyebrow">EL PROYECTO TAMBIÉN ES LA VIDA</p><h2>No sólo lo<br/>construimos.<br/><em>Lo habitamos.</em></h2><p className="body-copy">La casa, el taller, la huerta, el estanque. Los chicos creciendo, el pan sobre la mesa. Todo convive en el mismo lugar.</p><PhotoFrame photo={{name:'bread',alt:'Pan casero sobre la mesa de la casa familiar'}} className="bread-photo"/></div></section>

    <section className="workshop-section section-pad" id="taller">
      <div className="section-heading reveal"><p className="eyebrow">04 / ARCILLA PARA CREAR</p><span className="small-note">El taller de Laura.</span></div>
      <div className="workshop-head reveal"><h2>En esta casa,<br/>el barro <em>cambia de escala.</em></h2><p>A veces se convierte en pared.<br/>Otras veces cabe entre las manos.</p></div>
      <div className="workshop-images"><PhotoFrame photo={{name:'workshop',alt:'El taller real de Kecheu, con mesa, estantes de cerámica y ventana flor'}} className="workshop-room reveal"/><PhotoFrame photo={photos.hands} className="workshop-hands reveal"/></div>
      <div className="workshop-bottom"><div className="reveal"><span className="eyebrow">DE LA TIERRA A LAS MANOS</span><p className="body-copy">Laura trabaja la cerámica en su taller. Sus piezas también aparecen en los detalles de la casa: una bacha, una luz, una pequeña forma en la pared.</p><p className="body-copy">Si te dan ganas de probar, también podés tomar clases de cerámica.</p><Button variant="link" className="text-link" onClick={openContact}>Preguntar por el taller <ArrowUpRight size={18}/></Button></div><PhotoFrame photo={photos.clay} className="clay-photo reveal"/></div>
    </section>

    <section className="life-section section-pad"><div className="life-title reveal"><p className="eyebrow">05 / LA VIDA ENTRE MEDIO</p><h2>Lo que crece.<br/><em>Lo que compartimos.</em></h2></div><div className="life-grid"><PhotoFrame photo={{name:'garden',alt:'Trabajo cotidiano en la huerta de Kecheu',caption:'Las manos, también en la tierra.'}} className="life-garden reveal" caption/><PhotoFrame photo={{name:'harvest',alt:'Canasto con cosecha de la huerta y construcción al fondo',caption:'Del suelo a la mesa.'}} className="life-harvest reveal" caption/><PhotoFrame photo={{name:'house-pond',alt:'La casa familiar y el estanque entre la vegetación',caption:'El estanque junto a nuestra casa.'}} className="life-pond reveal" caption/></div></section>

    <section className="pause-scene dark" data-scene><PhotoFrame photo={{name:'pause',alt:'Rincón de descanso junto a la ventana y la vista a la montaña'}} className="pause-image"/><div className="pause-shade"/><div className="pause-text reveal"><p className="eyebrow">NO HAY QUE LLENAR TODOS LOS DÍAS</p><h2>Aunque también<br/>podés <em>no hacer nada.</em></h2><p>Tomar mate. Leer. Cocinar.<br/>Mirar cómo cambia la montaña.</p><span>A veces viajar también es eso.</span></div></section>

    <section className="place-section section-pad" id="lugar"><div className="section-heading reveal"><p className="eyebrow">06 / UN VALLE PARA VOLAR</p><span className="small-note">Epuyén · Chubut · Patagonia Argentina</span></div><div className="place-intro reveal"><h2>La naturaleza<br/>no es el fondo.<br/><em>Es la protagonista.</em></h2><p>A los pies de los Andes, entre el Cerro Pirque y el Cerro Epuyén. Un pueblo pequeño, un río cerca y un lago para mirar sin apuro.</p></div><div className="landscape-pair"><PhotoFrame photo={{name:'river',alt:'Agua transparente y árboles en un río del entorno de Epuyén'}} className="river-photo reveal"/><PhotoFrame photo={{name:'lake',alt:'Orilla de aguas transparentes, lago y montañas de la Patagonia'}} className="lake-photo reveal"/></div><div className="distances reveal"><div><span>500 <small>m</small></span><p>AL RÍO EPUYÉN</p></div><div><span>3 <small>km</small></span><p>AL LAGO / PUERTO BONITO</p></div><div><span>4 <small>km</small></span><p>AL PUEBLO</p></div><a href={contact.mapUrl} target="_blank" rel="noreferrer" className="text-link">Ubicar Epuyén <MapPin size={18}/></a></div><p className="distance-note">Distancias aproximadas desde Kecheu. El mapa muestra Epuyén, no la entrada al predio.</p></section>

    <section className="manifesto-section section-pad"><p className="eyebrow reveal">AHORA YA CONOCÉS LA HISTORIA</p><div className="manifesto-layout"><div className="manifesto-lines">{manifestoItems.map((item,i)=><a href={item.href} key={item.tag} onMouseEnter={()=>setManifesto(i)} onFocus={()=>setManifesto(i)} className={(manifesto===i?'active ':'')+'reveal'}><span className="manifesto-number">0{i+1}</span><span>{item.line}</span><ArrowUpRight size={22}/></a>)}</div><div className="manifesto-photo" data-mouse><img key={manifestoItems[manifesto].image} src={'/images/'+manifestoItems[manifesto].image+'.webp'} alt={manifestoItems[manifesto].tag} loading="lazy"/><span>{manifestoItems[manifesto].tag}</span></div></div><p className="this-is reveal">Esto es <em>Kecheu.</em></p></section>

    <footer className="site-footer dark" id="contacto"><div className="footer-top"><div><p className="eyebrow">07 / LA CONVERSACIÓN SIGUE</p><h2>¿Venís a<br/><em>conocerlo?</em></h2></div><div className="footer-invite"><p>Te invitamos a conocer nuestro sueño.<br/>Y a habitarlo un ratito.</p><Button className="contact-button" onClick={openContact}>Hablar por WhatsApp <ArrowUpRight size={24}/></Button>{!contact.whatsappNumber&&<span className="preview-note">Vista previa · WhatsApp pendiente de conectar</span>}</div></div><div className="footer-bottom"><a href="#llegar" className="wordmark">kecheu<span>EPUYÉN · PATAGONIA</span></a><div className="footer-socials">{contact.instagramUrl?<a href={contact.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>:<span>Instagram · próximamente</span>}{contact.airbnbUrl?<a href={contact.airbnbUrl} target="_blank" rel="noreferrer">Airbnb ↗</a>:<span>Airbnb · próximamente</span>}<a href={contact.mapUrl} target="_blank" rel="noreferrer">Epuyén en el mapa ↗</a></div><Button variant="ghost" className="motion-toggle" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?<Play size={13}/>:<Pause size={13}/>} {paused?'Activar movimiento':'Pausar movimiento'}</Button></div><div className="footer-fine"><span>Hecho a mano. Hecho para habitar.</span><span>Las dos imágenes de referencia del taller son generadas y se reemplazarán por fotografías reales.</span></div></footer>

    <Dialog open={menuOpen} onOpenChange={setMenuOpen}><DialogContent className="mobile-menu" showCloseButton={false}><DialogTitle>Kecheu</DialogTitle><DialogDescription>Un recorrido por nuestra historia.</DialogDescription><DialogClose render={<Button variant="ghost" className="menu-close" aria-label="Cerrar menú"/>}><X/></DialogClose><nav aria-label="Menú móvil">{[...nav,['contacto','Contacto']].map(([id,label])=><a key={id} href={'#'+id} onClick={()=>setMenuOpen(false)}>{label}<ArrowUpRight/></a>)}</nav></DialogContent></Dialog>
    <Dialog open={selectedCabin!==null} onOpenChange={open=>{if(!open)setSelectedCabin(null);}}><DialogContent className="gallery-dialog" showCloseButton={false}><DialogClose render={<Button variant="ghost" className="gallery-close" aria-label="Cerrar galería"/>}><X/></DialogClose>{selectedCabin!==null&&<CabinGallery key={selectedCabin} cabin={cabins[selectedCabin]} onClose={()=>setSelectedCabin(null)}/>}</DialogContent></Dialog>
    <Dialog open={contactOpen} onOpenChange={setContactOpen}><DialogContent className="contact-dialog" showCloseButton={false}><DialogClose render={<Button variant="ghost" className="gallery-close" aria-label="Cerrar contacto"/>}><X/></DialogClose><DialogTitle>La conversación, muy pronto.</DialogTitle><DialogDescription>Esta es una vista previa. Falta incorporar el número de WhatsApp de Kecheu; todavía no se envían consultas desde acá.</DialogDescription><p>Podés copiar este mensaje para guardarlo:</p><textarea ref={copyRef} readOnly value={message} aria-label="Mensaje de consulta para copiar"/><Button onClick={copyMessage} className="copy-button">{copied?<Check size={17}/>:<Copy size={17}/>} {copied?'Mensaje copiado':'Copiar consulta'}</Button><p aria-live="polite" className="small-note">{copied?'El texto está en tu portapapeles. No se envió ningún mensaje.':'No se envía ningún mensaje ni se guardan datos.'}</p></DialogContent></Dialog>
  </main>;
}
