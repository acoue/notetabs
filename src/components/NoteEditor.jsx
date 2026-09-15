import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { marked } from 'marked'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import styles from './NoteEditor.module.css'

function RichNoteEditor({ tab, onUpdate }) {
  const initialContent = tab.mode === 'rich' ? tab.content : marked.parse(tab.content || '')
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: initialContent,
    onUpdate: ({ editor: currentEditor }) => {
      onUpdate(tab.id, { content: currentEditor.getHTML(), mode: 'rich' })
    },
  }, [tab.id])

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('URL du lien :', 'https://')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt('URL de l’image :', 'https://')
    if (url) editor.chain().focus().setImage({ src: url, alt: 'Image' }).run()
  }

  const button = (label, title, action, active = false) => (
    <button
      type="button"
      className={`${styles.toolBtn} ${active ? styles.toolActive : ''}`}
      onClick={action}
      title={title}
    >
      {label}
    </button>
  )

  return (
    <>
      <div className={styles.formatToolbar}>
        {button(<strong>B</strong>, 'Gras', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {button(<em>I</em>, 'Italique', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {button('H1', 'Titre 1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
        {button('H2', 'Titre 2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
        {button('H3', 'Titre 3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
        {button('• List', 'Liste', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {button('☑', 'Checklist', () => editor.chain().focus().toggleTaskList().run(), editor.isActive('taskList'))}
        {button('Todo', 'Todo', () => editor.chain().focus().toggleTaskList().run(), editor.isActive('taskList'))}
        {button('❝', 'Citation', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
        {button('</>', 'Bloc code', () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'))}
        {button('Link', 'Lien', addLink, editor.isActive('link'))}
        {button('Table', 'Tableau', () => editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run())}
        {button('—', 'Séparateur', () => editor.chain().focus().setHorizontalRule().run())}
        {button('Image', 'Image depuis URL', addImage)}
      </div>
      <div className={styles.richEditor}>
        <EditorContent editor={editor} />
      </div>
    </>
  )
}

export default function NoteEditor({ tab, onUpdate, onDelete, onLogout }) {
  const printRef = useRef()

  const handlePrint = () => {
    window.print()
  }

  const handleDeleteConfirm = () => {
    if (window.confirm(`Supprimer l'onglet "${tab.title || 'Sans titre'}" ?`)) {
      onDelete(tab.id)
    }
  }

  const createdAt = tab.createdAt ?? (Number(tab.id) || 0)
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
            className={`${styles.modeBtn} ${styles.modeActive}`}
            disabled
            title="Éditeur de texte riche"
          >
            Texte riche
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

      {/* Zone d'édition */}
      <div className={styles.editorArea} ref={printRef}>
        <RichNoteEditor key={tab.id} tab={tab} onUpdate={onUpdate} />
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>{tab.content.length} caractère{tab.content.length !== 1 ? 's' : ''}</span>
        <span>Mode : Texte riche • Sauvegarde auto</span>
      </div>

      {/* Zone impression cachée hors écran */}
      <div className={styles.printArea}>
        <h1 className={styles.printTitle}>{tab.title || 'Sans titre'}</h1>
        <div className={styles.printMeta}>Créé le {createdDate}</div>
        {tab.mode === 'rich'
          ? <div dangerouslySetInnerHTML={{ __html: tab.content }} />
          : <ReactMarkdown remarkPlugins={[remarkGfm]}>{tab.content}</ReactMarkdown>
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
