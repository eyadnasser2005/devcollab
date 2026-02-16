import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../api/projectApi';
import TaskUploadCard from '../components/TaskUploadCard';
import { useAuth } from '../context/AuthContext';

function getStatusFromError(error) {
  const text = String(error?.message || '');
  const match = text.match(/API_ERROR_(\d+)/);
  return match ? Number(match[1]) : null;
}

export default function ProjectDetailPage() {
  const { projectInstanceId } = useParams();
  const { token } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsUnavailable, setDetailsUnavailable] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProject() {
      if (!token || !projectInstanceId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setDetailsUnavailable(false);

      try {
        const data = await getProject(token, projectInstanceId);
        if (!isMounted) return;
        setProject(data);
      } catch (err) {
        if (!isMounted) return;

        const status = getStatusFromError(err);
        const msg = String(err?.message || '').toLowerCase();
        if (status === 404 || msg.includes('not found')) {
          setDetailsUnavailable(true);
          setProject(null);
        } else {
          setError(err.message || 'Failed to load project details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [token, projectInstanceId]);

  const team = useMemo(
    () => project?.team || project?.members || project?.project_members || [],
    [project]
  );
  const tasks = useMemo(
    () => project?.tasks || project?.role_tasks || project?.assigned_tasks || [],
    [project]
  );

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (detailsUnavailable) {
    return <p>Project details not available yet; use dashboard tasks.</p>;
  }

  if (error) {
    return <p style={{ color: '#b91c1c' }}>{error}</p>;
  }

  return (
    <section style={{ display: 'grid', gap: '16px' }}>
      <h1 style={{ margin: 0 }}>Project Details</h1>

      <div>
        <h2>Team</h2>
        {Array.isArray(team) && team.length > 0 ? (
          <ul>
            {team.map((member, idx) => {
              const key = member?.id ?? member?.userId ?? `member-${idx}`;
              const name = member?.name || member?.email || `Member ${idx + 1}`;
              const role = member?.role || member?.assigned_role || 'UNASSIGNED';
              return (
                <li key={key}>
                  {name} - {role}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No team details available.</p>
        )}
      </div>

      <div>
        <h2>Tasks</h2>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {tasks.map((task, idx) => {
              const key = task?.taskId ?? task?.task_id ?? task?.id ?? `task-${idx}`;
              return <TaskUploadCard key={key} task={task} />;
            })}
          </div>
        ) : (
          <p>No task details available.</p>
        )}
      </div>
    </section>
  );
}
