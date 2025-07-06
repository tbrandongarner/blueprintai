import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authcontext.jsx';
import './dashboard.css';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Mock projects data with enhanced details
    const mockProjects = [
      {
        id: '1',
        name: 'AI-Powered Architecture',
        description: 'Revolutionary building design using machine learning algorithms for optimal space utilization and energy efficiency.',
        status: 'active',
        lastModified: '2 hours ago',
        icon: '🏗️'
      },
      {
        id: '2',
        name: 'Smart Product Design',
        description: 'Innovative IoT product prototype with integrated sensors and real-time data analytics capabilities.',
        status: 'draft',
        lastModified: '1 day ago',
        icon: '📱'
      },
      {
        id: '3',
        name: 'Sustainable Blueprint',
        description: 'Eco-friendly construction blueprint focusing on renewable materials and carbon-neutral design.',
        status: 'completed',
        lastModified: '3 days ago',
        icon: '🌱'
      },
      {
        id: '4',
        name: 'Urban Planning AI',
        description: 'Large-scale city planning project utilizing AI for traffic optimization and resource management.',
        status: 'active',
        lastModified: '5 hours ago',
        icon: '🏙️'
      },
      {
        id: '5',
        name: 'Robotics Framework',
        description: 'Advanced robotics control system with machine learning integration for autonomous operations.',
        status: 'draft',
        lastModified: '2 days ago',
        icon: '🤖'
      },
      {
        id: '6',
        name: 'Medical Device Innovation',
        description: 'Next-generation medical diagnostic tool with AI-powered analysis and patient monitoring.',
        status: 'active',
        lastModified: '6 hours ago',
        icon: '🏥'
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 800);
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'draft': return 'status-draft';
      case 'completed': return 'status-completed';
      default: return 'status-draft';
    }
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const draftProjects = projects.filter(p => p.status === 'draft').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.name || 'User'}! 👋</h1>
        <h2>Your AI-Powered Design Studio</h2>
      </header>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-number">{projects.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-number">{activeProjects}</div>
          <div className="stat-label">Active Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{completedProjects}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-number">{draftProjects}</div>
          <div className="stat-label">Drafts</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <button className="action-button" onClick={handleCreateNewProject}>
          <span>✨</span>
          Create New Project
        </button>
        <button className="action-button secondary">
          <span>🤖</span>
          AI Assistant
        </button>
        <button className="action-button secondary">
          <span>📚</span>
          Templates
        </button>
      </div>

      {/* Projects Section */}
      <main className="project-list-container">
        <div className="projects-header">
          <h3 className="projects-title">Recent Projects</h3>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span>Loading your amazing projects...</span>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🎨</div>
            <h3>No projects yet</h3>
            <p>Start your creative journey by creating your first AI-powered project!</p>
            <button className="action-button" onClick={handleCreateNewProject}>
              <span>✨</span>
              Create Your First Project
            </button>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="project-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => handleProjectSelect(project.id)}
              >
                <div className="project-header">
                  <div className="project-icon">{project.icon}</div>
                  <button className="project-menu">⋯</button>
                </div>
                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <div className="project-date">
                    <span>🕒</span>
                    {project.lastModified}
                  </div>
                  <span className={`project-status ${getStatusClass(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;