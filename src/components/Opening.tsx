import React from 'react';

interface OpeningProps {
  lang: 'en' | 'kr';
  setLang: (lang: 'en' | 'kr') => void;
  onEnter: () => void;
}

const Opening: React.FC<OpeningProps> = ({ lang, setLang, onEnter }) => {
  return (
    <div id="videoOpening" className="video-opening">
      <video id="openingVideo" className="video-bg" autoPlay muted playsInline>
        <source src="assets/opening.mp4" type="video/mp4" />
      </video>

      <div className="opening-panel">
        <div className="lang-pill">
          <button 
            className={lang === 'en' ? 'active' : ''} 
            onClick={() => setLang('en')}
          >EN</button>
          <button 
            className={lang === 'kr' ? 'active' : ''} 
            onClick={() => setLang('kr')}
          >KR</button>
        </div>
        <button className="enter-btn" onClick={onEnter}>Enter</button>
      </div>

      <div className="video-title">
        <h1>{lang === 'en' ? '2026 Medical Training Seminar' : '2026 중동 의료인 연수 세미나'}</h1>
        <p>{lang === 'en' ? 'In conjunction with Medical Korea 2026' : 'Medical Korea 2026 연계'}</p>
      </div>
    </div>
  );
};

export default Opening;
