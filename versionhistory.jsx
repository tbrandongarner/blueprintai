import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar
} from '@mui/material';

const VersionHistory = ({ versions = [], onSelect, onRollback }) => {
  const [processingId, setProcessingId] = useState(null);
  const [confirmVersionId, setConfirmVersionId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleViewVersion = useCallback(
    versionId => {
      if (onSelect) {
        onSelect(versionId);
      }
    },
    [onSelect]
  );

  const initiateRollback = useCallback(
    versionId => {
      if (!onRollback) return;
      setConfirmVersionId(versionId);
    },
    [onRollback]
  );

  const handleCancelRollback = useCallback(() => {
    setConfirmVersionId(null);
  }, []);

  const handleConfirmRollback = useCallback(async () => {
    const versionId = confirmVersionId;
    if (!versionId || !onRollback) {
      setConfirmVersionId(null);
      return;
    }
    setConfirmVersionId(null);
    setProcessingId(versionId);
    try {
      await onRollback(versionId);
    } catch (error) {
      console.error('Rollback failed', error);
      setSnackbarMessage('Failed to roll back version. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setProcessingId(null);
    }
  }, [confirmVersionId, onRollback]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  }, []);

  return (
    <>
      <section className="version-history" aria-label="Version History">
        <h2 className="version-history__header">Version History</h2>
        {versions.length === 0 ? (
          <p className="version-history__empty">No versions available.</p>
        ) : (
          <ul className="version-history__list">
            {versions.map(version => (
              <li key={version.id} className="version-history__item">
                <div className="version-history__details">
                  <div className="version-history__meta">
                    <span className="version-history__name">
                      {version.name || `Version ${version.id}`}
                    </span>
                    <time
                      className="version-history__date"
                      dateTime={version.createdAt}
                    >
                      {new Date(version.createdAt).toLocaleString()}
                    </time>
                    {version.author && (
                      <span className="version-history__author">
                        by {version.author}
                      </span>
                    )}
                  </div>
                  {version.description && (
                    <p className="version-history__description">{version.description}</p>
                  )}
                </div>
                <div className="version-history__actions">
                  <button
                    type="button"
                    className="version-history__button version-history__button--view"
                    onClick={() => handleViewVersion(version.id)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="version-history__button version-history__button--rollback"
                    onClick={() => initiateRollback(version.id)}
                    disabled={processingId === version.id || !onRollback}
                    aria-busy={processingId === version.id}
                  >
                    {processingId === version.id ? 'Rolling back...' : 'Rollback'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Dialog open={Boolean(confirmVersionId)} onClose={handleCancelRollback}>
        <DialogTitle>Confirm Rollback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to roll back to this version? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRollback} disabled={processingId === confirmVersionId}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRollback}
            color="primary"
            disabled={processingId === confirmVersionId}
          >
            Rollback
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
};

VersionHistory.propTypes = {
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      author: PropTypes.string,
      description: PropTypes.string
    })
  ),
  onSelect: PropTypes.func,
  onRollback: PropTypes.func
};

export default VersionHistory;