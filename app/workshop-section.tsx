'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import images from './workshop-images.json';
import styles from './workshop-section.module.css';

function WorkshopPhoto({ name, alt, className = '' }: { name: 'room' | 'door' | 'hands' | 'shared' | 'piece'; alt: string; className?: string }) {
  const size = images[name];
  return <figure className={`${styles.photo} ${className}`}>
    <img src={`/images/atelier/${name}.webp`} srcSet={`/images/atelier/${name}-small.webp ${size.smallWidth}w, /images/atelier/${name}.webp ${size.width}w`} sizes={name === 'room' ? '100vw' : name === 'door' ? '(max-width:760px) 100vw, 56vw' : '(max-width:760px) 65vw, 30vw'} width={size.width} height={size.height} loading={name === 'room' || name === 'door' ? 'eager' : 'lazy'} decoding="async" alt={alt}/>
  </figure>;
}

export function WorkshopSection({ onContact }: { onContact: () => void }) {
  const passageRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const update = () => {
      frame = 0;
      const passage = passageRef.current;
      const stage = stageRef.current;
      if (!passage || !stage) return;
      const progress = clamp(-passage.getBoundingClientRect().top / Math.max(1, passage.offsetHeight - stage.offsetHeight));
      const blend = clamp((progress - .2) / .6);
      const eased = blend * blend * (3 - 2 * blend);
      stage.style.setProperty('--room-opacity', String(eased));
      stage.style.setProperty('--door-opacity', String(1 - eased));
      stage.style.setProperty('--door-scale', String(1 + progress * .16));
      stage.style.setProperty('--title-opacity', String(1 - clamp(progress / .45)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <section className={styles.section} id="taller" aria-labelledby="atelier-title">
    <div ref={passageRef} className={styles.passage}>
      <div ref={stageRef} className={styles.stage}>
        <WorkshopPhoto name="door" className={styles.doorScene} alt="La puerta orgánica de madera desde la casa, con la ventana circular del taller al fondo"/>
        <WorkshopPhoto name="room" className={styles.roomScene} alt="El taller completo de Laura: mesa, estanterías con piezas, ventana circular y vigas de madera"/>
        <div className={styles.sceneTitle}>
          <p className={styles.eyebrow}>04 / ARCILLA PARA CREAR</p>
          <h2 id="atelier-title">En esta casa,<br/>el barro cambia<br/>de <em>escala.</em></h2>
          <p className={styles.sceneNote}>Pasando esa puerta,<br/>está el taller de Laura.</p>
        </div>
      </div>
    </div>
    <p className={styles.bridge}>El mismo barro que levanta paredes,<br/>acá termina <em>entre las manos.</em></p>
    <div className={styles.closing}>
      <div className={styles.photoStack}>
        <WorkshopPhoto name="piece" className={styles.piece} alt="Una mano sostiene una pieza de cerámica modelada con un rostro, junto a otras piezas del taller"/>
        <WorkshopPhoto name="hands" className={styles.hands} alt="Primer plano de manos modelando un rostro en arcilla"/>
      </div>
      <WorkshopPhoto name="shared" className={styles.shared} alt="Personas trabajando con cerámica alrededor de la mesa del taller de Laura"/>
      <div className={styles.invitation}>
        <h3>A veces,<br/>la mesa se <em>llena.</em></h3>
        <p>El taller también abre sus puertas a quienes quieran acercarse a la arcilla.</p>
        <Button variant="link" className={styles.contact} onClick={onContact}>Consultar por clases <ArrowRight size={18}/></Button>
      </div>
    </div>
  </section>;
}
