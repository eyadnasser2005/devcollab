import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadTaskFile } from '../api/taskApi';
import { useAuth } from '../context/AuthContext';

export default function TaskUploadPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { token } = useAuth();

  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('Please log in first.');
      return;
    }

    if (!taskId) {
      setError('Task ID is missing.');
      return;
    }

    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }

    setSubmitting(true);
    try {
      await uploadTaskFile(token, taskId, file, notes);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ maxWidth: '640px', margin: '0 auto' }}>
      <h1>Upload Task Submission</h1>
      <p style={{ marginTop: 0 }}>Task ID: {taskId}</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
        <label>
          File
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </label>

        <label>
          Notes (optional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add optional notes for this submission"
          />
        </label>

        {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
    </section>
  );
}
