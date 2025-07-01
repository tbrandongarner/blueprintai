import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const BlueprintEditor = ({ projectId, blueprintId }) => {
  const [blueprint, setBlueprint] = useState({ name: '', content: '', parameters: [] });
  const [parameters, setParameters] = useState({});
  const [versions, setVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [loadingStates, setLoadingStates] = useState({ blueprint: false, versions: false, action: false });
  const [error, setError] = useState('');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    loadVersions();
    loadBlueprint();
  }, [projectId, blueprintId]);

  const loadBlueprint = async (versionId) => {
    try {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, blueprint: true }));
        setError('');
      }
      let url = `/api/projects/${projectId}/blueprints/${blueprintId}`;
      if (versionId) url += `/versions/${versionId}`;
      const { data } = await axios.get(url);
      if (!isMounted.current) return;
      setBlueprint(data);
      setSelectedVersionId(versionId || '');
      const paramsMap = {};
      if (data.parameters) {
        data.parameters.forEach(p => {
          paramsMap[p.name] = p.value != null ? p.value : '';
        });
      }
      setParameters(paramsMap);
    } catch (e) {
      if (!isMounted.current) return;
      setError('Failed to load blueprint');
    } finally {
      if (!isMounted.current) return;
      setLoadingStates(prev => ({ ...prev, blueprint: false }));
    }
  };

  const loadVersions = async () => {
    try {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, versions: true }));
        setError('');
      }
      const { data } = await axios.get(`/api/projects/${projectId}/blueprints/${blueprintId}/versions`);
      if (!isMounted.current) return;
      setVersions(data);
    } catch (e) {
      if (!isMounted.current) return;
      setError('Failed to load versions');
    } finally {
      if (!isMounted.current) return;
      setLoadingStates(prev => ({ ...prev, versions: false }));
    }
  };

  const handleParameterChange = (name, value) => {
    setParameters(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    try {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, action: true }));
        setError('');
      }
      const { data } = await axios.post(
        `/api/projects/${projectId}/blueprints/${blueprintId}/generate`,
        { parameters }
      );
      if (!isMounted.current) return;
      setBlueprint(data);
      if (data.parameters) {
        const paramsMap = {};
        data.parameters.forEach(p => {
          paramsMap[p.name] = p.value != null ? p.value : parameters[p.name] || '';
        });
        setParameters(paramsMap);
      }
    } catch (e) {
      if (!isMounted.current) return;
      setError('Generation failed');
    } finally {
      if (!isMounted.current) return;
      setLoadingStates(prev => ({ ...prev, action: false }));
    }
  };

  const handleSave = async () => {
    try {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, action: true }));
        setError('');
      }
      const payload = { parameters, content: blueprint.content };
      const { data } = await axios.put(
        `/api/projects/${projectId}/blueprints/${blueprintId}`,
        payload
      );
      if (!isMounted.current) return;
      setBlueprint(data);
      loadVersions();
    } catch (e) {
      if (!isMounted.current) return;
      setError('Save failed');
    } finally {
      if (!isMounted.current) return;
      setLoadingStates(prev => ({ ...prev, action: false }));
    }
  };

  const handleVersionSelect = (versionId) => {
    loadBlueprint(versionId || '');
  };

  const handleExport = async (format) => {
    let urlObject;
    try {
      if (isMounted.current) {
        setLoadingStates(prev => ({ ...prev, action: true }));
        setError('');
      }
      const response = await axios.get(
        `/api/projects/${projectId}/blueprints/${blueprintId}/export`,
        {
          params: { format, versionId: selectedVersionId || undefined },
          responseType: 'blob'
        }
      );
      if (!isMounted.current) return;
      urlObject = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = urlObject;
      a.download = `${blueprint.name || 'blueprint'}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObject);
    } catch (e) {
      if (!isMounted.current) return;
      setError('Export failed');
    } finally {
      if (!isMounted.current) return;
      setLoadingStates(prev => ({ ...prev, action: false }));
      setExportMenuOpen(false);
    }
  };

  return (
    <div className="blueprint-editor">
      {error && <div className="error">{error}</div>}
      <div className="toolbar">
        <h2 className="title">{blueprint.name || 'Blueprint Editor'}</h2>
        <select
          className="version-select"
          value={selectedVersionId}
          onChange={e => handleVersionSelect(e.target.value)}
          disabled={loadingStates.versions}
        >
          <option value="">Latest</option>
          {versions.map(v => (
            <option key={v.id} value={v.id}>{v.label || v.id}</option>
          ))}
        </select>
        <button
          className="btn"
          onClick={handleGenerate}
          disabled={loadingStates.action}
        >
          Generate
        </button>
        <button
          className="btn"
          onClick={handleSave}
          disabled={loadingStates.action}
        >
          Save
        </button>
        <div className="export-dropdown">
          <button
            className="btn"
            onClick={() => setExportMenuOpen(prev => !prev)}
            disabled={loadingStates.action}
          >
            Export
          </button>
          {exportMenuOpen && (
            <div className="export-menu">
              <button onClick={() => handleExport('json')}>JSON</button>
              <button onClick={() => handleExport('yaml')}>YAML</button>
              <button onClick={() => handleExport('pdf')}>PDF</button>
            </div>
          )}
        </div>
      </div>
      <div className="parameters">
        {blueprint.parameters && blueprint.parameters.map(p => (
          <div key={p.name} className="parameter">
            <label htmlFor={`param-${p.name}`}>{p.label || p.name}</label>
            <input
              id={`param-${p.name}`}
              type={p.type || 'text'}
              value={parameters[p.name] || ''}
              onChange={e => handleParameterChange(p.name, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="content-editor">
        <textarea
          value={blueprint.content}
          onChange={e => setBlueprint(prev => ({ ...prev, content: e.target.value }))}
          rows={20}
        />
      </div>
      {(loadingStates.blueprint || loadingStates.versions) && <div className="loading">Loading...</div>}
    </div>
  );
};

BlueprintEditor.propTypes = {
  projectId: PropTypes.string.isRequired,
  blueprintId: PropTypes.string.isRequired
};

export default BlueprintEditor;