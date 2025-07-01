import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

function shallowOptionsEqual(prevOptions, nextOptions) {
  if (prevOptions === nextOptions) return true;
  if (!prevOptions || !nextOptions || prevOptions.length !== nextOptions.length) return false;
  for (let i = 0; i < prevOptions.length; i++) {
    if (prevOptions[i].value !== nextOptions[i].value || prevOptions[i].label !== nextOptions[i].label) {
      return false;
    }
  }
  return true;
}

const ControlItem = React.memo(
  function ControlItem({
    name,
    label,
    type,
    value,
    min,
    max,
    step,
    options,
    placeholder,
    onChange,
  }) {
    const safeValue = value != null ? value : type === 'boolean' ? false : '';
    const safeChecked = type === 'boolean' ? Boolean(value) : undefined;

    const handleChange = (e) => {
      let newValue;
      if (type === 'number' || type === 'range') {
        const num = e.target.valueAsNumber;
        newValue = Number.isNaN(num) ? '' : num;
      } else if (type === 'boolean') {
        newValue = e.target.checked;
      } else {
        newValue = e.target.value;
      }
      onChange(name, newValue);
    };

    let inputElement;
    switch (type) {
      case 'number':
        inputElement = (
          <input
            id={name}
            type="number"
            value={safeValue}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            className="control-input"
          />
        );
        break;
      case 'range':
        inputElement = (
          <input
            id={name}
            type="range"
            value={safeValue}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            className="control-input"
          />
        );
        break;
      case 'select':
        inputElement = (
          <select
            id={name}
            value={safeValue}
            onChange={handleChange}
            className="control-input"
          >
            {(options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
        break;
      case 'boolean':
        inputElement = (
          <input
            id={name}
            type="checkbox"
            checked={safeChecked}
            onChange={handleChange}
            className="control-input"
          />
        );
        break;
      default:
        inputElement = (
          <input
            id={name}
            type="text"
            value={safeValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="control-input"
          />
        );
    }

    return (
      <div className="control-item">
        <label htmlFor={name} className="control-label">
          {label}
        </label>
        {inputElement}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.name === nextProps.name &&
    prevProps.label === nextProps.label &&
    prevProps.type === nextProps.type &&
    prevProps.value === nextProps.value &&
    prevProps.min === nextProps.min &&
    prevProps.max === nextProps.max &&
    prevProps.step === nextProps.step &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.onChange === nextProps.onChange &&
    shallowOptionsEqual(prevProps.options, nextProps.options)
);

ControlItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.oneOf(['number', 'range', 'select', 'boolean', 'text']).isRequired,
  value: PropTypes.any,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default function ParameterControls({ parameters, onChange }) {
  const handleParamChange = useCallback(
    (name, newValue) => {
      const updated = parameters.map((param) =>
        param.name === name ? { ...param, value: newValue } : param
      );
      onChange(updated);
    },
    [parameters, onChange]
  );

  return (
    <div className="parameter-controls">
      {parameters.map((param) => (
        <ControlItem
          key={param.name}
          name={param.name}
          label={param.label}
          type={param.type}
          value={param.value}
          min={param.min}
          max={param.max}
          step={param.step}
          options={param.options}
          placeholder={param.placeholder}
          onChange={handleParamChange}
        />
      ))}
    </div>
  );
}

ParameterControls.propTypes = {
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.oneOf(['number', 'range', 'select', 'boolean', 'text']).isRequired,
      value: PropTypes.any,
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      placeholder: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};