import styles from './TabBar.module.css'

export default function TabBar({ tabs, activeId, collapsed, onToggle, onSelect, onAdd, onClose }) {
  return (
    <aside className={`${styles.bar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="10" fill="#4F46E5" />
          <path d="M10 26V12h4l4 8 4-8h4v14h-3V17l-4 7h-2l-4-7v9h-3z" fill="white" />
        </svg>
        <span className={styles.appName}>NoteTabs</span>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={(event) => { event.stopPropagation(); onToggle() }}
          aria-label={collapsed ? 'Afficher les notes' : 'Réduire la barre latérale'}
          title={collapsed ? 'Afficher les notes' : 'Réduire la barre latérale'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${tab.id === activeId ? styles.active : ''}`}
            onClick={() => onSelect(tab.id)}
            title={tab.title || 'Sans titre'}
          >
            <span className={styles.tabTitle}>
              {collapsed
                ? Array.from((tab.title || 'Sans titre').trim())[0]?.toUpperCase() || 'S'
                : tab.title || 'Sans titre'}
            </span>
            <span
              className={styles.closeBtn}
              onClick={(e) => { e.stopPropagation(); onClose(tab.id) }}
              title="Supprimer cet onglet"
            >
              ×
            </span>
          </button>
        ))}
      </div>

      <button className={styles.addBtn} onClick={onAdd} title="Nouvelle note">
        <span>+</span><span className={styles.addLabel}>Nouvelle note</span>
      </button>
    </aside>
  )
}
