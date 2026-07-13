import React from 'react';

export default function Header({ icon, title, subtitle }) {
  return (
    <div className="app-header">
      <div className="icon-badge">{icon}</div>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
