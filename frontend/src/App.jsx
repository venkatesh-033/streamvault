import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Watch from './pages/Watch';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import DetailModal from './components/DetailModal';

function AgeGate({ onAccept }) {
  return <div className="age-gate"><div className="age-card"><div className="brand age-brand"><span className="brand-mark">S</span>STREAM<span className="brand-light">VAULT</span></div><span className="age-icon">18+</span><p className="eyebrow">AGE-RESTRICTED PLATFORM</p><h1>Before you enter</h1><p>This platform is intended for adults aged 18 and over. By continuing, you confirm that you are at least 18 and agree to follow the laws applicable in your location.</p><button className="btn btn-gold age-accept" onClick={onAccept}>I am 18 or older <ArrowRightIcon/></button><span className="age-foot">If you are under 18, please leave this site.</span></div></div>;
}
function ArrowRightIcon(){ return <span aria-hidden="true">→</span>; }

export default function App() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [verified, setVerified] = useState(() => sessionStorage.getItem('streamvault-age-ok') === 'yes');
  const accept = () => { sessionStorage.setItem('streamvault-age-ok', 'yes'); setVerified(true); };
  if (!verified) return <AgeGate onAccept={accept}/>;
  return <><Header onSearch={setSearch}/><Routes><Route path="/" element={<Home search={search} onSelect={setSelected}/>}/><Route path="/admin" element={<Admin/>}/><Route path="/watch/:episodeId" element={<Watch/>}/><Route path="*" element={<Home search={search} onSelect={setSelected}/>}/></Routes><footer className="footer"><div className="page-width footer-inner"><LinkBrand/><span>© 2026 StreamVault. All rights reserved.</span><span>18+ · Watch responsibly</span></div></footer><DetailModal item={selected} onClose={() => setSelected(null)}/></>;
}
function LinkBrand(){ return <div className="brand"><span className="brand-mark">S</span>STREAM<span className="brand-light">VAULT</span></div>; }
