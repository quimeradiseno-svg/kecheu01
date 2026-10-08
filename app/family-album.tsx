'use client';

import { useState } from 'react';
import styles from './family-album.module.css';

const photos = [
  {name:'family',alt:'Retrato de la familia de Kecheu: dos adultos y sus dos hijos',label:'La familia'},
  {name:'family-outdoors',alt:'Un niño sobre la tranquera frente a la casa familiar de Kecheu',label:'Crecer afuera'},
  {name:'family-at-home',alt:'Un niño jugando en el piso de madera de la casa familiar',label:'La casa habitada'},
  {name:'family-window',alt:'Un niño de pie dentro de la gran ventana circular del taller',label:'La ventana del taller'},
  {name:'garden',alt:'Trabajo cotidiano en la huerta de Kecheu',label:'La huerta'},
  {name:'bread',alt:'Pan casero sobre la mesa familiar de Kecheu',label:'El pan sobre la mesa'},
];

export function FamilyAlbum({paused}:{paused:boolean}) {
  const [active,setActive] = useState(0);
  return <section className="family-section section-pad" id="familia">
    <div className="family-album">
      <figure className={styles.photo+' reveal'} id="family-album-photo" aria-label="Fotografía del álbum familiar">
        {photos.map((photo,index)=><img key={photo.name} src={'/images/'+photo.name+'.webp'} alt={photo.alt} loading="lazy" decoding="async" aria-hidden={index!==active} data-active={index===active} className={paused?styles.still:undefined}/>)}
      </figure>
    </div>
    <div className="family-copy reveal">
      <p className="eyebrow">EL PROYECTO TAMBIÉN ES LA VIDA</p>
      <h2>No sólo lo<br/>construimos.<br/><em>Lo habitamos.</em></h2>
      <p className="body-copy">Después de construir las cabañas, Daniel y Laura levantaron su propia casa-taller en el mismo lugar y se mudaron allí con sus hijos.</p>
      <p className="body-copy">Lo que había comenzado como un proyecto terminó convirtiéndose en una forma de vivir.</p>
      <p className="body-copy">La casa, el taller, la huerta, el estanque. Los chicos creciendo, el pan sobre la mesa.</p>
      <div className={styles.album}>
        <div className={styles.meta}><span>Nuestro álbum</span><span aria-live="polite">{String(active+1).padStart(2,'0')} / 06</span></div>
        <div className={styles.thumbnails} role="group" aria-label="Elegir una foto del álbum familiar">
          {photos.map((photo,index)=><button key={photo.name} type="button" aria-label={'Ver en el álbum: '+photo.label} aria-pressed={active===index} aria-controls="family-album-photo" onClick={()=>setActive(index)} onKeyDown={event=>{
            if(event.key==='ArrowRight'||event.key==='ArrowLeft') {
              event.preventDefault();
              const next=(index+(event.key==='ArrowRight'?1:-1)+photos.length)%photos.length;
              setActive(next);
              const buttons=event.currentTarget.parentElement?.querySelectorAll('button');
              buttons?.[next]?.focus();
            }
          }}><img src={'/images/'+photo.name+'-small.webp'} alt="" loading="lazy" decoding="async"/></button>)}
        </div>
      </div>
    </div>
  </section>;
}
