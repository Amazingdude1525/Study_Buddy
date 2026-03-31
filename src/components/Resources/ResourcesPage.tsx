import React, { useState, useEffect } from 'react';
import { getSubjectGuide } from '../../services/api';
import { ExternalLink } from 'lucide-react';

const SUBJECTS = ['DSA', 'Math', 'Machine Learning', 'Programming'];

interface Resource { name: string; url: string; type: string; description: string; icon: string; free: boolean; }
interface Guide {
  subject: string; seriousness: string; seriousness_color: string; description: string;
  youtube_channels: Resource[]; websites: Resource[]; ai_tools: Resource[]; practice_platforms: Resource[];
  study_tip: string;
}

function ResourceCard({ r }: { r: Resource }) {
  return (
    <a href={r.url} target="_blank" rel="noreferrer" className="resource-card">
      <span className="resource-card-icon">{r.icon}</span>
      <div>
        <div className="resource-card-name">{r.name} {!r.free && <span className="badge badge-warning" style={{ fontSize: 9 }}>Paid</span>}</div>
        <div className="resource-card-desc">{r.description}</div>
      </div>
    </a>
  );
}

export default function ResourcesPage() {
  const [selected, setSelected] = useState('DSA');
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubjectGuide(selected)
      .then(r => setGuide(r.data))
      .catch(() => setGuide(null))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="page-body page-with-music">
      <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 className="topbar-title">📚 Study Resources</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {SUBJECTS.map(s => (
            <button key={s} className={`btn btn-sm ${selected === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelected(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={{ color: 'var(--text-muted)', padding: 20 }}>Loading guide...</div>}

      {guide && !loading && (
        <div className="fade-in">
          {/* Header */}
          <div className="glass-card widget" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800 }}>{guide.subject}</h2>
                  <span className="badge" style={{ background: guide.seriousness_color + '22', color: guide.seriousness_color }}>
                    {guide.seriousness}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 12 }}>{guide.description}</p>
                <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>💡 Study Tip: </span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{guide.study_tip}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resource sections */}
          {[
            { key: 'youtube_channels', label: '📺 YouTube Channels', items: guide.youtube_channels },
            { key: 'websites', label: '🌐 Websites & Docs', items: guide.websites },
            { key: 'ai_tools', label: '🤖 AI Tools', items: guide.ai_tools },
            { key: 'practice_platforms', label: '💻 Practice Platforms', items: guide.practice_platforms },
          ].map(section => (
            <div key={section.key} className="resource-section">
              <h4>{section.label}</h4>
              <div className="resource-grid">
                {section.items.map((r, i) => <ResourceCard key={i} r={r} />)}
              </div>
            </div>
          ))}

          {/* NotebookLM special card */}
          <div className="glass-card widget" style={{ marginTop: 8 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🚀 Pro Tip: Use AI Effectively</h4>
            <div className="resource-grid">
              <a href="https://notebooklm.google.com" target="_blank" rel="noreferrer" className="resource-card">
                <span className="resource-card-icon">📓</span>
                <div>
                  <div className="resource-card-name">NotebookLM</div>
                  <div className="resource-card-desc">Upload PDFs → chat with them. Great for textbooks & research papers.</div>
                </div>
              </a>
              <a href="https://gemini.google.com" target="_blank" rel="noreferrer" className="resource-card">
                <span className="resource-card-icon">✨</span>
                <div>
                  <div className="resource-card-name">Gemini</div>
                  <div className="resource-card-desc">Ask for explanations, roadmaps, and coding help.</div>
                </div>
              </a>
              <a href="https://www.programiz.com/python-programming/online-compiler" target="_blank" rel="noreferrer" className="resource-card">
                <span className="resource-card-icon">🎯</span>
                <div>
                  <div className="resource-card-name">Programmiz Online</div>
                  <div className="resource-card-desc">Try code in the browser instantly. No setup needed.</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
