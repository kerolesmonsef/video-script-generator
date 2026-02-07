import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, isConfigured } from '../config/firebaseConfig';

const COLLECTION_NAME = 'videoIdeas';

/**
 * Save data to Firebase Firestore
 * @param {Object} config - Configuration object
 * @param {string} config.collection - Collection name to save to
 * @param {Object} config.model - Data model to save
 * @returns {Promise<string|null>} Document ID or null
 */
export const saveIdea = async (config = {}) => {
  if (!isConfigured || !db) {
    console.warn('⚠️ Firebase not configured - data not saved');
    return null;
  }

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


/**
 * Get data from Firebase Firestore
 * @param {Object} config - Configuration object
 * @param {string} config.collection - Collection name to fetch from
 * @param {number} config.maxResults - Maximum number of results to return
 * @returns {Promise<Array>} Array of documents
 */
export const getIdeas = async (config = {}) => {
  if (!isConfigured || !db) {
    console.warn('⚠️ Firebase not configured - returning empty history');
    return [];
  }

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

/**
 * Delete data from Firebase Firestore
 * @param {Object} config - Configuration object
 * @param {string} config.collection - Collection name to delete from
 * @param {string} config.id - Document ID to delete
 * @returns {Promise<void>}
 */
export const deleteIdea = async (config = {}) => {
  if (!isConfigured || !db) {
    console.warn('⚠️ Firebase not configured - cannot delete');
    return;
  }

  const { collection: collectionName = COLLECTION_NAME, id: ideaId } = config;

  try {
    await deleteDoc(doc(db, collectionName, ideaId));
    console.log(`Document deleted successfully from ${collectionName}:`, ideaId);
  } catch (error) {
    console.error('Error deleting data from Firestore:', error);
    throw new Error('فشل في حذف البيانات: ' + error.message);
  }
};

