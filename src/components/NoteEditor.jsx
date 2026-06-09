import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './NoteEditor.module.css'

export default function NoteEditor({ tab, onUpdate, onDelete, user, onLogout }) {
  const printRef = useRef()

  const handlePrint = () => {
    window.print()
  }

  const handleDeleteConfirm = () => {
    if (window.confirm(`Supprimer l'onglet "${tab.title || 'Sans titre'}" ?`)) {
      onDelete(tab.id)
    }
  }

  const createdDate = new Date(parseInt(tab.id)).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className={styles.wrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={styles.titleInput}
          value={tab.title}
          maxLength={50}
          placeholder="Titre de l'onglet…"
          onChange={(e) => onUpdate(tab.id, { title: e.target.value })}
        />

        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${tab.mode === 'text' ? styles.modeActive : ''}`}
            onClick={() => onUpdate(tab.id, { mode: 'text' })}
          >
            Texte
          </button>
          <button
            className={`${styles.modeBtn} ${tab.mode === 'markdown' ? styles.modeActive : ''}`}
            onClick={() => onUpdate(tab.id, { mode: 'markdown' })}
          >
            Markdown
          </button>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={handlePrint} title="Imprimer / Exporter PDF">
            <PrintIcon /> Imprimer PDF
          </button>
          <button className={`${styles.actionBtn} ${styles.danger}`} onClick={handleDeleteConfirm}>
            <TrashIcon /> Supprimer
          </button>
        </div>

<button className={styles.userBtn} onClick={onLogout} title="Se déconnecter">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
  Se déconnecter
</button>
      </div>

      {/* Zone d'édition */}
      <div className={styles.editorArea} ref={printRef}>
        {tab.mode === 'text' ? (
          <textarea
            className={styles.plainTextarea}
            value={tab.content}
            placeholder="Commencez à écrire…"
            onChange={(e) => onUpdate(tab.id, { content: e.target.value })}
          />
        ) : (
          <div className={styles.splitView}>
            <div className={styles.editorPane}>
              <div className={styles.paneLabel}>Édition</div>
              <textarea
                className={styles.mdTextarea}
                value={tab.content}
                placeholder="# Titre&#10;&#10;Écrivez en Markdown…"
                onChange={(e) => onUpdate(tab.id, { content: e.target.value })}
              />
            </div>
            <div className={styles.previewPane}>
              <div className={styles.paneLabel}>Prévisualisation</div>
              <div className={styles.mdPreview}>
                {tab.content
                  ? <ReactMarkdown>{tab.content}</ReactMarkdown>
                  : <span className={styles.emptyHint}>La prévisualisation apparaît ici…</span>
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>Créé le {createdDate}</span>
        <span>{tab.content.length} caractère{tab.content.length !== 1 ? 's' : ''}</span>
        <span>Mode : {tab.mode === 'markdown' ? 'Markdown' : 'Texte'} • Sauvegarde auto</span>
      </div>

      {/* Zone impression cachée hors écran */}
      <div className={styles.printArea}>
        <h1 className={styles.printTitle}>{tab.title || 'Sans titre'}</h1>
        <div className={styles.printMeta}>Créé le {createdDate}</div>
        {tab.mode === 'markdown'
          ? <ReactMarkdown>{tab.content}</ReactMarkdown>
          : <pre className={styles.printText}>{tab.content}</pre>
        }
      </div>
    </div>
  )
}

function PrintIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  )
}
