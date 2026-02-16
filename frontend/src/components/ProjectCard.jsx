import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const projectId =
    project?.projectInstanceId ??
    project?.project_instance_id ??
    project?.id;

  const title =
    project?.title ??
    project?.projectTitle ??
    project?.name ??
    'Untitled Project';

  const status = project?.status ?? 'UNKNOWN';
  const progressPercent =
    project?.progressPercent ??
    project?.progress_percent ??
    project?.progress ??
    0;

  const openDetails = () => {
    if (!projectId) return;
    navigate(`/projects/${projectId}`);
  };

  return (
    <article
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#ffffff',
        display: 'grid',
        gap: '10px',
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <div>Status: {status}</div>
      <div>
        <div style={{ marginBottom: '6px' }}>Progress: {Number(progressPercent) || 0}%</div>
        <ProgressBar percent={progressPercent} />
      </div>
      <button type="button" onClick={openDetails} disabled={!projectId}>
        Open Details
      </button>
    </article>
  );
}
