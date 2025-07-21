// Firestore service functions for SkyCloudData collection operations
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SkyCloudRecord, SkyCloudFormData } from '../types';

const COLLECTION_NAME = 'SkyCloudData';

// Function to add a new record to the database
export const addRecord = async (data: SkyCloudFormData, userId: string): Promise<string> => {
  try {
    const record = {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), record);
    return docRef.id;
  } catch (error) {
    console.error('Error adding record:', error);
    throw new Error('Failed to add record');
  }
};

// Function to fetch all records for a specific user
export const getUserRecords = async (userId: string): Promise<SkyCloudRecord[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const records: SkyCloudRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as SkyCloudRecord);
    });
    
    return records;
  } catch (error) {
    console.error('Error fetching records:', error);
    throw new Error('Failed to fetch records');
  }
};

// Function to update an existing record
export const updateRecord = async (id: string, data: Partial<SkyCloudFormData>): Promise<void> => {
  try {
    const recordRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(recordRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating record:', error);
    throw new Error('Failed to update record');
  }
};

// Function to delete a record
export const deleteRecord = async (id: string): Promise<void> => {
  try {
    const recordRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(recordRef);
  } catch (error) {
    console.error('Error deleting record:', error);
    throw new Error('Failed to delete record');
  }
};