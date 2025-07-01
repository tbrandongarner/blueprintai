import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function SidebarItem({ item, onClick, isSelected }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(item);
      }
    },
    [onClick, item]
  );

  return (
    <li className={`sidebar__item${isSelected ? ' sidebar__item--selected' : ''}`}>
      <div
        role="button"
        tabIndex={0}
        className="sidebar__link"
        aria-current={isSelected ? 'page' : undefined}
        onClick={() => onClick(item)}
        onKeyDown={handleKeyDown}
      >
        {item.icon && <span className="sidebar__icon">{item.icon}</span>}
        <span className="sidebar__label">{item.label}</span>
      </div>
    </li>
  );
}

SidebarItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

SidebarItem.defaultProps = {
  isSelected: false,
};

function Sidebar({ items, onSelect, selectedItemId }) {
  const [selected, setSelected] = useState(selectedItemId || null);

  useEffect(() => {
    if (selectedItemId !== undefined && selectedItemId !== selected) {
      setSelected(selectedItemId);
    }
  }, [selectedItemId, selected]);

  const handleSelect = useCallback(
    (item) => {
      setSelected(item.id);
      onSelect(item);
    },
    [onSelect]
  );

  return (
    <nav className="sidebar" aria-label="Sidebar Navigation">
      <ul className="sidebar__list">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isSelected={item.id === selected}
            onClick={handleSelect}
          />
        ))}
      </ul>
    </nav>
  );
}

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Sidebar.defaultProps = {
  selectedItemId: undefined,
};

export default Sidebar;