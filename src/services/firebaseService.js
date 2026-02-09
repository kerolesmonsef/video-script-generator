import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const COLLECTION_NAME = 'videoIdeas';


export const saveIdea = async (config = {}) => {

  const { collection: collectionName = COLLECTION_NAME, model = {} } = config;

  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...model,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    console.log(`Data saved successfully to ${collectionName} with ID:`, docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving data to Firestore:', error);
    throw new Error('فشل في حفظ البيانات: ' + error.message);
  }
};



export const getIdeas = async (config = {}) => {

  const { collection: collectionName = COLLECTION_NAME, maxResults = 20 } = config;

  try {
    const q = query(
      collection(db, collectionName),
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const ideas = [];

    querySnapshot.forEach((doc) => {
      ideas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`Loaded ${ideas.length} items from ${collectionName}`);
    return ideas;
  } catch (error) {
    console.error('Error getting data from Firestore:', error);
    throw new Error('فشل في تحميل البيانات: ' + error.message);
  }
};


export const deleteIdea = async (config = {}) => {

  const { collection: collectionName = COLLECTION_NAME, id: ideaId } = config;

  try {
    await deleteDoc(doc(db, collectionName, ideaId));
    console.log(`Document deleted successfully from ${collectionName}:`, ideaId);
  } catch (error) {
    console.error('Error deleting data from Firestore:', error);
    throw new Error('فشل في حذف البيانات: ' + error.message);
  }
};



export const setConfig = async (key, value) => {

  try {
    const configDocRef = doc(db, 'config', key);

    await setDoc(configDocRef, {
      value,
      updatedAt: serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    console.log(`Config saved successfully: ${key}`);
  } catch (error) {
    console.error('Error saving config to Firestore:', error);
    throw new Error('فشل في حفظ الإعدادات: ' + error.message);
  }
};


export const getConfig = async (key) => {

  try {
    const configDocRef = doc(db, 'config', key);
    const docSnap = await getDoc(configDocRef);

    if (docSnap.exists()) {
      const value = docSnap.data().value;
      console.log(`Config loaded: ${key} : value is ${value}`);
      return value;
    } else {
      console.log(`Config not found: ${key}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting config from Firestore:', error);
    throw new Error('فشل في تحميل الإعدادات: ' + error.message);
  }
};

