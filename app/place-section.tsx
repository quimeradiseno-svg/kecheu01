import imageSizes from './image-sizes.json';
import styles from './place-section.module.css';

const lakeSize = imageSizes.lake;

export function PlaceSection() {
  return <section className={'place-section section-pad ' + styles.section} id="lugar" data-place-landscape="lake">
    <div className="section-heading reveal">
      <p className="eyebrow">06 / UN VALLE PARA VOLAR</p>
      <span className="small-note">Epuyén · Chubut · Patagonia Argentina</span>
    </div>
    <div className={styles.composition}>
      <div className={styles.copy + ' reveal'}>
        <h2>La naturaleza<br/>no es el fondo.<br/><em>Es la protagonista.</em></h2>
        <p>Agua, senderos y montaña a pocos minutos de Kecheu. En el Lago Epuyén, incluso los motores se quedan afuera.</p>
      </div>
      <figure className={styles.landscape + ' reveal'}>
        <img src="/images/lake.webp" srcSet={'/images/lake-small.webp ' + lakeSize.smallWidth + 'w, /images/lake.webp ' + lakeSize.width + 'w'}
          sizes="(max-width: 760px) 100vw, 65vw" width={lakeSize.width} height={lakeSize.height}
          alt="Aguas transparentes del Lago Epuyén, rodeadas por bosque y montaña" loading="lazy" decoding="async"/>
      </figure>
    </div>
    <div className={styles.distances + ' reveal'} aria-label="Distancias desde Kecheu">
      <div><span>500 <small>m</small></span><p>Río Epuyén</p></div>
      <div><span>3 <small>km</small></span><p>Lago Epuyén</p></div>
      <div><span>4 <small>km</small></span><p>Pueblo</p></div>
    </div>
  </section>;
}
