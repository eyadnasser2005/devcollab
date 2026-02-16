import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../api/profileApi';
import { useAuth } from '../context/AuthContext';

const LEVEL_OPTIONS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { token, setUser } = useAuth();

  const [availabilityHours, setAvailabilityHours] = useState('');
  const [skills, setSkills] = useState([{ tech_name: '', level: 'BEGINNER' }]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => !!token && !submitting, [token, submitting]);

  const handleSkillChange = (index, field, value) => {
    setSkills((prev) =>
      prev.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill))
    );
  };

  const addSkillRow = () => {
    setSkills((prev) => [...prev, { tech_name: '', level: 'BEGINNER' }]);
  };

  const removeSkillRow = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('Please log in first.');
      return;
    }

    const payload = {
      availability_hours_per_week: Number(availabilityHours) || 0,
      skills: skills
        .filter((skill) => skill.tech_name.trim())
        .map((skill) => ({
          tech_name: skill.tech_name.trim(),
          level: LEVEL_OPTIONS.includes(skill.level) ? skill.level : 'BEGINNER',
        })),
    };

    setSubmitting(true);
    try {
      const updated = await updateProfile(token, payload);
      setUser(updated?.user || updated || null);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not save profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1>Profile Setup</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <label>
          Availability (hours per week)
          <input
            type="number"
            min="0"
            value={availabilityHours}
            onChange={(e) => setAvailabilityHours(e.target.value)}
            required
          />
        </label>

        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1rem' }}>Skills</h2>
            <button type="button" onClick={addSkillRow}>
              Add Skill
            </button>
          </div>

          {skills.map((skill, index) => (
            <div
              key={`${index}-${skill.tech_name}`}
              style={{ display: 'grid', gridTemplateColumns: '1fr 180px auto', gap: '8px' }}
            >
              <input
                type="text"
                placeholder="tech_name"
                value={skill.tech_name}
                onChange={(e) => handleSkillChange(index, 'tech_name', e.target.value)}
              />

              <select
                value={skill.level}
                onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
              >
                {LEVEL_OPTIONS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => removeSkillRow(index)}
                disabled={skills.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}

        <button type="submit" disabled={!canSubmit}>
          {submitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </section>
  );
}
