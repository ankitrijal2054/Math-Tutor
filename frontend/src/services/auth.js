import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update user profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Create user profile in Firestore
 */
export const createUserProfile = async (uid, data) => {
  try {
    const userRef = doc(db, "users", uid);
    const profileData = {
      uid,
      email: data.email,
      displayName: data.displayName || "",
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      ...data,
    };

    await setDoc(userRef, profileData);
    return profileData;
  } catch (error) {
    throw new Error(error.message);
  }
};
