import { RoadsideChat } from '../components/RoadsideChat';

export function RoadsideAssistantPage() {
  return <main className="page-frame"><header className="topbar"><div className="brand-lockup"><span className="brand-symbol" aria-hidden="true">+</span><span>Roadside Assistant</span></div><span className="topbar-status"><span className="status-dot" /> Safety first</span></header><section className="hero-grid"><div className="intro-column"><p className="eyebrow">Phase 0 roadside guidance</p><h1>Clear thinking for the moment your car stops.</h1><p className="intro-copy">A calm, structured conversation for what to do next. Guidance is based on reported symptoms, not a confirmed diagnosis.</p><div className="signal-line"><span>01</span><span>Safety check</span><span>02</span><span>Reported symptoms</span><span>03</span><span>Next safe action</span></div></div><div className="chat-column"><RoadsideChat /></div></section></main>;
}
