import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import styles from './Login.module.css'

export default function Login() {
  const handleLogin = () => signInWithPopup(auth, googleProvider)

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#4F46E5" />
            <path d="M10 26V12h4l4 8 4-8h4v14h-3V17l-4 7h-2l-4-7v9h-3z" fill="white" />
          </svg>
        </div>
        <h1 className={styles.title}>NoteTabs</h1>
        <p className={styles.sub}>Prise de notes en ligne, synchronisée partout.</p>
        <button className={styles.googleBtn} onClick={handleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z"/>
          </svg>
          Se connecter avec Google
        </button>
      </div>
    </div>
  )
}
