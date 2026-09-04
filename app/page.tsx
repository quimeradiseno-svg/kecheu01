'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight, Plus, Menu, X, Pause, Play, Check, Copy, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, useCarousel, type CarouselApi } from '@/components/ui/carousel';
import { cabins, contact, photos, type Photo } from './content';
import imageSizes from './image-sizes.json';

const nav = [['historia','Historia'],['cabanas','Cabañas'],['taller','Taller'],['lugar','El lugar']];
const message = 'Hola, nos gustaría conocer Kecheu. ¿Podemos conversar sobre las cabañas y el taller de cerámica?';

function PhotoFrame({photo, className='', priority=false, caption=false, still=false}: {photo: Photo; className?:string; priority?:boolean; caption?:boolean; still?:boolean}) {
  const size=imageSizes[photo.name as keyof typeof imageSizes];
  return <figure className={'photo-frame '+className} data-motion={still?undefined:true} data-mouse={still?undefined:true}>
    <img src={'/images/'+photo.name+'.webp'} srcSet={'/images/'+photo.name+'-small.webp '+size.smallWidth+'w, /images/'+photo.name+'.webp '+size.width+'w'} width={size.width} height={size.height} sizes={priority?'100vw':'(max-width:760px) 100vw, 70vw'} alt={photo.alt} loading={priority?'eager':'lazy'} decoding="async" fetchPriority={priority?'high':'auto'} style={{objectPosition:photo.position}}/>
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
        scenes.forEach(el=>{const r=el.getBoundingClientRect(); const p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-h)));el.style.setProperty('--progress',String(p));
          el.querySelectorAll<HTMLElement>('[data-step]').forEach((step)=>{const index=Number(step.dataset.step);const n=Number(el.dataset.steps||1);const opacity=Math.max(0,Math.min(1,(p*n-index+.25)*3,(index+1.15-p*n)*3));step.style.setProperty('--step-opacity',String(opacity));});});
        images.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>h)return;const p=(h/2-(r.top+r.height/2))/h;el.style.setProperty('--image-y',Math.max(-22,Math.min(22,p*16))+'px');});
      };
      const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
      const pointerTick=()=>{pointerFrame=0;if(!active)return;x+=(targetX-x)*.11;y+=(targetY-y)*.11;active.style.setProperty('--mouse-x',x+'px');active.style.setProperty('--mouse-y',y+'px');if(Math.abs(targetX-x)+Math.abs(targetY-y)>.03)pointerFrame=requestAnimationFrame(pointerTick);};
      const reset=()=>{if(active){active.style.setProperty('--mouse-x','0px');active.style.setProperty('--mouse-y','0px');}active=null;x=0;y=0;};
      const pointer=(e:PointerEvent)=>{
        if(reduced||e.pointerType!=='mouse')return;
        const el=(e.target as HTMLElement).closest<HTMLElement>('[data-mouse]');
        if(el!==active){reset();active=el;}
        if(!active)return;
        const r=active.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*6;targetY=((e.clientY-r.top)/r.height-.5)*4;
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
  const copyRef=useRef<HTMLTextAreaElement>(null);
  useNarrativeMotion(paused);
  const openContact=()=>{
    if(contact.whatsappNumber){window.open('https://wa.me/'+contact.whatsappNumber+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');}
    else setContactOpen(true);
  };
  const copyMessage=async()=>{try{await navigator.clipboard.writeText(message);setCopied(true);}catch{copyRef.current?.select();setCopied(false);}};
  const manifestoItems=[
    {line:'Un lugar para descansar.',tag:'Las cabañas',image:'cabin-small',alt:'La cabaña para dos, hecha de barro y madera',href:'#cabanas'},
    {line:'Un valle para volar.',tag:'Epuyén',image:'new-mountains',alt:'Las montañas nevadas de Epuyén, vistas desde Kecheu',href:'#lugar'},
    {line:'El barro para habitar.',tag:'La casa',image:'house-inside',alt:'La casa familiar, con su pilar y entramado de madera',href:'#casa'},
    {line:'Arcilla para crear.',tag:'El taller',image:'real-clay',alt:'Una mano sostiene una pieza de arcilla decorada',href:'#taller'}
  ];
  return <main>
    <a className="skip-link" href="#historia">Saltar a la historia</a><div className="reading-progress" aria-hidden="true"/>
    <header className="site-header">
      <a className="wordmark" href="#llegar" aria-label="Kecheu, volver al inicio">kecheu<span>barro · madera · vida</span></a>
      <nav aria-label="Navegación principal">{nav.map(([id,label])=><a href={'#'+id} key={id}>{label}</a>)}</nav>
      <div className="header-actions"><a className="nav-contact" href="#contacto">Contacto <ArrowUpRight size={16}/></a><Button variant="ghost" className="menu-toggle" onClick={()=>setMenuOpen(true)} aria-label="Abrir menú"><Menu/></Button></div>
    </header>
    <section className="hero" id="llegar" data-scene>
      <PhotoFrame photo={photos.hero} priority className="hero-image-frame"/><div className="hero-shade"/>
      <div className="hero-top"><span>KECHEU<br/>EPUYÉN · PATAGONIA</span></div>
      <div className="hero-copy"><h1>Hecho para<br/><em>habitar.</em></h1></div>
      <div className="hero-bottom"><a href="#historia" className="scroll-cue">Descubrir <ArrowDown size={16}/></a><p>Barro · madera · arcilla · montaña</p></div>
    </section>

    <section className="intro section-pad" id="historia">
      <div className="section-heading reveal"><p className="eyebrow">01 / EL COMIENZO</p><span className="small-note">No empezó con un plano de negocio.<br/>Empezó con las manos.</span></div>
      <h2 className="reveal">Antes de ser un lugar<br/>para quedarse,<br/><em>fue un sueño.</em></h2>
      <div className="origin-documentary">
        <div className="reveal"><PhotoFrame photo={{name:'construction',alt:'Archivo de Kecheu: manos trabajando en una pared de barro'}} className="origin-main" still/><p className="photo-footnote">ARCHIVO KECHEU / EL BARRO GUARDA LA HUELLA.</p></div>
        <div className="origin-copy reveal"><p className="body-copy">Daniel y Laura empezaron por las cabañas.</p><p className="body-copy">Las construyeron con sus propias manos utilizando barro, madera y técnicas de construcción natural.</p><p className="body-copy">No buscaban imponer una arquitectura sobre el paisaje, sino aprender a construir dentro de él.</p><span className="handwritten">Y acá estamos.</span></div>
      </div>
    </section>
    <section className="material-sequence" aria-label="Nuestros materiales"><p className="material-word reveal">Tierra.</p><p className="material-word reveal">Madera.</p><p className="material-word reveal">Tiempo.</p><span className="eyebrow reveal">LO ESENCIAL YA ESTABA ACÁ.</span></section>

    <section className="cabins-section section-pad" id="cabanas">
      <div className="section-heading reveal"><p className="eyebrow">02 / UN LUGAR PARA DESCANSAR</p><span className="small-note">Tres cabañas de construcción natural.</span></div>
      <div className="cabins-intro reveal"><h2>Hay muchas formas<br/>de <em>quedarse.</em></h2><div><p>Dos cabañas para cuatro, una al lado de la otra, construidas en espejo. Desde afuera parecen una sola; adentro, cada una tiene su propio espacio.</p><p>Y una tercera, más pequeña, para dos.</p></div></div>
      <div className="cabin-scenes">{cabins.map((c,i)=><article className={'cabin-scene cabin-scene-'+i} key={c.number}>
        <Button variant="ghost" className="cabin-image-button reveal" onClick={()=>setSelectedCabin(i)} aria-label={'Ver fotografías de '+c.label}><PhotoFrame photo={{name:c.cover,alt:c.images[0].alt}} still/><span className="image-explore">Entrar <Plus size={17}/></span></Button>
        <div className="cabin-story reveal"><div className="cabin-meta"><span>{c.label}</span><span>{c.capacity}</span></div><h3>{i===2?<>Más pequeña.<br/>Más recogida.<br/><em>Todo el valle alrededor.</em></>:c.title}</h3><p>{c.description}</p><Button variant="link" className="text-link" onClick={()=>setSelectedCabin(i)}>Recorrer la cabaña <ArrowUpRight size={17}/></Button></div>
      </article>)}</div>
      <div className="cabins-bottom"><span>Completamente equipadas. Cocina y baño completos.</span><span>El descanso no necesita mucho más.</span></div>
    </section>

    <section id="casa" className="house-story dark">
      <p className="eyebrow house-chapter reveal">03 / EL BARRO PARA HABITAR</p>
      <h2 className="house-sentence"><span className="house-beat reveal">Y después,</span><span className="house-beat reveal">se convirtió</span><span className="house-beat house-final reveal">en <em>casa.</em></span></h2>
      <div className="house-arrival reveal"><PhotoFrame photo={{name:'house-pond',alt:'La casa de la familia junto al estanque y las montañas de Epuyén'}} className="house-finished" still/><p className="house-context">LA CASA DE LA FAMILIA · NO ES UNA CABAÑA DE ALQUILER</p></div>
      <div className="house-memory"><PhotoFrame photo={{name:'house-building',alt:'Archivo de la casa-taller: entramado de madera durante la construcción'}} className="house-archive reveal" still/><p className="reveal">Una casa puede ocupar un paisaje.<br/>O puede aprender a pertenecerle.<span className="eyebrow">DE LA ESTRUCTURA A LA VIDA.</span></p></div>
    </section>
    <section className="family-section section-pad">
      <div className="family-album"><PhotoFrame photo={{name:'family',alt:'Retrato de la familia de Kecheu: dos adultos y sus dos hijos'}} className="family-photo reveal" still/><PhotoFrame photo={{name:'new-family-building',alt:'Archivo de Kecheu: adultos y niños compartiendo una jornada de construcción con barro'}} className="family-archive reveal" still/></div>
      <div className="family-copy reveal"><p className="eyebrow">EL PROYECTO TAMBIÉN ES LA VIDA</p><h2>No sólo lo<br/>construimos.<br/><em>Lo habitamos.</em></h2><p className="body-copy">Después de construir las cabañas, Daniel y Laura levantaron su propia casa-taller en el mismo lugar y se mudaron allí con sus hijos.</p><p className="body-copy">Lo que había comenzado como un proyecto terminó convirtiéndose en una forma de vivir.</p><p className="body-copy">La casa, el taller, la huerta, el estanque. Los chicos creciendo, el pan sobre la mesa.</p><PhotoFrame photo={{name:'bread',alt:'Pan casero sobre la mesa de la casa familiar'}} className="bread-photo"/></div>
    </section>

    <section className="workshop-section section-pad" id="taller">
      <div className="section-heading reveal"><p className="eyebrow">04 / ARCILLA PARA CREAR</p><span className="small-note">El taller de Laura.</span></div>
      <h2 className="workshop-title reveal">En esta casa,<br/>el barro <em>cambia de escala.</em></h2>
      <p className="same-clay reveal">El mismo barro.</p>
      <div className="clay-chapter clay-wall"><h3 className="reveal">fue pared.</h3><PhotoFrame photo={{name:'wall',alt:'Barro modelado en la pared, alrededor de vidrios de colores'}} className="reveal"/></div>
      <div className="clay-chapter clay-hands"><h3 className="reveal">entró en<br/><em>sus manos.</em></h3><div className="reveal"><PhotoFrame photo={photos.hands} still/><p className="photo-footnote">UNA PIEZA DE ARCILLA ENTRE LAS MANOS. ARCHIVO DEL TALLER.</p></div></div>
      <div className="clay-chapter clay-object"><h3 className="reveal">se convirtió<br/>en <em>objeto.</em></h3><PhotoFrame photo={photos.clay} className="reveal" still/></div>
      <div className="workshop-close"><h2 className="reveal">Arcilla para <em>crear.</em></h2><div className="workshop-home"><PhotoFrame photo={{name:'workshop',alt:'El taller real de Kecheu, con mesa, estantes de cerámica y ventana flor'}} className="workshop-room reveal" still/><div className="reveal"><p className="body-copy">Laura trabaja la cerámica en su taller. Sus piezas también aparecen en los detalles de la casa: una bacha, una luz, una pequeña forma en la pared.</p><p className="body-copy">Si te dan ganas de probar, también podés tomar clases de cerámica.</p><Button variant="link" className="text-link" onClick={openContact}>Preguntar por el taller <ArrowUpRight size={18}/></Button></div></div></div>
    </section>

    <section className="life-section section-pad"><div className="life-title reveal"><p className="eyebrow">05 / LA VIDA ENTRE MEDIO</p><h2>Lo que crece.<br/><em>Lo que compartimos.</em></h2></div><div className="life-grid"><div className="life-garden reveal"><PhotoFrame photo={{name:'garden',alt:'Trabajo cotidiano en la huerta de Kecheu'}}/><p>Cultivar.</p></div><div className="life-harvest reveal"><PhotoFrame photo={{name:'harvest',alt:'Canasto con cosecha de la huerta y construcción al fondo'}}/><p>Compartir.</p></div><div className="life-pond reveal"><PhotoFrame photo={{name:'house-pond',alt:'El estanque junto a la casa familiar, entre la vegetación'}}/><p>Cuidar.</p></div></div></section>

    <section className="pause-scene dark" data-scene data-steps="5">
      <div className="pause-sticky"><PhotoFrame photo={{name:'pause',alt:'Rincón de descanso junto a la ventana y la vista a la montaña'}} className="pause-image"/><div className="pause-shade"/>
        <div className="pause-text"><h2>Aunque también<br/>podés <em>no hacer<br/>nada.</em></h2><div className="pause-phrases">{['Tomar mate.','Leer.','Escuchar el agua.','Mirar la montaña.','O nada.'].map((line,i)=><p key={line} data-step={i} className={i===4?'pause-last':''}>{line}</p>)}</div></div>
      </div>
    </section>

    <section className="place-section section-pad" id="lugar"><div className="section-heading reveal"><p className="eyebrow">06 / UN VALLE PARA VOLAR</p><span className="small-note">Epuyén · Chubut · Patagonia Argentina</span></div><div className="place-intro reveal"><h2>La naturaleza<br/>no es el fondo.<br/><em>Es la protagonista.</em></h2><p>A los pies de los Andes, entre el Cerro Pirque y el Cerro Epuyén. Un pueblo pequeño, un río cerca y un lago para mirar sin apuro.</p></div><PhotoFrame photo={{name:'lake',alt:'Orilla de aguas transparentes, lago y montañas de Epuyén'}} className="lake-photo reveal" still/><div className="river-note"><PhotoFrame photo={{name:'river',alt:'Agua transparente y árboles en un río del entorno de Epuyén'}} className="river-photo reveal"/><p className="body-copy reveal">Aguas cristalinas. Un paisaje para escuchar.<br/><a href="https://bosques.chubut.gov.ar/conservacion/" target="_blank" rel="noreferrer">En el lago Epuyén no se permite la navegación a motor.</a></p></div><div className="distances reveal"><div><span>500 <small>m</small></span><p>RÍO EPUYÉN</p></div><div><span>3 <small>km</small></span><p>LAGO EPUYÉN / PUERTO BONITO</p></div><div><span>4 <small>km</small></span><p>PUEBLO</p></div><a href={contact.mapUrl} target="_blank" rel="noreferrer" className="text-link">Ubicar Epuyén <MapPin size={18}/></a></div><p className="distance-note">Distancias aproximadas desde Kecheu. El mapa muestra Epuyén, no la entrada al predio.</p></section>

    <section className="manifesto-section" aria-label="Manifiesto de Kecheu"><p className="eyebrow manifesto-intro reveal">AHORA YA CONOCÉS LA HISTORIA</p>{manifestoItems.map((item,i)=><article className={'manifesto-moment manifesto-moment-'+i} key={item.tag}><PhotoFrame photo={{name:item.image,alt:item.alt}} className="manifesto-image reveal" still/><h2 className="reveal"><a href={item.href}>{item.line}</a></h2><span className="eyebrow reveal">0{i+1} / {item.tag}</span></article>)}<div className="conclusion"><p className="this-is reveal">Esto es <em>Kecheu.</em></p></div></section>

    <footer className="site-footer dark" id="contacto"><div className="footer-top"><div><p className="eyebrow">07 / LA CONVERSACIÓN SIGUE</p><h2>¿Venís a<br/><em>conocerlo?</em></h2></div><div className="footer-invite"><p>Escribinos y contanos cuándo te gustaría venir a Epuyén.</p><Button className="contact-button" onClick={openContact}>Escribinos por WhatsApp <ArrowRight size={24}/></Button>{!contact.whatsappNumber&&<span className="preview-note">Vista previa · WhatsApp pendiente de conectar</span>}</div></div><div className="footer-bottom"><a href="#llegar" className="wordmark">kecheu<span>EPUYÉN · PATAGONIA</span></a><div className="footer-socials">{contact.instagramUrl?<a href={contact.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>:<span>Instagram · próximamente</span>}{contact.airbnbUrl?<a href={contact.airbnbUrl} target="_blank" rel="noreferrer">Airbnb ↗</a>:<span>Airbnb · próximamente</span>}<a href={contact.mapUrl} target="_blank" rel="noreferrer">Cómo llegar · Epuyén ↗</a></div><Button variant="ghost" className="motion-toggle" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?<Play size={13}/>:<Pause size={13}/>} {paused?'Activar movimiento':'Pausar movimiento'}</Button></div><div className="footer-fine"><span>Hecho a mano. Hecho para habitar.</span><span>Barro · madera · arcilla · montaña</span></div></footer>

    <Dialog open={menuOpen} onOpenChange={setMenuOpen}><DialogContent className="mobile-menu" showCloseButton={false}><DialogTitle>Kecheu</DialogTitle><DialogDescription>Un recorrido por nuestra historia.</DialogDescription><DialogClose render={<Button variant="ghost" className="menu-close" aria-label="Cerrar menú"/>}><X/></DialogClose><nav aria-label="Menú móvil">{[...nav,['contacto','Contacto']].map(([id,label])=><a key={id} href={'#'+id} onClick={()=>setMenuOpen(false)}>{label}<ArrowUpRight/></a>)}</nav></DialogContent></Dialog>
    <Dialog open={selectedCabin!==null} onOpenChange={open=>{if(!open)setSelectedCabin(null);}}><DialogContent className="gallery-dialog" showCloseButton={false}><DialogClose render={<Button variant="ghost" className="gallery-close" aria-label="Cerrar galería"/>}><X/></DialogClose>{selectedCabin!==null&&<CabinGallery key={selectedCabin} cabin={cabins[selectedCabin]} onClose={()=>setSelectedCabin(null)}/>}</DialogContent></Dialog>
    <Dialog open={contactOpen} onOpenChange={setContactOpen}><DialogContent className="contact-dialog" showCloseButton={false}><DialogClose render={<Button variant="ghost" className="gallery-close" aria-label="Cerrar contacto"/>}><X/></DialogClose><DialogTitle>La conversación, muy pronto.</DialogTitle><DialogDescription>Esta es una vista previa. Falta incorporar el número de WhatsApp de Kecheu; todavía no se envían consultas desde acá.</DialogDescription><p>Podés copiar este mensaje para guardarlo:</p><textarea ref={copyRef} readOnly value={message} aria-label="Mensaje de consulta para copiar"/><Button onClick={copyMessage} className="copy-button">{copied?<Check size={17}/>:<Copy size={17}/>} {copied?'Mensaje copiado':'Copiar consulta'}</Button><p aria-live="polite" className="small-note">{copied?'El texto está en tu portapapeles. No se envió ningún mensaje.':'No se envía ningún mensaje ni se guardan datos.'}</p></DialogContent></Dialog>
  </main>;
}
