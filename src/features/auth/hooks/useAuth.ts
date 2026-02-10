import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from '@/lib/firebase';
import { mockAuthService } from '@/lib/mockAuth';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import { setUser, clearUser, setLoading } from '@/store/redux/slices/authSlice';
import { UserRole } from '@/lib/constants';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  // Keep a ref to the Firestore snapshot unsubscribe so we can clean it up
  // when the auth state changes (e.g. user signs out) or component unmounts.
  const unsubUserDataRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Use mock auth if Firebase is disabled
    if (!firebaseEnabled) {
      const unsubscribe = mockAuthService.onAuthStateChanged((mockUser) => {
        dispatch(setLoading(true));

        if (mockUser) {
          dispatch(
            setUser({
              uid: mockUser.uid,
              email: mockUser.email,
              displayName: mockUser.displayName,
              photoURL: mockUser.photoURL,
              phoneNumber: mockUser.phoneNumber,
              role: (mockUser.role as UserRole) || UserRole.USER,
              emailVerified: mockUser.emailVerified,
              createdAt: mockUser.createdAt instanceof Date ? mockUser.createdAt.toISOString() : String(mockUser.createdAt),
            })
          );
        } else {
          dispatch(clearUser());
        }
      });

      return () => unsubscribe();
    }

    // Use Firebase auth with real-time Firestore listener to solve race condition.
    // When createUser writes the profile doc milliseconds after auth creation,
    // onSnapshot fires immediately with the correct role instead of returning null.
    const unsubscribe = onAuthStateChanged(auth!, (firebaseUser) => {
      // Clean up any previous Firestore listener
      if (unsubUserDataRef.current) {
        unsubUserDataRef.current();
        unsubUserDataRef.current = null;
      }

      if (firebaseUser) {
        dispatch(setLoading(true));

        if (!db) {
          // Firestore not available — set basic user with default role
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              phoneNumber: firebaseUser.phoneNumber,
              role: UserRole.USER,
              emailVerified: firebaseUser.emailVerified,
            })
          );
          return;
        }

        // Start real-time listener on the user document.
        // This solves the race condition: if the doc doesn't exist yet,
        // onSnapshot waits and fires again the moment setDoc completes.
        const userRef = doc(db, 'users', firebaseUser.uid);
        const unsubUserData = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              dispatch(
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || userData.displayName,
                  photoURL: firebaseUser.photoURL || userData.photoURL,
                  phoneNumber: firebaseUser.phoneNumber || userData.phoneNumber,
                  role: (userData.role as UserRole) || UserRole.USER,
                  emailVerified: firebaseUser.emailVerified,
                  createdAt: userData.createdAt,
                })
              );
            } else {
              // Doc doesn't exist yet (middle of race condition)
              // Set temporary basic state — onSnapshot will fire again when doc is created
              dispatch(
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  phoneNumber: firebaseUser.phoneNumber,
                  role: UserRole.USER,
                  emailVerified: firebaseUser.emailVerified,
                })
              );
            }
          },
          (error) => {
            console.error('Error listening to user data:', error);
            // Fallback: set user with default role
            dispatch(
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                phoneNumber: firebaseUser.phoneNumber,
                role: UserRole.USER,
                emailVerified: firebaseUser.emailVerified,
              })
            );
          }
        );

        unsubUserDataRef.current = unsubUserData;
      } else {
        dispatch(clearUser());
      }
    });

    return () => {
      unsubscribe();
      if (unsubUserDataRef.current) {
        unsubUserDataRef.current();
        unsubUserDataRef.current = null;
      }
    };
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin: user?.role === UserRole.ADMIN,
    isOrganizer: user?.role === UserRole.ORGANIZER,
  };
}

export default useAuth;
