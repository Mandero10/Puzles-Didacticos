import React from 'react';

export default function Toggle({
  checked,
  onChange,
  label,
  description,
  id
}) {
  const toggleId = id || `toggle-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-start justify-between gap-3 py-2 cursor-pointer" onClick={() => onChange(!checked)}>
      <div className="flex flex-col">
        <label htmlFor={toggleId} className="text-sm font-medium text-slate-800 cursor-pointer select-none">
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-500 select-none mt-0.5">{description}</p>
        )}
      </div>

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
