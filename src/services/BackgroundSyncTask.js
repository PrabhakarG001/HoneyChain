import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { getUnsyncedData, markDataAsSynced } from './DatabaseService';

const BACKGROUND_SYNC_TASK = 'BACKGROUND_SYNC_TASK';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const unsyncedData = await getUnsyncedData();
    if (unsyncedData.length === 0) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Make real API call to FastAPI backend
    // Assumes an endpoint /telemetry/bulk exists for bulk syncing offline data
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api'}/telemetry/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unsyncedData),
    });

    if (response.ok) {
      const ids = unsyncedData.map((row) => row.id);
      await markDataAsSynced(ids);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  } catch (error) {
    console.error('Background sync failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundSync = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
    console.log('Background sync registered');
  } catch (err) {
    console.error('Task Register failed:', err);
  }
};
