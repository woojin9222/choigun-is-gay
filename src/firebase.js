import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, getDocs} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB4H6kVIjzyBrY0IPeEn-KIbczyxLxHXjQ",
    authDomain: "goguryeo-c1017.firebaseapp.com",
    projectId: "goguryeo-c1017",
    storageBucket: "goguryeo-c1017.appspot.com",
    messagingSenderId: "1077467215407",
    appId: "1:1077467215407:web:8e2167ff289b24bb7df8da",
    measurementId: "G-DMB0HSRP7D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const messagesCollection = collection(db, 'messages');

async function sendMessage(text, user) {
  try {
    await addDoc(messagesCollection, {
      text,
      user: user.displayName,
      userId: user.uid,
      timestamp: new Date(),
      status: 'unread'
    });
  } catch (error) {
    console.error("Error adding message: ", error);
  }
}

function subscribeToMessages(callback) {
  const q = query(messagesCollection, orderBy('timestamp', 'asc'));
  return onSnapshot(q, async (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);

    // 상태 업데이트
    const unreadMessages = snapshot.docs.filter(doc => doc.data().status === 'unread' && doc.data().userId !== auth.currentUser.uid);
    for (const message of unreadMessages) {
      await updateDoc(doc(db, 'messages', message.id), { status: 'read' });
    }
  });
}

async function updateMessageStatusInDB(id, newStatus) {
  try {
    await updateDoc(doc(db, 'messages', id), { status: newStatus });
  } catch (error) {
    console.error("Error updating message status: ", error);
  }
}

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
}

async function signOutFromGoogle() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  async function getUsers() {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersList = usersSnapshot.docs.map(doc => doc.data());
    return usersList;
  }

export { auth, db, sendMessage, subscribeToMessages, updateMessageStatusInDB, signInWithGoogle, signOutFromGoogle, getUsers };
