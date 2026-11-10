import React, { useEffect, useMemo, useState } from 'react';
import { getSeries } from '../services/seriesApi';
import { ArrowRight, Play, Sparkles, SlidersHorizontal } from 'lucide-react';
import { catalog, categories } from '../data/catalog';
import SeriesCard from '../components/SeriesCard';

export default function Home({ search, onSelect }) {
  const [active, setActive] = useState('All');
  const [series, setSeries] = useState(catalog);
  const [apiStatus, setApiStatus] = useState('loading');
  useEffect(() => {
    let cancelled = false;
    getSeries().then(items => { if (!cancelled) {
      const mapped = items.map(item => ({ id: item._id || item.slug, title: item.title, category: item.genres?.[0] || 'Series', year: item.releaseYear || '', rating: item.rating ?? '—', episodes: item.episodeCount || 0, image: item.posterUrl || item.backdropUrl || '', description: item.description || '', ...item }));
      if (mapped.length) setSeries(mapped);
      setApiStatus('connected');
    }}).catch(() => { if (!cancelled) setApiStatus('offline'); });
    return () => { cancelled = true; };
  }, []);
  const filtered = useMemo(() => series.filter(item => (active === 'All' || (item.genres || [item.category]).includes(active)) && item.title.toLowerCase().includes(search.toLowerCase())), [active, search, series]);
  return <main>
    <section className="hero"><div className="hero-image"/><div className="hero-shade"/><div className="hero-content page-width">
      <div className="eyebrow"><Sparkles size={14}/> THE STREAMVAULT ORIGINALS</div>
      <p className="hero-kicker">A NEW WORLD OF STORIES</p><h1>Stories worth<br/><em>staying up for.</em></h1>
      <p className="hero-copy">Discover unforgettable series, fresh perspectives, and stories that stay with you long after the credits roll.</p>
      <div className="hero-buttons"><button className="btn btn-gold" onClick={() => onSelect(catalog[0])}><Play size={16} fill="currentColor"/> Explore featured</button><a className="btn btn-ghost" href="#discover">Explore library <ArrowRight size={16}/></a></div>
      <div className="hero-foot"><span><b>01</b> / 04</span><span className="hero-line"/><span>CURATED FOR YOU</span></div>
    </div><div className="hero-caption">FEATURED COLLECTION <span>—</span> VOL. 01</div></section>
    <section className="stats-strip page-width"><div><strong>Curated</strong><span>Stories selected for you</span></div><div><strong>Discover</strong><span>New worlds every week</span></div><div><strong>Anytime</strong><span>Your next favourite awaits</span></div></section>
    <section className="content-section page-width" id="discover"><div className="section-heading"><div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>Explore the collection<span>.</span></h2></div><span className="section-count">{filtered.length.toString().padStart(2,'0')} TITLES</span></div>
      <div className="filter-row" id="categories"><div className="filter-label"><SlidersHorizontal size={15}/> FILTER BY</div><div className="filters">{categories.map(c => <button key={c} onClick={() => setActive(c)} className={active === c ? 'filter active' : 'filter'}>{c}</button>)}</div></div>
      {apiStatus === 'offline' && <p className="api-notice">API unavailable — showing preview titles. Start the backend to load your MongoDB catalogue.</p>}
      {filtered.length ? <div className="series-grid">{filtered.map(item => <SeriesCard key={item.id} item={item} onSelect={onSelect}/>)}</div> : <div className="empty-state">No titles match that search. Try another keyword.</div>}
    </section>
    <section className="editorial page-width" id="latest"><div><p className="eyebrow">YOUR NEXT OBSESSION</p><h2>There is always<br/><em>more to discover.</em></h2><p>Find a story for every mood, every moment, and every kind of curious mind.</p></div><a href="#discover" className="round-link"><ArrowRight/></a></section>
  </main>;
}
