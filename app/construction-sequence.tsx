'use client';

import { useEffect, useRef, useState } from 'react';
import imageSizes from './image-sizes.json';
import styles from './construction-sequence.module.css';

const frameNames = [
  'build-step-01',
  'build-step-02',
  'build-step-03',
  'build-step-04',
  'build-step-05',
  'build-step-06',
  'build-step-07',
  'build-step-08',
  'build-step-09',
  'build-step-10',
  'build-step-11',
  'build-step-12',
  'build-step-13',
  'build-step-14',
  'build-step-15',
  'build-step-16',
] as const;

export function ConstructionSequence({ paused }: { paused: boolean }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      entries => setVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0.25 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) {
      setActive(frameNames.length - 1);
      return;
    }
    if (paused || !visible || active === frameNames.length - 1) return;

    const timer = window.setTimeout(
      () => setActive(index => Math.min(index + 1, frameNames.length - 1)),
      560,
    );
    return () => window.clearTimeout(timer);
  }, [active, paused, visible]);

  return <figure ref={frameRef} className={`origin-main ${styles.frame}`} aria-label="Secuencia fotográfica de la construcción de Kecheu">
    {frameNames.map((name, index) => {
      const size = imageSizes[name];
      const step = String(index + 1).padStart(2, '0');
      return <img
        key={name}
        className={styles.image}
        data-active={index === active}
        src={`/images/${name}.webp`}
        srcSet={`/images/${name}-small.webp ${size.smallWidth}w, /images/${name}.webp ${size.width}w`}
        sizes="(max-width:760px) 100vw, 55vw"
        width={size.width}
        height={size.height}
        alt={index === active ? (index === 15 ? 'Daniel terminando a mano el muro de barro de Kecheu' : `Etapa ${step} de la construcción de Kecheu`) : ''}
        aria-hidden={index !== active}
        loading={index < 2 ? 'eager' : 'lazy'}
        decoding="async"
      />;
    })}
  </figure>;
}
