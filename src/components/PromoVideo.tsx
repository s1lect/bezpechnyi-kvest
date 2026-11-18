import { useRef, useState } from 'react';
import './PromoVideo.css';

const SRC = `${import.meta.env.BASE_URL}promo.mp4`;
const POSTER = `${import.meta.env.BASE_URL}promo-poster.jpg`;

/** Промовідео платформи: обкладинка з кнопкою, відео вантажиться лише після натискання. */
export function PromoVideo() {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => void video.current?.play());
  };

  return (
    <section className="container band promo reveal-scale" aria-labelledby="promo-title">
      <div className="promo__frame">
        {playing ? (
          <video
            ref={video}
            className="promo__video"
            src={SRC}
            poster={POSTER}
            controls
            playsInline
            preload="auto"
            aria-label="Промовідео без мовлення: усі тексти показано на екрані"
          />
        ) : (
          <button className="promo__cover" onClick={play} aria-label="Відтворити відео про проєкт, 40 секунд">
            <img src={POSTER} alt="" loading="lazy" decoding="async" width={1920} height={1080} />
            <span className="promo__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div className="promo__text">
        <h2 id="promo-title">Безпечний квест за 40 секунд</h2>
        <p>Як учні проходять квести, а вчитель проводить урок із проєктором і телефонами.</p>
      </div>
    </section>
  );
}
