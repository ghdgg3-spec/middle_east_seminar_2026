import React, { useState } from 'react';
import './App.css';
import Opening from './components/Opening';

function App() {
  const [showOpening, setShowOpening] = useState(true);
  const [lang, setLang] = useState<'en' | 'kr'>('en');

  const t = (en: string, kr: string) => (lang === 'en' ? en : kr);

  return (
    <div className="App">
      {showOpening && <Opening onSkip={() => setShowOpening(false)} />}

      <div id="page" style={{ opacity: showOpening ? 0 : 1 }}>
        <nav>
          <div className="container nav-container">
            <div className="logo">2026 Seminar</div>
            <div className="nav-right">
              <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'kr' : 'en')}>
                {lang === 'en' ? 'KR' : 'EN'}
              </button>
            </div>
          </div>
        </nav>

        <section className="hero">
          <div className="container">
            <div className="hero-badge">MEDICAL KOREA 2026</div>
            <h1 className="hero-title">{t("2026 Medical Training Seminar", "2026 중동 의료인 연수 세미나")}</h1>
            <p className="hero-subtitle">{t("Academic Exchange & Networking", "학술 교류 및 네트워킹")}</p>
          </div>
        </section>

        <section id="overview" className="content">
          <div className="container">
            <h2 className="section-title">{t("Overview", "행사 개요")}</h2>
            <div className="card">
              <p>{t("This seminar is held during Medical Korea 2026...", "본 행사는 Medical Korea 2026 기간 중 진행되는...")}</p>
            </div>
          </div>
        </section>

        <section id="program" className="content">
          <div className="container">
            <h2 className="section-title">{t("Program", "프로그램")}</h2>
            <div className="card">
              <div className="program-item">
                <div className="program-time">15:00</div>
                <div>{t("Opening & Welcome", "개회 및 인사말씀")}</div>
              </div>
              <div className="program-item">
                <div className="program-time">15:20</div>
                <div>{t("Academic Session", "학술 세션")}</div>
              </div>
            </div>
          </div>
        </section>

        <footer>© 2026 Middle East Medical Training Program</footer>
      </div>
    </div>
  );
}

export default App;
