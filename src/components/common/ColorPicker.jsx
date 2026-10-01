import React from 'react';

export default function ColorPicker({
  label,
  value,
  onChange,
  presets = [],
  description,
  id
}) {
  const inputId = id || `color-picker-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        {description && (
          <span className="text-[11px] text-slate-400">{description}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Custom trigger showing current color swatch */}
        <div className="relative flex items-center flex-1 bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs hover:border-slate-300 transition-colors">
          <input
            id={inputId}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
          />
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={(e) => {
              const val = e.target.value;
              if (val.startsWith('#') || val === '') {
                onChange(val);
              } else {
                onChange(`#${val}`);
              }
            }}
            maxLength={7}
            className="ml-2 font-mono text-xs text-slate-700 bg-transparent focus:outline-none uppercase w-20"
          />
        </div>

        {/* Quick color preset swatches */}
        {presets && presets.length > 0 && (
          <div className="flex items-center gap-1">
            {presets.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange(color)}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 ${
                  value.toLowerCase() === color.toLowerCase()
                    ? 'ring-2 ring-indigo-500 ring-offset-1 border-white'
                    : 'border-slate-300'
                }`}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
