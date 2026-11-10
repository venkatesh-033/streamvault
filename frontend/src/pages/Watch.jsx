import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/seriesApi';

export default function Watch() {
  const { episodeId } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/playback/${episodeId}`)
      .then(({ data }) => { if (active) setVideo(data); })
      .catch((e) => { if (active) setError(e.response?.data?.message || 'Unable to load this episode.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [episodeId]);

  return <main className="page-width watch-page">
    <Link className="watch-back" to="/">← Back to StreamVault</Link>
    {loading ? <p>Preparing your episode...</p> : error ? <div className="empty-state">{error}</div> :
      <><p className="eyebrow">NOW PLAYING</p><h1>{video.title}</h1>
        <div className="watch-frame"><iframe src={video.playbackUrl} title={video.title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
        <p className="watch-note">Playback links are temporary. Refresh the page if your session expires.</p>
      </>}
  </main>;
}
