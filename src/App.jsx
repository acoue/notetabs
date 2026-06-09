import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import Login from './components/Login'
import TabBar from './components/TabBar'
import NoteEditor from './components/NoteEditor'
import { useTabs } from './hooks/useTabs'
import styles from './App.module.css'

function AppShell({ user }) {
  const { tabs, activeTab, activeId, setActiveId, addTab, removeTab, updateTab, loading } = useTabs(user.uid)

  const handleLogout = () => signOut(auth)

  const handleClose = async (id) => {
    await removeTab(id)
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <TabBar
        tabs={tabs}
        activeId={activeId}
        onSelect={setActiveId}
        onAdd={addTab}
        onClose={handleClose}
      />

      <div className={styles.content}>
        {activeTab ? (
          <NoteEditor
            key={activeTab.id}
            tab={activeTab}
            onUpdate={updateTab}
            onDelete={handleClose}
            user={user}
            onLogout={handleLogout}
          />
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyInner}>
              <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="10" fill="#EEF2FF"/>
                <path d="M10 26V12h4l4 8 4-8h4v14h-3V17l-4 7h-2l-4-7v9h-3z" fill="#4F46E5"/>
              </svg>
              <p className={styles.emptyText}>Aucun onglet ouvert</p>
              <button className={styles.emptyBtn} onClick={addTab}>
                + Créer un premier onglet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u ?? null))
  }, [])

  if (user === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '3px solid #e5e7eb', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    )
  }

  if (!user) return <Login />

  return <AppShell user={user} />
}
