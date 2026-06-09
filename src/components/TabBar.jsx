import styles from './TabBar.module.css'

export default function TabBar({ tabs, activeId, onSelect, onAdd, onClose }) {
  return (
    <div className={styles.bar}>
      <div className={styles.logo}>
        <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="10" fill="#4F46E5" />
          <path d="M10 26V12h4l4 8 4-8h4v14h-3V17l-4 7h-2l-4-7v9h-3z" fill="white" />
        </svg>
        <span className={styles.appName}>NoteTabs</span>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${tab.id === activeId ? styles.active : ''}`}
            onClick={() => onSelect(tab.id)}
          >
            <span className={styles.tabTitle}>{tab.title || 'Sans titre'}</span>
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

      <button className={styles.addBtn} onClick={onAdd} title="Nouvel onglet">
        <span>+</span> Nouvel onglet
      </button>
    </div>
  )
}
