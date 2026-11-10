import React from 'react';
import { Play, Star } from 'lucide-react';
export default function SeriesCard({ item, onSelect }) {
  return <button className="series-card" onClick={() => onSelect(item)}>
    <div className="poster-wrap"><img src={item.image} alt={`${item.title} artwork`} loading="lazy"/><span className="poster-play"><Play fill="currentColor" size={19}/></span><span className="poster-tag">{item.category}</span></div>
    <div className="card-meta"><div><h3>{item.title}</h3><p>{item.year} <span>·</span> {item.episodes} Episodes</p></div><span className="rating"><Star size={13} fill="currentColor"/> {item.rating}</span></div>
  </button>;
}
