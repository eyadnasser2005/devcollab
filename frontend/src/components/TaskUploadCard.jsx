import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaskUploadCard({ task }) {
  const navigate = useNavigate();

  const taskId = task?.taskId ?? task?.task_id ?? task?.id;
  const description = task?.description ?? 'No description provided.';
  const status = task?.status ?? 'PENDING';
  const requiredPath = task?.required_path ?? task?.requiredPath ?? '-';

  const handleUploadClick = () => {
    if (!taskId) return;
    navigate(`/tasks/${taskId}/upload`);
  };

  return (
    <article
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#ffffff',
        display: 'grid',
        gap: '8px',
      }}
    >
      <div>
        <strong>Description:</strong> {description}
      </div>
      <div>
        <strong>Status:</strong> {status}
      </div>
      <div>
        <strong>Required Path:</strong> {requiredPath}
      </div>
      <button type="button" onClick={handleUploadClick} disabled={!taskId}>
        Upload
      </button>
    </article>
  );
}
