import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUserProjects() {
      try {
        const response = await fetch('/api/projects', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        if (isMountedRef.current) {
          setProjects(data.projects || []);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMountedRef.current) {
          setError(err.message);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    fetchUserProjects();

    return () => {
      controller.abort();
      isMountedRef.current = false;
    };
  }, []);

  const handleProjectSelect = useCallback(
    (id) => {
      navigate(`/projects/${id}`);
    },
    [navigate]
  );

  const handleCreateNewProject = useCallback(() => {
    navigate('/projects/new');
  }, [navigate]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Your Projects</h1>
        <button
          type="button"
          className="new-project-button"
          onClick={handleCreateNewProject}
        >
          + New Project
        </button>
      </header>
      <main className="project-list-container">
        {loading && <p>Loading projects...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && projects.length === 0 && (
          <p>No projects found. Create a new project to get started.</p>
        )}
        {!loading && !error && projects.length > 0 && (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project.id} className="project-item">
                <button
                  type="button"
                  className="project-button"
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <h2>{project.name}</h2>
                  {project.description && <p>{project.description}</p>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default Dashboard;