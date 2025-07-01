import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export const NavItem = memo(function NavItem({ name, path, isActive, onClick }) {
  const handleClick = useCallback(
    event => {
      event.preventDefault();
      onClick(path);
    },
    [onClick, path]
  );

  return (
    <li role="none">
      <a
        href={path}
        role="menuitem"
        aria-current={isActive ? 'page' : undefined}
        className={clsx('nav-item', { active: isActive })}
        onClick={handleClick}
      >
        {name}
      </a>
    </li>
  );
});

NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

NavItem.defaultProps = {
  isActive: false,
};

export default function Navbar({ items, onNavigate, className }) {
  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className={clsx('navbar', className)}
    >
      <ul role="menubar" className="navbar-list">
        {items.map(({ name, path, isActive }) => (
          <NavItem
            key={path}
            name={name}
            path={path}
            isActive={isActive}
            onClick={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
}

Navbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
    })
  ).isRequired,
  onNavigate: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Navbar.defaultProps = {
  className: '',
};