'use client';

import { useEffect, useRef, useState } from 'react';
import imageSizes from './image-sizes.json';
import { houseMomentIndex, houseMoments } from './house-sequence';
import styles from './house-story.module.css';

export function HouseStory({ paused }: { paused: boolean }) {
  const sceneRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
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
    if (motionOff) {
      setActiveIndex(houseMoments.length - 1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!sceneRef.current || !stickyRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const travel = Math.max(1, rect.height - stickyRef.current.clientHeight);
      setActiveIndex(houseMomentIndex(-rect.top / travel));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [motionOff]);

  return <section id="casa" ref={sceneRef} className={styles.scene + ' dark'} data-house-sequence="4" data-motion-off={motionOff} aria-labelledby="house-title">
    <div ref={stickyRef} className={styles.sticky}>
      <div className={styles.lead}>
        <p className="eyebrow house-chapter">03 / EL BARRO PARA HABITAR</p>
        <h2 id="house-title" className="house-sentence">
          <span className={'house-beat ' + styles.beat} data-active={activeIndex >= 0}>Y después,</span>
          <span className={'house-beat ' + styles.beat} data-active={activeIndex >= 1}>se convirtió</span>
          <span className={'house-beat house-final ' + styles.beat} data-active={activeIndex >= 2}>en <em>casa.</em></span>
        </h2>
      </div>
      <div className={styles.visual}>
        <div className={styles.images}>
          {houseMoments.map((moment, index) => {
            const size = imageSizes[moment.image];
            return <img key={moment.image} className={styles.image} data-active={index === activeIndex} data-photo={moment.image}
              src={'/images/' + moment.image + '.webp'}
              srcSet={'/images/' + moment.image + '-small.webp ' + size.smallWidth + 'w, /images/' + moment.image + '.webp ' + size.width + 'w'}
              sizes="(max-width: 760px) 100vw, 60vw" width={size.width} height={size.height} alt={moment.alt}
              aria-hidden={index !== activeIndex} loading="eager" decoding="async"/>
          })}
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span>{String(activeIndex + 1).padStart(2, '0')} / 04</span>
          <span>{houseMoments[activeIndex].label}</span>
        </div>
        <p className={'house-context ' + styles.context}>LA CASA-TALLER DE LA FAMILIA · NO ES UNA CABAÑA DE ALQUILER</p>
      </div>
    </div>
  </section>;
}
