'use client';

import { useEffect, useRef, useState } from 'react';
import imageSizes from './image-sizes.json';
import styles from './place-section.module.css';

type PlaceImage = keyof typeof imageSizes;

function LandscapePhoto({ name, alt, className }: { name: PlaceImage; alt: string; className: string }) {
  const size = imageSizes[name];

  return <figure className={className}>
    <img
      src={'/images/' + name + '.webp'}
      srcSet={'/images/' + name + '-small.webp ' + size.smallWidth + 'w, /images/' + name + '.webp ' + size.width + 'w'}
      sizes="(max-width: 760px) 100vw, 70vw"
      width={size.width}
      height={size.height}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  </figure>;
}

export function PlaceSection({ paused }: { paused: boolean }) {
  const sceneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const motionOff = paused || reduced;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const verticalLayout = motionOff || window.matchMedia('(max-width: 760px)').matches;

      if (verticalLayout) {
        scene.style.removeProperty('height');
        scene.style.setProperty('--place-x', '0px');
        scene.style.setProperty('--place-progress', '0');
        return;
      }

      const travel = Math.max(1, canvas.scrollWidth - window.innerWidth);
      scene.style.height = travel + window.innerHeight + 'px';
      const rect = scene.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      scene.style.setProperty('--place-x', -progress * travel + 'px');
      scene.style.setProperty('--place-progress', String(progress));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ready = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(ready);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [motionOff]);

  return <section
    ref={sceneRef}
    className={styles.section}
    id="lugar"
    data-place-horizontal="7"
    data-motion-off={motionOff}
    aria-labelledby="place-title"
  >
    <div className={styles.sticky}>
      <div ref={canvasRef} className={styles.canvas}>
        <article className={styles.intro}>
          <div className={styles.introCopy}>
            <p className="eyebrow">06 — UN VALLE PARA VOLAR</p>
            <h2 id="place-title">La naturaleza<br/>no es el fondo.<br/><em>Es la protagonista.</em></h2>
          </div>
          <LandscapePhoto
            name="lake"
            alt="El Lago Epuyén y las montañas reflejadas en el agua transparente"
            className={styles.entryPhoto}
          />
        </article>

        <article className={styles.riverMoment}>
          <p className={styles.distanceText}>A 500 m,<br/><em>el río.</em></p>
          <LandscapePhoto
            name="river"
            alt="El río Epuyén, transparente y rodeado de vegetación"
            className={styles.riverPhoto}
          />
        </article>

        <article className={styles.pairMoment} aria-label="Caminos y arroyos de Epuyén">
          <LandscapePhoto
            name="place-forest-road"
            alt="Un camino de Epuyén entre pinos, álamos y montañas"
            className={styles.forestPhoto}
          />
          <LandscapePhoto
            name="place-stream"
            alt="Un arroyo transparente entre árboles, con la montaña al fondo"
            className={styles.streamPhoto}
          />
        </article>

        <article className={styles.lakeMoment}>
          <div className={styles.lakeCopy}>
            <p>A 3 km,<br/><em>el lago.</em></p>
          </div>
          <LandscapePhoto
            name="place-lake-october"
            alt="Agua azul del Lago Epuyén, con la costa arbolada y las montañas al fondo"
            className={styles.lakePhoto}
          />
        </article>

        <article className={styles.mountainMoment}>
          <p>Y alrededor,<br/><em>montaña.</em></p>
          <LandscapePhoto
            name="new-mountains"
            alt="Vista abierta de las montañas nevadas de Epuyén"
            className={styles.mountainPhoto}
          />
        </article>

        <article className={styles.finalMoment}>
          <LandscapePhoto
            name="place-kecheu-home"
            alt="Kecheu integrado en el valle, al pie de las montañas de Epuyén"
            className={styles.cabinPhoto}
          />
          <p>Y ahí en el medio,<br/><em>estamos nosotros.</em></p>
        </article>
      </div>
      <div className={styles.progress} aria-hidden="true"><span/></div>
    </div>
  </section>;
}
