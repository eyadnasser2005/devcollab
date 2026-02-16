import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { startProject, getDashboard } from '../api/projectApi';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function splitProjects(payload) {
  const active =
    payload?.activeProjects ||
    payload?.active_projects ||
    payload?.active ||
    [];
  const completed =
    payload?.completedProjects ||
    payload?.completed_projects ||
    payload?.completed ||
    [];

  if (Array.isArray(payload)) {
    return {
      activeProjects: payload.filter((p) => p?.status !== 'COMPLETE'),
      completedProjects: payload.filter((p) => p?.status === 'COMPLETE'),
    };
  }

  return {
    activeProjects: normalizeArray(active),
    completedProjects: normalizeArray(completed),
  };
}

function getExportLink(project) {
  return (
    project?.exportUrl ||
    project?.export_url ||
    project?.zipUrl ||
    project?.zip_url ||
    null
  );
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const refreshDashboard = useCallback(async () => {
    if (!token) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getDashboard(token);
      setDashboard(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const { activeProjects, completedProjects } = useMemo(
    () => splitProjects(dashboard),
    [dashboard]
  );

  const handleStartProject = async () => {
    if (!token) return;

    setStarting(true);
    setError('');
    try {
      await startProject(token, {});
      await refreshDashboard();
    } catch (err) {
      setError(err.message || 'Failed to start project.');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <section style={{ display: 'grid', gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <button type="button" onClick={handleStartProject} disabled={!token || starting}>
          {starting ? 'Starting...' : 'Start Project'}
        </button>
      </div>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}

      <div style={{ display: 'grid', gap: '10px' }}>
        <h2 style={{ marginBottom: 0 }}>Active Projects</h2>
        {activeProjects.length === 0 ? (
          <p style={{ marginTop: 0 }}>No active projects.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {activeProjects.map((project, idx) => {
              const key =
                project?.projectInstanceId ??
                project?.project_instance_id ??
                project?.id ??
                `active-${idx}`;
              return <ProjectCard key={key} project={project} />;
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <h2 style={{ marginBottom: 0 }}>Completed Projects</h2>
        {completedProjects.length === 0 ? (
          <p style={{ marginTop: 0 }}>No completed projects yet.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'grid', gap: '8px' }}>
            {completedProjects.map((project, idx) => {
              const key =
                project?.projectInstanceId ??
                project?.project_instance_id ??
                project?.id ??
                `completed-${idx}`;
              const title =
                project?.title ||
                project?.projectTitle ||
                project?.name ||
                'Completed Project';
              const exportLink = getExportLink(project);

              return (
                <li key={key}>
                  <span>{title}</span>
                  {exportLink ? (
                    <a
                      href={exportLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginLeft: '8px' }}
                    >
                      Export
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
