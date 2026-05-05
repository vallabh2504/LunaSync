export const LunaCard = ({ children, className = '', tone = 'glass', as = 'div', ...props }) => {
  const Tag = as
  return (
    <Tag className={`luna-surface luna-surface-${tone} ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export const LunaButton = ({ children, className = '', variant = 'primary', ...props }) => (
  <button className={`luna-action luna-action-${variant} ${className}`} {...props}>
    {children}
  </button>
)

export const LunaPill = ({ children, className = '', tone = 'rose' }) => (
  <span className={`luna-chip luna-chip-${tone} ${className}`}>{children}</span>
)

export const LunaTabs = ({ tabs, activeTab, onChange }) => (
  <div className="luna-tabs" role="tablist">
    {tabs.map(tab => (
      <button
        key={tab.id}
        className={`luna-tabs-item ${activeTab === tab.id ? 'active' : ''}`}
        onClick={() => onChange(tab.id)}
        role="tab"
        aria-selected={activeTab === tab.id}
      >
        {tab.label}
      </button>
    ))}
  </div>
)

export const LunaSectionHeader = ({ eyebrow, title, subtitle, action }) => (
  <div className="flex items-end justify-between gap-4">
    <div>
      {eyebrow && <p className="luna-eyebrow">{eyebrow}</p>}
      {title && <h2 className="font-display text-2xl font-semibold text-luna-text">{title}</h2>}
      {subtitle && <p className="mt-1 text-sm leading-relaxed text-luna-muted">{subtitle}</p>}
    </div>
    {action}
  </div>
)
