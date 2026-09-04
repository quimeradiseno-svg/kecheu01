'use client';

import { useEffect, useRef, useState } from 'react';
import imageSizes from './image-sizes.json';
import { pauseMomentIndex, pauseMoments } from './pause-sequence';
import styles from './pause-section.module.css';

export function PauseSection({ paused }: { paused: boolean }) {
  const sceneRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (paused) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!sceneRef.current || !stickyRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const travel = Math.max(1, rect.height - stickyRef.current.clientHeight);
      setActiveIndex(pauseMomentIndex(-rect.top / travel));
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
  }, [paused]);

  return <section ref={sceneRef} className={styles.scene + ' dark'} data-pause-sequence="4" aria-labelledby="pause-title">
    <div ref={stickyRef} className={styles.sticky}>
      <div className={styles.images}>
        {pauseMoments.map((moment, index) => {
          const size = imageSizes[moment.image];
          return <img key={moment.image} className={styles.image} data-active={index === activeIndex} data-photo={moment.image}
            src={'/images/' + moment.image + '.webp'}
            srcSet={'/images/' + moment.image + '-small.webp ' + size.smallWidth + 'w, /images/' + moment.image + '.webp ' + size.width + 'w'}
            sizes="100vw" width={size.width} height={size.height} alt={moment.alt}
            aria-hidden={index !== activeIndex} loading="eager" decoding="async"/>
        })}
      </div>
      <div className="pause-shade"/>
      <div className="pause-text">
        <h2 id="pause-title">Aunque también<br/>podés <em>no hacer<br/>nada.</em></h2>
        <div className={styles.moments}>
          {pauseMoments.map((moment, index) => <div key={moment.image} className={styles.moment} data-active={index === activeIndex} aria-hidden={index !== activeIndex}>
            <span className={styles.counter}>{String(index + 1).padStart(2, '0')} / 04</span>
            <p>{moment.text}</p>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
