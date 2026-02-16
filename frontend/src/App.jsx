import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import * as LoginPageModule from './pages/LoginPage';
import * as RegisterPageModule from './pages/RegisterPage';
import * as ProfileSetupPageModule from './pages/ProfileSetupPage';
import * as DashboardPageModule from './pages/DashboardPage';
import * as ProjectDetailPageModule from './pages/ProjectDetailPage';
import * as TaskUploadPageModule from './pages/TaskUploadPage';

const FallbackPage = ({ title }) => (
  <div>
    <h1>{title}</h1>
    <p>Page is not available yet.</p>
  </div>
);

const LoginPage = LoginPageModule.default || (() => <FallbackPage title="Login" />);
const RegisterPage =
  RegisterPageModule.default || (() => <FallbackPage title="Register" />);
const ProfileSetupPage =
  ProfileSetupPageModule.default || (() => <FallbackPage title="Profile Setup" />);
const DashboardPage =
  DashboardPageModule.default || (() => <FallbackPage title="Dashboard" />);
const ProjectDetailPage =
  ProjectDetailPageModule.default || (() => <FallbackPage title="Project Details" />);
const TaskUploadPage =
  TaskUploadPageModule.default || (() => <FallbackPage title="Task Upload" />);

function App() {
  const token = localStorage.getItem('auth_token');
  const defaultRoute = token ? '/dashboard' : '/login';

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-title">DevCollab</div>
      </aside>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to={defaultRoute} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfileSetupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/projects/:projectInstanceId"
            element={<ProjectDetailPage />}
          />
          <Route path="/tasks/:taskId/upload" element={<TaskUploadPage />} />
          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
