import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './NoteEditor.module.css'

export default function NoteEditor({ tab, onUpdate, onDelete, user, onLogout }) {
  const printRef = useRef()
  const editorRef = useRef(null)

  const handlePrint = () => {
    window.print()
  }

  const handleDeleteConfirm = () => {
    if (window.confirm(`Supprimer l'onglet "${tab.title || 'Sans titre'}" ?`)) {
      onDelete(tab.id)
    }
  }

  const applyMarkdown = (prefix, suffix = '', placeholder = 'texte') => {
    const textarea = editorRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.slice(start, end) || placeholder
    const nextValue = `${textarea.value.slice(0, start)}${prefix}${selected}${suffix}${textarea.value.slice(end)}`

    onUpdate(tab.id, { content: nextValue })

    requestAnimationFrame(() => {
      textarea.focus()
      const cursorStart = start + prefix.length
      const cursorEnd = cursorStart + selected.length
      textarea.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  const insertImageFromUrl = () => {
    const url = window.prompt('URL de l’image :', 'https://')
    if (!url) return
    applyMarkdown('![image](', ')', url)
  }

  const insertTable = () => {
    const textarea = editorRef.current
    if (!textarea) return

    const table = '| Tâche | Statut |\n| --- | --- |\n| Exemple | ✅ |'
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const nextValue = `${textarea.value.slice(0, start)}${table}${textarea.value.slice(end)}`

    onUpdate(tab.id, { content: nextValue })

    requestAnimationFrame(() => {
      textarea.focus()
      const cursorPosition = start + table.length
      textarea.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  const insertChecklist = () => {
    applyMarkdown('- [ ] ', '', 'à faire')
  }

  const insertTodo = () => {
    const textarea = editorRef.current
    if (!textarea) return

    const todo = '- [ ] À faire\n- [x] Fait'
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const nextValue = `${textarea.value.slice(0, start)}${todo}${textarea.value.slice(end)}`

    onUpdate(tab.id, { content: nextValue })

    requestAnimationFrame(() => {
      textarea.focus()
      const cursorPosition = start + todo.length
      textarea.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  const insertCodeBlock = () => {
    applyMarkdown('```\n', '\n```', 'code')
  }

  const insertSeparator = () => {
    const textarea = editorRef.current
    if (!textarea) return

    const separator = '\n---\n'
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const nextValue = `${textarea.value.slice(0, start)}${separator}${textarea.value.slice(end)}`

    onUpdate(tab.id, { content: nextValue })

    requestAnimationFrame(() => {
      textarea.focus()
      const cursorPosition = start + separator.length
      textarea.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  const insertHeading = (level) => {
    const prefix = `${'#'.repeat(level)} `
    applyMarkdown(prefix, '', `Titre ${level}`)
  }

  const createdAt = tab.createdAt ?? Number(tab.id) ?? Date.now()
  const updatedAt = tab.updatedAt ?? createdAt

  const formatDate = (value) => new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const createdDate = formatDate(createdAt)
  const updatedDate = formatDate(updatedAt)

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

      <div className={styles.metaRow}>
        <span>Créé le {createdDate}</span>
        <span>Dernière modif. {updatedDate}</span>
      </div>

      <div className={styles.formatToolbar}>
        <button className={styles.toolBtn} onClick={() => applyMarkdown('**', '**', 'gras')} title="Gras"><strong>B</strong></button>
        <button className={styles.toolBtn} onClick={() => applyMarkdown('*', '*', 'italique')} title="Italique"><em>I</em></button>
        <button className={styles.toolBtn} onClick={() => applyMarkdown('### ', '', 'Titre')} title="Titre H1">H1</button>
        <button className={styles.toolBtn} onClick={() => insertHeading(2)} title="Titre H2">H2</button>
        <button className={styles.toolBtn} onClick={() => insertHeading(3)} title="Titre H3">H3</button>
        <button className={styles.toolBtn} onClick={() => applyMarkdown('- ', '', 'liste')} title="Liste">• List</button>
        <button className={styles.toolBtn} onClick={insertChecklist} title="Checklist">☑</button>
        <button className={styles.toolBtn} onClick={insertTodo} title="Todo">Todo</button>
        <button className={styles.toolBtn} onClick={() => applyMarkdown('> ', '', 'citation')} title="Citation">❝</button>
        <button className={styles.toolBtn} onClick={insertCodeBlock} title="Bloc code">&lt;/&gt;</button>
        <button className={styles.toolBtn} onClick={() => applyMarkdown('[texte](', ')', 'https://example.com')} title="Lien">Link</button>
        <button className={styles.toolBtn} onClick={insertTable} title="Tableau">Table</button>
        <button className={styles.toolBtn} onClick={insertSeparator} title="Séparateur">—</button>
        <button className={styles.toolBtn} onClick={insertImageFromUrl} title="Image depuis URL">Image</button>
      </div>

      {/* Zone d'édition */}
      <div className={styles.editorArea} ref={printRef}>
        {tab.mode === 'text' ? (
          <textarea
            ref={editorRef}
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
                ref={editorRef}
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
                  ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{tab.content}</ReactMarkdown>
                  : <span className={styles.emptyHint}>La prévisualisation apparaît ici…</span>
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>{tab.content.length} caractère{tab.content.length !== 1 ? 's' : ''}</span>
        <span>Mode : {tab.mode === 'markdown' ? 'Markdown' : 'Texte'} • Sauvegarde auto</span>
      </div>

      {/* Zone impression cachée hors écran */}
      <div className={styles.printArea}>
        <h1 className={styles.printTitle}>{tab.title || 'Sans titre'}</h1>
        <div className={styles.printMeta}>Créé le {createdDate}</div>
        {tab.mode === 'markdown'
          ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{tab.content}</ReactMarkdown>
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
