// Firebase Service - Handles all Firestore operations
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
 * Save a new video idea with its generated scripts to Firestore
 * @param {string} idea - The video idea text
 * @param {number} numberOfScripts - Number of scripts generated
 * @param {Array} scripts - Array of generated script objects
 * @param {string} model - The AI model used
 * @returns {Promise<string>} - Document ID of the saved idea
 */
export const saveIdea = async (idea, numberOfScripts, scripts, model) => {
  if (!isConfigured || !db) {
    console.warn('⚠️ Firebase not configured - scripts not saved');
    return null;
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      idea,
      numberOfScripts,
      scripts,
      model,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    console.log('Idea saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving idea to Firestore:', error);
    throw new Error('فشل في حفظ الفكرة: ' + error.message);
  }
};

/**
 * Get all saved video ideas from Firestore
 * @param {number} maxResults - Maximum number of results to fetch (default: 20)
 * @returns {Promise<Array>} - Array of idea objects with their IDs
 */
export const getIdeas = async (maxResults = 20) => {
  if (!isConfigured || !db) {
    console.warn('⚠️ Firebase not configured - returning empty history');
    return [];
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
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

    console.log(`Loaded ${ideas.length} ideas from Firestore`);
    return ideas;
  } catch (error) {
    console.error('Error getting ideas from Firestore:', error);
    throw new Error('فشل في تحميل الأفكار: ' + error.message);
  }
};

/**
 * Delete a video idea from Firestore
 * @param {string} ideaId - The document ID to delete
 * @returns {Promise<void>}
 */
export const deleteIdea = async (ideaId) => {
  if (!isConfigured || !db) {
    console.warn('⚠️ Firebase not configured - cannot delete');
    return;
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, ideaId));
    console.log('Idea deleted successfully:', ideaId);
  } catch (error) {
    console.error('Error deleting idea from Firestore:', error);
    throw new Error('فشل في حذف الفكرة: ' + error.message);
  }
};

