import { initializeApp } from "firebase/app";
import { collection, getDocs, doc, setDoc, query, where, updateDoc, GeoPoint, orderBy, limit, deleteDoc, onSnapshot, Timestamp, FirestoreError, startAfter, getDoc, documentId } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import axios from "axios";
import { PlayMyJamProfile } from "./Types";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyC_YPbgewHXM_GtGYyQTI8I4rFQCWOqtn8",
  authDomain: "municipality-b179d.firebaseapp.com",
  projectId: "municipality-b179d",
  storageBucket: "municipality-b179d.appspot.com",
  messagingSenderId: "952540645244",
  appId: "1:952540645244:web:129d4269d2e120d3b246f9"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true })
export const auth = getAuth(app);
export const storage = getStorage(app);

export const createData = async (tableName: string, docId: string, data: any): Promise<boolean> => {
  try {
    await setDoc(doc(db, tableName, docId), data);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const loginApi = async (phoneNumber: string, password: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber), where("password", "==", password), where("deleted", "==", false)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getDJSongsj = async (ownerId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music"), where("ownerId", "==", ownerId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const updateData = async (tableName: string, docId: string, obj: { field: string; value: any }): Promise<boolean> => {
  try {
    const docRef = doc(db, tableName, docId);
    await updateDoc(docRef, { [obj.field]: obj.value });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
export const getDJSongs = (ownerId:string,type:'ALL' | 'ACTIVE',cb:(...args:any) => void) => {
  try {
      let q = query(collection(db, "music"), where("ownerId", "==", ownerId));
      if(type === 'ACTIVE'){
        q = query(collection(db, "music"), where("ownerId", "==", ownerId), where("active", "==", true));
      }

      // Return the unsubscribe function so caller can clean up
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
      }, (error) => {
        console.error('Firebase onSnapshot error:', error);
        cb(error);
      });

      return unsubscribe;
  } catch (e) {
      console.error('getDJSongs error:', e);
      cb(e);
      return () => {}; // Return empty cleanup function on error
  }
}
export const getCurrentPlayingSongStatus = async (currentPlayingDocId:string,cb:(...args:any) => void) => {
  try {
      let q = query(collection(db, "currentPlayingSongs"), where("currentPlayingDocId", "==", currentPlayingDocId));
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
      });
  } catch (e) {
      cb(e);
  }
}
export const getUserListners = async (userId:string,cb:(...args:any) => void) => {
  try {
      let q = query(collection(db, "users"), where("userId", "==", userId));
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
      });
  } catch (e) {
      cb(e);
  }
}


export const getSecretKeys = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "secrets")));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const deleteData = async (tableName: string, docId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, tableName, docId));
    return true;
  } catch (e) {
    return false;
  }
};
export const updateTable = async (tableName: string, docId: string, obj:any): Promise<boolean> => {
  try {
    const docRef = doc(db, tableName, docId);
    await updateDoc(docRef, obj);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getUserDetailsByUserId = async (userId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("userId", "==", userId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getSongById = async (songId: string): Promise<any | null> => {
  try {
    const docRef = doc(db, 'music', songId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log(`No song found with ID: ${songId}`);
      return null;
    }
  } catch (e) {
    console.error('Error fetching song by ID:', e);
    return null;
  }
};

export const uploadMusic = async (file: string, path: string, mimeType:string): Promise<string> => {
  const storage = getStorage(app);
  const fileRef = ref(storage, path);
  const response = await fetch(file);
  const blob = await response.blob();
  const uploadTask = await uploadBytesResumable(fileRef, blob,{contentType:mimeType});
  const url = await getDownloadURL(uploadTask.ref);
  return url;
};

export const getMusicList = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music")));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getDjs = async (): Promise<PlayMyJamProfile[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("role", "==", 'dj'), where("djInfo.active", "==", true)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data as any;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getMusicByGenre = async (genre: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music"), where("genre", "==", genre)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};


export const getMusicBySearch = async (searchTerm: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music")));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data.filter(music =>
      music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (e) {
    console.error(e);
    return [];
  }
};


export const updateMusicPlayCount = async (musicId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "music", musicId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentPlayCount = docSnap.data().playCount || 0;
      await updateDoc(docRef, { playCount: currentPlayCount + 1 });
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getAudioFingerPrint = async (uri:string, type:string)=>{
  const apiUrl = 'https://play-server-913115376008.europe-west1.run.app/api/fingerprint';
  const name = uri.substr(uri.lastIndexOf('/') + 1);
  const formData = new FormData();
  formData.append('audio', {uri,type,name} as any);
  formData.append('type', type);
  try {
    const response = await axios({
      method: "post",
      url: apiUrl,
      data: formData,
      headers: {
          "Content-Type": "multipart/form-data"
      },
    });
    return response?.data;
  } catch(error) {
    console.log(error)
    return false;
  }
}
export const getMusicByFingerPrint = async (fingerprint: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "tracks"), where("fingerprint", "==", fingerprint)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getTopTracks = async (limitCount: number = 100): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "tracks"), orderBy("playCount", "desc"), limit(limitCount)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getTracksByGenre = async (genre: string, limitCount: number = 100): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "tracks"), where("genres", "array-contains", genre), orderBy("playCount", "desc"), limit(limitCount)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const searchTracks = async (searchTerm: string, limitCount: number = 100): Promise<any[]> => {
  try {
    // Firebase doesn't support text search directly, so we'll get all tracks and filter them
    const querySnapshot = await getDocs(query(collection(db, "tracks"), limit(limitCount)));
    const data = querySnapshot.docs.map((doc) => doc.data());

    // Filter tracks by title or artist
    return data.filter(track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (e) {
    console.error(e);
    return [];
  }
};