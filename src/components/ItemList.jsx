import React from 'react';

export default function ItemList({
  items,
  primaryField,
  metaFields = [],
  toggleField,
  onToggle,
  onEdit,
  onDelete,
  badgeField,
  ratingField,
  linkField,
  emptyIcon = '📭',
  emptyText = 'No items yet. Add your first one above!',
}) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <div className="emoji">{emptyIcon}</div>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="list">
      {items.map((item) => (
        <div className={`list-item ${toggleField && item[toggleField] ? 'completed' : ''}`} key={item._id}>
          <div className="item-main">
            {toggleField && (
              <input
                type="checkbox"
                checked={!!item[toggleField]}
                onChange={() => onToggle(item)}
                style={{ width: 18, height: 18, accentColor: 'var(--accent)', flexShrink: 0 }}
              />
            )}
            <div style={{ minWidth: 0 }}>
              <div className="item-title">{item[primaryField]}</div>
              {(metaFields.length > 0 || ratingField || badgeField) && (
                <div className="item-meta">
                  {badgeField && item[badgeField] ? <span className="badge">{item[badgeField]}</span> : null}{' '}
                  {ratingField && item[ratingField] > 0 ? (
                    <span className="rating-stars">
                      {'★'.repeat(item[ratingField])}
                      {'☆'.repeat(5 - item[ratingField])}
                    </span>
                  ) : null}{' '}
                  {metaFields.map(
                    (f) =>
                      item[f.name] !== undefined &&
                      item[f.name] !== '' && (
                        <span key={f.name} style={{ marginRight: 10 }}>
                          {f.label}: {String(item[f.name])}
                        </span>
                      )
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="item-actions">
            {linkField && item[linkField] && (
              <a className="btn btn-secondary btn-icon" href={item[linkField]} target="_blank" rel="noreferrer" title="Open link">
                🔗
              </a>
            )}
            {onEdit && (
              <button className="btn btn-secondary btn-icon" onClick={() => onEdit(item)} title="Edit">
                ✏️
              </button>
            )}
            <button className="btn btn-danger btn-icon" onClick={() => onDelete(item._id)} title="Delete">
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
