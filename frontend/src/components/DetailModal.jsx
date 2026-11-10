import React, { useEffect, useState } from 'react';
import { X, Play, Star, CalendarDays, ListVideo } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/seriesApi';

export default function DetailModal({ item, onClose }) {
  const [episodes, setEpisodes] = useState([]);
  const [episodeError, setEpisodeError] = useState('');

  useEffect(() => {
    let active = true;
    setEpisodes([]);
    setEpisodeError('');
    if (item?._id || item?.slug) {
      api.get(`/series/${encodeURIComponent(item.slug)}`)
        .then(({ data }) => { if (active) setEpisodes(data.data?.episodes || []); })
        .catch(() => { if (active) setEpisodeError('Episodes could not be loaded.'); });
    }
    return () => { active = false; };
  }, [item]);

  if (!item) return null;
  return <div className="modal-backdrop" onClick={onClose}><section className="detail-modal" onClick={e => e.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close"><X/></button><img className="detail-image" src={item.image || item.posterUrl || item.backdropUrl} alt=""/><div className="detail-overlay"/>
    <div className="detail-content"><span className="eyebrow">STREAMVAULT COLLECTION</span><h2>{item.title}</h2><div className="detail-facts"><span><Star size={14} fill="currentColor"/> {item.rating}</span><span><CalendarDays size={14}/> {item.year || item.releaseYear}</span><span><ListVideo size={14}/> {episodes.length || item.episodes || 0} episodes</span></div><p>{item.description}</p>
      {episodes.length > 0 && <div className="modal-episodes"><h3>Episodes</h3>{episodes.map(ep => <div className="modal-episode" key={ep._id}><span>S{ep.seasonNumber} E{ep.episodeNumber} · {ep.title}</span>{ep.videoStatus === 'ready' ? <Link className="btn btn-gold" to={`/watch/${ep._id}`} onClick={onClose}><Play size={14} fill="currentColor"/> Watch</Link> : <small>{ep.videoStatus === 'processing' ? 'Processing' : 'Coming soon'}</small>}</div>)}</div>}
      {episodeError && <p className="modal-note">{episodeError}</p>}
      {!episodes.length && <p className="modal-note">Episodes will appear here when published by the administrator.</p>}
    </div>
  </section></div>;
}
