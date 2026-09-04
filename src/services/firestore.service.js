import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const firestoreService = {
  // --- Apiaries ---
  async getAllApiaries() {
    try {
      if (!db || !db.app) return [];
      const q = query(collection(db, 'apiaries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn('Firestore getAllApiaries warning:', error.message);
      return [];
    }
  },

  async createApiary(apiaryData) {
    try {
      const docRef = await addDoc(collection(db, 'apiaries'), {
        ...apiaryData,
        status: apiaryData.status || 'Active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...apiaryData };
    } catch (e) {
      return { id: `apiary_${Date.now()}`, ...apiaryData };
    }
  },

  async updateApiary(apiaryId, data) {
    try {
      const docRef = doc(db, 'apiaries', apiaryId);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    } catch (e) {
      console.warn('Firestore updateApiary warning:', e.message);
    }
  },

  // --- Hives ---
  async getAllHives() {
    try {
      if (!db || !db.app) return [];
      const q = query(collection(db, 'hives'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn('Firestore getAllHives warning:', error.message);
      return [];
    }
  },

  async createHive(hiveData) {
    try {
      const docRef = await addDoc(collection(db, 'hives'), {
        ...hiveData,
        status: hiveData.status || 'Healthy',
        healthScore: hiveData.healthScore || 95,
        varroaRisk: hiveData.varroaRisk || 'Low',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...hiveData };
    } catch (e) {
      return { id: `hive_${Date.now()}`, ...hiveData };
    }
  },

  // --- Telemetry ---
  async getTelemetryForHive(hiveId) {
    try {
      if (!db || !db.app) return null;
      const q = query(collection(db, 'telemetry'), where('hiveId', '==', hiveId), orderBy('timestamp', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // --- Harvests & Batches ---
  async getBatches() {
    try {
      if (!db || !db.app) return [];
      const q = query(collection(db, 'batches'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn('Firestore getBatches warning:', error.message);
      return [];
    }
  },

  async createBatch(batchData) {
    try {
      const docRef = await addDoc(collection(db, 'batches'), {
        ...batchData,
        status: batchData.status || 'HARVESTED',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...batchData };
    } catch (e) {
      return { id: `batch_${Date.now()}`, ...batchData };
    }
  },

  // --- Lab Tests & Quality Scores ---
  async getLabTests() {
    try {
      if (!db || !db.app) return [];
      const q = query(collection(db, 'lab_tests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      return [];
    }
  },

  async createLabTest(testData) {
    try {
      const docRef = await addDoc(collection(db, 'lab_tests'), {
        ...testData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...testData };
    } catch (e) {
      return { id: `lab_${Date.now()}`, ...testData };
    }
  },

  // --- Products & QR Codes ---
  async getProducts() {
    try {
      if (!db || !db.app) return [];
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      return [];
    }
  },

  async createProductWithQR(productData) {
    try {
      const qrId = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const fullProduct = {
        ...productData,
        qrId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'products'), fullProduct);
      return { id: docRef.id, ...fullProduct };
    } catch (e) {
      const qrId = `QR_${Date.now()}`;
      return { id: `prod_${Date.now()}`, qrId, ...productData };
    }
  },

  async resolveQRCode(qrId) {
    try {
      if (!db || !db.app) return null;
      const q = query(collection(db, 'products'), where('qrId', '==', qrId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // --- Organic Certifications ---
  async getCertifications() {
    try {
      if (!db || !db.app) return [];
      const q = query(collection(db, 'certifications'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      return [];
    }
  },

  async updateCertificationStatus(certId, status, reason = '') {
    try {
      const docRef = doc(db, 'certifications', certId);
      await updateDoc(docRef, { status, reason, updatedAt: serverTimestamp() });
    } catch (e) {
      console.warn('Firestore updateCertificationStatus warning:', e.message);
    }
  },

  // --- User Profiles & Management ---
  async getUsers() {
    try {
      if (!db || !db.app) return [];
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (e) {
      return [];
    }
  },

  async updateUserRole(uid, role) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { role, updatedAt: serverTimestamp() });
    } catch (e) {
      console.warn('Firestore updateUserRole warning:', e.message);
    }
  },

  async getUserProfile(uid) {
    try {
      if (!db || !db.app) return null;
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
};
