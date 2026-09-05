'use client';

import { useState } from 'react';
import imageSizes from './image-sizes.json';
import styles from './manifesto-section.module.css';

const items = [
  {
    line: 'Un lugar para descansar.',
    image: 'hero',
    alt: 'Las cabañas de Kecheu integradas en el paisaje de Epuyén',
  },
  {
    line: 'Un valle para volar.',
    image: 'place-kecheu-home',
    alt: 'El valle y las montañas de Epuyén alrededor de Kecheu',
  },
  {
    line: 'El barro para habitar.',
    image: 'house-inside',
    alt: 'El interior de la casa natural de Kecheu, construido con barro y madera',
  },
  {
    line: 'Arcilla para crear.',
    image: 'real-clay',
    alt: 'Una pieza de arcilla sostenida entre las manos en el taller de Kecheu',
  },
] as const;

export function ManifestoSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pinned, setPinned] = useState(0);
  const active = hovered ?? focused ?? pinned;

  return <section className={styles.section} aria-label="Manifiesto de Kecheu" data-manifesto-interactive>
    <p className={'eyebrow ' + styles.intro}>AHORA YA CONOCÉS LA HISTORIA</p>
    <div className={styles.experience}>
      <div className={styles.lines} role="list" aria-label="Manifiesto interactivo">
        {items.map((item, index) => <div role="listitem" key={item.line}>
          <button
            type="button"
            className={styles.line}
            data-active={active === index}
            aria-pressed={pinned === index}
            aria-controls={'manifesto-image-' + index}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(null)}
            onClick={() => setPinned(index)}
          >
            <span className={styles.number}>0{index + 1}</span>
            <span>{item.line}</span>
          </button>
        </div>)}
      </div>

      <div className={styles.stage} aria-live="polite">
        {items.map((item, index) => {
          const size = imageSizes[item.image];
          return <figure
            className={styles.image}
            data-active={active === index}
            id={'manifesto-image-' + index}
            aria-hidden={active !== index}
            key={item.image}
          >
            <img
              src={'/images/' + item.image + '.webp'}
              srcSet={'/images/' + item.image + '-small.webp ' + size.smallWidth + 'w, /images/' + item.image + '.webp ' + size.width + 'w'}
              sizes="(max-width: 760px) 100vw, 52vw"
              width={size.width}
              height={size.height}
              alt={item.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>;
        })}
      </div>
    </div>

    <div className={styles.conclusion}>
      <p>Esto es <em>Kecheu.</em></p>
    </div>
  </section>;
}
