'use client';

import { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cabins } from './content';
import styles from './cabin-lightbox.module.css';

export function CabinLightbox({ cabin, onClose }: { cabin: typeof cabins[number]; onClose: () => void }) {
  const [viewport, api] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);
  const thumbnails = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;
    const select = () => setCurrent(api.selectedScrollSnap());
    select();
    api.on('select', select);
    api.on('reInit', select);
    return () => { api.off('select', select); api.off('reInit', select); };
  }, [api]);

  useEffect(() => {
    thumbnails.current?.querySelector<HTMLButtonElement>(`[data-index="${current}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }, [current]);

  return <DialogContent className={styles.dialog} showCloseButton={false} onKeyDown={event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); api?.scrollPrev(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); api?.scrollNext(); }
  }}>
    <header className={styles.header}>
      <div><DialogTitle className={styles.title}>{cabin.label}</DialogTitle><DialogDescription className={styles.capacity}>{cabin.capacity} · Barro y madera</DialogDescription></div>
      <span className={styles.counter} aria-live="polite">{String(current + 1).padStart(2, '0')} / {String(cabin.images.length).padStart(2, '0')}</span>
      <DialogClose render={<button type="button" className={styles.close} aria-label="Cerrar galería" />}><X size={23}/></DialogClose>
    </header>
    <div className={styles.stage} role="region" aria-label={'Fotografías de '+cabin.label} aria-roledescription="galería">
      <div className={styles.viewport} ref={viewport}>
        <div className={styles.track}>{cabin.images.map((photo, index) => <div className={styles.slide} key={photo.name} role="group" aria-label={`${index + 1} de ${cabin.images.length}`} aria-hidden={index !== current}>
          <img src={'/images/'+photo.name+'.webp'} alt={photo.alt} draggable={false} loading={index < 2 ? 'eager' : 'lazy'} decoding="async"/>
        </div>)}</div>
      </div>
      <button type="button" className={styles.previous} onClick={() => api?.scrollPrev()} aria-label="Fotografía anterior"><ArrowLeft size={22}/></button>
      <button type="button" className={styles.next} onClick={() => api?.scrollNext()} aria-label="Fotografía siguiente"><ArrowRight size={22}/></button>
    </div>
    <p className={styles.caption} aria-live="polite">{cabin.images[current].caption}</p>
    <div className={styles.thumbnails} ref={thumbnails} aria-label="Elegir fotografía">
      {cabin.images.map((photo, index) => <button key={photo.name} type="button" data-index={index} aria-label={`Ver foto ${index + 1}: ${photo.alt}`} aria-pressed={index === current} onClick={() => api?.scrollTo(index)}>
        <img src={'/images/'+photo.name+'-small.webp'} alt="" loading="lazy" draggable={false}/>
      </button>)}
    </div>
    <div className={styles.bottom}><span>Deslizá o usá las flechas para recorrer</span><a href="#contacto" onClick={onClose}>Consultar por esta cabaña <ArrowUpRight size={15}/></a></div>
  </DialogContent>;
}
