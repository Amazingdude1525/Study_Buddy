import React, { useState, useEffect, useRef } from 'react';
import { suggestMusic } from '../../services/api';
import { Play, Pause, SkipForward, Music, ExternalLink } from 'lucide-react';

interface Track { title: string; artist: string; youtube_url: string; genre: string; mood: string; }

interface Props { mood?: string; subject?: string; }

export default function MusicPlayer({ mood = 'focused', subject = '' }: Props) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    suggestMusic(mood, subject)
      .then(r => { setTracks(r.data); setCurrentIndex(0); })
      .catch(() => {
        setTracks([{
          title: 'Lofi Hip Hop Radio', artist: 'ChilledCow',
          youtube_url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
          genre: 'lofi', mood: 'focused',
        }]);
      });
  }, [mood, subject]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { handleSkip(); return 0; }
          return p + 0.1;
        });
      }, 300);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const handleSkip = () => {
    setCurrentIndex(i => (i + 1) % Math.max(tracks.length, 1));
    setProgress(0);
  };

  const current = tracks[currentIndex];
  if (!current) return null;

  return (
    <div className="music-bar">
      <Music size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />

      <div className="music-track-info">
        <div className="music-track-name">{current.title}</div>
        <div className="music-track-artist">{current.artist} · {current.genre}</div>
      </div>

      <div className="music-progress" style={{ maxWidth: 200 }}>
        <div className="music-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="music-controls">
        <button className="btn btn-ghost btn-icon" onClick={() => setPlaying(p => !p)}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button className="btn btn-ghost btn-icon" onClick={handleSkip}>
          <SkipForward size={16} />
        </button>
        <a href={current.youtube_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon" title="Open on YouTube">
          <ExternalLink size={16} />
        </a>
      </div>

      <span className="badge badge-accent" style={{ fontSize: '10px' }}>
        {mood}
      </span>
    </div>
  );
}
