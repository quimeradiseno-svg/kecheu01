'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Pause, Play } from 'lucide-react';
import { photos } from './content';
import styles from './hero-gallery.module.css';

const images = [
  { src: '/images/hero.webp', alt: photos.hero.alt, position: '50% 54%', mobile: '38% 52%' },
  { src: '/images/hero-snow.webp', alt: 'Kecheu cubierto de nieve, con la casa y las cabañas en el paisaje de invierno', position: '50% 55%', mobile: '76% 55%' },
  { src: '/images/hero-rainbow.webp', alt: 'Un arcoíris sobre las montañas y las cabañas de Kecheu', position: '50% 65%', mobile: '73% 60%' },
];

export function HeroGallery({ paused }: { paused: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [loaded, setLoaded] = useState([true, false, false]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    const visibility = () => setTabVisible(!document.hidden);
    update(); visibility();
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (paused || stopped || focused || reduced || !visible || !tabVisible) return;
    const next = (active + 1) % images.length;
    if (!loaded[next]) return;
    const timer = window.setTimeout(() => setActive(next), 6500);
    return () => window.clearTimeout(timer);
  }, [active, paused, stopped, focused, reduced, visible, tabVisible, loaded]);

  return <div ref={root} className={styles.gallery} role="region" aria-label="Paisajes de Kecheu">
    <div className={styles.images}>
      {images.map((image, index) => <img key={image.src} src={image.src} alt={image.alt} aria-hidden={active !== index} className={styles.image} data-active={active === index} style={{ '--position': image.position, '--mobile-position': image.mobile } as CSSProperties} fetchPriority={index === 0 ? 'high' : 'low'} decoding="async" onLoad={() => setLoaded(current => current.map((value, i) => i === index ? true : value))} />)}
    </div>
    <div className={styles.controls} onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      {images.map((image, index) => <button key={image.src} type="button" className={styles.line} aria-label={'Mostrar fotografía '+(index + 1)} aria-pressed={active === index} onClick={() => { if (loaded[index]) setActive(index); }}><span /></button>)}
      {!reduced && !paused && <button type="button" className={styles.pause} aria-label={stopped ? 'Reanudar el cambio automático de fotos' : 'Pausar el cambio automático de fotos'} onClick={() => setStopped(value => !value)}>{stopped ? <Play size={12} /> : <Pause size={12} />}</button>}
    </div>
  </div>;
}
