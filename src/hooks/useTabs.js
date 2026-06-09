import { useState, useEffect, useCallback, useRef } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'

const DEBOUNCE_MS = 800

export function useTabs(uid) {
  const [tabs, setTabs] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const saveTimers = useRef({})

  // Écoute temps réel des onglets
  useEffect(() => {
    if (!uid) return
    const q = query(
      collection(db, 'users', uid, 'tabs'),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setTabs(data)
      setLoading(false)
      // Active le premier onglet si aucun n'est sélectionné
      setActiveId((prev) => {
        if (prev && data.find((t) => t.id === prev)) return prev
        return data.length > 0 ? data[0].id : null
      })
    })
    return unsub
  }, [uid])

  // Créer un onglet
  const addTab = useCallback(async () => {
    const id = String(Date.now())
    const tab = {
      title: 'Nouvel onglet',
      content: '',
      mode: 'markdown',
      createdAt: Date.now(),
    }
    await setDoc(doc(db, 'users', uid, 'tabs', id), tab)
    setActiveId(id)
  }, [uid])

  // Supprimer un onglet
  const removeTab = useCallback(
    async (id) => {
      clearTimeout(saveTimers.current[id])
      await deleteDoc(doc(db, 'users', uid, 'tabs', id))
    },
    [uid]
  )

  // Mise à jour immédiate locale + sauvegarde Firestore avec debounce
  const updateTab = useCallback(
    (id, changes) => {
      setTabs((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...changes } : t))
      )
      clearTimeout(saveTimers.current[id])
      saveTimers.current[id] = setTimeout(() => {
        setDoc(doc(db, 'users', uid, 'tabs', id), changes, { merge: true })
      }, DEBOUNCE_MS)
    },
    [uid]
  )

  const activeTab = tabs.find((t) => t.id === activeId) || null

  return { tabs, activeTab, activeId, setActiveId, addTab, removeTab, updateTab, loading }
}
