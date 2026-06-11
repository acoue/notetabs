import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// 👉 Remplace ces valeurs par celles de ta console Firebase
// (Project settings > Your apps > Web app > firebaseConfig)
const firebaseConfig = {
  apiKey: "XX",
  authDomain: "notetabs-941bf.firebaseapp.com",
  projectId: "notetabs-941bf",
  storageBucket: "notetabs-941bf.firebasestorage.app",
  messagingSenderId: "785673262827",
  appId: "1:785673262827:web:30891fdbb78f10cffc90ae"

}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
