import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { updateProfile } from '../../services/api';

const STEPS = ['Welcome', 'About You', 'Your Goals', 'Subjects'];
const SUBJECTS = ['DSA', 'Math', 'Machine Learning', 'Programming', 'Physics', 'Chemistry', 'History', 'Language', 'Data Science', 'Web Dev'];

export default function OnboardingWizard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [goalsText, setGoalsText] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleSubject = (s: string) =>
    setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const finish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: name,
        age: age ? parseInt(age) : null,
        goals_text: goalsText,
        subjects: JSON.stringify(selectedSubjects),
        onboarded: true,
      });
      updateUser({ onboarded: true });
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="glass-card onboarding-card fade-in">
        {/* Step indicator */}
        <div className="step-indicator">
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : 'todo'}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="fade-in">
            <div style={{ fontSize: 56, marginBottom: 12 }}>👋</div>
            <h2 className="onboarding-title">Welcome, {user?.name?.split(' ')[0] || 'Student'}!</h2>
            <p className="onboarding-sub">
              Let's set up your personal study environment. This takes just 60 seconds and helps us personalize your AI advisor, music, and daily plans.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={() => setStep(1)}>
              Let's Go! →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧑‍🎓</div>
            <h2 className="onboarding-title">About You</h2>
            <p className="onboarding-sub">Tell us a little about yourself</p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Your Name</label>
              <input className="input" type="text" placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Your Age</label>
              <input className="input" type="number" placeholder="e.g. 20" min="10" max="60" value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(2)}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
            <h2 className="onboarding-title">Your Goals</h2>
            <p className="onboarding-sub">What do you want to achieve? Your AI advisor will use this.</p>
            <textarea
              className="input"
              placeholder="e.g. Crack GATE 2027, improve my DSA skills, learn machine learning from scratch..."
              value={goalsText}
              onChange={e => setGoalsText(e.target.value)}
              rows={4}
              style={{ resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(3)}>Next →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <h2 className="onboarding-title">Favourite Subjects</h2>
            <p className="onboarding-sub">Pick all that apply — we'll tailor resources and music for you.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  className={`btn ${selectedSubjects.includes(s) ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => toggleSubject(s)}
                >
                  {selectedSubjects.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={finish} disabled={saving}>
                {saving ? '⏳ Saving...' : '🚀 Start Learning!'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
