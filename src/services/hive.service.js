let mockHives = [
  {
    id: 'HV-UP-001',
    farmId: 'farm-001',
    beeSpecies: 'Apis mellifera',
    queenStatus: 'HEALTHY',
    installationDate: new Date().toISOString(),
    currentWeight: 45.2,
    temperature: 34.5,
    humidity: 60.1,
    healthStatus: 'GOOD',
    iotDeviceId: 'ESP32-001'
  }
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const hiveService = {
  getHivesByFarm: async (farmId) => {
    await delay(500);
    return mockHives.filter(h => h.farmId === farmId);
  },
  
  getHive: async (hiveId) => {
    await delay(300);
    const hive = mockHives.find(h => h.id === hiveId);
    if (!hive) throw new Error('Hive not found');
    return hive;
  },

  createHive: async (hiveData) => {
    await delay(800);
    const newHive = {
      ...hiveData,
      id: `HV-${Math.floor(Math.random()*10000)}`,
      installationDate: new Date().toISOString(),
      healthStatus: 'GOOD',
      currentWeight: 0,
      temperature: 0,
      humidity: 0
    };
    mockHives.push(newHive);
    return newHive;
  }
};
