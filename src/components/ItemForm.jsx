import React, { useState, useEffect } from 'react';

export default function ItemForm({ fields, initialData, onSubmit, submitLabel = 'Add' }) {
  const buildState = () => {
    const state = {};
    fields.forEach((f) => {
      if (f.input === 'checkbox') state[f.name] = initialData ? !!initialData[f.name] : false;
      else state[f.name] = initialData && initialData[f.name] !== undefined ? initialData[f.name] : '';
    });
    return state;
  };

  const [form, setForm] = useState(buildState());

  useEffect(() => {
    setForm(buildState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    fields.forEach((f) => {
      if (f.input === 'number' && payload[f.name] !== '') payload[f.name] = Number(payload[f.name]);
    });
    onSubmit(payload);
    if (!initialData) setForm(buildState());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        {fields
          .filter((f) => f.showInForm !== false)
          .map((f) => (
            <div
              className="field"
              key={f.name}
              style={f.input === 'textarea' ? { gridColumn: '1 / -1' } : undefined}
            >
              <label>{f.label}</label>
              {f.input === 'select' ? (
                <select name={f.name} value={form[f.name]} onChange={handleChange} required={f.required}>
                  <option value="">Select {f.label}...</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : f.input === 'textarea' ? (
                <textarea
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder || ''}
                  required={f.required}
                />
              ) : f.input === 'checkbox' ? (
                <div className="checkbox-row">
                  <input type="checkbox" name={f.name} checked={form[f.name]} onChange={handleChange} />
                  <span>{f.placeholder || 'Yes'}</span>
                </div>
              ) : (
                <input
                  type={f.input}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder || ''}
                  required={f.required}
                  step={f.input === 'number' ? 'any' : undefined}
                />
              )}
            </div>
          ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
