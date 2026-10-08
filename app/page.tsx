'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, ArrowLeft, ArrowRight, Plus, Menu, X, Pause, Play, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, useCarousel, type CarouselApi } from '@/components/ui/carousel';
import { cabins, contact, photos, type Photo } from './content';
import imageSizes from './image-sizes.json';
import { PauseSection } from './pause-section';
import { HouseStory } from './house-story';
import { PlaceSection } from './place-section';
import { ManifestoSection } from './manifesto-section';
import { ConstructionSequence } from './construction-sequence';
import { WorkshopSection } from './workshop-section';
import { MaterialWords } from './material-words';
import closingVideoStyles from './closing-video.module.css';
import { HeroGallery } from './hero-gallery';
import { CabinLightbox } from './cabin-lightbox';
import { FamilyAlbum } from './family-album';

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

function CabinGallery({cabin,onClose,archive=false}:{cabin:typeof cabins[number];onClose:()=>void;archive?:boolean}) {
  const [api,setApi]=useState<CarouselApi>();
  const [current,setCurrent]=useState(0);
  useEffect(()=>{if(!api)return;const select=()=>setCurrent(api.selectedScrollSnap());select();api.on('select',select);return()=>{api.off('select',select);};},[api]);
  return <><DialogTitle className="gallery-title">{cabin.label}<span>{cabin.capacity}</span></DialogTitle><DialogDescription>{cabin.description}</DialogDescription>
    <Carousel setApi={setApi} opts={{loop:false}} className="cabin-carousel" aria-label={'Fotografías de '+cabin.label} tabIndex={0}>
      <CarouselContent>{cabin.images.map((photo)=><CarouselItem key={photo.name}><figure><img src={'/images/'+photo.name+'.webp'} alt={photo.alt} loading="lazy" draggable={false}/><figcaption>{photo.caption}</figcaption></figure></CarouselItem>)}</CarouselContent>
      <GalleryControls current={current} total={cabin.images.length}/>
    </Carousel>{!archive&&<p className="gallery-equipment">Barro y madera · Cocina y baño completos · Totalmente equipada</p>}<a href="#contacto" className="text-link" onClick={onClose}>{archive?'Conversar sobre Kecheu':'Consultar por esta cabaña'} <ArrowUpRight size={18}/></a></>;
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
      const house=document.querySelector<HTMLElement>('[data-house-scene]');
      const houseBeats=Array.from(house?.querySelectorAll<HTMLElement>('[data-arrive]')||[]);
      const update=()=>{
        frame=0;
        const h=window.innerHeight, max=document.documentElement.scrollHeight-h;
        root.style.setProperty('--page-progress',String(max>0?window.scrollY/max:0));
        if(reduced)return;
        if(house){const top=house.getBoundingClientRect().top;const progress=(h*.82-top)/(h*.85);houseBeats.forEach(el=>{const index=Number(el.dataset.arrive);el.style.setProperty('--arrival',String(Math.max(0,Math.min(1,(progress-index*.17)*4))));});}
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


const storyArchive = {
  number:'archivo',title:'Una historia compartida.',label:'El archivo de Kecheu',capacity:'Casa · taller · vida',cover:'new-family-building',
  description:'Una casa puede ocupar un paisaje. O puede aprender a pertenecerle. De la estructura a la vida.',
  images:[
    {name:'new-family-building',alt:'Adultos y niños durante la construcción de la casa familiar',caption:'La construcción de la casa, una historia compartida.'},
    {name:'house-building',alt:'Entramado de madera de la casa-taller durante su construcción',caption:'De la estructura a la vida.'},
    {name:'house-pond',alt:'La casa familiar junto al estanque y las montañas de Epuyén',caption:'La casa y el estanque.'},
    {name:'bread',alt:'Pan casero sobre la mesa familiar de Kecheu',caption:'El pan sobre la mesa.'},
    {name:'workshop',alt:'El taller de cerámica de Laura, con mesa, estantes y ventana flor',caption:'El taller de Laura.'},
    {name:'harvest',alt:'Canasto con cosecha de la huerta de Kecheu',caption:'Del suelo a la mesa.'}
  ]
};

export default function Home() {
  const [menuOpen,setMenuOpen]=useState(false);
  const [archiveOpen,setArchiveOpen]=useState(false);
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
  return <main>
    <a className="skip-link" href="#historia">Saltar a la historia</a><div className="reading-progress" aria-hidden="true"/>
    <header className="site-header">
      <a className="wordmark" href="#llegar" aria-label="Kecheu, volver al inicio">kecheu<span>barro · madera · vida</span></a>
      <nav aria-label="Navegación principal">{nav.map(([id,label])=><a href={'#'+id} key={id}>{label}</a>)}</nav>
      <div className="header-actions"><a className="nav-contact" href="#contacto">Contacto <ArrowUpRight size={16}/></a><Button variant="ghost" className="menu-toggle" onClick={()=>setMenuOpen(true)} aria-label="Abrir menú"><Menu/></Button></div>
    </header>
    <section className="hero" id="llegar" data-scene>
      <HeroGallery paused={paused}/><div className="hero-shade"/>
      <div className="hero-copy"><p className="hero-location">EPUYÉN, CHUBUT — PATAGONIA ARGENTINA</p><h1><span>Hecho para</span><br/><em>habitar.</em></h1></div>
      <div className="hero-bottom"><a href="#historia" className="scroll-cue">Descubrir <ArrowDown size={16}/></a><p>Barro · madera · arcilla · montaña</p></div>
    </section>

    <section className="intro section-pad" id="historia">
      <div className="section-heading reveal"><p className="eyebrow">01 / EL COMIENZO</p><span className="small-note">No empezó con un plano de negocio.<br/>Empezó con las manos.</span></div>
      <div className="origin-documentary">
        <div className="origin-copy reveal"><h2>Antes de ser un lugar para quedarse,<br/><em>fue un sueño.</em></h2><div className="editorial-copy"><p className="editorial-lead">Daniel y Laura empezaron por <em>las cabañas.</em></p><p className="editorial-support">Las construyeron con sus propias manos utilizando <em>barro, madera</em> y técnicas de construcción natural.</p><p className="editorial-support">No buscaban imponer una arquitectura sobre el paisaje, sino <em>aprender a construir dentro de él.</em></p></div><span className="handwritten">Y acá estamos.</span></div>
        <div className="origin-document reveal"><ConstructionSequence paused={paused}/><p className="photo-footnote">ARCHIVO KECHEU / EL BARRO GUARDA LA HUELLA.</p></div>
      </div>
    </section>
    <MaterialWords paused={paused}/>

    <section className="cabins-section section-pad" id="cabanas">
      <div className="section-heading reveal"><p className="eyebrow">02 / UN LUGAR PARA DESCANSAR</p><span className="small-note">Tres cabañas de construcción natural.</span></div>
      <div className="cabins-intro reveal"><h2>Hay muchas formas<br/>de <em>quedarse.</em></h2><div className="editorial-copy cabins-editorial"><p className="editorial-lead">Dos cabañas para cuatro, una al lado de la otra, <em>construidas en espejo.</em></p><p className="editorial-support">Desde afuera parecen una sola; adentro, cada una tiene su propio espacio.</p><p className="editorial-support editorial-closing">Y una tercera, <em>más pequeña, para dos.</em></p></div></div>
      <div className="cabin-scenes">{cabins.map((c,i)=><article className={'cabin-scene cabin-scene-'+i} key={c.number}>
        <Button variant="ghost" className="cabin-image-button reveal" onClick={()=>setSelectedCabin(i)} aria-label={'Ver fotografías de '+c.label}><PhotoFrame photo={{name:c.cover,alt:c.images[0].alt}} still/><span className="image-explore">Entrar <Plus size={17}/></span></Button>
        <div className="cabin-story reveal"><div className="cabin-meta"><span>{c.number} — {i===2?'Para dos':'Para cuatro'}</span></div><h3>{c.title}</h3><p>{i===2?'Más pequeña. Más recogida. Todo el valle alrededor.':c.description}</p><Button variant="link" className="text-link" onClick={()=>setSelectedCabin(i)}>Recorrer la cabaña <ArrowUpRight size={17}/></Button></div>
      </article>)}</div>
    </section>

    <HouseStory paused={paused}/>
    <FamilyAlbum paused={paused}/>

    <WorkshopSection onContact={openContact}/>

    <section className="life-section section-pad"><div className="life-title reveal"><p className="eyebrow">05 / LA VIDA ENTRE MEDIO</p><h2>Lo que crece.<br/><em>Lo que nos rodea.</em></h2></div><div className="life-grid"><div className="life-garden reveal"><PhotoFrame photo={{name:'garden',alt:'Trabajo cotidiano en la huerta de Kecheu'}}/><p>Cultivar.</p></div><div className="life-pond reveal"><PhotoFrame photo={{name:'house-pond',alt:'El estanque junto a la casa familiar, entre la vegetación'}}/><p>Cuidar.</p></div><div className="life-landscape reveal"><p className="life-surrounding-copy">La huerta, el estanque y las montañas forman parte de nuestros días. Más allá del predio, el río y el lago abren otras maneras de conocer Epuyén.</p><PhotoFrame photo={{name:'new-mountains',alt:'Montañas nevadas y vegetación vistas desde Kecheu'}}/><p>Compartir.</p></div></div></section>

    <PauseSection paused={paused}/>

    <PlaceSection paused={paused}/>

    <ManifestoSection/>

    <footer className="site-footer dark" id="contacto">
      <div className={'footer-top '+closingVideoStyles.composition}>
        <div className={closingVideoStyles.heading}><p className="eyebrow">07 / LA CONVERSACIÓN SIGUE</p><h2>¿Venís a<br/><em>conocerlo?</em></h2></div>
        <video className={closingVideoStyles.film} controls playsInline preload="none" poster="/media/kecheu-poster.jpg" aria-label="Conocé Kecheu: recorrido por las cabañas y sus espacios">
          <source src="/media/kecheu-web.mp4" type="video/mp4"/>
          Tu navegador no permite reproducir este video.
        </video>
        <div className={'footer-invite '+closingVideoStyles.invitation}><p>Escribinos y contanos cuándo te gustaría venir a Epuyén.</p><Button className="contact-button" onClick={openContact}>Escribinos por WhatsApp <ArrowRight size={24}/></Button>{!contact.whatsappNumber&&<span className="preview-note">Vista previa · WhatsApp pendiente de conectar</span>}</div>
      </div>
      <div className="footer-bottom"><a href="#llegar" className="wordmark">kecheu<span>EPUYÉN · PATAGONIA</span></a><div className="footer-socials">{contact.instagramUrl?<a href={contact.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>:<span>Instagram · próximamente</span>}{contact.airbnbUrl?<a href={contact.airbnbUrl} target="_blank" rel="noreferrer">Airbnb ↗</a>:<span>Airbnb · próximamente</span>}<a href={contact.mapUrl} target="_blank" rel="noreferrer">Cómo llegar · Epuyén ↗</a></div><Button variant="ghost" className="motion-toggle" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?<Play size={13}/>:<Pause size={13}/>} {paused?'Activar movimiento':'Pausar movimiento'}</Button></div><div className="footer-fine"><span>Hecho a mano. Hecho para habitar.</span><span>Barro · madera · arcilla · montaña</span></div>
      <a className={closingVideoStyles.backToTop} href="#llegar" onClick={(event)=>{event.preventDefault();window.scrollTo({top:0,behavior:paused||window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});window.history.replaceState(null,'','#llegar');}} aria-label="Volver al inicio del sitio"><span>Volver al inicio</span><ArrowUp size={20} aria-hidden="true"/></a>
    </footer>

    <Dialog open={menuOpen} onOpenChange={setMenuOpen}><DialogContent className="mobile-menu" showCloseButton={false}><DialogTitle>Kecheu</DialogTitle><DialogDescription>Un recorrido por nuestra historia.</DialogDescription><DialogClose render={<Button variant="ghost" className="menu-close" aria-label="Cerrar menú"/>}><X/></DialogClose><nav aria-label="Menú móvil">{[...nav,['contacto','Contacto']].map(([id,label])=><a key={id} href={'#'+id} onClick={()=>setMenuOpen(false)}>{label}<ArrowUpRight/></a>)}</nav></DialogContent></Dialog>
    <Dialog open={selectedCabin!==null} onOpenChange={open=>{if(!open)setSelectedCabin(null);}}>{selectedCabin!==null&&<CabinLightbox key={selectedCabin} cabin={cabins[selectedCabin]} onClose={()=>setSelectedCabin(null)}/>}</Dialog>
    <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}><DialogContent className="gallery-dialog" showCloseButton={false}><DialogClose render={<Button variant="ghost" className="gallery-close" aria-label="Cerrar archivo fotográfico"/>}><X/></DialogClose><CabinGallery cabin={storyArchive} archive onClose={()=>setArchiveOpen(false)}/></DialogContent></Dialog>
    <Dialog open={contactOpen} onOpenChange={setContactOpen}><DialogContent className="contact-dialog" showCloseButton={false}><DialogClose render={<Button variant="ghost" className="gallery-close" aria-label="Cerrar contacto"/>}><X/></DialogClose><DialogTitle>La conversación, muy pronto.</DialogTitle><DialogDescription>Esta es una vista previa. Falta incorporar el número de WhatsApp de Kecheu; todavía no se envían consultas desde acá.</DialogDescription><p>Podés copiar este mensaje para guardarlo:</p><textarea ref={copyRef} readOnly value={message} aria-label="Mensaje de consulta para copiar"/><Button onClick={copyMessage} className="copy-button">{copied?<Check size={17}/>:<Copy size={17}/>} {copied?'Mensaje copiado':'Copiar consulta'}</Button><p aria-live="polite" className="small-note">{copied?'El texto está en tu portapapeles. No se envió ningún mensaje.':'No se envía ningún mensaje ni se guardan datos.'}</p></DialogContent></Dialog>
  </main>;
}
