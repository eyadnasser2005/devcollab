import { useCallback } from 'react';
import { getDashboard, getProject, startProject } from '../api/projectApi';

export default function useProject(token) {
  const fetchDashboard = useCallback(() => getDashboard(token), [token]);
  const fetchProject = useCallback(
    (projectInstanceId) => getProject(token, projectInstanceId),
    [token]
  );
  const createProject = useCallback(
    (payload = {}) => startProject(token, payload),
    [token]
  );

  return {
    fetchDashboard,
    fetchProject,
    createProject,
  };
}
