import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Menu, X, CircleUserRound } from 'lucide-react';

export default function Header({ onSearch }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return <header className="topbar"><div className="nav-wrap">
    <Link to="/" className="brand"><span className="brand-mark">S</span>STREAM<span className="brand-light">VAULT</span></Link>
    <nav className={open ? 'nav-links show' : 'nav-links'}>
      <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
      <a href="#discover" onClick={() => setOpen(false)}>Discover</a>
      <a href="#categories" onClick={() => setOpen(false)}>Categories</a>
      <a href="#latest" onClick={() => setOpen(false)}>Latest</a>
    </nav>
    <div className="nav-actions">
      {searchOpen && <input className="nav-search" autoFocus placeholder="Search titles..." onChange={e => onSearch(e.target.value)} />}
      <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(v => !v)}><Search size={19}/></button>
      <button className="profile-btn" aria-label="Profile"><CircleUserRound size={19}/><span>Sign in</span></button>
      <button className="icon-btn mobile-menu" aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>{open ? <X/> : <Menu/>}</button>
    </div>
  </div></header>;
}
