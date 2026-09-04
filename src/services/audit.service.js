import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const auditService = {
  async logAction({ user, action, entity, entityId, previousValue = null, newValue = null, status = 'SUCCESS' }) {
    try {
      const logEntry = {
        uid: user?.uid || 'anonymous',
        userEmail: user?.email || '',
        userRole: user?.role || 'BEEKEEPER',
        action,
        entity,
        entityId,
        previousValue,
        newValue,
        status,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      };

      if (db && db.app) {
        await addDoc(collection(db, 'audit_logs'), logEntry);
      }
      return logEntry;
    } catch (e) {
      console.warn('Audit logging warning (non-fatal):', e.message);
      return null;
    }
  }
};
