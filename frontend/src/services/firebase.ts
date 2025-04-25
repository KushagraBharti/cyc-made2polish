// src/services/firebase.ts
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// Function for logging in a user using email/password
export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Function for signing out a user
export async function logout() {
  return signOut(auth);
}
