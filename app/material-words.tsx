'use client';

import { useEffect, useRef } from 'react';
import styles from './material-words.module.css';

export function MaterialWords({ paused }: { paused: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const words = Array.from(section.children) as HTMLElement[];
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      if (paused || preference.matches) {
        section.dataset.animate = 'false';
        words.forEach(word => { word.dataset.visible = 'true'; });
        return;
      }
      section.dataset.animate = 'true';
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting && entry.intersectionRatio >= .7);
        });
      }, { threshold: [0, .7], rootMargin: '0px 0px -15% 0px' });
      words.forEach(word => observer?.observe(word));
    };
    setup();
    preference.addEventListener('change', setup);
    return () => { observer?.disconnect(); preference.removeEventListener('change', setup); };
  }, [paused]);

  return <section ref={sectionRef} id="materiales" className={`material-sequence ${styles.sequence}`} aria-label="Nuestros materiales">
    <p className="material-word"><span className={styles.word}>Tierra.</span></p>
    <p className="material-word"><span className={styles.word}>Madera.</span></p>
    <p className="material-word"><span className={styles.word}>Tiempo.</span></p>
    <span className={`eyebrow ${styles.note}`}>LO ESENCIAL YA ESTABA ACÁ.</span>
  </section>;
}
